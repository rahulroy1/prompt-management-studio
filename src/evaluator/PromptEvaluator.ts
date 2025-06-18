import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import { ApiKeyManager } from '../auth/ApiKeyManager';
import { PromptFile, ModelType, EvaluationResult, EvaluationSession, TestCase } from '../types/PromptTypes';
import { PromptCompiler } from '../compiler/PromptCompiler';
import { ModelClient } from '../models/ModelClient';

export class PromptEvaluator {
  private compiler: PromptCompiler;
  private modelClient: ModelClient;

  constructor(private apiKeyManager: ApiKeyManager) {
    this.compiler = new PromptCompiler();
    this.modelClient = new ModelClient(apiKeyManager);
  }

  async evaluatePrompt(uri: vscode.Uri): Promise<void> {
    try {
      // Load and parse the prompt file
      const promptFile = await this.loadPromptFile(uri);
      
      // Select test case to evaluate
      const testCase = await this.selectTestCase(promptFile);
      if (!testCase) return;

      // Ensure we have credentials for the models
      const modelsToEvaluate = promptFile.models || ['gpt-4-turbo', 'claude-3-sonnet'];
      const hasCredentials = await this.apiKeyManager.ensureCredentialsForModels(modelsToEvaluate);
      if (!hasCredentials) return;

      // Start evaluation
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Evaluating prompt with ${modelsToEvaluate.length} models`,
        cancellable: true
      }, async (progress, token) => {
        const session: EvaluationSession = {
          prompt_file: uri.fsPath,
          test_case: testCase.name,
          results: [],
          started_at: new Date().toISOString()
        };

        // Evaluate with each model
        for (let i = 0; i < modelsToEvaluate.length; i++) {
          if (token.isCancellationRequested) break;

          const model = modelsToEvaluate[i];
          if (!model) continue; // Skip undefined models

          progress.report({
            message: `Evaluating with ${model}`,
            increment: (i / modelsToEvaluate.length) * 100
          });

          try {
            const result = await this.evaluateWithModel(promptFile, testCase, model);
            session.results.push(result);
          } catch (error) {
            console.error(`Failed to evaluate with ${model}:`, error);
            const errorResult: EvaluationResult = {
              model,
              response: '',
              metadata: {
                latency: 0,
                tokens: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
              },
              timestamp: new Date().toISOString()
            };
            session.results.push(errorResult);
          }
        }

        session.completed_at = new Date().toISOString();
        
        // Show results
        await this.showEvaluationResults(session);
      });

    } catch (error) {
      console.error('Failed to evaluate prompt:', error);
      vscode.window.showErrorMessage(`Failed to evaluate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async loadPromptFile(uri: vscode.Uri): Promise<PromptFile> {
    const content = await fs.readFile(uri.fsPath, 'utf8');
    const promptFile = JSON.parse(content) as PromptFile;
    
    // Validate the prompt file
    if (!promptFile.title || !promptFile.prompt || !promptFile.user_input_template) {
      throw new Error('Invalid prompt file format');
    }

    return promptFile;
  }

  private async selectTestCase(promptFile: PromptFile): Promise<TestCase | null> {
    if (!promptFile.test_cases || promptFile.test_cases.length === 0) {
      vscode.window.showErrorMessage('No test cases found in prompt file');
      return null;
    }

    if (promptFile.test_cases.length === 1) {
      return promptFile.test_cases[0] || null;
    }

    // Let user select test case
    const choices = promptFile.test_cases.map((tc, index) => ({
      label: tc.name,
      description: tc.description || '',
      detail: `Test case ${index + 1}`
    }));

    const choice = await vscode.window.showQuickPick(choices, {
      placeHolder: 'Select a test case to evaluate'
    });

    if (!choice) return null;
    
    const selectedIndex = choices.findIndex(c => c.label === choice.label);
    return selectedIndex >= 0 ? promptFile.test_cases[selectedIndex] || null : null;
  }

  private async evaluateWithModel(
    promptFile: PromptFile, 
    testCase: any, 
    model: ModelType
  ): Promise<EvaluationResult> {
    const startTime = Date.now();

    try {
      // Compile the prompt for this model
      const compiledPrompt = this.compiler.compile(promptFile, testCase.inputs);
      
      // Call the model
      const response = await this.modelClient.callModel(model, compiledPrompt);
      
      const endTime = Date.now();
      const latency = endTime - startTime;

      return {
        model,
        response: response.content,
        metadata: {
          latency,
          tokens: response.tokens || 0,
          cost_estimate: response.cost_estimate || undefined
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const endTime = Date.now();
      const latency = endTime - startTime;

      return {
        model,
        response: '',
        metadata: {
          latency,
          tokens: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private async showEvaluationResults(session: EvaluationSession): Promise<void> {
    // Create a new document to show results
    const resultDoc = await vscode.workspace.openTextDocument({
      content: this.formatEvaluationResults(session),
      language: 'markdown'
    });

    await vscode.window.showTextDocument(resultDoc, {
      viewColumn: vscode.ViewColumn.Beside
    });
  }

  private formatEvaluationResults(session: EvaluationSession): string {
    const lines = [
      `# Prompt Evaluation Results`,
      ``,
      `**File:** \`${session.prompt_file}\``,
      `**Test Case:** ${session.test_case}`,
      `**Started:** ${new Date(session.started_at).toLocaleString()}`,
      `**Completed:** ${session.completed_at ? new Date(session.completed_at).toLocaleString() : 'In progress...'}`,
      ``,
      `## Results`,
      ``
    ];

    for (const result of session.results) {
      lines.push(`### ${result.model}`);
      lines.push('');
      
      if (result.metadata.error) {
        lines.push('❌ **Error:**');
        lines.push(`\`\`\`\n${result.metadata.error}\n\`\`\``);
      } else {
        lines.push('✅ **Response:**');
        lines.push(`\`\`\`\n${result.response}\n\`\`\``);
      }
      
      lines.push('');
      lines.push('**Metadata:**');
      lines.push(`- Latency: ${result.metadata.latency}ms`);
      lines.push(`- Tokens: ${result.metadata.tokens}`);
      if (result.metadata.cost_estimate) {
        lines.push(`- Estimated Cost: $${result.metadata.cost_estimate.toFixed(4)}`);
      }
      lines.push(`- Timestamp: ${new Date(result.timestamp).toLocaleString()}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    return lines.join('\n');
  }
} 