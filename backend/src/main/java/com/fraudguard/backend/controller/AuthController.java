package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.auth.AuthResponse;
import com.fraudguard.backend.dto.auth.ForgotPasswordRequest;
import com.fraudguard.backend.dto.auth.LoginRequest;
import com.fraudguard.backend.dto.auth.MessageResponse;
import com.fraudguard.backend.dto.auth.RegisterRequest;
import com.fraudguard.backend.dto.auth.ResetPasswordRequest;
import com.fraudguard.backend.service.AuthService;
import com.fraudguard.backend.service.LoginRateLimitService;
import com.fraudguard.backend.service.PasswordResetService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final LoginRateLimitService loginRateLimitService;
    private final PasswordResetService passwordResetService;

    public AuthController(
            AuthService authService,
            LoginRateLimitService loginRateLimitService,
            PasswordResetService passwordResetService) {

        this.authService = authService;
        this.loginRateLimitService = loginRateLimitService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        String clientIdentifier = resolveClientIdentifier(httpRequest);

        boolean attemptAllowed = loginRateLimitService.allowAttempt(
                clientIdentifier);

        if (!attemptAllowed) {

            long retryAfterSeconds = loginRateLimitService
                    .getRetryAfterSeconds(
                            clientIdentifier);

            long retryAfterMinutes = Math.max(
                    1,
                    (long) Math.ceil(
                            retryAfterSeconds / 60.0));

            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many login attempts. "
                            + "Try again in approximately "
                            + retryAfterMinutes
                            + " minute(s).");
        }

        AuthResponse response = authService.login(request);

        /*
         * Successful login clears the IP rate-limit history.
         */
        loginRateLimitService.reset(
                clientIdentifier);

        return ResponseEntity.ok(response);
    }

    /*
     * FORGOT PASSWORD
     *
     * Always return the same message whether the email
     * exists or not. This prevents account enumeration.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordResetService.requestPasswordReset(
                request.getEmail());

        return ResponseEntity.ok(
                new MessageResponse(
                        "If an account exists for that email, "
                                + "a password reset link has been sent."));
    }

    /*
     * RESET PASSWORD
     *
     * The reset token comes from the secure email link.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password and confirmation "
                            + "password do not match.");
        }

        passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword());

        return ResponseEntity.ok(
                new MessageResponse(
                        "Password reset successfully. "
                                + "You can now sign in "
                                + "with your new password."));
    }

    private String resolveClientIdentifier(
            HttpServletRequest request) {

        String forwardedFor = request.getHeader(
                "X-Forwarded-For");

        if (forwardedFor != null
                && !forwardedFor.isBlank()) {

            return forwardedFor
                    .split(",")[0]
                    .trim();
        }

        String realIp = request.getHeader(
                "X-Real-IP");

        if (realIp != null
                && !realIp.isBlank()) {

            return realIp.trim();
        }

        return request.getRemoteAddr();
    }
}