import React, { useRef, useEffect } from 'react';
import { Message, ConversationConfig } from '../../types';
import StatusBar from './StatusBar';
import ContactHeader from './ContactHeader';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import MessageInputBar from './MessageInputBar';

interface PhonePreviewProps {
  messages: Message[];
  config: ConversationConfig;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ messages, config }) => {
  const dark = config.iosTheme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, config.showTypingIndicator]);

  const screenBg = dark ? '#000000' : '#FFFFFF';
  const chatBg = dark ? '#000000' : '#FFFFFF';

  return (
    /* Outer phone frame wrapper — this is what gets exported */
    <div
      id="phone-export-target"
      className="relative select-none"
      style={{
        width: '393px',
        height: '852px',
        flexShrink: 0,
      }}
    >
      {/* Phone chassis */}
      <div
        className="absolute inset-0 rounded-[54px] overflow-hidden"
        style={{
          background: dark ? '#1A1A1A' : '#E8E8E8',
          boxShadow: dark
            ? '0 0 0 1.5px #3A3A3A, 0 0 0 3px #2A2A2A, inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 120px rgba(0,0,0,0.7), 0 8px 32px rgba(0,0,0,0.5)'
            : '0 0 0 1.5px #C8C8C8, 0 0 0 3px #D8D8D8, inset 0 1px 0 rgba(255,255,255,0.8), 0 40px 120px rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        {/* Screen area */}
        <div
          className="absolute rounded-[52px] overflow-hidden flex flex-col"
          style={{
            inset: '3px',
            background: screenBg,
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
            <div
              className="rounded-full"
              style={{
                width: '126px',
                height: '37px',
                background: '#000000',
                boxShadow: '0 0 0 2px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Status Bar */}
          <StatusBar config={config} />

          {/* Contact Header */}
          <ContactHeader config={config} />

          {/* Messages scroll area */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{
              background: chatBg,
              padding: '4px 12px 8px 12px',
            }}
          >
            {messages.map((message, index) => {
              const nextMsg = messages[index + 1];
              const isLast = index === messages.length - 1;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  config={config}
                  isLast={isLast}
                  nextMessageType={nextMsg?.type ?? null}
                />
              );
            })}

            {/* Typing indicator */}
            {config.showTypingIndicator && (
              <TypingIndicator dark={dark} />
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <MessageInputBar dark={dark} />

          {/* Home indicator */}
          <div
            className="flex justify-center pb-2 pt-1"
            style={{ background: screenBg }}
          >
            <div
              className="rounded-full"
              style={{
                width: '134px',
                height: '5px',
                background: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>

        {/* Phone frame shine overlay */}
        <div
          className="absolute inset-0 rounded-[54px] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Side buttons - volume up */}
      <div
        className="absolute rounded-l-sm"
        style={{
          left: '-3px',
          top: '160px',
          width: '3px',
          height: '36px',
          background: dark ? '#2A2A2A' : '#C0C0C0',
          boxShadow: dark ? '-1px 0 0 #1A1A1A' : '-1px 0 0 #B0B0B0',
        }}
      />
      {/* Side buttons - volume down */}
      <div
        className="absolute rounded-l-sm"
        style={{
          left: '-3px',
          top: '206px',
          width: '3px',
          height: '36px',
          background: dark ? '#2A2A2A' : '#C0C0C0',
          boxShadow: dark ? '-1px 0 0 #1A1A1A' : '-1px 0 0 #B0B0B0',
        }}
      />
      {/* Side buttons - mute */}
      <div
        className="absolute rounded-l-sm"
        style={{
          left: '-3px',
          top: '116px',
          width: '3px',
          height: '36px',
          background: dark ? '#2A2A2A' : '#C0C0C0',
          boxShadow: dark ? '-1px 0 0 #1A1A1A' : '-1px 0 0 #B0B0B0',
        }}
      />
      {/* Power button */}
      <div
        className="absolute rounded-r-sm"
        style={{
          right: '-3px',
          top: '176px',
          width: '3px',
          height: '72px',
          background: dark ? '#2A2A2A' : '#C0C0C0',
          boxShadow: dark ? '1px 0 0 #1A1A1A' : '1px 0 0 #B0B0B0',
        }}
      />
    </div>
  );
};

export default PhonePreview;
