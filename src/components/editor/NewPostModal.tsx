import React, { useState } from 'react';
import { Character } from '../../types';
import { getInitials, AVATAR_COLORS } from '../../utils/helpers';
import { X, UserPlus, Users, ChevronRight } from 'lucide-react';

interface NewPostModalProps {
  characters: Character[];
  platform: 'twitter' | 'instagram';
  onConfirm: (opts: { username: string; handle: string; avatarColor: string; avatarPhotoUrl: string | null }) => void;
  onClose: () => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ characters, platform, onConfirm, onClose }) => {
  const [mode, setMode] = useState<'pick' | 'manual'>(characters.length > 0 ? 'pick' : 'manual');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualHandle, setManualHandle] = useState('');
  const [manualColor, setManualColor] = useState(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);

  const selectedChar = characters.find(c => c.id === selectedCharId) ?? null;
  const isTwitter = platform === 'twitter';

  const canConfirm = mode === 'pick' ? !!selectedChar : manualName.trim().length > 0;

  function handleConfirm() {
    if (mode === 'pick' && selectedChar) {
      onConfirm({
        username: selectedChar.name,
        handle: selectedChar.handle || selectedChar.name.toLowerCase().replace(/\s+/g, ''),
        avatarColor: selectedChar.avatarColor,
        avatarPhotoUrl: selectedChar.avatarPhotoUrl,
      });
    } else {
      onConfirm({
        username: manualName.trim() || 'User',
        handle: manualHandle.trim() || manualName.trim().toLowerCase().replace(/\s+/g, '') || 'user',
        avatarColor: manualColor,
        avatarPhotoUrl: null,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">New Post</h2>
            <p className="text-xs text-gray-400 mt-0.5">Who is posting?</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        {/* Mode switcher */}
        {characters.length > 0 && (
          <div className="flex mx-5 mt-4 rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setMode('pick')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors ${mode === 'pick' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <Users size={13} /> Saved Characters
            </button>
            <button onClick={() => setMode('manual')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors ${mode === 'manual' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <UserPlus size={13} /> Manual
            </button>
          </div>
        )}

        <div className="px-5 py-4">
          {/* Character picker */}
          {mode === 'pick' && (
            <>
              <p className="text-xs text-gray-400 mb-3">Select a character to post as</p>
              <div className="grid grid-cols-4 gap-1 max-h-52 overflow-y-auto">
                {characters.map(char => {
                  const isSelected = selectedCharId === char.id;
                  return (
                    <button key={char.id} onClick={() => setSelectedCharId(isSelected ? null : char.id)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${isSelected ? 'bg-blue-50 ring-2 ring-blue-400' : 'hover:bg-gray-50'}`}>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold text-base"
                        style={{ background: char.avatarColor }}>
                        {char.avatarPhotoUrl ? <img src={char.avatarPhotoUrl} className="w-full h-full object-cover" alt="" /> : getInitials(char.name || '?')}
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 text-center leading-tight max-w-[56px] truncate">{char.name || 'Unnamed'}</span>
                      {char.note && <span className="text-[9px] text-gray-400 truncate max-w-[56px]">{char.note}</span>}
                    </button>
                  );
                })}
              </div>
              {selectedChar && (
                <div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ background: selectedChar.avatarColor }}>
                    {selectedChar.avatarPhotoUrl ? <img src={selectedChar.avatarPhotoUrl} className="w-full h-full object-cover" alt="" /> : getInitials(selectedChar.name)}
                  </div>
                  <span className="text-sm font-medium text-blue-700">{selectedChar.name}</span>
                  {selectedChar.handle && <span className="text-xs text-blue-400">@{selectedChar.handle}</span>}
                </div>
              )}
            </>
          )}

          {/* Manual entry */}
          {mode === 'manual' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Display name</label>
                <input type="text" value={manualName} onChange={e => setManualName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && canConfirm) handleConfirm(); }}
                  placeholder="e.g. Alex Rivera" autoFocus
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Handle</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50">
                  <span className="px-3 text-sm text-gray-400 select-none">@</span>
                  <input type="text" value={manualHandle} onChange={e => setManualHandle(e.target.value.replace(/^@/, ''))}
                    placeholder={manualName.toLowerCase().replace(/\s+/g, '') || 'username'}
                    className="flex-1 text-sm py-2.5 pr-3 outline-none bg-transparent" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Avatar color</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_COLORS.map(c => (
                    <button key={c} onClick={() => setManualColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: manualColor === c ? '#007AFF' : 'transparent', boxShadow: manualColor === c ? '0 0 0 2px white, 0 0 0 4px #007AFF' : 'none' }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={!canConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 ${isTwitter ? 'bg-black text-white hover:bg-gray-800' : 'text-white'}`}
            style={!isTwitter ? { background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' } : {}}>
            Create Post <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPostModal;
