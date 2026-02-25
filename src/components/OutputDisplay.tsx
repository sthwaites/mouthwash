import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';

interface OutputDisplayProps {
  value: string;
  autoCopy: boolean;
  toggleAutoCopy: () => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ value, autoCopy, toggleAutoCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col space-y-2 mt-4">
      <div className="flex justify-between items-center mb-2">
        <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={autoCopy}
            onChange={toggleAutoCopy}
            className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600 focus:ring-offset-gray-900"
          />
          <span>Auto-copy on completion</span>
        </label>
        <button
          onClick={handleCopy}
          disabled={!value}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <textarea
        readOnly
        value={value}
        className="w-full h-40 bg-gray-900 text-gray-300 border border-gray-800 rounded-lg p-4 resize-none focus:outline-none cursor-default"
        placeholder="Processed text will appear here..."
      />
    </div>
  );
};
