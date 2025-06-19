import * as vscode from 'vscode';
import * as path from 'path';
import { PromptFile, ModelType } from '../types/PromptTypes';
import { ApiKeyManager } from '../auth/ApiKeyManager';

export class PromptBuilderProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext, apiKeyManager: ApiKeyManager): vscode.Disposable {
    const provider = new PromptBuilderProvider(context, apiKeyManager);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      'promptStudio.promptBuilder',
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      }
    );
    return providerRegistration;
  }

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly apiKeyManager: ApiKeyManager
  ) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup webview options
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    // Set webview content
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document);

      // Handle changes from webview
  webviewPanel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.type) {
        case 'save':
          await this.savePrompt(document, message.prompt);
          break;
        case 'test':
          await this.testPrompt(webviewPanel.webview, message.prompt, message.testInput);
          break;
        case 'export':
          await this.exportPrompt(message.prompt, message.format);
          break;
        case 'checkApiKey':
          await this.checkApiKey(message.family);
          break;
      }
    }
  );

    // Handle document changes
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        this.updateWebview(webviewPanel.webview, document);
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Initialize webview with current document content
    this.updateWebview(webviewPanel.webview, document);
  }

  private getHtmlForWebview(webview: vscode.Webview, document: vscode.TextDocument): string {
    // Get resource URIs
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'promptBuilder.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'promptBuilder.css')
    );

    // Use a nonce to only allow specific scripts
    const nonce = this.getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
        <title>Prompt Builder</title>
      </head>
      <body>
        <div id="prompt-builder-app">
          <div class="builder-container">
            <div class="builder-section">
              <h2>Design</h2>
              <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" id="title" placeholder="Enter prompt title" />
              </div>
              
              <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" placeholder="Describe what this prompt does"></textarea>
              </div>

              <div class="form-group">
                <label for="persona-role">Persona Role:</label>
                <textarea id="persona-role" placeholder="You are a helpful assistant..."></textarea>
              </div>

              <div class="form-group">
                <label for="instructions">Instructions:</label>
                <div id="instructions-list"></div>
                <button id="add-instruction">+ Add Instruction</button>
              </div>

              <div class="form-group advanced-section">
                <label for="chain-of-thought">Chain of Thought (Optional):</label>
                <div id="chain-of-thought-list"></div>
                <button id="add-chain-step">+ Add Reasoning Step</button>
              </div>

              <div class="form-group advanced-section">
                <label for="examples">Few-Shot Examples (Optional):</label>
                <div id="examples-list"></div>
                <button id="add-example">+ Add Example</button>
              </div>

              <div class="form-group">
                <label for="user-input-template">User Input Template:</label>
                <textarea id="user-input-template" placeholder="{{user_query}}"></textarea>
              </div>

              <div class="form-group advanced-section">
                <label for="output-format">Expected Output Format (Optional):</label>
                <select id="output-format-type">
                  <option value="">Auto</option>
                  <option value="text">Plain Text</option>
                  <option value="json">JSON</option>
                  <option value="markdown">Markdown</option>
                  <option value="code">Code</option>
                </select>
                <textarea id="output-format-schema" placeholder="Describe the expected format or provide JSON schema..." style="margin-top: 8px;"></textarea>
              </div>
            </div>

            <div class="test-section">
              <h2>Test</h2>
              <div class="form-group">
                <label>Models to Test</label>
                <div id="model-selection-list">
                  <!-- Model rows will be dynamically inserted here -->
                </div>
                <button id="add-model-btn" class="add-btn" title="Add another model to the test run">+ Add Model</button>
              </div>
              
              <div class="test-input">
                <textarea id="test-input" placeholder="Enter test input..."></textarea>
                <div class="test-buttons">
                  <button id="run-test">🚀 Test Now</button>
                  <button id="clear-test" class="secondary-btn">🧹 Clear</button>
                </div>
              </div>

              <div id="test-results"></div>
            </div>

            <div class="export-section">
              <h2>Share</h2>
              <button id="save-prompt">💾 Save</button>
              <button id="export-json">📄 Export JSON</button>
              <button id="export-package">📦 Export Package</button>
              <button id="share-team">👥 Share with Team</button>
            </div>
          </div>
        </div>

        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }

  private updateWebview(webview: vscode.Webview, document: vscode.TextDocument) {
    try {
      const promptData = JSON.parse(document.getText());
      webview.postMessage({
        type: 'load',
        prompt: promptData
      });
    } catch (error) {
      console.error('Failed to parse prompt JSON:', error);
    }
  }

  private async savePrompt(document: vscode.TextDocument, promptData: PromptFile) {
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(document.getText().length)
    );
    
    edit.replace(document.uri, fullRange, JSON.stringify(promptData, null, 2));
    await vscode.workspace.applyEdit(edit);
  }

  private async testPrompt(webview: vscode.Webview, promptData: PromptFile, testInput: string) {
    try {
      // Create a temporary prompt object for testing
      const testPrompt = {
        ...promptData,
        test_cases: [{
          name: 'Visual Builder Test',
          inputs: {
            user_query: testInput
          }
        }]
      };
      
      // Also update the main prompt data to persist the test case
      if (!promptData.test_cases || promptData.test_cases.length === 0) {
        promptData.test_cases = [{ name: 'Default Test Case', inputs: { user_query: '' } }];
      }

      // Assuming the first test case is the one used in the builder
      const firstInputKey = Object.keys(promptData.test_cases[0]!.inputs)[0] || 'user_query';
      promptData.test_cases[0]!.inputs[firstInputKey] = testInput;

      // Import required classes
      const { PromptCompiler } = await import('../compiler/PromptCompiler');
      const { ModelClient } = await import('../models/ModelClient');
      
      const compiler = new PromptCompiler();
      const modelClient = new ModelClient(this.apiKeyManager);
      
      // Get selected models or default ones
      const modelsToTest = promptData.models || ['gpt-4o-mini'];
      
      // Ensure we have credentials
      const hasCredentials = await this.apiKeyManager.ensureCredentialsForModels(modelsToTest);
      if (!hasCredentials) {
        webview.postMessage({
          type: 'testResults',
          results: [],
          error: 'No API credentials configured. Please configure API keys first.'
        });
        return;
      }

      const results = [];
      const testCase = testPrompt.test_cases[0];
      if (!testCase) {
        webview.postMessage({
          type: 'testResults',
          results: [],
          error: 'No test case available for testing'
        });
        return;
      }

      // Test with each selected model
      for (const model of modelsToTest) {
        try {
          const startTime = Date.now();
          
          // Compile the prompt
          const compiledPrompt = compiler.compile(testPrompt, testCase.inputs);
          
          // Call the model
          const response = await modelClient.callModel(model, compiledPrompt);
          
          const endTime = Date.now();
          const latency = endTime - startTime;

          results.push({
            model,
            response: response.content,
            metadata: {
              latency,
              tokens: response.tokens || 0,
              cost_estimate: response.cost_estimate || 0
            },
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          results.push({
            model,
            response: '',
            metadata: {
              latency: 0,
              tokens: 0,
              error: error instanceof Error ? error.message : 'Unknown error'
            },
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Send results back to webview
      webview.postMessage({
        type: 'testResults',
        results: results
      });
      
    } catch (error) {
      console.error('Test failed:', error);
      webview.postMessage({
        type: 'testResults',
        results: [],
        error: error instanceof Error ? error.message : 'Test failed'
      });
    }
  }

  private async exportPrompt(promptData: PromptFile, format: string) {
    // Handle different export formats
    switch (format) {
      case 'json':
        await this.exportAsJSON(promptData);
        break;
      case 'package':
        await this.exportAsPackage(promptData);
        break;
    }
  }

  private async exportAsJSON(promptData: PromptFile) {
    const options: vscode.SaveDialogOptions = {
      defaultUri: vscode.Uri.joinPath(this.context.extensionUri, 'untitled.prompt.json'),
      filters: {
        'Prompt JSON': ['prompt.json'],
        'JSON': ['json']
      }
    };

    const uri = await vscode.window.showSaveDialog(options);
    if (uri) {
      await vscode.workspace.fs.writeFile(
        uri,
        Buffer.from(JSON.stringify(promptData, null, 2))
      );
      vscode.window.showInformationMessage(`Exported to ${uri.fsPath}`);
    }
  }

  private async exportAsPackage(promptData: PromptFile) {
    // Create a complete package with documentation, test results, etc.
    // Implementation will include performance data and usage instructions
    vscode.window.showInformationMessage('Package export coming soon!');
  }

  private getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private async checkApiKey(family: string) {
    const modelMap: { [key: string]: ModelType[] } = {
        'OpenAI': ['gpt-4o-mini'],
        'Anthropic': ['claude-3-5-sonnet-20240620'],
        'Google': ['gemini-1.5-pro-latest']
    };

    const models = modelMap[family];
    if (models) {
        await this.apiKeyManager.ensureCredentialsForModels(models);
    }
  }
} 