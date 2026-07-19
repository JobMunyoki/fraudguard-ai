package com.fraudguard.backend.config;

import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.Role;
import com.fraudguard.backend.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner createDefaultUsers(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            createUserIfMissing(
                    appUserRepository,
                    passwordEncoder,
                    "FraudGuard Administrator",
                    "admin@fraudguard.ai",
                    "admin123",
                    Role.ADMIN);

            createUserIfMissing(
                    appUserRepository,
                    passwordEncoder,
                    "Fraud Analyst",
                    "analyst@fraudguard.ai",
                    "analyst123",
                    Role.FRAUD_ANALYST);

            createUserIfMissing(
                    appUserRepository,
                    passwordEncoder,
                    "System Viewer",
                    "viewer@fraudguard.ai",
                    "viewer123",
                    Role.VIEWER);
        };
    }

    private void createUserIfMissing(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            String fullName,
            String email,
            String rawPassword,
            Role role) {
        if (!appUserRepository.existsByEmail(email)) {
            AppUser user = new AppUser(
                    fullName,
                    email,
                    passwordEncoder.encode(rawPassword),
                    role);

            appUserRepository.save(user);

            System.out.println("Default user created: " + email);
        } else {
            System.out.println("Default user already exists: " + email);
        }
    }
}