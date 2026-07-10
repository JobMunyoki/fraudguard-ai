package com.fraudguard.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AiPredictionResponse {

    private String prediction;

    @JsonProperty("risk_score")
    private Double riskScore;

    private Double confidence;

    @JsonProperty("model_used")
    private String modelUsed;

    public AiPredictionResponse() {
    }

    public String getPrediction() {
        return prediction;
    }

    public Double getRiskScore() {
        return riskScore;
    }

    public Double getConfidence() {
        return confidence;
    }

    public String getModelUsed() {
        return modelUsed;
    }
}