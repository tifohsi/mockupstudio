import React, { useRef, useState } from 'react';
import { Conversation, IMessageConfig, Message, Character } from '../../types';
import { generateId, getInitials, AVATAR_COLORS, getCurrentTime } from '../../utils/helpers';
import { CharacterStore } from '../../utils/useCharacters';
import { CharacterPicker } from '../CharactersPanel';
import { NewDirectModal, NewGroupModal } from './NewConversationModal';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight, MessageSquare, Settings, Users } from 'lucide-react';

// ── Group avatar cluster (3 overlapping circles) ──────────────────────────────
function GroupAvatar({ participants, characters, size = 36 }: { participants: string[]; characters: Character[]; size?: number }) {
  const resolved = participants.slice(0, 4).map(id => characters.find(c => c.id === id)).filter(Boolean) as Character[];
  if (resolved.length === 0) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: '#8E8E93', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Users size={size * 0.45} color="white" />
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
          border: '2px solid white',
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

// ── Sortable message row ──────────────────────────────────────────────────────
function SortableMessageRow({ msg, onUpdate, onDelete, isGroup, characters }: {
  msg: Message;
  onUpdate: (id: string, u: Partial<Message>) => void;
  onDelete: (id: string) => void;
  isGroup: boolean;
  characters: Character[];
}) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: msg.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const isSent = msg.type === 'sent';
  const sender = characters.find(c => c.id === msg.characterId);

  return (
    <div ref={setNodeRef} style={style}
      className={`bg-white border border-gray-200 rounded-xl mb-2 ${isDragging ? 'shadow-2xl' : 'shadow-sm'}`}>
      <div className="flex items-center gap-2 p-2.5">
        <button className="opacity-30 hover:opacity-60 cursor-grab active:cursor-grabbing text-gray-400 flex-shrink-0"
          {...attributes} {...listeners}><GripVertical size={16} /></button>

        {/* Sent/Received toggle */}
        <button
          onClick={() => onUpdate(msg.id, { type: isSent ? 'received' : 'sent', characterId: isSent ? msg.characterId : undefined })}
          className={`flex-shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full transition-colors ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
          {isSent ? 'You' : 'Them'}
        </button>

        {/* Sender avatar for group received messages */}
        {isGroup && !isSent && (
          <div className="flex-shrink-0 w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-[8px] font-bold text-white"
            style={{ background: sender?.avatarColor ?? '#8E8E93' }}>
            {sender?.avatarPhotoUrl
              ? <img src={sender.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
              : getInitials(sender?.name ?? '?')
            }
          </div>
        )}

        <input type="text" value={msg.text} onChange={e => onUpdate(msg.id, { text: e.target.value })}
          placeholder="Message text…"
          className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 min-w-0" />

        <button onClick={() => setExpanded(x => !x)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
        <button onClick={() => onDelete(msg.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
          <Trash2 size={15} />
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100 space-y-2.5">
          <div className="flex gap-4 flex-wrap pt-1">
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" checked={msg.showTimestamp}
                onChange={e => onUpdate(msg.id, { showTimestamp: e.target.checked })} className="rounded" />
              Show timestamp
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" checked={msg.showReadReceipt}
                onChange={e => onUpdate(msg.id, { showReadReceipt: e.target.checked })}
                disabled={!isSent} className="rounded disabled:opacity-40" />
              Read receipt
            </label>
          </div>
          {msg.showTimestamp && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-16 flex-shrink-0">Time label</label>
              <input type="text" value={msg.timestamp} onChange={e => onUpdate(msg.id, { timestamp: e.target.value })}
                placeholder="e.g. 3:45 PM"
                className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400 bg-gray-50" />
            </div>
          )}
          {/* Character picker for received group messages */}
          {isGroup && !isSent && characters.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Sender</label>
              <div className="flex items-center gap-2 flex-wrap">
                {sender && (
                  <span className="flex items-center gap-1.5 text-xs bg-gray-100 rounded-full px-2.5 py-1 font-medium text-gray-700">
                    <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ background: sender.avatarColor }} />
                    {sender.name}
                    <button onClick={() => onUpdate(msg.id, { characterId: undefined })} className="text-gray-400 hover:text-red-400 ml-0.5">×</button>
                  </span>
                )}
                <CharacterPicker
                  characters={characters}
                  label={sender ? 'Change' : 'Assign sender'}
                  onPick={char => onUpdate(msg.id, { characterId: char.id })}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Conversation editor ───────────────────────────────────────────────────────
function ConversationEditor({ conv, onUpdate, onDelete, characters }: {
  conv: Conversation;
  onUpdate: (id: string, u: Partial<Conversation>) => void;
  onDelete: (id: string) => void;
  characters: Character[];
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'messages' | 'info'>('messages');
  const photoRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const msgs = [...conv.messages];
      const oi = msgs.findIndex(m => m.id === active.id);
      const ni = msgs.findIndex(m => m.id === over.id);
      const [rem] = msgs.splice(oi, 1);
      msgs.splice(ni, 0, rem);
      onUpdate(conv.id, { messages: msgs });
    }
  }

  function syncPreview(msgs: Message[]) {
    const last = [...msgs].reverse().find(m => m.text);
    return last?.text ?? conv.previewText;
  }

  function addMessage(type: 'sent' | 'received') {
    const m: Message = { id: generateId(), text: '', type, timestamp: getCurrentTime(), showTimestamp: false, showReadReceipt: false };
    const msgs = [...conv.messages, m];
    onUpdate(conv.id, { messages: msgs, previewText: syncPreview(msgs) });
  }

  function updateMsg(id: string, u: Partial<Message>) {
    const msgs = conv.messages.map(m => m.id === id ? { ...m, ...u } : m);
    onUpdate(conv.id, { messages: msgs, previewText: syncPreview(msgs) });
  }

  function deleteMsg(id: string) {
    const msgs = conv.messages.filter(m => m.id !== id);
    onUpdate(conv.id, { messages: msgs, previewText: syncPreview(msgs) });
  }

  function toggleParticipant(charId: string) {
    const exists = conv.participants.includes(charId);
    const updated = exists
      ? conv.participants.filter(id => id !== charId)
      : [...conv.participants, charId];
    onUpdate(conv.id, { participants: updated });
  }

  function applyCharacter(char: Character) {
    onUpdate(conv.id, {
      name: char.name,
      avatarColor: char.avatarColor,
      avatarPhotoUrl: char.avatarPhotoUrl,
    });
  }

  const participantChars = conv.participants.map(id => characters.find(c => c.id === id)).filter(Boolean) as Character[];

  return (
    <div className={`border rounded-xl mb-2 overflow-hidden transition-shadow ${open ? 'border-blue-300 shadow-md' : 'border-gray-200 shadow-sm bg-white'}`}>
      {/* Header row */}
      <div className="flex items-center gap-2 p-2.5 bg-white">
        {/* Avatar / group avatar */}
        {conv.isGroup ? (
          <div className="flex-shrink-0 relative cursor-pointer group" onClick={() => photoRef.current?.click()}>
            {conv.avatarPhotoUrl ? (
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <img src={conv.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
              </div>
            ) : (
              <GroupAvatar participants={conv.participants} characters={characters} size={36} />
            )}
            {/* Upload overlay on hover */}
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            </div>
          </div>
        ) : (
          <div
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
            style={{ background: conv.avatarColor }}
            onClick={() => photoRef.current?.click()}
          >
            {conv.avatarPhotoUrl
              ? <img src={conv.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
              : <span className="text-white text-xs font-semibold">{getInitials(conv.name)}</span>
            }
          </div>
        )}
        <input ref={photoRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => onUpdate(conv.id, { avatarPhotoUrl: ev.target?.result as string }); r.readAsDataURL(f); }} />

        {/* Name */}
        <input type="text"
          value={conv.isGroup ? conv.groupName : conv.name}
          onChange={e => onUpdate(conv.id, conv.isGroup ? { groupName: e.target.value } : { name: e.target.value })}
          className="flex-1 text-sm font-semibold text-gray-800 bg-transparent outline-none placeholder-gray-400 min-w-0"
          placeholder={conv.isGroup ? 'Group name…' : 'Contact name…'} />

        {/* Group badge */}
        {conv.isGroup && (
          <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
            Group
          </span>
        )}

        {/* Unread */}
        <input type="number" min={0} max={99} value={conv.unreadCount}
          onChange={e => onUpdate(conv.id, { unreadCount: Math.max(0, parseInt(e.target.value) || 0) })}
          className="w-10 text-xs text-center border border-gray-200 rounded-lg py-1 outline-none focus:border-blue-400 bg-white"
          title="Unread count" />

        {/* Pin */}
        <button onClick={() => onUpdate(conv.id, { pinned: !conv.pinned })}
          className={`flex-shrink-0 text-base transition-opacity ${conv.pinned ? 'opacity-100' : 'opacity-25 hover:opacity-50'}`}
          title={conv.pinned ? 'Unpin' : 'Pin'}>📌</button>

        <button onClick={() => setOpen(x => !x)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <button onClick={() => onDelete(conv.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
          <Trash2 size={15} />
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100">
          <div className="flex border-b border-gray-100 bg-gray-50">
            {(['messages', 'info'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${tab === t ? 'text-blue-600 border-b-2 border-blue-500 bg-white' : 'text-gray-400 hover:text-gray-600'}`}>
                {t === 'messages' ? '💬 Messages' : '⚙️ Info'}
              </button>
            ))}
          </div>

          {/* ── Messages tab ── */}
          {tab === 'messages' && (
            <div className="p-3">
              {conv.messages.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-4">No messages yet</p>
              )}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={conv.messages.map(m => m.id)} strategy={verticalListSortingStrategy}>
                  {conv.messages.map(msg => (
                    <SortableMessageRow key={msg.id} msg={msg} onUpdate={updateMsg} onDelete={deleteMsg}
                      isGroup={conv.isGroup} characters={characters} />
                  ))}
                </SortableContext>
              </DndContext>
              <div className="flex gap-2 mt-2">
                <button onClick={() => addMessage('received')}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 bg-white transition-colors">
                  <Plus size={13} /> Incoming
                </button>
                <button onClick={() => addMessage('sent')}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  <Plus size={13} /> You
                </button>
              </div>
            </div>
          )}

          {/* ── Info tab ── */}
          {tab === 'info' && (
            <div className="p-3 space-y-3">
              {/* Group toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                  <Users size={14} className="text-indigo-500" /> Group chat
                </label>
                <button
                  onClick={() => onUpdate(conv.id, { isGroup: !conv.isGroup, groupName: conv.isGroup ? '' : conv.name })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${conv.isGroup ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${conv.isGroup ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Group: participant picker */}
              {conv.isGroup && (
                <div>
                  <label className="text-xs text-gray-500 block mb-2 font-medium">Participants</label>
                  {characters.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No saved characters yet — add some in the Characters panel.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {characters.map(char => {
                        const selected = conv.participants.includes(char.id);
                        return (
                          <button key={char.id} onClick={() => toggleParticipant(char.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${selected ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: char.avatarColor }} />
                            {char.name || 'Unnamed'}
                            {selected && <span className="text-indigo-400">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {participantChars.length > 0 && (
                    <p className="text-[10px] text-gray-400 mt-1.5">{participantChars.length} participant{participantChars.length !== 1 ? 's' : ''} selected. Assign senders per message in the Messages tab.</p>
                  )}
                </div>
              )}

              {/* Group photo controls */}
              {conv.isGroup && (
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">Group photo</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => photoRef.current?.click()}>
                      {conv.avatarPhotoUrl
                        ? <img src={conv.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
                        : <div className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-full">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                          </div>
                      }
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => photoRef.current?.click()} className="text-xs text-blue-500 hover:text-blue-600 font-medium text-left">
                        {conv.avatarPhotoUrl ? 'Change photo' : 'Upload photo'}
                      </button>
                      {conv.avatarPhotoUrl && (
                        <button onClick={() => onUpdate(conv.id, { avatarPhotoUrl: null })} className="text-xs text-red-400 hover:text-red-500 font-medium text-left">
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 1-on-1: character picker or manual */}
              {!conv.isGroup && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-gray-500 font-medium">Contact</label>
                      <CharacterPicker characters={characters} label="Use character" onPick={applyCharacter} />
                    </div>
                    <input type="text" value={conv.name} onChange={e => onUpdate(conv.id, { name: e.target.value })}
                      placeholder="Contact name"
                      className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:border-blue-400 bg-white mb-2" />
                    {!conv.avatarPhotoUrl && (
                      <div className="flex flex-wrap gap-1.5">
                        {AVATAR_COLORS.map(c => (
                          <button key={c} onClick={() => onUpdate(conv.id, { avatarColor: c })}
                            className="w-5 h-5 rounded-full border-2 transition-all"
                            style={{ background: c, borderColor: conv.avatarColor === c ? '#007AFF' : 'transparent', boxShadow: conv.avatarColor === c ? '0 0 0 1px white,0 0 0 2.5px #007AFF' : 'none' }} />
                        ))}
                      </div>
                    )}
                    {conv.avatarPhotoUrl && (
                      <button onClick={() => onUpdate(conv.id, { avatarPhotoUrl: null })} className="text-xs text-red-400 hover:text-red-500 font-medium">Remove photo</button>
                    )}
                  </div>
                </>
              )}

              {/* Preview text + time */}
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">Preview text</label>
                <input type="text" value={conv.previewText} onChange={e => onUpdate(conv.id, { previewText: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 bg-white" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">Time shown</label>
                <input type="text" value={conv.time} onChange={e => onUpdate(conv.id, { time: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 bg-white" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────
interface IMessageEditorProps {
  conversations: Conversation[];
  config: IMessageConfig;
  onConversationsChange: (c: Conversation[]) => void;
  onConfigChange: (u: Partial<IMessageConfig>) => void;
  characterStore: CharacterStore;
}

const IMessageEditor: React.FC<IMessageEditorProps> = ({
  conversations, config, onConversationsChange, onConfigChange, characterStore,
}) => {
  const [tab, setTab] = useState<'chats' | 'settings'>('chats');
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  function createDirectConversation(opts: { name: string; avatarColor: string; avatarPhotoUrl: string | null; characterId?: string }) {
    const c: Conversation = {
      id: generateId(),
      name: opts.name,
      avatarColor: opts.avatarColor,
      avatarPhotoUrl: opts.avatarPhotoUrl,
      previewText: '',
      time: getCurrentTime(),
      unreadCount: 0,
      pinned: false,
      messages: [],
      isGroup: false,
      groupName: '',
      participants: opts.characterId ? [opts.characterId] : [],
    };
    onConversationsChange([...conversations, c]);
    setShowDirectModal(false);
  }

  function createGroupConversation(opts: { groupName: string; participants: string[] }) {
    const c: Conversation = {
      id: generateId(),
      name: '',
      avatarColor: AVATAR_COLORS[conversations.length % AVATAR_COLORS.length],
      avatarPhotoUrl: null,
      previewText: '',
      time: getCurrentTime(),
      unreadCount: 0,
      pinned: false,
      messages: [],
      isGroup: true,
      groupName: opts.groupName,
      participants: opts.participants,
    };
    onConversationsChange([...conversations, c]);
    setShowGroupModal(false);
  }

  function updateConv(id: string, u: Partial<Conversation>) {
    onConversationsChange(conversations.map(c => c.id === id ? { ...c, ...u } : c));
  }

  function deleteConv(id: string) {
    onConversationsChange(conversations.filter(c => c.id !== id));
    if (config.activeConversationId === id) onConfigChange({ activeConversationId: null });
  }

  const Toggle = ({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!val)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${val ? 'bg-green-500' : 'bg-gray-300'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${val ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* Modals */}
      {showDirectModal && (
        <NewDirectModal
          characters={characterStore.characters}
          onConfirm={createDirectConversation}
          onClose={() => setShowDirectModal(false)}
        />
      )}
      {showGroupModal && (
        <NewGroupModal
          characters={characterStore.characters}
          onConfirm={createGroupConversation}
          onClose={() => setShowGroupModal(false)}
        />
      )}

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-white px-2 pt-2 gap-1">
        <button onClick={() => setTab('chats')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'chats' ? 'text-blue-600 bg-gray-50 border-t border-l border-r border-gray-200 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
          <MessageSquare size={14} /> Chats
          <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">{conversations.length}</span>
        </button>
        <button onClick={() => setTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'settings' ? 'text-blue-600 bg-gray-50 border-t border-l border-r border-gray-200 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
          <Settings size={14} /> Settings
        </button>
      </div>

      {/* Chats tab */}
      {tab === 'chats' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3">
            {conversations.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-sm font-medium text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Start a new chat below</p>
              </div>
            )}
            {conversations.map(conv => (
              <ConversationEditor key={conv.id} conv={conv} onUpdate={updateConv}
                onDelete={deleteConv} characters={characterStore.characters} />
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50/80 flex gap-2">
            <button onClick={() => setShowDirectModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              <Plus size={14} /> Direct
            </button>
            <button onClick={() => setShowGroupModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
              <Users size={14} /> Group
            </button>
          </div>
        </div>
      )}

      {/* Settings tab */}
      {tab === 'settings' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status Bar</h3>
            <div className="space-y-3">
              {[
                { label: 'Time', el: <input type="text" value={config.statusBarTime} onChange={e => onConfigChange({ statusBarTime: e.target.value })} className="w-24 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 text-center bg-white" /> },
              ].map(({ label, el }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <label className="text-sm text-gray-600 font-medium">{label}</label>{el}
                </div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-600 font-medium">Battery %</label>
                <div className="flex items-center gap-2">
                  <input type="range" min={0} max={100} value={config.batteryLevel}
                    onChange={e => onConfigChange({ batteryLevel: Number(e.target.value) })} className="w-24 accent-blue-500" />
                  <span className="text-sm text-gray-600 w-8 text-right">{config.batteryLevel}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-600 font-medium">Signal</label>
                <div className="flex items-center gap-2">
                  <input type="range" min={0} max={4} value={config.signalBars}
                    onChange={e => onConfigChange({ signalBars: Number(e.target.value) })} className="w-20 accent-blue-500" />
                  <span className="text-sm text-gray-600 w-3">{config.signalBars}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-600 font-medium">Wi-Fi</label>
                <Toggle val={config.wifiConnected} onChange={v => onConfigChange({ wifiConnected: v })} />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Appearance</h3>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              {(['light', 'dark'] as const).map(t => (
                <button key={t} onClick={() => onConfigChange({ iosTheme: t })}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${config.iosTheme === t ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  {t === 'light' ? '☀️ Light' : '🌙 Dark'}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Conversation</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-600 font-medium">Read receipts</label>
                <Toggle val={config.showReadReceipts} onChange={v => onConfigChange({ showReadReceipts: v })} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-600 font-medium">Typing indicator</label>
                <Toggle val={config.showTypingIndicator} onChange={v => onConfigChange({ showTypingIndicator: v })} />
              </div>
            </div>
          </section>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-[11px] text-amber-700 leading-relaxed">
              <span className="font-semibold">⚠️ For creative & design use only.</span> Do not use to misrepresent real communications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IMessageEditor;
