import * as vscode from 'vscode';
import { ModelCredentials, ModelType } from '../types/PromptTypes';

/**
 * Interface for provider selection in the configuration UI
 */
interface ProviderChoice {
  label: string;
  description: string;
  provider: string;
}

/**
 * Manages secure storage and retrieval of AI model API keys using VS Code's SecretStorage.
 * 
 * This class provides a secure way to store API credentials for different AI providers
 * (OpenAI, Anthropic, Google) and ensures proper validation and access control.
 * 
 * @example
 * ```typescript
 * const apiKeyManager = new ApiKeyManager(context);
 * await apiKeyManager.configureApiKeys();
 * const credentials = await apiKeyManager.getCredentials();
 * ```
 */
export class ApiKeyManager {
  private readonly secretStorage: vscode.SecretStorage;

  /**
   * Creates a new ApiKeyManager instance
   * @param context - VS Code extension context for accessing SecretStorage
   */
  constructor(private context: vscode.ExtensionContext) {
    this.secretStorage = context.secrets;
  }

  /**
   * Opens a user interface for configuring API keys for different AI providers.
   * 
   * Presents a quick pick menu allowing users to:
   * - Configure individual provider API keys (OpenAI, Anthropic, Google)
   * - View currently configured keys
   * - Remove all stored keys
   * 
   * @throws {Error} When API key validation fails
   * @example
   * ```typescript
   * const apiKeyManager = new ApiKeyManager(context);
   * await apiKeyManager.configureApiKeys();
   * ```
   */
  async configureApiKeys(): Promise<void> {
    const choice = await vscode.window.showQuickPick([
      { label: 'OpenAI', description: 'Configure OpenAI API key', provider: 'openai' },
      { label: 'Anthropic (Claude)', description: 'Configure Anthropic API key', provider: 'anthropic' },
      { label: 'Google (Gemini)', description: 'Configure Google API key', provider: 'google' },
      { label: 'View All Keys', description: 'View configured API keys', provider: 'view' },
      { label: 'Remove All Keys', description: 'Remove all stored API keys', provider: 'remove' }
    ] as ProviderChoice[], {
      placeHolder: 'Select AI provider to configure'
    });

    if (!choice) return;

    switch (choice.provider) {
      case 'openai':
        await this.configureOpenAIKey();
        break;
      case 'anthropic':
        await this.configureAnthropicKey();
        break;
      case 'google':
        await this.configureGoogleKey();
        break;
      case 'view':
        await this.viewConfiguredKeys();
        break;
      case 'remove':
        await this.removeAllKeys();
        break;
    }
  }

  private async configureOpenAIKey(): Promise<void> {
    const apiKey = await vscode.window.showInputBox({
      prompt: 'Enter your OpenAI API key',
      password: true,
      placeHolder: 'sk-...',
      validateInput: (value: string) => {
        if (!value || !value.startsWith('sk-')) {
          return 'OpenAI API key must start with "sk-"';
        }
        return null;
      }
    });

    if (apiKey) {
      await this.secretStorage.store('promptStudio.openai_api_key', apiKey);
      vscode.window.showInformationMessage('OpenAI API key configured successfully');
    }
  }

  private async configureAnthropicKey(): Promise<void> {
    const apiKey = await vscode.window.showInputBox({
      prompt: 'Enter your Anthropic API key',
      password: true,
      placeHolder: 'sk-ant-...',
      validateInput: (value: string) => {
        if (!value || !value.startsWith('sk-ant-')) {
          return 'Anthropic API key must start with "sk-ant-"';
        }
        return null;
      }
    });

    if (apiKey) {
      await this.secretStorage.store('promptStudio.anthropic_api_key', apiKey);
      vscode.window.showInformationMessage('Anthropic API key configured successfully');
    }
  }

  private async configureGoogleKey(): Promise<void> {
    const apiKey = await vscode.window.showInputBox({
      prompt: 'Enter your Google API key',
      password: true,
      placeHolder: 'AIza...',
      validateInput: (value: string) => {
        if (!value || value.length < 20) {
          return 'Please enter a valid Google API key';
        }
        return null;
      }
    });

    if (apiKey) {
      await this.secretStorage.store('promptStudio.google_api_key', apiKey);
      vscode.window.showInformationMessage('Google API key configured successfully');
    }
  }

  private async viewConfiguredKeys(): Promise<void> {
    const credentials = await this.getCredentials();
    const configured: string[] = [];
    
    if (credentials.openai_api_key) {
      configured.push('✅ OpenAI');
    } else {
      configured.push('❌ OpenAI');
    }
    
    if (credentials.anthropic_api_key) {
      configured.push('✅ Anthropic');
    } else {
      configured.push('❌ Anthropic');
    }
    
    if (credentials.google_api_key) {
      configured.push('✅ Google');
    } else {
      configured.push('❌ Google');
    }

    const message = `API Key Status:\n${configured.join('\n')}`;
    vscode.window.showInformationMessage(message);
  }

  private async removeAllKeys(): Promise<void> {
    const confirm = await vscode.window.showWarningMessage(
      'This will remove all stored API keys. Are you sure?',
      { modal: true },
      'Yes, Remove All'
    );

    if (confirm === 'Yes, Remove All') {
      await Promise.all([
        this.secretStorage.delete('promptStudio.openai_api_key'),
        this.secretStorage.delete('promptStudio.anthropic_api_key'),
        this.secretStorage.delete('promptStudio.google_api_key')
      ]);
      vscode.window.showInformationMessage('All API keys removed successfully');
    }
  }

  /**
   * Retrieves all stored API credentials from secure storage.
   * 
   * @returns Promise resolving to ModelCredentials object with available API keys
   * @example
   * ```typescript
   * const credentials = await apiKeyManager.getCredentials();
   * if (credentials.openai_api_key) {
   *   // OpenAI key is available
   * }
   * ```
   */
  async getCredentials(): Promise<ModelCredentials> {
    const [openaiKey, anthropicKey, googleKey] = await Promise.all([
      this.secretStorage.get('promptStudio.openai_api_key'),
      this.secretStorage.get('promptStudio.anthropic_api_key'),
      this.secretStorage.get('promptStudio.google_api_key')
    ]);

    return {
      openai_api_key: openaiKey || undefined,
      anthropic_api_key: anthropicKey || undefined,
      google_api_key: googleKey || undefined
    };
  }

  /**
   * Checks if API credentials are available for a specific AI model.
   * 
   * @param model - The AI model to check credentials for
   * @returns Promise resolving to true if credentials are available, false otherwise
   * @example
   * ```typescript
   * const hasOpenAI = await apiKeyManager.hasCredentialsForModel('gpt-4-turbo');
   * const hasClaude = await apiKeyManager.hasCredentialsForModel('claude-3-sonnet');
   * ```
   */
  async hasCredentialsForModel(model: ModelType): Promise<boolean> {
    const credentials = await this.getCredentials();
    
    if (model.startsWith('gpt-')) {
      return !!credentials.openai_api_key;
    } else if (model.startsWith('claude-')) {
      return !!credentials.anthropic_api_key;
    } else if (model.startsWith('gemini-')) {
      return !!credentials.google_api_key;
    }
    
    return false;
  }

  /**
   * Ensures API credentials are available for all specified models.
   * 
   * If any credentials are missing, prompts the user to configure them.
   * This is typically called before running evaluations to ensure all required
   * API keys are available.
   * 
   * @param models - Array of AI models that need credentials
   * @returns Promise resolving to true if all credentials are available, false if user cancelled
   * @example
   * ```typescript
   * const models: ModelType[] = ['gpt-4-turbo', 'claude-3-sonnet'];
   * const ready = await apiKeyManager.ensureCredentialsForModels(models);
   * if (ready) {
   *   // Proceed with evaluation
   * }
   * ```
   */
  async ensureCredentialsForModels(models: ModelType[]): Promise<boolean> {
    const missingCredentials: string[] = [];
    
    for (const model of models) {
      const hasCredentials = await this.hasCredentialsForModel(model);
      if (!hasCredentials) {
        if (model.startsWith('gpt-') && !missingCredentials.includes('OpenAI')) {
          missingCredentials.push('OpenAI');
        } else if (model.startsWith('claude-') && !missingCredentials.includes('Anthropic')) {
          missingCredentials.push('Anthropic');
        } else if (model.startsWith('gemini-') && !missingCredentials.includes('Google')) {
          missingCredentials.push('Google');
        }
      }
    }

    if (missingCredentials.length > 0) {
      const action = await vscode.window.showWarningMessage(
        `Missing API keys for: ${missingCredentials.join(', ')}. Configure them now?`,
        'Configure Keys',
        'Cancel'
      );

      if (action === 'Configure Keys') {
        await this.configureApiKeys();
        // Re-check after configuration
        return this.ensureCredentialsForModels(models);
      }
      
      return false;
    }

    return true;
  }
} 