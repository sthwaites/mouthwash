# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-25

### Added

- **Settings Modal**: Dedicated settings interface for managing API keys and application preferences.
- **Configurable Prompts**:
  - Ability to customize system prompts for existing modes.
  - Create, edit, and delete custom prompt modes.
- **Output Customization**: Options to add custom prefix and suffix to processed text (e.g., "🎧 Transcribed:").
- **CI/CD**: GitHub Actions workflow (`docker-publish.yml`) to build and push Docker images to GHCR.
- **Developer Experience**: Docker Compose Watch support for hot-reloading during containerized development.
- **Branding**: New application icon and favicon featuring a modern headset design.

### Changed

- **UI Refactor**: Moved API key input from the main header to the new Settings Modal.
- **Responsive Design**: improved layout for narrow "sidebar" usage.

## [0.1.0] - 2026-02-25

### Added

- **Core Application**: Initial release of the Voice Cleanup web application.
- **Processing Modes**:
  - `Cleanup Mode`: Removes hesitations and fixes transcription errors.
  - `Business Mode`: Rewrites text into professional business English.
  - `Prompt Mode`: Converts text into optimized AI prompts.
- **OpenAI Integration**: Secure integration with OpenAI API (using `gpt-4o-mini`).
- **Secure Storage**: LocalStorage implementation for persisting API keys securely on the client side.
- **UI/UX**:
  - Dark mode interface with Tailwind CSS.
  - Responsive design.
  - Auto-copy functionality.
  - Loading states and error handling.
- **Docker Support**:
  - `Dockerfile` for multi-stage builds (Node.js build -> Nginx serve).
  - `docker-compose.yml` for easy container orchestration.
  - `nginx.conf` for serving the SPA.
