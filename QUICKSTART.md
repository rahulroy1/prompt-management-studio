# 🚀 Prompt Studio - 5 Minute Quickstart

## What You'll Accomplish
- ✅ Set up Prompt Studio VS Code extension
- ✅ Create your first prompt using the Visual Builder
- ✅ Test against multiple AI models (OpenAI, Claude)
- ✅ Share prompts with colleagues via Git
- ✅ Import and modify existing prompts

## 📋 Prerequisites
- **VS Code 1.85.0+** 
- **Node.js 18.x+**
- **OpenAI API Key** (starts with `sk-`)

---

## 🎯 Step 1: Install & Activate (2 minutes)

### Option A: Development Mode
```bash
# Clone and set up
git clone <repository-url>
cd prompt-management-studio
npm install
npm run compile

# Launch in VS Code
code .
# Press F5 to run extension
```

### Option B: VS Code Marketplace *(Coming Soon)*
1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X`)
3. Search "Prompt Studio"
4. Install and reload

---

## 🔧 Step 2: Configure API Keys (1 minute)

1. **Press `Cmd+Shift+P`** (Command Palette)
2. **Type:** "Prompt Studio: Configure API Keys"
3. **Select "OpenAI"** → Enter your API key (`sk-...`)
4. **Optional:** Add Claude/Gemini keys for comparison

> 💡 **Tip:** API keys are stored securely in VS Code's SecretStorage

---

## 🎨 Step 3: Create Your First Prompt (2 minutes)

### Method 1: Visual Builder (Recommended)
1. **Press `Cmd+Shift+P`** → "Prompt Studio: Create New Prompt"
2. **Follow the wizard:**
   - **Title:** "Email Response Generator"
   - **Category:** Customer Service
   - **Template:** Basic Template

3. **The Visual Builder opens automatically**
4. **Edit in the form interface:**
   - Persona: "You are a professional customer service representative"
   - Instructions: Add clear steps
   - Variables: Define what inputs you need
   - Test Cases: Create example scenarios

### Method 2: Import Existing
1. **Get a `.prompt.json` file** from a colleague
2. **Double-click it** → Opens in Visual Builder automatically
3. **Modify as needed** → All changes sync to JSON

---

## 🧪 Step 4: Test & Iterate (2 minutes)

### Built-in Multi-Model Testing
1. **In the Visual Builder:**
   - ✅ Select models (GPT-4, Claude-3)
   - Enter test input
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
Category: Code Review  
Template: Chain of Thought
```

**Result (Generated automatically):**
- ✅ Professional code reviewer persona
- ✅ Step-by-step review instructions
- ✅ Variable for code input
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

## 🆘 Quick Troubleshooting

### Extension Not Loading?
```bash
npm run compile
# Press F5 again
```

### Visual Builder Not Opening?
- Ensure file ends with `.prompt.json`
- Try: Right-click → "Open with Prompt Builder"

### API Calls Failing?
- Verify API key is valid
- Check account has credits
- Look at Debug Console for errors

### Can't See ▶️ Button?
- Make sure `.prompt.json` file is open
- Extension should auto-activate

---

## 🚀 Next Steps

1. **Create 2-3 prompts** for your common use cases
2. **Test across models** to find best performance
3. **Share with team** to start collaborative library
4. **Explore community templates** for inspiration
5. **Set up Git workflow** for version control

---

**🎉 Congratulations!** You now have a complete prompt engineering workflow that transforms scattered prompts into collaborative, standardized infrastructure.

**Questions?** Check the [full documentation](./README.md) or [open an issue](https://github.com/prompt-studio/vscode-extension/issues). 