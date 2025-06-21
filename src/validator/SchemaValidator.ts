import { PromptFile, VariableDefinition, VariableSchema, BreakingChange, SchemaValidationResult } from '../types/PromptTypes';
import * as crypto from 'crypto';

/**
 * Schema validator for prompt templates and variables.
 * 
 * Tracks variable schema changes across prompt versions and detects
 * breaking changes that could impact downstream code integration.
 * 
 * @example
 * ```typescript
 * const validator = new SchemaValidator();
 * const result = validator.validateSchemaChange(oldPrompt, newPrompt);
 * if (!result.is_valid) {
 *   console.log('Breaking changes detected:', result.breaking_changes);
 * }
 * ```
 */
export class SchemaValidator {
  
  /**
   * Validates schema changes between two prompt versions
   */
  validateSchemaChange(oldPrompt: PromptFile, newPrompt: PromptFile): SchemaValidationResult {
    const oldVariables = this.extractVariables(oldPrompt);
    const newVariables = this.extractVariables(newPrompt);
    
    const breakingChanges = this.detectBreakingChanges(oldVariables, newVariables);
    const warnings = this.generateWarnings(breakingChanges);
    const migrationRequired = breakingChanges.some(change => change.impact === 'breaking');
    const compatibilityScore = this.calculateCompatibilityScore(breakingChanges);
    
    return {
      is_valid: !migrationRequired,
      breaking_changes: breakingChanges,
      warnings,
      migration_required: migrationRequired,
      compatibility_score: compatibilityScore
    };
  }
  
  /**
   * Generates a schema version for the current prompt
   */
  generateSchemaVersion(prompt: PromptFile): VariableSchema {
    const variables = this.extractVariables(prompt);
    const checksum = this.calculateChecksum(variables);
    
    return {
      version: this.generateVersionString(),
      variables,
      created_at: new Date().toISOString(),
      checksum
    };
  }
  
  /**
   * Updates prompt with schema validation metadata
   */
  updatePromptSchema(prompt: PromptFile, previousSchema?: VariableSchema): PromptFile {
    const newSchema = this.generateSchemaVersion(prompt);
    
    if (previousSchema) {
      const validation = this.validateSchemaChange(
        { ...prompt, variable_schema: previousSchema },
        prompt
      );
      
      if (validation.breaking_changes.length > 0) {
        newSchema.breaking_changes = validation.breaking_changes;
      }
    }
    
    return {
      ...prompt,
      schema_version: newSchema.version,
      variable_schema: newSchema
    };
  }
  
  /**
   * Validates that a prompt matches its declared schema
   */
  validatePromptAgainstSchema(prompt: PromptFile): SchemaValidationResult {
    if (!prompt.variable_schema) {
      return {
        is_valid: true,
        breaking_changes: [],
        warnings: ['No schema defined - consider adding schema validation'],
        migration_required: false,
        compatibility_score: 100
      };
    }
    
    const currentVariables = this.extractVariables(prompt);
    const schemaVariables = prompt.variable_schema.variables;
    
    const breakingChanges = this.detectBreakingChanges(schemaVariables, currentVariables);
    
    return {
      is_valid: breakingChanges.length === 0,
      breaking_changes: breakingChanges,
      warnings: breakingChanges.length > 0 ? ['Prompt does not match declared schema'] : [],
      migration_required: breakingChanges.some(change => change.impact === 'breaking'),
      compatibility_score: this.calculateCompatibilityScore(breakingChanges)
    };
  }
  
  /**
   * Extracts variable definitions from prompt template and declared variables
   */
  private extractVariables(prompt: PromptFile): VariableDefinition[] {
    // Extract from template
    const templateVariables = this.extractTemplateVariables(prompt.user_input_template);
    
    // Merge with declared variables
    const declaredVariables = prompt.variables || [];
    const variableMap = new Map<string, VariableDefinition>();
    
    // Add declared variables first
    declaredVariables.forEach(variable => {
      variableMap.set(variable.name, variable);
    });
    
    // Add template variables if not already declared
    templateVariables.forEach(varName => {
      if (!variableMap.has(varName)) {
        variableMap.set(varName, {
          name: varName,
          type: 'string',
          description: `Auto-detected from template`,
          required: true
        });
      }
    });
    
    return Array.from(variableMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }
  
  /**
   * Extracts variable names from user input template
   */
  private extractTemplateVariables(template: string): string[] {
    const regex = /\{\{\s*([^}]+)\s*\}\}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(template)) !== null) {
      const variable = match[1].trim();
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    }
    
    return variables;
  }
  
  /**
   * Detects breaking changes between variable schemas
   */
  private detectBreakingChanges(oldVariables: VariableDefinition[], newVariables: VariableDefinition[]): BreakingChange[] {
    const changes: BreakingChange[] = [];
    const oldVarMap = new Map(oldVariables.map(v => [v.name, v]));
    const newVarMap = new Map(newVariables.map(v => [v.name, v]));
    
    // Check for removed variables
    for (const [name, oldVar] of oldVarMap) {
      if (!newVarMap.has(name)) {
        changes.push({
          type: 'variable_removed',
          variable_name: name,
          old_value: oldVar,
          impact: oldVar.required ? 'breaking' : 'warning',
          migration_note: `Variable '${name}' was removed. Update code to remove references.`
        });
      }
    }
    
    // Check for added variables
    for (const [name, newVar] of newVarMap) {
      if (!oldVarMap.has(name)) {
        changes.push({
          type: 'variable_added',
          variable_name: name,
          new_value: newVar,
          impact: newVar.required ? 'breaking' : 'info',
          migration_note: newVar.required 
            ? `New required variable '${name}' added. Update code to provide this variable.`
            : `New optional variable '${name}' added.`
        });
      }
    }
    
    // Check for modified variables
    for (const [name, newVar] of newVarMap) {
      const oldVar = oldVarMap.get(name);
      if (oldVar) {
        // Type change
        if (oldVar.type !== newVar.type) {
          changes.push({
            type: 'type_changed',
            variable_name: name,
            old_value: oldVar.type,
            new_value: newVar.type,
            impact: 'warning',
            migration_note: `Variable '${name}' type changed from ${oldVar.type} to ${newVar.type}.`
          });
        }
        
        // Required change
        if (oldVar.required !== newVar.required) {
          changes.push({
            type: 'required_changed',
            variable_name: name,
            old_value: oldVar.required,
            new_value: newVar.required,
            impact: (!oldVar.required && newVar.required) ? 'breaking' : 'info',
            migration_note: newVar.required 
              ? `Variable '${name}' is now required.`
              : `Variable '${name}' is now optional.`
          });
        }
      }
    }
    
    return changes;
  }
  
  /**
   * Generates warnings from breaking changes
   */
  private generateWarnings(breakingChanges: BreakingChange[]): string[] {
    const warnings: string[] = [];
    
    const breakingCount = breakingChanges.filter(c => c.impact === 'breaking').length;
    const warningCount = breakingChanges.filter(c => c.impact === 'warning').length;
    
    if (breakingCount > 0) {
      warnings.push(`${breakingCount} breaking change(s) detected that may break existing code`);
    }
    
    if (warningCount > 0) {
      warnings.push(`${warningCount} warning(s) detected that may require attention`);
    }
    
    return warnings;
  }
  
  /**
   * Calculates compatibility score (0-100)
   */
  private calculateCompatibilityScore(breakingChanges: BreakingChange[]): number {
    if (breakingChanges.length === 0) return 100;
    
    let score = 100;
    
    for (const change of breakingChanges) {
      switch (change.impact) {
        case 'breaking':
          score -= 25;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 2;
          break;
      }
    }
    
    return Math.max(0, score);
  }
  
  /**
   * Calculates checksum for variable schema
   */
  private calculateChecksum(variables: VariableDefinition[]): string {
    const normalized = variables
      .map(v => `${v.name}:${v.type}:${v.required}`)
      .sort()
      .join('|');
    
    return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
  }
  
  /**
   * Generates a version string
   */
  private generateVersionString(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `v${timestamp}-${random}`;
  }
} 