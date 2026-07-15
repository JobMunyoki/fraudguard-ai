package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.assignment.EscalateCaseRequest;
import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.repository.BankTransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class FraudCaseEscalationService {

    private final BankTransactionRepository bankTransactionRepository;
    private final AuditLogService auditLogService;

    public FraudCaseEscalationService(
            BankTransactionRepository bankTransactionRepository,
            AuditLogService auditLogService) {
        this.bankTransactionRepository = bankTransactionRepository;
        this.auditLogService = auditLogService;
    }

    public BankTransaction escalateCase(
            Long transactionId,
            EscalateCaseRequest request,
            String escalatedBy) {
        BankTransaction transaction = bankTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"));

        if (request.getEscalationReason() == null || request.getEscalationReason().trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Escalation reason is required");
        }

        transaction.setEscalated(true);
        transaction.setEscalationReason(request.getEscalationReason());
        transaction.setEscalatedAt(LocalDateTime.now());
        transaction.setEscalatedBy(escalatedBy);

        BankTransaction savedTransaction = bankTransactionRepository.save(transaction);

        auditLogService.createLog(
                "CASE_ESCALATED",
                savedTransaction.getTransactionReference(),
                escalatedBy,
                "Transaction " + savedTransaction.getTransactionReference()
                        + " escalated by " + escalatedBy
                        + ". Reason: " + request.getEscalationReason());

        return savedTransaction;
    }
}