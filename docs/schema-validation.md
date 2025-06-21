# Prompt Schema Validation

## 🔒 **Production Safety Through Variable Schema Tracking**

One of the most critical challenges in prompt engineering is maintaining compatibility when prompt templates evolve. A simple change like renaming a variable from `{{user_query}}` to `{{question}}` can break production systems that depend on the original variable name.

**Prompt Schema Validation** solves this by automatically tracking variable schemas across prompt versions and alerting you to breaking changes before they impact your code.

## 🎯 **Key Benefits**

### **Prevent Production Breaks**
- **Automatic Detection**: Identifies variable changes that could break existing integrations
- **Breaking Change Alerts**: Clear warnings when changes require code updates
- **Compatibility Scoring**: 0-100% score showing how compatible changes are

### **Safe Evolution**
- **Version Tracking**: Maintains a history of variable schema changes
- **Migration Guidance**: Specific recommendations for handling breaking changes
- **Rollback Safety**: Schema metadata helps understand impact of reverting changes

### **Developer Confidence**
- **Pre-Save Validation**: Catches issues before saving to prevent accidental breaks
- **Detailed Reports**: Comprehensive analysis of what changed and why it matters
- **Team Coordination**: Clear communication about variable contract changes

## 📋 **How It Works**

### **Automatic Schema Generation**
Every time you save a prompt, the system:

1. **Extracts Variables**: Scans your `user_input_template` for `{{variable}}` patterns
2. **Merges Declarations**: Combines template variables with your declared variables
3. **Generates Checksum**: Creates a unique fingerprint of your variable schema
4. **Stores Metadata**: Adds schema tracking information to your prompt file

### **Breaking Change Detection**
When you modify a prompt, the validator checks for:

| Change Type | Impact Level | Description |
|-------------|--------------|-------------|
| **Variable Removed** | 🚨 Breaking (if required) / ⚠️ Warning (if optional) | Existing code may fail |
| **Variable Added** | 🚨 Breaking (if required) / ℹ️ Info (if optional) | Code needs to provide new values |
| **Type Changed** | ⚠️ Warning | May cause runtime issues |
| **Required → Optional** | ℹ️ Info | Generally safe change |
| **Optional → Required** | 🚨 Breaking | Code must now provide value |

### **Compatibility Scoring**
The system calculates a compatibility score based on detected changes:
- **Breaking Changes**: -25 points each
- **Warnings**: -10 points each  
- **Info Changes**: -2 points each
- **Perfect Score**: 100% (no changes)

## 🛠️ **Using Schema Validation**

### **In the Visual Builder**
Schema validation runs automatically when you save prompts. If breaking changes are detected, you'll see a dialog with options:

- **Review Changes**: View detailed analysis in a new document
- **Proceed Anyway**: Save despite breaking changes (use with caution)
- **Cancel**: Return to editing to address issues

### **Example Breaking Change Dialog**
```
🚨 Schema validation detected 1 breaking change(s) and 0 warning(s):

🚨 New required variable 'context' added. Update code to provide this variable.

Compatibility Score: 75%

Proceeding may break existing code that uses this prompt.

[Review Changes] [Proceed Anyway] [Cancel]
```

### **Programmatic Usage**
```typescript
import { SchemaValidator } from './validator/SchemaValidator';

const validator = new SchemaValidator();

// Compare two prompt versions
const result = validator.validateSchemaChange(oldPrompt, newPrompt);

if (!result.is_valid) {
  console.log('Breaking changes detected:');
  result.breaking_changes.forEach(change => {
    console.log(`- ${change.migration_note}`);
  });
}

// Generate schema for new prompt
const schema = validator.generateSchemaVersion(prompt);
console.log(`Schema checksum: ${schema.checksum}`);
```

## 📊 **Schema Metadata Structure**

Each prompt includes schema tracking metadata:

```json
{
  "schema_version": "v1737652800000-abc123",
  "variable_schema": {
    "version": "v1737652800000-abc123",
    "variables": [
      {
        "name": "code",
        "type": "string",
        "required": true,
        "description": "The source code to be reviewed"
      }
    ],
    "created_at": "2024-01-15T10:00:00Z",
    "checksum": "a1b2c3d4e5f6g7h8",
    "breaking_changes": [
      {
        "type": "variable_added",
        "variable_name": "context",
        "impact": "breaking",
        "migration_note": "New required variable 'context' added. Update code to provide this variable."
      }
    ]
  }
}
```

## 🔄 **Migration Workflow**

### **When Breaking Changes Occur**

1. **Review the Report**: Understand what changed and why it's breaking
2. **Update Your Code**: Modify integrations to handle new variable schema
3. **Test Thoroughly**: Verify your changes work with the new schema
4. **Deploy Safely**: Roll out prompt and code changes together

### **Example Migration**

**Before (v1.0):**
```typescript
// Old integration code
const result = await promptEngine.run('code-review', {
  code: sourceCode,
  language: 'python'
});
```

**After (v2.0) - New required variable:**
```typescript
// Updated integration code
const result = await promptEngine.run('code-review', {
  code: sourceCode,
  language: 'python',
  context: 'This is a critical security module' // New required field
});
```

## 📈 **Best Practices**

### **For Prompt Authors**
- **Review Changes**: Always review breaking change reports before proceeding
- **Coordinate Updates**: Communicate variable changes to integration teams
- **Use Defaults**: Provide sensible defaults for optional variables
- **Version Deliberately**: Consider the impact on downstream consumers

### **For Integration Teams**
- **Monitor Schemas**: Set up alerts for prompt schema changes
- **Test Against Changes**: Validate your code against new schemas before deployment
- **Handle Gracefully**: Build error handling for variable mismatches
- **Version Lock**: Pin to specific schema versions for critical systems

### **For Teams**
- **Change Management**: Establish processes for reviewing schema changes
- **Testing Strategy**: Include schema compatibility in your test suites
- **Documentation**: Keep integration docs updated with current variable requirements
- **Rollback Plans**: Maintain ability to revert both prompts and integration code

## 🚀 **Advanced Features**

### **Schema Comparison API**
```typescript
// Compare any two prompts
const compatibility = validator.validateSchemaChange(promptA, promptB);
console.log(`Compatibility: ${compatibility.compatibility_score}%`);
```

### **Batch Validation**
```typescript
// Validate multiple prompts against a baseline
const prompts = [prompt1, prompt2, prompt3];
const baseline = baselinePrompt;

prompts.forEach(prompt => {
  const result = validator.validateSchemaChange(baseline, prompt);
  if (!result.is_valid) {
    console.log(`${prompt.title}: ${result.breaking_changes.length} issues`);
  }
});
```

### **Custom Validation Rules**
The validator can be extended with custom rules for organization-specific requirements:

```typescript
class CustomSchemaValidator extends SchemaValidator {
  protected detectBreakingChanges(oldVars, newVars) {
    const changes = super.detectBreakingChanges(oldVars, newVars);
    
    // Add custom rule: variable names must follow naming convention
    newVars.forEach(variable => {
      if (!variable.name.match(/^[a-z_]+$/)) {
        changes.push({
          type: 'naming_violation',
          variable_name: variable.name,
          impact: 'warning',
          migration_note: `Variable '${variable.name}' doesn't follow snake_case convention`
        });
      }
    });
    
    return changes;
  }
}
```

## 💡 **Real-World Example**

See `examples/schema-validation-demo.prompt.json` for a complete example showing:
- ✅ Proper variable declarations
- ✅ Schema metadata tracking  
- ✅ Breaking change history
- ✅ Migration documentation

This feature transforms prompt engineering from a risky, manual process into a safe, version-controlled workflow that scales with your team and protects your production systems. 