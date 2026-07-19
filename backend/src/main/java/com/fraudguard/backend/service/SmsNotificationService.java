package com.fraudguard.backend.service;

import com.fraudguard.backend.entity.BankTransaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Service
public class SmsNotificationService {

    private final RestClient restClient;

    @Value("${africastalking.sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${africastalking.sms.base-url:}")
    private String smsBaseUrl;

    @Value("${africastalking.sms.username:}")
    private String username;

    @Value("${africastalking.sms.api-key:}")
    private String apiKey;

    @Value("${africastalking.sms.recipient:}")
    private String recipient;

    @Value("${africastalking.sms.sender-id:}")
    private String senderId;

    public SmsNotificationService() {
        this.restClient = RestClient.builder().build();
    }

    public void sendCriticalCaseSms(BankTransaction transaction) {
        if (!smsEnabled) {
            System.out.println("SMS notification skipped. SMS notifications are disabled.");
            return;
        }

        if (!StringUtils.hasText(smsBaseUrl) ||
                !StringUtils.hasText(username) ||
                !StringUtils.hasText(apiKey) ||
                !StringUtils.hasText(recipient)) {
            System.out.println("SMS notification skipped. Africa's Talking SMS settings are incomplete.");
            return;
        }

        double riskScore = transaction.getRiskScore() == null
                ? 0
                : transaction.getRiskScore().doubleValue();

        if (riskScore < 90) {
            System.out.println(
                    "SMS notification skipped. Transaction "
                            + transaction.getTransactionReference()
                            + " is not critical risk.");
            return;
        }

        try {
            LinkedMultiValueMap<String, String> formData = new LinkedMultiValueMap<>();

            formData.add("username", username);
            formData.add("to", recipient);
            formData.add("message", buildSmsMessage(transaction));
            formData.add("bulkSMSMode", "1");

            if (StringUtils.hasText(senderId)) {
                formData.add("from", senderId);
            }

            String response = restClient.post()
                    .uri(smsBaseUrl)
                    .header("apiKey", apiKey)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(formData)
                    .retrieve()
                    .body(String.class);

            System.out.println(
                    "Critical fraud SMS sent for transaction "
                            + transaction.getTransactionReference()
                            + ". Response: "
                            + response);
        } catch (Exception error) {
            System.out.println(
                    "Failed to send critical fraud SMS for transaction "
                            + transaction.getTransactionReference()
                            + ". Reason: "
                            + error.getMessage());
        }
    }

    private String buildSmsMessage(BankTransaction transaction) {
        return "FraudGuard AI Alert: Critical fraud case "
                + transaction.getTransactionReference()
                + " escalated. Risk: "
                + transaction.getRiskScore()
                + ". Amount: KES "
                + transaction.getAmount()
                + ". Review urgently.";
    }
}