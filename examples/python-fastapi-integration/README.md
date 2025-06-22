# FastAPI Integration Example

This example demonstrates how to integrate prompts from Prompt Management Studio into a FastAPI application.

## Features

- **Multi-provider support**: OpenAI, Anthropic, and Google Gemini
- **Automatic prompt loading**: Loads all `.prompt.json` files from the templates directory
- **Structured prompt compilation**: Converts Prompt Management Studio format to provider-specific prompts
- **RESTful API endpoints**: Ready-to-use endpoints for code review and customer feedback analysis
- **Error handling**: Comprehensive error handling for API calls and prompt execution

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure API keys**:
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

3. **Run the application**:
   ```bash
   python main.py
   ```

   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### GET `/`
Root endpoint showing available prompts and endpoints.

### GET `/prompts`
List all available prompts with their metadata.

### POST `/code-review`
Review code using the code review assistant prompt.

**Request Body**:
```json
{
  "code": "def add(a, b): return a + b",
  "language": "python",
  "provider": "openai"
}
```

### POST `/customer-feedback`
Analyze customer feedback using the feedback analyzer prompt.

**Request Body**:
```json
{
  "feedback_text": "The app is great but crashes sometimes",
  "customer_sentiment": "mixed",
  "provider": "anthropic"
}
```

### GET `/health`
Health check endpoint.

## Usage Examples

### Code Review
```bash
curl -X POST "http://localhost:8000/code-review" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def process_user_data(user_input):\n    query = \"SELECT * FROM users WHERE id = \" + user_input\n    return execute_query(query)",
    "language": "python",
    "provider": "openai"
  }'
```

### Customer Feedback Analysis
```bash
curl -X POST "http://localhost:8000/customer-feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback_text": "The new feature is amazing! Much faster than before.",
    "customer_sentiment": "positive",
    "provider": "anthropic"
  }'
```

## Key Components

### PromptManager Class
- **`_load_prompts()`**: Automatically loads all prompt templates
- **`_compile_prompt()`**: Converts structured prompt format to text
- **`execute_prompt()`**: Executes prompts with different providers

### Prompt Compilation
The system automatically converts Prompt Management Studio's structured format:
- Persona and expertise
- Step-by-step instructions
- Few-shot examples
- Chain-of-thought reasoning
- Variable substitution

### Multi-Provider Support
- **OpenAI**: GPT-4 with async API calls
- **Anthropic**: Claude-3-Sonnet
- **Google**: Gemini Pro

## Customization

### Adding New Prompts
1. Create a new `.prompt.json` file in the `prompt-templates` directory
2. The system will automatically load it
3. Create a new endpoint in `main.py` to use it

### Adding New Providers
1. Add the provider's API client to the imports
2. Configure the API key in the environment
3. Add a new `_call_<provider>()` method
4. Update the `execute_prompt()` method to support the new provider

## Error Handling

The application includes comprehensive error handling:
- Missing API keys
- Invalid prompt names
- Provider API errors
- Variable validation errors

## Development

### Auto-reload
The application includes auto-reload for development:
```bash
uvicorn main:app --reload
```

### API Documentation
Once running, visit `http://localhost:8000/docs` for interactive API documentation. 