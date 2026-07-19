package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.profile.ChangePasswordRequest;
import com.fraudguard.backend.dto.profile.ProfileResponse;
import com.fraudguard.backend.dto.profile.UpdateProfileRequest;
import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public ProfileService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            AuditLogService auditLogService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    public ProfileResponse getCurrentProfile() {
        AppUser currentUser = getCurrentUser();
        return new ProfileResponse(currentUser);
    }

    public ProfileResponse updateProfile(UpdateProfileRequest request) {
        AppUser currentUser = getCurrentUser();

        String oldName = currentUser.getFullName();

        if (request.getFullName() == null
                || request.getFullName().trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Full name is required.");
        }

        currentUser.setFullName(request.getFullName().trim());

        AppUser savedUser = appUserRepository.save(currentUser);

        auditLogService.createLog(
                "PROFILE_UPDATED",
                savedUser.getEmail(),
                savedUser.getEmail(),
                "User profile name changed from "
                        + oldName
                        + " to "
                        + savedUser.getFullName());

        return new ProfileResponse(savedUser);
    }

    public void changePassword(ChangePasswordRequest request) {
        AppUser currentUser = getCurrentUser();

        boolean currentPasswordMatches = passwordEncoder.matches(
                request.getCurrentPassword(),
                currentUser.getPassword());

        if (!currentPasswordMatches) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password and confirmation password do not match.");
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                currentUser.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must be different from the current password.");
        }

        currentUser.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        appUserRepository.save(currentUser);

        auditLogService.createLog(
                "PASSWORD_CHANGED",
                currentUser.getEmail(),
                currentUser.getEmail(),
                "User " + currentUser.getEmail() + " changed their password");
    }

    private AppUser getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return appUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Current user not found."));
    }
}
