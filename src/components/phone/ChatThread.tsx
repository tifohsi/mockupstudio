import React, { useRef, useEffect } from 'react';
import { Conversation, IMessageConfig, Character } from '../../types';
import { getInitials } from '../../utils/helpers';
import StatusBar from './StatusBar';

interface ChatThreadProps {
  conversation: Conversation;
  config: IMessageConfig;
  characters: Character[];
  onBack: () => void;
}

function TypingDots({ dark }: { dark: boolean }) {
  const bg = dark ? '#3A3A3C' : '#E5E5EA';
  const dot = dark ? '#8E8E93' : '#8E8E93';
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: '4px', marginBottom: '4px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: dark ? '#555' : '#D1D1D6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: bg, borderRadius: '18px 18px 18px 4px', padding: '10px 14px', minHeight: '36px' }}>
        {[0, 200, 400].map((delay) => (
          <div key={delay} className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: dot, animationDelay: `${delay}ms` }} />
        ))}
      </div>
    </div>
  );
}

// Header avatar — single contact or group cluster
function HeaderAvatar({ conversation, characters }: { conversation: Conversation; characters: Character[] }) {
  if (!conversation.isGroup) {
    const initials = getInitials(conversation.name);
    return (
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: conversation.avatarColor, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
        {conversation.avatarPhotoUrl
          ? <img src={conversation.avatarPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : <span style={{ color: 'white', fontWeight: 600, fontSize: '18px' }}>{initials}</span>
        }
      </div>
    );
  }
  // Group with custom photo
  if (conversation.avatarPhotoUrl) {
    return (
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', marginBottom: '4px' }}>
        <img src={conversation.avatarPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
      </div>
    );
  }
  const resolved = conversation.participants.slice(0, 4).map(id => characters.find(c => c.id === id)).filter(Boolean) as Character[];
  if (resolved.length === 0) {
    return (
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#8E8E93', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
      </div>
    );
  }
  return (
    <div style={{ width: '48px', height: '48px', position: 'relative', marginBottom: '4px' }}>
      {resolved.slice(0, 2).map((char, i) => (
        <div key={char.id} style={{
          position: 'absolute', width: '30px', height: '30px', borderRadius: '50%',
          background: char.avatarColor, border: '2px solid white', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          right: i === 0 ? 0 : undefined, bottom: i === 0 ? 0 : undefined,
          left: i === 1 ? 0 : undefined, top: i === 1 ? 0 : undefined,
          zIndex: i === 0 ? 2 : 1,
        }}>
          {char.avatarPhotoUrl
            ? <img src={char.avatarPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            : <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>{getInitials(char.name)}</span>
          }
        </div>
      ))}
    </div>
  );
}

const ChatThread: React.FC<ChatThreadProps> = ({ conversation, config, characters, onBack }) => {
  const dark = config.iosTheme === 'dark';
  const bg = dark ? '#000000' : '#FFFFFF';
  const chatBg = dark ? '#000000' : '#FFFFFF';
  const textPrimary = dark ? '#FFFFFF' : '#000000';
  const textSecondary = dark ? '#8E8E93' : '#8E8E93';
  const headerBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
  const inputBorder = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)';
  const barBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
  const chevron = dark ? '#0A84FF' : '#007AFF';
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [conversation.id, conversation.messages.length]);

  const participantChars = conversation.participants.map(id => characters.find(c => c.id === id)).filter(Boolean) as Character[];
  const headerTitle = conversation.isGroup
    ? (conversation.groupName || (participantChars.length > 0 ? participantChars.map(c => c.name.split(' ')[0]).join(', ') : 'Group Chat'))
    : conversation.name;
  const headerSubtitle = conversation.isGroup && conversation.groupName && participantChars.length > 0
    ? participantChars.map(c => c.name.split(' ')[0]).join(', ')
    : null;

  function findSenderChar(characterId?: string): Character | undefined {
    if (!characterId) return undefined;
    return characters.find(c => c.id === characterId);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg, fontFamily: "'Inter', sans-serif" }}>
      <StatusBar time={config.statusBarTime} batteryLevel={config.batteryLevel}
        signalBars={config.signalBars} wifiConnected={config.wifiConnected} dark={dark} />

      {/* Contact / group header */}
      <div style={{ padding: '4px 8px 10px', borderBottom: `0.5px solid ${headerBorder}`, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '8px', top: '4px', display: 'flex', alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', color: chevron, padding: '4px 0' }}>
            <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
              <path d="M8.5 1L1.5 8.5L8.5 16" stroke={chevron} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '17px', color: chevron, marginLeft: '2px' }}>{conversation.messages.length}</span>
          </button>
        </div>

        <HeaderAvatar conversation={conversation} characters={characters} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {headerTitle}
            </span>
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
              <path d="M1 1l5 4.5L1 10" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          {headerSubtitle && (
            <span style={{ fontSize: '10px', color: textSecondary, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {headerSubtitle}
            </span>
          )}
        </div>



      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 8px', background: chatBg }}>
        {conversation.messages.map((msg, idx) => {
          const isSent = msg.type === 'sent';
          const prevMsg = conversation.messages[idx - 1];
          const nextMsg = conversation.messages[idx + 1];
          const sameTypeAsNext = nextMsg?.type === msg.type && nextMsg?.characterId === msg.characterId;
          const sameTypeAsPrev = prevMsg?.type === msg.type && prevMsg?.characterId === msg.characterId;
          const isLast = idx === conversation.messages.length - 1;
          const showTail = !sameTypeAsNext;
          const sender = findSenderChar(msg.characterId);
          const showSenderLabel = conversation.isGroup && !isSent && !sameTypeAsPrev && sender;
          const showSenderAvatar = conversation.isGroup && !isSent && showTail;

          return (
            <div key={msg.id}>
              {msg.showTimestamp && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 6px' }}>
                  <span style={{ fontSize: '11px', color: textSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{msg.timestamp}</span>
                </div>
              )}

              {showSenderLabel && (
                <div style={{ fontSize: '11px', color: textSecondary, fontWeight: 500, marginLeft: conversation.isGroup ? '34px' : 0, marginBottom: '2px', marginTop: '4px' }}>
                  {sender!.name}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '6px', marginBottom: sameTypeAsNext ? '3px' : '8px' }}>
                {/* Sender avatar bubble for group messages */}
                {conversation.isGroup && !isSent && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: sender?.avatarColor ?? '#8E8E93', display: 'flex', alignItems: 'center', justifyContent: 'center', visibility: showSenderAvatar ? 'visible' : 'hidden' }}>
                    {sender?.avatarPhotoUrl
                      ? <img src={sender.avatarPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      : <span style={{ color: 'white', fontSize: '9px', fontWeight: 700 }}>{getInitials(sender?.name ?? '?')}</span>
                    }
                  </div>
                )}
                <div style={{
                  display: 'inline-block',
                  maxWidth: '72%',
                  padding: '8px 12px',
                  background: isSent ? '#007AFF' : (dark ? '#3A3A3C' : '#E5E5EA'),
                  color: isSent ? '#FFFFFF' : textPrimary,
                  fontSize: '15px', lineHeight: 1.35,
                  borderRadius: isSent
                    ? (showTail ? '18px 18px 4px 18px' : '18px')
                    : (showTail ? '18px 18px 18px 4px' : '18px'),
                  wordBreak: 'break-word', whiteSpace: 'pre-wrap',
                  width: 'fit-content',
                }}>
                  {msg.text}
                </div>
              </div>
              {isLast && isSent && msg.showReadReceipt && config.showReadReceipts && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '4px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: textSecondary }}>Read</span>
                </div>
              )}
            </div>
          );
        })}
        {config.showTypingIndicator && <TypingDots dark={dark} />}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: bg, borderTop: `0.5px solid ${barBorder}` }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke={chevron} strokeWidth="1.5"/>
            <path d="M9 14h10M14 9v10" stroke={chevron} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div style={{ flex: 1, background: bg, border: `1px solid ${inputBorder}`, borderRadius: '20px', padding: '7px 12px', minHeight: '34px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '15px', color: textSecondary }}>iMessage</span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke={chevron} strokeWidth="1.5"/>
            <rect x="11" y="8" width="6" height="9" rx="3" stroke={chevron} strokeWidth="1.5"/>
            <path d="M9 15.5C9 18.26 11.24 20.5 14 20.5C16.76 20.5 19 18.26 19 15.5" stroke={chevron} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14 20.5V23" stroke={chevron} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Home indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 8px', background: bg }}>
        <div style={{ width: '134px', height: '5px', borderRadius: '3px', background: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  );
};

export default ChatThread;
