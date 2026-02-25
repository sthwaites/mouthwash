import React, { useEffect, useState } from "react";
import { Mic, Square, Loader2, AlertCircle } from "lucide-react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { transcribeAudio } from "../lib/openai";

interface AudioRecorderProps {
  apiKey: string;
  onTranscriptionComplete: (text: string) => void;
  shortcut?: string; // Optional for now
  mode?: "toggle" | "hold"; // Optional for now
  disabled?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  apiKey,
  onTranscriptionComplete,
  shortcut = "Control+Space",
  mode = "toggle",
  disabled = false,
}) => {
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    error: recorderError,
    reset,
  } = useAudioRecorder();

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  // Combine errors for display
  const error = recorderError || transcriptionError;


  // Handle keyboard shortcuts
  useEffect(() => {
    if (disabled || isTranscribing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea UNLESS modifier keys are used
      const activeTag = document.activeElement?.tagName;
      const isInput =
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable;
      
      // Parse shortcut string (e.g., "Control+Space", "Meta+Shift+R")
      const parts = shortcut.split("+");
      const requiredCtrl = parts.includes("Control");
      const requiredMeta = parts.includes("Meta");
      const requiredAlt = parts.includes("Alt");
      const requiredShift = parts.includes("Shift");
      
      // Find the main key (the one that isn't a modifier)
      const requiredKey = parts.find(
        (p) => !["Control", "Meta", "Alt", "Shift"].includes(p)
      );

      // Normalize event key
      const eventKey = e.key === " " ? "Space" : e.key;
      const normalizedEventKey = eventKey.length === 1 ? eventKey.toUpperCase() : eventKey;

      // Check matches
      const matchCtrl = e.ctrlKey === requiredCtrl;
      const matchMeta = e.metaKey === requiredMeta;
      const matchAlt = e.altKey === requiredAlt;
      const matchShift = e.shiftKey === requiredShift;
      const matchKey = requiredKey === normalizedEventKey;

      // Special case: If the shortcut is JUST a key (e.g. "Space"), 
      // strict modifier checking might fail if we don't handle it carefully.
      // But based on RecordingSettings, modifiers are explicit.
      
      const isMatch = matchCtrl && matchMeta && matchAlt && matchShift && matchKey;

      // Safety check: block single-key shortcuts in inputs (e.g. "Space")
      // If the shortcut has NO modifiers, and we are in an input, don't trigger.
      const hasModifiers = requiredCtrl || requiredMeta || requiredAlt || requiredShift;
      if (isInput && !hasModifiers) return;

      if (isMatch) {
        e.preventDefault(); // Prevent default browser actions

        if (mode === "toggle") {
          // Toggle Mode: Only act on initial press
          if (!e.repeat) {
            if (isRecording) {
              stopRecording();
            } else {
              startRecording();
            }
          }
        } else {
          // Hold Mode: Start on press
          if (!isRecording && !e.repeat) {
            startRecording();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Only relevant for Hold Mode
      if (mode !== "hold" || !isRecording) return;

      const eventKey = e.key === " " ? "Space" : e.key;
      const normalizedEventKey = eventKey.length === 1 ? eventKey.toUpperCase() : eventKey;
      
      const parts = shortcut.split("+");
      const requiredKey = parts.find(
        (p) => !["Control", "Meta", "Alt", "Shift"].includes(p)
      );

      // If the main key of the shortcut is released, stop recording
      if (requiredKey === normalizedEventKey) {
        stopRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [disabled, isTranscribing, isRecording, mode, shortcut, startRecording, stopRecording]);

  // Handle Audio Blob Processing (Transcription)
  useEffect(() => {
    if (audioBlob) {
      const process = async () => {
        setIsTranscribing(true);
        setTranscriptionError(null);
        try {
          // Create a File object from the Blob
          // Note: MIME type is determined inside useAudioRecorder, but we can default to webm/mp4
          const extension = audioBlob.type.includes("mp4") ? "mp4" : "webm";
          const file = new File([audioBlob], `recording.${extension}`, { type: audioBlob.type });
          
          const text = await transcribeAudio(file, apiKey);
          onTranscriptionComplete(text);
        } catch (err) {
          console.error("Transcription Failed:", err);
          let message = "Failed to transcribe audio.";
          if (err instanceof Error) {
            message = err.message;
          }
          setTranscriptionError(message);
        } finally {
          setIsTranscribing(false);
          reset(); // Clear the blob so we don't re-process
        }
      };
      process();
    }
  }, [audioBlob, apiKey, onTranscriptionComplete, reset]);

  // Error Display
  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500 text-xs px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800" title={error}>
        <AlertCircle className="w-3 h-3" />
        <span className="truncate max-w-[150px]">{error}</span>
        <button onClick={reset} className="hover:text-red-700 dark:hover:text-red-300 font-bold ml-1">×</button>
      </div>
    );
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isTranscribing}
      className={`
        relative flex items-center justify-center p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        ${
          isRecording
            ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
            : isTranscribing
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 cursor-wait"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={
        isRecording
          ? "Stop Recording"
          : isTranscribing
          ? "Transcribing..."
          : `Start Recording (${shortcut}) - ${mode === "hold" ? "Hold" : "Press"}`
      }
    >
      {isTranscribing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isRecording ? (
         <Square className="w-4 h-4 fill-current" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
};
