package com.fraudguard.backend.dto;

import java.math.BigDecimal;

public class DashboardStatsResponse {

    private long totalTransactions;
    private long normalTransactions;
    private long suspiciousTransactions;
    private long fraudTransactions;
    private long pendingReviews;
    private long underReviewCases;
    private long confirmedFraudCases;
    private BigDecimal totalFlaggedAmount;
    private double averageRiskScore;
    private double highRiskPercentage;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(
            long totalTransactions,
            long normalTransactions,
            long suspiciousTransactions,
            long fraudTransactions,
            long pendingReviews,
            long underReviewCases,
            long confirmedFraudCases,
            BigDecimal totalFlaggedAmount,
            double averageRiskScore,
            double highRiskPercentage) {
        this.totalTransactions = totalTransactions;
        this.normalTransactions = normalTransactions;
        this.suspiciousTransactions = suspiciousTransactions;
        this.fraudTransactions = fraudTransactions;
        this.pendingReviews = pendingReviews;
        this.underReviewCases = underReviewCases;
        this.confirmedFraudCases = confirmedFraudCases;
        this.totalFlaggedAmount = totalFlaggedAmount;
        this.averageRiskScore = averageRiskScore;
        this.highRiskPercentage = highRiskPercentage;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getNormalTransactions() {
        return normalTransactions;
    }

    public void setNormalTransactions(long normalTransactions) {
        this.normalTransactions = normalTransactions;
    }

    public long getSuspiciousTransactions() {
        return suspiciousTransactions;
    }

    public void setSuspiciousTransactions(long suspiciousTransactions) {
        this.suspiciousTransactions = suspiciousTransactions;
    }

    public long getFraudTransactions() {
        return fraudTransactions;
    }

    public void setFraudTransactions(long fraudTransactions) {
        this.fraudTransactions = fraudTransactions;
    }

    public long getPendingReviews() {
        return pendingReviews;
    }

    public void setPendingReviews(long pendingReviews) {
        this.pendingReviews = pendingReviews;
    }

    public long getUnderReviewCases() {
        return underReviewCases;
    }

    public void setUnderReviewCases(long underReviewCases) {
        this.underReviewCases = underReviewCases;
    }

    public long getConfirmedFraudCases() {
        return confirmedFraudCases;
    }

    public void setConfirmedFraudCases(long confirmedFraudCases) {
        this.confirmedFraudCases = confirmedFraudCases;
    }

    public BigDecimal getTotalFlaggedAmount() {
        return totalFlaggedAmount;
    }

    public void setTotalFlaggedAmount(BigDecimal totalFlaggedAmount) {
        this.totalFlaggedAmount = totalFlaggedAmount;
    }

    public double getAverageRiskScore() {
        return averageRiskScore;
    }

    public void setAverageRiskScore(double averageRiskScore) {
        this.averageRiskScore = averageRiskScore;
    }

    public double getHighRiskPercentage() {
        return highRiskPercentage;
    }

    public void setHighRiskPercentage(double highRiskPercentage) {
        this.highRiskPercentage = highRiskPercentage;
    }
}