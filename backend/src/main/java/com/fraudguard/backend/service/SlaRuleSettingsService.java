package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.sla.SlaRuleSettingsRequest;
import com.fraudguard.backend.dto.sla.SlaRuleSettingsResponse;
import com.fraudguard.backend.entity.SlaRuleSettings;
import com.fraudguard.backend.repository.SlaRuleSettingsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SlaRuleSettingsService {

    private final SlaRuleSettingsRepository slaRuleSettingsRepository;

    public SlaRuleSettingsService(SlaRuleSettingsRepository slaRuleSettingsRepository) {
        this.slaRuleSettingsRepository = slaRuleSettingsRepository;
    }

    public SlaRuleSettingsResponse getSettings() {
        return new SlaRuleSettingsResponse(getOrCreateSettings());
    }

    public SlaRuleSettingsResponse updateSettings(
            SlaRuleSettingsRequest request,
            String updatedBy) {
        SlaRuleSettings settings = getOrCreateSettings();

        validateSettings(request);

        settings.setCriticalRiskThreshold(request.getCriticalRiskThreshold());
        settings.setHighRiskThreshold(request.getHighRiskThreshold());
        settings.setMediumRiskThreshold(request.getMediumRiskThreshold());

        settings.setCriticalRiskSlaHours(request.getCriticalRiskSlaHours());
        settings.setHighRiskSlaHours(request.getHighRiskSlaHours());
        settings.setMediumRiskSlaHours(request.getMediumRiskSlaHours());
        settings.setLowRiskSlaHours(request.getLowRiskSlaHours());

        settings.setUpdatedBy(updatedBy);

        SlaRuleSettings savedSettings = slaRuleSettingsRepository.save(settings);

        return new SlaRuleSettingsResponse(savedSettings);
    }

    public LocalDateTime calculateSlaDueAt(LocalDateTime assignedAt, Number riskScoreValue) {
        SlaRuleSettings settings = getOrCreateSettings();

        double riskScore = riskScoreValue == null ? 0 : riskScoreValue.doubleValue();

        int slaHours;

        if (riskScore >= settings.getCriticalRiskThreshold()) {
            slaHours = settings.getCriticalRiskSlaHours();
        } else if (riskScore >= settings.getHighRiskThreshold()) {
            slaHours = settings.getHighRiskSlaHours();
        } else if (riskScore >= settings.getMediumRiskThreshold()) {
            slaHours = settings.getMediumRiskSlaHours();
        } else {
            slaHours = settings.getLowRiskSlaHours();
        }

        return assignedAt.plusHours(slaHours);
    }

    private SlaRuleSettings getOrCreateSettings() {
        return slaRuleSettingsRepository.findById(1L)
                .orElseGet(() -> slaRuleSettingsRepository.save(new SlaRuleSettings()));
    }

    private void validateSettings(SlaRuleSettingsRequest request) {
        if (request.getCriticalRiskThreshold() == null ||
                request.getHighRiskThreshold() == null ||
                request.getMediumRiskThreshold() == null ||
                request.getCriticalRiskSlaHours() == null ||
                request.getHighRiskSlaHours() == null ||
                request.getMediumRiskSlaHours() == null ||
                request.getLowRiskSlaHours() == null) {
            throw new IllegalArgumentException("All SLA settings are required.");
        }

        if (request.getCriticalRiskThreshold() <= request.getHighRiskThreshold() ||
                request.getHighRiskThreshold() <= request.getMediumRiskThreshold()) {
            throw new IllegalArgumentException(
                    "Thresholds must follow this order: critical > high > medium.");
        }

        if (request.getCriticalRiskSlaHours() <= 0 ||
                request.getHighRiskSlaHours() <= 0 ||
                request.getMediumRiskSlaHours() <= 0 ||
                request.getLowRiskSlaHours() <= 0) {
            throw new IllegalArgumentException("SLA hours must be greater than zero.");
        }
    }
}