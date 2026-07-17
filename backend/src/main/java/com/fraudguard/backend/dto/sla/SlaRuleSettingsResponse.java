package com.fraudguard.backend.dto.sla;

import com.fraudguard.backend.entity.SlaRuleSettings;

import java.time.LocalDateTime;

public class SlaRuleSettingsResponse {

    private Long id;

    private Integer criticalRiskThreshold;
    private Integer highRiskThreshold;
    private Integer mediumRiskThreshold;

    private Integer criticalRiskSlaHours;
    private Integer highRiskSlaHours;
    private Integer mediumRiskSlaHours;
    private Integer lowRiskSlaHours;

    private String updatedBy;
    private LocalDateTime updatedAt;

    public SlaRuleSettingsResponse(SlaRuleSettings settings) {
        this.id = settings.getId();

        this.criticalRiskThreshold = settings.getCriticalRiskThreshold();
        this.highRiskThreshold = settings.getHighRiskThreshold();
        this.mediumRiskThreshold = settings.getMediumRiskThreshold();

        this.criticalRiskSlaHours = settings.getCriticalRiskSlaHours();
        this.highRiskSlaHours = settings.getHighRiskSlaHours();
        this.mediumRiskSlaHours = settings.getMediumRiskSlaHours();
        this.lowRiskSlaHours = settings.getLowRiskSlaHours();

        this.updatedBy = settings.getUpdatedBy();
        this.updatedAt = settings.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public Integer getCriticalRiskThreshold() {
        return criticalRiskThreshold;
    }

    public Integer getHighRiskThreshold() {
        return highRiskThreshold;
    }

    public Integer getMediumRiskThreshold() {
        return mediumRiskThreshold;
    }

    public Integer getCriticalRiskSlaHours() {
        return criticalRiskSlaHours;
    }

    public Integer getHighRiskSlaHours() {
        return highRiskSlaHours;
    }

    public Integer getMediumRiskSlaHours() {
        return mediumRiskSlaHours;
    }

    public Integer getLowRiskSlaHours() {
        return lowRiskSlaHours;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}