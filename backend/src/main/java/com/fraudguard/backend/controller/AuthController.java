package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.auth.AuthResponse;
import com.fraudguard.backend.dto.auth.LoginRequest;
import com.fraudguard.backend.dto.auth.RegisterRequest;
import com.fraudguard.backend.service.AuthService;
import com.fraudguard.backend.service.LoginRateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final LoginRateLimitService loginRateLimitService;

    public AuthController(
            AuthService authService,
            LoginRateLimitService loginRateLimitService) {

        this.authService = authService;
        this.loginRateLimitService = loginRateLimitService;
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

        boolean attemptAllowed = loginRateLimitService.allowAttempt(clientIdentifier);

        if (!attemptAllowed) {
            long retryAfterSeconds = loginRateLimitService.getRetryAfterSeconds(
                    clientIdentifier);

            long retryAfterMinutes = Math.max(
                    1,
                    (long) Math.ceil(
                            retryAfterSeconds / 60.0));

            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many login attempts. Try again in approximately "
                            + retryAfterMinutes
                            + " minute(s).");
        }

        AuthResponse response = authService.login(request);

        /*
         * A successful login clears the rate-limit history
         * for this visitor.
         */
        loginRateLimitService.reset(clientIdentifier);

        return ResponseEntity.ok(response);
    }

    private String resolveClientIdentifier(
            HttpServletRequest request) {

        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null
                && !forwardedFor.isBlank()) {

            /*
             * X-Forwarded-For may contain several addresses:
             * client, proxy1, proxy2.
             * The first address normally represents the visitor.
             */
            return forwardedFor
                    .split(",")[0]
                    .trim();
        }

        String realIp = request.getHeader("X-Real-IP");

        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }

        return request.getRemoteAddr();
    }
}