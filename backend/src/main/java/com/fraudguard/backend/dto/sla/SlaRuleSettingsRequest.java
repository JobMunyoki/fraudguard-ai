package com.fraudguard.backend.dto.sla;

public class SlaRuleSettingsRequest {

    private Integer criticalRiskThreshold;
    private Integer highRiskThreshold;
    private Integer mediumRiskThreshold;

    private Integer criticalRiskSlaHours;
    private Integer highRiskSlaHours;
    private Integer mediumRiskSlaHours;
    private Integer lowRiskSlaHours;

    public Integer getCriticalRiskThreshold() {
        return criticalRiskThreshold;
    }

    public void setCriticalRiskThreshold(Integer criticalRiskThreshold) {
        this.criticalRiskThreshold = criticalRiskThreshold;
    }

    public Integer getHighRiskThreshold() {
        return highRiskThreshold;
    }

    public void setHighRiskThreshold(Integer highRiskThreshold) {
        this.highRiskThreshold = highRiskThreshold;
    }

    public Integer getMediumRiskThreshold() {
        return mediumRiskThreshold;
    }

    public void setMediumRiskThreshold(Integer mediumRiskThreshold) {
        this.mediumRiskThreshold = mediumRiskThreshold;
    }

    public Integer getCriticalRiskSlaHours() {
        return criticalRiskSlaHours;
    }

    public void setCriticalRiskSlaHours(Integer criticalRiskSlaHours) {
        this.criticalRiskSlaHours = criticalRiskSlaHours;
    }

    public Integer getHighRiskSlaHours() {
        return highRiskSlaHours;
    }

    public void setHighRiskSlaHours(Integer highRiskSlaHours) {
        this.highRiskSlaHours = highRiskSlaHours;
    }

    public Integer getMediumRiskSlaHours() {
        return mediumRiskSlaHours;
    }

    public void setMediumRiskSlaHours(Integer mediumRiskSlaHours) {
        this.mediumRiskSlaHours = mediumRiskSlaHours;
    }

    public Integer getLowRiskSlaHours() {
        return lowRiskSlaHours;
    }

    public void setLowRiskSlaHours(Integer lowRiskSlaHours) {
        this.lowRiskSlaHours = lowRiskSlaHours;
    }
}