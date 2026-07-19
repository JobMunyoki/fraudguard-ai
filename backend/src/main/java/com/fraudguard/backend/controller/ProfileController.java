package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.profile.ChangePasswordRequest;
import com.fraudguard.backend.dto.profile.ProfileResponse;
import com.fraudguard.backend.dto.profile.UpdateProfileRequest;
import com.fraudguard.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getCurrentProfile() {
        return ResponseEntity.ok(profileService.getCurrentProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateProfile(
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(request);

        return ResponseEntity.ok(
                Map.of("message", "Password changed successfully."));
    }
}
