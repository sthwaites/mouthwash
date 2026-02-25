# Project Roadmap & TODOs

## 🔄 High Priority

- [ ] **Error Handling**: Enhance user feedback for specific API errors (e.g., rate limits, invalid keys).
- [ ] **Mobile Optimization**: Further refine the layout for smaller screens.
- [ ] **Persist Settings**: Save the last used "Mode" (Cleanup/Business/Prompt) in local storage.

## 🚀 Features

- [ ] **History Tab**: Store the last 5-10 processed items locally for quick retrieval.
- [ ] **File Upload**: Allow users to upload `.txt` or `.md` files directly.
- [ ] **Custom Prompts**: Add a "Custom" mode where users can define their own system prompt.
- [ ] **Model Selection**: Allow users to choose between `gpt-4o`, `gpt-4o-mini`, or `gpt-3.5-turbo`.
- [ ] **Voice Input**: Integrate browser Speech-to-Text API for direct dictation.

## 🛠️ Engineering & DevOps

- [ ] **Testing**:
    - [ ] Set up **Vitest** for unit testing utility functions.
    - [ ] Add **Playwright** or **Cypress** for end-to-end testing.
- [ ] **CI/CD**:
    - [ ] Create a GitHub Action for linting and type checking on PRs.
    - [ ] Automate Docker builds on push to `main`.
- [ ] **Linting**: Add `prettier` configuration for consistent code formatting.

## 🎨 UI/UX

- [ ] **Toast Notifications**: Replace simple status text with a toast library (e.g., `sonner` or `react-hot-toast`).
- [ ] **Themes**: Add a light mode toggle (currently dark mode only).
- [ ] **Animations**: Add subtle transitions for smoother interactions.
