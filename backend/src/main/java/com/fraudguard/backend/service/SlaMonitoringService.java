package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.dashboard.SlaMonitoringSummaryResponse;
import com.fraudguard.backend.entity.ReviewStatus;
import com.fraudguard.backend.repository.BankTransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.fraudguard.backend.entity.BankTransaction;

@Service
public class SlaMonitoringService {

        private final BankTransactionRepository bankTransactionRepository;

        public SlaMonitoringService(BankTransactionRepository bankTransactionRepository) {
                this.bankTransactionRepository = bankTransactionRepository;
        }

        public SlaMonitoringSummaryResponse getSlaMonitoringSummary() {
                LocalDateTime now = LocalDateTime.now();

                LocalDate today = LocalDate.now();
                LocalDateTime startOfToday = today.atStartOfDay();
                LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();

                List<ReviewStatus> closedStatuses = getClosedStatuses();

                long overdueCases = bankTransactionRepository.countBySlaDueAtBeforeAndReviewStatusNotIn(
                                now,
                                closedStatuses);

                long escalatedCases = bankTransactionRepository.countByEscalatedTrue();

                long casesDueToday = bankTransactionRepository.countBySlaDueAtBetweenAndReviewStatusNotIn(
                                startOfToday,
                                startOfTomorrow,
                                closedStatuses);

                long highRiskOpenCases = bankTransactionRepository.countByRiskScoreGreaterThanEqualAndReviewStatusNotIn(
                                80,
                                closedStatuses);

                long openCases = bankTransactionRepository.countByReviewStatusNotIn(closedStatuses);

                long totalAssignedCases = bankTransactionRepository.countByAssignedAnalystEmailIsNotNull();

                return new SlaMonitoringSummaryResponse(
                                overdueCases,
                                escalatedCases,
                                casesDueToday,
                                highRiskOpenCases,
                                openCases,
                                totalAssignedCases);
        }

        private List<ReviewStatus> getClosedStatuses() {
                return List.of(
                                ReviewStatus.CONFIRMED_FRAUD,
                                ReviewStatus.FALSE_POSITIVE,
                                ReviewStatus.RESOLVED);
        }

        public List<BankTransaction> getOverdueOrEscalatedCases() {
                List<BankTransaction> escalatedCases = bankTransactionRepository
                                .findByEscalatedTrueOrderByEscalatedAtDesc();

                List<BankTransaction> overdueCases = bankTransactionRepository
                                .findBySlaDueAtBeforeAndReviewStatusNotInOrderBySlaDueAtAsc(
                                                LocalDateTime.now(),
                                                getClosedStatuses());

                escalatedCases.addAll(
                                overdueCases.stream()
                                                .filter(overdueCase -> escalatedCases.stream()
                                                                .noneMatch(escalatedCase -> escalatedCase.getId()
                                                                                .equals(overdueCase.getId())))
                                                .toList());

                return escalatedCases;
        }
}