# Architecture Overview

This document provides a comprehensive overview of Prompt Management Studio's architecture, design decisions, and component interactions.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VS Code Extension Host                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   Builder   │  │  Evaluator   │  │    Auth Manager     │ │
│  │   (WebView) │  │   Engine     │  │  (SecretStorage)    │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │  Compiler   │  │ Model Client │  │   File System       │ │
│  │   Engine    │  │  (HTTP APIs) │  │  (.prompt.json)     │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    External Services                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   OpenAI    │  │  Anthropic   │  │      Google         │ │
│  │     API     │  │     API      │  │    Gemini API       │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Core Components

### 1. Extension Entry Point (`src/extension.ts`)

The main activation function that bootstraps the entire extension:

```typescript
export function activate(context: vscode.ExtensionContext) {
  // Initialize core services
  const apiKeyManager = new ApiKeyManager(context);
  const promptEvaluator = new PromptEvaluator(apiKeyManager);
  
  // Register custom editor for .prompt.json files
  const builderProvider = PromptBuilderProvider.register(context, apiKeyManager);
  
  // Register commands
  const evaluateCommand = vscode.commands.registerCommand(
    'promptStudio.evaluatePrompt', 
    promptEvaluator.evaluatePrompt
  );
  
  // Add to disposables for cleanup
  context.subscriptions.push(builderProvider, evaluateCommand);
}
```

**Key Responsibilities:**
- Service initialization and dependency injection
- Command registration with VS Code
- Resource cleanup management
- Extension lifecycle management

### 2. Prompt Builder UI (`src/builder/PromptBuilderProvider.ts`)

Custom editor provider that renders the guided prompt creation interface:

```typescript
class PromptBuilderProvider implements vscode.CustomTextEditorProvider {
  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    // Set up webview with HTML/CSS/JS
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
    
    // Handle messages from webview
    webviewPanel.webview.onDidReceiveMessage(message => {
      this.handleWebviewMessage(message, document);
    });
    
    // Update webview when document changes
    this.updateWebview(webviewPanel.webview, document);
  }
}
```

**Architecture Pattern:** Custom Text Editor Provider
- **UI Layer:** HTML/CSS/JavaScript in webview
- **Communication:** Message passing between webview and extension
- **State Management:** Document-driven with auto-save
- **Security:** Content Security Policy (CSP) enabled

### 3. Prompt Compilation Engine (`src/compiler/PromptCompiler.ts`)

Transforms structured prompts into API-ready formats:

```typescript
class PromptCompiler {
  compile(promptFile: PromptFile, variables: Record<string, any>): CompiledPrompt {
    // 1. Variable substitution
    const userInput = this.replaceVariables(promptFile.user_input_template, variables);
    
    // 2. System message construction
    const systemMessage = this.buildSystemMessage(promptFile.prompt);
    
    // 3. Message array assembly
    const messages = this.assembleMessages(systemMessage, userInput, examples);
    
    // 4. Provider-specific formatting
    return { provider: 'openai', messages, parameters };
  }
}
```

**Design Patterns:**
- **Strategy Pattern:** Different compilation strategies per provider
- **Template Method:** Consistent compilation pipeline
- **Builder Pattern:** Message array construction

### 4. Multi-Model Evaluation Engine (`src/evaluator/PromptEvaluator.ts`)

Orchestrates prompt testing across multiple AI models:

```typescript
class PromptEvaluator {
  async evaluatePrompt(uri: vscode.Uri): Promise<void> {
    // 1. Load and validate prompt file
    const promptFile = await this.loadPromptFile(uri);
    
    // 2. Select test case
    const testCase = await this.selectTestCase(promptFile);
    
    // 3. Ensure API credentials
    const models = this.collectModels(promptFile);
    await this.apiKeyManager.ensureCredentialsForModels(models);
    
    // 4. Run parallel evaluation
    const results = await Promise.all(
      models.map(model => this.evaluateWithModel(promptFile, testCase, model))
    );
    
    // 5. Display results
    this.showResults(results);
  }
}
```

**Concurrency Model:**
- **Parallel Execution:** Multiple API calls simultaneously
- **Error Isolation:** Individual model failures don't block others
- **Progress Reporting:** Real-time status updates

### 5. Model Client Abstraction (`src/models/ModelClient.ts`)

Unified interface for different AI model providers:

```typescript
class ModelClient {
  async callModel(model: ModelType, prompt: CompiledPrompt): Promise<ModelResponse> {
    const credentials = await this.apiKeyManager.getCredentials();
    
    // Route to appropriate provider
    if (model.startsWith('gpt-')) {
      return this.callOpenAI(model, prompt, credentials.openai_api_key!);
    } else if (model.startsWith('claude-')) {
      return this.callAnthropic(model, prompt, credentials.anthropic_api_key!);
    } else if (model.startsWith('gemini-')) {
      return this.callGemini(model, prompt, credentials.google_api_key!);
    }
    
    throw new Error(`Unsupported model: ${model}`);
  }
}
```

**Provider Abstraction:**
- **Uniform Interface:** Consistent API across providers
- **Error Handling:** Provider-specific error translation
- **Response Normalization:** Consistent response format

### 6. Secure Credential Management (`src/auth/ApiKeyManager.ts`)

Handles API key storage using VS Code's SecretStorage:

```typescript
class ApiKeyManager {
  constructor(private context: vscode.ExtensionContext) {
    this.secretStorage = context.secrets;
  }
  
  async getCredentials(): Promise<ModelCredentials> {
    // Retrieve from encrypted storage
    const [openaiKey, anthropicKey, googleKey] = await Promise.all([
      this.secretStorage.get('promptStudio.openai_api_key'),
      this.secretStorage.get('promptStudio.anthropic_api_key'),
      this.secretStorage.get('promptStudio.google_api_key')
    ]);
    
    return { openai_api_key: openaiKey, /* ... */ };
  }
}
```

**Security Features:**
- **Encrypted Storage:** Keys stored in OS keychain/credential manager
- **No Plaintext:** Keys never written to disk unencrypted
- **Scoped Access:** Keys only accessible to the extension
- **User Control:** Easy key management UI

## 🔄 Data Flow

### Prompt Creation Flow

```
User Input → WebView UI → Message Passing → Document Update → File Save
     ↓              ↓              ↓              ↓            ↓
  Form Data → JSON Message → Extension Handler → TextEdit → .prompt.json
```

### Evaluation Flow

```
Command Trigger → File Load → Test Selection → Credential Check → Compilation
       ↓              ↓           ↓               ↓              ↓
   User Action → Parse JSON → User Choice → API Key Fetch → Message Array

                                    ↓
Parallel API Calls → Response Collection → Result Display
       ↓                    ↓                    ↓
   HTTP Requests → ModelResponse[] → WebView Panel
```

### File Structure

```
.prompt.json
├── $schema: "file:///.../schemas/prompt.schema.json"
├── title: "Human-readable name"
├── description: "Optional description"
├── models: ["gpt-4-turbo", "claude-3-sonnet"]
├── prompt:
│   ├── persona: { role, tone, expertise }
│   ├── instructions: ["Step 1", "Step 2"]
│   ├── chain_of_thought: ["Think about X", "Consider Y"]
│   ├── few_shot_examples: [{ input, output, explanation }]
│   ├── output_format: { format, schema, template }
│   └── constraints: ["Must be under 100 words"]
├── user_input_template: "{{variable_name}}"
├── variables: [{ name, type, description, required, default }]
├── test_cases: [{ name, inputs, expected_output, tags }]
└── metadata: { author, version, tags, category }
```

## 🎯 Design Principles

### 1. Local-First Architecture

**Philosophy:** All data stays on the user's machine by default.

**Implementation:**
- Files stored in local filesystem
- No cloud storage or external databases
- API keys in OS-level secure storage
- Optional cloud features clearly marked

**Benefits:**
- Privacy and security
- Works offline (except API calls)
- No vendor lock-in
- Full user control

### 2. Developer-Native Experience

**Philosophy:** Integrate seamlessly into existing developer workflows.

**Implementation:**
- VS Code extension (developer's primary tool)
- File-based approach (works with Git)
- JSON format (readable and version-controllable)
- Command palette integration

**Benefits:**
- No context switching
- Version control friendly
- Scriptable and automatable
- Familiar interface

### 3. Evaluation-First Workflow

**Philosophy:** Testing should be as easy as creating prompts.

**Implementation:**
- Built-in test case management
- One-click multi-model evaluation
- Side-by-side result comparison
- Performance metrics collection

**Benefits:**
- Encourages best practices
- Faster iteration cycles
- Quality assurance built-in
- Data-driven decisions

### 4. Provider Agnostic

**Philosophy:** Don't lock users into a single AI provider.

**Implementation:**
- Unified model client interface
- Consistent prompt compilation
- Provider-specific optimizations
- Easy provider switching

**Benefits:**
- Cost optimization
- Risk mitigation
- Best tool for each job
- Future-proof architecture

## 🔧 Extension Points

### Adding New Model Providers

1. **Extend ModelType enum:**
```typescript
// src/types/PromptTypes.ts
export type ModelType = 
  | 'existing-models'
  | 'new-provider-model-1'
  | 'new-provider-model-2';
```

2. **Add provider detection:**
```typescript
// src/models/ModelClient.ts
if (model.startsWith('new-provider-')) {
  return this.callNewProvider(model, prompt, credentials.new_provider_key!);
}
```

3. **Implement provider method:**
```typescript
private async callNewProvider(
  model: ModelType, 
  prompt: CompiledPrompt, 
  apiKey: string
): Promise<ModelResponse> {
  // Provider-specific API call logic
}
```

4. **Update credential management:**
```typescript
// src/auth/ApiKeyManager.ts
// Add new provider key handling
```

### Custom UI Components

The webview architecture allows for custom UI components:

```typescript
// Add new sections to the builder
private getHtmlForWebview(webview: vscode.Webview): string {
  return `
    <div class="custom-section">
      <h3>Custom Feature</h3>
      <!-- Custom HTML -->
    </div>
  `;
}

// Handle custom messages
private handleWebviewMessage(message: any, document: vscode.TextDocument) {
  switch (message.type) {
    case 'customAction':
      // Handle custom functionality
      break;
  }
}
```

### Evaluation Metrics

Add custom metrics to the evaluation engine:

```typescript
interface EvaluationResult {
  // Existing fields
  model: ModelType;
  response: string;
  metadata: {
    latency: number;
    tokens: number;
    cost_estimate?: number;
    
    // Custom metrics
    custom_score?: number;
    custom_analysis?: CustomAnalysis;
  };
}
```

## 🚀 Performance Considerations

### Memory Management

- **Webview Disposal:** Proper cleanup of webview resources
- **Event Listener Cleanup:** All subscriptions added to context.subscriptions
- **Large File Handling:** Streaming for large prompt files
- **API Response Caching:** Optional caching for repeated evaluations

### Network Optimization

- **Parallel API Calls:** Concurrent evaluation across models
- **Request Batching:** Group multiple test cases when possible
- **Timeout Handling:** Graceful degradation for slow APIs
- **Retry Logic:** Exponential backoff for transient failures

### User Experience

- **Progressive Loading:** Show results as they arrive
- **Background Processing:** Non-blocking evaluation
- **Error Recovery:** Partial results when some models fail
- **Offline Mode:** Core functionality works without network

## 🔒 Security Model

### Credential Storage

```typescript
// Secure storage using VS Code's SecretStorage
await context.secrets.store('promptStudio.openai_api_key', apiKey);

// Keys are:
// - Encrypted at rest
// - Stored in OS keychain/credential manager
// - Only accessible to this extension
// - Never logged or transmitted except to APIs
```

### Content Security Policy

```html
<!-- Webview CSP prevents XSS attacks -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'none'; 
               style-src 'unsafe-inline'; 
               script-src 'nonce-${nonce}';">
```

### API Communication

- **HTTPS Only:** All API calls use encrypted connections
- **No Logging:** API keys never written to logs
- **Error Sanitization:** Sensitive data removed from error messages
- **Scoped Permissions:** Minimal required permissions

## 📊 Monitoring and Debugging

### Debug Mode

Enable detailed logging:

```json
// VS Code settings.json
{
  "promptStudio.debug": true
}
```

### Error Tracking

```typescript
// Structured error handling
try {
  await this.evaluatePrompt(uri);
} catch (error) {
  console.error('Evaluation failed:', {
    error: error.message,
    uri: uri.toString(),
    timestamp: new Date().toISOString()
  });
  
  vscode.window.showErrorMessage(`Evaluation failed: ${error.message}`);
}
```

### Performance Metrics

```typescript
// Track evaluation performance
const startTime = Date.now();
const result = await this.callModel(model, prompt);
const latency = Date.now() - startTime;

return {
  ...result,
  metadata: {
    ...result.metadata,
    latency
  }
};
```

---

This architecture provides a solid foundation for the "Rails for Prompts" vision while maintaining flexibility for future enhancements and community contributions. 