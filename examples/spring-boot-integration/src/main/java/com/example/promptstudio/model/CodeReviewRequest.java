package com.example.promptstudio.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CodeReviewRequest {
    @NotBlank(message = "Code is required")
    private String code;
    
    @NotBlank(message = "Language is required")
    private String language;
    
    @NotNull(message = "Provider is required")
    private String provider = "openai";

    // Getters and Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
} 