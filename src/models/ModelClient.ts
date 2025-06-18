import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { ApiKeyManager } from '../auth/ApiKeyManager';
import { ModelType, CompiledPrompt } from '../types/PromptTypes';

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

    // TODO: Implement Anthropic API integration
    // For now, return a placeholder response
    return {
      content: `[Claude ${model} integration coming soon - this is a placeholder response]`,
      tokens: 100,
      cost_estimate: 0.01
    };
  }

  private async callGemini(model: ModelType, prompt: CompiledPrompt, apiKey?: string | undefined): Promise<ModelResponse> {
    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    // TODO: Implement Google Gemini API integration
    // For now, return a placeholder response
    return {
      content: `[Gemini ${model} integration coming soon - this is a placeholder response]`,
      tokens: 100,
      cost_estimate: 0.01
    };
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