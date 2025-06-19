// Prompt Builder JavaScript
(function() {
    const vscode = acquireVsCodeApi();
    
    let currentPrompt = null;
    let isDirty = false;
    
    const modelFamilies = {
      "OpenAI": ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
      "Anthropic": ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
      "Google": ["gemini-1.5-pro-latest", "gemini-1.5-flash-latest", "gemini-pro"]
    };
    
    // DOM Elements
    const elements = {
        title: document.getElementById('title'),
        description: document.getElementById('description'),
        personaRole: document.getElementById('persona-role'),
        instructions: document.getElementById('instructions'),
        chainOfThought: document.getElementById('chain-of-thought'),
        examplesList: document.getElementById('examples-list'),
        addExampleBtn: document.getElementById('add-example'),
        userInputTemplate: document.getElementById('user-input-template'),
        outputFormatType: document.getElementById('output-format-type'),
        outputFormatSchema: document.getElementById('output-format-schema'),
        modelSelectionList: document.getElementById('model-selection-list'),
        addModelBtn: document.getElementById('add-model-btn'),
        testInput: document.getElementById('test-input'),
        runTestBtn: document.getElementById('run-test'),
        clearTestBtn: document.getElementById('clear-test'),
        testResults: document.getElementById('test-results'),
        saveBtn: document.getElementById('save-prompt'),
        exportJsonBtn: document.getElementById('export-json'),
        exportPackageBtn: document.getElementById('export-package'),
        shareTeamBtn: document.getElementById('share-team')
    };
    
    // Initialize event listeners
    function initializeEventListeners() {
        // Form change listeners
        Object.values(elements).forEach(element => {
            if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT')) {
                element.addEventListener('input', handleFormChange);
            }
        });
        
        // Button listeners
        elements.addExampleBtn?.addEventListener('click', addExample);
        elements.addModelBtn?.addEventListener('click', () => addModelRow());
        elements.runTestBtn?.addEventListener('click', runTest);
        elements.clearTestBtn?.addEventListener('click', clearTestArea);
        elements.saveBtn?.addEventListener('click', () => savePrompt(false));
        elements.exportJsonBtn?.addEventListener('click', () => exportPrompt('json'));
        elements.exportPackageBtn?.addEventListener('click', () => exportPrompt('package'));
        elements.shareTeamBtn?.addEventListener('click', shareWithTeam);
        
        // Model checkbox listeners
        [elements.gpt4Checkbox, elements.claudeCheckbox, elements.geminiCheckbox].forEach(checkbox => {
            checkbox?.addEventListener('change', handleFormChange);
        });
    }
    
    // Handle messages from VS Code
    window.addEventListener('message', event => {
        const message = event.data;
        
        switch (message.type) {
            case 'load':
                loadPromptData(message.prompt);
                break;
            case 'testResults':
                displayTestResults(message.results);
                break;
            case 'error':
                showError(message.message);
                break;
        }
    });
    
    // Load prompt data into form
    function loadPromptData(prompt) {
        currentPrompt = prompt;
        isDirty = false;
        
        // Populate basic fields
        if (elements.title) elements.title.value = prompt.title || '';
        if (elements.description) elements.description.value = prompt.description || '';
        if (elements.personaRole) elements.personaRole.value = prompt.prompt?.persona?.role || '';
        if (elements.userInputTemplate) elements.userInputTemplate.value = prompt.user_input_template || '';
        
        // Load instructions and chain of thought into textareas
        if (elements.instructions) {
            elements.instructions.value = (prompt.prompt?.instructions || []).join('\n');
        }
        if (elements.chainOfThought) {
            elements.chainOfThought.value = (prompt.prompt?.chain_of_thought || []).join('\n');
        }
        
        // Load examples
        loadExamples(prompt.prompt?.few_shot_examples || []);
        
        // Load output format
        const outputFormat = prompt.prompt?.output_format;
        if (elements.outputFormatType && outputFormat?.format) {
            elements.outputFormatType.value = outputFormat.format;
        }
        if (elements.outputFormatSchema) {
            elements.outputFormatSchema.value = outputFormat?.description || outputFormat?.schema || '';
        }
        
        // Load model selection
        loadModels(prompt.models || []);
        
        // Load test input from first test case, but only if the box is currently empty
        if (elements.testInput && elements.testInput.value === '') {
            if (prompt.test_cases && prompt.test_cases.length > 0) {
                const firstTestCase = prompt.test_cases[0];
                const firstInput = Object.values(firstTestCase.inputs || {})[0];
                if (firstInput) {
                    elements.testInput.value = firstInput;
                }
            }
        }
        
        updateSaveButtonState();
    }
    
    // Load instructions into the UI
    function loadInstructions(instructions) {
        if (!elements.instructionsList) return;
        
        elements.instructionsList.innerHTML = '';
        instructions.forEach((instruction, index) => {
            addInstructionItem(instruction, index);
        });
    }

    // Load chain of thought steps
    function loadChainOfThought(steps) {
        if (!elements.chainOfThoughtList) return;
        
        elements.chainOfThoughtList.innerHTML = '';
        steps.forEach(step => {
            addChainStepItem(step);
        });
    }

    // Load few-shot examples
    function loadExamples(examples) {
        if (!elements.examplesList) return;
        
        elements.examplesList.innerHTML = '';
        examples.forEach(example => {
            addExampleItem(example);
        });
    }
    
    // Add instruction item to the list
    function addInstructionItem(text = '', index = null) {
        if (!elements.instructionsList) return;
        
        const item = document.createElement('div');
        item.className = 'instruction-item';
        item.innerHTML = `
            <input type="text" value="${text}" placeholder="Enter instruction..." />
            <button type="button" onclick="removeInstruction(this)">×</button>
        `;
        
        const input = item.querySelector('input');
        input.addEventListener('input', handleFormChange);
        
        elements.instructionsList.appendChild(item);
        
        if (text === '') {
            input.focus();
        }
    }
    
    // Add new instruction
    function addInstruction() {
        addInstructionItem();
        handleFormChange();
    }
    
    // Remove instruction (global function for onclick)
    window.removeInstruction = function(button) {
        button.parentElement.remove();
        handleFormChange();
    };

    // Chain of thought functions
    function addChainStep() {
        addChainStepItem();
        handleFormChange();
    }

    function addChainStepItem(text = '') {
        if (!elements.chainOfThoughtList) return;
        
        const item = document.createElement('div');
        item.className = 'chain-step-item';
        item.innerHTML = `
            <input type="text" value="${text}" placeholder="Enter reasoning step..." />
            <button type="button" onclick="removeChainStep(this)">×</button>
        `;
        
        const input = item.querySelector('input');
        input.addEventListener('input', handleFormChange);
        
        elements.chainOfThoughtList.appendChild(item);
        
        if (text === '') {
            input.focus();
        }
    }

    window.removeChainStep = function(button) {
        button.parentElement.remove();
        handleFormChange();
    };

    // Few-shot examples functions
    function addExample() {
        addExampleItem();
        handleFormChange();
    }

    function addExampleItem(example = null) {
        if (!elements.examplesList) return;
        
        const item = document.createElement('div');
        item.className = 'example-item';
        item.innerHTML = `
            <div class="example-input-output">
                <div>
                    <label>Input:</label>
                    <textarea placeholder="Example input...">${example?.input || ''}</textarea>
                </div>
                <div>
                    <label>Output:</label>
                    <textarea placeholder="Expected output...">${example?.output || ''}</textarea>
                </div>
            </div>
            <button type="button" onclick="removeExample(this)">Remove Example</button>
        `;
        
        const textareas = item.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', handleFormChange);
        });
        
        elements.examplesList.appendChild(item);
        
        if (!example) {
            textareas[0].focus();
        }
    }

    window.removeExample = function(button) {
        button.parentElement.remove();
        handleFormChange();
    };
    
    // Handle form changes
    function handleFormChange() {
        isDirty = true;
        updateSaveButtonState();
        
        // Debounce auto-save
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(autoSave, 2000);
    }
    
    // Update save button state
    function updateSaveButtonState() {
        if (elements.saveBtn) {
            elements.saveBtn.textContent = isDirty ? '💾 Save*' : '💾 Save';
            elements.saveBtn.style.fontWeight = isDirty ? 'bold' : 'normal';
        }
    }
    
    // Auto-save functionality
    function autoSave() {
        if (isDirty) {
            savePrompt(true);
        }
    }
    
    // Collect form data into a prompt object
    function collectFormData() {
        const prompt = { ...currentPrompt };

        // Basic fields
        prompt.title = elements.title?.value;
        prompt.description = elements.description?.value;
        prompt.user_input_template = elements.userInputTemplate?.value;
        
        // Prompt structure
        if (!prompt.prompt) {
            prompt.prompt = { persona: { role: '' }, instructions: [] };
        }
        prompt.prompt.persona = { role: elements.personaRole?.value };

        // Instructions and Chain of Thought from textareas
        prompt.prompt.instructions = elements.instructions?.value.split('\n').filter(line => line.trim() !== '') || [];
        prompt.prompt.chain_of_thought = elements.chainOfThought?.value.split('\n').filter(line => line.trim() !== '') || [];

        // Examples
        prompt.prompt.few_shot_examples = collectExamples();
        
        // Output format
        const outputFormatType = elements.outputFormatType?.value;
        const outputFormatSchema = elements.outputFormatSchema?.value;
        if (outputFormatType) {
            prompt.prompt.output_format = { format: outputFormatType };
            if (outputFormatSchema) {
                if (outputFormatType === 'json') {
                    try {
                        prompt.prompt.output_format.schema = JSON.parse(outputFormatSchema);
                    } catch (e) {
                        console.warn('Invalid JSON in output format schema');
                        prompt.prompt.output_format.description = outputFormatSchema;
                    }
                } else {
                    prompt.prompt.output_format.description = outputFormatSchema;
                }
            }
        } else {
            delete prompt.prompt.output_format;
        }

        // Models
        prompt.models = collectModels();
        
        return prompt;
    }
    
    // Save prompt data
    function savePrompt(isAutoSave = false) {
        const prompt = collectFormData();
        
        vscode.postMessage({
            type: 'save',
            prompt: prompt
        });
        
        currentPrompt = prompt;
        isDirty = false;
        updateSaveButtonState();
        
        if (!isAutoSave) {
            showSuccess('Prompt saved successfully');
        }
    }
    
    // Run test
    function runTest() {
        const prompt = collectFormData();
        const testInput = elements.testInput?.value || '';
        
        if (!testInput.trim()) {
            showError('Please enter test input');
            return;
        }
        
        // Update test button state
        if (elements.runTestBtn) {
            elements.runTestBtn.textContent = '⏳ Testing...';
            elements.runTestBtn.disabled = true;
        }
        
        // Clear previous results
        if (elements.testResults) {
            elements.testResults.innerHTML = '<div class="loading">Running tests...</div>';
        }
        
        vscode.postMessage({
            type: 'test',
            prompt: prompt,
            testInput: testInput
        });
    }
    
    // Display test results
    function displayTestResults(results, error) {
        if (!elements.testResults) return;
        
        // Reset test button
        if (elements.runTestBtn) {
            elements.runTestBtn.textContent = '🚀 Test Now';
            elements.runTestBtn.disabled = false;
        }
        
        if (error) {
            elements.testResults.innerHTML = `<div class="error">Test failed: ${error}</div>`;
            return;
        }
        
        if (!results || results.length === 0) {
            elements.testResults.innerHTML = '<div class="error">No test results received</div>';
            return;
        }
        
        const resultsHtml = results.map(result => `
            <div class="test-result-item ${result.metadata?.error ? 'error' : 'success'}">
                <div class="test-result-header">${result.model}</div>
                <div class="test-result-metrics">
                    Latency: ${result.metadata?.latency || 0}ms | 
                    Tokens: ${result.metadata?.tokens || 0} | 
                    Cost: $${(result.metadata?.cost_estimate || 0).toFixed(4)}
                </div>
                <div class="test-result-response">
                    ${result.metadata?.error || result.response || 'No response'}
                </div>
            </div>
        `).join('');
        
        elements.testResults.innerHTML = resultsHtml;
    }
    
    // Export prompt
    function exportPrompt(format) {
        const prompt = collectFormData();
        
        vscode.postMessage({
            type: 'export',
            prompt: prompt,
            format: format
        });
        
        showSuccess(`Exporting as ${format.toUpperCase()}...`);
    }
    
    // Share with team
    function shareWithTeam() {
        const prompt = collectFormData();
        
        vscode.postMessage({
            type: 'share',
            prompt: prompt
        });
        
        showSuccess('Preparing to share with team...');
    }
    
    // Show success message
    function showSuccess(message) {
        vscode.postMessage({
            type: 'showMessage',
            level: 'info',
            message: message
        });
    }
    
    // Show error message
    function showError(message) {
        vscode.postMessage({
            type: 'showMessage',
            level: 'error',
            message: message
        });
    }

    // Load models into the UI
    function loadModels(models) {
      if (!elements.modelSelectionList) return;
      elements.modelSelectionList.innerHTML = '';
      
      if (models.length > 0) {
        models.forEach(modelId => addModelRow(modelId));
      } else {
        // Add a default model selector if none are specified
        addModelRow();
      }
    }

    // Add a new model selection row
    function addModelRow(selectedModelId = null) {
      const row = document.createElement('div');
      row.className = 'model-selection-row';

      const familySelect = document.createElement('select');
      const modelSelect = document.createElement('select');
      
      // Populate family dropdown
      for (const family of Object.keys(modelFamilies)) {
        const option = document.createElement('option');
        option.value = family;
        option.textContent = family;
        familySelect.appendChild(option);
      }

      // Handle family change
      familySelect.addEventListener('change', () => {
        updateModelDropdown(familySelect.value, modelSelect);
        vscode.postMessage({
          type: 'checkApiKey',
          family: familySelect.value
        });
        handleFormChange();
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-model-btn';
      removeBtn.innerHTML = '&times;';
      removeBtn.title = 'Remove this model';
      removeBtn.addEventListener('click', () => {
        row.remove();
        handleFormChange();
      });
      
      row.appendChild(familySelect);
      row.appendChild(modelSelect);
      row.appendChild(removeBtn);
      
      elements.modelSelectionList?.appendChild(row);

      // Set initial state
      let initialFamily = Object.keys(modelFamilies)[0];
      if (selectedModelId) {
        for (const family in modelFamilies) {
          if (modelFamilies[family].includes(selectedModelId)) {
            initialFamily = family;
            break;
          }
        }
      }

      familySelect.value = initialFamily;
      updateModelDropdown(initialFamily, modelSelect, selectedModelId);

      [familySelect, modelSelect].forEach(el => el.addEventListener('change', handleFormChange));
    }

    // Update the model dropdown based on the selected family
    function updateModelDropdown(family, modelSelect, selectedModelId = null) {
      modelSelect.innerHTML = '';
      const models = modelFamilies[family] || [];
      
      for (const model of models) {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      }
      
      if (selectedModelId && models.includes(selectedModelId)) {
        modelSelect.value = selectedModelId;
      } else {
        modelSelect.value = models[0] || '';
      }
    }
    
    // Clear the test input and results
    function clearTestArea() {
        if (elements.testInput) {
            elements.testInput.value = '';
        }
        if (elements.testResults) {
            elements.testResults.innerHTML = '';
        }
    }
    
    // Initialize the app
    function initialize() {
        initializeEventListeners();
        
        // Load default prompt if none provided
        if (!currentPrompt) {
            loadPromptData({
                title: '',
                description: '',
                models: ['gpt-4o-mini'],
                prompt: {
                    persona: {
                        role: 'You are a helpful AI assistant.'
                    },
                    instructions: []
                },
                user_input_template: '{{user_query}}',
                variables: [
                    {
                        name: 'user_query',
                        type: 'string',
                        description: 'The user\'s query or request',
                        required: true
                    }
                ],
                test_cases: [
                    {
                        name: 'Basic Test',
                        inputs: {
                            user_query: 'Hello, how are you?'
                        }
                    }
                ],
                metadata: {
                    author: 'Prompt Studio User',
                    created: new Date().toISOString(),
                    version: '1.0.0',
                    category: 'other'
                }
            });
        }
    }
    
    // Start the application
    document.addEventListener('DOMContentLoaded', initialize);
})();