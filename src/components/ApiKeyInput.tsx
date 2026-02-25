import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey }) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg border border-gray-700">
      <Key className="w-5 h-5 text-gray-400" />
      <input
        type={showKey ? "text" : "password"}
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your OpenAI API Key"
        className="bg-transparent border-none outline-none flex-grow text-white placeholder-gray-500 text-sm"
      />
      <button
        onClick={() => setShowKey(!showKey)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};
