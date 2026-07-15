package com.fraudguard.backend.dto.assignment;

public class RecommendedAnalystResponse {

    private Long userId;
    private String fullName;
    private String email;
    private long activeCases;
    private long totalAssignedCases;
    private long highRiskCases;
    private String recommendationReason;

    public RecommendedAnalystResponse() {
    }

    public RecommendedAnalystResponse(
            Long userId,
            String fullName,
            String email,
            long activeCases,
            long totalAssignedCases,
            long highRiskCases,
            String recommendationReason) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.activeCases = activeCases;
        this.totalAssignedCases = totalAssignedCases;
        this.highRiskCases = highRiskCases;
        this.recommendationReason = recommendationReason;
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

    public long getActiveCases() {
        return activeCases;
    }

    public long getTotalAssignedCases() {
        return totalAssignedCases;
    }

    public long getHighRiskCases() {
        return highRiskCases;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }
}