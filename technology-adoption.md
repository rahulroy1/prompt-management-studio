# Technology Stack

## 🎯 Technology Philosophy

-   **Meet Developers Where They Are**: We prioritize deep integration into the tools developers use daily, which is why we chose to build a VS Code extension.
-   **Lower Contribution Barrier**: Our core technology, TypeScript, is accessible to the widest possible community of open-source contributors.
-   **Solve the Problem First, Optimize Later**: We started with a simple, effective stack that solves the core user problem of prompt evaluation.

## 🏗️ Implemented Architecture

The product is a **pure TypeScript VS Code extension**. The architecture is designed to be simple, maintainable, and deeply integrated with the VS Code environment.

```
┌───────────────────────────────────────────┐
│              VS Code Extension            │
├───────────────────┬───────────────────────┤
│   UI (Webviews)   │   Extension Backend   │
│ (HTML/CSS/JS)     │     (TypeScript)      │
├───────────────────┴───────────────────────┤
│         Prompt Compilation Engine         │
├───────────────────┬───────────────────────┤
│ Local Filesystem  │   External Services   │
│ (`.prompt.json`)  │   (Model Provider APIs)   │
└───────────────────┴───────────────────────┘
```

## 🚀 Primary Technology Stack

### 1. Core Framework: **VS Code Extension API + TypeScript**

-   **Why TypeScript?** It provides the fastest path to delivering value and building a community. The vast majority of potential open-source contributors are proficient in JavaScript/TypeScript, making it easy for others to get involved. The performance is more than sufficient for our needs.
-   **Core Logic:** The extension houses the crucial **Prompt Compilation Engine**, which translates our standard `.prompt.json` schema into provider-specific API calls.

### 2. UI within VS Code: **Webviews**

-   The user interface for the Prompt IDE and the Evaluation Results view are built using VS Code's native Webview API.
-   The UI is rendered with standard **HTML, CSS, and vanilla JavaScript** to keep the extension lightweight and to minimize dependencies. This ensures a fast, responsive feel without the overhead of a large frontend framework.

### 3. Data Storage: **Filesystem (`.prompt.json`) + VS Code `SecretStorage`**

-   **Filesystem-Native:** Prompts are stored as `.prompt.json` files in the user's workspace. This makes them instantly versionable with Git and ensures there is no data lock-in.
-   **Secure Key Storage:** API keys are managed exclusively through the `vscode.SecretStorage` API. This leverages the operating system's native keychain (e.g., macOS Keychain, Windows Credential Manager) and ensures sensitive credentials never touch the file system in plain text.

## 🔧 Future Technology Considerations

While the current stack is robust, we have considered future evolution:

-   **Standalone Desktop App (Tauri):** If a critical mass of users requires more advanced features like global prompt analytics or complex library management, we may explore building a standalone desktop app. We would use **Tauri** to wrap the same web-based UI in a Rust-powered backend.
-   **The Role of Rust:** In this future scenario, Rust would be used for its strengths in performance and security for the desktop app's shell, while the core application logic would remain in TypeScript, shared between the extension and the desktop app.

For now, our focus remains exclusively on building the best possible experience within VS Code using TypeScript.