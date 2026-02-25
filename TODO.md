# Project Roadmap & TODOs

## 🔄 High Priority

- [ ] **Responsive Sidebar Mode**: Optimize layout for narrow widths (thin column/sidebar usage) - essential for productivity side-tool.
- [ ] **Settings Modal**: Move API key configuration to a dedicated settings modal.
- [ ] **Configurable Prompts**:
    - [ ] Allow users to edit system prompts for each mode.
    - [ ] **Add/Remove Prompts**: Enable users to create new custom modes (with their own prompts) and delete existing ones.
- [ ] **Custom Prefix/Suffix**: Allow users to append text (e.g., "🎧 *Transcribed:*") to the output.
- [ ] **Application Icon**: Create a modern, round/square icon featuring a headset/microphone.
- [ ] **Favicon**: Use the application icon as the favicon.
- [ ] **Modern UI/UX**: Enhance design with friendly colors, hover effects, and modern styling.

## 🚀 DevOps & CI/CD

- [ ] **GitHub Actions Pipeline**:
    - [ ] Build Docker image.
    - [ ] Push image to **GitHub Container Registry (GHCR)**.
    - [ ] Tag image with version (semver) and `latest`.

## 🛠️ Engineering

- [ ] **Error Handling**: Enhance user feedback for specific API errors.
- [ ] **Persist Settings**: Save the last used "Mode" and all custom prompts in local storage.

## 🔮 Future Features

- [ ] **History Tab**: Store the last 5-10 processed items locally.
- [ ] **File Upload**: Allow users to upload `.txt` or `.md` files.
- [ ] **Model Selection**: Allow users to choose between `gpt-4o`, `gpt-4o-mini`, or `gpt-3.5-turbo`.
- [ ] **Voice Input**: Integrate browser Speech-to-Text API.
- [ ] **Testing**: Set up Vitest/Playwright.
