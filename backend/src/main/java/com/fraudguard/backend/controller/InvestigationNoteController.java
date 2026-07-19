package com.fraudguard.backend.controller;

import com.fraudguard.backend.dto.note.InvestigationNoteRequest;
import com.fraudguard.backend.dto.note.InvestigationNoteResponse;
import com.fraudguard.backend.service.InvestigationNoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions/{transactionId}/notes")
public class InvestigationNoteController {

    private final InvestigationNoteService investigationNoteService;

    public InvestigationNoteController(InvestigationNoteService investigationNoteService) {
        this.investigationNoteService = investigationNoteService;
    }

    @GetMapping
    public ResponseEntity<List<InvestigationNoteResponse>> getNotes(
            @PathVariable Long transactionId) {
        return ResponseEntity.ok(
                investigationNoteService.getNotesForTransaction(transactionId));
    }

    @PostMapping
    public ResponseEntity<InvestigationNoteResponse> addNote(
            @PathVariable Long transactionId,
            @RequestBody InvestigationNoteRequest request) {
        return ResponseEntity.ok(
                investigationNoteService.addNote(transactionId, request));
    }
}