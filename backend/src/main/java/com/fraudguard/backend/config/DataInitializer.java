package com.fraudguard.backend.config;

import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.Role;
import com.fraudguard.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner createDefaultAdmin(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,

            @Value("${DEFAULT_ADMIN_EMAIL:admin@fraudguard.ai}") String adminEmail,

            @Value("${DEFAULT_ADMIN_PASSWORD}") String adminPassword) {
        return args -> {
            String normalizedEmail = adminEmail
                    .trim()
                    .toLowerCase();

            if (!appUserRepository.existsByEmail(normalizedEmail)) {
                AppUser admin = new AppUser(
                        "FraudGuard Administrator",
                        normalizedEmail,
                        passwordEncoder.encode(adminPassword),
                        Role.ADMIN);

                appUserRepository.save(admin);

                System.out.println(
                        "Default administrator created: " + normalizedEmail);
            } else {
                System.out.println(
                        "Default administrator already exists: "
                                + normalizedEmail);
            }
        };
    }
}