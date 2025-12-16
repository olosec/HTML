import React, { useRef, useEffect } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      // Insert 2 spaces for tab
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Move cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const lineCount = value.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="relative w-full h-full flex font-mono text-sm bg-editor-bg">
      {/* Line Numbers */}
      <div 
        ref={lineNumbersRef}
        className="w-12 pt-4 pb-4 px-2 text-right bg-editor-gutter text-slate-500 select-none overflow-hidden h-full shrink-0 border-r border-slate-700"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        {lineNumbers.map(num => (
          <div key={num} className="leading-6 text-xs text-opacity-50">{num}</div>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="flex-1 w-full h-full p-4 bg-transparent text-editor-text resize-none focus:outline-none leading-6 whitespace-pre"
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        style={{ 
            fontFamily: '"JetBrains Mono", monospace',
            tabSize: 2 
        }}
      />
    </div>
  );
};