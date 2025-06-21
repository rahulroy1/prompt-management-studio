# API Reference

This document provides comprehensive API documentation for Prompt Management Studio's core components.

## Table of Contents

- [Core Interfaces](#core-interfaces)
- [ApiKeyManager](#apikeymanager)
- [PromptEvaluator](#promptevaluator)
- [PromptCompiler](#promptcompiler)
- [ModelClient](#modelclient)
- [PromptBuilderProvider](#promptbuilderprovider)
- [Types Reference](#types-reference)

---

## Core Interfaces

### PromptFile

The main interface representing a structured prompt file.

```typescript
interface PromptFile {
  $schema?: string;
  title: string;
  description?: string;
  models?: ModelType[];
  prompt: PromptStructure;
  user_input_template: string;
  variables?: Variable[];
  test_cases: TestCase[];
  metadata?: PromptMetadata;
}
```

**Properties:**
- `title` - Human-readable title for the prompt
- `prompt` - Structured prompt components (persona, instructions, etc.)
- `user_input_template` - Template with variables like `{{variable_name}}`
- `test_cases` - Array of test scenarios
- `models` - AI models to evaluate against (optional)
- `variables` - Variable definitions used in the template
- `metadata` - Author, version, tags, etc.

**Example:**
```json
{
  "title": "Code Review Assistant",
  "prompt": {
    "persona": {
      "role": "You are a senior software engineer"
    },
    "instructions": [
      "Review the code for bugs and best practices",
      "Provide constructive feedback"
    ]
  },
  "user_input_template": "{{code_to_review}}",
  "test_cases": [
    {
      "name": "Basic Test",
      "inputs": {
        "code_to_review": "function add(a, b) { return a + b; }"
      }
    }
  ]
}
```

### PromptStructure

Defines the structured components of a prompt following best practices.

```typescript
interface PromptStructure {
  persona: Persona;
  instructions: string[];
  chain_of_thought?: string[];
  few_shot_examples?: FewShotExample[];
  output_format?: OutputFormat;
  constraints?: string[];
}
```

---

## ApiKeyManager

Manages secure storage and retrieval of AI model API keys using VS Code's SecretStorage.

### Constructor

```typescript
constructor(context: vscode.ExtensionContext)
```

**Parameters:**
- `context` - VS Code extension context for accessing SecretStorage

### Methods

#### configureApiKeys()

Opens a UI for users to configure their API keys.

```typescript
async configureApiKeys(): Promise<void>
```

**Usage:**
```typescript
const apiKeyManager = new ApiKeyManager(context);
await apiKeyManager.configureApiKeys();
```

#### getCredentials()

Retrieves stored API credentials.

```typescript
async getCredentials(): Promise<ModelCredentials>
```

**Returns:**
```typescript
interface ModelCredentials {
  openai_api_key?: string;
  anthropic_api_key?: string;
  google_api_key?: string;
}
```

#### hasCredentialsForModel()

Checks if credentials are available for a specific model.

```typescript
async hasCredentialsForModel(model: ModelType): Promise<boolean>
```

**Parameters:**
- `model` - The AI model to check credentials for

**Returns:** `true` if credentials are available, `false` otherwise

#### ensureCredentialsForModels()

Ensures credentials are available for all specified models, prompting user if needed.

```typescript
async ensureCredentialsForModels(models: ModelType[]): Promise<boolean>
```

**Parameters:**
- `models` - Array of models that need credentials

**Returns:** `true` if all credentials are available, `false` if user cancelled

---

## PromptEvaluator

Core engine for evaluating prompts against multiple AI models.

### Constructor

```typescript
constructor(apiKeyManager: ApiKeyManager)
```

### Methods

#### evaluatePrompt()

Evaluates a prompt file against configured models.

```typescript
async evaluatePrompt(uri: vscode.Uri): Promise<void>
```

**Parameters:**
- `uri` - File URI of the .prompt.json file to evaluate

**Process:**
1. Loads and validates the prompt file
2. Prompts user to select a test case
3. Ensures API credentials are available
4. Runs evaluation against all configured models
5. Displays results in a side-by-side comparison

**Usage:**
```typescript
const evaluator = new PromptEvaluator(apiKeyManager);
await evaluator.evaluatePrompt(vscode.Uri.file('/path/to/prompt.json'));
```

#### Private Methods

##### loadPromptFile()

```typescript
private async loadPromptFile(uri: vscode.Uri): Promise<PromptFile>
```

Loads and validates a prompt file from disk.

##### selectTestCase()

```typescript
private async selectTestCase(promptFile: PromptFile): Promise<TestCase | null>
```

Prompts user to select a test case if multiple are available.

##### evaluateWithModel()

```typescript
private async evaluateWithModel(
  promptFile: PromptFile, 
  testCase: TestCase, 
  model: ModelType
): Promise<EvaluationResult>
```

Evaluates the prompt with a single model and returns results.

---

## PromptCompiler

Converts structured prompts into provider-specific API call formats.

### Constructor

```typescript
constructor()
```

### Methods

#### compile()

Compiles a structured prompt into a format suitable for AI model APIs.

```typescript
compile(promptFile: PromptFile, variables: Record<string, any>): CompiledPrompt
```

**Parameters:**
- `promptFile` - The structured prompt to compile
- `variables` - Values for template variables

**Returns:**
```typescript
interface CompiledPrompt {
  provider: 'openai' | 'anthropic' | 'google';
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  parameters?: Record<string, any>;
}
```

**Process:**
1. Substitutes variables in the user input template
2. Builds system message from persona and instructions
3. Adds chain-of-thought reasoning if specified
4. Includes few-shot examples
5. Formats for the target provider

**Usage:**
```typescript
const compiler = new PromptCompiler();
const compiled = compiler.compile(promptFile, { user_input: 'Hello world' });
```

#### Private Methods

##### substituteVariables()

```typescript
private substituteVariables(template: string, variables: Record<string, any>): string
```

Replaces `{{variable}}` placeholders with actual values.

##### buildSystemMessage()

```typescript
private buildSystemMessage(prompt: PromptStructure): string
```

Constructs the system message from persona, instructions, and constraints.

---

## ModelClient

Unified interface for calling different AI model providers.

### Constructor

```typescript
constructor(apiKeyManager: ApiKeyManager)
```

### Methods

#### callModel()

Makes an API call to the specified model with the compiled prompt.

```typescript
async callModel(model: ModelType, prompt: CompiledPrompt): Promise<ModelResponse>
```

**Parameters:**
- `model` - The AI model to call
- `prompt` - Compiled prompt from PromptCompiler

**Returns:**
```typescript
interface ModelResponse {
  content: string;
  tokens?: number;
  cost_estimate?: number;
}
```

**Supported Models:**
- **OpenAI:** `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`
- **Anthropic:** `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`
- **Google:** `gemini-pro`, `gemini-pro-vision`, `gemini-1.5-pro-latest`

**Usage:**
```typescript
const client = new ModelClient(apiKeyManager);
const response = await client.callModel('gpt-4-turbo', compiledPrompt);
```

#### Private Methods

##### callOpenAI()

```typescript
private async callOpenAI(
  model: ModelType, 
  prompt: CompiledPrompt, 
  apiKey: string
): Promise<ModelResponse>
```

Handles OpenAI API calls with proper formatting and error handling.

##### callAnthropic()

```typescript
private async callAnthropic(
  model: ModelType, 
  prompt: CompiledPrompt, 
  apiKey: string
): Promise<ModelResponse>
```

Handles Anthropic API calls, including system message formatting.

##### callGemini()

```typescript
private async callGemini(
  model: ModelType, 
  prompt: CompiledPrompt, 
  apiKey: string
): Promise<ModelResponse>
```

Handles Google Gemini API calls with content formatting.

---

## PromptBuilderProvider

Custom editor provider for .prompt.json files with a guided UI.

### Constructor

```typescript
constructor(context: vscode.ExtensionContext, apiKeyManager: ApiKeyManager)
```

### Static Methods

#### register()

Registers the custom editor provider with VS Code.

```typescript
static register(
  context: vscode.ExtensionContext, 
  apiKeyManager: ApiKeyManager
): vscode.Disposable
```

**Returns:** Disposable for cleanup

### Methods

#### resolveCustomTextEditor()

Called when VS Code opens a .prompt.json file with this editor.

```typescript
async resolveCustomTextEditor(
  document: vscode.TextDocument,
  webviewPanel: vscode.WebviewPanel,
  token: vscode.CancellationToken
): Promise<void>
```

**Process:**
1. Sets up webview with HTML/CSS/JS
2. Loads current document content
3. Sets up message handlers for UI interactions
4. Handles document change events

#### Private Methods

##### getHtmlForWebview()

```typescript
private getHtmlForWebview(webview: vscode.Webview): string
```

Generates the HTML content for the Prompt Builder UI.

##### updateWebview()

```typescript
private updateWebview(webview: vscode.Webview, document: vscode.TextDocument): void
```

Updates the webview when the document content changes.

##### savePrompt()

```typescript
private async savePrompt(document: vscode.TextDocument, promptData: PromptFile): Promise<void>
```

Saves changes from the UI back to the document.

---

## Types Reference

### ModelType

Union type of all supported AI models:

```typescript
type ModelType =
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'gemini-pro'
  | 'gemini-pro-vision'
  | 'gemini-1.5-pro-latest'
  | 'gemini-1.5-flash-latest';
```

### EvaluationResult

Result of evaluating a prompt with a single model:

```typescript
interface EvaluationResult {
  model: ModelType;
  response: string;
  metadata: {
    latency: number;
    tokens: number;
    cost_estimate?: number;
    error?: string;
  };
  timestamp: string;
}
```

### TestCase

Defines a test scenario with specific inputs:

```typescript
interface TestCase {
  name: string;
  description?: string;
  inputs: Record<string, any>;
  expected_output?: string;
  tags?: string[];
}
```

### Variable

Defines a template variable:

```typescript
interface Variable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description?: string;
  required?: boolean;
  default?: any;
}
```

---

## Error Handling

All async methods in the API can throw errors. Common error types:

### ApiKeyError
Thrown when API keys are missing or invalid:
```typescript
if (!apiKey) {
  throw new Error('OpenAI API key not configured');
}
```

### ValidationError
Thrown when prompt files are invalid:
```typescript
if (!promptFile.title || !promptFile.prompt) {
  throw new Error('Invalid prompt file format');
}
```

### NetworkError
Thrown when API calls fail:
```typescript
catch (error) {
  throw new Error(`OpenAI API error: ${error.message}`);
}
```

## Best Practices

### Error Handling
Always wrap API calls in try-catch blocks:

```typescript
try {
  const result = await evaluator.evaluatePrompt(uri);
} catch (error) {
  vscode.window.showErrorMessage(`Evaluation failed: ${error.message}`);
}
```

### Resource Cleanup
Use VS Code's disposable pattern:

```typescript
const subscription = vscode.workspace.onDidChangeTextDocument(handler);
context.subscriptions.push(subscription);
```

### Type Safety
Always use proper TypeScript types:

```typescript
const promptFile: PromptFile = JSON.parse(content);
const models: ModelType[] = promptFile.models || ['gpt-4-turbo'];
```

---

For more examples and usage patterns, see the [Extension Development Guide](extension-development.md). 