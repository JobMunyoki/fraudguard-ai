package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.sla.SlaRuleSettingsRequest;
import com.fraudguard.backend.dto.sla.SlaRuleSettingsResponse;
import com.fraudguard.backend.service.SlaRuleSettingsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SlaRuleSettingsController {

    private final SlaRuleSettingsService slaRuleSettingsService;

    public SlaRuleSettingsController(SlaRuleSettingsService slaRuleSettingsService) {
        this.slaRuleSettingsService = slaRuleSettingsService;
    }

    @GetMapping("/api/sla-settings")
    public SlaRuleSettingsResponse getSettings() {
        return slaRuleSettingsService.getSettings();
    }

    @PutMapping("/api/sla-settings")
    public SlaRuleSettingsResponse updateSettings(
            @RequestBody SlaRuleSettingsRequest request,
            Authentication authentication) {
        String updatedBy = authentication != null ? authentication.getName() : "System";

        return slaRuleSettingsService.updateSettings(request, updatedBy);
    }
}