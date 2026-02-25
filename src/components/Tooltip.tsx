import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  trigger?: 'icon' | 'child';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, trigger = 'icon' }) => {
  return (
    <div className={`group relative flex items-center ${trigger === 'child' ? 'justify-center' : ''}`}>
      {trigger === 'child' ? (
        children
      ) : (
        <>
          {children}
          <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 ml-1.5 cursor-help transition-colors" />
        </>
      )}
      
      {/* Tooltip Content */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 text-center ${trigger === 'child' ? 'mb-1' : ''}`}>
        {content}
        {/* Triangle Pointer */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
      </div>
    </div>
  );
};