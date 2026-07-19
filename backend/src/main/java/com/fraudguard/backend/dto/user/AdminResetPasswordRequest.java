package com.fraudguard.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminResetPasswordRequest {

    @NotBlank(message = "New password is required.")
    @Size(min = 8, message = "New password must contain at least 8 characters.")
    private String newPassword;

    @NotBlank(message = "Password confirmation is required.")
    private String confirmPassword;

    public AdminResetPasswordRequest() {
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
