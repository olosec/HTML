import React from 'react';

interface PreviewProps {
  code: string;
}

export const Preview: React.FC<PreviewProps> = ({ code }) => {
  return (
    <div className="w-full h-full bg-white">
      <iframe
        title="preview"
        srcDoc={code}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals" // Security: restrict iframe capabilities
      />
    </div>
  );
};