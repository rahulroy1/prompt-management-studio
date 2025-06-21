# Prompt Management Studio - Demo Examples

This folder contains everything needed for demonstrations and testing of the Prompt Management Studio VS Code extension.

## 📦 Contents

- **`prompt-management-studio-0.1.0.vsix`** - Latest packaged extension ready for installation
- **`prompt-management-studio-0.0.1.vsix`** - Previous version (legacy)
- **`code-review.prompt.json`** - Example prompt template for code review assistance
- **Demo reset scripts** - Located in `../scripts/` for preparing clean demo environments

## 🚀 Quick Demo Setup

### Option 1: Using npm scripts (Recommended)
```bash
# Reset demo environment (clears keys, shows instructions)
npm run reset-demo

# Install extension for demo
npm run install-demo
```

### Option 2: Manual installation
```bash
# Install the latest extension
code --install-extension examples/prompt-management-studio-0.1.0.vsix

# Or use VS Code UI: Extensions → Install from VSIX → Select the .vsix file
```

## 🧹 Preparing for a Clean Demo

To ensure a fresh demo experience with no pre-configured settings:

### 1. Clear Previous State
- **Uninstall existing extension**: Extensions → Prompt Management Studio → Uninstall
- **Clear API keys**: `Cmd+Shift+P` → "Prompt Studio: Configure API Keys" → "Remove All Keys"
- **Restart VS Code** to clear any cached state

### 2. Install Fresh Extension
```bash
npm run install-demo
```

### 3. Verify Clean State
- Open VS Code
- Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
- Type: "Prompt Studio: Create New Prompt"
- Should show welcome message (first-time use)
- No API keys should be configured

## 🎬 Demo Flow Suggestions

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

### code-review.prompt.json
A complete example showing:
- Multi-step instructions
- Input variables for code context
- Few-shot examples
- Test cases
- Multiple AI model configurations

Use this as a reference for the prompt structure and schema.

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

---

**Ready to demo!** 🚀 Start with `npm run reset-demo` to prepare your environment.

# 📦 Extension Packages & Examples

This directory contains ready-to-install VSIX packages and example prompt files for the Prompt Management Studio extension.

## 🚀 Latest Release

### **v0.1.1 - User Input Template Enhancement** *(Latest)*
- **File:** `prompt-management-studio-0.1.1.vsix` (570 KB)
- **Key Improvements:**
  - ✅ **Standardized Templates**: Consistent `{{user_input}}` default template
  - ✅ **Enhanced Validation**: Better error messages for invalid templates  
  - ✅ **Multi-Variable Support**: Improved handling of complex templates
  - ✅ **Better UX**: More intuitive template variable handling

### **v0.1.0 - Documentation & Quality Release**
- **File:** `prompt-management-studio-0.1.0.vsix` (570 KB)
- **Focus:** Complete documentation overhaul and quality improvements

## 📋 Installation

### Quick Install (Recommended)
```bash
# Install the latest version
code --install-extension examples/prompt-management-studio-0.1.1.vsix
```

### Manual Installation
1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` or `Ctrl+Shift+X`)
3. Click the "..." menu → "Install from VSIX..."
4. Select `examples/prompt-management-studio-0.1.1.vsix`
5. Reload VS Code when prompted
```

# Examples and Packages

This directory contains example prompt files and packaged versions of the Prompt Management Studio extension.

## 📦 **Extension Packages**

### **Latest: Version 0.2.0 - Schema Validation**
- **File**: `prompt-management-studio-0.2.0.vsix` (8.4 MB)
- **Features**: 
  - 🔒 **NEW: Prompt Schema Validation** - Automatic breaking change detection
  - 📊 Compatibility scoring and migration guidance
  - 🚨 Pre-save validation to prevent production breaks
  - 📝 Detailed schema change reports
  - All previous features included

### **Version 0.1.1 - Template Improvements**
- **File**: `prompt-management-studio-0.1.1.vsix` (570 KB)
- **Features**: Enhanced user input templates, better validation, multi-variable support

## 🚀 **Installation**

### **Install Latest Version (Recommended)**
```bash
code --install-extension examples/prompt-management-studio-0.2.0.vsix
```

### **Install Previous Version**
```bash
code --install-extension examples/prompt-management-studio-0.1.1.vsix
```

### **Uninstall**
```bash
code --uninstall-extension rahulroy-dev.prompt-management-studio
```

## 📁 **Example Files**

### **Schema Validation Demo**
- **File**: `schema-validation-demo.prompt.json`
- **Purpose**: Demonstrates the new schema validation feature
- **Features**: Complete variable schema tracking, breaking change history

### **Code Review Assistant**
- **File**: `code-review-assistant.prompt.json`
- **Purpose**: Comprehensive code review prompt for security and performance analysis
- **Models**: GPT-4, Claude 3.5 Sonnet

### **Content Generation**
- **File**: `content-generator.prompt.json`
- **Purpose**: Multi-format content creation with structured output
- **Features**: Few-shot examples, output format specification

### **Data Analysis Helper**
- **File**: `data-analysis-helper.prompt.json`
- **Purpose**: Statistical analysis and insight generation
- **Features**: Chain-of-thought reasoning, constraint handling

### **Customer Service Bot**
- **File**: `customer-service-bot.prompt.json`
- **Purpose**: Professional customer support responses
- **Features**: Tone specification, escalation handling

### **Documentation Writer**
- **File**: `documentation-writer.prompt.json`
- **Purpose**: Technical documentation generation
- **Features**: Structured output, multiple formats

### **Translation Assistant**
- **File**: `translation-assistant.prompt.json`
- **Purpose**: Multi-language translation with context preservation
- **Features**: Cultural adaptation, formality levels

## 🎯 **Quick Start**

1. **Install the extension** using one of the commands above
2. **Open any `.prompt.json` file** from this directory
3. **Try the Visual Builder** - VS Code will automatically open the prompt builder interface
4. **Test with different models** - Use the "Test Now" feature to compare responses
5. **Experiment with schema validation** - Try modifying variables in the schema validation demo

## 🔧 **Development**

If you're contributing to the project:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build new package
npx vsce package

# Install your build
code --install-extension prompt-management-studio-X.X.X.vsix
```

## 📊 **Version History**

| Version | Size | Key Features | Release Date |
|---------|------|--------------|--------------|
| **0.2.0** | 8.4 MB | **Schema Validation**, Breaking change detection | June 2024 |
| 0.1.1 | 570 KB | Template improvements, Better validation | June 2024 |
| 0.1.0 | - | Initial release, Multi-model support | June 2024 |

## 💡 **Tips**

- **Schema Validation**: Try modifying variables in the demo file to see breaking change detection in action
- **Multi-Model Testing**: Use the side-by-side comparison to evaluate different AI models
- **Template Variables**: Use `{{variable_name}}` syntax for dynamic content
- **Version Control**: All `.prompt.json` files work perfectly with Git
- **Team Collaboration**: Share prompt files across your team for consistent AI interactions