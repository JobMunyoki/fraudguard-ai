package com.fraudguard.backend.dto.assignment;

public class EscalateCaseRequest {

    private String escalationReason;

    public EscalateCaseRequest() {
    }

    public String getEscalationReason() {
        return escalationReason;
    }

    public void setEscalationReason(String escalationReason) {
        this.escalationReason = escalationReason;
    }
}