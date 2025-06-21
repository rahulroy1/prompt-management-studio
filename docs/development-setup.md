# Development Setup Guide

This guide will help you set up a local development environment for Prompt Management Studio and understand the development workflow.

## 🛠️ Prerequisites

### Required Software

- **Node.js 18.x or higher** - [Download](https://nodejs.org/)
- **VS Code 1.85.0 or higher** - [Download](https://code.visualstudio.com/)
- **Git** - [Download](https://git-scm.com/)

### Recommended Extensions

Install these VS Code extensions for the best development experience:

- **TypeScript and JavaScript Language Features** (built-in)
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitLens** - Enhanced Git capabilities
- **Thunder Client** - API testing (for model client development)

## 🚀 Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/rahulroy1/prompt-management-studio.git
cd prompt-management-studio

# Install dependencies
npm install

# Build the extension
npm run compile
```

### 2. Open in VS Code

```bash
# Open the project in VS Code
code .
```

### 3. Run Extension Development Host

- Press `F5` in VS Code
- Or run `Debug: Start Debugging` from Command Palette
- A new VS Code window will open with the extension loaded

## 📁 Project Structure

```
prompt-management-studio/
├── src/                    # TypeScript source code
│   ├── auth/              # API key management
│   ├── builder/           # Prompt Builder UI
│   ├── compiler/          # Prompt compilation logic
│   ├── creator/           # File creation utilities
│   ├── evaluator/         # Multi-model evaluation
│   ├── ide/               # VS Code integration
│   ├── models/            # AI model clients
│   ├── types/             # TypeScript definitions
│   └── test/              # Test files
├── media/                 # UI assets and icons
├── schemas/               # JSON schemas
├── prompt-templates/      # Golden templates
├── syntaxes/              # Language syntax definitions
├── docs/                  # Documentation
├── dist/                  # Webpack build output
├── out/                   # TypeScript compilation output
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript configuration
├── webpack.config.js      # Webpack configuration
└── .eslintrc.json         # ESLint configuration
```

## 🔧 Development Workflow

### Building the Extension

```bash
# Compile TypeScript (development)
npm run compile

# Watch for changes (recommended during development)
npm run watch

# Build for production (webpack)
npm run build

# Package as VSIX
npm run package
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Quality

```bash
# Lint TypeScript code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier (if configured)
npm run format
```

## 🐛 Debugging

### Extension Development Host

1. **Start Debugging:**
   - Press `F5` in VS Code
   - Select "Run Extension" from the debug dropdown
   - New VS Code window opens with extension loaded

2. **Set Breakpoints:**
   - Click in the gutter next to line numbers
   - Breakpoints work in TypeScript source files
   - Use `debugger;` statements for programmatic breakpoints

3. **Debug Console:**
   - View console output in the Debug Console
   - Use `console.log()` for debugging output
   - Check the original VS Code window for debug output

### Webview Debugging

The Prompt Builder UI runs in a webview, which requires special debugging:

1. **Open Developer Tools:**
   - In the Extension Development Host window
   - Go to `Help > Toggle Developer Tools`
   - Or use `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

2. **Debug Webview:**
   - Console errors appear in Developer Tools
   - Use browser debugging techniques
   - Network tab shows API calls

### Common Debug Scenarios

#### **Extension Not Loading**
```bash
# Check compilation errors
npm run compile

# Check for missing dependencies
npm install

# Verify VS Code version
code --version
```

#### **API Calls Failing**
```typescript
// Add detailed logging
console.log('Making API call:', { model, prompt });
try {
  const response = await this.callModel(model, prompt);
  console.log('API response:', response);
} catch (error) {
  console.error('API error:', error);
}
```

#### **Webview Issues**
```javascript
// In webview JavaScript
console.log('Webview loaded');
window.addEventListener('error', (e) => {
  console.error('Webview error:', e);
});
```

## 🧪 Testing Strategy

### Unit Tests

Located in `src/test/`, using Mocha and Chai:

```typescript
// Example test file: src/test/compiler.test.ts
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { PromptCompiler } from '../compiler/PromptCompiler';

describe('PromptCompiler', () => {
  describe('compile()', () => {
    it('should compile basic prompt', () => {
      const compiler = new PromptCompiler();
      const result = compiler.compile(mockPromptFile, mockVariables);
      expect(result.messages).to.have.length.greaterThan(0);
    });
  });
});
```

### Integration Tests

Test extension commands and VS Code integration:

```typescript
// Example: src/test/extension.test.ts
import * as vscode from 'vscode';
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Extension Integration', () => {
  it('should register commands', async () => {
    const commands = await vscode.commands.getCommands();
    expect(commands).to.include('promptStudio.evaluatePrompt');
  });
});
```

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Prompt Builder UI opens for `.prompt.json` files
- [ ] API key configuration works
- [ ] Prompt evaluation completes successfully
- [ ] Results display correctly
- [ ] File saving works properly
- [ ] Error handling is graceful

## 🔄 Hot Reloading

### TypeScript Watch Mode

```bash
# Terminal 1: Watch TypeScript compilation
npm run watch

# Terminal 2: Start debugging (F5 in VS Code)
# Changes will automatically recompile
```

### Webview Development

For webview changes, you need to reload the Extension Development Host:

1. Make changes to webview HTML/CSS/JS
2. Press `Ctrl+R` in Extension Development Host
3. Or use `Developer: Reload Window` command

## 📦 Building for Distribution

### Development Build

```bash
# Build with webpack (development)
npm run build:dev

# Package as VSIX
npm run package
```

### Production Build

```bash
# Build optimized for production
npm run build:prod

# Package for distribution
npm run package:prod
```

### VSIX Installation

```bash
# Install locally built VSIX
code --install-extension prompt-management-studio-*.vsix

# Or use VS Code UI:
# Extensions > ... > Install from VSIX
```

## 🔧 Configuration Files

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "outDir": "out",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", ".vscode-test"]
}
```

### Webpack Configuration (`webpack.config.js`)

```javascript
const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  externals: {
    vscode: 'commonjs vscode'
  }
};
```

### ESLint Configuration (`.eslintrc.json`)

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/naming-convention": "warn",
    "@typescript-eslint/semi": "warn",
    "curly": "warn",
    "eqeqeq": "warn",
    "no-throw-literal": "warn",
    "semi": "off"
  }
}
```

## 🚨 Common Issues

### Build Errors

#### **TypeScript Compilation Errors**
```bash
# Check specific errors
npm run compile

# Common fixes:
# 1. Update type definitions
# 2. Fix import statements
# 3. Add missing type annotations
```

#### **Webpack Bundle Errors**
```bash
# Debug webpack build
npm run build -- --mode development

# Common issues:
# 1. Missing dependencies in externals
# 2. Incorrect entry point
# 3. Module resolution issues
```

### Runtime Errors

#### **Extension Activation Failures**
```typescript
// Add error handling in activate()
export function activate(context: vscode.ExtensionContext) {
  try {
    // Extension initialization
  } catch (error) {
    console.error('Extension activation failed:', error);
    vscode.window.showErrorMessage(`Extension failed to activate: ${error.message}`);
  }
}
```

#### **API Integration Issues**
```typescript
// Test API calls independently
async function testApiCall() {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    console.log('API test:', response.status);
  } catch (error) {
    console.error('API test failed:', error);
  }
}
```

## 🔍 Performance Optimization

### Bundle Size

```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize:
# 1. Use dynamic imports for large dependencies
# 2. Exclude unnecessary files in .vscodeignore
# 3. Tree-shake unused code
```

### Memory Usage

```typescript
// Monitor memory usage
console.log('Memory usage:', process.memoryUsage());

// Best practices:
// 1. Dispose of event listeners
// 2. Clean up webview resources
// 3. Avoid memory leaks in long-running operations
```

### Startup Performance

```typescript
// Lazy load heavy dependencies
export async function activate(context: vscode.ExtensionContext) {
  // Register commands immediately
  const evaluateCommand = vscode.commands.registerCommand(
    'promptStudio.evaluatePrompt',
    async () => {
      // Lazy load heavy dependencies
      const { PromptEvaluator } = await import('./evaluator/PromptEvaluator');
      // ... rest of command logic
    }
  );
}
```

## 📚 Additional Resources

### VS Code Extension Development

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript in VS Code](https://code.visualstudio.com/docs/languages/typescript)

### Testing

- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [VS Code Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)

---

Happy developing! 🚀

For questions or issues, check our [Contributing Guide](../CONTRIBUTING.md) or open an issue on GitHub. 