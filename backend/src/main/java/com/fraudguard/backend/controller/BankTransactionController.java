package com.fraudguard.backend.controller;

import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.entity.ReviewStatus;
import com.fraudguard.backend.service.BankTransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class BankTransactionController {

    private final BankTransactionService service;

    public BankTransactionController(BankTransactionService service) {
        this.service = service;
    }

    @PostMapping
    public BankTransaction createTransaction(@RequestBody BankTransaction transaction) {
        return service.createTransaction(transaction);
    }

    @GetMapping
    public List<BankTransaction> getAllTransactions() {
        return service.getAllTransactions();
    }

    @GetMapping("/flagged")
    public List<BankTransaction> getFlaggedTransactions() {
        return service.getFlaggedTransactions();
    }

    @GetMapping("/{id}")
    public BankTransaction getTransactionById(@PathVariable Long id) {
        return service.getTransactionById(id);
    }

    @PutMapping("/{id}/review-status")
    public BankTransaction updateReviewStatus(
            @PathVariable Long id,
            @RequestParam ReviewStatus status) {
        return service.updateReviewStatus(id, status);
    }
}