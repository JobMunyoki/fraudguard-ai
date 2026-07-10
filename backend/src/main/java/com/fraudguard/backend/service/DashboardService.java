package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.DashboardStatsResponse;
import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.entity.PredictionLabel;
import com.fraudguard.backend.entity.ReviewStatus;
import com.fraudguard.backend.repository.BankTransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class DashboardService {

    private final BankTransactionRepository transactionRepository;

    public DashboardService(BankTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalTransactions = transactionRepository.count();

        long normalTransactions = transactionRepository.countByPredictionLabel(PredictionLabel.NORMAL);
        long suspiciousTransactions = transactionRepository.countByPredictionLabel(PredictionLabel.SUSPICIOUS);
        long fraudTransactions = transactionRepository.countByPredictionLabel(PredictionLabel.FRAUD);

        long pendingReviews = transactionRepository.countByReviewStatus(ReviewStatus.PENDING);
        long underReviewCases = transactionRepository.countByReviewStatus(ReviewStatus.UNDER_REVIEW);
        long confirmedFraudCases = transactionRepository.countByReviewStatus(ReviewStatus.CONFIRMED_FRAUD);

        List<BankTransaction> flaggedTransactions = transactionRepository.findByPredictionLabelInOrderByCreatedAtDesc(
                List.of(PredictionLabel.SUSPICIOUS, PredictionLabel.FRAUD));

        BigDecimal totalFlaggedAmount = flaggedTransactions.stream()
                .map(BankTransaction::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<BankTransaction> allTransactions = transactionRepository.findAll();

        double averageRiskScore = allTransactions.stream()
                .map(BankTransaction::getRiskScore)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        double highRiskPercentage = totalTransactions == 0
                ? 0.0
                : ((double) (suspiciousTransactions + fraudTransactions) / totalTransactions) * 100;

        return new DashboardStatsResponse(
                totalTransactions,
                normalTransactions,
                suspiciousTransactions,
                fraudTransactions,
                pendingReviews,
                underReviewCases,
                confirmedFraudCases,
                totalFlaggedAmount,
                averageRiskScore,
                highRiskPercentage);
    }
}