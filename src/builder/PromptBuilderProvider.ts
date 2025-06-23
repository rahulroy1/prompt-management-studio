import * as vscode from 'vscode';
import { PromptFile, ModelType, TestCase, EvaluationResult, SchemaValidationResult } from '../types/PromptTypes';
import { ApiKeyManager } from '../auth/ApiKeyManager';
import { SchemaValidator } from '../validator/SchemaValidator';

export class PromptBuilderProvider implements vscode.CustomTextEditorProvider {
  private _isSaving = false;
  private _schemaValidator: SchemaValidator;

  public static register(_context: vscode.ExtensionContext, _apiKeyManager: ApiKeyManager): vscode.Disposable {
    const provider = new PromptBuilderProvider(_context, _apiKeyManager);
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
    private readonly _context: vscode.ExtensionContext,
    private readonly _apiKeyManager: ApiKeyManager
  ) {
    this._schemaValidator = new SchemaValidator();
  }

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
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

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
        case 'validateSchema':
          await this.validatePromptSchema(webviewPanel.webview, message.prompt, message.previousPrompt);
          break;
      }
    }
  );

    // Handle document changes
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString() && !this._isSaving) {
        this.updateWebview(webviewPanel.webview, document);
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Initialize webview with current document content
    this.updateWebview(webviewPanel.webview, document);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    // Get resource URIs
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, 'media', 'promptBuilder.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, 'media', 'promptBuilder.css')
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
            <!-- Column 1: Prompt Design -->
            <div class="builder-section">
              <h2>Design</h2>
              
              <!-- Basic Information -->
              <div class="form-group">
                <label for="title">Title: *</label>
                <input type="text" id="title" placeholder="Enter prompt title" required />
              </div>
              
              <div class="form-group">
                <label for="description">Description:</label>
                <input type="text" id="description" placeholder="Brief description from command palette" />
              </div>

              <div class="form-group">
                <label for="category">Category:</label>
                <select id="category">
                  <option value="">Select category</option>
                  <option value="code-review">Code Review</option>
                  <option value="content-generation">Content Generation</option>
                  <option value="data-analysis">Data Analysis</option>
                  <option value="customer-service">Customer Service</option>
                  <option value="documentation">Documentation</option>
                  <option value="translation">Translation</option>
                  <option value="summarization">Summarization</option>
                  <option value="creative-writing">Creative Writing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Persona Section -->
              <div class="form-group">
                <label for="persona-role">Persona (Role): *</label>
                <textarea id="persona-role" placeholder="You are a senior software engineer." required></textarea>
              </div>

              <div class="form-group">
                <button type="button" id="add-persona-tone" class="add-optional-btn">+ Add Tone</button>
                <div class="optional-section" id="persona-tone-section">
                  <label for="persona-tone">Tone:</label>
                  <textarea id="persona-tone" placeholder="e.g., Helpful and professional"></textarea>
                </div>
              </div>

              <div class="form-group">
                <button type="button" id="add-persona-expertise" class="add-optional-btn">+ Add Expertise</button>
                <div class="optional-section" id="persona-expertise-section">
                  <label for="persona-expertise">Expertise (one per line):</label>
                  <textarea id="persona-expertise" placeholder="e.g., TypeScript"></textarea>
                </div>
              </div>

              <!-- Instructions -->
              <div class="form-group">
                <label for="instructions">Instructions: *</label>
                <textarea id="instructions" placeholder="Enter instructions for the AI..." required></textarea>
              </div>

              <!-- Chain of Thought -->
              <div class="form-group">
                <label for="chain-of-thought">Chain of Thought (Optional):</label>
                <textarea id="chain-of-thought" placeholder="Describe the reasoning steps the AI should follow..."></textarea>
              </div>

              <!-- Constraints - Optional with + icon -->
              <div class="form-group">
                <div class="optional-section" id="constraints-section">
                  <label for="constraints">Constraints & Limitations:</label>
                  <textarea id="constraints" placeholder="Any limitations or constraints the AI should follow..."></textarea>
                </div>
                <button type="button" id="add-constraints" class="add-optional-btn">+ Add Constraints & Limitations</button>
              </div>

              <!-- User Input Template -->
              <div class="form-group">
                <label for="user-input-template">User Input Template: *</label>
                <textarea id="user-input-template" placeholder="{{user_query}}" required></textarea>
                <small>Use {{variable_name}} for variables that will be replaced with actual values</small>
              </div>

              <!-- Output Format -->
              <div class="form-group">
                <label for="output-format">Expected Output Format (Optional):</label>
                <select id="output-format-type">
                  <option value="">Auto</option>
                  <option value="text">Text</option>
                  <option value="json">JSON</option>
                </select>
                <textarea id="output-format-template" placeholder="Describe the expected output format or provide a template..." style="margin-top: 8px;"></textarea>
              </div>

              <!-- Few-Shot Examples -->
              <div class="form-group">
                <label for="examples">Few-Shot Examples (Optional):</label>
                <div id="examples-list"></div>
                <button type="button" id="add-example">+ Add Example</button>
              </div>
            </div>

            <!-- Column 2: Test Section -->
            <div class="test-section">
              <h2>Test</h2>
              
              <!-- Models Selection -->
              <div class="form-group">
                <label>Models to Test</label>
                <div id="model-selection-list"></div>
                <button type="button" id="add-model-btn" class="add-btn">+ Add Model</button>
              </div>
              
              <!-- Quick Test -->
              <div class="test-input">
                <label for="test-input">Quick Test Input:</label>
                <textarea id="test-input" placeholder="Enter test input..."></textarea>
                <div class="test-buttons">
                  <button id="run-test">🚀 Test Now</button>
                  <button id="clear-test" class="secondary-btn">🧹 Clear</button>
                </div>
              </div>

              <div id="test-results"></div>
            </div>

            <!-- Column 3: Metadata & Export Section -->
            <div class="metadata-section">
              <h2>Metadata & Export</h2>
              
              <!-- Metadata -->
              <div class="form-group">
                <label for="metadata-author">Author:</label>
                <input type="text" id="metadata-author" placeholder="Your name" />
              </div>

              <div class="form-group">
                <label for="metadata-version">Version:</label>
                <input type="text" id="metadata-version" placeholder="1.0.0" />
              </div>

              <div class="form-group">
                <label for="metadata-difficulty">Difficulty:</label>
                <select id="metadata-difficulty">
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div class="form-group">
                <label for="metadata-tags">Tags (comma-separated):</label>
                <input type="text" id="metadata-tags" placeholder="e.g. code-review, javascript" />
              </div>
              
              <!-- Export Buttons -->
              <div class="export-buttons">
                <button id="save-prompt">💾 Save</button>
                <button id="export-json">📄 Export JSON</button>
                <button id="export-package">📦 Export Package</button>
                <button id="share-team">👥 Share with Team</button>
              </div>
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
    this._isSaving = true;
    try {
      // Load existing prompt for schema comparison
      let existingPrompt: PromptFile | null = null;
      try {
        const existingContent = document.getText();
        if (existingContent.trim()) {
          existingPrompt = JSON.parse(existingContent);
        }
      } catch (e) {
        // Ignore parsing errors for new files
      }

      // Validate schema changes
      if (existingPrompt) {
        const schemaValidation = this._schemaValidator.validateSchemaChange(existingPrompt, promptData);
        if (!schemaValidation.is_valid) {
          const response = await this.showSchemaValidationDialog(schemaValidation);
          if (response !== 'proceed') {
            return; // User cancelled save
          }
        }
      }

      // Update prompt with schema metadata
      const updatedPrompt = this._schemaValidator.updatePromptSchema(
        promptData, 
        existingPrompt?.variable_schema
      );

      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );
      
      // First, apply the content changes to the document
      edit.replace(document.uri, fullRange, JSON.stringify(updatedPrompt, null, 2));
      const success = await vscode.workspace.applyEdit(edit);

      // If the edit was successful, then save the document to disk
      if (success) {
        await document.save();
        vscode.window.showInformationMessage('Prompt saved successfully!');
      } else {
        vscode.window.showErrorMessage('Failed to update the prompt file content.');
      }
    } finally {
      this._isSaving = false;
    }
  }

  private async runTestLoop(
    promptFile: PromptFile, 
    testCase: TestCase, 
    modelsToTest: ModelType[],
    apiKeyManager: ApiKeyManager
  ): Promise<EvaluationResult[]> {
    const { PromptCompiler } = await import('../compiler/PromptCompiler');
    const { ModelClient } = await import('../models/ModelClient');

    const compiler = new PromptCompiler();
    const modelClient = new ModelClient(apiKeyManager);
    const results: EvaluationResult[] = [];
    const testInputs = testCase.inputs;

    for (const model of modelsToTest) {
      try {
        const startTime = Date.now();
        const compiledPrompt = compiler.compile(promptFile, testInputs);
        const response = await modelClient.callModel(model, compiledPrompt);
        const endTime = Date.now();
        const latency = endTime - startTime;

        results.push({
          model,
          response: response.content || '',
          metadata: {
            latency,
            tokens: response.tokens || 0,
            cost_estimate: response.cost_estimate || 0,
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
    return results;
  }

  private async testPrompt(webview: vscode.Webview, promptData: PromptFile, testInput: string) {
    try {
      const prompt: PromptFile = promptData;
      
      // Validate the template
      const templateValidation = this.validateTemplate(prompt.user_input_template || '');
      if (!templateValidation.isValid) {
        webview.postMessage({
          type: 'testResults',
          results: [],
          error: `Template validation failed: ${templateValidation.message}`
        });
        return;
      }
      
      // Extract template variables from user_input_template
      const templateVariables = this.extractTemplateVariables(prompt.user_input_template || '{{user_input}}');
      
      // Create a well-typed inputs object
      const inputs: Record<string, string> = {};
      
      if (templateVariables.length === 1) {
        // Simple case: single variable gets the entire test input
        inputs[templateVariables[0]] = testInput;
      } else {
        // Multiple variables: use the first one for test input, others get defaults
        inputs[templateVariables[0]] = testInput;
        
        // For additional variables, try to use defaults from variable definitions
        for (let i = 1; i < templateVariables.length; i++) {
          const varName = templateVariables[i];
          const varDef = prompt.variables?.find(v => v.name === varName);
          inputs[varName] = varDef?.default || `[${varName} placeholder]`;
        }
      }
      
      // Create a well-typed TestCase object for the test run
      const testCaseForRun: TestCase = {
        name: 'Visual Builder Test',
        inputs: inputs
      };

      // Handle models with explicit type safety for strict TypeScript
      let modelsToTest: ModelType[];
      if (prompt.models && Array.isArray(prompt.models) && prompt.models.length > 0) {
        // We know prompt.models is defined and has elements
        modelsToTest = [...prompt.models]; // Create a copy to avoid any reference issues
      } else {
        // Default case
        modelsToTest = ['gpt-4o-mini'];
      }
      
      // Ensure we have credentials
      const hasCredentials = await this._apiKeyManager.ensureCredentialsForModels(modelsToTest);
      if (!hasCredentials) {
        webview.postMessage({
          type: 'testResults',
          results: [],
          error: 'No API credentials configured. Please configure API keys first.'
        });
        return;
      }
      
      // Create a temporary, well-typed PromptFile object for testing
      // This isolates the test run from the main data object
      const testPrompt: PromptFile = {
        title: prompt.title,
        prompt: prompt.prompt,
        user_input_template: prompt.user_input_template,
        test_cases: [testCaseForRun],
        models: modelsToTest
      };
      if (prompt.$schema !== undefined) testPrompt.$schema = prompt.$schema;
      if (prompt.description !== undefined) testPrompt.description = prompt.description;
      if (prompt.variables !== undefined) testPrompt.variables = prompt.variables;
      if (prompt.metadata !== undefined) testPrompt.metadata = prompt.metadata;

      const results = await this.runTestLoop(testPrompt, testCaseForRun, modelsToTest, this._apiKeyManager);
      
      // Persist the new test input back to the main prompt data object
      // This ensures that if the user saves, the test input is included
      if (prompt.test_cases) {
        const existingTestCase = prompt.test_cases.find(tc => tc.name === 'Visual Builder Test');
        if (existingTestCase) {
          existingTestCase.inputs = inputs;
        } else {
          prompt.test_cases.push(testCaseForRun);
        }
      } else {
        prompt.test_cases = [testCaseForRun];
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

  private async exportPrompt(_promptData: PromptFile, format: string) {
    switch (format) {
      case 'json':
        await this.exportAsJSON(_promptData);
        break;
      case 'package':
        await this.exportAsPackage(_promptData);
        break;
    }
  }

  private async exportAsJSON(promptData: PromptFile) {
    const options: vscode.SaveDialogOptions = {
      defaultUri: vscode.Uri.joinPath(this._context.extensionUri, 'untitled.prompt.json'),
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

  private async exportAsPackage(_promptData: PromptFile) {
    // Implementation for exporting as a package
    vscode.window.showInformationMessage('Export as package is not yet implemented.');
  }

  private extractTemplateVariables(template: string): string[] {
    const regex = /\{\{\s*([^}]+)\s*\}\}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(template)) !== null) {
      const variable = match[1].trim();
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    }
    
    return variables;
  }

  private validateTemplate(template: string): { isValid: boolean; message?: string } {
    if (!template.trim()) {
      return { isValid: false, message: 'Template cannot be empty' };
    }
    
    const variables = this.extractTemplateVariables(template);
    if (variables.length === 0) {
      return { 
        isValid: false, 
        message: 'Template must contain at least one variable (e.g., {{user_input}})' 
      };
    }
    
    return { isValid: true };
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
        await this._apiKeyManager.ensureCredentialsForModels(models);
    }
  }

  /**
   * Validates prompt schema and sends results to webview
   */
  private async validatePromptSchema(webview: vscode.Webview, currentPrompt: PromptFile, previousPrompt?: PromptFile) {
    try {
      let validationResult: SchemaValidationResult;
      
      if (previousPrompt) {
        // Compare with previous version
        validationResult = this._schemaValidator.validateSchemaChange(previousPrompt, currentPrompt);
      } else {
        // Validate against current schema
        validationResult = this._schemaValidator.validatePromptAgainstSchema(currentPrompt);
      }

      webview.postMessage({
        type: 'schemaValidationResult',
        result: validationResult
      });
    } catch (error) {
      webview.postMessage({
        type: 'schemaValidationResult',
        result: {
          is_valid: false,
          breaking_changes: [],
          warnings: [`Schema validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
          migration_required: false,
          compatibility_score: 0
        }
      });
    }
  }

  /**
   * Shows dialog for schema validation issues
   */
  private async showSchemaValidationDialog(validation: SchemaValidationResult): Promise<string> {
    const breakingCount = validation.breaking_changes.filter(c => c.impact === 'breaking').length;
    const warningCount = validation.breaking_changes.filter(c => c.impact === 'warning').length;
    
    let message = `Schema validation detected ${breakingCount} breaking change(s) and ${warningCount} warning(s):\n\n`;
    
    // Show top 5 changes
    const topChanges = validation.breaking_changes.slice(0, 5);
    for (const change of topChanges) {
      const icon = change.impact === 'breaking' ? '🚨' : change.impact === 'warning' ? '⚠️' : 'ℹ️';
      message += `${icon} ${change.migration_note}\n`;
    }
    
    if (validation.breaking_changes.length > 5) {
      message += `\n... and ${validation.breaking_changes.length - 5} more changes`;
    }
    
    message += `\nCompatibility Score: ${validation.compatibility_score}%`;
    message += '\n\nProceeding may break existing code that uses this prompt.';

    const options = ['Review Changes', 'Proceed Anyway', 'Cancel'];
    const choice = await vscode.window.showWarningMessage(message, { modal: true }, ...options);
    
    switch (choice) {
      case 'Review Changes':
        await this.showDetailedSchemaChanges(validation);
        return 'review';
      case 'Proceed Anyway':
        return 'proceed';
      default:
        return 'cancel';
    }
  }

  /**
   * Shows detailed schema changes in a new document
   */
  private async showDetailedSchemaChanges(validation: SchemaValidationResult) {
    const content = this.generateSchemaChangeReport(validation);
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'markdown'
    });
    await vscode.window.showTextDocument(doc);
  }

  /**
   * Generates a detailed schema change report
   */
  private generateSchemaChangeReport(validation: SchemaValidationResult): string {
    let report = '# Prompt Schema Validation Report\n\n';
    
    report += `**Compatibility Score:** ${validation.compatibility_score}%\n`;
    report += `**Migration Required:** ${validation.migration_required ? 'Yes' : 'No'}\n\n`;
    
    if (validation.breaking_changes.length > 0) {
      report += '## Breaking Changes\n\n';
      
      const breakingChanges = validation.breaking_changes.filter(c => c.impact === 'breaking');
      const warnings = validation.breaking_changes.filter(c => c.impact === 'warning');
      const info = validation.breaking_changes.filter(c => c.impact === 'info');
      
      if (breakingChanges.length > 0) {
        report += '### 🚨 Breaking Changes (Immediate Action Required)\n\n';
        for (const change of breakingChanges) {
          report += `- **${change.variable_name}** (${change.type})\n`;
          report += `  - ${change.migration_note}\n`;
          if (change.old_value !== undefined) {
            report += `  - Old: \`${JSON.stringify(change.old_value)}\`\n`;
          }
          if (change.new_value !== undefined) {
            report += `  - New: \`${JSON.stringify(change.new_value)}\`\n`;
          }
          report += '\n';
        }
      }
      
      if (warnings.length > 0) {
        report += '### ⚠️ Warnings (Review Recommended)\n\n';
        for (const change of warnings) {
          report += `- **${change.variable_name}** (${change.type})\n`;
          report += `  - ${change.migration_note}\n`;
          report += '\n';
        }
      }
      
      if (info.length > 0) {
        report += '### ℹ️ Information (Non-Breaking)\n\n';
        for (const change of info) {
          report += `- **${change.variable_name}** (${change.type})\n`;
          report += `  - ${change.migration_note}\n`;
          report += '\n';
        }
      }
    }
    
    report += '## Recommended Actions\n\n';
    if (validation.migration_required) {
      report += '1. **Update your code** to handle the breaking changes listed above\n';
      report += '2. **Test thoroughly** with the new variable schema\n';
      report += '3. **Update documentation** to reflect the changes\n';
    } else {
      report += '1. **Review warnings** to ensure they don\'t impact your use case\n';
      report += '2. **Consider updating** variable usage for optimal compatibility\n';
    }
    
    return report;
  }
} 