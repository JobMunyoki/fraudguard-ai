package com.fraudguard.backend.service;

import com.fraudguard.backend.dto.AiPredictionRequest;
import com.fraudguard.backend.dto.AiPredictionResponse;
import com.fraudguard.backend.entity.BankTransaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AiPredictionService {

    private final RestClient restClient;

    public AiPredictionService(@Value("${ai.service.url}") String aiServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }

    public AiPredictionResponse predict(BankTransaction transaction) {
        AiPredictionRequest request = new AiPredictionRequest(
                transaction.getTransactionType().name(),
                transaction.getAmount(),
                transaction.getOldBalance(),
                transaction.getNewBalance());

        return restClient.post()
                .uri("/predict")
                .body(request)
                .retrieve()
                .body(AiPredictionResponse.class);
    }
}