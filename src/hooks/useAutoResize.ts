import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Automatically resizes a textarea based on its content.
 * @param ref - The ref to the textarea element.
 * @param value - The value of the textarea to trigger resize on change.
 */
export const useAutoResize = (
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string
) => {
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    // Reset height to auto to correctly calculate scrollHeight
    textarea.style.height = 'auto';
    
    // Set height to scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [ref, value]);
};
