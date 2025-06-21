# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with Prompt Management Studio.

## 🚨 Common Issues

### Extension Not Loading

#### **Symptoms:**
- Extension doesn't appear in VS Code
- Commands not available in Command Palette
- No custom editor for `.prompt.json` files

#### **Solutions:**

**1. Check VS Code Version**
```bash
# Verify VS Code version (requires 1.85.0+)
code --version
```

**2. Verify Extension Installation**
- Go to Extensions view (Ctrl+Shift+X)
- Search for "Prompt Management Studio"
- Check if extension is installed and enabled

**3. Restart VS Code**
```bash
# Completely restart VS Code
code --new-window
```

**4. Check Extension Logs**
- Open Developer Tools: `Help > Toggle Developer Tools`
- Check Console for error messages
- Look for extension activation errors

**5. Reinstall Extension**
```bash
# Uninstall and reinstall
code --uninstall-extension promptstudio.prompt-management-studio
code --install-extension promptstudio.prompt-management-studio
```

### API Key Configuration Issues

#### **Symptoms:**
- "API key not configured" errors
- Authentication failures during evaluation
- Models not available for testing

#### **Solutions:**

**1. Verify API Key Format**
- **OpenAI:** Must start with `sk-`
- **Anthropic:** Must start with `sk-ant-`
- **Google:** Usually starts with `AIza`

**2. Reconfigure API Keys**
```
Command Palette > Prompt Studio: Configure API Keys
```

**3. Check API Key Permissions**
- Verify key has required permissions
- Check usage quotas and billing
- Test key with provider's API directly

**4. Clear and Reset Keys**
```
Command Palette > Prompt Studio: Configure API Keys > Remove All Keys
```

**5. Manual Verification**
```bash
# Test OpenAI key
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.openai.com/v1/models

# Test Anthropic key
curl -H "x-api-key: YOUR_API_KEY" \
     https://api.anthropic.com/v1/messages

# Test Google key
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY"
```

### Prompt File Issues

#### **Symptoms:**
- "Invalid prompt file format" errors
- Prompt Builder UI not loading
- Compilation failures

#### **Solutions:**

**1. Validate JSON Syntax**
```bash
# Use jq to validate JSON
cat your-prompt.prompt.json | jq .

# Or use online JSON validator
```

**2. Check Required Fields**
```json
{
  "title": "Required - prompt title",
  "prompt": {
    "persona": { "role": "Required - AI role" },
    "instructions": ["Required - at least one instruction"]
  },
  "user_input_template": "Required - input template",
  "test_cases": [
    {
      "name": "Required - test case name",
      "inputs": {}
    }
  ]
}
```

**3. Verify Schema Compliance**
```json
{
  "$schema": "file:///path/to/schemas/prompt.schema.json"
}
```

**4. Check Variable Names**
```json
{
  "user_input_template": "Process {{input_text}}",
  "test_cases": [
    {
      "inputs": {
        "input_text": "Variable names must match"
      }
    }
  ]
}
```

### Evaluation Failures

#### **Symptoms:**
- Evaluation never completes
- API timeout errors
- Partial results only

#### **Solutions:**

**1. Check Internet Connection**
```bash
# Test connectivity to AI providers
ping api.openai.com
ping api.anthropic.com
ping generativelanguage.googleapis.com
```

**2. Verify API Quotas**
- Check your usage limits
- Verify billing status
- Review rate limiting

**3. Test with Single Model**
```json
{
  "models": ["gpt-3.5-turbo"]
}
```

**4. Reduce Prompt Complexity**
- Simplify instructions
- Remove few-shot examples temporarily
- Shorten user input

**5. Enable Debug Mode**
```json
// VS Code settings.json
{
  "promptStudio.debug": true
}
```

### Webview Issues

#### **Symptoms:**
- Prompt Builder UI appears blank
- JavaScript errors in webview
- UI elements not responding

#### **Solutions:**

**1. Refresh Webview**
- Press `Ctrl+R` in the webview
- Or use `Developer: Reload Window`

**2. Check Developer Tools**
- Right-click in webview > Inspect Element
- Check Console for JavaScript errors
- Verify network requests

**3. Clear VS Code Cache**
```bash
# Clear VS Code workspace cache
rm -rf .vscode/
```

**4. Disable Extensions**
- Disable other extensions temporarily
- Test with clean VS Code profile

### Performance Issues

#### **Symptoms:**
- Slow extension loading
- High memory usage
- Unresponsive UI

#### **Solutions:**

**1. Monitor Resource Usage**
```bash
# Check VS Code processes
ps aux | grep code

# Monitor memory usage
Activity Monitor (Mac) / Task Manager (Windows) / htop (Linux)
```

**2. Optimize Settings**
```json
// VS Code settings.json
{
  "promptStudio.debug": false,
  "promptStudio.maxConcurrentEvaluations": 3
}
```

**3. Reduce Concurrent Evaluations**
```json
{
  "models": ["gpt-4-turbo"]  // Test one model at a time
}
```

**4. Clear Extension Cache**
```bash
# Reset extension data
rm -rf ~/.vscode/extensions/promptstudio.prompt-management-studio-*/
```

## 🔧 Debug Mode

### Enabling Debug Mode

1. **Via Settings UI:**
   - Open Settings (Ctrl+,)
   - Search for "promptStudio.debug"
   - Enable the checkbox

2. **Via settings.json:**
```json
{
  "promptStudio.debug": true
}
```

### Debug Output Locations

**Extension Host Console:**
- Open Developer Tools: `Help > Toggle Developer Tools`
- Check Console tab for extension logs

**Output Panel:**
- View > Output
- Select "Prompt Studio" from dropdown

**Webview Console:**
- Right-click in Prompt Builder UI
- Select "Inspect Element"
- Check Console tab

### Debug Information

When debug mode is enabled, you'll see:
- API request/response details
- Prompt compilation steps
- File loading operations
- Error stack traces

## 🔍 Advanced Diagnostics

### Extension Manifest Check

```bash
# Verify extension is properly installed
ls ~/.vscode/extensions/ | grep prompt

# Check extension manifest
cat ~/.vscode/extensions/promptstudio.prompt-management-studio-*/package.json
```

### API Connectivity Test

```javascript
// Test in VS Code Developer Console
fetch('https://api.openai.com/v1/models', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### File System Permissions

```bash
# Check file permissions
ls -la your-prompt.prompt.json

# Verify write permissions
touch test-file.prompt.json
rm test-file.prompt.json
```

### Network Diagnostics

```bash
# Check proxy settings
echo $HTTP_PROXY
echo $HTTPS_PROXY

# Test DNS resolution
nslookup api.openai.com
nslookup api.anthropic.com
```

## 📊 Error Codes Reference

### E001: Extension Activation Failed
- **Cause:** Extension couldn't initialize
- **Solution:** Check VS Code version, restart VS Code

### E002: API Key Invalid
- **Cause:** API key format incorrect or expired
- **Solution:** Reconfigure API keys with correct format

### E003: Prompt File Malformed
- **Cause:** JSON syntax error or missing required fields
- **Solution:** Validate JSON, check required fields

### E004: Network Timeout
- **Cause:** API request timed out
- **Solution:** Check internet connection, try again

### E005: Model Not Supported
- **Cause:** Specified model not available
- **Solution:** Use supported model from list

### E006: Rate Limited
- **Cause:** Too many API requests
- **Solution:** Wait and retry, check rate limits

### E007: Insufficient Credits
- **Cause:** API account has no credits
- **Solution:** Add credits to API account

## 🛠️ Recovery Procedures

### Reset Extension to Default State

```bash
# 1. Uninstall extension
code --uninstall-extension promptstudio.prompt-management-studio

# 2. Clear settings
# Remove promptStudio.* entries from settings.json

# 3. Clear secrets
# API keys will be cleared automatically

# 4. Reinstall extension
code --install-extension promptstudio.prompt-management-studio
```

### Backup and Restore Prompts

```bash
# Backup prompts
cp -r my-prompts/ my-prompts-backup/

# Restore from backup
cp -r my-prompts-backup/ my-prompts/
```

### Export Debug Information

```bash
# Create debug report
echo "VS Code Version: $(code --version)" > debug-report.txt
echo "Node Version: $(node --version)" >> debug-report.txt
echo "Platform: $(uname -a)" >> debug-report.txt
echo "Extensions:" >> debug-report.txt
code --list-extensions >> debug-report.txt
```

## 📞 Getting Help

### Before Reporting Issues

1. **Check this troubleshooting guide**
2. **Search existing issues** on GitHub
3. **Try with minimal reproduction case**
4. **Collect debug information**

### Reporting Bugs

Include the following information:

**Environment:**
- VS Code version
- Extension version
- Operating system
- Node.js version

**Steps to Reproduce:**
1. Detailed step-by-step instructions
2. Sample prompt file (if applicable)
3. Expected vs actual behavior

**Debug Information:**
- Error messages from console
- Debug logs (if debug mode enabled)
- Screenshots (if UI issue)

### Community Support

- **GitHub Issues:** [Report bugs](https://github.com/rahulroy1/prompt-management-studio/issues)
- **GitHub Discussions:** [Ask questions](https://github.com/rahulroy1/prompt-management-studio/discussions)
- **Documentation:** [Check docs](README.md)

### Emergency Workarounds

**If extension is completely broken:**
1. Disable the extension temporarily
2. Edit `.prompt.json` files manually
3. Use external tools for API testing
4. Report the issue and wait for fix

**If specific model fails:**
1. Test with different model
2. Check provider status pages
3. Verify API key permissions
4. Use provider's official tools to test

---

**Remember:** Most issues can be resolved by checking API keys, validating prompt files, and ensuring network connectivity. When in doubt, try the simplest solution first! 🚀 