package com.fraudguard.backend.dto.user;

import com.fraudguard.backend.entity.Role;

public class UpdateUserRoleRequest {

    private Role role;

    public UpdateUserRoleRequest() {
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}