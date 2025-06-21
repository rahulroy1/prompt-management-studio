import * as assert from 'assert';
import { SchemaValidator } from '../validator/SchemaValidator';
import { PromptFile } from '../types/PromptTypes';

suite('SchemaValidator Test Suite', () => {
  let validator: SchemaValidator;

  setup(() => {
    validator = new SchemaValidator();
  });

  suite('validateSchemaChange', () => {
    test('should detect no changes for identical prompts', () => {
      const prompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const result = validator.validateSchemaChange(prompt, prompt);
      
      assert.strictEqual(result.is_valid, true);
      assert.strictEqual(result.breaking_changes.length, 0);
      assert.strictEqual(result.compatibility_score, 100);
    });

    test('should detect breaking change when required variable is removed', () => {
      const oldPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}} {{context}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' },
          { name: 'context', type: 'string', required: true, description: 'Context' }
        ],
        test_cases: []
      };

      const newPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const result = validator.validateSchemaChange(oldPrompt, newPrompt);
      
      assert.strictEqual(result.is_valid, false);
      assert.strictEqual(result.migration_required, true);
      assert.strictEqual(result.breaking_changes.length, 1);
      assert.strictEqual(result.breaking_changes[0].type, 'variable_removed');
      assert.strictEqual(result.breaking_changes[0].variable_name, 'context');
      assert.strictEqual(result.breaking_changes[0].impact, 'breaking');
      assert.ok(result.compatibility_score < 100);
    });

    test('should detect warning when optional variable is removed', () => {
      const oldPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}} {{context}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' },
          { name: 'context', type: 'string', required: false, description: 'Context' }
        ],
        test_cases: []
      };

      const newPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const result = validator.validateSchemaChange(oldPrompt, newPrompt);
      
      assert.strictEqual(result.is_valid, true);
      assert.strictEqual(result.migration_required, false);
      assert.strictEqual(result.breaking_changes.length, 1);
      assert.strictEqual(result.breaking_changes[0].impact, 'warning');
    });

    test('should detect breaking change when new required variable is added', () => {
      const oldPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const newPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}} {{context}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' },
          { name: 'context', type: 'string', required: true, description: 'Context' }
        ],
        test_cases: []
      };

      const result = validator.validateSchemaChange(oldPrompt, newPrompt);
      
      assert.strictEqual(result.is_valid, false);
      assert.strictEqual(result.migration_required, true);
      assert.strictEqual(result.breaking_changes.length, 1);
      assert.strictEqual(result.breaking_changes[0].type, 'variable_added');
      assert.strictEqual(result.breaking_changes[0].impact, 'breaking');
    });

    test('should detect info when optional variable is added', () => {
      const oldPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const newPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}} {{context}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' },
          { name: 'context', type: 'string', required: false, description: 'Context' }
        ],
        test_cases: []
      };

      const result = validator.validateSchemaChange(oldPrompt, newPrompt);
      
      assert.strictEqual(result.is_valid, true);
      assert.strictEqual(result.migration_required, false);
      assert.strictEqual(result.breaking_changes.length, 1);
      assert.strictEqual(result.breaking_changes[0].impact, 'info');
    });

    test('should detect type changes as warnings', () => {
      const oldPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const newPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'number', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const result = validator.validateSchemaChange(oldPrompt, newPrompt);
      
      assert.strictEqual(result.is_valid, true);
      assert.strictEqual(result.breaking_changes.length, 1);
      assert.strictEqual(result.breaking_changes[0].type, 'type_changed');
      assert.strictEqual(result.breaking_changes[0].impact, 'warning');
    });

    test('should detect breaking change when variable becomes required', () => {
      const oldPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: false, description: 'User question' }
        ],
        test_cases: []
      };

      const newPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const result = validator.validateSchemaChange(oldPrompt, newPrompt);
      
      assert.strictEqual(result.is_valid, false);
      assert.strictEqual(result.breaking_changes.length, 1);
      assert.strictEqual(result.breaking_changes[0].type, 'required_changed');
      assert.strictEqual(result.breaking_changes[0].impact, 'breaking');
    });
  });

  suite('extractVariables', () => {
    test('should auto-detect variables from template when no variables declared', () => {
      const prompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}} and {{context}}',
        test_cases: []
      };

      const schema = validator.generateSchemaVersion(prompt);
      
      assert.strictEqual(schema.variables.length, 2);
      assert.deepStrictEqual(schema.variables.map(v => v.name).sort(), ['context', 'user_query']);
      assert.ok(schema.variables.every(v => v.required));
      assert.ok(schema.variables.every(v => v.type === 'string'));
    });

    test('should merge template variables with declared variables', () => {
      const prompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}} and {{context}} and {{extra}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' },
          { name: 'context', type: 'string', required: false, description: 'Context' }
        ],
        test_cases: []
      };

      const schema = validator.generateSchemaVersion(prompt);
      
      assert.strictEqual(schema.variables.length, 3);
      
      const userQuery = schema.variables.find(v => v.name === 'user_query');
      assert.strictEqual(userQuery?.required, true);
      assert.strictEqual(userQuery?.description, 'User question');
      
      const context = schema.variables.find(v => v.name === 'context');
      assert.strictEqual(context?.required, false);
      assert.strictEqual(context?.description, 'Context');
      
      const extra = schema.variables.find(v => v.name === 'extra');
      assert.strictEqual(extra?.required, true);
      assert.strictEqual(extra?.description, 'Auto-detected from template');
    });
  });

  suite('calculateCompatibilityScore', () => {
    test('should return 100 for no changes', () => {
      const prompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        test_cases: []
      };

      const result = validator.validateSchemaChange(prompt, prompt);
      assert.strictEqual(result.compatibility_score, 100);
    });

    test('should decrease score for breaking changes', () => {
      const oldPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}} {{context}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' },
          { name: 'context', type: 'string', required: true, description: 'Context' }
        ],
        test_cases: []
      };

      const newPrompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'number', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const result = validator.validateSchemaChange(oldPrompt, newPrompt);
      
      // Should have: 1 breaking change (removed variable) + 1 warning (type change)
      // Score: 100 - 25 (breaking) - 10 (warning) = 65
      assert.strictEqual(result.compatibility_score, 65);
    });
  });

  suite('generateSchemaVersion', () => {
    test('should generate consistent checksums for same variable schema', () => {
      const prompt: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const schema1 = validator.generateSchemaVersion(prompt);
      const schema2 = validator.generateSchemaVersion(prompt);
      
      assert.strictEqual(schema1.checksum, schema2.checksum);
    });

    test('should generate different checksums for different variable schemas', () => {
      const prompt1: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: true, description: 'User question' }
        ],
        test_cases: []
      };

      const prompt2: PromptFile = {
        title: 'Test Prompt',
        prompt: { 
          persona: { role: 'assistant' }, 
          instructions: ['Help the user'] 
        },
        user_input_template: '{{user_query}}',
        variables: [
          { name: 'user_query', type: 'string', required: false, description: 'User question' }
        ],
        test_cases: []
      };

      const schema1 = validator.generateSchemaVersion(prompt1);
      const schema2 = validator.generateSchemaVersion(prompt2);
      
      assert.notStrictEqual(schema1.checksum, schema2.checksum);
    });
  });
}); 