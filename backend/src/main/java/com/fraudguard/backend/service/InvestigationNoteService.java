package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.note.InvestigationNoteRequest;
import com.fraudguard.backend.dto.note.InvestigationNoteResponse;
import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.entity.InvestigationNote;
import com.fraudguard.backend.repository.BankTransactionRepository;
import com.fraudguard.backend.repository.InvestigationNoteRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestigationNoteService {

        private final InvestigationNoteRepository investigationNoteRepository;
        private final BankTransactionRepository bankTransactionRepository;
        private final AuditLogService auditLogService;

        public InvestigationNoteService(
                        InvestigationNoteRepository investigationNoteRepository,
                        BankTransactionRepository bankTransactionRepository,
                        AuditLogService auditLogService) {
                this.investigationNoteRepository = investigationNoteRepository;
                this.bankTransactionRepository = bankTransactionRepository;
                this.auditLogService = auditLogService;
        }

        public List<InvestigationNoteResponse> getNotesForTransaction(Long transactionId) {
                return investigationNoteRepository.findByTransactionIdOrderByCreatedAtDesc(transactionId)
                                .stream()
                                .map(InvestigationNoteResponse::new)
                                .toList();
        }

        public InvestigationNoteResponse addNote(Long transactionId, InvestigationNoteRequest request) {
                if (request.getNote() == null || request.getNote().trim().isEmpty()) {
                        throw new RuntimeException("Investigation note is required.");
                }

                BankTransaction transaction = bankTransactionRepository.findById(transactionId)
                                .orElseThrow(() -> new RuntimeException("Transaction not found."));

                String createdBy = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                InvestigationNote note = new InvestigationNote(
                                transaction,
                                request.getNote().trim(),
                                createdBy);

                InvestigationNote savedNote = investigationNoteRepository.save(note);

                auditLogService.createLog(
                                "INVESTIGATION_NOTE_ADDED",
                                transaction.getTransactionReference(),
                                createdBy,
                                "Investigation note added to transaction "
                                                + transaction.getTransactionReference());

                return new InvestigationNoteResponse(savedNote);
        }
}