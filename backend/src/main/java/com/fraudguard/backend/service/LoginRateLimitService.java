package com.fraudguard.backend.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginRateLimitService {

    private static final int MAX_ATTEMPTS = 20;
    private static final Duration RATE_LIMIT_WINDOW = Duration.ofMinutes(10);

    private final ConcurrentHashMap<String, AttemptWindow> attemptsByClient = new ConcurrentHashMap<>();

    public boolean allowAttempt(String clientIdentifier) {
        Instant now = Instant.now();

        AttemptWindow currentWindow = attemptsByClient.compute(
                clientIdentifier,
                (key, existingWindow) -> {

                    if (existingWindow == null
                            || now.isAfter(
                                    existingWindow.startedAt()
                                            .plus(RATE_LIMIT_WINDOW))) {

                        return new AttemptWindow(1, now);
                    }

                    return new AttemptWindow(
                            existingWindow.attemptCount() + 1,
                            existingWindow.startedAt());
                });

        return currentWindow.attemptCount() <= MAX_ATTEMPTS;
    }

    public long getRetryAfterSeconds(String clientIdentifier) {
        AttemptWindow currentWindow = attemptsByClient.get(clientIdentifier);

        if (currentWindow == null) {
            return 0;
        }

        Instant allowedAgainAt = currentWindow.startedAt()
                .plus(RATE_LIMIT_WINDOW);

        long remainingSeconds = Duration.between(
                Instant.now(),
                allowedAgainAt).getSeconds();

        return Math.max(remainingSeconds, 0);
    }

    public void reset(String clientIdentifier) {
        attemptsByClient.remove(clientIdentifier);
    }

    private record AttemptWindow(
            int attemptCount,
            Instant startedAt) {
    }
}