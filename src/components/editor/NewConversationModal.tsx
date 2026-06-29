import React, { useState } from 'react';
import { Character } from '../../types';
import { AVATAR_COLORS, getInitials } from '../../utils/helpers';
import { X, Users, UserPlus, ChevronRight } from 'lucide-react';

interface NewDirectModalProps {
  characters: Character[];
  onConfirm: (opts: { name: string; avatarColor: string; avatarPhotoUrl: string | null; characterId?: string }) => void;
  onClose: () => void;
}

interface NewGroupModalProps {
  characters: Character[];
  onConfirm: (opts: { groupName: string; participants: string[] }) => void;
  onClose: () => void;
}

// ── Shared backdrop ───────────────────────────────────────────────────────────
function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

// ── Avatar swatch ─────────────────────────────────────────────────────────────
function CharacterSwatch({ char, selected, onClick }: { char: Character; selected: boolean; onClick: () => void }) {
  const initials = getInitials(char.name || '?');
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${selected ? 'bg-blue-50 ring-2 ring-blue-400' : 'hover:bg-gray-50'}`}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden text-white font-semibold text-base relative"
        style={{ background: char.avatarColor }}
      >
        {char.avatarPhotoUrl
          ? <img src={char.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
          : initials
        }
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-blue-500/20">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
      </div>
      <span className="text-[11px] font-medium text-gray-700 text-center leading-tight max-w-[56px] truncate">{char.name || 'Unnamed'}</span>
      {char.note && <span className="text-[9px] text-gray-400 truncate max-w-[56px]">{char.note}</span>}
    </button>
  );
}

// ── New Direct Conversation Modal ─────────────────────────────────────────────
export function NewDirectModal({ characters, onConfirm, onClose }: NewDirectModalProps) {
  const [mode, setMode] = useState<'pick' | 'manual'>(characters.length > 0 ? 'pick' : 'manual');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualColor, setManualColor] = useState(AVATAR_COLORS[0]);

  const selectedChar = characters.find(c => c.id === selectedCharId) ?? null;

  function handleConfirm() {
    if (mode === 'pick' && selectedChar) {
      onConfirm({
        name: selectedChar.name,
        avatarColor: selectedChar.avatarColor,
        avatarPhotoUrl: selectedChar.avatarPhotoUrl,
        characterId: selectedChar.id,
      });
    } else {
      onConfirm({
        name: manualName.trim() || 'Unknown',
        avatarColor: manualColor,
        avatarPhotoUrl: null,
      });
    }
  }

  const canConfirm = mode === 'pick' ? !!selectedChar : manualName.trim().length > 0;

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">New Message</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Mode switcher (only show if there are characters) */}
        {characters.length > 0 && (
          <div className="flex mx-5 mt-4 rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setMode('pick')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors ${mode === 'pick' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={13} /> Saved Characters
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors ${mode === 'manual' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <UserPlus size={13} /> Manual
            </button>
          </div>
        )}

        <div className="px-5 py-4">
          {/* Character picker grid */}
          {mode === 'pick' && (
            <>
              <p className="text-xs text-gray-400 mb-3">Who are you messaging?</p>
              <div className="grid grid-cols-4 gap-1 max-h-52 overflow-y-auto">
                {characters.map(char => (
                  <CharacterSwatch
                    key={char.id}
                    char={char}
                    selected={selectedCharId === char.id}
                    onClick={() => setSelectedCharId(prev => prev === char.id ? null : char.id)}
                  />
                ))}
              </div>
              {selectedChar && (
                <div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ background: selectedChar.avatarColor }}>
                    {selectedChar.avatarPhotoUrl ? <img src={selectedChar.avatarPhotoUrl} className="w-full h-full object-cover" alt="" /> : getInitials(selectedChar.name)}
                  </div>
                  <span className="text-sm font-medium text-blue-700">{selectedChar.name}</span>
                  {selectedChar.note && <span className="text-xs text-blue-400">· {selectedChar.note}</span>}
                </div>
              )}
            </>
          )}

          {/* Manual entry */}
          {mode === 'manual' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Contact name</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && canConfirm) handleConfirm(); }}
                  placeholder="e.g. Jamie"
                  autoFocus
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Avatar color</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setManualColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: manualColor === c ? '#007AFF' : 'transparent', boxShadow: manualColor === c ? '0 0 0 2px white, 0 0 0 4px #007AFF' : 'none' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
          >
            Start Chat <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ── New Group Conversation Modal ──────────────────────────────────────────────
export function NewGroupModal({ characters, onConfirm, onClose }: NewGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleConfirm() {
    onConfirm({ groupName: groupName.trim(), participants: selected });
  }

  const canConfirm = selected.length >= 1;

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">New Group Chat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Group name */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Group name <span className="text-gray-300">(optional)</span></label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="e.g. The Squad"
              autoFocus
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          {/* Participant picker */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-2">
              Participants
              {selected.length > 0 && <span className="ml-1.5 text-indigo-500">{selected.length} selected</span>}
            </label>

            {characters.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-sm text-gray-400">No saved characters yet.</p>
                <p className="text-xs text-gray-400 mt-1">Add some in the Characters panel first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1 max-h-44 overflow-y-auto">
                {characters.map(char => (
                  <CharacterSwatch
                    key={char.id}
                    char={char}
                    selected={selected.includes(char.id)}
                    onClick={() => toggle(char.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map(id => {
                const char = characters.find(c => c.id === id);
                if (!char) return null;
                return (
                  <span key={id} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: char.avatarColor }} />
                    {char.name}
                    <button onClick={() => toggle(id)} className="text-indigo-400 hover:text-indigo-600 ml-0.5">×</button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
          >
            Create Group <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </Backdrop>
  );
}
