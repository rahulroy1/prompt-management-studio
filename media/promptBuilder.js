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
        personaRole: document.getElementById('persona-role'),
        personaTone: document.getElementById('persona-tone'),
        personaExpertise: document.getElementById('persona-expertise'),
        addPersonaToneBtn: document.getElementById('add-persona-tone'),
        addPersonaExpertiseBtn: document.getElementById('add-persona-expertise'),
        personaToneSection: document.getElementById('persona-tone-section'),
        personaExpertiseSection: document.getElementById('persona-expertise-section'),
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
    
    // Set initial UI state
    function initializeUIState() {
        const optionalSections = [
            'personaToneSection', 
            'personaExpertiseSection', 
            'constraintsSection'
        ];
        optionalSections.forEach(id => {
            if (elements[id]) {
                elements[id].style.display = 'none';
            }
        });

        const addButtons = [
            'addPersonaToneBtn',
            'addPersonaExpertiseBtn',
            'addConstraintsBtn'
        ];
        addButtons.forEach(id => {
            if (elements[id]) {
                elements[id].style.display = 'block';
            }
        });
    }
    
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
        elements.addPersonaToneBtn?.addEventListener('click', showPersonaToneSection);
        elements.addPersonaExpertiseBtn?.addEventListener('click', showPersonaExpertiseSection);
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

    function showPersonaToneSection() {
        if (elements.personaToneSection && elements.addPersonaToneBtn) {
            elements.personaToneSection.style.display = 'block';
            elements.addPersonaToneBtn.style.display = 'none';
            elements.personaTone.focus();
        }
    }

    function showPersonaExpertiseSection() {
        if (elements.personaExpertiseSection && elements.addPersonaExpertiseBtn) {
            elements.personaExpertiseSection.style.display = 'block';
            elements.addPersonaExpertiseBtn.style.display = 'none';
            elements.personaExpertise.focus();
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
        const persona = prompt.prompt?.persona;
        if (elements.personaRole) {
            elements.personaRole.value = persona?.role || '';
        }
        if (persona?.tone && elements.personaTone) {
            showPersonaToneSection();
            elements.personaTone.value = persona.tone;
        } 
        if (persona?.expertise && persona.expertise.length > 0 && elements.personaExpertise) {
            showPersonaExpertiseSection();
            elements.personaExpertise.value = persona.expertise.join('\n');
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
                showConstraintsSection();
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
        const promptData = {
            title: elements.title.value,
            description: elements.description.value,
            models: collectModels(),
            prompt: {
                persona: {},
                instructions: elements.instructions.value.split('\n').filter(line => line.trim() !== ''),
                chain_of_thought: elements.chainOfThought.value.split('\n').filter(line => line.trim() !== ''),
                constraints: elements.constraints.value.split('\n').filter(line => line.trim() !== ''),
                few_shot_examples: collectExamples(),
                output_format: {
                    format: elements.outputFormatType.value,
                    template: elements.outputFormatTemplate.value
                }
            },
            user_input_template: elements.userInputTemplate.value,
            variables: [], // This will be populated on the extension side
            test_cases: [], // This will be populated on the extension side
            metadata: {
                author: elements.metadataAuthor.value,
                version: elements.metadataVersion.value,
                category: elements.category.value,
                difficulty: elements.metadataDifficulty.value,
                tags: elements.metadataTags.value.split(',').map(tag => tag.trim()).filter(tag => tag)
            }
        };

        // Persona
        const persona = {};
        if (elements.personaRole.value) {
            persona.role = elements.personaRole.value;
        }
        if (elements.personaTone.value) {
            persona.tone = elements.personaTone.value;
        }
        if (elements.personaExpertise.value) {
            persona.expertise = elements.personaExpertise.value.split('\n').map(e => e.trim()).filter(e => e);
        }
        promptData.prompt.persona = persona;
        
        // Clean up empty optional fields
        if (promptData.prompt.chain_of_thought.length === 0) {
            delete promptData.prompt.chain_of_thought;
        }
        if (promptData.prompt.constraints.length === 0) {
            delete promptData.prompt.constraints;
        }

        // Examples
        promptData.prompt.few_shot_examples = collectExamples();
        if (promptData.prompt.few_shot_examples?.length === 0) delete promptData.prompt.few_shot_examples;
        
        // Output format
        const formatType = elements.outputFormatType?.value;
        const template = elements.outputFormatTemplate?.value;
        
        if (formatType || template) {
            promptData.prompt.output_format = {};
            if (formatType) promptData.prompt.output_format.format = formatType;
            if (template) {
                if (formatType === 'json') {
                    try {
                        promptData.prompt.output_format.schema = JSON.parse(template);
                    } catch (e) {
                        promptData.prompt.output_format.description = template; // Keep as description if JSON is invalid
                    }
                } else {
                    promptData.prompt.output_format.description = template;
                }
            }
        } else {
            delete promptData.prompt.output_format;
        }

        // Models
        promptData.models = collectModels();
        
        // Metadata
        if (!promptData.metadata) promptData.metadata = {};
        if (elements.category) promptData.metadata.category = elements.category.value || '';
        if (elements.metadataAuthor) promptData.metadata.author = elements.metadataAuthor.value || '';
        if (elements.metadataVersion) promptData.metadata.version = elements.metadataVersion.value || '';
        if (elements.metadataDifficulty) promptData.metadata.difficulty = elements.metadataDifficulty.value || '';
        
        // Parse tags
        if (elements.metadataTags) {
            const tagsText = elements.metadataTags.value || '';
            if (tagsText.trim()) {
                promptData.metadata.tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
            } else {
                delete promptData.metadata.tags;
            }
        }
        
        // Timestamps
        promptData.metadata.updated = new Date().toISOString();
        if (!promptData.metadata.created) {
            promptData.metadata.created = new Date().toISOString();
        }
        
        return promptData;
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
        if (elements.testResults) elements.testResults.innerHTML = '';
        if (elements.testInput) elements.testInput.value = '';
    }
    
    // Initialize the app
    function initialize() {
        initializeUIState();
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