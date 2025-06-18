# Prompt Management Studio

Welcome to Prompt Management Studio, a developer-native VS Code extension for professional prompt engineering. This tool provides a structured, evaluation-first workflow to help you build, test, and manage high-quality, production-ready prompts for Large Language Models.

![Prompt Studio Demo](https://place-holder-for-your-demo-video.com/demo.gif)
*(A short video demonstrating the core workflow will be placed here)*

## The Goal: From Art to Engineering

Prompt engineering today is often an ad-hoc process of trial and error. This works for simple tasks, but for enterprise applications, it leads to inconsistent, hard-to-maintain, and difficult-to-evaluate prompts.

Prompt Management Studio treats prompt creation as a first-class software engineering discipline. It provides the structure and tooling necessary to move from "prompt hacking" to "prompt engineering."

## Why is This Relevant?

As organizations increasingly rely on LLMs, the need for standardized, high-quality, and governable prompts has become critical. This tool addresses several key pain points:

-   **Lack of Standardization:** Teams lack a common format for creating and sharing prompts.
-   **Difficult Evaluation:** Testing a prompt against multiple models is a manual and time-consuming process.
-   **No Version Control:** Prompts are often stored in documents or spreadsheets, disconnected from the applications that use them.
-   **Poor Reusability:** Without a structured format, reusing or adapting existing prompts is inefficient.

This extension solves these problems by providing a Git-native, IDE-centric workflow right inside VS Code.

## Key Features

-   **Structured Prompt IDE:** A custom editor for `.prompt.json` files that guides you to include a `persona`, `instructions`, `chain_of_thought` reasoning, `few-shot_examples`, and a defined `output_format`.
-   **Multi-Model Evaluation:** Select multiple models (e.g., GPT-4, Claude 3) and run your prompt against all of them simultaneously with a single click.
-   **Side-by-Side Comparison:** View responses from all models in a unified diff view to easily compare quality, tone, and performance.
-   **Enterprise-Ready Templates:** A library of "Golden" prompt templates for various industries (Finance, Healthcare, Logistics, etc.) to provide a high-quality starting point.
-   **Secure, Local-First Storage:** API keys are stored securely using the VS Code `SecretStorage` API. Your prompts and keys never leave your local machine.
-   **JSON Schema Validation:** Ensures all your prompts adhere to a consistent, well-defined structure.

## Getting Started

### 1. Configure API Keys
1.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2.  Search for and run `Prompt Studio: Configure API Keys`.
3.  Enter your API keys for the services you wish to use (e.g., OpenAI, Anthropic). These are stored securely on your local machine.

### 2. Create a New Prompt
1.  Open the Command Palette.
2.  Run `Prompt Studio: Create New Prompt`.
3.  This will create a new `new.prompt.json` file based on a starter template.
4.  The file will open in the **Prompt IDE**, which provides dedicated sections for each part of the prompt.

### 3. Editing an Existing Prompt
-   Simply open any `.prompt.json` file. The extension will automatically activate the custom Prompt IDE view.
-   Fill in the different sections:
    -   **Persona:** Define who the model should be.
    -   **Instructions:** Provide clear, step-by-step instructions.
    -   **Few-Shot Examples:** Give the model concrete examples of desired input/output.
    -   **Output Format:** Enforce a specific output structure, such as a JSON schema.

### 4. Evaluating a Prompt
1.  With a `.prompt.json` file open, you will see an "Evaluate Prompt" (▶️) icon in the editor's title bar.
2.  Click this button.
3.  The evaluation view will open, allowing you to select one or more models to test against.
4.  Enter any required input variables and run the evaluation.
5.  View all model responses side-by-side.

## Local Development Setup

To contribute to the development of this extension, you can set it up locally.

### Prerequisites
-   [Visual Studio Code](https://code.visualstudio.com/)
-   [Node.js](https://nodejs.org/) (version 18.x or higher)

### Build Steps
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rahulroy1/prompt-management-studio.git
    cd prompt-management-studio
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Compile the TypeScript code:**
    ```bash
    npm run compile
    ```
4.  **Run the extension:**
    -   Press `F5` in VS Code to open a new Extension Development Host window.
    -   This new window will have the extension running. You can now test your changes.

## Contributing

This is an open-source project, and contributions are highly welcome! Feel free to open an issue to report a bug or suggest a feature, or open a pull request with your improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🚀 Features

### 🎯 **Evaluation-First Workflow**
- **One-Click Multi-Model Testing**: Evaluate prompts instantly across GPT, Claude, and Gemini models
- **Side-by-Side Comparison**: Compare responses from different models in real-time
- **Performance Metrics**: Track latency, token usage, and cost estimates
- **Test Case Management**: Define and run multiple test scenarios

### 📝 **Structured Prompt Engineering**
- **Prompt IDE**: Guided builder with separate sections for persona, instructions, chain-of-thought, and examples
- **JSON Schema Validation**: Ensures prompts follow best practices and are properly structured
- **Template Library**: Pre-built templates for common use cases (code review, content generation, etc.)
- **Variable Support**: Dynamic prompts with placeholder variables

### 🔐 **Secure & Local-First**
- **Secure API Key Storage**: Uses VS Code's SecretStorage API for encrypted credential management
- **Local Processing**: All prompt compilation and management happens locally
- **Git-Friendly**: `.prompt.json` files work seamlessly with version control

### 🤝 **Collaboration Ready**
- **Standardized Format**: Share prompts across teams using a common schema
- **Version Control**: Track prompt evolution with Git
- **Import/Export**: Easy sharing and reuse of prompt libraries

## 📦 Installation

### Prerequisites
- VS Code 1.85.0 or higher
- Node.js 18.x or higher (for development)

### Install from Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Prompt Studio"
4. Click Install

### Development Setup
```bash
git clone https://github.com/prompt-studio/vscode-extension.git
cd vscode-extension
npm install
npm run compile
```

## 🏃‍♂️ Quick Start

### 1. Configure API Keys
1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Run `Prompt Studio: Configure API Keys`
3. Add your API keys for OpenAI, Anthropic, and/or Google

### 2. Create Your First Prompt
1. Right-click in Explorer → `Create New Prompt`
2. Choose a template and category
3. Fill in the prompt details using the guided interface

### 3. Evaluate Your Prompt
1. Open any `.prompt.json` file
2. Click the "Evaluate Prompt" button in the editor toolbar
3. Select a test case and watch the magic happen!

## 📚 Prompt File Structure

Prompt Studio uses structured JSON files that follow a comprehensive schema:

```json
{
  "$schema": "https://promptstudio.dev/schemas/v2.0/prompt.schema.json",
  "title": "Your Prompt Title",
  "description": "What this prompt accomplishes",
  "models": ["gpt-4-turbo", "claude-3-sonnet"],
  "prompt": {
    "persona": {
      "role": "You are a helpful assistant...",
      "tone": "Professional and friendly"
    },
    "instructions": [
      "Clear, specific instruction 1",
      "Clear, specific instruction 2"
    ],
    "chain_of_thought": [
      "Step 1: Understand the problem",
      "Step 2: Break it down",
      "Step 3: Provide solution"
    ],
    "few_shot_examples": [
      {
        "input": "Example input",
        "output": "Expected output",
        "explanation": "Why this is a good example"
      }
    ],
    "output_format": {
      "format": "json",
      "schema": { /* JSON schema for output */ }
    }
  },
  "user_input_template": "{{user_query}}",
  "variables": [
    {
      "name": "user_query",
      "type": "string",
      "description": "The user's input",
      "required": true
    }
  ],
  "test_cases": [
    {
      "name": "Basic Test",
      "inputs": {
        "user_query": "Hello, world!"
      }
    }
  ]
}
```

## 🎯 Use Cases

### Code Review
```json
{
  "title": "Code Review Assistant",
  "prompt": {
    "persona": {
      "role": "You are a senior software engineer conducting code reviews"
    },
    "instructions": [
      "Review code for security, performance, and best practices",
      "Provide constructive feedback with specific suggestions"
    ]
  }
}
```

### Content Generation
```json
{
  "title": "Blog Post Writer",
  "prompt": {
    "persona": {
      "role": "You are a skilled content writer"
    },
    "instructions": [
      "Create engaging blog content",
      "Match the specified tone and audience"
    ]
  }
}
```

## 🔧 Configuration

### Default Models
Set your preferred models in VS Code settings:
```json
{
  "promptStudio.defaultModels": ["gpt-4-turbo", "claude-3-sonnet"],
  "promptStudio.showCostEstimates": true,
  "promptStudio.evaluationTimeout": 30000
}
```

## 📈 Roadmap

### Phase 1: VS Code MVP ✅
- [x] Basic extension structure
- [x] JSON schema and validation
- [x] Multi-model evaluation
- [x] Secure API key management

### Phase 2: Enhanced Features (Q2 2024)
- [ ] Advanced Prompt IDE with guided builder
- [ ] Real-time collaboration features
- [ ] Prompt analytics and optimization suggestions
- [ ] Template marketplace

### Phase 3: Desktop App (Q3 2024)
- [ ] Standalone Tauri application
- [ ] Advanced visualization and analytics
- [ ] Team management features

### Phase 4: Enterprise (Q4 2024)
- [ ] On-premise deployment
- [ ] Advanced governance and compliance
- [ ] Custom model integration

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Commands
```bash
npm run compile        # Compile TypeScript
npm run watch         # Watch for changes
npm run lint          # Run ESLint
npm run test          # Run tests
```

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/prompt-studio/vscode-extension/issues)

## 🌟 Why Prompt Studio?

**"Rails for Prompts"** - We provide the structured foundation that transforms prompt engineering from art to engineering:

- **Consistent Structure**: Every prompt follows battle-tested patterns
- **Multi-Model Ready**: Write once, test everywhere
- **Developer Native**: Integrates seamlessly with your existing workflow
- **Collaboration First**: Built for teams from day one

Join us in making prompt engineering a first-class discipline in software development! 🚀

---

**Made with ❤️ by the Prompt Studio team** 