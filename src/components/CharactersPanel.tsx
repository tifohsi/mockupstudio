import React, { useRef, useState } from 'react';
import { Character } from '../types';
import { CharacterStore } from '../utils/useCharacters';
import { AVATAR_COLORS, getInitials } from '../utils/helpers';
import { Plus, Trash2, ChevronDown, ChevronRight, Users } from 'lucide-react';

interface CharactersPanelProps {
  store: CharacterStore;
  onClose: () => void;
}

function CharacterRow({ char, store }: { char: Character; store: CharacterStore }) {
  const [open, setOpen] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => store.updateCharacter(char.id, { avatarPhotoUrl: ev.target?.result as string });
    r.readAsDataURL(f);
  }

  const initials = getInitials(char.name || '?');

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-2 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 p-2.5">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer relative group"
          style={{ background: char.avatarColor }}
          onClick={() => photoRef.current?.click()}
        >
          {char.avatarPhotoUrl
            ? <img src={char.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
            : <span className="text-white text-xs font-bold">{initials}</span>
          }
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">EDIT</span>
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

        {/* Name input */}
        <input
          type="text"
          value={char.name}
          onChange={e => store.updateCharacter(char.id, { name: e.target.value })}
          placeholder="Character name"
          className="flex-1 text-sm font-medium text-gray-800 bg-transparent outline-none placeholder-gray-400 min-w-0"
        />

        {/* Note badge */}
        {char.note && !open && (
          <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 hidden sm:block truncate max-w-[80px]">
            {char.note}
          </span>
        )}

        <button onClick={() => setOpen(x => !x)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
        <button onClick={() => store.deleteCharacter(char.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
          <Trash2 size={14} />
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 p-3 space-y-3">
          {/* Handle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-14 flex-shrink-0">Handle</span>
            <div className="flex items-center flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white">
              <span className="text-xs text-gray-400 px-2">@</span>
              <input
                type="text"
                value={char.handle}
                onChange={e => store.updateCharacter(char.id, { handle: e.target.value.replace(/^@/, '') })}
                placeholder="username"
                className="flex-1 text-xs outline-none py-1.5 pr-2 bg-transparent"
              />
            </div>
          </div>

          {/* Note */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-14 flex-shrink-0">Role</span>
            <input
              type="text"
              value={char.note}
              onChange={e => store.updateCharacter(char.id, { note: e.target.value })}
              placeholder="e.g. protagonist, villain…"
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 bg-white"
            />
          </div>

          {/* Avatar color */}
          {!char.avatarPhotoUrl ? (
            <div>
              <span className="text-xs text-gray-400 block mb-1.5">Avatar color</span>
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => store.updateCharacter(char.id, { avatarColor: c })}
                    className="w-6 h-6 rounded-full border-2 transition-all"
                    style={{
                      background: c,
                      borderColor: char.avatarColor === c ? '#007AFF' : 'transparent',
                      boxShadow: char.avatarColor === c ? '0 0 0 2px white, 0 0 0 3px #007AFF' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => store.updateCharacter(char.id, { avatarPhotoUrl: null })}
              className="text-xs text-red-400 hover:text-red-500 font-medium"
            >
              Remove photo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Small inline character picker (used inside editors) ───────────────────────
export function CharacterPicker({
  characters,
  onPick,
  label = 'Use character',
}: {
  characters: Character[];
  onPick: (char: Character) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  if (characters.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(x => !x)}
        className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-medium px-2.5 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        <Users size={12} />
        {label}
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          style={{ minWidth: '200px', maxWidth: '260px', maxHeight: '260px', overflowY: 'auto' }}>
          {characters.map(char => (
            <button
              key={char.id}
              onClick={() => { onPick(char); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50 transition-colors text-left"
            >
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-[10px] font-bold text-white"
                style={{ background: char.avatarColor }}
              >
                {char.avatarPhotoUrl
                  ? <img src={char.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
                  : getInitials(char.name || '?')
                }
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{char.name || 'Unnamed'}</div>
                {char.note && <div className="text-[10px] text-gray-400 truncate">{char.note}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
const CharactersPanel: React.FC<CharactersPanelProps> = ({ store, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-purple-500" />
          <h2 className="text-sm font-semibold text-gray-800">Saved Characters</h2>
          <span className="text-[11px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
            {store.characters.length}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
      </div>

      {/* Info blurb */}
      <div className="mx-3 mt-3 px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl">
        <p className="text-[11px] text-purple-700 leading-relaxed">
          Characters are saved to your browser and can be reused across iMessage, Twitter, and Instagram mockups. Click <strong>Use character</strong> inside any editor to apply one.
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 pt-2">
        {store.characters.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🎭</div>
            <p className="text-sm font-medium text-gray-500">No characters yet</p>
            <p className="text-xs mt-1">Add your cast below</p>
          </div>
        )}
        {store.characters.map(char => (
          <CharacterRow key={char.id} char={char} store={store} />
        ))}
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/80">
        <button
          onClick={() => store.addCharacter()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors"
        >
          <Plus size={15} /> New Character
        </button>
      </div>
    </div>
  );
};

export default CharactersPanel;
