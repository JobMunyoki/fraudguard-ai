package com.fraudguard.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // Public endpoints
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/api/health").permitAll()

                                                // VIEWER, FRAUD_ANALYST, and ADMIN can view dashboard/reports
                                                .requestMatchers("/api/dashboard/**").hasAnyRole(
                                                                "ADMIN",
                                                                "FRAUD_ANALYST",
                                                                "VIEWER")
                                                .requestMatchers("/api/reports/**").hasAnyRole(
                                                                "ADMIN",
                                                                "FRAUD_ANALYST",
                                                                "VIEWER")

                                                // Only ADMIN and FRAUD_ANALYST can manage transactions/fraud alerts
                                                .requestMatchers("/api/transactions/**").hasAnyRole(
                                                                "ADMIN",
                                                                "FRAUD_ANALYST")
                                                .requestMatchers("/api/fraud-alerts/**").hasAnyRole(
                                                                "ADMIN",
                                                                "FRAUD_ANALYST")

                                                // Audit logs are admin-only
                                                .requestMatchers("/api/audit-logs/**").hasRole("ADMIN")

                                                .requestMatchers("/api/users/**").hasRole("ADMIN")

                                                .requestMatchers("/api/analyst-workload**").hasRole("ADMIN")

                                                .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                                                "/api/transactions/*/escalate")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/profile/**").authenticated()

                                                // Any other request requires login
                                                .anyRequest().authenticated())
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of("http://localhost:5173"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);

                return source;
        }
}