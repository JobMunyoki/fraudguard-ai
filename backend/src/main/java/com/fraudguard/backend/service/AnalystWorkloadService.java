package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.assignment.AnalystWorkloadResponse;
import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.ReviewStatus;
import com.fraudguard.backend.entity.Role;
import com.fraudguard.backend.repository.AppUserRepository;
import com.fraudguard.backend.repository.BankTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import com.fraudguard.backend.dto.assignment.RecommendedAnalystResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;

@Service
public class AnalystWorkloadService {

    private final AppUserRepository appUserRepository;
    private final BankTransactionRepository bankTransactionRepository;

    public AnalystWorkloadService(
            AppUserRepository appUserRepository,
            BankTransactionRepository bankTransactionRepository) {
        this.appUserRepository = appUserRepository;
        this.bankTransactionRepository = bankTransactionRepository;
    }

    public List<AnalystWorkloadResponse> getAnalystWorkload() {
        List<AppUser> analysts = appUserRepository.findByRole(Role.FRAUD_ANALYST);

        return analysts.stream()
                .map(this::buildWorkloadResponse)
                .toList();
    }

    public RecommendedAnalystResponse getRecommendedAnalyst() {
        return getAnalystWorkload()
                .stream()
                .min(
                        Comparator
                                .comparingLong(this::getActiveCaseCount)
                                .thenComparingLong(AnalystWorkloadResponse::getHighRiskCases)
                                .thenComparingLong(AnalystWorkloadResponse::getTotalAssignedCases)
                                .thenComparing(AnalystWorkloadResponse::getFullName))
                .map(this::buildRecommendedAnalystResponse)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No fraud analysts available for assignment"));
    }

    private long getActiveCaseCount(AnalystWorkloadResponse workload) {
        return workload.getPendingCases() + workload.getUnderReviewCases();
    }

    private RecommendedAnalystResponse buildRecommendedAnalystResponse(
            AnalystWorkloadResponse workload) {
        long activeCases = getActiveCaseCount(workload);

        String reason = "Recommended because this analyst has the lightest active workload: "
                + activeCases
                + " active case(s), "
                + workload.getTotalAssignedCases()
                + " total assigned case(s), and "
                + workload.getHighRiskCases()
                + " high risk case(s).";

        return new RecommendedAnalystResponse(
                workload.getUserId(),
                workload.getFullName(),
                workload.getEmail(),
                activeCases,
                workload.getTotalAssignedCases(),
                workload.getHighRiskCases(),
                reason);
    }

    private AnalystWorkloadResponse buildWorkloadResponse(AppUser analyst) {
        String email = analyst.getEmail();

        long totalAssignedCases = bankTransactionRepository.countByAssignedAnalystEmail(email);

        long pendingCases = bankTransactionRepository.countByAssignedAnalystEmailAndReviewStatus(
                email,
                ReviewStatus.PENDING);

        long underReviewCases = bankTransactionRepository.countByAssignedAnalystEmailAndReviewStatus(
                email,
                ReviewStatus.UNDER_REVIEW);

        long confirmedFraudCases = bankTransactionRepository.countByAssignedAnalystEmailAndReviewStatus(
                email,
                ReviewStatus.CONFIRMED_FRAUD);

        long falsePositiveCases = bankTransactionRepository.countByAssignedAnalystEmailAndReviewStatus(
                email,
                ReviewStatus.FALSE_POSITIVE);

        long resolvedCases = bankTransactionRepository.countByAssignedAnalystEmailAndReviewStatus(
                email,
                ReviewStatus.RESOLVED);

        long highRiskCases = bankTransactionRepository.countByAssignedAnalystEmailAndRiskScoreGreaterThanEqual(
                email,
                80);

        return new AnalystWorkloadResponse(
                analyst.getId(),
                analyst.getFullName(),
                analyst.getEmail(),
                totalAssignedCases,
                pendingCases,
                underReviewCases,
                confirmedFraudCases,
                falsePositiveCases,
                resolvedCases,
                highRiskCases);
    }
}