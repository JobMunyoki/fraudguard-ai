package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.user.AppUserResponse;
import com.fraudguard.backend.dto.user.UpdateUserRoleRequest;
import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.Role;
import com.fraudguard.backend.repository.AppUserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserManagementService {

    private final AppUserRepository appUserRepository;
    private final AuditLogService auditLogService;

    public UserManagementService(
            AppUserRepository appUserRepository,
            AuditLogService auditLogService) {
        this.appUserRepository = appUserRepository;
        this.auditLogService = auditLogService;
    }

    public List<AppUserResponse> getAllUsers() {
        return appUserRepository.findAll()
                .stream()
                .map(AppUserResponse::new)
                .toList();
    }

    public AppUserResponse updateUserRole(Long userId, UpdateUserRoleRequest request) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Role oldRole = user.getRole();
        Role newRole = request.getRole();

        user.setRole(newRole);

        AppUser savedUser = appUserRepository.save(user);

        String performedBy = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        auditLogService.createLog(
                "USER_ROLE_UPDATED",
                savedUser.getEmail(),
                performedBy,
                "User " + savedUser.getEmail()
                        + " role changed from "
                        + oldRole
                        + " to "
                        + newRole);

        return new AppUserResponse(savedUser);
    }
}