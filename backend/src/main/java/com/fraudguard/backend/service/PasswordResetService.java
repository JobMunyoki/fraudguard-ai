package com.fraudguard.backend.service;

import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.PasswordResetToken;
import com.fraudguard.backend.repository.AppUserRepository;
import com.fraudguard.backend.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
public class PasswordResetService {

    private static final int TOKEN_BYTES = 32;
    private static final long TOKEN_EXPIRATION_MINUTES = 30;
    private static final long REQUEST_COOLDOWN_MINUTES = 2;

    private static final String DEMO_ANALYST_EMAIL = "analyst.demo@fraudguard.ai";

    private final AppUserRepository appUserRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailNotificationService emailNotificationService;
    private final AuditLogService auditLogService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public PasswordResetService(
            AppUserRepository appUserRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailNotificationService emailNotificationService,
            AuditLogService auditLogService) {

        this.appUserRepository = appUserRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailNotificationService = emailNotificationService;
        this.auditLogService = auditLogService;
    }

    /*
     * This method must always produce the same public response
     * through the controller, whether the email exists or not.
     */
    @Transactional
    public void requestPasswordReset(String email) {
        if (!StringUtils.hasText(email)) {
            return;
        }

        String normalizedEmail = email.trim().toLowerCase();

        Optional<AppUser> optionalUser = appUserRepository.findByEmail(
                normalizedEmail);

        /*
         * Do not reveal whether the email exists.
         */
        if (optionalUser.isEmpty()) {
            return;
        }

        AppUser user = optionalUser.get();

        /*
         * Disabled accounts should not receive reset links.
         * The public Demo Analyst password must not be changed.
         */
        if (!user.isActive()
                || DEMO_ANALYST_EMAIL.equals(
                        normalizedEmail)) {

            return;
        }

        /*
         * Prevent repeated reset emails within two minutes.
         */
        Optional<PasswordResetToken> mostRecentToken = tokenRepository
                .findTopByUserOrderByCreatedAtDesc(
                        user);

        if (mostRecentToken.isPresent()
                && mostRecentToken.get().getCreatedAt() != null
                && mostRecentToken.get()
                        .getCreatedAt()
                        .isAfter(
                                LocalDateTime.now()
                                        .minusMinutes(
                                                REQUEST_COOLDOWN_MINUTES))) {

            return;
        }

        /*
         * Invalidate previous unused reset links.
         */
        invalidateUnusedTokens(user);

        String rawToken = generateSecureToken();
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken(
                tokenHash,
                user,
                LocalDateTime.now()
                        .plusMinutes(
                                TOKEN_EXPIRATION_MINUTES));

        PasswordResetToken savedToken = tokenRepository.save(resetToken);

        String resetLink = buildResetLink(rawToken);

        boolean emailSent = emailNotificationService
                .sendPasswordResetEmail(
                        user.getEmail(),
                        user.getFullName(),
                        resetLink);

        /*
         * Do not leave a valid token in the database
         * when the email could not be delivered.
         */
        if (!emailSent) {
            tokenRepository.delete(savedToken);
        }
    }

    @Transactional
    public void resetPassword(
            String rawToken,
            String newPassword) {

        validateResetInput(rawToken, newPassword);

        String tokenHash = hashToken(rawToken.trim());

        PasswordResetToken resetToken = tokenRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(
                        this::invalidResetToken);

        if (resetToken.isUsed()
                || resetToken.isExpired()) {

            throw invalidResetToken();
        }

        AppUser user = resetToken.getUser();

        /*
         * Protect the public demo account even if a token
         * somehow exists for it.
         */
        if (DEMO_ANALYST_EMAIL.equals(
                user.getEmail().toLowerCase())) {

            throw invalidResetToken();
        }

        if (!user.isActive()) {
            throw invalidResetToken();
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must be different "
                            + "from the current password.");
        }

        user.setPassword(
                passwordEncoder.encode(newPassword));

        /*
         * A successful password reset also clears
         * failed-login attempts and account lockout.
         */
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);

        appUserRepository.save(user);

        /*
         * Invalidate the used token and every other
         * outstanding reset link for this user.
         */
        List<PasswordResetToken> unusedTokens = tokenRepository
                .findAllByUserAndUsedAtIsNull(
                        user);

        for (PasswordResetToken token : unusedTokens) {
            token.markAsUsed();
        }

        tokenRepository.saveAll(unusedTokens);

        auditLogService.createLog(
                "PASSWORD_RESET",
                user.getEmail(),
                user.getEmail(),
                "User completed a secure password reset.");
    }

    private void validateResetInput(
            String rawToken,
            String newPassword) {

        if (!StringUtils.hasText(rawToken)) {
            throw invalidResetToken();
        }

        if (!StringUtils.hasText(newPassword)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password is required.");
        }

        if (newPassword.length() < 8) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must contain "
                            + "at least 8 characters.");
        }

        if (newPassword.length() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password is too long.");
        }
    }

    private String generateSecureToken() {
        byte[] randomBytes = new byte[TOKEN_BYTES];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance(
                    "SHA-256");

            byte[] hash = digest.digest(
                    rawToken.getBytes(
                            StandardCharsets.UTF_8));

            return HexFormat.of()
                    .formatHex(hash);

        } catch (NoSuchAlgorithmException error) {
            throw new IllegalStateException(
                    "SHA-256 is not available.",
                    error);
        }
    }

    private void invalidateUnusedTokens(
            AppUser user) {

        List<PasswordResetToken> unusedTokens = tokenRepository
                .findAllByUserAndUsedAtIsNull(
                        user);

        for (PasswordResetToken token : unusedTokens) {
            token.markAsUsed();
        }

        tokenRepository.saveAll(unusedTokens);
    }

    private String buildResetLink(
            String rawToken) {

        String baseUrl = resolveFrontendBaseUrl();

        String encodedToken = URLEncoder.encode(
                rawToken,
                StandardCharsets.UTF_8);

        return baseUrl
                + "/reset-password?token="
                + encodedToken;
    }

    /*
     * FRONTEND_URL currently contains localhost and
     * the deployed Vercel URL separated by a comma.
     *
     * In production, select the HTTPS address.
     * Locally, use the first configured address.
     */
    private String resolveFrontendBaseUrl() {
        String selectedUrl = Arrays.stream(
                frontendUrl.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .filter(url -> url.startsWith("https://"))
                .findFirst()
                .orElseGet(() -> Arrays.stream(
                        frontendUrl.split(","))
                        .map(String::trim)
                        .filter(
                                StringUtils::hasText)
                        .findFirst()
                        .orElse(
                                "http://localhost:5173"));

        return selectedUrl.replaceAll(
                "/+$",
                "");
    }

    private ResponseStatusException invalidResetToken() {

        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Reset link is invalid, expired, "
                        + "or has already been used.");
    }
}