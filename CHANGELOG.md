# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
