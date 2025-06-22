# Prompt Management Studio

## 🏗️ **Bring Engineering Discipline to Prompt Development**

The first and only VS Code extension that lets you develop, test, and manage AI prompts across ALL major providers without vendor lock-in. Transform prompt creation from chaotic copy-paste to structured, testable, version-controlled engineering practice.

**Build once, run anywhere - from your code editor.**

## 🎯 **What We're Building**

We noticed a gap in the current AI tooling landscape - most solutions either:

| Tool Category | IDE Integration | Multi-Provider Support |
|---------------|-----------------|-------------------------|
| **Vendor Consoles** (Azure AI Studio, Google AI Studio, etc.) | Web-only | Single vendor |
| **Developer Libraries** (LangChain, Semantic Kernel) | Code-only | Multi-provider |
| **CLI Tools** (Promptfoo) | Terminal-based | Multi-provider |
| **Prompt Studio** | Native VS Code | Multi-provider |

**Our goal**: Combine the convenience of IDE integration with the flexibility of multi-provider support.

## 🚀 **Quick Start**

### **Install & Run (2 minutes)**
```bash
# Install the extension
code --install-extension examples/prompt-management-studio-0.2.0.vsix

# Create your first prompt
# Press Cmd+Shift+P → "Prompt Studio: Create New Prompt"
```

### **What You'll Get**
- ✅ **Visual prompt builder** - No JSON writing required
- ✅ **Multi-model testing** - Compare GPT-4, Claude, Gemini side-by-side
- ✅ **Schema validation** - Prevent breaking changes automatically
- ✅ **Git integration** - Version control for your prompts
- ✅ **Template library** - 10+ professional templates included

## 🎬 **See It In Action**

![Prompt Studio Demo](examples/prompt-studio-demo-compact.gif)

**Complete walkthrough showing:**
- Creating a Python code review prompt from scratch
- Testing across multiple AI providers (GPT-4, Claude, Gemini)  
- Comparing responses and performance metrics
- Exporting and sharing prompts with your team

## 📋 **Structured Engineering Approach**

Apply software engineering best practices to prompt development:

```json
{
  "title": "Code Review Assistant",
  "prompt": {
    "persona": {
      "role": "You are a senior software engineer with 10+ years experience",
      "expertise": "Code quality, security, and performance optimization",
      "tone": "Professional but encouraging"
    },
    "instructions": [
      "Review the provided code for potential issues",
      "Focus on security vulnerabilities and performance problems", 
      "Provide specific, actionable recommendations",
      "Explain your reasoning for each suggestion"
    ],
    "few_shot_examples": [
      {
        "input": "function add(a, b) { return a + b }",
        "analysis": "Missing input validation, no type checking",
        "output": "Consider adding parameter validation and TypeScript types..."
      }
    ],
    "chain_of_thought": [
      "First, scan for obvious syntax errors",
      "Then analyze logic and edge cases", 
      "Check for security vulnerabilities",
      "Finally, suggest performance improvements"
    ]
  },
  "user_input_template": "Review this {{language}} code:\n\n{{code}}",
  "variables": [
    {
      "name": "code",
      "type": "string",
      "required": true,
      "description": "Source code to review"
    },
    {
      "name": "language", 
      "type": "string",
      "required": true,
      "description": "Programming language (e.g., Python, JavaScript)"
    }
  ],
  "test_cases": [
    {
      "name": "SQL Injection Risk",
      "inputs": {
        "code": "query = \"SELECT * FROM users WHERE id = \" + user_id",
        "language": "python"
      }
    }
  ]
}
```

**Why This Structure Works:**
- 🎯 **Persona** sets clear expectations and context
- 📝 **Instructions** break down complex tasks into clear steps
- 💡 **Examples** teach the AI your preferred response style
- 🧠 **Chain-of-thought** encourages systematic reasoning
- 🔧 **Variables** make prompts reusable and testable

## 🔧 **Core Features**

### **🏗️ Engineering Standards for Prompts**
- **Structured format** enforces consistent organization and documentation
- **Version control integration** treats prompts as first-class code assets
- **Schema validation** prevents breaking changes and maintains reliability
- **Systematic testing** across multiple models with consistent evaluation criteria

### **🧪 Professional Testing Framework**  
- **Multi-model evaluation** to identify the best AI for each use case
- **Test case management** ensures prompts work reliably across scenarios
- **Performance tracking** (response time, cost, quality metrics)
- **Breaking change detection** with schema validation and compatibility scoring

### **🔄 Production-Grade Schema Management**
- **Variable contract tracking** prevents breaking changes
- **Compatibility scoring** (0-100%) for prompt modifications  
- **Migration guidance** when variables change
- **Pre-save validation** catches issues before deployment

### **👨‍💻 Developer-Friendly**
- **Works with Git** - prompts are just JSON files
- **VS Code native** - syntax highlighting, IntelliSense, validation
- **Template variables** with `{{variable}}` syntax and type checking
- **Command palette** integration for quick actions

## 📚 **Business-Ready Template Library**

Skip the learning curve with professional prompts for real business scenarios:

- **📊 Financial Analysis** - Investment recommendations and risk assessment
- **📄 Contract Risk Analysis** - Legal document review and risk identification  
- **🏥 Healthcare Documentation** - Patient note standardization and analysis
- **📞 Customer Service** - Feedback analysis and response generation
- **🎯 Marketing Campaigns** - Personalized content creation and optimization
- **📋 Claims Processing** - Insurance claim adjudication and assessment
- **🔍 Data Analysis** - Structured data mapping and transformation
- **💼 HR & Recruitment** - Job description analysis and candidate evaluation

**Each template includes:**
- ✅ Structured prompt engineering best practices
- ✅ Real-world test cases and examples
- ✅ Multi-model optimization recommendations
- ✅ Variable validation and type checking

## 🎯 **Transform Your AI Development**

### **🔧 From Chaos to Standards**
- **Replace scattered prompts** with centralized, structured libraries
- **Eliminate copy-paste workflows** with reusable, parameterized templates
- **End prompt archaeology** - find and understand existing work instantly
- **Scale AI development** with consistent patterns and practices

### **🔓 Professional AI Development**
- **Multi-model optimization** to find the best AI for each specific task
- **Systematic evaluation** with repeatable testing and performance tracking
- **Team collaboration** through Git workflows and code review processes
- **Knowledge preservation** - no more lost prompts when team members leave

### **🚀 From Prototype to Production**
- **Rapid experimentation** with immediate multi-model feedback
- **Seamless integration** - export to any framework or API
- **Risk reduction** through systematic testing and validation
- **Scalable workflows** that grow with your organization

## 🔗 **Integration & Export**

While this tool focuses on learning and prototyping, your prompts are designed to be portable:

- **Standard JSON format** works with most AI frameworks
- **Export to code** snippets for integration into applications
- **Compatible with** LangChain, Semantic Kernel, and other frameworks
- **No vendor lock-in** - your prompts work everywhere

## 📚 **Documentation & Resources**

### **Get Started**
- **[📖 Quick Start Guide](docs/quick-start.md)** - First steps and basic concepts
- **[🏗️ User Guide](docs/user-guide.md)** - Complete feature walkthrough
- **[🏗️ Example Prompts](examples/)** - Sample prompts and templates
- **[🔧 Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions

### **Learn More**
- **[🏗️ Architecture](docs/architecture.md)** - How the extension works
- **[⚙️ Technology Stack](docs/technology-stack.md)** - Technical details
- **[🔌 API Reference](docs/api-reference.md)** - Extension API documentation
- **[💻 Development Setup](docs/development-setup.md)** - Contributing and local development

## 🤝 **Contributing**

This project is built by and for the developer community. We welcome contributions of all kinds:

**Code & Features:**
- Bug fixes and performance improvements
- New AI provider integrations
- VS Code extension enhancements
- Testing and quality improvements

**Content & Knowledge:**
- Prompt templates for various use cases
- Documentation improvements
- Usage examples and tutorials
- Best practices and guides

**Community & Feedback:**
- Issue reporting and feature requests
- User experience feedback
- Community support and discussions
- Spreading the word about the project

**Getting Started:**
Check out our [Contributing Guide](CONTRIBUTING.md) for development setup, coding standards, and how to submit contributions.

**Not sure where to start?** Look for issues labeled `good first issue` or `help wanted` in our GitHub repository.

## 🚦 **Current Status & Roadmap**

**Current Version (0.2.0)**: Core engineering platform
- ✅ Structured prompt creation with engineering standards
- ✅ Multi-model testing and evaluation  
- ✅ Native VS Code integration
- ✅ Production-grade variable validation

**Coming Soon**:
- 📊 Enhanced comparison metrics and visualizations
- 🔄 Prompt versioning and rollback capabilities
- 🏪 Community template marketplace
- 📈 Performance analytics and optimization insights

## 💭 **Project Philosophy**

We believe prompt engineering deserves the same care and tooling as any other aspect of software development. Our goal is to create an open-source tool that:

**Integrates naturally with developer workflows:**
- Works within VS Code where developers are already productive
- Supports standard practices like Git version control
- Provides the debugging and testing tools developers expect

**Preserves choice and flexibility:**
- No vendor lock-in or proprietary formats  
- Community-extensible architecture
- Open-source licensing for transparency and contribution

**Grows with the community:**
- Built in the open with community feedback
- Designed for extensibility and contribution
- Focused on solving real developer problems

This is a community project - we're building it together, for each other.

## 📄 **License**

MIT License - Use freely in personal and commercial projects.

## 🎯 **Who This Is For**

**Developers and teams who want:**
- AI prompt development that fits their existing workflow
- Freedom to choose the best AI provider for each task  
- Version control and collaboration for prompt engineering
- Open-source tools they can extend and contribute to

**We're particularly focused on:**
- Individual developers building AI-powered applications
- Small to medium development teams
- Organizations wanting vendor-independent AI development
- Open-source contributors interested in AI tooling
