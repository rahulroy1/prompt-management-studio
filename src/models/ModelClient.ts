import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApiKeyManager } from '../auth/ApiKeyManager';
import { ModelType, CompiledPrompt } from '../types/PromptTypes';

type AnthropicMessageParam = Anthropic.Messages.MessageParam;

export interface ModelResponse {
  content: string;
  tokens?: number | undefined;
  cost_estimate?: number | undefined;
}

export class ModelClient {
  constructor(private apiKeyManager: ApiKeyManager) {}

  async callModel(model: ModelType, prompt: CompiledPrompt): Promise<ModelResponse> {
    const credentials = await this.apiKeyManager.getCredentials();

    if (model.startsWith('gpt-')) {
      return this.callOpenAI(model, prompt, credentials.openai_api_key);
    } else if (model.startsWith('claude-')) {
      return this.callAnthropic(model, prompt, credentials.anthropic_api_key);
    } else if (model.startsWith('gemini-')) {
      return this.callGemini(model, prompt, credentials.google_api_key);
    }

    throw new Error(`Unsupported model: ${model}`);
  }

  private async callOpenAI(model: ModelType, prompt: CompiledPrompt, apiKey?: string | undefined): Promise<ModelResponse> {
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({ apiKey });

    try {
      const completion = await openai.chat.completions.create({
        model: this.mapOpenAIModel(model),
        messages: prompt.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 4000,
        temperature: 0.1,
        ...(prompt.parameters || {})
      });

      const response = completion.choices[0]?.message?.content || '';
      const tokens = completion.usage?.total_tokens || 0;

      return {
        content: response,
        tokens,
        cost_estimate: this.estimateOpenAICost(model, tokens)
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async callAnthropic(model: ModelType, prompt: CompiledPrompt, apiKey?: string | undefined): Promise<ModelResponse> {
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const anthropic = new Anthropic({ apiKey });
    const { system, messages } = this.formatAnthropicPrompt(prompt);

    try {
      const response = await anthropic.messages.create({
        model: this.mapAnthropicModel(model),
        ...(system && { system }),
        messages,
        max_tokens: 4096,
        temperature: 0.1,
      });

      const content = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');
        
      const { input_tokens, output_tokens } = response.usage;
      const total_tokens = input_tokens + output_tokens;

      return {
        content,
        tokens: total_tokens,
        cost_estimate: this.estimateAnthropicCost(model, input_tokens, output_tokens),
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async callGemini(model: ModelType, prompt: CompiledPrompt, apiKey?: string | undefined): Promise<ModelResponse> {
    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const gemini = genAI.getGenerativeModel({ model: this.mapGeminiModel(model) });

    const { contents, systemInstruction } = this.formatGeminiPrompt(prompt);

    try {
      const result = await gemini.generateContent({
        contents,
        systemInstruction,
      });

      const response = result.response;
      const content = response.text();
      // Note: Google's SDK does not provide token counts directly in the response yet.
      // This is a known limitation. We can estimate or wait for SDK updates.
      const tokens = 0; // Placeholder

      return {
        content,
        tokens,
        cost_estimate: 0, // Placeholder until token count is available
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mapOpenAIModel(model: ModelType): string {
    switch (model) {
      case 'gpt-4-turbo':
        return 'gpt-4-turbo-preview';
      case 'gpt-4':
        return 'gpt-4';
      case 'gpt-3.5-turbo':
        return 'gpt-3.5-turbo';
      default:
        return 'gpt-4-turbo-preview';
    }
  }

  private mapAnthropicModel(model: ModelType): string {
    switch (model) {
      case 'claude-3-opus':
        return 'claude-3-opus-20240229';
      case 'claude-3-sonnet':
        return 'claude-3-sonnet-20240229';
      case 'claude-3-haiku':
        return 'claude-3-haiku-20240307';
      default:
        return 'claude-3-sonnet-20240229';
    }
  }

  private mapGeminiModel(model: ModelType): string {
    switch (model) {
      case 'gemini-1.5-pro-latest':
        return 'gemini-1.5-pro-latest';
      case 'gemini-1.5-flash-latest':
        return 'gemini-1.5-flash-latest';
      case 'gemini-pro':
        return 'gemini-pro';
      default:
        return 'gemini-1.5-pro-latest';
    }
  }

  private formatAnthropicPrompt(prompt: CompiledPrompt): { system: string | undefined; messages: Anthropic.MessageParam[] } {
    let system: string | undefined = undefined;
    const messages: Anthropic.MessageParam[] = [];

    // Anthropic uses a 'system' parameter for the system role
    const systemMessage = prompt.messages.find(msg => msg.role === 'system');
    if (systemMessage) {
      system = systemMessage.content;
    }

    // Filter out system messages and format the rest
    prompt.messages
      .filter(msg => msg.role !== 'system')
      .forEach(msg => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      });

    return { system, messages };
  }

  private formatGeminiPrompt(prompt: CompiledPrompt): { systemInstruction?: any; contents: any[] } {
    let systemInstruction: any | undefined = undefined;
    const contents: any[] = [];

    const systemMessage = prompt.messages.find(msg => msg.role === 'system');
    if (systemMessage) {
      systemInstruction = { role: 'system', parts: [{ text: systemMessage.content }] };
    }
    
    // Gemini uses a 'model' role for assistant messages
    prompt.messages
      .filter(msg => msg.role !== 'system')
      .forEach(msg => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      });
      
    return { systemInstruction, contents };
  }

  private estimateOpenAICost(model: ModelType, tokens: number): number {
    // Rough cost estimates per 1K tokens (as of 2024)
    const costPer1k = {
      'gpt-4-turbo': 0.01,
      'gpt-4': 0.03,
      'gpt-3.5-turbo': 0.001
    };

    const rate = costPer1k[model as keyof typeof costPer1k] || 0.01;
    return (tokens / 1000) * rate;
  }

  private estimateAnthropicCost(model: ModelType, inputTokens: number, outputTokens: number): number {
    // Rough cost estimates per 1K tokens (as of 2024)
    const costs = {
      'claude-3-opus': { input: 0.015, output: 0.075 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 }
    };

    const modelCosts = costs[model as keyof typeof costs] || costs['claude-3-sonnet'];
    return (inputTokens / 1000) * modelCosts.input + (outputTokens / 1000) * modelCosts.output;
  }
} 