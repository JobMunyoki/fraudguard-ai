package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.user.AdminResetPasswordRequest;
import com.fraudguard.backend.dto.user.AppUserResponse;
import com.fraudguard.backend.dto.user.CreateUserRequest;
import com.fraudguard.backend.dto.user.UpdateUserRoleRequest;
import com.fraudguard.backend.dto.user.UpdateUserStatusRequest;
import com.fraudguard.backend.service.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(
            UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping
    public ResponseEntity<List<AppUserResponse>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @GetMapping("/analysts")
    public ResponseEntity<List<AppUserResponse>> getFraudAnalysts() {
        return ResponseEntity.ok(
                userManagementService.getFraudAnalysts());
    }

    @PostMapping
    public ResponseEntity<AppUserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        AppUserResponse createdUser = userManagementService.createUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdUser);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<AppUserResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(
                userManagementService.updateUserRole(userId, request));
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<AppUserResponse> updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        return ResponseEntity.ok(
                userManagementService.updateUserStatus(userId, request));
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<Map<String, String>> resetUserPassword(
            @PathVariable Long userId,
            @Valid @RequestBody AdminResetPasswordRequest request) {
        userManagementService.resetUserPassword(userId, request);

        return ResponseEntity.ok(
                Map.of("message", "User password reset successfully."));
    }
}
