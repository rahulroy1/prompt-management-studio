import * as vscode from 'vscode';
import { PromptEvaluator } from '../evaluator/PromptEvaluator';

export class PromptIDEProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'promptStudio.promptIDE';

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly evaluator: PromptEvaluator
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = this.getWebviewContent();
  }

  async openPromptIDE(uri: vscode.Uri): Promise<void> {
    // TODO: Implement Prompt IDE functionality
    vscode.window.showInformationMessage('Prompt IDE will be implemented soon!');
  }

  private getWebviewContent(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prompt IDE</title>
      </head>
      <body>
        <h1>Prompt IDE</h1>
        <p>Coming soon...</p>
      </body>
      </html>
    `;
  }
} 