# Technology Adoption Strategy: A Developer-Native Approach

## 🎯 Technology Philosophy

**Core Principles**:
- **Meet Developers Where They Are**: Prioritize deep integration into the tools developers use daily (i.e., VS Code).
- **Lower Contribution Barrier**: Choose technologies that are accessible to the widest possible community of open-source contributors.
- **Solve the Problem First, Optimize Later**: Start with a simple, effective stack that solves the core user problem. Defer complex or higher-performance technologies until they are required by a validated user need.
- **Future-Proof Architecture**: Build a core logic that can be reused across different environments (VS Code extension, Desktop app, CLI).

## 🏗️ Revised Architecture Overview

### Phase 1 & 2: VS Code First
The initial product is a **pure TypeScript VS Code extension**.
```
┌───────────────────────────────────────────┐
│              VS Code Extension            │
├───────────────────┬───────────────────────┤
│   UI (Webviews)   │   Extension Backend   │
│ (HTML/CSS/Preact) │     (TypeScript)      │
├───────────────────┴───────────────────────┤
│         Prompt Compilation Engine         │
├───────────────────┬───────────────────────┤
│ Local Filesystem  │   External Services   │
│ (`.prompt.json`)  │   (AI APIs, GitHub)   │
└───────────────────┴───────────────────────┘
```

### Phase 3 & 4: Expanding to a Desktop "Pro Studio"
We introduce **Tauri** to wrap our web-based UI into a standalone application for power users.
```
┌─────────────────────────────────────────┐
│              Desktop Application         │
├─────────────────┬───────────────────────┤
│   Frontend      │      Backend Core     │
│   (React/TS)    │    (Rust/Tauri)       │
├─────────────────┴───────────────────────┤
│     (The same core logic as the VS Code Ext)     │
└─────────────────────────────────────────┘
```

## 🚀 Primary Technology Stack for MVP (VS Code First)

### 1. Core Framework: **VS Code Extension API + TypeScript**

#### Why a Pure TS Extension First?
- ✅ **Zero User Friction**: Installation is seamless from the VS Code Marketplace. No separate download or complex setup.
- ✅ **Largest Contributor Pool**: The vast majority of potential open-source contributors are proficient in JavaScript/TypeScript. This is our biggest asset.
- ✅ **Development Velocity**: We can build and iterate on features much faster without the complexity of a Rust toolchain or cross-platform builds.
- ✅ **Sufficiently Performant**: For making API calls and rendering webviews, the performance of the Node.js runtime inside VS Code is more than adequate.
- ✅ **Contains Core Logic**: The extension will house the crucial **Prompt Compilation Engine**, which translates our standard JSON schema into provider-specific API calls. This logic can be reused in the future desktop app.

**Decision**: We will build the core product as a standard VS Code extension using TypeScript. This is the fastest path to delivering value and building a community.

### 2. UI within VS Code: **Webviews + Preact**

#### Why Preact for Webviews?
- ✅ **Lightweight**: Preact has a tiny footprint (~3KB), which is ideal for fast-loading webviews inside an editor. It keeps the extension feeling snappy.
- ✅ **React-Compatible API**: We can use the familiar component-based architecture of React without the overhead. This makes it easy for React developers to contribute.
- ✅ **Minimal Boilerplate**: It's simple to set up and doesn't require a complex build process for use in a webview.

**vs. React**:
- ❌ **Overkill**: React's size and complexity are unnecessary for the simple, focused UI of our initial webviews (like the evaluation results table).
- ❌ **Slower Load**: A larger library can lead to a slight but noticeable delay in webview loading.

**vs. Plain HTML/CSS**:
- ❓ **Maintainability**: For a UI with any level of interactivity (like sorting results, viewing details), a component-based approach becomes much easier to manage than manipulating the DOM directly.

### 3. Data Storage: **Filesystem (`.prompt.json`) + VS Code `SecretStorage`**

#### Why Filesystem First?
- ✅ **Git-Native**: Storing prompts as files in the user's workspace makes them instantly versionable with Git. This is a huge win for developers.
- ✅ **Transparent & Portable**: Users can see, edit, and share their prompts with any tool. There is no data lock-in.
- ✅ **Simple**: It avoids the complexity of setting up and managing a local database, which is overkill for the MVP.

**vs. SQLite**:
- ❌ **Unnecessary Complexity**: Requires adding a database dependency, managing migrations, and creating an abstraction layer. This adds significant overhead for an MVP focused on evaluation, not complex querying.
- ❌ **Less Transparent**: Hides the data from the user inside a binary file, working against the "Git for Prompts" philosophy.

**API Key Storage**:
- We will use the official `SecretStorage` API provided by VS Code. This leverages the operating system's keychain (e.g., macOS Keychain, Windows Credential Manager) to store secrets securely.

## 🔧 Phase 3+ Technology: Introducing Tauri and Rust

### When and Why do we introduce Tauri?
We will only build the standalone desktop application **after** we have validated the core product and built a user base with the VS Code extension.

#### **Tauri** (Desktop Application Framework)
- We will reuse the **same Preact/React frontend code** from our VS Code extension's webviews to build the desktop UI.
- The Tauri backend, written in **Rust**, will be a thin wrapper providing system-level services:
  - File system access.
  - Window management.
  - A potential future home for performance-critical operations (e.g., a local semantic search index).

**The Role of Rust**:
- In our revised strategy, Rust is **not** a barrier to entry for early contributors. The core product is in TypeScript.
- Rust is introduced later for its strengths in performance, security, and creating small, efficient binaries for the "Pro Studio" desktop app. Most application logic will still reside in the shared TypeScript core.

## 📦 Distribution & Deployment

### Phase 1: VS Code First
- **Primary Channel**: [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
- **Updates**: Handled automatically by VS Code.

### Phase 3: Desktop App
- **Channels**: GitHub Releases, Homebrew, Winget, Snap.
- **Auto-Updates**: Handled by the Tauri updater.

---

**Summary**: Our revised technology strategy is leaner and more aligned with our goal of rapid, community-driven adoption. We start with the simplest, most accessible stack (TypeScript + VS Code APIs) to solve the user's most critical problem. We defer more complex technologies like Rust and Tauri until they are needed for the "pro" version of our tool, ensuring we don't prematurely optimize or create barriers for contributors.