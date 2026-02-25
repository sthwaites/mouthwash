import React, { useState } from "react";
import { X, Plus, Trash2, Save, Undo, Key, Sun, Moon, Monitor, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { type PromptConfig, DEFAULT_PROMPTS, type AIModel, AVAILABLE_MODELS } from "../lib/openai";
import type { Theme } from "../hooks/useTheme";
import { RecordingSettings } from "./RecordingSettings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  model: AIModel;
  setModel: (model: AIModel) => void;
  customPrefix: string;
  setCustomPrefix: (val: string) => void;
  customSuffix: string;
  setCustomSuffix: (val: string) => void;
  prompts: PromptConfig[];
  setPrompts: (prompts: PromptConfig[]) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  validationStatus: 'idle' | 'validating' | 'valid' | 'invalid';
  validationMessage: string | null;
  recordingShortcut: string;
  setRecordingShortcut: (shortcut: string) => void;
  recordingMode: "toggle" | "hold";
  setRecordingMode: (mode: "toggle" | "hold") => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  model,
  setModel,
  customPrefix,
  setCustomPrefix,
  customSuffix,
  setCustomSuffix,
  prompts,
  setPrompts,
  theme,
  setTheme,
  validationStatus,
  validationMessage,
  recordingShortcut,
  setRecordingShortcut,
  recordingMode,
  setRecordingMode,
}) => {
  const [localPrompts, setLocalPrompts] = useState<PromptConfig[]>(prompts);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSavePrompts = () => {
    setPrompts(localPrompts);
    onClose();
  };

  const handleAddPrompt = () => {
    const newId = `custom-${Date.now()}`;
    const newPrompt: PromptConfig = {
      id: newId,
      name: "New Prompt",
      description: "Custom prompt description",
      systemPrompt: "You are a helpful assistant...",
    };
    setLocalPrompts([...localPrompts, newPrompt]);
    setEditingId(newId);
  };

  const handleDeletePrompt = (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      setLocalPrompts(localPrompts.filter((p) => p.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const handleUpdatePrompt = (id: string, field: keyof PromptConfig, value: string) => {
    setLocalPrompts(
      localPrompts.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all prompts to default? Custom prompts will be lost.")) {
      setLocalPrompts(DEFAULT_PROMPTS);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Theme Section */}
          <section className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
               Appearance
             </h3>
             <div className="bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700 flex">
               <button
                 onClick={() => setTheme("light")}
                 className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                   theme === "light"
                     ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm"
                     : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                 }`}
               >
                 <Sun className="w-4 h-4" /> Light
               </button>
               <button
                 onClick={() => setTheme("dark")}
                 className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                   theme === "dark"
                     ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm"
                     : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                 }`}
               >
                 <Moon className="w-4 h-4" /> Dark
               </button>
               <button
                 onClick={() => setTheme("system")}
                 className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                   theme === "system"
                     ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm"
                     : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                 }`}
               >
                 <Monitor className="w-4 h-4" /> Auto
               </button>
             </div>
          </section>

          {/* API Key Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Key className="w-5 h-5" /> API Configuration
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  OpenAI API Key
                </label>
                {/* Validation Status */}
                {apiKey && (
                   <div className="flex items-center gap-1.5 text-xs font-medium animate-in fade-in zoom-in duration-200">
                    {validationStatus === 'validating' && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                        <span className="text-blue-500">Validating...</span>
                      </>
                    )}
                    {validationStatus === 'valid' && (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">Valid Configuration</span>
                      </>
                    )}
                    {validationStatus === 'invalid' && (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-red-600 dark:text-red-400">Invalid Configuration</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className={`w-full bg-white dark:bg-gray-900 border rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors ${
                  validationStatus === 'invalid' 
                    ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500 focus:border-red-500' 
                    : validationStatus === 'valid'
                      ? 'border-green-300 dark:border-green-500/50 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                }`}
              />
              
              {validationStatus === 'invalid' && validationMessage && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationMessage}
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Stored locally in your browser. Never sent to our servers.
              </p>
            </div>
          </section>

          {/* Recording Settings */}
          <RecordingSettings
            shortcut={recordingShortcut}
            setShortcut={setRecordingShortcut}
            mode={recordingMode}
            setMode={setRecordingMode}
          />

          {/* Model Selection */}
          <section className="space-y-4">
             <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
               AI Model
             </h3>
             <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                 Select Model
               </label>
               <select
                 value={model}
                 onChange={(e) => setModel(e.target.value as AIModel)}
                 className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
               >
                 {AVAILABLE_MODELS.map((m) => (
                   <option key={m} value={m}>
                     {m}
                   </option>
                 ))}
               </select>
               <p className="text-xs text-gray-500 mt-2">
                 Choose the OpenAI model to use for processing.
               </p>
             </div>
          </section>

          {/* Output Customization */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Output Formatting</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Prefix (optional)
                </label>
                <input
                  type="text"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  placeholder="e.g. 🎧 Transcribed:"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Suffix (optional)
                </label>
                <input
                  type="text"
                  value={customSuffix}
                  onChange={(e) => setCustomSuffix(e.target.value)}
                  placeholder="e.g. (End of file)"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>
          </section>

          {/* Prompts Management */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">System Prompts</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleResetDefaults}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1 transition-colors"
                >
                  <Undo className="w-3 h-3" /> Reset Defaults
                </button>
                <button
                  onClick={handleAddPrompt}
                  className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 transition-colors shadow-lg shadow-green-900/20"
                >
                  <Plus className="w-3 h-3" /> Add Prompt
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {localPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    editingId === prompt.id
                      ? "bg-white dark:bg-gray-800 border-blue-500 shadow-lg shadow-blue-900/10"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={prompt.name}
                        onChange={(e) => handleUpdatePrompt(prompt.id, "name", e.target.value)}
                        className={`bg-transparent font-bold text-gray-900 dark:text-white focus:outline-none w-full ${editingId === prompt.id ? 'border-b border-blue-500/50' : ''}`}
                        placeholder="Prompt Name"
                        onFocus={() => setEditingId(prompt.id)}
                      />
                      <input
                        type="text"
                        value={prompt.description}
                        onChange={(e) => handleUpdatePrompt(prompt.id, "description", e.target.value)}
                        className="bg-transparent text-sm text-gray-500 dark:text-gray-400 focus:outline-none w-full"
                        placeholder="Short description..."
                        onFocus={() => setEditingId(prompt.id)}
                      />
                    </div>
                    <button
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500 p-1 transition-colors"
                      title="Delete Prompt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <textarea
                    value={prompt.systemPrompt}
                    onChange={(e) => handleUpdatePrompt(prompt.id, "systemPrompt", e.target.value)}
                    onFocus={() => setEditingId(prompt.id)}
                    className={`w-full bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-300 text-sm p-3 rounded-lg resize-y min-h-[80px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-transparent ${editingId === prompt.id ? 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700' : ''}`}
                    placeholder="Enter system prompt here..."
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePrompts}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
