# Project Roadmap & TODOs

## 🔄 High Priority

- [x] **Responsive Sidebar Mode**: Optimized layout for narrow widths.
- [x] **Settings Modal**: Moved API key configuration to a dedicated settings modal.
- [x] **Configurable Prompts**:
    - [x] Allow users to edit system prompts for each mode.
    - [x] **Add/Remove Prompts**: Users can create/delete custom modes.
- [x] **Custom Prefix/Suffix**: Allow users to append text (e.g., "🎧 *Transcribed:*").
- [x] **Application Icon**: Created a modern, round/square icon featuring a headset/microphone.
- [x] **Favicon**: Use the application icon as the favicon.
- [x] **Modern UI/UX**: Enhanced design with friendly colors, hover effects.

## 🚀 DevOps & CI/CD

- [x] **Docker Compose Watch**: Enabled `develop` section for hot-reloading in containers.
- [x] **GitHub Actions Pipeline**:
    - [x] Build Docker image.
    - [x] Push image to **GitHub Container Registry (GHCR)**.
    - [x] Tag image with version (semver) and `latest`.

## 🛠️ Engineering

- [x] **Persist Settings**: Custom prompts, prefix/suffix, and auto-copy settings are saved in local storage.
- [x] **Error Handling**: Enhance user feedback for specific API errors (e.g., distinguishing rate limits from auth errors).

## 🔮 Future Features

- [ ] **History Tab**: Store the last 5-10 processed items locally.
- [ ] **File Upload**: Allow users to upload `.txt` or `.md` files.
- [ ] **Model Selection**: Allow users to choose between `gpt-4o`, `gpt-4o-mini`, or `gpt-3.5-turbo`.
- [ ] **Voice Input**: Integrate browser Speech-to-Text API.
- [ ] **Testing**: Set up Vitest/Playwright.
