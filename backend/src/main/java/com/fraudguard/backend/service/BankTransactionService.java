package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.AiPredictionResponse;
import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.entity.PredictionLabel;
import com.fraudguard.backend.entity.ReviewStatus;
import com.fraudguard.backend.entity.TransactionType;
import com.fraudguard.backend.repository.BankTransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BankTransactionService {

    private final BankTransactionRepository repository;
    private final AiPredictionService aiPredictionService;

    public BankTransactionService(
            BankTransactionRepository repository,
            AiPredictionService aiPredictionService) {
        this.repository = repository;
        this.aiPredictionService = aiPredictionService;
    }

    public BankTransaction createTransaction(BankTransaction transaction) {
        try {
            AiPredictionResponse aiResponse = aiPredictionService.predict(transaction);

            transaction.setRiskScore(aiResponse.getRiskScore());
            transaction.setConfidence(aiResponse.getConfidence());
            transaction.setModelUsed(aiResponse.getModelUsed());
            transaction.setPredictionSource("AI_SERVICE");

            transaction.setPredictionLabel(
                    PredictionLabel.valueOf(aiResponse.getPrediction()));
        } catch (Exception error) {
            double riskScore = calculateTemporaryRiskScore(transaction);

            transaction.setRiskScore(riskScore);
            transaction.setConfidence(0.0);
            transaction.setModelUsed("RuleBasedScoring");
            transaction.setPredictionSource("FALLBACK_RULES");

            transaction.setPredictionLabel(getPredictionLabel(riskScore));
        }

        return repository.save(transaction);
    }

    public List<BankTransaction> getAllTransactions() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public List<BankTransaction> getFlaggedTransactions() {
        return repository.findByPredictionLabelInOrderByCreatedAtDesc(
                List.of(PredictionLabel.SUSPICIOUS, PredictionLabel.FRAUD));
    }

    public BankTransaction getTransactionById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public BankTransaction updateReviewStatus(Long id, ReviewStatus status) {
        BankTransaction transaction = getTransactionById(id);
        transaction.setReviewStatus(status);
        return repository.save(transaction);
    }

    private double calculateTemporaryRiskScore(BankTransaction transaction) {
        double score = 0;

        BigDecimal amount = transaction.getAmount();
        BigDecimal oldBalance = transaction.getOldBalance();
        BigDecimal newBalance = transaction.getNewBalance();

        if (amount != null) {
            if (amount.compareTo(BigDecimal.valueOf(100000)) >= 0) {
                score += 45;
            } else if (amount.compareTo(BigDecimal.valueOf(50000)) >= 0) {
                score += 30;
            } else if (amount.compareTo(BigDecimal.valueOf(10000)) >= 0) {
                score += 15;
            }
        }

        if (oldBalance != null && amount != null && amount.compareTo(oldBalance) > 0) {
            score += 30;
        }

        if (transaction.getTransactionType() == TransactionType.TRANSFER ||
                transaction.getTransactionType() == TransactionType.CASH_OUT) {
            score += 15;
        }

        if (newBalance != null && newBalance.compareTo(BigDecimal.ZERO) == 0) {
            score += 10;
        }

        return Math.min(score, 99);
    }

    private PredictionLabel getPredictionLabel(double riskScore) {
        if (riskScore >= 70) {
            return PredictionLabel.FRAUD;
        }

        if (riskScore >= 40) {
            return PredictionLabel.SUSPICIOUS;
        }

        return PredictionLabel.NORMAL;
    }
}