package com.fraudguard.backend.service;

import com.fraudguard.backend.entity.BankTransaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${fraudguard.mail.from:}")
    private String fromAddress;

    @Value("${fraudguard.mail.escalation-recipient:}")
    private String escalationRecipient;

    public EmailNotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEscalationEmail(BankTransaction transaction) {
        if (!StringUtils.hasText(mailUsername) || !StringUtils.hasText(escalationRecipient)) {
            System.out.println("Email notification skipped. MAIL_USERNAME or FRAUDGUARD_ESCALATION_RECIPIENT is not configured.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(StringUtils.hasText(fromAddress) ? fromAddress : mailUsername);
            message.setTo(escalationRecipient);

            message.setSubject(
                    "FraudGuard AI Alert: Escalated Case " +
                            transaction.getTransactionReference()
            );

            message.setText(buildEscalationEmailBody(transaction));

            mailSender.send(message);

            System.out.println(
                    "Escalation email sent for transaction " +
                            transaction.getTransactionReference()
            );
        } catch (Exception error) {
            System.out.println(
                    "Failed to send escalation email for transaction " +
                            transaction.getTransactionReference() +
                            ". Reason: " +
                            error.getMessage()
            );
        }
    }

    private String buildEscalationEmailBody(BankTransaction transaction) {
        return """
                FraudGuard AI Escalation Notification

                A fraud case has been escalated and requires urgent review.

                Case Details:
                Transaction Reference: %s
                Customer ID: %s
                Transaction Type: %s
                Amount: KES %s
                Risk Score: %s
                Prediction: %s
                Review Status: %s

                Assignment:
                Assigned Analyst: %s
                Assigned Analyst Email: %s
                Assigned At: %s

                Escalation:
                Escalated: %s
                Escalated By: %s
                Escalated At: %s
                Escalation Reason: %s

                SLA:
                SLA Due At: %s

                Please log in to FraudGuard AI to review this case.
                """.formatted(
                transaction.getTransactionReference(),
                transaction.getCustomerId(),
                transaction.getTransactionType(),
                transaction.getAmount(),
                transaction.getRiskScore(),
                transaction.getPredictionLabel(),
                transaction.getReviewStatus(),

                valueOrDefault(transaction.getAssignedAnalystName()),
                valueOrDefault(transaction.getAssignedAnalystEmail()),
                valueOrDefault(transaction.getAssignedAt()),

                transaction.getEscalated(),
                valueOrDefault(transaction.getEscalatedBy()),
                valueOrDefault(transaction.getEscalatedAt()),
                valueOrDefault(transaction.getEscalationReason()),

                valueOrDefault(transaction.getSlaDueAt())
        );
    }

    private String valueOrDefault(Object value) {
        return value == null ? "N/A" : value.toString();
    }
}
