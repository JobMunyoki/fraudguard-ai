package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.assignment.AssignAnalystRequest;
import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.service.FraudCaseAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class FraudCaseAssignmentController {

    private final FraudCaseAssignmentService fraudCaseAssignmentService;

    public FraudCaseAssignmentController(FraudCaseAssignmentService fraudCaseAssignmentService) {
        this.fraudCaseAssignmentService = fraudCaseAssignmentService;
    }

    @GetMapping("/assigned-to-me")
    public ResponseEntity<List<BankTransaction>> getMyAssignedCases() {
        return ResponseEntity.ok(
                fraudCaseAssignmentService.getMyAssignedCases());
    }

    @PutMapping("/{transactionId}/assign-analyst")
    public ResponseEntity<BankTransaction> assignAnalyst(
            @PathVariable Long transactionId,
            @RequestBody AssignAnalystRequest request) {
        return ResponseEntity.ok(
                fraudCaseAssignmentService.assignAnalyst(transactionId, request));
    }
}