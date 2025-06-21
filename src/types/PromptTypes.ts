/**
 * Core types for the Prompt Studio extension
 */

export interface PromptFile {
  $schema?: string;
  title: string;
  description?: string;
  prompt: PromptStructure;
  user_input_template: string;
  variables?: VariableDefinition[];
  test_cases?: TestCase[];
  models?: ModelType[];
  metadata?: PromptMetadata;
  schema_version?: string;
  variable_schema?: VariableSchema;
}

export interface PromptStructure {
  persona: Persona;
  instructions: string[];
  chain_of_thought?: string[] | undefined;
  few_shot_examples?: FewShotExample[] | undefined;
  output_format?: OutputFormat | undefined;
  constraints?: string[] | undefined;
}

export interface Persona {
  role: string;
  tone?: string | undefined;
  expertise?: string[] | undefined;
}

export interface FewShotExample {
  input: string;
  output: string;
  explanation?: string | undefined;
}

export interface OutputFormat {
  format?: 'text' | 'json' | 'yaml' | 'markdown' | 'html' | 'xml' | undefined;
  schema?: object | undefined;
  template?: string | undefined;
}

export interface Variable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description?: string | undefined;
  required?: boolean | undefined;
  default?: any;
}

export interface VariableDefinition {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  default?: string;
}

export interface TestCase {
  name: string;
  description?: string | undefined;
  inputs: Record<string, any>;
  expected_output?: string | undefined;
  tags?: string[] | undefined;
}

export interface PromptMetadata {
  author?: string | undefined;
  created?: string | undefined;
  updated?: string | undefined;
  version?: string | undefined;
  tags?: string[] | undefined;
  category?: PromptCategory | undefined;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | undefined;
}

export type ModelProvider = 'OpenAI' | 'Anthropic' | 'Google' | 'Other';

export type ModelType =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'gemini-pro'
  | 'gemini-pro-vision'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307'
  | 'claude-3-5-sonnet-20240620'
  | 'gemini-1.5-pro-latest'
  | 'gemini-1.5-flash-latest'
  | 'gemini-pro';

export type PromptCategory =
  | 'code-review'
  | 'content-generation'
  | 'data-analysis'
  | 'customer-service'
  | 'documentation'
  | 'translation'
  | 'summarization'
  | 'creative-writing'
  | 'other';

export interface EvaluationResult {
  model: ModelType;
  response: string;
  metadata: {
    latency: number;
    tokens: number;
    cost_estimate?: number | undefined;
    error?: string | undefined;
  };
  timestamp: string;
}

export interface EvaluationSession {
  prompt_file: string;
  test_case: string;
  results: EvaluationResult[];
  started_at: string;
  completed_at?: string | undefined;
}

export interface ModelCredentials {
  openai_api_key?: string | undefined;
  anthropic_api_key?: string | undefined;
  google_api_key?: string | undefined;
}

export interface CompilationContext {
  variables: Record<string, any>;
  persona: Persona;
  instructions: string[];
  chain_of_thought?: string[] | undefined;
  few_shot_examples?: FewShotExample[] | undefined;
  output_format?: OutputFormat | undefined;
  constraints?: string[] | undefined;
}

export interface CompiledPrompt {
  provider: 'openai' | 'anthropic' | 'google';
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  parameters?: Record<string, any> | undefined;
}

export interface VariableSchema {
  version: string;
  variables: VariableDefinition[];
  created_at: string;
  checksum: string;
  breaking_changes?: BreakingChange[];
}

export interface BreakingChange {
  type: 'variable_added' | 'variable_removed' | 'variable_renamed' | 'type_changed' | 'required_changed';
  variable_name: string;
  old_value?: any;
  new_value?: any;
  impact: 'breaking' | 'warning' | 'info';
  migration_note?: string;
}

export interface SchemaValidationResult {
  is_valid: boolean;
  breaking_changes: BreakingChange[];
  warnings: string[];
  migration_required: boolean;
  compatibility_score: number; // 0-100
} 