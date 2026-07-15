package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.dashboard.SlaMonitoringSummaryResponse;
import com.fraudguard.backend.service.SlaMonitoringService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SlaMonitoringController {

    private final SlaMonitoringService slaMonitoringService;

    public SlaMonitoringController(SlaMonitoringService slaMonitoringService) {
        this.slaMonitoringService = slaMonitoringService;
    }

    @GetMapping("/api/dashboard/sla-summary")
    public SlaMonitoringSummaryResponse getSlaMonitoringSummary() {
        return slaMonitoringService.getSlaMonitoringSummary();
    }
}