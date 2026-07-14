package com.fraudguard.backend.dto.auth;

import com.fraudguard.backend.entity.Role;

public class AuthResponse {

    private String token;
    private String fullName;
    private String email;
    private Role role;

    public AuthResponse() {
    }

    public AuthResponse(String token, String fullName, String email, Role role) {
        this.token = token;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
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
}