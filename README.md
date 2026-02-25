# Mouthwash

A modern, privacy-focused web application for cleaning up, polishing, and optimizing transcribed voice notes. Transform messy voice-to-text output into clear, professional communication or structured AI prompts with a single click.

## Features

- **🗣️ Cleanup Mode**: Intelligently removes filler words (um, ah, like), hesitations, and stutters while preserving the original meaning and word choice.
- **💼 Business Polish**: Rewrites casual or fragmented speech into professional business English, removing colloquialisms and improving clarity.
- **🤖 Prompt Mode**: Converts rambling instructions into high-quality, structured prompts optimized for AI models like ChatGPT, Claude, and Gemini.
- **🎙️ Voice Recording**: Record your thoughts directly in the browser using OpenAI's Whisper model for accurate speech-to-text transcription.
- **🧠 Model Selection**: Choose between multiple OpenAI models (GPT-4o, GPT-4o-mini, GPT-3.5-turbo) to balance speed, cost, and intelligence.
- **🔒 Privacy First**: Your OpenAI API key is stored locally in your browser (LocalStorage) and never sent to our servers. All processing happens directly between your browser and OpenAI.
- **⚡ Blazing Fast**: Built with React + Vite for instant load times and responsive interactions.
- **🌗 Theme Support**: Choose between Light, Dark, or System Sync modes for a comfortable viewing experience in any environment.
- **📋 Auto-Copy**: Optional setting to automatically copy processed text to your clipboard.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **AI Integration**: OpenAI API (Support for GPT-4o, GPT-4o-mini, GPT-3.5-turbo & Whisper)
- **State Management**: React Hooks + LocalStorage
- **Containerization**: Docker, Docker Compose, Nginx

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API Key

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/mouthwash.git
    cd mouthwash
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit `http://localhost:5173` in your browser.

5.  **Enter API Key:**
    Enter your OpenAI API key in the configuration panel at the top.

### Production Build

To build the app for production:

```bash
npm run build
```

The output will be in the `dist/` directory, ready to be served by any static file server.

### Docker Deployment

Run the application in a lightweight container using Docker Compose:

1.  **Build and start:**
    ```bash
    docker-compose up -d --build
    ```

2.  **Access the app:**
    Visit `http://localhost:8080`

3.  **Stop:**
    ```bash
    docker-compose down
    ```

## Project Structure

```
mouthwash/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (ApiKeyInput, TextInput, etc.)
│   ├── hooks/           # Custom React hooks (useLocalStorage)
│   ├── lib/             # Utilities and API logic (openai.ts)
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── Dockerfile           # Multi-stage Docker build config
├── docker-compose.yml   # Docker Compose orchestration
├── nginx.conf           # Nginx configuration for serving SPA
└── vite.config.ts       # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
