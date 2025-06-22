#!/usr/bin/env node

/**
 * Demo Reset Script for Prompt Management Studio
 * 
 * This script helps prepare the extension for a clean demo by:
 * 1. Providing instructions to clear VS Code extension state
 * 2. Ensuring the VSIX package is in the examples folder
 * 3. Providing demo setup instructions
 */

const fs = require('fs');
const path = require('path');

console.log('🎬 Prompt Management Studio - Demo Reset');
console.log('=====================================\n');

// Check if VSIX file exists in examples
const examplesDir = path.join(__dirname, '..', 'examples');
const vsixFiles = fs.readdirSync(examplesDir).filter(file => file.endsWith('.vsix'));

if (vsixFiles.length > 0) {
  console.log('✅ VSIX package found in examples folder:');
  vsixFiles.forEach(file => console.log(`   📦 ${file}`));
} else {
  console.log('❌ No VSIX package found in examples folder');
  console.log('   Run: npm run package && mv *.vsix examples/');
}

console.log('\n🧹 To reset for a clean demo, follow these steps:\n');

console.log('1. Clear VS Code Extension State:');
console.log('   • Open VS Code');
console.log('   • Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)');
console.log('   • Type: "Developer: Reload Window"');
console.log('   • Or restart VS Code completely\n');

console.log('2. Clear API Keys (if extension is installed):');
console.log('   • Press Cmd+Shift+P');
console.log('   • Type: "Prompt Studio: Configure API Keys"');
console.log('   • Select "Remove All Keys"');
console.log('   • Confirm removal\n');

console.log('3. Uninstall Previous Extension (if needed):');
console.log('   • Press Cmd+Shift+P');
console.log('   • Type: "Extensions: Show Installed Extensions"');
console.log('   • Find "Prompt Management Studio"');
console.log('   • Click gear icon → Uninstall\n');

console.log('4. Install Fresh Extension for Demo:');
console.log(`   • Run: code --install-extension examples/${vsixFiles[0] || 'prompt-management-studio-0.2.0.vsix'}`);
console.log('   • Or use VS Code UI: Extensions → Install from VSIX');
console.log('   • IMPORTANT: Reload VS Code window after installation\n');

console.log('5. Verify Clean State:');
console.log('   • Press Cmd+Shift+P');
console.log('   • Type: "Prompt Studio: Create New Prompt"');
console.log('   • Should show welcome message (first time use)');
console.log('   • No API keys should be configured\n');

console.log('🎯 Demo Ready Checklist:');
console.log('□ Extension uninstalled/reinstalled');
console.log('□ API keys cleared');
console.log('□ Welcome message will show');
console.log('□ VSIX package available in examples/');
console.log('□ Demo script prepared\n');

console.log('🚀 Your demo environment is ready!');
console.log('   Start with: "Prompt Studio: Create New Prompt"'); 