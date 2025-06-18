import * as vscode from 'vscode';
import { ModelCredentials, ModelType } from '../types/PromptTypes';

interface ProviderChoice {
  label: string;
  description: string;
  provider: string;
}

export class ApiKeyManager {
  private readonly secretStorage: vscode.SecretStorage;

  constructor(private context: vscode.ExtensionContext) {
    this.secretStorage = context.secrets;
  }

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