// Prompt Builder JavaScript - Simplified Developer-Friendly Version
(function() {
    const vscode = acquireVsCodeApi();
    
    let currentPrompt = null;
    let isDirty = false;
    
    const modelFamilies = {
      "OpenAI": ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
      "Anthropic": ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
      "Google": ["gemini-1.5-pro-latest", "gemini-1.5-flash-latest", "gemini-pro"]
    };
    
    // DOM Elements - Simplified mapping
    const elements = {
        // Basic fields
        title: document.getElementById('title'),
        description: document.getElementById('description'),
        category: document.getElementById('category'),
        
        // Core prompt fields
        persona: document.getElementById('persona'),
        instructions: document.getElementById('instructions'),
        chainOfThought: document.getElementById('chain-of-thought'),
        constraints: document.getElementById('constraints'),
        constraintsSection: document.getElementById('constraints-section'),
        addConstraintsBtn: document.getElementById('add-constraints'),
        userInputTemplate: document.getElementById('user-input-template'),
        
        // Output format
        outputFormatType: document.getElementById('output-format-type'),
        outputFormatTemplate: document.getElementById('output-format-template'),
        
        // Examples
        examplesList: document.getElementById('examples-list'),
        addExampleBtn: document.getElementById('add-example'),
        
        // Models and testing
        modelSelectionList: document.getElementById('model-selection-list'),
        addModelBtn: document.getElementById('add-model-btn'),
        testInput: document.getElementById('test-input'),
        runTestBtn: document.getElementById('run-test'),
        clearTestBtn: document.getElementById('clear-test'),
        testResults: document.getElementById('test-results'),
        
        // Metadata
        metadataAuthor: document.getElementById('metadata-author'),
        metadataVersion: document.getElementById('metadata-version'),
        metadataDifficulty: document.getElementById('metadata-difficulty'),
        metadataTags: document.getElementById('metadata-tags'),
        
        // Export
        saveBtn: document.getElementById('save-prompt'),
        exportJsonBtn: document.getElementById('export-json'),
        exportPackageBtn: document.getElementById('export-package'),
        shareTeamBtn: document.getElementById('share-team')
    };
    
    // Initialize event listeners
    function initializeEventListeners() {
        // Form change listeners for all inputs
        Object.values(elements).forEach(element => {
            if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT')) {
                element.addEventListener('input', handleFormChange);
                element.addEventListener('change', handleFormChange);
            }
        });
        
        // Button listeners
        elements.addConstraintsBtn?.addEventListener('click', showConstraintsSection);
        elements.addExampleBtn?.addEventListener('click', addExample);
        elements.addModelBtn?.addEventListener('click', () => addModelRow());
        
        elements.runTestBtn?.addEventListener('click', runTest);
        elements.clearTestBtn?.addEventListener('click', clearTestArea);
        elements.saveBtn?.addEventListener('click', () => savePrompt(false));
        elements.exportJsonBtn?.addEventListener('click', () => exportPrompt('json'));
        elements.exportPackageBtn?.addEventListener('click', () => exportPrompt('package'));
        elements.shareTeamBtn?.addEventListener('click', shareWithTeam);
    }
    
    // Show constraints section when + button is clicked
    function showConstraintsSection() {
        if (elements.constraintsSection && elements.addConstraintsBtn) {
            elements.constraintsSection.style.display = 'block';
            elements.addConstraintsBtn.style.display = 'none';
            elements.constraints.focus();
        }
    }
    
    // Handle messages from VS Code
    window.addEventListener('message', event => {
        const message = event.data;
        
        switch (message.type) {
            case 'load':
                loadPromptData(message.prompt);
                break;
            case 'testResults':
                displayTestResults(message.results, message.error);
                break;
            case 'error':
                showError(message.message);
                break;
        }
    });
    
    // Load prompt data into form - Simplified
    function loadPromptData(prompt) {
        currentPrompt = prompt;
        isDirty = false;
        
        // Basic fields
        if (elements.title) elements.title.value = prompt.title || '';
        if (elements.description) elements.description.value = prompt.description || '';
        if (elements.category) elements.category.value = prompt.metadata?.category || '';
        if (elements.userInputTemplate) elements.userInputTemplate.value = prompt.user_input_template || '';
        
        // Core prompt fields
        if (elements.persona) {
            // Combine persona fields into one text area
            let personaText = prompt.prompt?.persona?.role || '';
            if (prompt.prompt?.persona?.tone) {
                personaText += `\n\nTone: ${prompt.prompt.persona.tone}`;
            }
            if (prompt.prompt?.persona?.expertise && prompt.prompt.persona.expertise.length > 0) {
                personaText += `\n\nExpertise: ${prompt.prompt.persona.expertise.join(', ')}`;
            }
            elements.persona.value = personaText;
        }
        
        if (elements.instructions) {
            elements.instructions.value = (prompt.prompt?.instructions || []).join('\n');
        }
        if (elements.chainOfThought) {
            elements.chainOfThought.value = (prompt.prompt?.chain_of_thought || []).join('\n');
        }
        
        // Handle constraints - show section if there are constraints
        if (elements.constraints) {
            const constraints = (prompt.prompt?.constraints || []).join('\n');
            elements.constraints.value = constraints;
            
            if (constraints.trim()) {
                // Show constraints section if there are constraints
                if (elements.constraintsSection && elements.addConstraintsBtn) {
                    elements.constraintsSection.style.display = 'block';
                    elements.addConstraintsBtn.style.display = 'none';
                }
            }
        }
        
        // Load output format
        const outputFormat = prompt.prompt?.output_format;
        if (elements.outputFormatType) {
            elements.outputFormatType.value = outputFormat?.format || '';
        }
        if (elements.outputFormatTemplate) {
            let templateValue = '';
            if (outputFormat?.template) {
                templateValue = outputFormat.template;
            } else if (outputFormat?.description) {
                templateValue = outputFormat.description;
            } else if (outputFormat?.schema) {
                templateValue = typeof outputFormat.schema === 'string' ? outputFormat.schema : JSON.stringify(outputFormat.schema, null, 2);
            }
            elements.outputFormatTemplate.value = templateValue;
        }
        
        // Load examples
        loadExamples(prompt.prompt?.few_shot_examples || []);
        
        // Load models
        loadModels(prompt.models || ['gpt-4o-mini']);
        
        // Load metadata
        const metadata = prompt.metadata || {};
        if (elements.metadataAuthor) elements.metadataAuthor.value = metadata.author || '';
        if (elements.metadataVersion) elements.metadataVersion.value = metadata.version || '';
        if (elements.metadataDifficulty) elements.metadataDifficulty.value = metadata.difficulty || '';
        if (elements.metadataTags) {
            elements.metadataTags.value = (metadata.tags || []).join(', ');
        }
        
        // Load test input from first test case if available
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

    // Load examples - Simplified
    function loadExamples(examples) {
        if (!elements.examplesList) return;
        elements.examplesList.innerHTML = '';
        examples.forEach(example => addExampleItem(example));
    }

    function addExample() {
        addExampleItem();
        handleFormChange();
    }

    function addExampleItem(example = null) {
        if (!elements.examplesList) return;
        
        const item = document.createElement('div');
        item.className = 'example-item';
        item.innerHTML = `
            <div class="example-content">
                <div class="example-field">
                    <label>Input:</label>
                    <textarea placeholder="Example input..." maxlength="1000">${example?.input || ''}</textarea>
                </div>
                <div class="example-field">
                    <label>Output:</label>
                    <textarea placeholder="Expected output..." maxlength="2000">${example?.output || ''}</textarea>
                </div>
            </div>
            <button type="button" onclick="removeExample(this)">Remove Example</button>
        `;
        
        const textareas = item.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', handleFormChange);
        });
        
        elements.examplesList.appendChild(item);
        if (!example) textareas[0].focus();
    }

    // Global remove function
    window.removeExample = function(button) {
        const item = button.closest('.example-item');
        if (item) {
            item.remove();
            handleFormChange();
        }
    };
    
    // Handle form changes with smart auto-save
    function handleFormChange() {
        isDirty = true;
        updateSaveButtonState();
        
        // Debounce auto-save
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(autoSave, 3000);
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
    
    // Collect form data - Simplified and more robust
    function collectFormData() {
        // Start with a clone of the current prompt or a default structure
        const prompt = currentPrompt ? JSON.parse(JSON.stringify(currentPrompt)) : {
            title: '',
            description: '',
            models: [],
            prompt: {},
            user_input_template: '',
            test_cases: [],
            metadata: {}
        };

        // Basic fields
        if (elements.title) prompt.title = elements.title.value || '';
        if (elements.description) prompt.description = elements.description.value || '';
        if (elements.userInputTemplate) prompt.user_input_template = elements.userInputTemplate.value || '';
        
        // Initialize prompt structure if it doesn't exist
        if (!prompt.prompt) prompt.prompt = {};
        
        // Parse persona field
        if (elements.persona) {
            const personaText = elements.persona.value || '';
            const personaLines = personaText.split('\\n').filter(line => line.trim());
            
            prompt.prompt.persona = {
                role: personaLines[0] || 'You are a helpful assistant'
            };
            
            personaLines.forEach(line => {
                if (line.toLowerCase().startsWith('tone:')) {
                    prompt.prompt.persona.tone = line.substring(5).trim();
                } else if (line.toLowerCase().startsWith('expertise:')) {
                    const expertiseText = line.substring(10).trim();
                    prompt.prompt.persona.expertise = expertiseText.split(',').map(e => e.trim()).filter(e => e);
                }
            });
        }

        // Instructions, chain of thought, constraints
        if (elements.instructions) prompt.prompt.instructions = elements.instructions.value.split('\\n').filter(line => line.trim() !== '');
        if (elements.chainOfThought) prompt.prompt.chain_of_thought = elements.chainOfThought.value.split('\\n').filter(line => line.trim() !== '');
        if (elements.constraints) prompt.prompt.constraints = elements.constraints.value.split('\\n').filter(line => line.trim() !== '');
        
        // Clean up empty arrays
        if (prompt.prompt.chain_of_thought?.length === 0) delete prompt.prompt.chain_of_thought;
        if (prompt.prompt.constraints?.length === 0) delete prompt.prompt.constraints;

        // Examples
        prompt.prompt.few_shot_examples = collectExamples();
        if (prompt.prompt.few_shot_examples?.length === 0) delete prompt.prompt.few_shot_examples;
        
        // Output format
        const formatType = elements.outputFormatType?.value;
        const template = elements.outputFormatTemplate?.value;
        
        if (formatType || template) {
            prompt.prompt.output_format = {};
            if (formatType) prompt.prompt.output_format.format = formatType;
            if (template) {
                if (formatType === 'json') {
                    try {
                        prompt.prompt.output_format.schema = JSON.parse(template);
                    } catch (e) {
                        prompt.prompt.output_format.description = template; // Keep as description if JSON is invalid
                    }
                } else {
                    prompt.prompt.output_format.description = template;
                }
            }
        } else {
            delete prompt.prompt.output_format;
        }

        // Models
        prompt.models = collectModels();
        
        // Metadata
        if (!prompt.metadata) prompt.metadata = {};
        if (elements.category) prompt.metadata.category = elements.category.value || '';
        if (elements.metadataAuthor) prompt.metadata.author = elements.metadataAuthor.value || '';
        if (elements.metadataVersion) prompt.metadata.version = elements.metadataVersion.value || '';
        if (elements.metadataDifficulty) prompt.metadata.difficulty = elements.metadataDifficulty.value || '';
        
        // Parse tags
        if (elements.metadataTags) {
            const tagsText = elements.metadataTags.value || '';
            if (tagsText.trim()) {
                prompt.metadata.tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
            } else {
                delete prompt.metadata.tags;
            }
        }
        
        // Timestamps
        prompt.metadata.updated = new Date().toISOString();
        if (!prompt.metadata.created) {
            prompt.metadata.created = new Date().toISOString();
        }
        
        return prompt;
    }

    function collectExamples() {
        const examples = [];
        if (!elements.examplesList) return examples;
        
        const items = elements.examplesList.querySelectorAll('.example-item');
        items.forEach(item => {
            const textareas = item.querySelectorAll('textarea');
            const input = textareas[0]?.value.trim() || '';
            const output = textareas[1]?.value.trim() || '';
            
            if (input || output) {
                examples.push({ input, output });
            }
        });
        
        return examples;
    }

    function collectModels() {
        const models = [];
        if (!elements.modelSelectionList) return ['gpt-4o-mini'];
        
        const rows = elements.modelSelectionList.querySelectorAll('.model-selection-row');
        rows.forEach(row => {
            const modelSelect = row.querySelector('select:nth-child(2)');
            if (modelSelect && modelSelect.value) {
                models.push(modelSelect.value);
            }
        });
        
        return models.length > 0 ? models : ['gpt-4o-mini'];
    }

    // Load models into the UI
    function loadModels(models) {
        if (!elements.modelSelectionList) return;
        elements.modelSelectionList.innerHTML = '';
        
        if (models.length > 0) {
            models.forEach(modelId => addModelRow(modelId));
        } else {
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

        // Always clear previous results first
        elements.testResults.innerHTML = '';
        
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
                    Cost: $${(result.metadata?.cost_estimate || 0).toFixed(6)}
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
                    instructions: ['Provide helpful and accurate responses']
                },
                user_input_template: '{{user_input}}',
                metadata: {
                    category: '',
                    created: new Date().toISOString(),
                    updated: new Date().toISOString()
                }
            });
        }
    }
    
    // Start the application
    document.addEventListener('DOMContentLoaded', initialize);
})();