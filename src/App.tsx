import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { useTheme } from "./hooks/useTheme";
import { processText, type PromptConfig, DEFAULT_PROMPTS, MODEL } from "./lib/openai";
import { TextInput } from "./components/TextInput";
import { ActionButtons } from "./components/ActionButtons";
import { OutputDisplay } from "./components/OutputDisplay";
import { SettingsModal } from "./components/SettingsModal";
import { Loader2, Settings, Cpu } from "lucide-react";

function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>("openai_api_key", "");
  const [prompts, setPrompts] = useLocalStorage<PromptConfig[]>("custom_prompts", DEFAULT_PROMPTS);
  const [customPrefix, setCustomPrefix] = useLocalStorage<string>("custom_prefix", "");
  const [customSuffix, setCustomSuffix] = useLocalStorage<string>("custom_suffix", "");
  const [autoCopy, setAutoCopy] = useLocalStorage<boolean>("auto_copy", false);

  const { theme, setTheme } = useTheme();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleProcess = async (promptConfig: PromptConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await processText(inputText, promptConfig.systemPrompt, apiKey);
      const finalOutput = `${customPrefix ? customPrefix + "\n" : ""}${result}${customSuffix ? "\n" + customSuffix : ""}`;
      
      setOutputText(finalOutput);
      if (autoCopy) {
        await navigator.clipboard.writeText(finalOutput);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 font-sans relative transition-colors duration-200">
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          apiKey={apiKey}
          setApiKey={setApiKey}
          customPrefix={customPrefix}
          setCustomPrefix={setCustomPrefix}
          customSuffix={customSuffix}
          setCustomSuffix={setCustomSuffix}
          prompts={prompts}
          setPrompts={setPrompts}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      <div className="w-full max-w-4xl space-y-6 mt-6 md:mt-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/icon.svg" 
              alt="Logo" 
              className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500">
                  Voice Cleanup
                </h1>
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-400">
                  <Cpu className="w-3 h-3" />
                  {MODEL}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Professional Voice-to-Text Polish
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </header>

        <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 space-y-6 flex flex-col h-[calc(100vh-140px)] md:h-auto overflow-hidden transition-colors duration-200">
          
          <div className="grid md:grid-cols-2 gap-6 h-full overflow-y-auto md:overflow-visible pr-1">
            {/* Input Section */}
            <div className="space-y-2 flex flex-col h-full">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Input
                </label>
                {inputText && (
                  <button
                    onClick={clearText}
                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex-grow">
                 <TextInput
                  value={inputText}
                  onChange={setInputText}
                  placeholder="Paste your transcribed text here..."
                />
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-2 flex flex-col h-full relative">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Output
                </label>
              </div>
              
              <div className="relative flex-grow">
                <OutputDisplay 
                  value={outputText} 
                  autoCopy={autoCopy} 
                  toggleAutoCopy={() => setAutoCopy(!autoCopy)} 
                />
                
                {isLoading && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm z-10 border border-gray-200 dark:border-gray-700/50">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium tracking-wide">Polishing text...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-200 rounded-lg text-sm text-center animate-pulse flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700/30 flex flex-col items-center gap-4 mt-auto">
            <ActionButtons
              prompts={prompts}
              onProcess={handleProcess}
              isLoading={isLoading}
              disabled={!apiKey || !inputText.trim()}
            />
            {(!apiKey || !inputText.trim()) && (
              <p className="text-xs text-gray-500 italic flex items-center gap-1">
                {!apiKey ? (
                  <>Please configure your <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onClick={() => setIsSettingsOpen(true)}>API Key</span> in settings.</>
                ) : (
                  "Enter text to begin processing."
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
