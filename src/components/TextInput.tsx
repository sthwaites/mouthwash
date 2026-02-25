import React, { useRef } from 'react';
import { useAutoResize } from '../hooks/useAutoResize';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Apply auto-resize hook
  useAutoResize(textareaRef, value);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[240px] max-h-[60vh] overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 rounded-lg p-4 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base placeholder-gray-400 dark:placeholder-gray-500"
    />
  );
};
