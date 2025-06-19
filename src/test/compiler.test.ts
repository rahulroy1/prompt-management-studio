import * as assert from 'assert';
import { PromptCompiler } from '../compiler/PromptCompiler';
import { PromptFile } from '../types/PromptTypes';

suite('PromptCompiler Test Suite', () => {
  let compiler: PromptCompiler;

  setup(() => {
    compiler = new PromptCompiler();
  });

  test('should compile a basic prompt correctly', () => {
    const promptFile: PromptFile = {
      title: 'Test Prompt',
      models: ['gpt-4o-mini'],
      prompt: {
        persona: {
          role: 'You are a helpful assistant.'
        },
        instructions: ['Answer the user query.'],
      },
      user_input_template: '{{query}}',
      test_cases: []
    };

    const variables = { query: 'Hello, world!' };
    const compiled = compiler.compile(promptFile, variables);

    assert.deepStrictEqual(compiled.messages, [
      { role: 'system', content: 'You are a helpful assistant.\n\nInstructions:\n1. Answer the user query.' },
      { role: 'user', content: 'Hello, world!' }
    ]);
  });

  test('should handle variable substitution', () => {
    const promptFile: PromptFile = {
      title: 'Var Test',
      models: ['gpt-4o-mini'],
      prompt: {
        persona: { role: '' },
        instructions: []
      },
      user_input_template: 'User: {{name}}, Age: {{age}}',
      test_cases: []
    };

    const variables = { name: 'John Doe', age: 30 };
    const compiled = compiler.compile(promptFile, variables);

    assert.ok(compiled.messages.length > 0);
    const firstMessage = compiled.messages[0];
    assert.ok(firstMessage);
    assert.strictEqual(firstMessage.role, 'user');
    assert.strictEqual(firstMessage.content, 'User: John Doe, Age: 30');
  });

  test('should include few-shot examples', () => {
    const promptFile: PromptFile = {
      title: 'Few-Shot Test',
      models: ['gpt-4o-mini'],
      prompt: {
        persona: { role: '' },
        instructions: [],
        few_shot_examples: [
          { input: '1+1', output: '2' },
          { input: '2+2', output: '4' }
        ]
      },
      user_input_template: 'Calculate: {{math_problem}}',
      test_cases: []
    };
    
    const variables = { math_problem: '3+3' };
    const compiled = compiler.compile(promptFile, variables);

    assert.deepStrictEqual(compiled.messages, [
        { role: 'user', content: '1+1' },
        { role: 'assistant', content: '2' },
        { role: 'user', content: '2+2' },
        { role: 'assistant', content: '4' },
        { role: 'user', content: 'Calculate: 3+3' }
    ]);
  });

  test('should handle JSON output format', () => {
    const promptFile: PromptFile = {
        title: 'JSON Test',
        models: ['gpt-4o-mini'],
        prompt: {
            persona: { role: '' },
            instructions: [],
            output_format: {
                format: 'json',
                schema: { type: 'object', properties: { 'name': { 'type': 'string' } } }
            }
        },
        user_input_template: 'Extract name: {{text}}',
        test_cases: []
    };

    const variables = { text: 'My name is Jane.' };
    const compiled = compiler.compile(promptFile, variables);
    
    assert.ok(compiled.messages.length > 0);
    const firstMessage = compiled.messages[0];
    assert.ok(firstMessage);
    assert.ok(firstMessage.content.includes('Output Format: json'));
    assert.ok(firstMessage.content.includes('"type": "object"'));
    assert.deepStrictEqual(compiled.parameters, {
        temperature: 0.1,
        response_format: { type: 'json_object' }
    });
  });

  test('should build a comprehensive system message', () => {
    const promptFile: PromptFile = {
      title: 'System Message Test',
      models: ['gpt-4o-mini'],
      prompt: {
        persona: {
          role: 'You are an expert programmer.',
          tone: 'Concise and professional.'
        },
        instructions: ['Write clean code.', 'Add comments.'],
        chain_of_thought: ['Understand requirement.', 'Implement solution.'],
        constraints: ['Do not use external libraries.']
      },
      user_input_template: '{{request}}',
      test_cases: []
    };

    const variables = { request: 'Write a Fibonacci function.' };
    const compiled = compiler.compile(promptFile, variables);

    const expectedSystemMessage = [
        'You are an expert programmer.',
        '\nTone: Concise and professional.',
        '\nInstructions:',
        '1. Write clean code.',
        '2. Add comments.',
        '\nThinking Process:',
        '1. Understand requirement.',
        '2. Implement solution.',
        '\nConstraints:',
        '- Do not use external libraries.'
    ].join('\n');

    assert.ok(compiled.messages.length > 0);
    const firstMessage = compiled.messages[0];
    assert.ok(firstMessage);
    assert.strictEqual(firstMessage.content, expectedSystemMessage);
  });
}); 