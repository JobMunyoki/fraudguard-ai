package com.fraudguard.backend.repository;

import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.entity.PredictionLabel;
import com.fraudguard.backend.entity.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;

import java.util.List;

import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.entity.ReviewStatus;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {

        List<BankTransaction> findAllByOrderByCreatedAtDesc();

        List<BankTransaction> findByPredictionLabelInOrderByCreatedAtDesc(List<PredictionLabel> labels);

        List<BankTransaction> findByAssignedAnalystEmailOrderByAssignedAtDesc(String assignedAnalystEmail);

        List<BankTransaction> findByEscalatedTrueOrderByEscalatedAtDesc();

        List<BankTransaction> findBySlaDueAtBeforeAndReviewStatusNotInOrderBySlaDueAtAsc(
                        LocalDateTime now,
                        Collection<ReviewStatus> closedStatuses);

        long countByAssignedAnalystEmail(String assignedAnalystEmail);

        long countByAssignedAnalystEmailAndReviewStatus(
                        String assignedAnalystEmail,
                        ReviewStatus reviewStatus);

        long countByAssignedAnalystEmailAndRiskScoreGreaterThanEqual(
                        String assignedAnalystEmail,
                        Integer riskScore);

        long countByPredictionLabel(PredictionLabel predictionLabel);

        long countByReviewStatus(ReviewStatus reviewStatus);

        long countBySlaDueAtBeforeAndReviewStatusNotIn(
                        LocalDateTime now,
                        Collection<ReviewStatus> closedStatuses);

        long countByEscalatedTrue();

        long countBySlaDueAtBetweenAndReviewStatusNotIn(
                        LocalDateTime startOfDay,
                        LocalDateTime endOfDay,
                        Collection<ReviewStatus> closedStatuses);

        long countByRiskScoreGreaterThanEqualAndReviewStatusNotIn(
                        Integer riskScore,
                        Collection<ReviewStatus> closedStatuses);

        long countByReviewStatusNotIn(
                        Collection<ReviewStatus> closedStatuses);

        long countByAssignedAnalystEmailIsNotNull();

}