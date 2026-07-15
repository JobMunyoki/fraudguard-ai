package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.user.AppUserResponse;
import com.fraudguard.backend.dto.user.UpdateUserRoleRequest;
import com.fraudguard.backend.service.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping
    public ResponseEntity<List<AppUserResponse>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @GetMapping("/analysts")
    public ResponseEntity<List<AppUserResponse>> getFraudAnalysts() {
        return ResponseEntity.ok(userManagementService.getFraudAnalysts());
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<AppUserResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(userManagementService.updateUserRole(userId, request));
    }
}