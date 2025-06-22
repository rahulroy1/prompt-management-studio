package com.example.promptstudio.controller;

import com.example.promptstudio.model.CodeReviewRequest;
import com.example.promptstudio.model.CustomerFeedbackRequest;
import com.example.promptstudio.service.PromptManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PromptController {
    
    @Autowired
    private PromptManager promptManager;
    
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Prompt Management Studio - Spring Boot Integration");
        response.put("available_prompts", promptManager.getAvailablePrompts().keySet());
        response.put("endpoints", new String[]{
            "/api/code-review",
            "/api/customer-feedback",
            "/api/prompts",
            "/api/health"
        });
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/prompts")
    public ResponseEntity<Map<String, Object>> listPrompts() {
        return ResponseEntity.ok(promptManager.getAvailablePrompts());
    }
    
    @PostMapping("/code-review")
    public ResponseEntity<Map<String, Object>> reviewCode(@Valid @RequestBody CodeReviewRequest request) {
        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("code", request.getCode());
            variables.put("language", request.getLanguage());
            
            String result = promptManager.executePrompt("code-review-assistant", variables, request.getProvider());
            
            Map<String, Object> response = new HashMap<>();
            response.put("prompt_used", "code-review-assistant");
            response.put("provider", request.getProvider());
            response.put("review", result);
            response.put("variables", variables);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/customer-feedback")
    public ResponseEntity<Map<String, Object>> analyzeFeedback(@Valid @RequestBody CustomerFeedbackRequest request) {
        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("feedback_text", request.getFeedbackText());
            if (request.getCustomerSentiment() != null) {
                variables.put("customer_sentiment", request.getCustomerSentiment());
            }
            
            String result = promptManager.executePrompt("customer-feedback-analyzer", variables, request.getProvider());
            
            Map<String, Object> response = new HashMap<>();
            response.put("prompt_used", "customer-feedback-analyzer");
            response.put("provider", request.getProvider());
            response.put("analysis", result);
            response.put("variables", variables);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("prompts_loaded", promptManager.getPromptCount());
        return ResponseEntity.ok(response);
    }
} 