import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { PromptFile, PromptCategory } from '../types/PromptTypes';

export class PromptCreator {
  async createNewPrompt(uri?: vscode.Uri): Promise<void> {
    // Determine the directory to create the prompt in
    let targetDir: string;
    
    if (uri?.fsPath) {
      const stat = await vscode.workspace.fs.stat(uri);
      targetDir = stat.type === vscode.FileType.Directory ? uri.fsPath : path.dirname(uri.fsPath);
    } else {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder is open');
        return;
      }
      targetDir = workspaceFolder.uri.fsPath;
    }

    // Get prompt details from user
    const promptDetails = await this.gatherPromptDetails();
    if (!promptDetails) return;

    // Generate the prompt file
    const promptFile = this.generatePromptFile(promptDetails);
    
    // Create the file
    const fileName = `${promptDetails.fileName}.prompt.json`;
    const filePath = path.join(targetDir, fileName);

    try {
      await fs.writeFile(filePath, JSON.stringify(promptFile, null, 2), 'utf8');
      
      // Open the created file
      const document = await vscode.workspace.openTextDocument(filePath);
      await vscode.window.showTextDocument(document);
      
      vscode.window.showInformationMessage(`Created prompt file: ${fileName}`);
    } catch (error) {
      console.error('Failed to create prompt file:', error);
      vscode.window.showErrorMessage(`Failed to create prompt file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async gatherPromptDetails(): Promise<PromptDetails | null> {
    // Get prompt title
    const title = await vscode.window.showInputBox({
      prompt: 'Enter a title for your prompt',
      placeHolder: 'e.g., Code Review Assistant',
      validateInput: (value: string) => {
        if (!value || value.trim().length === 0) {
          return 'Title is required';
        }
        if (value.length > 100) {
          return 'Title must be 100 characters or less';
        }
        return null;
      }
    });

    if (!title) return null;

    // Generate file name from title
    const fileName = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Get description
    const description = await vscode.window.showInputBox({
      prompt: 'Enter a description for your prompt (optional)',
      placeHolder: 'Describe what this prompt accomplishes...'
    });

    // Select category
    const category = await vscode.window.showQuickPick([
      { label: 'Code Review', value: 'code-review' },
      { label: 'Content Generation', value: 'content-generation' },
      { label: 'Data Analysis', value: 'data-analysis' },
      { label: 'Customer Service', value: 'customer-service' },
      { label: 'Documentation', value: 'documentation' },
      { label: 'Translation', value: 'translation' },
      { label: 'Summarization', value: 'summarization' },
      { label: 'Creative Writing', value: 'creative-writing' },
      { label: 'Other', value: 'other' }
    ], {
      placeHolder: 'Select a category for this prompt'
    });

    if (!category) return null;

    // Select template
    const template = await vscode.window.showQuickPick([
      { 
        label: 'Basic Template', 
        description: 'Simple prompt with instructions',
        value: 'basic' 
      },
      { 
        label: 'Chain of Thought', 
        description: 'Step-by-step reasoning template',
        value: 'chain-of-thought' 
      },
      { 
        label: 'Few-Shot Examples', 
        description: 'Template with example inputs/outputs',
        value: 'few-shot' 
      },
      { 
        label: 'Structured Output', 
        description: 'Template for JSON/structured responses',
        value: 'structured' 
      }
    ], {
      placeHolder: 'Choose a template to start with'
    });

    if (!template) return null;

    return {
      title,
      fileName,
      description: description ? description : undefined,
      category: category.value as PromptCategory,
      template: template.value
    };
  }

  private generatePromptFile(details: PromptDetails): PromptFile {
    const basePrompt: PromptFile = {
      $schema: 'https://promptstudio.dev/schemas/v2.0/prompt.schema.json',
      title: details.title,
      description: details.description || undefined,
      models: ['gpt-4o-mini'],
      prompt: {
        persona: {
          role: 'You are a helpful AI assistant.'
        },
        instructions: ['Please help with the following task.']
      },
      user_input_template: '{{user_query}}',
      variables: [
        {
          name: 'user_query',
          type: 'string',
          description: 'The user\'s query or request',
          required: true
        }
      ],
      test_cases: [
        {
          name: 'Basic Test',
          inputs: {
            user_query: 'Hello, how are you?'
          }
        }
      ],
      metadata: {
        author: 'Prompt Studio User',
        created: new Date().toISOString(),
        version: '1.0.0',
        category: details.category,
        difficulty: 'beginner'
      }
    };

    // Customize based on template
    switch (details.template) {
      case 'chain-of-thought':
        basePrompt.prompt.chain_of_thought = [
          'First, understand the problem',
          'Then, break it down into steps',
          'Finally, provide a solution'
        ];
        break;

      case 'few-shot':
        basePrompt.prompt.few_shot_examples = [
          {
            input: 'Example input',
            output: 'Example output',
            explanation: 'This shows how to handle this type of input'
          }
        ];
        break;

      case 'structured':
        basePrompt.prompt.output_format = {
          format: 'json',
          schema: {
            type: 'object',
            properties: {
              result: { type: 'string' },
              confidence: { type: 'number' }
            },
            required: ['result']
          },
          template: '{"result": "your answer here", "confidence": 0.95}'
        };
        break;
    }

    // Customize based on category
    switch (details.category) {
      case 'code-review':
        basePrompt.prompt.persona.role = 'You are a senior software engineer conducting a thorough code review.';
        basePrompt.prompt.instructions = [
          'Review the provided code for quality, security, and best practices',
          'Identify potential bugs or issues',
          'Suggest improvements where applicable',
          'Provide constructive feedback'
        ];
        basePrompt.user_input_template = 'Please review this code:\n\n```{{language}}\n{{code}}\n```';
        basePrompt.variables = [
          {
            name: 'language',
            type: 'string',
            description: 'Programming language',
            required: true,
            default: 'javascript'
          },
          {
            name: 'code',
            type: 'string',
            description: 'Code to review',
            required: true
          }
        ];
        break;

      case 'content-generation':
        basePrompt.prompt.persona.role = 'You are a skilled content writer and creative professional.';
        basePrompt.prompt.instructions = [
          'Create engaging and well-structured content',
          'Match the specified tone and style',
          'Ensure content is relevant to the target audience'
        ];
        break;

      case 'data-analysis':
        basePrompt.prompt.persona.role = 'You are a data analyst with expertise in interpreting data and generating insights.';
        basePrompt.prompt.instructions = [
          'Analyze the provided data carefully',
          'Identify key patterns and trends',
          'Provide actionable insights',
          'Support conclusions with evidence from the data'
        ];
        break;
    }

    return basePrompt;
  }
}

interface PromptDetails {
  title: string;
  fileName: string;
  description?: string | undefined;
  category: PromptCategory;
  template: string;
} 