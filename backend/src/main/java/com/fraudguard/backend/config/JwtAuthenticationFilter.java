package com.fraudguard.backend.config;

import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.repository.AppUserRepository;
import com.fraudguard.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AppUserRepository appUserRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            AppUserRepository appUserRepository) {
        this.jwtService = jwtService;
        this.appUserRepository = appUserRepository;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return path.startsWith("/api/auth/")
                || path.equals("/api/health")
                || path.equals("/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtService.extractEmail(token);

            if (email == null || email.isBlank()) {
                SecurityContextHolder.clearContext();

                writeJsonError(
                        response,
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "TOKEN_INVALID",
                        "Your session is invalid. Please sign in again.");
                return;
            }

            AppUser user = appUserRepository.findByEmail(email)
                    .orElse(null);

            if (user == null) {
                SecurityContextHolder.clearContext();

                writeJsonError(
                        response,
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "USER_NOT_FOUND",
                        "This user account no longer exists.");
                return;
            }

            if (!user.isActive()) {
                SecurityContextHolder.clearContext();

                writeJsonError(
                        response,
                        HttpServletResponse.SC_FORBIDDEN,
                        "ACCOUNT_DISABLED",
                        "Your account has been disabled. Contact an administrator.");
                return;
            }

            if (!jwtService.isTokenValid(token, user)) {
                SecurityContextHolder.clearContext();

                writeJsonError(
                        response,
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "TOKEN_INVALID",
                        "Your session has expired or is invalid. Please sign in again.");
                return;
            }

            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                List<SimpleGrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority(
                                "ROLE_" + user.getRole().name()));

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        authorities);

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (Exception exception) {
            SecurityContextHolder.clearContext();

            writeJsonError(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "TOKEN_INVALID",
                    "Your session has expired or is invalid. Please sign in again.");
        }
    }

    private void writeJsonError(
            HttpServletResponse response,
            int status,
            String code,
            String message) throws IOException {

        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write(
                "{"
                        + "\"code\":\"" + code + "\","
                        + "\"message\":\"" + message + "\""
                        + "}");
    }
}