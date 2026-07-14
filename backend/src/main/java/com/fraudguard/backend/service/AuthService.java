package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.auth.AuthResponse;
import com.fraudguard.backend.dto.auth.LoginRequest;
import com.fraudguard.backend.dto.auth.RegisterRequest;
import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.Role;
import com.fraudguard.backend.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

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
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.VIEWER;

        AppUser user = new AppUser(
                request.getFullName(),
                request.getEmail(),
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
        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password.");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole());
    }
}