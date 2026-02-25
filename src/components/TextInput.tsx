import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-full bg-gray-800 text-white border border-gray-700 hover:border-gray-500 rounded-lg p-4 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base placeholder-gray-500"
    />
  );
};
