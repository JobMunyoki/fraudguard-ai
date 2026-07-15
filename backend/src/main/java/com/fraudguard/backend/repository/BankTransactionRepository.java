package com.fraudguard.backend.repository;

import com.fraudguard.backend.entity.BankTransaction;
import com.fraudguard.backend.entity.PredictionLabel;
import com.fraudguard.backend.entity.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {

    List<BankTransaction> findAllByOrderByCreatedAtDesc();

    List<BankTransaction> findByPredictionLabelInOrderByCreatedAtDesc(List<PredictionLabel> labels);

    List<BankTransaction> findByAssignedAnalystEmailOrderByAssignedAtDesc(String assignedAnalystEmail);

    long countByPredictionLabel(PredictionLabel predictionLabel);

    long countByReviewStatus(ReviewStatus reviewStatus);
}