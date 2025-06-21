# Prompt Management Studio

## 🎯 **Standardize Prompt Engineering Across Your Organization**

**The Problem**: Every developer writes and saves prompts differently. No consistency, no governance, no standards.

**The Solution**: A unified IDE that enforces consistent prompt structure, enables team collaboration, and provides enterprise-grade governance.

---

## 🏢 **Enterprise Prompt Standardization**

### **Before Prompt Management Studio**
```
❌ Developer A: Hardcoded prompts in Python
❌ Developer B: YAML configs with custom format  
❌ Developer C: Text files with no structure
❌ Developer D: API calls with inline strings
❌ Result: Chaos, duplication, no governance
```

### **After Prompt Management Studio** 
```
✅ Standardized JSON format across all teams
✅ Consistent structure: persona + instructions + variables + tests
✅ Version control integration with Git workflows
✅ Schema validation prevents breaking changes
✅ Built-in testing and evaluation
✅ Centralized prompt library and discovery
```

## 🚀 **Key Organizational Benefits**

### **📋 Standardization & Governance**
- **Unified Format**: Single JSON schema for all prompts across teams
- **Consistent Structure**: Enforced persona, instructions, variables, and test patterns
- **Schema Validation**: Automatic detection of breaking changes
- **Version Control**: Git-native workflow with proper diff support
- **Quality Gates**: Built-in validation and testing requirements

### **🤝 Team Collaboration**
- **Prompt Library**: Centralized discovery and sharing
- **Template System**: Reusable patterns and best practices
- **Review Workflows**: Git-based code review for prompts
- **Knowledge Sharing**: Documented examples and few-shot patterns
- **Onboarding**: New developers follow established patterns

### **🔧 Developer Experience**
- **VS Code Native**: Works with existing IDE and workflows
- **IntelliSense**: Auto-completion and validation
- **Visual Builder**: No-code prompt creation interface
- **Testing Framework**: Built-in evaluation and comparison
- **Hot Reload**: Real-time testing during development

### **📊 Enterprise Features**
- **Multi-Model Testing**: Compare providers without vendor lock-in
- **Cost Tracking**: Built-in usage and cost estimation
- **Audit Trail**: Complete history of prompt changes
- **Compliance**: Standardized documentation and approval workflows
- **Scalability**: Handles hundreds of prompts across large teams

---

## 🔓 **Bonus: Break Free from AI Vendor Lock-In**

As an additional benefit, our open JSON format prevents vendor lock-in:

### **The Vendor Lock-In Problem**
- **Azure AI Studio** → Locked to Microsoft ecosystem
- **Google AI Studio** → Locked to Google Vertex AI  
- **Anthropic Console** → Locked to Claude models
- **OpenAI Playground** → Locked to OpenAI models

### **Our Vendor-Agnostic Solution**
- ✅ **Multi-Provider Support**: OpenAI, Anthropic, Google, and more
- ✅ **Open JSON Format**: No proprietary formats or APIs
- ✅ **Local Development**: No cloud dependencies for prompt creation
- ✅ **Git Integration**: Version control with any Git provider
- ✅ **Zero Platform Fees**: No per-prompt or per-user charges

---

Welcome to Prompt Management Studio, a developer-native VS Code extension for professional prompt engineering. This tool provides a structured, evaluation-first workflow to help you build, test, and manage high-quality, production-ready prompts for Large Language Models.

## 🎬 **See It In Action**

![Prompt Studio Demo](examples/prompt-studio-demo-compact.gif)

**Complete walkthrough showing:**
- Creating a Python code review prompt from scratch
- Testing across multiple AI providers (GPT-4, Claude, Gemini)  
- Comparing responses and performance metrics
- Exporting and sharing prompts with your team

*[📹 Download full quality video](examples/Prompt%20Studio-demo.mp4) for offline viewing*

## 🎯 The Goal: From Art to Engineering

Prompt engineering today is often an ad-hoc process of trial and error. This works for simple tasks, but for enterprise applications, it leads to inconsistent, hard-to-maintain, and difficult-to-evaluate prompts.

Prompt Management Studio treats prompt creation as a first-class software engineering discipline. It provides the structure and tooling necessary to move from "prompt hacking" to "prompt engineering."

## 🚀 Key Features

- **🎯 Evaluation-First Workflow**: One-click multi-model testing across GPT, Claude, and Gemini
- **📝 Structured Prompt IDE**: Guided builder with separate sections for persona, instructions, and examples
- **🔐 Secure & Local-First**: Uses VS Code's SecretStorage API for encrypted credential management
- **🤝 Collaboration Ready**: Standardized `.prompt.json` format works seamlessly with Git
- **📦 Template Library**: Pre-built templates for common use cases and industries
- **⚡ Professional Workflow**: JSON schema validation and VS Code integration

## 🏃‍♂️ Quick Start

### 1. Install the Extension
```bash
# Development mode
git clone https://github.com/rahulroy1/prompt-management-studio.git
cd prompt-management-studio
npm install && npm run compile
# Press F5 in VS Code to run
```

### 2. Configure API Keys
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run `Prompt Studio: Configure API Keys`
3. Add your API keys for OpenAI, Anthropic, and/or Google

### 3. Create Your First Prompt
1. Run `Prompt Studio: Create New Prompt`
2. Fill in the guided form interface
3. Click "Test Now" to evaluate across multiple models
4. Save and share via Git

**🎯 Get started in under 5 minutes!** See our [Quick Start Guide](docs/quick-start.md) for detailed instructions.

📹 **Prefer to watch?** See the embedded demo above or [download the full video](examples/Prompt%20Studio-demo.mp4) for offline viewing.

## 📚 Documentation

### **For Users**
- **[📖 Quick Start Guide](docs/quick-start.md)** - Get up and running in 5 minutes
- **[📋 User Guide](docs/user-guide.md)** - Complete guide for using the extension
- **[🔧 Troubleshooting](docs/troubleshooting.md)** - Solutions to common issues

### **For Developers**
- **[🏗️ Architecture](docs/architecture.md)** - System design and component overview
- **[⚙️ Technology Stack](docs/technology-stack.md)** - Technical implementation details
- **[🔌 API Reference](docs/api-reference.md)** - Complete API documentation
- **[💻 Development Setup](docs/development-setup.md)** - Local development environment

### **Project Information**
- **[🌟 Vision & Philosophy](docs/vision-and-philosophy.md)** - Why we built this and our approach
- **[🗺️ Product Roadmap](docs/product-roadmap.md)** - Current status and future plans
- **[📝 Release Notes](docs/release-notes.md)** - Latest updates and improvements
- **[🤝 Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

## 🎨 Prompt File Structure

Prompt Studio uses structured JSON files that follow a comprehensive schema:

```json
{
  "$schema": "./schemas/prompt.schema.json",
  "title": "Code Review Assistant",
  "description": "Reviews code for bugs and best practices",
  "models": ["gpt-4-turbo", "claude-3-sonnet"],
  "prompt": {
    "persona": {
      "role": "You are a senior software engineer...",
      "tone": "Professional and constructive"
    },
    "instructions": [
      "Review the code for potential bugs",
      "Check for security vulnerabilities",
      "Suggest performance improvements"
    ],
    "few_shot_examples": [
      {
        "input": "function add(a, b) { return a + b }",
        "output": "The function looks good but consider adding type validation..."
      }
    ]
  },
  "user_input_template": "Please review this {{language}} code:\n\n```{{language}}\n{{code}}\n```",
  "variables": [
    {
      "name": "code",
      "type": "string",
      "description": "The code to review",
      "required": true
    }
  ]
}
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│              VS Code Extension              │
├─────────────────┬───────────────────────────┤
│   UI (Webviews) │   Extension Backend       │
│ (HTML/CSS/JS)   │     (TypeScript)          │
├─────────────────┴───────────────────────────┤
│         Prompt Compilation Engine           │
├─────────────────┬───────────────────────────┤
│ Local Filesystem│   External Services       │
│ (.prompt.json)  │   (Model Provider APIs)   │
└─────────────────┴───────────────────────────┘
```

**Learn more:** [Architecture Documentation](docs/architecture.md)

## 🤝 Contributing

We welcome contributions from the community! This is an open-source project under the MIT License.

- **[📋 Contributing Guide](CONTRIBUTING.md)** - Detailed contribution instructions
- **[💻 Development Setup](docs/development-setup.md)** - Set up your local environment
- **[🐛 Issues](https://github.com/rahulroy1/prompt-management-studio/issues)** - Report bugs or request features
- **[💬 Discussions](https://github.com/rahulroy1/prompt-management-studio/discussions)** - Ask questions and share ideas

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🚀 Ready to transform your prompt engineering workflow?** 

Start with our [Quick Start Guide](docs/quick-start.md) and join the community of developers building better AI applications through structured prompt engineering. 
