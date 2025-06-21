# 🚀 Quick Start Guide

## 🔓 **Why Prompt Studio?**

**Break free from vendor lock-in!** Unlike Azure AI Studio (Microsoft-only), Google AI Studio (Google-only), or Anthropic Console (Claude-only), Prompt Management Studio lets you:

- **Compare all major AI providers** in one interface
- **Own your prompts** in open JSON format  
- **Switch providers** without losing work
- **Work locally** in VS Code with Git integration

## What You'll Accomplish
- ✅ Set up Prompt Studio VS Code extension
- ✅ Create your first prompt using the Visual Builder
- ✅ Test against multiple AI models (OpenAI, Claude, Gemini)
- ✅ Share prompts with colleagues via Git
- ✅ Import and modify existing prompts

## 📋 Prerequisites
- **VS Code 1.85.0+** 
- **Node.js 18.x+**
- **API Keys** for at least one AI provider:
  - **OpenAI API Key** (starts with `sk-`)
  - **Anthropic API Key** (starts with `sk-ant-`)
  - **Google AI API Key** (optional)

---

## 🎯 Step 1: Install & Activate (2 minutes)

### Option A: Development Mode
```bash
# Clone and set up
git clone https://github.com/rahulroy1/prompt-management-studio.git
cd prompt-management-studio
npm install
npm run compile

# Launch in VS Code
code .
# Press F5 to run extension
```

### Option B: VS Code Marketplace *(Coming Soon)*
1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` or `Ctrl+Shift+X`)
3. Search "Prompt Studio"
4. Install and reload

### Option C: Manual Installation
```bash
# Install the latest extension
code --install-extension examples/prompt-management-studio-0.1.1.vsix

# Or use VS Code UI: Extensions → Install from VSIX → Select the .vsix file
```

---

## 🔧 Step 2: Configure API Keys (1 minute)

1. **Press `Cmd+Shift+P`** (Mac) or `Ctrl+Shift+P` (Windows/Linux) - Command Palette
2. **Type:** "Prompt Studio: Configure API Keys"
3. **Select your provider:**
   - **OpenAI** → Enter your API key (`sk-...`)
   - **Anthropic** → Enter your Claude API key (`sk-ant-...`)
   - **Google AI** → Enter your Gemini API key (optional)
4. **Keys are stored securely** in VS Code's SecretStorage

> 💡 **Tip:** API keys are encrypted and stored locally - they never leave your machine

---

## 🎨 Step 3: Create Your First Prompt (2 minutes)

### Method 1: Visual Builder (Recommended)
1. **Press `Cmd+Shift+P`** → "Prompt Studio: Create New Prompt"
2. **Follow the wizard:**
   - **Title:** "Email Response Generator"
   - **Description:** "Generates professional email responses"
   - **Category:** Customer Service
   - **Template:** Basic Template

3. **The Visual Builder opens automatically**
4. **Fill in the guided form:**
   - **Persona:** "You are a professional customer service representative"
   - **Instructions:** Add clear, step-by-step instructions
   - **Variables:** Define what inputs you need (e.g., `{{customer_message}}`)
   - **Examples:** Create input/output examples
   - **Test Cases:** Create example scenarios

### Method 2: Import Existing
1. **Get a `.prompt.json` file** from a colleague or template library
2. **Double-click it** → Opens in Visual Builder automatically
3. **Modify as needed** → All changes sync to JSON

---

## 🧪 Step 4: Test & Iterate (2 minutes)

### Built-in Multi-Model Testing
1. **In the Visual Builder:**
   - ✅ Select models (GPT-4, Claude-3, Gemini)
   - Enter test input in the test panel
   - Click **🚀 Test Now**

2. **Compare results:**
   - Performance metrics (speed, cost, tokens)
   - Response quality side-by-side
   - Choose best model for your use case

### Real-time Testing
- Type in test panel → See immediate results
- Modify prompt → Re-test instantly
- A/B test different versions

---

## 📤 Step 5: Share & Collaborate (1 minute)

### Export Options
- **📄 JSON File** - Share with colleagues directly
- **📦 Complete Package** - Includes test results & documentation
- **👥 Team Share** - Git-based collaboration
- **🌐 Community Template** - Contribute to library

### Git Integration
```bash
# Automatic Git workflow
git add my-prompt.prompt.json
git commit -m "Add customer service prompt"
git push origin feature/new-prompt

# Colleague receives and opens in Visual Builder
# Makes improvements and shares back
```

---

## 🎯 Real-World Example

### Creating a "Code Review Assistant"

**Input (30 seconds):**
```
Title: Code Review Assistant
Description: Reviews code for bugs and best practices
Category: Code Review  
Template: Chain of Thought
```

**Result (Generated automatically):**
- ✅ Professional code reviewer persona
- ✅ Step-by-step review instructions
- ✅ Variable for code input (`{{code}}`, `{{language}}`)
- ✅ Test cases with sample code
- ✅ Structured output format

**Test & Deploy (60 seconds):**
- Test with sample JavaScript code
- Compare GPT-4 vs Claude responses
- Export for team use
- Share via Git

---

## 🔄 Round-Trip Editing Workflow

### Scenario: Improving a Team Template
```
1. Colleague shares customer-support.prompt.json
2. You open → Visual Builder loads all settings
3. Modify instructions, add test case
4. Export enhanced version
5. Share back or commit to Git
```

### No Manual JSON Writing Required!
- ✅ Visual form editing
- ✅ Auto-completion and validation
- ✅ Live preview of compiled prompt
- ✅ Seamless JSON import/export

---

## 📊 What You Get

### Immediate Value
- **Visual prompt creation** - No JSON writing
- **Multi-model testing** - Compare AI responses
- **Performance insights** - Cost, speed, quality metrics
- **Team collaboration** - Git-based sharing

### Long-term Benefits
- **Standardized prompts** - Consistent across team
- **Knowledge sharing** - Learn from colleagues' prompts
- **Continuous improvement** - Version control and iteration
- **Community templates** - Access to proven prompts

---

## 🧹 Demo & Testing Setup

### Preparing for a Clean Demo
To ensure a fresh demo experience with no pre-configured settings:

1. **Clear Previous State**
   - **Uninstall existing extension**: Extensions → Prompt Management Studio → Uninstall
   - **Clear API keys**: `Cmd+Shift+P` → "Prompt Studio: Configure API Keys" → "Remove All Keys"
   - **Restart VS Code** to clear any cached state

2. **Install Fresh Extension**
   ```bash
   npm run install-demo
   ```

3. **Verify Clean State**
   - Open VS Code
   - Press `Cmd+Shift+P` → "Prompt Studio: Create New Prompt"
   - Should show welcome message (first-time use)
   - No API keys should be configured

### Demo Flow (15 minutes)
1. **Introduction** (2 minutes) - Show extension features
2. **First-Time Setup** (3 minutes) - Configure API keys
3. **Wizard Walkthrough** (5 minutes) - Create a prompt step-by-step
4. **Generated Prompt** (2 minutes) - Show JSON output and validation
5. **Testing** (3 minutes) - Multi-model evaluation and comparison

---

## 🆘 Quick Troubleshooting

### Extension Not Loading?
```bash
# Recompile and restart
npm run compile
# Press F5 again in VS Code
```

### Visual Builder Not Opening?
- Ensure file ends with `.prompt.json`
- Try: Right-click → "Open with Prompt Builder"
- Check VS Code version compatibility (requires 1.85.0+)

### API Calls Failing?
- Verify API key is valid and has credits
- Check account billing status
- Look at Debug Console for errors (`Help` → `Toggle Developer Tools`)

### Can't See ▶️ Test Button?
- Make sure `.prompt.json` file is open
- Extension should auto-activate
- Try reloading window: `Cmd+Shift+P` → "Developer: Reload Window"

### Commands Not Appearing?
- Reload window: `Cmd+Shift+P` → "Developer: Reload Window"
- Verify extension is enabled in Extensions panel
- Check for error messages in Output panel

---

## 📁 Example Files

The `examples/` folder contains:
- **`code-review.prompt.json`** - Complete code review assistant example
- **`prompt-management-studio-0.1.0.vsix`** - Latest packaged extension
- **`prompt-management-studio-0.0.1.vsix`** - Previous version (legacy)
- **Demo scripts** - Automated setup and reset tools

### Using the Code Review Example
```bash
# Open the example file
code examples/code-review.prompt.json

# The Visual Builder will open automatically showing:
# - Multi-step instructions
# - Input variables for code context
# - Few-shot examples
# - Test cases
# - Multiple AI model configurations
```

---

## 🚀 Next Steps

### Explore Templates
- Browse `prompt-templates/` folder for industry-specific examples
- Try templates for different use cases (finance, healthcare, logistics)
- Customize templates for your specific needs

### Advanced Features
- **Version Control**: Use Git to track prompt evolution
- **Team Collaboration**: Share prompts across your organization
- **Performance Optimization**: Compare models and optimize costs
- **Custom Variables**: Create dynamic, reusable prompts

### Community Involvement
- **Contribute Templates**: Share your successful prompts
- **Report Issues**: Help improve the extension
- **Feature Requests**: Suggest new capabilities
- **Documentation**: Help improve guides and examples

---

**Ready to get started!** 🚀 

Begin with `Cmd+Shift+P` → "Prompt Studio: Create New Prompt" and start building your first professional prompt in minutes. 