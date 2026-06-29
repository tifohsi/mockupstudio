import React from 'react';
import { Conversation, IMessageConfig, Character } from '../../types';
import ConversationsList from './ConversationsList';
import ChatThread from './ChatThread';

interface IMessagePhoneProps {
  conversations: Conversation[];
  config: IMessageConfig;
  characters: Character[];
  onConfigChange: (updates: Partial<IMessageConfig>) => void;
}

const IMessagePhone: React.FC<IMessagePhoneProps> = ({ conversations, config, characters, onConfigChange }) => {
  const dark = config.iosTheme === 'dark';
  const screenBg = dark ? '#000000' : '#FFFFFF';

  const activeConv = config.activeConversationId
    ? conversations.find(c => c.id === config.activeConversationId) ?? null
    : null;

  function openConversation(id: string) { onConfigChange({ activeConversationId: id }); }
  function goBack() { onConfigChange({ activeConversationId: null }); }

  return (
    <div id="phone-export-target" style={{ position: 'relative', width: '393px', height: '852px', flexShrink: 0 }}>
      {/* Chassis */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '54px', overflow: 'hidden',
        background: dark ? '#1A1A1A' : '#E8E8E8',
        boxShadow: dark
          ? '0 0 0 1.5px #3A3A3A, 0 0 0 3px #2A2A2A, inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 120px rgba(0,0,0,0.7)'
          : '0 0 0 1.5px #C8C8C8, 0 0 0 3px #D8D8D8, inset 0 1px 0 rgba(255,255,255,0.8), 0 40px 120px rgba(0,0,0,0.25)',
      }}>
        {/* Screen */}
        <div style={{ position: 'absolute', inset: '3px', borderRadius: '52px', overflow: 'hidden', background: screenBg, display: 'flex', flexDirection: 'column' }}>
          {/* Content — animated slide */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {/* Conversations list */}
            <div style={{
              position: 'absolute', inset: 0,
              transform: activeConv ? 'translateX(-100%)' : 'translateX(0)',
              transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <ConversationsList conversations={conversations} config={config} characters={characters} onOpenConversation={openConversation} />
            </div>
            {/* Chat thread */}
            <div style={{
              position: 'absolute', inset: 0,
              transform: activeConv ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              {activeConv && <ChatThread conversation={activeConv} config={config} characters={characters} onBack={goBack} />}
            </div>
          </div>
        </div>
        {/* Shine */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '54px', background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
      </div>
      {/* Side buttons */}
      {[{top:'116px',left:'-3px'},{top:'160px',left:'-3px'},{top:'206px',left:'-3px'}].map((s,i) => (
        <div key={i} style={{ position:'absolute', left:s.left, top:s.top, width:'3px', height:'36px', borderRadius:'2px 0 0 2px', background: dark?'#2A2A2A':'#C0C0C0' }}/>
      ))}
      <div style={{ position:'absolute', right:'-3px', top:'176px', width:'3px', height:'72px', borderRadius:'0 2px 2px 0', background: dark?'#2A2A2A':'#C0C0C0' }}/>
    </div>
  );
};

export default IMessagePhone;
