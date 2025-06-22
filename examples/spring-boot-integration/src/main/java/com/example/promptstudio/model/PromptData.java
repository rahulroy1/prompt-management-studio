package com.example.promptstudio.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public class PromptData {
    private String title;
    private String description;
    private Prompt prompt;
    
    @JsonProperty("user_input_template")
    private String userInputTemplate;
    
    private List<Variable> variables;
    
    @JsonProperty("test_cases")
    private List<TestCase> testCases;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Prompt getPrompt() { return prompt; }
    public void setPrompt(Prompt prompt) { this.prompt = prompt; }
    
    public String getUserInputTemplate() { return userInputTemplate; }
    public void setUserInputTemplate(String userInputTemplate) { this.userInputTemplate = userInputTemplate; }
    
    public List<Variable> getVariables() { return variables; }
    public void setVariables(List<Variable> variables) { this.variables = variables; }
    
    public List<TestCase> getTestCases() { return testCases; }
    public void setTestCases(List<TestCase> testCases) { this.testCases = testCases; }

    public static class Prompt {
        private Persona persona;
        private List<String> instructions;
        
        @JsonProperty("few_shot_examples")
        private List<Example> fewShotExamples;
        
        @JsonProperty("chain_of_thought")
        private List<String> chainOfThought;

        // Getters and Setters
        public Persona getPersona() { return persona; }
        public void setPersona(Persona persona) { this.persona = persona; }
        
        public List<String> getInstructions() { return instructions; }
        public void setInstructions(List<String> instructions) { this.instructions = instructions; }
        
        public List<Example> getFewShotExamples() { return fewShotExamples; }
        public void setFewShotExamples(List<Example> fewShotExamples) { this.fewShotExamples = fewShotExamples; }
        
        public List<String> getChainOfThought() { return chainOfThought; }
        public void setChainOfThought(List<String> chainOfThought) { this.chainOfThought = chainOfThought; }
    }

    public static class Persona {
        private String role;
        private String expertise;
        private String tone;

        // Getters and Setters
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        
        public String getExpertise() { return expertise; }
        public void setExpertise(String expertise) { this.expertise = expertise; }
        
        public String getTone() { return tone; }
        public void setTone(String tone) { this.tone = tone; }
    }

    public static class Example {
        private String input;
        private String analysis;
        private String output;

        // Getters and Setters
        public String getInput() { return input; }
        public void setInput(String input) { this.input = input; }
        
        public String getAnalysis() { return analysis; }
        public void setAnalysis(String analysis) { this.analysis = analysis; }
        
        public String getOutput() { return output; }
        public void setOutput(String output) { this.output = output; }
    }

    public static class Variable {
        private String name;
        private String type;
        private boolean required;
        private String description;
        
        @JsonProperty("default_value")
        private String defaultValue;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public boolean isRequired() { return required; }
        public void setRequired(boolean required) { this.required = required; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getDefaultValue() { return defaultValue; }
        public void setDefaultValue(String defaultValue) { this.defaultValue = defaultValue; }
    }

    public static class TestCase {
        private String name;
        private Map<String, Object> inputs;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public Map<String, Object> getInputs() { return inputs; }
        public void setInputs(Map<String, Object> inputs) { this.inputs = inputs; }
    }
} 