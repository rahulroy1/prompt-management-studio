import { PromptFile, CompiledPrompt } from '../types/PromptTypes';

/**
 * Compiles structured prompts into provider-specific API call formats.
 * 
 * The PromptCompiler takes a structured prompt definition and converts it into
 * the message format expected by AI model APIs. It handles variable substitution,
 * system message construction, few-shot examples, and provider-specific formatting.
 * 
 * @example
 * ```typescript
 * const compiler = new PromptCompiler();
 * const compiled = compiler.compile(promptFile, { user_input: 'Hello world' });
 * // Returns CompiledPrompt ready for API calls
 * ```
 */
export class PromptCompiler {
  /**
   * Compiles a structured prompt into a format suitable for AI model APIs.
   * 
   * This method performs the following operations:
   * 1. Substitutes variables in the user input template
   * 2. Builds a comprehensive system message from prompt components
   * 3. Adds few-shot examples if provided
   * 4. Formats everything into the message array expected by APIs
   * 5. Sets appropriate parameters based on output requirements
   * 
   * @param promptFile - The structured prompt definition to compile
   * @param variables - Key-value pairs for variable substitution
   * @returns CompiledPrompt ready for API calls
   * @throws {Error} When variable substitution fails or prompt structure is invalid
   * 
   * @example
   * ```typescript
   * const promptFile = {
   *   title: "Code Review",
   *   prompt: {
   *     persona: { role: "Senior Developer" },
   *     instructions: ["Review the code", "Provide feedback"]
   *   },
   *   user_input_template: "{{code_to_review}}"
   * };
   * 
   * const compiled = compiler.compile(promptFile, { 
   *   code_to_review: "function add(a, b) { return a + b; }" 
   * });
   * ```
   */
  compile(promptFile: PromptFile, variables: Record<string, any>): CompiledPrompt {
    // Replace variables in the user input template
    const userInput = this.replaceVariables(promptFile.user_input_template, variables);
    
    // Build the system message from prompt structure
    const systemMessage = this.buildSystemMessage(promptFile.prompt);
    
    // Create the message array
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
    
    // Add system message
    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage
      });
    }
    
    // Add few-shot examples if present
    if (promptFile.prompt.few_shot_examples) {
      for (const example of promptFile.prompt.few_shot_examples) {
        messages.push({
          role: 'user',
          content: example.input
        });
        messages.push({
          role: 'assistant',
          content: example.output
        });
      }
    }
    
    // Add the actual user input
    messages.push({
      role: 'user',
      content: userInput
    });

    return {
      provider: 'openai', // Default to OpenAI format
      messages,
      parameters: this.buildParameters(promptFile.prompt)
    };
  }

  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    // Replace {{variable}} patterns
    for (const [key, value] of Object.entries(variables)) {
      const pattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      result = result.replace(pattern, String(value));
    }
    
    return result;
  }

  private buildSystemMessage(prompt: any): string {
    const parts: string[] = [];
    
    // Add persona
    if (prompt.persona?.role) {
      parts.push(prompt.persona.role);
    }
    
    if (prompt.persona?.tone) {
      parts.push(`\nTone: ${prompt.persona.tone}`);
    }
    
    if (prompt.persona?.expertise && prompt.persona.expertise.length > 0) {
      parts.push(`\nExpertise: ${prompt.persona.expertise.join(', ')}`);
    }
    
    // Add instructions
    if (prompt.instructions && prompt.instructions.length > 0) {
      parts.push('\nInstructions:');
      prompt.instructions.forEach((instruction: string, index: number) => {
        parts.push(`${index + 1}. ${instruction}`);
      });
    }
    
    // Add chain of thought
    if (prompt.chain_of_thought && prompt.chain_of_thought.length > 0) {
      parts.push('\nThinking Process:');
      prompt.chain_of_thought.forEach((step: string, index: number) => {
        parts.push(`${index + 1}. ${step}`);
      });
    }
    
    // Add output format requirements
    if (prompt.output_format) {
      if (prompt.output_format.format) {
        parts.push(`\nOutput Format: ${prompt.output_format.format}`);
      }
      
      if (prompt.output_format.template) {
        parts.push(`\nOutput Template:\n${prompt.output_format.template}`);
      }
      
      if (prompt.output_format.schema) {
        parts.push(`\nOutput Schema:\n${JSON.stringify(prompt.output_format.schema, null, 2)}`);
      }
    }
    
    // Add constraints
    if (prompt.constraints && prompt.constraints.length > 0) {
      parts.push('\nConstraints:');
      prompt.constraints.forEach((constraint: string) => {
        parts.push(`- ${constraint}`);
      });
    }
    
    return parts.join('\n');
  }

  private buildParameters(prompt: any): Record<string, any> | undefined {
    const params: Record<string, any> = {};
    
    // Set temperature based on use case
    if (prompt.output_format?.format === 'json') {
      params['temperature'] = 0.1; // Lower temperature for structured output
    }
    
    // Add response format for structured outputs
    if (prompt.output_format?.format === 'json') {
      params['response_format'] = { type: 'json_object' };
    }
    
    return Object.keys(params).length > 0 ? params : undefined;
  }
} 