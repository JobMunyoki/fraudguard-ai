package com.fraudguard.backend.service;

import com.fraudguard.backend.entity.BankTransaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailNotificationService {

    private final RestClient restClient;

    @Value("${BREVO_API_URL:https://api.brevo.com/v3/smtp/email}")
    private String brevoApiUrl;

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${BREVO_SENDER_EMAIL:}")
    private String senderEmail;

    @Value("${BREVO_SENDER_NAME:FraudGuard AI}")
    private String senderName;

    @Value("${fraudguard.mail.escalation-recipient:}")
    private String escalationRecipient;

    public EmailNotificationService() {
        this.restClient = RestClient.builder().build();
    }

    public void sendEscalationEmail(BankTransaction transaction) {
        if (!StringUtils.hasText(brevoApiKey)
                || !StringUtils.hasText(senderEmail)
                || !StringUtils.hasText(escalationRecipient)) {

            System.out.println(
                    "Email notification skipped. BREVO_API_KEY, "
                            + "BREVO_SENDER_EMAIL or "
                            + "FRAUDGUARD_ESCALATION_RECIPIENT is not configured.");
            return;
        }

        try {
            String resolvedSenderName = StringUtils.hasText(senderName)
                    ? senderName
                    : "FraudGuard AI";

            Map<String, Object> sender = new LinkedHashMap<>();
            sender.put("name", resolvedSenderName);
            sender.put("email", senderEmail);

            Map<String, Object> recipient = new LinkedHashMap<>();
            recipient.put("email", escalationRecipient);

            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("sender", sender);
            requestBody.put("to", List.of(recipient));
            requestBody.put(
                    "subject",
                    "FraudGuard AI Alert: Escalated Case "
                            + transaction.getTransactionReference());
            requestBody.put(
                    "textContent",
                    buildEscalationEmailBody(transaction));

            String response = restClient.post()
                    .uri(brevoApiUrl)
                    .header("api-key", brevoApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            System.out.println(
                    "Escalation email sent through Brevo for transaction "
                            + transaction.getTransactionReference()
                            + ". Response: "
                            + response);

        } catch (RestClientResponseException error) {
            System.out.println(
                    "Failed to send escalation email for transaction "
                            + transaction.getTransactionReference()
                            + ". Brevo status: "
                            + error.getStatusCode()
                            + ". Response: "
                            + error.getResponseBodyAsString());

        } catch (Exception error) {
            System.out.println(
                    "Failed to send escalation email for transaction "
                            + transaction.getTransactionReference()
                            + ". Reason: "
                            + error.getMessage());
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

                valueOrDefault(transaction.getSlaDueAt()));
    }

    private String valueOrDefault(Object value) {
        return value == null ? "N/A" : value.toString();
    }
}