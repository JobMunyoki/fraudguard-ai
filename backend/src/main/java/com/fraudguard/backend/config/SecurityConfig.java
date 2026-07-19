package com.fraudguard.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

import org.springframework.beans.factory.annotation.Value;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable())

                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(
                                                                SessionCreationPolicy.STATELESS))

                                .exceptionHandling(exceptions -> exceptions

                                                .authenticationEntryPoint(
                                                                (request, response, exception) -> {
                                                                        response.setStatus(401);
                                                                        response.setContentType(
                                                                                        "application/json");
                                                                        response.setCharacterEncoding("UTF-8");

                                                                        response.getWriter().write(
                                                                                        "{"
                                                                                                        + "\"code\":\"AUTHENTICATION_REQUIRED\","
                                                                                                        + "\"message\":\"Authentication is required.\""
                                                                                                        + "}");
                                                                })

                                                .accessDeniedHandler(
                                                                (request, response, exception) -> {
                                                                        response.setStatus(403);
                                                                        response.setContentType(
                                                                                        "application/json");
                                                                        response.setCharacterEncoding("UTF-8");

                                                                        response.getWriter().write(
                                                                                        "{"
                                                                                                        + "\"code\":\"ACCESS_DENIED\","
                                                                                                        + "\"message\":\"You do not have permission to perform this action.\""
                                                                                                        + "}");
                                                                }))

                                .authorizeHttpRequests(auth -> auth

                                                .requestMatchers(
                                                                "/",
                                                                "/api/health",
                                                                "/api/auth/**")
                                                .permitAll()

                                                .requestMatchers(
                                                                "/api/dashboard/sla-summary",
                                                                "/api/dashboard/sla-cases")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "FRAUD_ANALYST")

                                                .requestMatchers("/api/dashboard/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "FRAUD_ANALYST",
                                                                "VIEWER")

                                                .requestMatchers("/api/users/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/audit-logs/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/analyst-workload/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/transactions/*/escalate")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/transactions/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "FRAUD_ANALYST")

                                                .requestMatchers("/api/profile/**")
                                                .authenticated()

                                                .requestMatchers("/api/sla-settings/**")
                                                .hasRole("ADMIN")

                                                .anyRequest()
                                                .authenticated())

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

                configuration.setAllowedOrigins(
                                Arrays.stream(frontendUrl.split(","))
                                                .map(String::trim)
                                                .filter(origin -> !origin.isBlank())
                                                .toList());

                configuration.setAllowedMethods(
                                List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "DELETE",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of(
                                                "Authorization",
                                                "Content-Type"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }

        @Value("${app.frontend.url:http://localhost:5173}")
        private String frontendUrl;
}