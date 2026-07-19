package com.fraudguard.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "application", "FraudGuard AI Backend",
                "status", "UP",
                "health", "/api/health");
    }
}