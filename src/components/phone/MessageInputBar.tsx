import React from 'react';

interface MessageInputBarProps {
  dark: boolean;
}

const MessageInputBar: React.FC<MessageInputBarProps> = ({ dark }) => {
  const bgOuter = dark ? '#1C1C1E' : '#FFFFFF';
  const bgInput = dark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)';
  const placeholderColor = dark ? '#636366' : '#8E8E93';
  const iconColor = '#007AFF';
  const barBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';

  return (
    <div
      className="flex items-center gap-2 px-2 py-2"
      style={{
        background: bgOuter,
        borderTop: `0.5px solid ${barBorder}`,
      }}
    >
      {/* Apps icon */}
      <button style={{ color: iconColor, flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke={iconColor} strokeWidth="1.5" />
          <path d="M9 14h10M14 9v10" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Text input pill */}
      <div
        className="flex-1 flex items-center rounded-full px-3"
        style={{
          background: bgInput,
          border: `1px solid ${borderColor}`,
          minHeight: '34px',
        }}
      >
        <span
          className="text-[15px]"
          style={{ color: placeholderColor, fontFamily: "'Inter', sans-serif" }}
        >
          iMessage
        </span>
      </div>

      {/* Audio icon */}
      <button style={{ color: iconColor, flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke={iconColor} strokeWidth="1.5" />
          <rect x="11" y="8" width="6" height="9" rx="3" stroke={iconColor} strokeWidth="1.5" />
          <path d="M9 15.5C9 18.26 11.24 20.5 14 20.5C16.76 20.5 19 18.26 19 15.5" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 20.5V23" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default MessageInputBar;
