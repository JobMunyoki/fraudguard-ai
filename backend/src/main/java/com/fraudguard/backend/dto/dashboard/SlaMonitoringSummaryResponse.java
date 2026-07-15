package com.fraudguard.backend.dto.dashboard;

public class SlaMonitoringSummaryResponse {

    private long overdueCases;
    private long escalatedCases;
    private long casesDueToday;
    private long highRiskOpenCases;
    private long openCases;
    private long totalAssignedCases;

    public SlaMonitoringSummaryResponse() {
    }

    public SlaMonitoringSummaryResponse(
            long overdueCases,
            long escalatedCases,
            long casesDueToday,
            long highRiskOpenCases,
            long openCases,
            long totalAssignedCases) {
        this.overdueCases = overdueCases;
        this.escalatedCases = escalatedCases;
        this.casesDueToday = casesDueToday;
        this.highRiskOpenCases = highRiskOpenCases;
        this.openCases = openCases;
        this.totalAssignedCases = totalAssignedCases;
    }

    public long getOverdueCases() {
        return overdueCases;
    }

    public long getEscalatedCases() {
        return escalatedCases;
    }

    public long getCasesDueToday() {
        return casesDueToday;
    }

    public long getHighRiskOpenCases() {
        return highRiskOpenCases;
    }

    public long getOpenCases() {
        return openCases;
    }

    public long getTotalAssignedCases() {
        return totalAssignedCases;
    }
}