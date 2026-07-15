package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.assignment.AssignAnalystRequest;
import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.entity.Role;
import com.fraudguard.backend.repository.AppUserRepository;
import com.fraudguard.backend.repository.BankTransactionRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

@Service
public class FraudCaseAssignmentService {

    private final BankTransactionRepository bankTransactionRepository;
    private final AppUserRepository appUserRepository;
    private final AuditLogService auditLogService;

    public FraudCaseAssignmentService(
            BankTransactionRepository bankTransactionRepository,
            AppUserRepository appUserRepository,
            AuditLogService auditLogService) {
        this.bankTransactionRepository = bankTransactionRepository;
        this.appUserRepository = appUserRepository;
        this.auditLogService = auditLogService;
    }

    public List<BankTransaction> getMyAssignedCases() {
        String currentUserEmail = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return bankTransactionRepository
                .findByAssignedAnalystEmailOrderByAssignedAtDesc(currentUserEmail);
    }

    public BankTransaction assignAnalyst(Long transactionId, AssignAnalystRequest request) {
        if (request.getAnalystEmail() == null || request.getAnalystEmail().trim().isEmpty()) {
            throw new RuntimeException("Analyst email is required.");
        }

        BankTransaction transaction = bankTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found."));

        AppUser analyst = appUserRepository.findByEmail(request.getAnalystEmail())
                .orElseThrow(() -> new RuntimeException("Analyst user not found."));

        if (analyst.getRole() != Role.FRAUD_ANALYST) {
            throw new RuntimeException("Selected user is not a fraud analyst.");
        }

        String oldAssignedAnalyst = transaction.getAssignedAnalystEmail();

        transaction.setAssignedAnalystEmail(analyst.getEmail());
        transaction.setAssignedAnalystName(analyst.getFullName());
        transaction.setAssignedAt(LocalDateTime.now());

        BankTransaction savedTransaction = bankTransactionRepository.save(transaction);

        String performedBy = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        auditLogService.createLog(
                "CASE_ASSIGNED",
                savedTransaction.getTransactionReference(),
                performedBy,
                "Transaction "
                        + savedTransaction.getTransactionReference()
                        + " assigned from "
                        + (oldAssignedAnalyst == null ? "UNASSIGNED" : oldAssignedAnalyst)
                        + " to "
                        + analyst.getEmail());

        return savedTransaction;
    }
}