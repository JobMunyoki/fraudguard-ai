package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.auth.AuthResponse;
import com.fraudguard.backend.dto.auth.LoginRequest;
import com.fraudguard.backend.dto.auth.RegisterRequest;
import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.Role;
import com.fraudguard.backend.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class AuthService {

        private static final int MAX_FAILED_ATTEMPTS = 5;
        private static final long LOCK_DURATION_MINUTES = 15;

        private static final String DEMO_ANALYST_EMAIL = "analyst.demo@fraudguard.ai";

        private final AppUserRepository appUserRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;

        public AuthService(
                        AppUserRepository appUserRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {

                this.appUserRepository = appUserRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
        }

        public AuthResponse register(RegisterRequest request) {
                String email = request.getEmail()
                                .trim()
                                .toLowerCase();

                if (appUserRepository.existsByEmail(email)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Email is already registered.");
                }

                Role role = request.getRole() != null
                                ? request.getRole()
                                : Role.VIEWER;

                AppUser user = new AppUser(
                                request.getFullName().trim(),
                                email,
                                passwordEncoder.encode(request.getPassword()),
                                role);

                AppUser savedUser = appUserRepository.save(user);
                String token = jwtService.generateToken(savedUser);

                return new AuthResponse(
                                token,
                                savedUser.getFullName(),
                                savedUser.getEmail(),
                                savedUser.getRole());
        }

        public AuthResponse login(LoginRequest request) {
                String email = request.getEmail()
                                .trim()
                                .toLowerCase();

                AppUser user = appUserRepository.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED,
                                                "Invalid email or password."));

                boolean demoAccount = DEMO_ANALYST_EMAIL.equals(email);

                if (!user.isActive()) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "This account has been disabled. Contact an administrator.");
                }

                /*
                 * The public Demo Analyst account is exempt from account lockout.
                 * This prevents one visitor from locking the demo account for everyone.
                 */
                if (!demoAccount && user.isAccountLocked()) {
                        throw new ResponseStatusException(
                                        HttpStatus.LOCKED,
                                        "Account temporarily locked after too many failed login attempts. "
                                                        + "Try again in 15 minutes.");
                }

                /*
                 * Clear an expired lock before checking the password.
                 */
                if (!demoAccount
                                && user.getLockedUntil() != null
                                && !user.isAccountLocked()) {

                        user.setFailedLoginAttempts(0);
                        user.setLockedUntil(null);
                        appUserRepository.save(user);
                }

                boolean passwordMatches = passwordEncoder.matches(
                                request.getPassword(),
                                user.getPassword());

                if (!passwordMatches) {
                        if (!demoAccount) {
                                recordFailedLogin(user);
                        }

                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid email or password.");
                }

                /*
                 * Successful login clears previous failed attempts.
                 */
                if (user.getFailedLoginAttempts() > 0
                                || user.getLockedUntil() != null) {

                        user.setFailedLoginAttempts(0);
                        user.setLockedUntil(null);
                        appUserRepository.save(user);
                }

                String token = jwtService.generateToken(user);

                return new AuthResponse(
                                token,
                                user.getFullName(),
                                user.getEmail(),
                                user.getRole());
        }

        private void recordFailedLogin(AppUser user) {
                int newFailedAttempts = user.getFailedLoginAttempts() + 1;

                user.setFailedLoginAttempts(newFailedAttempts);

                if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
                        user.setLockedUntil(
                                        LocalDateTime.now()
                                                        .plusMinutes(LOCK_DURATION_MINUTES));

                        appUserRepository.save(user);

                        throw new ResponseStatusException(
                                        HttpStatus.LOCKED,
                                        "Account temporarily locked after too many failed login attempts. "
                                                        + "Try again in 15 minutes.");
                }

                appUserRepository.save(user);
        }
}