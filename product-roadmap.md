# Product Roadmap

## Roadmap Philosophy

Our strategy is simple: deliver immediate, tangible value to developers in their native environment. We started by building a best-in-class prompt evaluation tool inside VS Code, and we will continue to enhance that core experience while layering in more powerful features for collaboration and management.

---

## ✅ Phase 1: MVP - The "Wow" Moment (Complete)

We have successfully built and delivered the core foundation of the Prompt Management Studio.

-   **[✔] VS Code Extension:** The entire product is a VS Code extension, available on the marketplace.
-   **[✔] Structured Prompt IDE:** A custom editor for `.prompt.json` files with a guided UI.
-   **[✔] Multi-Model Evaluation:** The core feature is live. Users can test prompts against multiple models in parallel.
-   **[✔] Side-by-Side Comparison:** A webview displays model outputs for easy comparison.
-   **[✔] Secure API Key Storage:** Utilizes VS Code's native `SecretStorage` API.
-   **[✔] Core Schema:** The `.prompt.json` format is implemented with validation.
-   **[✔] Template Library:** A "Golden" set of 10 enterprise-ready templates is included.
-   **[✔] Open Sourced:** The project is publicly available on GitHub under an MIT license.

---

## 🚀 Phase 2: Enhancing the Core Experience

This phase is focused on making the existing workflow even better and more powerful, based on user feedback and common needs.

### 🎯 Goal: Become the Go-To Tool for Individual Prompt Development

-   **Prompt Version Diffing:**
    -   Integrate with Git to compare the output of different versions of a prompt.
    -   Visualize how a small change to the instructions or examples affects the model's response.
-   **Test Case Management:**
    -   Allow users to define multiple sets of input variables (`test_cases`) within a single `.prompt.json` file.
    -   Run the evaluator against all test cases to ensure the prompt is robust.
-   **Advanced Editor Features:**
    -   Provide autocomplete for variables within the prompt's text.
    -   Add syntax highlighting to code blocks inside the prompt examples.
-   **Improved Performance & Metrics:**
    -   Add real-time tracking of token counts and cost estimates in the IDE.
    -   Stream responses from models to show results faster.

---

## 🤝 Phase 3: Collaboration and Team Workflows

This phase focuses on making it easier for teams to work together on prompts.

### 🎯 Goal: Enable Teams to Build a Shared Prompt Library

-   **Shared Template Repository:**
    -   Allow users to configure a secondary template library by pointing the extension to a Git repository.
    -   Teams can maintain their own set of "Golden" templates.
-   **Import/Export and Sharing:**
    -   Add a simple "Share" button to export a prompt to a self-contained Gist or a link that can be shared with colleagues.
-   **Prompt "Linter":**
    -   Provide warnings and suggestions in the IDE for common anti-patterns (e.g., ambiguous instructions, lack of examples).

---

##  platform Phase 4: The Platform and Ecosystem

This is a longer-term vision for how Prompt Management Studio can grow beyond the editor.

### 🎯 Goal: Make Prompts a True Part of the CI/CD Lifecycle

-   **Headless CLI:**
    -   Create a command-line interface that can run evaluations and tests from a CI/CD pipeline.
    -   Example: `pms test ./prompts/ --fail-on-regression`.
-   **Plugin API:**
    -   Expose an API to allow other extensions to interact with the prompt evaluator.
    -   Enable community contributions for new models or custom data sources.
-   **Potential for Standalone App:**
    -   Explore building a Tauri desktop application for advanced analytics and visual library management, but only after validating the need with the existing user base.