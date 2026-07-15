package com.fraudguard.backend.dto.user;

import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.Role;

import java.time.LocalDateTime;

public class AppUserResponse {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private LocalDateTime createdAt;

    public AppUserResponse() {
    }

    public AppUserResponse(AppUser user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}