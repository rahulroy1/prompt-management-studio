package com.example.promptstudio.service;

import com.example.promptstudio.model.PromptData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.text.StringSubstitutor;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PromptManager {
    
    private final Map<String, PromptData> prompts = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String promptsDir = "../prompt-templates";
    
    @Autowired
    @Qualifier("openaiChatClient")
    private ChatClient openaiClient;
    
    @Autowired
    @Qualifier("anthropicChatClient")
    private ChatClient anthropicClient;
    
    @Autowired
    @Qualifier("vertexAiGeminiChatClient")
    private ChatClient googleClient;
    
    public PromptManager() {
        loadPrompts();
    }
    
    private void loadPrompts() {
        try {
            Path promptsPath = Paths.get(promptsDir);
            if (!Files.exists(promptsPath)) {
                System.err.println("Prompts directory not found: " + promptsPath.toAbsolutePath());
                return;
            }
            
            Files.list(promptsPath)
                .filter(path -> path.toString().endsWith(".prompt.json"))
                .forEach(this::loadPrompt);
                
            System.out.println("Loaded " + prompts.size() + " prompts");
        } catch (IOException e) {
            System.err.println("Error loading prompts: " + e.getMessage());
        }
    }
    
    private void loadPrompt(Path promptPath) {
        try {
            String promptName = promptPath.getFileName().toString().replace(".prompt.json", "");
            PromptData promptData = objectMapper.readValue(promptPath.toFile(), PromptData.class);
            prompts.put(promptName, promptData);
            System.out.println("Loaded prompt: " + promptName);
        } catch (IOException e) {
            System.err.println("Error loading prompt " + promptPath + ": " + e.getMessage());
        }
    }
    
    public String executePrompt(String promptName, Map<String, Object> variables, String provider) {
        if (!prompts.containsKey(promptName)) {
            throw new IllegalArgumentException("Prompt '" + promptName + "' not found");
        }
        
        PromptData promptData = prompts.get(promptName);
        String compiledPrompt = compilePrompt(promptData, variables);
        
        ChatClient client = getClientForProvider(provider);
        Prompt prompt = new Prompt(compiledPrompt);
        ChatResponse response = client.call(prompt);
        
        return response.getResult().getOutput().getContent();
    }
    
    private String compilePrompt(PromptData promptData, Map<String, Object> variables) {
        StringBuilder promptBuilder = new StringBuilder();
        
        // Add persona
        if (promptData.getPrompt().getPersona() != null) {
            PromptData.Persona persona = promptData.getPrompt().getPersona();
            if (persona.getRole() != null) {
                promptBuilder.append(persona.getRole()).append("\n");
            }
            if (persona.getExpertise() != null) {
                promptBuilder.append("Expertise: ").append(persona.getExpertise()).append("\n");
            }
            if (persona.getTone() != null) {
                promptBuilder.append("Tone: ").append(persona.getTone()).append("\n");
            }
            promptBuilder.append("\n");
        }
        
        // Add instructions
        if (promptData.getPrompt().getInstructions() != null) {
            promptBuilder.append("Instructions:\n");
            for (String instruction : promptData.getPrompt().getInstructions()) {
                promptBuilder.append("- ").append(instruction).append("\n");
            }
            promptBuilder.append("\n");
        }
        
        // Add examples
        if (promptData.getPrompt().getFewShotExamples() != null) {
            promptBuilder.append("Examples:\n");
            for (PromptData.Example example : promptData.getPrompt().getFewShotExamples()) {
                promptBuilder.append("Input: ").append(example.getInput()).append("\n");
                promptBuilder.append("Analysis: ").append(example.getAnalysis()).append("\n");
                promptBuilder.append("Output: ").append(example.getOutput()).append("\n\n");
            }
        }
        
        // Add chain of thought
        if (promptData.getPrompt().getChainOfThought() != null) {
            promptBuilder.append("Please follow this process:\n");
            for (String step : promptData.getPrompt().getChainOfThought()) {
                promptBuilder.append("- ").append(step).append("\n");
            }
            promptBuilder.append("\n");
        }
        
        // Add user input template with variable substitution
        if (promptData.getUserInputTemplate() != null) {
            StringSubstitutor substitutor = new StringSubstitutor(variables);
            String userInput = substitutor.replace(promptData.getUserInputTemplate());
            promptBuilder.append(userInput);
        }
        
        return promptBuilder.toString();
    }
    
    private ChatClient getClientForProvider(String provider) {
        return switch (provider.toLowerCase()) {
            case "openai" -> openaiClient;
            case "anthropic" -> anthropicClient;
            case "google" -> googleClient;
            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        };
    }
    
    public Map<String, Object> getAvailablePrompts() {
        Map<String, Object> result = new HashMap<>();
        for (Map.Entry<String, PromptData> entry : prompts.entrySet()) {
            Map<String, Object> promptInfo = new HashMap<>();
            promptInfo.put("title", entry.getValue().getTitle());
            promptInfo.put("description", entry.getValue().getDescription());
            promptInfo.put("variables", entry.getValue().getVariables());
            result.put(entry.getKey(), promptInfo);
        }
        return result;
    }
    
    public int getPromptCount() {
        return prompts.size();
    }
} 