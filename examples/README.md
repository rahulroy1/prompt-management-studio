# Prompt Management Studio - Examples & Integration

This directory contains ready-to-install VSIX packages, example prompts, and integration examples for the Prompt Management Studio extension.

## 📦 Contents

- **`prompt-management-studio-0.2.0.vsix`** - Latest packaged extension ready for installation
- **Example prompts** - Sample `.prompt.json` files for different use cases
- **Integration examples** - Complete applications showing how to integrate prompts
- **Demo scripts** - Located in `../scripts/` for preparing clean demo environments

## 🚀 Quick Installation

```bash
# Install the latest version (0.2.0)
code --install-extension examples/prompt-management-studio-0.2.0.vsix
```

## 🧹 Demo Setup

### **Option 1: Using npm scripts (Recommended)**
```bash
# Reset demo environment (clears keys, shows instructions)
npm run reset-demo

# Install extension for demo
npm run install-demo
```

### **Option 2: Manual setup**
```bash
# Install the extension
code --install-extension examples/prompt-management-studio-0.2.0.vsix

# Clear previous state (if needed)
# Uninstall existing extension: Extensions → Prompt Management Studio → Uninstall
# Clear API keys: Cmd+Shift+P → "Prompt Studio: Configure API Keys" → "Remove All Keys"
```

## 🎬 Demo Flow (15 minutes)

### 1. **Introduction** (2 minutes)
- Show the extension in the marketplace/extensions panel
- Highlight key features: multi-model support, visual wizard, JSON schema validation

### 2. **First-Time Setup** (3 minutes)
- Run "Prompt Studio: Create New Prompt" 
- Show welcome message
- Configure API keys for demo (use test keys or explain process)

### 3. **Wizard Walkthrough** (10 minutes)
Use the 7-step wizard to create a prompt:
- **Step 1**: Basic Information (title, description, category)
- **Step 2**: AI Persona & Role 
- **Step 3**: Instructions & Chain of Thought
- **Step 4**: Input Variables
- **Step 5**: Examples & Output Format
- **Step 6**: Test Cases & Models
- **Step 7**: Review & Create

### 4. **Generated Prompt** (5 minutes)
- Show the generated JSON file
- Highlight schema validation
- Demonstrate syntax highlighting
- Show the custom editor

### 5. **Template Library** (3 minutes)
- Browse existing templates in `../prompt-templates/`
- Show different categories and use cases
- Explain the golden templates

### 6. **Advanced Features** (5 minutes)
- Multi-model evaluation
- Cost estimation
- Test case validation
- Export/import capabilities

## 📋 Demo Checklist

Before starting your demo:

- [ ] Extension uninstalled/reinstalled for clean state
- [ ] API keys cleared (or demo keys ready)
- [ ] Welcome message will show on first use
- [ ] VSIX package available in examples/
- [ ] Demo script prepared and tested
- [ ] VS Code restarted for fresh state

## 🔧 Troubleshooting

### Extension not loading
- Check VS Code version compatibility (requires ^1.84.0)
- Restart VS Code after installation
- Check Developer Console for errors (`Help` → `Toggle Developer Tools`)

### Commands not appearing
- Reload window: `Cmd+Shift+P` → "Developer: Reload Window"
- Verify extension is enabled in Extensions panel

### API Key issues
- Use test keys for demos
- Explain security (keys stored in VS Code SecretStorage)
- Show key status: "Prompt Studio: Configure API Keys" → "View All Keys"

## 📁 Example Files

### **Prompt Templates**
- **`code-review.prompt.json`** - Complete code review assistant example
- **`simple-demo.prompt.json`** - Basic template for quick demos
- **`complete-test.prompt.json`** - Full-featured example with all sections
- **`schema-validation-demo.prompt.json`** - Demonstrates schema validation features

### **Integration Examples**
- **`python-fastapi-integration/`** - Complete FastAPI application showing how to integrate prompts
- **`spring-boot-integration/`** - Spring Boot application using Spring AI framework

## 🎯 Demo Tips

1. **Start with the wizard** - Most impressive feature for new users
2. **Show schema validation** - Highlight the JSON validation in real-time
3. **Demonstrate multi-model** - Show how same prompt works across different AI models
4. **Explain the vision** - Position as enterprise prompt management solution
5. **Keep API calls minimal** - Use test cases and examples, avoid expensive API calls during demos

## 🔄 Post-Demo Cleanup

After your demo:
```bash
# Clear any demo data
npm run reset-demo

# Optionally uninstall the demo extension
code --uninstall-extension prompt-management-studio
```

## 📦 Release History

### **v0.2.0 - Core Engineering Platform** *(Latest)*
- **File:** `prompt-management-studio-0.2.0.vsix` (8.4 MB)
- **Key Improvements:**
  - ✅ **Structured prompt creation** with engineering standards
  - ✅ **Multi-model testing and evaluation**
  - ✅ **Native VS Code integration**
  - ✅ **Production-grade variable validation**
  - ✅ **Webpack bundling** for reliable packaging
  - ✅ **Updated prompt templates** to latest schema

### **v0.1.1 - Template Improvements**
- **File:** `prompt-management-studio-0.1.1.vsix` (570 KB)
- **Key Improvements:**
  - ✅ **Enhanced template validation**
  - ✅ **Better error handling**
  - ✅ **Improved user experience**

### **v0.1.0 - Documentation & Quality Release**
- **File:** `prompt-management-studio-0.1.0.vsix` (570 KB)
- **Key Improvements:**
  - ✅ **Comprehensive documentation**
  - ✅ **Quality improvements**
  - ✅ **Bug fixes**

## 📊 Version Comparison

| Version | Size | Key Features | Release Date |
|---------|------|--------------|--------------|
| 0.2.0 | 8.4 MB | Core engineering platform, Multi-model testing | January 2024 |
| 0.1.1 | 570 KB | Template improvements, Better validation | January 2024 |
| 0.1.0 | 570 KB | Initial release, Multi-model support | January 2024 |

---

**Ready to demo!** 🚀 Start with `npm run reset-demo` to prepare your environment.
