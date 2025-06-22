# Spring Boot Integration Example

This example demonstrates how to integrate prompts from Prompt Management Studio into a Spring Boot application using Spring AI.

## Features

- **Spring AI Integration**: Native Spring Boot support for multiple AI providers
- **Automatic prompt loading**: Loads all `.prompt.json` files from the templates directory
- **Structured prompt compilation**: Converts Prompt Management Studio format to provider-specific prompts
- **RESTful API endpoints**: Ready-to-use endpoints for code review and customer feedback analysis
- **Validation**: Input validation using Spring Boot validation
- **Error handling**: Comprehensive error handling for API calls and prompt execution

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- API keys for OpenAI, Anthropic, and/or Google Vertex AI

## Setup

1. **Clone and navigate to the project**:
   ```bash
   cd examples/spring-boot-integration
   ```

2. **Configure API keys**:
   Set the following environment variables:
   ```bash
   export OPENAI_API_KEY=your_openai_api_key_here
   export ANTHROPIC_API_KEY=your_anthropic_api_key_here
   export GOOGLE_PROJECT_ID=your_google_project_id_here
   export GOOGLE_LOCATION=us-central1
   ```

3. **Build the application**:
   ```bash
   mvn clean compile
   ```

4. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

   The application will start on `http://localhost:8080`

## API Endpoints

### GET `/api/`
Root endpoint showing available prompts and endpoints.

### GET `/api/prompts`
List all available prompts with their metadata.

### POST `/api/code-review`
Review code using the code review assistant prompt.

**Request Body**:
```json
{
  "code": "def add(a, b): return a + b",
  "language": "python",
  "provider": "openai"
}
```

### POST `/api/customer-feedback`
Analyze customer feedback using the feedback analyzer prompt.

**Request Body**:
```json
{
  "feedback_text": "The app is great but crashes sometimes",
  "customer_sentiment": "mixed",
  "provider": "anthropic"
}
```

### GET `/api/health`
Health check endpoint.

## Usage Examples

### Code Review
```bash
curl -X POST "http://localhost:8080/api/code-review" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def process_user_data(user_input):\n    query = \"SELECT * FROM users WHERE id = \" + user_input\n    return execute_query(query)",
    "language": "python",
    "provider": "openai"
  }'
```

### Customer Feedback Analysis
```bash
curl -X POST "http://localhost:8080/api/customer-feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback_text": "The new feature is amazing! Much faster than before.",
    "customer_sentiment": "positive",
    "provider": "anthropic"
  }'
```

## Key Components

### PromptManager Service
- **`loadPrompts()`**: Automatically loads all prompt templates from the `prompt-templates` directory
- **`compilePrompt()`**: Converts structured prompt format to text using Spring AI's prompt system
- **`executePrompt()`**: Executes prompts with different providers using Spring AI ChatClient

### Spring AI Integration
The application uses Spring AI's native support for multiple providers:
- **OpenAI**: GPT-4 with Spring AI's OpenAI starter
- **Anthropic**: Claude-3-Sonnet with Spring AI's Anthropic starter
- **Google**: Gemini Pro with Spring AI's Vertex AI starter

### Prompt Compilation
The system automatically converts Prompt Management Studio's structured format:
- Persona and expertise
- Step-by-step instructions
- Few-shot examples
- Chain-of-thought reasoning
- Variable substitution using Apache Commons Text

### Data Models
- **PromptData**: Complete model matching the `.prompt.json` schema
- **CodeReviewRequest**: DTO for code review requests with validation
- **CustomerFeedbackRequest**: DTO for customer feedback requests with validation

## Configuration

### Application Properties
The `application.yml` file configures:
- Server port and application name
- AI provider configurations (API keys, models, parameters)
- Logging levels

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `GOOGLE_PROJECT_ID`: Your Google Cloud project ID
- `GOOGLE_LOCATION`: Your Google Cloud location (default: us-central1)

## Customization

### Adding New Prompts
1. Create a new `.prompt.json` file in the `prompt-templates` directory
2. The system will automatically load it on startup
3. Create a new endpoint in `PromptController` to use it

### Adding New Providers
1. Add the provider's Spring AI starter to `pom.xml`
2. Configure the provider in `application.yml`
3. Add a new `@Qualifier` ChatClient in `PromptManager`
4. Update the `getClientForProvider()` method

### Customizing Prompt Compilation
Modify the `compilePrompt()` method in `PromptManager` to customize how prompts are compiled from the structured format.

## Development

### Running in Development Mode
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=dev"
```

### Testing
```bash
mvn test
```

### Building JAR
```bash
mvn clean package
java -jar target/prompt-management-studio-spring-1.0.0.jar
```

## Error Handling

The application includes comprehensive error handling:
- Missing API keys
- Invalid prompt names
- Provider API errors
- Input validation errors
- JSON parsing errors

All errors are returned as structured JSON responses with appropriate HTTP status codes.

## Monitoring

### Health Check
The `/api/health` endpoint provides:
- Application status
- Number of loaded prompts
- Basic health information

### Logging
The application logs:
- Prompt loading status
- API call results
- Error details
- Performance metrics

## Production Deployment

### Docker
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/prompt-management-studio-spring-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Environment Variables
Ensure all required environment variables are set in your production environment.

### Security
Consider adding:
- Authentication and authorization
- Rate limiting
- Input sanitization
- CORS configuration
- HTTPS enforcement 