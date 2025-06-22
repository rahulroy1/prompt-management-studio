# Prompt Management Studio - Demo Examples

This folder contains everything needed for demonstrations and testing of the Prompt Management Studio VS Code extension.

## 📦 Contents

- **`prompt-management-studio-0.2.0.vsix`** - Latest packaged extension ready for installation
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

# Prompt Management Studio - Integration Examples

This directory contains practical examples showing how to integrate prompts from Prompt Management Studio into real applications.

## 📁 Available Examples

### 🐍 **Python FastAPI Integration**
**Location**: `python-fastapi-integration/`

A complete FastAPI application demonstrating:
- Multi-provider AI integration (OpenAI, Anthropic, Google)
- Automatic prompt loading from `.prompt.json` files
- RESTful API endpoints for code review and customer feedback
- Structured prompt compilation and variable substitution
- Comprehensive error handling

**Quick Start**:
```bash
cd python-fastapi-integration
pip install -r requirements.txt
cp env.example .env
# Edit .env with your API keys
python main.py
```

### ☕ **Spring Boot Integration**
**Location**: `spring-boot-integration/`

A Spring Boot application using Spring AI showing:
- Native Spring AI integration with multiple providers
- Automatic prompt template loading
- RESTful API with validation
- Structured prompt compilation
- Production-ready configuration

**Quick Start**:
```bash
cd spring-boot-integration
export OPENAI_API_KEY=your_key_here
export ANTHROPIC_API_KEY=your_key_here
mvn spring-boot:run
```

## 🎯 **What These Examples Demonstrate**

### **1. Seamless Integration**
Both examples show how to:
- Load prompts directly from Prompt Management Studio files
- Compile structured prompts into provider-specific formats
- Handle multiple AI providers with a single codebase
- Maintain prompt version control with your application code

### **2. Production-Ready Patterns**
- **Error handling**: Comprehensive error management for API failures
- **Validation**: Input validation and type checking
- **Configuration**: Environment-based configuration management
- **Monitoring**: Health checks and logging
- **Documentation**: Complete API documentation

### **3. Real-World Use Cases**
- **Code Review**: Automated code analysis and recommendations
- **Customer Feedback**: Sentiment analysis and response generation
- **Extensible Architecture**: Easy to add new prompts and providers

## 🔧 **Key Integration Patterns**

### **Prompt Loading**
```python
# Python - Automatic loading from directory
for filename in os.listdir(prompts_dir):
    if filename.endswith('.prompt.json'):
        # Load and parse prompt template
```

```java
// Java - Spring Boot service
@PostConstruct
public void loadPrompts() {
    // Load all .prompt.json files from templates directory
}
```

### **Prompt Compilation**
Both examples demonstrate how to convert the structured Prompt Management Studio format into provider-specific prompts:

1. **Persona**: Set AI role and expertise
2. **Instructions**: Step-by-step directives
3. **Examples**: Few-shot learning demonstrations
4. **Chain-of-Thought**: Systematic reasoning steps
5. **Variables**: Dynamic content substitution

### **Multi-Provider Support**
```python
# Python - Provider selection
if provider == "openai":
    return await self._call_openai(compiled_prompt)
elif provider == "anthropic":
    return await self._call_anthropic(compiled_prompt)
```

```java
// Java - Spring AI ChatClient injection
@Autowired @Qualifier("openaiChatClient") private ChatClient openaiClient;
@Autowired @Qualifier("anthropicChatClient") private ChatClient anthropicClient;
```

## 🚀 **Getting Started**

### **Prerequisites**
- API keys for at least one provider (OpenAI, Anthropic, or Google)
- Python 3.8+ (for FastAPI example)
- Java 17+ (for Spring Boot example)
- Maven 3.6+ (for Spring Boot example)

### **1. Choose Your Framework**
- **FastAPI**: If you prefer Python and async/await patterns
- **Spring Boot**: If you prefer Java and enterprise patterns

### **2. Set Up API Keys**
```bash
# For Python FastAPI
export OPENAI_API_KEY=your_key_here
export ANTHROPIC_API_KEY=your_key_here
export GOOGLE_API_KEY=your_key_here

# For Spring Boot
export OPENAI_API_KEY=your_key_here
export ANTHROPIC_API_KEY=your_key_here
export GOOGLE_PROJECT_ID=your_project_id_here
```

### **3. Run the Application**
```bash
# Python FastAPI
cd python-fastapi-integration
python main.py

# Spring Boot
cd spring-boot-integration
mvn spring-boot:run
```

### **4. Test the Integration**
```bash
# Code Review
curl -X POST "http://localhost:8000/code-review" \
  -H "Content-Type: application/json" \
  -d '{"code": "def add(a, b): return a + b", "language": "python"}'

# Customer Feedback
curl -X POST "http://localhost:8000/customer-feedback" \
  -H "Content-Type: application/json" \
  -d '{"feedback_text": "Great app!", "customer_sentiment": "positive"}'
```

## 📊 **API Endpoints**

Both examples provide the same core endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Root endpoint with available prompts |
| `/prompts` | GET | List all loaded prompts |
| `/code-review` | POST | Review code using AI |
| `/customer-feedback` | POST | Analyze customer feedback |
| `/health` | GET | Health check |

## 🔄 **Extending the Examples**

### **Adding New Prompts**
1. Create a new `.prompt.json` file in the `prompt-templates` directory
2. The application will automatically load it
3. Create a new endpoint to use the prompt

### **Adding New Providers**
1. Add the provider's SDK/dependency
2. Configure API keys and settings
3. Add provider-specific client code
4. Update the provider selection logic

### **Customizing Prompt Compilation**
Modify the `compilePrompt()` method to customize how structured prompts are converted to text.

## 🏗️ **Architecture Patterns**

### **Separation of Concerns**
- **PromptManager**: Handles prompt loading and compilation
- **Controllers**: Handle HTTP requests and responses
- **Models**: Define data structures and validation
- **Configuration**: Manage API keys and settings

### **Error Handling**
- **API Errors**: Provider-specific error handling
- **Validation Errors**: Input validation with clear messages
- **System Errors**: Graceful degradation and logging

### **Configuration Management**
- **Environment Variables**: Secure API key management
- **Application Properties**: Framework-specific configuration
- **Default Values**: Sensible defaults for development

## 📚 **Learning Resources**

### **Framework Documentation**
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring AI Documentation](https://docs.spring.io/spring-ai/reference/)

### **AI Provider Documentation**
- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic API](https://docs.anthropic.com/)
- [Google Vertex AI](https://cloud.google.com/vertex-ai/docs)

### **Prompt Engineering**
- [Prompt Management Studio Documentation](../docs/)
- [Prompt Templates](../prompt-templates/)

## 🤝 **Contributing**

We welcome contributions to improve these integration examples:

- **New Framework Examples**: Add examples for other frameworks (Node.js, .NET, etc.)
- **Enhanced Features**: Add authentication, rate limiting, caching, etc.
- **Better Documentation**: Improve setup instructions and API documentation
- **Testing**: Add comprehensive test suites
- **Performance**: Optimize prompt loading and execution

## 📄 **License**

These examples are provided under the same MIT license as the main project.
