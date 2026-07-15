package com.fraudguard.backend.dto.note;

import com.fraudguard.backend.entity.InvestigationNote;

import java.time.LocalDateTime;

public class InvestigationNoteResponse {

    private Long id;
    private Long transactionId;
    private String transactionReference;
    private String note;
    private String createdBy;
    private LocalDateTime createdAt;

    public InvestigationNoteResponse() {
    }

    public InvestigationNoteResponse(InvestigationNote investigationNote) {
        this.id = investigationNote.getId();
        this.transactionId = investigationNote.getTransaction().getId();
        this.transactionReference = investigationNote.getTransaction().getTransactionReference();
        this.note = investigationNote.getNote();
        this.createdBy = investigationNote.getCreatedBy();
        this.createdAt = investigationNote.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public String getNote() {
        return note;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}