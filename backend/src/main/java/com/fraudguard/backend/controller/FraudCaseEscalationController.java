package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.assignment.EscalateCaseRequest;
import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.service.FraudCaseEscalationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class FraudCaseEscalationController {

    private final FraudCaseEscalationService fraudCaseEscalationService;

    public FraudCaseEscalationController(FraudCaseEscalationService fraudCaseEscalationService) {
        this.fraudCaseEscalationService = fraudCaseEscalationService;
    }

    @PutMapping("/{transactionId}/escalate")
    public BankTransaction escalateCase(
            @PathVariable Long transactionId,
            @RequestBody EscalateCaseRequest request,
            Authentication authentication) {
        return fraudCaseEscalationService.escalateCase(
                transactionId,
                request,
                authentication.getName());
    }
}