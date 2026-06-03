# DevTasks ✅

[![React 19](https://img.shields.io/badge/React-19.2.5-black?style=flat-square&logo=react)](https://react.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4.2.4-black?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vite 6](https://img.shields.io/badge/Vite-v6.0.1-black?style=flat-square&logo=vite)](https://vite.dev)
[![GitHub Stars](https://img.shields.io/github/stars/shamilahmdt/devtasks?style=flat-square&logo=github&color=black)](https://github.com/shamilahmdt/devtasks/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)

A high-performance, minimalist task manager designed for developer roadmaps. DevTasks provides a premium, clean monochrome environment with fluid micro-animations, theme toggles, and state persistence to keep your engineering flow uninterrupted.

---

## ✨ Features

* ⚡ **Ultra-Fast Performance**: Built on React 19 and Vite 6 for instant reactivity and hot reloading.
* 🌓 **Dynamic Themes**: Seamless transitions between premium white and deep zinc dark modes.
* 🗂 **Categorized Engineering Tasks**: Group tasks by `FEATURE`, `BUG`, or `REFACTOR` with custom priority weights (`HIGH`, `MEDIUM`, `LOW`).
* 📊 **Roadmap Analytics**: Live visual progress indicators tracking your overall task completion percentage.
* 📜 **System Logs & History**: Dedicated recovery panel to audit and restore deleted tasks back into your roadmap.
* 📦 **Robust Persistence**: State stays persistent across browser reloads using LocalStorage.
* 🔔 **Polished Toasts**: Custom, stylized notifications powered by `sonner` matching the application's clean design.

---

## 🛠️ Tech Stack

* **Core**: [React 19](https://react.dev)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (utility-first, pure custom tokens)
* **Bundler & Dev Server**: [Vite 6](https://vite.dev)
* **Routing**: [React Router v7](https://reactrouter.com)
* **Notifications**: [Sonner](https://emilkowalski.github.io/sonner/)
* **Icons**: [React Icons](https://react-icons.github.io/react-icons/)


## ☕ Support My Work

<a href="https://buymeachai.ezee.li/shamil_ahmd">
  <img
    src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png"
    alt="Buy Me A Chai"
    width="180"
  />
</a>

---

## 📦 Installation & Quick Start

Get your local development environment running in under 2 minutes:

### 1. Clone the Repository
```bash
git clone https://github.com/shamilahmdt/devtasks.git
cd devtasks
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🤝 Contributing

We love open-source contributions! Whether you're a seasoned developer or looking to make your very first PR, you are welcome here.

⭐ **Support the Project**: If you find DevTasks helpful or are planning to contribute, please consider **giving us a star**! It helps others discover the project and shows your appreciation for our maintainers.

### 🌿 Contribution Pipeline
1. **Fork** the repository and clone your fork locally.
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feat/your-awesome-feature
   ```
3. **Commit your changes** using clean, descriptive commit messages.
4. **Push to your fork** and submit a **Pull Request** targeting our `main` branch.

---

## 💬 Discussions & Community

Got a feature idea, an architectural suggestion, or just want to chat about the roadmap?
* **Join the Conversations**: Head over to our **[GitHub Discussions](https://github.com/shamilahmdt/devtasks/discussions)** page.
* **Pitch New Features**: We love exploring new concepts! Start a discussion thread to discuss layout designs, icons, or state structures before writing code.

---

## 🎯 Active Beginner Issues

Ready to write some code? We actively maintain highly descriptive templates for first-time contributors. Look out for the `good first issue` and `help wanted` labels inside our **[GitHub Issues](https://github.com/shamilahmdt/devtasks/issues)** tracker!

### 💡 Featured Roadmap Tasks
Here are the current active issues open for implementation on our repository:

* 🟢 **[UI/Design] Style Symmetrical Backup Center in DataCenter.jsx** ([#109](https://github.com/shamilahmdt/devtasks/issues/109))
  * *Goal*: Revamp the unstyled import/export panel at `src/pages/SnippetVault/snippetvault/DataCenter.jsx` into a premium, symmetrical grid layout using Tailwind CSS. Unify it with the application's clean light/dark monochrome styling (incorporating custom ambient glows, borders, and transitions), add polished upload/download buttons, and implement fully responsive card containers.
  * *Skills*: React state usage, Tailwind CSS v4, custom theme styling, mobile-first responsive design.

* 🟢 **[UI/Design] Style Deletion Logs & History Panel in DeleteHistory.jsx** ([#108](https://github.com/shamilahmdt/devtasks/issues/108))
  * *Goal*: Refactor `src/pages/SnippetVault/snippetvault/DeleteHistory.jsx` from basic unstyled HTML lists into a high-fidelity engineering log viewer. Design elegant list elements featuring clean hover animations, low-contrast monospaced layout elements, clear status badges, distinct muted colors for destructive actions, and full light/dark mode responsive support.
  * *Skills*: UI/UX alignment, responsive list components, micro-animations, standard color palettes.

* 🟢 **[UI/Design] Style Interactive Snippet Registry for ListSnippets.jsx** ([#107](https://github.com/shamilahmdt/devtasks/issues/107))
  * *Goal*: Elevate `src/pages/SnippetVault/snippetvault/ListSnippets.jsx` from a bare list into a premium developer registry panel. Implement custom interactive snippet card layouts, category badge tag selectors, a custom-focused search bar with sleek monochrome borders, and clipboard copy action buttons with immediate success notification states.
  * *Skills*: Tailwind CSS spacing & transitions, micro-interactions, input hover states, search filtering UI design.

* 🟢 **[UI/Design] Implement Premium Form Layout for AddSnippet.jsx** ([#106](https://github.com/shamilahmdt/devtasks/issues/106))
  * *Goal*: Redesign the standard inputs in `src/pages/SnippetVault/snippetvault/AddSnippet.jsx` to build a sleek, minimalist card-based creation form. Add custom styled text inputs and textareas with active focus borders, a custom-designed selection menu, and a premium primary submit button with elegant micro-transitions.
  * *Skills*: Custom form control layouts, state-driven interaction design, modern typography integration.

---

## 🚀 Future Architectural Vision (Next Milestones)

DevTasks is rapidly evolving to boost developer workflow speed. Here is our current progress and the next architectural milestones on our radar:

* 📦 **Minimalist Snippet Vault (`/snippetvault`)** — *[IN PROGRESS]* 🏗️
  * We have successfully initiated the companion dashboard at `/snippetvault`! The core structure is scaffolded with sub-pages for snippet creation, list filtering, deleted history log auditing, and JSON import/export backup. The next focus is implementing premium Tailwind CSS styling, interactive copy feedback, and persistent local storage synchronization.
* 🎛️ **The Unified Dev Workspace (`/workspace`)** — *[PLANNED]* 🗺️
  * Consolidate the entire workspace—combining `TaskManagement` and the new `SnippetVault`—into a unified, high-efficiency split-pane dashboard. This will eliminate redundant view-switching, allowing developers to manage engineering roadmaps on the left and instantly copy command templates on the right from one cohesive workspace.
* ⌨️ **Command Palette & Keyboard-First Navigation** — *[PROPOSED]* ⚡
  * Expand the global HUD system into a fully featured interactive Command Palette (e.g., `Cmd+K` or `Ctrl+P`). This will allow developers to trigger actions like creating tasks, copying snippets, searching records, or switching themes globally without leaving the keyboard.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
