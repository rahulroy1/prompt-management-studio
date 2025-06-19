import * as vscode from 'vscode';
import { PromptEvaluator } from '../evaluator/PromptEvaluator';

export class PromptIDEProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'promptStudio.promptIDE';

  constructor(
    private readonly _context: vscode.ExtensionContext,
    private readonly _evaluator: PromptEvaluator
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void | Promise<void> {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri]
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'createPrompt':
          await vscode.commands.executeCommand('promptStudio.createPrompt');
          break;
        case 'openPrompt':
          await this.openPromptFile();
          break;
        case 'evaluate': {
          const activeEditor = vscode.window.activeTextEditor;
          if (activeEditor && activeEditor.document.fileName.endsWith('.prompt.json')) {
            await vscode.commands.executeCommand('promptStudio.evaluatePrompt', activeEditor.document.uri);
          } else {
            vscode.window.showWarningMessage('Please open a .prompt.json file to evaluate');
          }
          break;
        }
        case 'configureKeys':
          await vscode.commands.executeCommand('promptStudio.configureApiKeys');
          break;
      }
    });

    // Update webview when active editor changes
    vscode.window.onDidChangeActiveTextEditor(() => {
      this.updateWebviewContent(webviewView.webview);
    });
  }

  async openPromptIDE(uri: vscode.Uri): Promise<void> {
    // Open the prompt file in the custom editor
    await vscode.commands.executeCommand('vscode.openWith', uri, 'promptStudio.promptBuilder');
  }

  private async openPromptFile(): Promise<void> {
    const fileUri = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        'Prompt Files': ['prompt.json']
      }
    });

    if (fileUri && fileUri[0]) {
      await vscode.window.showTextDocument(fileUri[0]);
    }
  }

  private updateWebviewContent(webview: vscode.Webview): void {
    const activeEditor = vscode.window.activeTextEditor;
    const isPromptFile = activeEditor?.document.fileName.endsWith('.prompt.json') ?? false;
    
    webview.postMessage({
      type: 'updateState',
      hasActivePrompt: isPromptFile,
      fileName: isPromptFile ? activeEditor?.document.fileName.split('/').pop() : null
    });
  }

  private getWebviewContent(_webview: vscode.Webview): string {
    const nonce = this.getNonce();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
        <title>Prompt IDE</title>
        <style>
          body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
          }
          
          .section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
          }
          
          .section h3 {
            margin: 0 0 10px 0;
            color: var(--vscode-foreground);
          }
          
          .button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            margin: 4px;
            border-radius: 4px;
            cursor: pointer;
            font-size: var(--vscode-font-size);
          }
          
          .button:hover {
            background-color: var(--vscode-button-hoverBackground);
          }
          
          .button.secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
          }
          
          .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            font-size: 14px;
          }
          
          .status.success {
            background-color: var(--vscode-inputValidation-infoBackground);
            border: 1px solid var(--vscode-inputValidation-infoBorder);
          }
          
          .status.warning {
            background-color: var(--vscode-inputValidation-warningBackground);
            border: 1px solid var(--vscode-inputValidation-warningBorder);
          }
          
          .file-info {
            font-style: italic;
            color: var(--vscode-descriptionForeground);
          }
        </style>
      </head>
      <body>
        <div class="section">
          <h3>📝 Quick Actions</h3>
          <button class="button" onclick="createPrompt()">New Prompt</button>
          <button class="button secondary" onclick="openPrompt()">Open Prompt</button>
        </div>
        
        <div class="section">
          <h3>🧪 Current File</h3>
          <div id="fileStatus" class="status warning">
            No prompt file open
          </div>
          <button id="evaluateBtn" class="button" onclick="evaluate()" disabled>
            Evaluate Prompt
          </button>
        </div>
        
        <div class="section">
          <h3>⚙️ Settings</h3>
          <button class="button secondary" onclick="configureKeys()">
            Configure API Keys
          </button>
        </div>
        
        <div class="section">
          <h3>📚 Resources</h3>
          <p>
            <a href="https://github.com/rahulroy1/prompt-management-studio#readme" 
               style="color: var(--vscode-textLink-foreground);">
              📖 Documentation
            </a>
          </p>
          <p>
            <a href="https://github.com/rahulroy1/prompt-management-studio/tree/main/prompt-templates" 
               style="color: var(--vscode-textLink-foreground);">
              🎯 Template Library
            </a>
          </p>
        </div>

        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
          
          function createPrompt() {
            vscode.postMessage({ type: 'createPrompt' });
          }
          
          function openPrompt() {
            vscode.postMessage({ type: 'openPrompt' });
          }
          
          function evaluate() {
            vscode.postMessage({ type: 'evaluate' });
          }
          
          function configureKeys() {
            vscode.postMessage({ type: 'configureKeys' });
          }
          
          // Listen for messages from the extension
          window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.type) {
              case 'updateState':
                updateFileStatus(message.hasActivePrompt, message.fileName);
                break;
            }
          });
          
          function updateFileStatus(hasActivePrompt, fileName) {
            const statusDiv = document.getElementById('fileStatus');
            const evaluateBtn = document.getElementById('evaluateBtn');
            
            if (hasActivePrompt) {
              statusDiv.className = 'status success';
              statusDiv.innerHTML = '<span class="file-info">📄 ' + fileName + '</span><br>Ready to evaluate';
              evaluateBtn.disabled = false;
            } else {
              statusDiv.className = 'status warning';
              statusDiv.textContent = 'No prompt file open';
              evaluateBtn.disabled = true;
            }
          }
        </script>
      </body>
      </html>
    `;
  }

  private getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
} 