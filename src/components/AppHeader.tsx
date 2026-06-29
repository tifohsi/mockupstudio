import React, { useState } from 'react';
import { Download, Loader2, Smartphone, Users } from 'lucide-react';
import { exportAsImage } from '../utils/exportImage';
import { GeneratorMode } from '../types';

interface AppHeaderProps {
  mode: GeneratorMode;
  onModeChange: (mode: GeneratorMode) => void;
  appDark: boolean;
  onToggleAppDark: () => void;
  onToggleCharacters: () => void;
  charactersOpen: boolean;
  characterCount: number;
}

const MODES: { id: GeneratorMode; label: string; icon: string }[] = [
  { id: 'imessage',  label: 'iMessage',  icon: '💬' },
  { id: 'twitter',   label: 'X / Twitter', icon: '𝕏' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
];

const EXPORT_IDS: Record<GeneratorMode, string> = {
  imessage:  'phone-export-target',
  twitter:   'twitter-export-target',
  instagram: 'instagram-export-target',
};

const AppHeader: React.FC<AppHeaderProps> = ({
  mode, onModeChange, appDark, onToggleAppDark, onToggleCharacters, charactersOpen, characterCount,
}) => {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try { await exportAsImage(EXPORT_IDS[mode], `${mode}-mockup.png`); }
    finally { setExporting(false); }
  }

  return (
    <header className={`flex items-center justify-between px-5 py-2.5 border-b gap-4 ${appDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
      style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
      {/* Brand */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <Smartphone size={16} className="text-white"/>
        </div>
        <span className={`text-base font-semibold hidden sm:block ${appDark ? 'text-white' : 'text-gray-900'}`}>Mockup Studio</span>
      </div>

      {/* Mode tabs */}
      <nav className={`flex rounded-xl border overflow-hidden ${appDark ? 'border-gray-700' : 'border-gray-200'}`}>
        {MODES.map(({ id, label, icon }) => (
          <button key={id} onClick={() => onModeChange(id)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap touch-manipulation ${
              mode===id && !charactersOpen ? 'bg-blue-500 text-white'
                : appDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}>
            <span className="text-base leading-none">{icon}</span>
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Characters toggle */}
        <button onClick={onToggleCharacters}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors relative ${
            charactersOpen
              ? 'bg-purple-500 text-white'
              : appDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Saved Characters">
          <Users size={15}/>
          <span className="hidden lg:inline">Characters</span>
          {characterCount > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${charactersOpen ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-600'}`}>
              {characterCount}
            </span>
          )}
        </button>

        <button onClick={onToggleAppDark}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-colors ${appDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
          {appDark ? '☀️' : '🌙'}
        </button>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm">
          {exporting ? <Loader2 size={15} className="animate-spin"/> : <Download size={15}/>}
          <span className="hidden sm:inline">{exporting ? 'Exporting…' : 'Export PNG'}</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
