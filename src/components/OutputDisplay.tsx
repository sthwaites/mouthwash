import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface OutputDisplayProps {
  value: string;
  autoCopy: boolean;
  toggleAutoCopy: () => void;
  customPrefix?: string;
  customSuffix?: string;
  applyPrefix: boolean;
  setApplyPrefix: (value: boolean) => void;
  applySuffix: boolean;
  setApplySuffix: (value: boolean) => void;
  rearrange: boolean;
  setRearrange: (value: boolean) => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ 
  value, 
  autoCopy, 
  toggleAutoCopy,
  customPrefix,
  customSuffix,
  applyPrefix,
  setApplyPrefix,
  applySuffix,
  setApplySuffix,
  rearrange,
  setRearrange
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col space-y-2 h-full">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={autoCopy}
                onChange={toggleAutoCopy}
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
            disabled={!value}
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
      </div>
      <textarea
        readOnly
        value={value}
        className="w-full h-full bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-lg p-4 resize-none focus:outline-none focus:border-blue-500/50 cursor-default transition-all"
        placeholder="Processed text will appear here..."
      />
    </div>
  );
};
