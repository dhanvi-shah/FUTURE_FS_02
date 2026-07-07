import { useEffect } from 'react';

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {}
) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const ctrlMatch = modifiers.ctrl ? e.ctrlKey : true;
      const metaMatch = modifiers.meta ? e.metaKey : true;
      const shiftMatch = modifiers.shift ? e.shiftKey : !e.shiftKey;

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        ctrlMatch &&
        metaMatch &&
        shiftMatch
      ) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers.ctrl, modifiers.meta, modifiers.shift]);
};
