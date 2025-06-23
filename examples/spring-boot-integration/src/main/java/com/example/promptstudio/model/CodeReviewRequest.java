package com.example.promptstudio.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CodeReviewRequest {
    @NotBlank(message = "User input is required")
    private String userInput;
    
    @NotNull(message = "Provider is required")
    private String provider = "openai";

    // Getters and Setters
    public String getUserInput() { return userInput; }
    public void setUserInput(String userInput) { this.userInput = userInput; }
    
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
} 