package com.fraudguard.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class AiPredictionRequest {

    @JsonProperty("transaction_type")
    private String transactionType;

    private BigDecimal amount;

    @JsonProperty("old_balance")
    private BigDecimal oldBalance;

    @JsonProperty("new_balance")
    private BigDecimal newBalance;

    public AiPredictionRequest() {
    }

    public AiPredictionRequest(
            String transactionType,
            BigDecimal amount,
            BigDecimal oldBalance,
            BigDecimal newBalance) {
        this.transactionType = transactionType;
        this.amount = amount;
        this.oldBalance = oldBalance;
        this.newBalance = newBalance;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getOldBalance() {
        return oldBalance;
    }

    public BigDecimal getNewBalance() {
        return newBalance;
    }
}