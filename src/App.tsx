import { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { useTheme } from "./hooks/useTheme";
import { processText, validateConfiguration, type PromptConfig, DEFAULT_PROMPTS, DEFAULT_MODEL, type AIModel } from "./lib/openai";
import { getEnvApiKey, isEnvKeyPresent } from "./lib/env";
import { TextInput } from "./components/TextInput";
import { ActionButtons } from "./components/ActionButtons";
import { OutputDisplay } from "./components/OutputDisplay";
import { SettingsModal } from "./components/SettingsModal";
import { AudioRecorder } from "./components/AudioRecorder";
import { Tooltip } from "./components/Tooltip";
import { Loader2, Settings, Cpu, CheckCircle2, AlertCircle, Lock, Clipboard, Check } from "lucide-react";

function App() {
  const [storedApiKey, setStoredApiKey] = useLocalStorage<string>("openai_api_key", "");
  const envApiKey = getEnvApiKey();
  const isEnvManaged = isEnvKeyPresent();
  
  // Use environment key if present, otherwise fall back to stored key
  const apiKey = isEnvManaged && envApiKey ? envApiKey : storedApiKey;

  // Wrapper for setApiKey to only update storage if not managed by env
  const setApiKey = (key: string) => {
    if (!isEnvManaged) {
      setStoredApiKey(key);
    }
  };

  const [model, setModel] = useLocalStorage<AIModel>("openai_model", DEFAULT_MODEL);
  const [prompts, setPrompts] = useLocalStorage<PromptConfig[]>("custom_prompts", DEFAULT_PROMPTS);
  const [customPrefix, setCustomPrefix] = useLocalStorage<string>("custom_prefix", "");
  const [customSuffix, setCustomSuffix] = useLocalStorage<string>("custom_suffix", "");
  const [applyPrefix, setApplyPrefix] = useLocalStorage<boolean>("apply_prefix", true);
  const [applySuffix, setApplySuffix] = useLocalStorage<boolean>("apply_suffix", true);
  const [rearrange, setRearrange] = useLocalStorage<boolean>("rearrange_output", false);
  const [autoCopy, setAutoCopy] = useLocalStorage<boolean>("auto_copy", false);
  const [recordingShortcut, setRecordingShortcut] = useLocalStorage<string>("recording_shortcut", "Control+Space");
  const [recordingMode, setRecordingMode] = useLocalStorage<"toggle" | "hold">("recording_mode", "toggle");

  const { theme, setTheme } = useTheme();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Validation State
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setValidationStatus('idle');
      setValidationMessage(null);
      return;
    }

    setValidationStatus('validating');
    
    const checkConfig = async () => {
      const result = await validateConfiguration(apiKey, model);
      setValidationStatus(result.isValid ? 'valid' : 'invalid');
      setValidationMessage(result.message || null);
    };

    const timer = setTimeout(() => {
      checkConfig();
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [apiKey, model]);


  const handleProcess = async (promptConfig: PromptConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await processText(
        inputText, 
        promptConfig.systemPrompt, 
        apiKey, 
        model, 
        rearrange,
        promptConfig.rearrangeInstruction // Pass the per-prompt rework instruction
      );
      const prefix = applyPrefix && customPrefix ? customPrefix + "\n" : "";
      const suffix = applySuffix && customSuffix ? "\n" + customSuffix : "";
      const finalOutput = `${prefix}${result}${suffix}`;
      
      setOutputText(finalOutput);
      if (autoCopy) {
        await navigator.clipboard.writeText(finalOutput);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred during processing.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscriptionComplete = (text: string) => {
    setInputText((prev) => (prev ? prev + "\n" + text : text));
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
    setError(null);
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          isEnvManaged={isEnvManaged}
          model={model}
          setModel={setModel}
          customPrefix={customPrefix}
          setCustomPrefix={setCustomPrefix}
          customSuffix={customSuffix}
          setCustomSuffix={setCustomSuffix}
          prompts={prompts}
          setPrompts={setPrompts}
          theme={theme}
          setTheme={setTheme}
          validationStatus={validationStatus}
          validationMessage={validationMessage}
          recordingShortcut={recordingShortcut}
          setRecordingShortcut={setRecordingShortcut}
          recordingMode={recordingMode}
          setRecordingMode={setRecordingMode}
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
                  Mouthwash
                </h1>
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-400">
                  <Cpu className="w-3 h-3" />
                  {model}
                  {/* Validation Indicator */}
                  <div className="ml-1 flex items-center gap-1" title={validationMessage || "Configuration Status"}>
                    {isEnvManaged && <Lock className="w-3 h-3 text-gray-500" />}
                    {validationStatus === 'validating' && (
                      <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                    )}
                    {validationStatus === 'valid' && (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    )}
                    {validationStatus === 'invalid' && (
                      <AlertCircle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
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

        <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 space-y-6 flex flex-col transition-colors duration-200">
          
          <div className="grid md:grid-cols-2 gap-6 pr-1">
            {/* Input Section */}
            <div className="space-y-2 flex flex-col">
              <div className="flex justify-between items-end h-[24px]"> {/* Fixed height for label row */}
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Input
                </label>
              </div>
              {/* Input Toolbar - aligned with Output Toolbar */}
              <div className="flex items-center justify-between gap-2 h-[32px] mb-2">
                 <div className="flex items-center gap-2">
                  <AudioRecorder 
                    apiKey={apiKey}
                    onTranscriptionComplete={handleTranscriptionComplete}
                    shortcut={recordingShortcut}
                    mode={recordingMode}
                    disabled={!apiKey}
                  />
                  {inputText && (
                    <button
                      onClick={clearText}
                      className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      Clear
                    </button>
                  )}
                 </div>
              </div>

              <div>
                 <TextInput
                  value={inputText}
                  onChange={setInputText}
                  placeholder="Paste your transcribed text here, or record audio..."
                />
              </div>
            </div>


            {/* Output Section */}
            <div className="space-y-2 flex flex-col relative">
              <div className="flex justify-between items-end h-[24px]"> {/* Fixed height for label row */}
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Output
                </label>
              </div>

              {/* Output Toolbar */}
              <div className="flex items-center justify-between gap-2 h-[32px] mb-2">
                 <div className="flex flex-wrap gap-4 items-center">
                    <label className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={autoCopy}
                        onChange={() => setAutoCopy(!autoCopy)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
                      />
                      <Tooltip content="Auto-copies output to clipboard.">
                        <span>Auto-copy</span>
                      </Tooltip>
                    </label>

                    <label className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={rearrange}
                        onChange={(e) => setRearrange(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
                      />
                      <Tooltip content="Rearranges text for better impact.">
                        <span>Rework</span>
                      </Tooltip>
                    </label>

                    {customPrefix && (
                      <label className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={applyPrefix}
                          onChange={(e) => setApplyPrefix(e.target.checked)}
                          className="form-checkbox h-4 w-4 text-purple-600 rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
                        />
                        <Tooltip content="Prepends custom text. (Configurable in Settings)">
                          <span className="truncate max-w-[150px]" title={`Prefix: ${customPrefix}`}>+ Prefix</span>
                        </Tooltip>
                      </label>
                    )}

                    {customSuffix && (
                      <label className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={applySuffix}
                          onChange={(e) => setApplySuffix(e.target.checked)}
                          className="form-checkbox h-4 w-4 text-purple-600 rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
                        />
                        <Tooltip content="Appends custom text. (Configurable in Settings)">
                          <span className="truncate max-w-[150px]" title={`Suffix: ${customSuffix}`}>+ Suffix</span>
                        </Tooltip>
                      </label>
                    )}
                  </div>

                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
              </div>
              
              <div className="relative">
                <OutputDisplay 
                  value={outputText}
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

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700/30 flex flex-col items-center gap-4">
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
