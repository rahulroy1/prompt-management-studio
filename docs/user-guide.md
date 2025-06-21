# User Guide

Welcome to Prompt Management Studio! This guide will help you get started with creating, testing, and managing your AI prompts using our VS Code extension.

## 🚀 Getting Started

### Installation

1. **Install from VS Code Marketplace:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Prompt Management Studio"
   - Click Install

2. **Install from VSIX (Development):**
   - Download the `.vsix` file
   - Open VS Code
   - Run `Extensions: Install from VSIX...` from Command Palette
   - Select the downloaded file

### First Time Setup

1. **Configure API Keys:**
   - Open Command Palette (Ctrl+Shift+P)
   - Run `Prompt Studio: Configure API Keys`
   - Choose your AI provider (OpenAI, Anthropic, Google)
   - Enter your API key securely

2. **Create Your First Prompt:**
   - Create a new file with `.prompt.json` extension
   - VS Code will automatically open the Prompt Builder UI

## 📝 Creating Prompts

### Using the Prompt Builder

The Prompt Builder provides a guided interface for creating structured prompts:

#### **Design Tab**
- **Title & Description:** Give your prompt a clear name and description
- **Persona:** Define the AI's role, tone, and expertise
- **Instructions:** Add step-by-step instructions
- **Chain of Thought:** Include reasoning steps (optional)
- **Few-Shot Examples:** Provide input/output examples (optional)
- **Output Format:** Specify desired output format
- **Constraints:** Add limitations or requirements

#### **Test Tab**
- **User Input Template:** Define input with variables like `{{user_input}}`
- **Test Cases:** Create scenarios to test your prompt
- **Models:** Select which AI models to test against

#### **Metadata & Export Tab**
- **Author Information:** Your name and contact
- **Version Control:** Track versions and changes
- **Tags & Categories:** Organize your prompts
- **Export Options:** Save and share your prompts

### Example: Code Review Prompt

```json
{
  "title": "Code Review Assistant",
  "description": "Reviews code for bugs, best practices, and improvements",
  "prompt": {
    "persona": {
      "role": "You are a senior software engineer with 10+ years of experience",
      "tone": "constructive and helpful",
      "expertise": ["JavaScript", "TypeScript", "React", "Node.js"]
    },
    "instructions": [
      "Review the provided code carefully",
      "Identify potential bugs or issues",
      "Suggest improvements for readability and performance",
      "Provide specific examples when possible"
    ],
    "output_format": {
      "format": "markdown",
      "template": "## Issues Found\n\n## Suggestions\n\n## Overall Assessment"
    },
    "constraints": [
      "Keep feedback constructive and actionable",
      "Focus on the most important issues first"
    ]
  },
  "user_input_template": "Please review this code:\n\n```{{language}}\n{{code}}\n```",
  "test_cases": [
    {
      "name": "React Component",
      "inputs": {
        "language": "javascript",
        "code": "function Button({ onClick, children }) {\n  return <button onClick={onClick}>{children}</button>;\n}"
      }
    }
  ],
  "models": ["gpt-4-turbo", "claude-3-sonnet"]
}
```

## 🧪 Testing Prompts

### Running Evaluations

1. **Open a Prompt File:**
   - Open any `.prompt.json` file
   - The file will open in the Prompt Builder

2. **Test Your Prompt:**
   - Click "Test Now" in the Test tab
   - Select a test case if you have multiple
   - Wait for results from all configured models

3. **Review Results:**
   - Results appear in a side-by-side comparison
   - See response quality, latency, and token usage
   - Compare different models' outputs

### Understanding Results

Each evaluation shows:
- **Response:** The AI model's output
- **Latency:** How long the API call took
- **Tokens:** Number of tokens used (affects cost)
- **Cost Estimate:** Approximate cost for the request
- **Timestamp:** When the evaluation was run

### Best Practices for Testing

1. **Create Multiple Test Cases:**
   ```json
   "test_cases": [
     {
       "name": "Simple Case",
       "inputs": { "user_input": "Hello world" }
     },
     {
       "name": "Complex Case", 
       "inputs": { "user_input": "Complex scenario..." }
     },
     {
       "name": "Edge Case",
       "inputs": { "user_input": "Edge case scenario..." }
     }
   ]
   ```

2. **Test Across Multiple Models:**
   ```json
   "models": ["gpt-4-turbo", "claude-3-sonnet", "gemini-1.5-pro-latest"]
   ```

3. **Include Expected Outputs:**
   ```json
   "test_cases": [
     {
       "name": "Math Problem",
       "inputs": { "problem": "What is 2+2?" },
       "expected_output": "4"
     }
   ]
   ```

## 📁 Managing Prompts

### File Organization

Organize your prompts in a logical structure:

```
my-prompts/
├── code-review/
│   ├── javascript-review.prompt.json
│   ├── python-review.prompt.json
│   └── general-review.prompt.json
├── content-creation/
│   ├── blog-post.prompt.json
│   ├── social-media.prompt.json
│   └── email-templates.prompt.json
└── data-analysis/
    ├── csv-analysis.prompt.json
    └── report-generation.prompt.json
```

### Version Control

Since prompts are JSON files, they work perfectly with Git:

```bash
# Initialize a repository for your prompts
git init my-prompts
cd my-prompts

# Add and commit your prompts
git add *.prompt.json
git commit -m "Add initial prompt templates"

# Track changes over time
git log --oneline
```

### Sharing Prompts

1. **Export Individual Prompts:**
   - Use the "Export" button in the Metadata tab
   - Choose format (JSON, Markdown, etc.)

2. **Share via Git:**
   - Push your prompt repository to GitHub
   - Others can clone and use your prompts

3. **Create Prompt Libraries:**
   - Organize prompts by category
   - Document usage instructions
   - Include test cases and examples

## 🔧 Advanced Features

### Variables and Templates

Use variables to make prompts reusable:

```json
{
  "user_input_template": "Translate '{{text}}' from {{source_language}} to {{target_language}}",
  "variables": [
    {
      "name": "text",
      "type": "string",
      "description": "Text to translate",
      "required": true
    },
    {
      "name": "source_language",
      "type": "string",
      "description": "Source language",
      "default": "English"
    },
    {
      "name": "target_language", 
      "type": "string",
      "description": "Target language",
      "required": true
    }
  ]
}
```

### Chain of Thought Reasoning

Improve AI reasoning with explicit thinking steps:

```json
{
  "prompt": {
    "chain_of_thought": [
      "First, understand what the user is asking",
      "Consider the context and any constraints",
      "Think through the problem step by step",
      "Provide a clear, well-reasoned response"
    ]
  }
}
```

### Few-Shot Examples

Guide AI behavior with examples:

```json
{
  "prompt": {
    "few_shot_examples": [
      {
        "input": "What's the weather like?",
        "output": "I don't have access to real-time weather data. Please check a weather app or website for current conditions.",
        "explanation": "Politely decline when lacking required information"
      },
      {
        "input": "Can you help me with math?",
        "output": "Absolutely! I'd be happy to help with math problems. What specific topic or problem would you like assistance with?",
        "explanation": "Enthusiastically offer help for appropriate requests"
      }
    ]
  }
}
```

### Output Formatting

Control response structure:

```json
{
  "prompt": {
    "output_format": {
      "format": "json",
      "schema": {
        "type": "object",
        "properties": {
          "summary": { "type": "string" },
          "key_points": { 
            "type": "array",
            "items": { "type": "string" }
          },
          "confidence": { "type": "number" }
        }
      }
    }
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

#### **Extension Not Loading**
- Check VS Code version (requires 1.85.0+)
- Restart VS Code
- Check for extension updates

#### **API Key Issues**
- Verify API key format (starts with correct prefix)
- Check API key permissions and quotas
- Reconfigure keys: `Prompt Studio: Configure API Keys`

#### **Prompt Not Compiling**
- Validate JSON syntax
- Check required fields (title, prompt, user_input_template)
- Verify variable names match template

#### **Evaluation Failures**
- Check internet connection
- Verify API key has sufficient credits
- Try with a single model first

### Debug Mode

Enable detailed logging:

1. Open VS Code Settings (Ctrl+,)
2. Search for "promptStudio.debug"
3. Enable debug mode
4. Check Developer Console (Help > Toggle Developer Tools)

### Getting Help

- **Documentation:** Check the [docs](README.md) folder
- **Issues:** Report bugs on [GitHub Issues](https://github.com/rahulroy1/prompt-management-studio/issues)
- **Discussions:** Ask questions on [GitHub Discussions](https://github.com/rahulroy1/prompt-management-studio/discussions)

## 💡 Tips and Best Practices

### Writing Effective Prompts

1. **Be Specific:** Clear, detailed instructions work better than vague requests
2. **Use Examples:** Show the AI what you want with few-shot examples
3. **Set Constraints:** Define boundaries and limitations
4. **Test Thoroughly:** Use multiple test cases and models
5. **Iterate:** Refine based on test results

### Organizing Your Workflow

1. **Start Simple:** Begin with basic prompts, add complexity gradually
2. **Version Control:** Track changes and improvements over time
3. **Document Everything:** Include descriptions and usage notes
4. **Share and Collaborate:** Learn from others' prompts
5. **Monitor Performance:** Track which models work best for your use cases

### Cost Optimization

1. **Choose Models Wisely:** Use smaller models for simple tasks
2. **Optimize Prompts:** Shorter prompts = fewer tokens = lower cost
3. **Batch Testing:** Test multiple cases together when possible
4. **Monitor Usage:** Keep track of token consumption

---

Happy prompting! 🚀

For more advanced topics, see the [Extension Development Guide](extension-development.md) and [API Reference](api-reference.md). 