import React from 'react';
import { type PromptConfig } from '../lib/openai';

interface ActionButtonsProps {
  prompts: PromptConfig[];
  onProcess: (prompt: PromptConfig) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ prompts, onProcess, isLoading, disabled }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onProcess(prompt)}
          disabled={disabled || isLoading}
          title={prompt.description}
          className="px-5 py-2.5 rounded-lg font-medium shadow-md transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-blue-500 text-sm md:text-base flex items-center justify-center min-w-[120px]"
        >
          {prompt.name}
        </button>
      ))}
    </div>
  );
};
