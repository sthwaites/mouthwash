import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { processText, type FilterMode } from "./lib/openai";
import { ApiKeyInput } from "./components/ApiKeyInput";
import { TextInput } from "./components/TextInput";
import { ActionButtons } from "./components/ActionButtons";
import { OutputDisplay } from "./components/OutputDisplay";
import { Loader2 } from "lucide-react";

function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>("openai_api_key", "");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoCopy, setAutoCopy] = useLocalStorage<boolean>("auto_copy", false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (mode: FilterMode) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await processText(inputText, mode, apiKey);
      setOutputText(result);
      if (autoCopy) {
        await navigator.clipboard.writeText(result);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during processing.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-4xl space-y-8 mt-10">
        <header className="text-center space-y-2 flex flex-col items-center">
          <img src="/icon.svg" alt="Voice Cleanup Logo" className="w-16 h-16 mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Voice Cleanup
          </h1>
          <p className="text-gray-400">
            Transform your voice notes into polished text instantly.
          </p>
        </header>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700/50 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-200">Configuration</h2>
            <div className="w-full md:w-2/3">
              <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Input
                </label>
                {inputText && (
                  <button
                    onClick={clearText}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-900/20"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <TextInput
                value={inputText}
                onChange={setInputText}
                placeholder="Paste your transcribed text here..."
              />
            </div>

            {/* Output Section */}
            <div className="space-y-3 relative">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Output
                </label>
              </div>
              
              <div className="relative">
                <OutputDisplay 
                  value={outputText} 
                  autoCopy={autoCopy} 
                  toggleAutoCopy={() => setAutoCopy(!autoCopy)} 
                />
                
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-900/60 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm z-10">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
                    <span className="text-sm text-blue-400 font-medium">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-200 rounded-lg text-sm text-center animate-pulse">
              Error: {error}
            </div>
          )}

          <div className="pt-6 border-t border-gray-700/50 flex flex-col items-center gap-4">
            <ActionButtons
              onProcess={handleProcess}
              isLoading={isLoading}
              disabled={!apiKey || !inputText.trim()}
            />
            {(!apiKey || !inputText.trim()) && (
              <p className="text-xs text-gray-500 italic">
                {!apiKey ? "Enter your API Key to start." : "Enter some text to process."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
