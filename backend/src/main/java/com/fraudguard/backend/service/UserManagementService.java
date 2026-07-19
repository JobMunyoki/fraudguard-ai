package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.user.AdminResetPasswordRequest;
import com.fraudguard.backend.dto.user.AppUserResponse;
import com.fraudguard.backend.dto.user.CreateUserRequest;
import com.fraudguard.backend.dto.user.UpdateUserRoleRequest;
import com.fraudguard.backend.dto.user.UpdateUserStatusRequest;
import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.Role;
import com.fraudguard.backend.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserManagementService {

        private final AppUserRepository appUserRepository;
        private final AuditLogService auditLogService;
        private final PasswordEncoder passwordEncoder;

        public UserManagementService(
                        AppUserRepository appUserRepository,
                        AuditLogService auditLogService,
                        PasswordEncoder passwordEncoder) {
                this.appUserRepository = appUserRepository;
                this.auditLogService = auditLogService;
                this.passwordEncoder = passwordEncoder;
        }

        public List<AppUserResponse> getAllUsers() {
                return appUserRepository.findAll()
                                .stream()
                                .map(AppUserResponse::new)
                                .toList();
        }

        public List<AppUserResponse> getFraudAnalysts() {
                return appUserRepository.findByRole(Role.FRAUD_ANALYST)
                                .stream()
                                .map(AppUserResponse::new)
                                .toList();
        }

        public AppUserResponse createUser(CreateUserRequest request) {
                String normalizedEmail = request.getEmail()
                                .trim()
                                .toLowerCase();

                if (appUserRepository.existsByEmail(normalizedEmail)) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "A user with this email address already exists.");
                }

                AppUser user = new AppUser(
                                request.getFullName().trim(),
                                normalizedEmail,
                                passwordEncoder.encode(request.getPassword()),
                                request.getRole());

                AppUser savedUser = appUserRepository.save(user);

                String performedBy = getAuthenticatedEmail();

                auditLogService.createLog(
                                "USER_CREATED",
                                savedUser.getEmail(),
                                performedBy,
                                "Created user "
                                                + savedUser.getEmail()
                                                + " with role "
                                                + savedUser.getRole());

                return new AppUserResponse(savedUser);
        }

        public AppUserResponse updateUserRole(
                        Long userId,
                        UpdateUserRoleRequest request) {
                AppUser user = findUser(userId);

                Role oldRole = user.getRole();
                Role newRole = request.getRole();

                user.setRole(newRole);

                AppUser savedUser = appUserRepository.save(user);
                String performedBy = getAuthenticatedEmail();

                auditLogService.createLog(
                                "USER_ROLE_UPDATED",
                                savedUser.getEmail(),
                                performedBy,
                                "User "
                                                + savedUser.getEmail()
                                                + " role changed from "
                                                + oldRole
                                                + " to "
                                                + newRole);

                return new AppUserResponse(savedUser);
        }

        public AppUserResponse updateUserStatus(
                        Long userId,
                        UpdateUserStatusRequest request) {
                AppUser user = findUser(userId);
                boolean newStatus = Boolean.TRUE.equals(request.getActive());
                String performedBy = getAuthenticatedEmail();

                if (user.getEmail().equalsIgnoreCase(performedBy) && !newStatus) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "You cannot disable your own administrator account.");
                }

                boolean oldStatus = user.isActive();
                user.setActive(newStatus);

                AppUser savedUser = appUserRepository.save(user);

                String action = newStatus
                                ? "USER_REACTIVATED"
                                : "USER_DISABLED";

                auditLogService.createLog(
                                action,
                                savedUser.getEmail(),
                                performedBy,
                                "User "
                                                + savedUser.getEmail()
                                                + " status changed from "
                                                + (oldStatus ? "ACTIVE" : "DISABLED")
                                                + " to "
                                                + (newStatus ? "ACTIVE" : "DISABLED"));

                return new AppUserResponse(savedUser);
        }

        public void resetUserPassword(
                        Long userId,
                        AdminResetPasswordRequest request) {
                AppUser user = findUser(userId);
                String performedBy = getAuthenticatedEmail();

                if (user.getEmail().equalsIgnoreCase(performedBy)) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Use the Profile page to change your own password.");
                }

                if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "New password and confirmation password do not match.");
                }

                if (passwordEncoder.matches(
                                request.getNewPassword(),
                                user.getPassword())) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "The new password must be different from the current password.");
                }

                user.setPassword(
                                passwordEncoder.encode(request.getNewPassword()));

                appUserRepository.save(user);

                auditLogService.createLog(
                                "USER_PASSWORD_RESET",
                                user.getEmail(),
                                performedBy,
                                "Administrator "
                                                + performedBy
                                                + " reset the password for "
                                                + user.getEmail());
        }

        private AppUser findUser(Long userId) {
                return appUserRepository.findById(userId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "User not found."));
        }

        private String getAuthenticatedEmail() {
                return SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();
        }
}
