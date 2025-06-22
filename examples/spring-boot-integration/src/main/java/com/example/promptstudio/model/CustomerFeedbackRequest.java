package com.example.promptstudio.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CustomerFeedbackRequest {
    @NotBlank(message = "Feedback text is required")
    private String feedbackText;
    
    private String customerSentiment;
    
    @NotNull(message = "Provider is required")
    private String provider = "openai";

    // Getters and Setters
    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
    
    public String getCustomerSentiment() { return customerSentiment; }
    public void setCustomerSentiment(String customerSentiment) { this.customerSentiment = customerSentiment; }
    
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
} 