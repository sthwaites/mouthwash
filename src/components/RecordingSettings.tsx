import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";

interface RecordingSettingsProps {
  shortcut: string;
  setShortcut: (shortcut: string) => void;
  mode: "toggle" | "hold";
  setMode: (mode: "toggle" | "hold") => void;
}

export const RecordingSettings: React.FC<RecordingSettingsProps> = ({
  shortcut,
  setShortcut,
  mode,
  setMode,
}) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isListening) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const keys: string[] = [];
      if (e.ctrlKey) keys.push("Control");
      if (e.metaKey) keys.push("Meta");
      if (e.altKey) keys.push("Alt");
      if (e.shiftKey) keys.push("Shift");

      const key = e.key === " " ? "Space" : e.key;

      if (!["Control", "Meta", "Alt", "Shift"].includes(key)) {
        keys.push(key.length === 1 ? key.toUpperCase() : key);
      }

      if (keys.length > 0) {
          // Normalize shortcut string
          const newShortcut = keys.join("+");
          setShortcut(newShortcut);
          setIsListening(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isListening, setShortcut]);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
        <Mic className="w-5 h-5" /> Voice Recording
      </h3>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
        
        {/* Shortcut Recorder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            Keyboard Shortcut
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsListening(true)}
              className={`flex-1 px-4 py-2 rounded-lg border text-sm font-mono transition-all text-center ${
                isListening
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse ring-2 ring-red-500/20"
                  : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:border-gray-400"
              }`}
            >
              {isListening ? "Press keys..." : shortcut}
            </button>
            <button
               onClick={() => setShortcut("Control+Space")}
               className="px-3 py-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
               title="Reset to Default"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click the box and press your desired key combination (e.g., Ctrl+Space).
          </p>
        </div>

        {/* Mode Selector */}
        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            Recording Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode("toggle")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                mode === "toggle"
                  ? "bg-white dark:bg-gray-900 border-red-500 text-red-600 dark:text-red-400 shadow-sm"
                  : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Toggle (Press)
            </button>
             <button
              onClick={() => setMode("hold")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                mode === "hold"
                  ? "bg-white dark:bg-gray-900 border-red-500 text-red-600 dark:text-red-400 shadow-sm"
                  : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Push-to-Talk (Hold)
            </button>
          </div>
           <p className="text-xs text-gray-500 mt-2">
            <strong>Toggle:</strong> Press once to start, press again to stop.<br/>
            <strong>Push-to-Talk:</strong> Hold key to record, release to stop.
          </p>
        </div>

      </div>
    </section>
  );
};
