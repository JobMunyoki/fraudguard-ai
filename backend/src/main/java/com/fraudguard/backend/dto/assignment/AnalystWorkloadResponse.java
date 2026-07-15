package com.fraudguard.backend.dto.assignment;

public class AnalystWorkloadResponse {

    private Long userId;
    private String fullName;
    private String email;

    private long totalAssignedCases;
    private long pendingCases;
    private long underReviewCases;
    private long confirmedFraudCases;
    private long falsePositiveCases;
    private long resolvedCases;
    private long highRiskCases;

    public AnalystWorkloadResponse() {
    }

    public AnalystWorkloadResponse(
            Long userId,
            String fullName,
            String email,
            long totalAssignedCases,
            long pendingCases,
            long underReviewCases,
            long confirmedFraudCases,
            long falsePositiveCases,
            long resolvedCases,
            long highRiskCases) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.totalAssignedCases = totalAssignedCases;
        this.pendingCases = pendingCases;
        this.underReviewCases = underReviewCases;
        this.confirmedFraudCases = confirmedFraudCases;
        this.falsePositiveCases = falsePositiveCases;
        this.resolvedCases = resolvedCases;
        this.highRiskCases = highRiskCases;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public long getTotalAssignedCases() {
        return totalAssignedCases;
    }

    public long getPendingCases() {
        return pendingCases;
    }

    public long getUnderReviewCases() {
        return underReviewCases;
    }

    public long getConfirmedFraudCases() {
        return confirmedFraudCases;
    }

    public long getFalsePositiveCases() {
        return falsePositiveCases;
    }

    public long getResolvedCases() {
        return resolvedCases;
    }

    public long getHighRiskCases() {
        return highRiskCases;
    }
}