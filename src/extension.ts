import * as vscode from 'vscode';
import { PromptEvaluator } from './evaluator/PromptEvaluator';
import { PromptIDEProvider } from './ide/PromptIDEProvider';
import { PromptCreator } from './creator/PromptCreator';
import { ApiKeyManager } from './auth/ApiKeyManager';
import { PromptBuilderProvider } from './builder/PromptBuilderProvider';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  // Create output channel for logging
  outputChannel = vscode.window.createOutputChannel('Prompt Studio');
  context.subscriptions.push(outputChannel);
  
  outputChannel.appendLine('Prompt Studio extension is now active!');

  // Initialize services
  const apiKeyManager = new ApiKeyManager(context);
  const promptEvaluator = new PromptEvaluator(apiKeyManager);
  const promptIDEProvider = new PromptIDEProvider(context, promptEvaluator);
  const promptCreator = new PromptCreator();

  // Register commands
  const commands = [
    vscode.commands.registerCommand('promptStudio.evaluatePrompt', async (uri?: vscode.Uri) => {
      const activeEditor = vscode.window.activeTextEditor;
      const targetUri = uri || activeEditor?.document.uri;
      
      if (!targetUri || !targetUri.fsPath.endsWith('.prompt.json')) {
        vscode.window.showErrorMessage('Please open a .prompt.json file to evaluate');
        return;
      }

      try {
        await promptEvaluator.evaluatePrompt(targetUri);
      } catch (error) {
        outputChannel.appendLine(`Failed to evaluate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
        vscode.window.showErrorMessage(`Failed to evaluate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

    vscode.commands.registerCommand('promptStudio.openPromptIDE', async (uri?: vscode.Uri) => {
      const activeEditor = vscode.window.activeTextEditor;
      const targetUri = uri || activeEditor?.document.uri;
      
      if (!targetUri || !targetUri.fsPath.endsWith('.prompt.json')) {
        vscode.window.showErrorMessage('Please open a .prompt.json file to use the Prompt IDE');
        return;
      }

      try {
        await promptIDEProvider.openPromptIDE(targetUri);
      } catch (error) {
        outputChannel.appendLine(`Failed to open Prompt IDE: ${error instanceof Error ? error.message : 'Unknown error'}`);
        vscode.window.showErrorMessage(`Failed to open Prompt IDE: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

    vscode.commands.registerCommand('promptStudio.createPrompt', async (uri?: vscode.Uri) => {
      try {
        await promptCreator.createNewPrompt(uri);
      } catch (error) {
        outputChannel.appendLine(`Failed to create prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
        vscode.window.showErrorMessage(`Failed to create prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

    vscode.commands.registerCommand('promptStudio.configureApiKeys', async () => {
      try {
        await apiKeyManager.configureApiKeys();
      } catch (error) {
        outputChannel.appendLine(`Failed to configure API keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
        vscode.window.showErrorMessage(`Failed to configure API keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    })
  ];

  // Register providers
  const providers = [
    vscode.window.registerWebviewViewProvider('promptStudio.promptIDE', promptIDEProvider),
    PromptBuilderProvider.register(context, apiKeyManager)
  ];

  // Add all disposables to context
  context.subscriptions.push(...commands, ...providers);

  // Show welcome message on first activation
  const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
  if (!hasShownWelcome) {
    showWelcomeMessage(context);
    context.globalState.update('hasShownWelcome', true);
  }
}

async function showWelcomeMessage(_context: vscode.ExtensionContext) {
  const action = await vscode.window.showInformationMessage(
    'Welcome to Prompt Studio! Create your first prompt or configure API keys to get started.',
    'Create Prompt',
    'Configure API Keys',
    'Learn More'
  );

  switch (action) {
    case 'Create Prompt':
      vscode.commands.executeCommand('promptStudio.createPrompt');
      break;
    case 'Configure API Keys':
      vscode.commands.executeCommand('promptStudio.configureApiKeys');
      break;
    case 'Learn More':
      vscode.env.openExternal(vscode.Uri.parse('https://github.com/rahulroy1/prompt-management-studio#readme'));
      break;
  }
}

export function deactivate() {
  outputChannel?.appendLine('Prompt Studio extension is now deactivated');
  outputChannel?.dispose();
} 