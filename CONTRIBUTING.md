# Contributing to Prompt Management Studio

First off, thank you for considering contributing to Prompt Management Studio! We welcome any and all contributions, from bug reports to feature requests and code changes.

This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Quick Start for Contributors

### Prerequisites
- [Visual Studio Code](https://code.visualstudio.com/) 1.85.0 or higher
- [Node.js](https://nodejs.org/) 18.x or higher
- [Git](https://git-scm.com/)

### Development Setup
1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/prompt-management-studio.git
   cd prompt-management-studio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run compile
   ```

4. **Run in Development Mode**
   - Press `F5` in VS Code to open Extension Development Host
   - Or run: `code --extensionDevelopmentPath=. --new-window`

5. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   ```

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

**Before submitting a bug report:**
- Check the [existing issues](https://github.com/rahulroy1/prompt-management-studio/issues)
- Try the latest version of the extension
- Check if the issue occurs in a clean VS Code profile

**When submitting a bug report, include:**
- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected vs actual behavior**
- **Environment details:**
  - VS Code version (`Help > About`)
  - Extension version
  - Operating System
  - Node.js version (`node --version`)
- **Error messages** from VS Code Developer Console (`Help > Toggle Developer Tools`)
- **Screenshots** if applicable
- **Sample `.prompt.json` file** that reproduces the issue

### ✨ Suggesting Enhancements

**Before submitting an enhancement:**
- Check [existing issues](https://github.com/rahulroy1/prompt-management-studio/issues) and [roadmap](product-roadmap.md)
- Consider if it aligns with our [vision](vision.md)

**When suggesting enhancements, include:**
- **Clear description** of the feature and problem it solves
- **User stories** ("As a developer, I want...")
- **Mockups or examples** if applicable
- **Implementation considerations** if you have ideas

### 💻 Contributing Code

#### **Types of Contributions We Welcome:**
- 🐛 Bug fixes
- ✨ New features (discuss in issues first)
- 📚 Documentation improvements
- 🧪 Test coverage improvements
- 🎨 UI/UX enhancements
- 🚀 Performance optimizations
- 🔌 New model provider integrations

#### **Pull Request Process:**

1. **Create an Issue First** (for features)
   - Discuss the approach before implementing
   - Get feedback on design decisions

2. **Fork and Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

3. **Make Your Changes**
   - Follow our [coding standards](#coding-standards)
   - Add tests for new functionality
   - Update documentation

4. **Test Thoroughly**
   ```bash
   npm run compile  # Check TypeScript compilation
   npm run lint     # Check code style
   npm test         # Run test suite
   ```

5. **Commit with Clear Messages**
   ```bash
   git commit -m "feat: add support for new model provider"
   git commit -m "fix: resolve template variable substitution bug"
   git commit -m "docs: add API documentation for ModelClient"
   ```

6. **Submit Pull Request**
   - Link to related issues
   - Describe what you changed and why
   - Include screenshots for UI changes
   - Request review from maintainers

## 📋 Coding Standards

### **TypeScript Guidelines**
- Use **strict TypeScript** - all types must be explicit
- Prefer **interfaces over types** for object shapes
- Use **async/await** over Promises
- Handle errors explicitly with try/catch
- Document all public APIs with JSDoc

**Example:**
```typescript
/**
 * Evaluates a prompt against multiple AI models
 * @param promptFile - The structured prompt definition
 * @param testCase - Test case with input variables
 * @returns Promise resolving to evaluation results
 * @throws Error when API keys are missing or invalid
 */
async evaluatePrompt(
  promptFile: PromptFile, 
  testCase: TestCase
): Promise<EvaluationResult[]> {
  // Implementation
}
```

### **Code Style**
- Use **ESLint** configuration (run `npm run lint`)
- **2 spaces** for indentation
- **Single quotes** for strings
- **Trailing commas** in objects/arrays
- **Semicolons** always

### **File Organization**
```
src/
├── auth/           # Authentication and API key management
├── builder/        # Prompt Builder UI components
├── compiler/       # Prompt compilation logic
├── evaluator/      # Multi-model evaluation engine
├── models/         # AI model client implementations
├── types/          # TypeScript type definitions
└── test/           # Test files
```

### **Naming Conventions**
- **Classes:** PascalCase (`PromptEvaluator`)
- **Functions/Variables:** camelCase (`evaluatePrompt`)
- **Constants:** UPPER_SNAKE_CASE (`DEFAULT_MODELS`)
- **Files:** PascalCase for classes, camelCase for utilities
- **Interfaces:** PascalCase with descriptive names

## 🧪 Testing Guidelines

### **Test Structure**
```typescript
import { describe, it, expect } from 'mocha';
import { PromptCompiler } from '../src/compiler/PromptCompiler';

describe('PromptCompiler', () => {
  describe('compile()', () => {
    it('should compile basic prompt with variables', async () => {
      // Arrange
      const compiler = new PromptCompiler();
      const promptFile = { /* test data */ };
      
      // Act
      const result = await compiler.compile(promptFile, { user_input: 'test' });
      
      // Assert
      expect(result.messages).to.have.length.greaterThan(0);
    });
  });
});
```

### **What to Test**
- ✅ **Unit tests** for core logic (compiler, evaluator)
- ✅ **Integration tests** for API interactions
- ✅ **UI tests** for webview components
- ✅ **Error handling** for edge cases

### **Running Tests**
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

## 📚 Documentation Standards

### **Code Documentation**
- **JSDoc comments** for all public APIs
- **Inline comments** for complex logic
- **Type annotations** for all parameters and returns
- **Examples** in documentation

### **README Updates**
- Update feature lists for new functionality
- Add new configuration options
- Include new command descriptions

## 🏗️ Architecture Guidelines

### **Extension Structure**
Our VS Code extension follows a modular architecture:

```typescript
// Main extension entry point
export function activate(context: vscode.ExtensionContext) {
  // Initialize services
  const apiKeyManager = new ApiKeyManager(context);
  const promptEvaluator = new PromptEvaluator(apiKeyManager);
  
  // Register providers and commands
}
```

### **Key Principles**
1. **Separation of Concerns** - Each module has a single responsibility
2. **Dependency Injection** - Services are injected, not instantiated
3. **Error Boundaries** - Graceful error handling at module boundaries
4. **Local-First** - All data stays on the user's machine
5. **Provider Abstraction** - Model providers are interchangeable

### **Adding New Model Providers**
1. Extend `ModelType` in `types/PromptTypes.ts`
2. Add provider logic in `models/ModelClient.ts`
3. Update `compiler/PromptCompiler.ts` if needed
4. Add tests and documentation

## 🔄 Release Process

### **Version Numbering**
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### **Release Checklist**
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Tagged release in Git

## 🤝 Community Guidelines

### **Code Reviews**
- Be constructive and respectful
- Focus on code, not the person
- Suggest alternatives when pointing out issues
- Acknowledge good practices

### **Communication**
- Use GitHub issues for bug reports and feature requests
- Use GitHub Discussions for questions and ideas
- Be patient - maintainers are volunteers
- Help others when you can

## 📞 Getting Help

- **Documentation:** Check [README.md](README.md) and [docs/](docs/)
- **Issues:** Search [existing issues](https://github.com/rahulroy1/prompt-management-studio/issues)
- **Discussions:** Join [GitHub Discussions](https://github.com/rahulroy1/prompt-management-studio/discussions)

## 🙏 Recognition

Contributors are recognized in:
- GitHub contributor graphs
- Release notes for significant contributions
- README.md contributors section (coming soon)

---

**Thank you for helping us make Prompt Management Studio the best tool for prompt engineering! 🚀**

Every contribution, no matter how small, makes a difference in building the future of AI development tooling. 