package com.fraudguard.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;

@Entity
public class SlaRuleSettings {

    @Id
    private Long id = 1L;

    private Integer criticalRiskThreshold = 90;
    private Integer highRiskThreshold = 70;
    private Integer mediumRiskThreshold = 40;

    private Integer criticalRiskSlaHours = 4;
    private Integer highRiskSlaHours = 12;
    private Integer mediumRiskSlaHours = 24;
    private Integer lowRiskSlaHours = 48;

    private String updatedBy;
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

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

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}