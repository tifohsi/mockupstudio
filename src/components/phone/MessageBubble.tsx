import React from 'react';
import { Message, ConversationConfig } from '../../types';

interface MessageBubbleProps {
  message: Message;
  config: ConversationConfig;
  isLast: boolean;
  nextMessageType?: 'sent' | 'received' | null;
}

// Typing indicator - animated dots
export const TypingIndicator: React.FC<{ dark: boolean }> = ({ dark }) => {
  const bubbleBg = dark ? '#3A3A3C' : '#E5E5EA';
  return (
    <div className="flex items-end gap-1 mb-2">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{ background: dark ? '#555' : '#D1D1D6', color: dark ? '#fff' : '#000' }}
      >
        {' '}
      </div>
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-[18px] rounded-bl-[4px]"
        style={{ background: bubbleBg, minHeight: '36px' }}
      >
        <div className="w-2 h-2 rounded-full typing-dot" style={{ background: dark ? '#8E8E93' : '#8E8E93' }} />
        <div className="w-2 h-2 rounded-full typing-dot" style={{ background: dark ? '#8E8E93' : '#8E8E93', animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full typing-dot" style={{ background: dark ? '#8E8E93' : '#8E8E93', animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  config,
  isLast,
  nextMessageType,
}) => {
  const dark = config.iosTheme === 'dark';
  const isSent = message.type === 'sent';

  // Determine tail visibility: show tail on last bubble in a group
  const showTail = !nextMessageType || nextMessageType !== message.type;

  // Colors
  const sentBg = '#007AFF';
  const receivedBg = dark ? '#3A3A3C' : '#E5E5EA';
  const sentText = '#FFFFFF';
  const receivedText = dark ? '#FFFFFF' : '#000000';
  const timestampColor = dark ? '#636366' : '#8E8E93';
  const readReceiptColor = dark ? '#636366' : '#8E8E93';

  // Border radius: iOS uses large radius with slight reduction on tailed corner
  const sentRadius = showTail
    ? '18px 18px 4px 18px'
    : '18px 18px 18px 18px';
  const receivedRadius = showTail
    ? '18px 18px 18px 4px'
    : '18px 18px 18px 18px';

  if (message.isTypingIndicator) {
    return <TypingIndicator dark={dark} />;
  }

  return (
    <div className="animate-fade-in">
      {/* Timestamp above group */}
      {message.showTimestamp && (
        <div className="flex justify-center my-3">
          <span
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color: timestampColor, fontFamily: "'Inter', sans-serif" }}
          >
            {message.timestamp}
          </span>
        </div>
      )}

      {/* Message row */}
      <div className={`flex items-end gap-1 mb-0.5 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Bubble */}
        <div
          className={`
            relative max-w-[75%] px-3 py-2 
            text-[15px] leading-[1.35]
            break-words whitespace-pre-wrap
            transition-all duration-150
          `}
          style={{
            background: isSent ? sentBg : receivedBg,
            color: isSent ? sentText : receivedText,
            borderRadius: isSent ? sentRadius : receivedRadius,
            fontFamily: "'Inter', sans-serif",
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {message.text}
        </div>
      </div>

      {/* Read receipt / Delivered */}
      {isLast && isSent && message.showReadReceipt && config.showReadReceipts && (
        <div className="flex justify-end mr-1 mb-1">
          <span
            className="text-[11px]"
            style={{ color: readReceiptColor, fontFamily: "'Inter', sans-serif" }}
          >
            Read
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
