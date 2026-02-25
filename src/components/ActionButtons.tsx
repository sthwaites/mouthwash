import React from 'react';
import { type FilterMode } from '../lib/openai';

interface ActionButtonsProps {
  onProcess: (mode: FilterMode) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onProcess, isLoading, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onProcess('cleanup')}
        disabled={disabled || isLoading}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      >
        Cleanup (Coherent)
      </button>
      <button
        onClick={() => onProcess('business')}
        disabled={disabled || isLoading}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
      >
        Business Polish
      </button>
      <button
        onClick={() => onProcess('prompt')}
        disabled={disabled || isLoading}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
      >
        Prompt (Best Practice)
      </button>
    </div>
  );
};
