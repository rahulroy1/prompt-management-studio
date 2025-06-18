# Product Roadmap: A Developer-Native Strategy

## 🎯 Roadmap Philosophy

**Principle**: Solve the most acute pain point first, in the developer's native environment. Earn the right to ask for more user investment by delivering immediate, undeniable value.

**Strategy**: VS Code First. We will win by building the best-in-class prompt evaluation tool inside the editor where developers live. The standalone desktop app becomes a "pro" tool for a validated user base, not the entry point.

## 📋 Revised Phase Overview

```
Phase 1: The "Wow" Moment (VS Code MVP) - 3 Months
├── Multi-model prompt evaluation inside VS Code
├── A "run test" button for instant feedback
├── Zero-friction install and immediate value
└── Validate the core pain point: prompt evaluation

Phase 2: The "Git for Prompts" Hook (Collaboration) - 6 Months
├── Version comparison and diffing for prompts
├── Basic template discovery and sharing
├── Deepen Git integration for prompt versioning
└── Build an initial user base within the IDE

Phase 3: The Pro Studio (Desktop App) - 9 Months
├── Build the Tauri desktop app for power users
├── Advanced prompt library management and analytics
├── Team repository management and workflows
└── Leverage validated features from the VS Code extension

Phase 4: The Ecosystem (Platform) - 18+ Months
├── Plugin marketplace and APIs
├── CI/CD and enterprise integrations
├── Establish industry standards
└── Foster a self-sustaining community
```

## 🚀 Phase 1: The "Wow" Moment (VS Code MVP)

### 🎯 Goal: Solve the #1 Pain Point for Prompt Engineers
**Success Metrics**: 1,000+ VS Code installs, rave reviews about the evaluation feature, >50% of users successfully run a multi-model test.

### Core Features

#### 1.1 The "Prompt IDE" in VS Code
- **The entire product is a VS Code extension.**
- **`*.prompt.json` Files**: Prompts are defined using a structured JSON schema that encourages best practices.
- **Guided UI**: When opening a prompt file, the extension will offer a "Prompt Builder" webview, with distinct sections for `persona`, `instructions`, `examples`, etc.
- **Syntax Highlighting & Autocomplete**: Top-tier editor support for the `.prompt.json` schema.

#### 1.2 The One-Click Evaluator
- A "Run Evaluation" button is always visible in the Prompt IDE.
- **Multi-Model Test Runner**: On click, the extension **compiles** the structured prompt into the appropriate API format for each model and runs them in parallel.
- **Side-by-Side Webview**: Displays the results in a clear, comparable table view directly inside VS Code.
- **Key Metrics**: Shows latency, token count, and estimated cost for each model's response.

#### 1.3 Secure, Local-First API Key Management
- Users enter their API keys into VS Code's native `SecretStorage`.
- Keys are never stored in plaintext and never leave the local machine.

#### 1.4 The Standardized JSON Schema
- Our schema is the core of the "compile" step, enabling consistent prompt design across different models.
- Version 2 of the schema includes dedicated objects for prompt engineering best practices.

```json
{
  "$schema": "https://promptstudio.dev/schemas/v2.0/prompt.schema.json",
  "title": "Code Review Assistant",
  "models": ["gpt-4-turbo", "claude-3-sonnet"],
  
  "prompt": {
    "persona": {
      "role": "You are a senior software engineer specializing in Python.",
      "tone": "Helpful, constructive, and slightly formal."
    },
    "instructions": [
      "Review the code for bugs, style issues, and improvements.",
      "Provide feedback as a list."
    ],
    "chain_of_thought": [
      "First, check for syntax errors.",
      "Second, look for logical bugs.",
      "Third, review against PEP8 style guidelines.",
      "Finally, formulate the feedback."
    ],
    "few_shot_examples": [
      {
        "input": "def my_func( name ):\\n  print('Hello '+name)",
        "output": "..."
      }
    ],
    "output_format": {
      "format": "json",
      "schema": {
        "type": "object",
        "properties": { "feedback": { "type": "array" } }
      }
    }
  },

  "user_input_template": "Please review this code:\\n\\n```python\\n{{code_snippet}}\\n```",

  "test_cases": [
    {
      "name": "Simple Function",
      "inputs": { "code_snippet": "def add(a, b): return a+b" }
    }
  ]
}
```

### Technical Implementation
- **Framework**: **Pure TypeScript/JavaScript** VS Code Extension.
- **No Rust/Tauri initially**: This dramatically lowers the barrier for community contribution.
- **UI**: VS Code Webview API using plain HTML/CSS/JS (or a lightweight framework like Preact).
- **Distribution**: Visual Studio Marketplace.

### Validation Strategy
- **Launch on VS Code Marketplace**: Target developer communities on Twitter/X, Reddit, and Discord.
- **Focus on a single, powerful GIF**: Show the "write prompt -> click evaluate -> see comparison" workflow. This is the entire marketing pitch.
- **Gather feedback** on the core evaluation experience.

## 🔍 Phase 2: The "Git for Prompts" Hook (Collaboration)

### 🎯 Goal: Make Prompts Versionable and Shareable
**Success Metrics**: 5,000+ installs, users actively using version comparison, initial community templates being shared.

### Major Features

#### 2.1 Prompt Version Diffing
- **Side-by-side Diff View**: Compare the outputs of two different versions of the same prompt file.
- **Git Integration**: The extension will leverage Git history. Right-click on a `.prompt.json` file and select "Compare against version..." to see how a change affected the output.

#### 2.2 Template Discovery & Sharing
- **Curated Template Library**: Ship a small, high-quality library of built-in templates accessible via a VS Code command.
- **Share as Gist**: A simple command to export a `.prompt.json` file to a public or private GitHub Gist, making it easy to share with colleagues.
- **Initialize Prompt Repo**: A command to create a `prompts/` directory with a recommended structure and a `.gitignore`.

#### 2.3 Enhanced Editor Experience
- **Advanced Autocomplete** for the JSON schema.
- **Inline variable highlighting** in the prompt content.
- **Quickly add/remove models** from the evaluation run.

## 🤝 Phase 3: The Pro Studio (Desktop App)

### 🎯 Goal: Build a Power User Tool for Management & Analytics
**Success Metrics**: 10,000+ combined users, 1,000+ desktop app downloads from the existing VS Code user base, first teams adopting shared repositories.

### Major Features

#### 3.1 The Tauri Desktop App
- Now we build the desktop app using **Tauri + React + TypeScript**.
- It will read from the same `.prompt.json` files on the filesystem. Users can seamlessly switch between the VS Code extension and the desktop app.

#### 3.2 Advanced Library Management
- **Visual Grid/List View** of all prompts in a project.
- **Advanced Search & Filtering**: Filter by tags, models, success metrics, etc.
- **Analytics Dashboard**: Visualize prompt performance over time, track costs, and identify the best-performing prompts for specific tasks.

#### 3.3 Team Collaboration Workflows
- **Connect to a shared GitHub repository** as a "Team Library."
- **Visual PR and merge process** for prompt changes.
- **Organization-level analytics** (with appropriate permissions).

## 🌍 Phase 4: The Ecosystem (Platform)

### 🎯 Goal: Establish an Industry Standard and Self-Sustaining Community
**Success Metrics**: 50,000+ users, active plugin marketplace, CI/CD integration adopted by teams, recognition as a standard.

### Major Features

#### 4.1 Plugin Marketplace & APIs
- **Core logic exposed via an API** for CI/CD integration (e.g., `prompt-studio test <file> --fail-on-regression`).
- **Plugin system** for both the VS Code extension and the desktop app.

#### 4.2 Enterprise and Educational Integration
- Features like SSO, audit logs, and curriculum partnerships remain the same as the original roadmap.

---

**Note**: This revised roadmap prioritizes **user adoption and immediate value** over technical purity. By meeting developers in their native environment and solving a critical pain point first, we build the momentum needed to achieve the larger vision of standardization and collaboration. 