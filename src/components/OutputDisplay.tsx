import React, { useRef } from 'react';
import { useAutoResize } from '../hooks/useAutoResize';

interface OutputDisplayProps {
  value: string;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ value }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Apply auto-resize hook
  useAutoResize(textareaRef, value);

  return (
    <div className="flex flex-col space-y-2 h-full">
      <textarea
        ref={textareaRef}
        readOnly
        value={value}
        className="w-full min-h-[240px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-lg p-4 resize-none focus:outline-none focus:border-blue-500/50 cursor-default transition-all"
        placeholder="Processed text will appear here..."
      />
    </div>
  );
};
