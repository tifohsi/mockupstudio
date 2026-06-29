import React from 'react';
import { Conversation, IMessageConfig, Character } from '../../types';
import { getInitials } from '../../utils/helpers';
import StatusBar from './StatusBar';

interface ConversationsListProps {
  conversations: Conversation[];
  config: IMessageConfig;
  characters: Character[];
  onOpenConversation: (id: string) => void;
}

function Avatar({ conv, size = 52 }: { conv: Conversation; size?: number }) {
  const initials = getInitials(conv.name);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: conv.avatarColor, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {conv.avatarPhotoUrl
        ? <img src={conv.avatarPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        : <span style={{ color: 'white', fontWeight: 600, fontSize: size * 0.36, fontFamily: "'Inter', sans-serif" }}>{initials}</span>
      }
    </div>
  );
}

function GroupAvatarThumb({ conv, characters, size = 52, bg }: { conv: Conversation; characters: Character[]; size?: number; bg: string }) {
  // Custom uploaded group photo takes priority
  if (conv.avatarPhotoUrl) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden' }}>
        <img src={conv.avatarPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
      </div>
    );
  }
  const resolved = conv.participants.slice(0, 4).map(id => characters.find(c => c.id === id)).filter(Boolean) as Character[];
  if (resolved.length === 0) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: '#8E8E93', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
      </div>
    );
  }
  const mini = Math.round(size * 0.62);
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {resolved.slice(0, 2).map((char, i) => (
        <div key={char.id} style={{
          position: 'absolute',
          width: mini, height: mini, borderRadius: '50%',
          background: char.avatarColor,
          border: `2px solid ${bg}`,
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          right: i === 0 ? 0 : undefined, bottom: i === 0 ? 0 : undefined,
          left: i === 1 ? 0 : undefined, top: i === 1 ? 0 : undefined,
          zIndex: i === 0 ? 2 : 1,
        }}>
          {char.avatarPhotoUrl
            ? <img src={char.avatarPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            : <span style={{ color: 'white', fontSize: mini * 0.34, fontWeight: 700 }}>{getInitials(char.name)}</span>
          }
        </div>
      ))}
    </div>
  );
}

const ConversationsList: React.FC<ConversationsListProps> = ({ conversations, config, characters, onOpenConversation }) => {
  const dark = config.iosTheme === 'dark';
  const bg = dark ? '#000000' : '#FFFFFF';
  const textPrimary = dark ? '#FFFFFF' : '#000000';
  const textSecondary = dark ? '#8E8E93' : '#8E8E93';
  const divider = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const searchBg = dark ? '#1C1C1E' : '#F2F2F7';
  const searchText = dark ? '#8E8E93' : '#8E8E93';
  const headerBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';

  const pinned = conversations.filter(c => c.pinned);
  const unpinned = conversations.filter(c => !c.pinned);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Status bar */}
      <StatusBar time={config.statusBarTime} batteryLevel={config.batteryLevel}
        signalBars={config.signalBars} wifiConnected={config.wifiConnected} dark={dark} />

      {/* Top spacer */}
      <div style={{ height: '4px' }} />

      {/* Header */}
      <div style={{ padding: '0 16px 8px', borderBottom: `0.5px solid ${headerBorder}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
          <span style={{ fontSize: '28px', fontWeight: 700, color: textPrimary, letterSpacing: '-0.04em' }}>Messages</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke={dark ? '#0A84FF' : '#007AFF'} strokeWidth="2"/>
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={dark ? '#0A84FF' : '#007AFF'} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke={dark ? '#0A84FF' : '#007AFF'} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        {/* Search bar */}
        <div style={{ background: searchBg, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={searchText} strokeWidth="2"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={searchText} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: '15px', color: searchText }}>Search</span>
        </div>
      </div>

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Pinned row */}
        {pinned.length > 0 && (
          <div style={{ padding: '16px 16px 8px', display: 'flex', gap: '16px', justifyContent: pinned.length <= 3 ? 'flex-start' : 'space-between', flexWrap: 'wrap' }}>
            {pinned.map((conv) => (
              <button key={conv.id} onClick={() => onOpenConversation(conv.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '72px', padding: 0 }}>
                <div style={{ position: 'relative' }}>
                  {conv.isGroup ? <GroupAvatarThumb conv={conv} characters={characters} size={56} bg={bg} /> : <Avatar conv={conv} size={56} />}
                  {conv.unreadCount > 0 && (
                    <div style={{
                      position: 'absolute', top: -2, right: -2,
                      background: '#007AFF', borderRadius: '50%',
                      minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `2px solid ${bg}`,
                    }}>
                      <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>{conv.unreadCount}</span>
                    </div>
                  )}
                  {/* Pin icon */}
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    background: dark ? '#3A3A3C' : '#E5E5EA', borderRadius: '50%',
                    width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${bg}`,
                  }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill={textSecondary}>
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                    </svg>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: textPrimary, fontWeight: 500, textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.isGroup ? (conv.groupName || 'Group') : conv.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Regular conversations */}
        {unpinned.map((conv, i) => (
          <button key={conv.id} onClick={() => onOpenConversation(conv.id)}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
            <div style={{
              display: 'flex', gap: '12px', alignItems: 'center',
              padding: '10px 16px',
              borderBottom: i < unpinned.length - 1 ? `0.5px solid ${divider}` : 'none',
            }}>
              {conv.isGroup ? <GroupAvatarThumb conv={conv} characters={characters} size={52} bg={bg} /> : <Avatar conv={conv} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '15px', fontWeight: conv.unreadCount > 0 ? 600 : 400, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                    {conv.isGroup ? (conv.groupName || 'Group Chat') : conv.name}
                  </span>
                  <span style={{ fontSize: '13px', color: textSecondary, flexShrink: 0, marginLeft: '4px' }}>{conv.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {conv.previewText}
                  </span>
                  {conv.unreadCount > 0 && (
                    <div style={{ background: '#007AFF', borderRadius: '50%', minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '8px' }}>
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>{conv.unreadCount}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Chevron */}
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" style={{ flexShrink: 0 }}>
                <path d="M1 1l6 5.5L1 12" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationsList;
