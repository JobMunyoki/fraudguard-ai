package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.assignment.AnalystWorkloadResponse;
import com.fraudguard.backend.service.AnalystWorkloadService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analyst-workload")
public class AnalystWorkloadController {

    private final AnalystWorkloadService analystWorkloadService;

    public AnalystWorkloadController(AnalystWorkloadService analystWorkloadService) {
        this.analystWorkloadService = analystWorkloadService;
    }

    @GetMapping
    public List<AnalystWorkloadResponse> getAnalystWorkload() {
        return analystWorkloadService.getAnalystWorkload();
    }
}