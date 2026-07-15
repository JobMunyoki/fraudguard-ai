package com.fraudguard.backend.dto.profile;

public class UpdateProfileRequest {

    private String fullName;

    public UpdateProfileRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}