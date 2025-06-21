# Prompt Management Studio Documentation

Welcome to the comprehensive documentation for Prompt Management Studio! This documentation is designed for developers who want to understand, use, extend, or contribute to the project.

## 📚 Documentation Overview

### **For Users**
- **[🚀 Quick Start Guide](quick-start.md)** - Get up and running in 5 minutes
- **[📋 User Guide](user-guide.md)** - Complete guide for using the extension
- **[🔧 Troubleshooting](troubleshooting.md)** - Solutions to common issues

### **For Developers**
- **[🏗️ Architecture](architecture.md)** - System design and component overview
- **[⚙️ Technology Stack](technology-stack.md)** - Technical implementation details
- **[🔌 API Reference](api-reference.md)** - Complete API documentation
- **[💻 Development Setup](development-setup.md)** - Local development environment

### **Project Information**
- **[🌟 Vision & Philosophy](vision-and-philosophy.md)** - Why we built this and our approach
- **[🗺️ Product Roadmap](product-roadmap.md)** - Current status and future plans
- **[📝 Release Notes](release-notes.md)** - Latest updates and improvements
- **[🤝 Contributing Guide](../CONTRIBUTING.md)** - How to contribute to the project

## 🏗️ Architecture Quick Reference

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

## 📖 Core Components

### **[ApiKeyManager](api-reference.md#apikeymanager)**
Secure management of API credentials using VS Code's SecretStorage

### **[PromptEvaluator](api-reference.md#promptevaluator)**
Multi-model evaluation engine for testing prompts

### **[PromptCompiler](api-reference.md#promptcompiler)**
Converts structured prompts to provider-specific API calls

### **[ModelClient](api-reference.md#modelclient)**
Unified interface for calling different AI model providers

### **[PromptBuilderProvider](api-reference.md#promptbuilderprovider)**
Custom editor for .prompt.json files with guided UI

## 🔧 Development Workflow

### **1. Setup**
```bash
git clone https://github.com/rahulroy1/prompt-management-studio.git
cd prompt-management-studio
npm install
```

### **2. Development**
```bash
npm run compile    # Build TypeScript
npm run watch      # Watch for changes
npm test           # Run tests
npm run lint       # Check code style
```

### **3. Testing**
- Press `F5` in VS Code to launch Extension Development Host
- Test your changes in the new window
- Use `Help > Toggle Developer Tools` for debugging

## 📋 File Structure Reference

```
prompt-management-studio/
├── src/
│   ├── auth/              # API key management
│   │   └── ApiKeyManager.ts
│   ├── builder/           # Prompt Builder UI
│   │   └── PromptBuilderProvider.ts
│   ├── compiler/          # Prompt compilation
│   │   └── PromptCompiler.ts
│   ├── evaluator/         # Multi-model evaluation
│   │   └── PromptEvaluator.ts
│   ├── models/            # AI model clients
│   │   └── ModelClient.ts
│   ├── types/             # TypeScript definitions
│   │   └── PromptTypes.ts
│   └── test/              # Test files
├── schemas/               # JSON schemas
│   └── prompt.schema.json
├── prompt-templates/      # Golden templates
├── media/                 # UI assets
├── docs/                  # Documentation (this folder)
├── examples/              # Example files and demo setup
└── package.json           # Extension manifest
```

## 🎯 Extension Points

The extension provides several ways to extend functionality:

### **Model Providers**
Add support for new AI model providers by extending `ModelClient`

### **Prompt Templates**
Create reusable templates for common use cases

### **UI Components**
Extend the Prompt Builder with custom sections

### **Evaluation Metrics**
Add custom metrics for prompt evaluation

## 🔍 Troubleshooting

### **Common Issues**
- [Extension not loading](troubleshooting.md#extension-not-loading)
- [API key configuration](troubleshooting.md#api-keys)
- [Compilation errors](troubleshooting.md#compilation)
- [Test failures](troubleshooting.md#tests)

### **Debug Mode**
Enable debug logging by setting `"promptStudio.debug": true` in VS Code settings.

## 🤝 Community

- **GitHub Issues:** [Report bugs or request features](https://github.com/rahulroy1/prompt-management-studio/issues)
- **Discussions:** [Ask questions and share ideas](https://github.com/rahulroy1/prompt-management-studio/discussions)
- **Contributing:** [How to contribute](../CONTRIBUTING.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Need help?** Check the specific documentation sections above or open an issue on GitHub! 