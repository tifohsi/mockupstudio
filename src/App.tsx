import React, { useState } from 'react';
import { Conversation, IMessageConfig, TwitterFeedConfig, InstagramFeedConfig, GeneratorMode } from './types';
import { defaultConversations, defaultIMessageConfig } from './data/sampleData';
import { defaultTwitterFeed, defaultInstagramFeed } from './data/sampleSocialData';
import { useCharacters } from './utils/useCharacters';
import { usePersistentState } from './utils/usePersistentState';

const DATA_VERSION = 'v4-persist-all';
const VERSION_KEY = 'mockup-studio-data-version';

function migrateIfNeeded() {
  try {
    if (localStorage.getItem(VERSION_KEY) !== DATA_VERSION) {
      ['mockup-studio-conversations','mockup-studio-imessage-config','mockup-studio-twitter-config','mockup-studio-instagram-config','mockup-studio-mode']
        .forEach(k => localStorage.removeItem(k));
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
    }
  } catch { /* ignore */ }
}
migrateIfNeeded();

import AppHeader from './components/AppHeader';
import CharactersPanel from './components/CharactersPanel';
import IMessageEditor from './components/editor/IMessageEditor';
import IMessagePhone from './components/phone/IMessagePhone';
import TwitterEditor from './components/editor/TwitterEditor';
import TwitterFeed from './components/feed/TwitterFeed';
import InstagramEditor from './components/editor/InstagramEditor';
import InstagramFeed from './components/feed/InstagramFeed';

// Mobile bottom tab panel choices
type MobilePanel = 'editor' | 'preview';

const App: React.FC = () => {
  const [mode, setMode] = usePersistentState<GeneratorMode>('mockup-studio-mode', 'imessage');
  const [appDark, setAppDark] = usePersistentState<boolean>('mockup-studio-app-dark', false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('editor');

  const characterStore = useCharacters();
  const [conversations, setConversations] = usePersistentState<Conversation[]>('mockup-studio-conversations', defaultConversations);
  const [iMsgConfig, setIMsgConfig] = usePersistentState<IMessageConfig>('mockup-studio-imessage-config', defaultIMessageConfig);
  const [twitterConfig, setTwitterConfig] = usePersistentState<TwitterFeedConfig>('mockup-studio-twitter-config', defaultTwitterFeed);
  const [instagramConfig, setInstagramConfig] = usePersistentState<InstagramFeedConfig>('mockup-studio-instagram-config', defaultInstagramFeed);

  const appBg = appDark ? 'bg-gray-900' : 'bg-gray-100';
  const dotColor = appDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';

  // Shared editor panel content
  const editorContent = showCharacters ? (
    <CharactersPanel store={characterStore} onClose={() => setShowCharacters(false)} />
  ) : (
    <>
      {mode === 'imessage' && (
        <IMessageEditor conversations={conversations} config={iMsgConfig}
          onConversationsChange={setConversations}
          onConfigChange={u => setIMsgConfig(c => ({ ...c, ...u }))}
          characterStore={characterStore} />
      )}
      {mode === 'twitter' && (
        <TwitterEditor config={twitterConfig} onChange={u => setTwitterConfig(c => ({ ...c, ...u }))}
          characters={characterStore.characters} />
      )}
      {mode === 'instagram' && (
        <InstagramEditor config={instagramConfig} onChange={u => setInstagramConfig(c => ({ ...c, ...u }))}
          characters={characterStore.characters} />
      )}
    </>
  );

  // Shared preview content
  const previewContent = (
    <div className="relative flex flex-col items-center w-full">
      {mode === 'imessage' && (
        <IMessagePhone conversations={conversations} config={iMsgConfig}
          characters={characterStore.characters}
          onConfigChange={u => setIMsgConfig(c => ({ ...c, ...u }))} />
      )}
      {mode === 'twitter' && <TwitterFeed config={twitterConfig} />}
      {mode === 'instagram' && <InstagramFeed config={instagramConfig} />}
      <div className={`mt-5 px-4 py-2 rounded-full text-[11px] font-medium ${appDark ? 'bg-gray-800 text-gray-400' : 'bg-white/80 text-gray-400 shadow-sm border border-gray-200'}`}>
        ⚠️ Fictional mockup — not real
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader
        mode={mode}
        onModeChange={m => { setMode(m); setIMsgConfig(c => ({ ...c, activeConversationId: null })); setShowCharacters(false); }}
        appDark={appDark}
        onToggleAppDark={() => setAppDark(d => !d)}
        onToggleCharacters={() => setShowCharacters(s => !s)}
        charactersOpen={showCharacters}
        characterCount={characterStore.characters.length}
      />

      {/* ── DESKTOP layout (md+): side-by-side ── */}
      <div className={`hidden md:flex flex-1 overflow-hidden ${appBg}`}>
        {/* Editor */}
        <div className="flex flex-col overflow-hidden flex-shrink-0" style={{ width: '360px' }}>
          {editorContent}
        </div>
        {/* Preview */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto py-8 px-6 relative">
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
          <div style={{ transform: 'scale(var(--phone-scale,1))', transformOrigin: 'top center' }}>
            {previewContent}
          </div>
        </div>
      </div>

      {/* ── MOBILE layout (<md): stacked with bottom tabs ── */}
      <div className={`flex md:hidden flex-1 flex-col overflow-hidden ${appBg}`}>
        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          {mobilePanel === 'editor' ? (
            <div className="h-full overflow-hidden">
              {editorContent}
            </div>
          ) : (
            <div className="h-full overflow-auto flex flex-col items-center py-6 px-4 relative">
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
              <div style={{ transform: 'scale(var(--mobile-phone-scale, 0.82))', transformOrigin: 'top center' }}>
                {previewContent}
              </div>
            </div>
          )}
        </div>

        {/* Mobile bottom tab bar */}
        <div className={`flex border-t flex-shrink-0 ${appDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <button
            onClick={() => setMobilePanel('editor')}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              mobilePanel === 'editor'
                ? 'text-blue-500'
                : appDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/>
            </svg>
            Edit
          </button>
          <button
            onClick={() => setMobilePanel('preview')}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              mobilePanel === 'preview'
                ? 'text-blue-500'
                : appDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <path d="M12 18h.01"/>
            </svg>
            Preview
          </button>
        </div>
      </div>

      <style>{`
        /* Desktop scaling by viewport height */
        @media (min-width: 768px) and (max-height: 950px) { :root { --phone-scale: 0.88; } }
        @media (min-width: 768px) and (max-height: 820px) { :root { --phone-scale: 0.76; } }
        @media (min-width: 768px) and (max-height: 700px) { :root { --phone-scale: 0.64; } }

        /* Mobile phone preview scale by viewport width */
        @media (max-width: 767px) and (min-width: 430px) { :root { --mobile-phone-scale: 0.84; } }
        @media (max-width: 429px) and (min-width: 390px) { :root { --mobile-phone-scale: 0.76; } }
        @media (max-width: 389px) { :root { --mobile-phone-scale: 0.66; } }
      `}</style>
    </div>
  );
};

export default App;
