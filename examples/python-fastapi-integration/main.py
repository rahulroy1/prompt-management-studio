from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
from typing import Dict, Any, Optional
import openai
import anthropic
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Prompt Management Studio - FastAPI Integration",
    description="Example FastAPI application showing how to integrate prompts from Prompt Management Studio",
    version="1.0.0"
)

# Configure API clients
openai.api_key = os.getenv("OPENAI_API_KEY")
anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class CodeReviewRequest(BaseModel):
    code: str
    language: str
    provider: str = "openai"  # openai, anthropic, google

class CustomerFeedbackRequest(BaseModel):
    feedback_text: str
    customer_sentiment: Optional[str] = None
    provider: str = "openai"

class PromptManager:
    """Manages prompt loading and execution from Prompt Management Studio files"""
    
    def __init__(self, prompts_dir: str = "../prompt-templates"):
        self.prompts_dir = prompts_dir
        self.prompts = {}
        self._load_prompts()
    
    def _load_prompts(self):
        """Load all prompt templates from the prompts directory"""
        for filename in os.listdir(self.prompts_dir):
            if filename.endswith('.prompt.json'):
                prompt_name = filename.replace('.prompt.json', '')
                with open(os.path.join(self.prompts_dir, filename), 'r') as f:
                    self.prompts[prompt_name] = json.load(f)
    
    def _compile_prompt(self, prompt_data: Dict[str, Any], variables: Dict[str, Any]) -> str:
        """Compile a prompt template with variables"""
        # Build the prompt from the structured format
        prompt_parts = []
        
        # Add persona
        if 'persona' in prompt_data['prompt']:
            persona = prompt_data['prompt']['persona']
            if 'role' in persona:
                prompt_parts.append(persona['role'])
            if 'expertise' in persona:
                prompt_parts.append(f"Expertise: {persona['expertise']}")
            if 'tone' in persona:
                prompt_parts.append(f"Tone: {persona['tone']}")
            prompt_parts.append("")
        
        # Add instructions
        if 'instructions' in prompt_data['prompt']:
            prompt_parts.append("Instructions:")
            for instruction in prompt_data['prompt']['instructions']:
                prompt_parts.append(f"- {instruction}")
            prompt_parts.append("")
        
        # Add examples if available
        if 'few_shot_examples' in prompt_data['prompt']:
            prompt_parts.append("Examples:")
            for example in prompt_data['prompt']['few_shot_examples']:
                prompt_parts.append(f"Input: {example['input']}")
                prompt_parts.append(f"Analysis: {example['analysis']}")
                prompt_parts.append(f"Output: {example['output']}")
                prompt_parts.append("")
        
        # Add chain of thought if available
        if 'chain_of_thought' in prompt_data['prompt']:
            prompt_parts.append("Please follow this process:")
            for step in prompt_data['prompt']['chain_of_thought']:
                prompt_parts.append(f"- {step}")
            prompt_parts.append("")
        
        # Add the user input template with variables
        if 'user_input_template' in prompt_data:
            user_input = prompt_data['user_input_template']
            for var_name, var_value in variables.items():
                user_input = user_input.replace(f"{{{{{var_name}}}}}", str(var_value))
            prompt_parts.append(user_input)
        
        return "\n".join(prompt_parts)
    
    async def execute_prompt(self, prompt_name: str, variables: Dict[str, Any], provider: str = "openai") -> str:
        """Execute a prompt with the specified provider"""
        if prompt_name not in self.prompts:
            raise ValueError(f"Prompt '{prompt_name}' not found")
        
        prompt_data = self.prompts[prompt_name]
        compiled_prompt = self._compile_prompt(prompt_data, variables)
        
        if provider == "openai":
            return await self._call_openai(compiled_prompt)
        elif provider == "anthropic":
            return await self._call_anthropic(compiled_prompt)
        elif provider == "google":
            return await self._call_google(compiled_prompt)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    async def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API"""
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000,
                temperature=0.1
            )
            return response.choices[0].message.content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    
    async def _call_anthropic(self, prompt: str) -> str:
        """Call Anthropic API"""
        try:
            response = await anthropic_client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Anthropic API error: {str(e)}")
    
    async def _call_google(self, prompt: str) -> str:
        """Call Google Gemini API"""
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = await model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Google API error: {str(e)}")

# Initialize prompt manager
prompt_manager = PromptManager()

@app.get("/")
async def root():
    return {
        "message": "Prompt Management Studio - FastAPI Integration",
        "available_prompts": list(prompt_manager.prompts.keys()),
        "endpoints": [
            "/code-review",
            "/customer-feedback",
            "/prompts"
        ]
    }

@app.get("/prompts")
async def list_prompts():
    """List all available prompts"""
    return {
        "prompts": [
            {
                "name": name,
                "title": data.get("title", name),
                "description": data.get("description", ""),
                "variables": data.get("variables", [])
            }
            for name, data in prompt_manager.prompts.items()
        ]
    }

@app.post("/code-review")
async def review_code(request: CodeReviewRequest):
    """Review code using the code review prompt template"""
    try:
        result = await prompt_manager.execute_prompt(
            "code-review-assistant",
            {
                "code": request.code,
                "language": request.language
            },
            request.provider
        )
        return {
            "prompt_used": "code-review-assistant",
            "provider": request.provider,
            "review": result,
            "variables": {
                "code": request.code[:100] + "..." if len(request.code) > 100 else request.code,
                "language": request.language
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/customer-feedback")
async def analyze_feedback(request: CustomerFeedbackRequest):
    """Analyze customer feedback using the feedback analyzer prompt template"""
    try:
        variables = {"feedback_text": request.feedback_text}
        if request.customer_sentiment:
            variables["customer_sentiment"] = request.customer_sentiment
        
        result = await prompt_manager.execute_prompt(
            "customer-feedback-analyzer",
            variables,
            request.provider
        )
        return {
            "prompt_used": "customer-feedback-analyzer",
            "provider": request.provider,
            "analysis": result,
            "variables": variables
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "prompts_loaded": len(prompt_manager.prompts)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 