import React, { useRef, useState } from 'react';
import { TwitterFeedConfig, TwitterPost, Character } from '../../types';
import { generateId, getInitials, AVATAR_COLORS, formatTwitterTimestamp } from '../../utils/helpers';
import { CharacterPicker } from '../CharactersPanel';
import NewPostModal from './NewPostModal';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight, Image, X } from 'lucide-react';

function SortablePostRow({ post, onUpdate, onDelete, characters }: {
  post: TwitterPost;
  onUpdate: (id: string, u: Partial<TwitterPost>) => void;
  onDelete: (id: string) => void;
  characters: Character[];
}) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const imgRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  function addImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => onUpdate(post.id, { imageUrls: [...post.imageUrls, ev.target?.result as string] });
    r.readAsDataURL(file);
    e.target.value = '';
  }

  function removeImage(i: number) {
    onUpdate(post.id, { imageUrls: post.imageUrls.filter((_, idx) => idx !== i) });
  }

  function applyCharacter(char: Character) {
    onUpdate(post.id, {
      username: char.name,
      handle: char.handle || char.name.toLowerCase().replace(/\s+/g, ''),
      avatarColor: char.avatarColor,
      avatarPhotoUrl: char.avatarPhotoUrl,
    });
  }

  return (
    <div ref={setNodeRef} style={style}
      className={`bg-white border border-gray-200 rounded-xl mb-2 overflow-hidden ${isDragging ? 'shadow-2xl' : 'shadow-sm'}`}>
      <div className="flex items-start gap-2 p-2.5">
        <button className="opacity-30 hover:opacity-60 cursor-grab active:cursor-grabbing text-gray-400 flex-shrink-0 mt-0.5" {...attributes} {...listeners}><GripVertical size={16}/></button>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer text-xs font-bold text-white"
          style={{ background: post.avatarColor }} onClick={() => avatarRef.current?.click()}>
          {post.avatarPhotoUrl ? <img src={post.avatarPhotoUrl} className="w-full h-full object-cover" alt=""/> : getInitials(post.username)}
        </div>
        <input ref={avatarRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>onUpdate(post.id,{avatarPhotoUrl:ev.target?.result as string}); r.readAsDataURL(f); }}/>
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-1.5 mb-1.5">
            <input type="text" value={post.username} onChange={e => onUpdate(post.id, { username: e.target.value })}
              placeholder="Display name" className="flex-1 min-w-0 text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400 bg-white"/>
            <input type="text" value={post.handle} onChange={e => onUpdate(post.id, { handle: e.target.value.replace(/^@/,'') })}
              placeholder="@handle" className="w-24 text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400 bg-white"/>
          </div>
          <textarea value={post.text} onChange={e => onUpdate(post.id, { text: e.target.value })}
            placeholder="What's happening?" rows={2}
            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 bg-white resize-none"/>
        </div>
        <button onClick={() => setOpen(x=>!x)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
          {open ? <ChevronDown size={15}/> : <ChevronRight size={15}/>}
        </button>
        <button onClick={() => onDelete(post.id)} className="text-red-400 hover:text-red-600 flex-shrink-0 mt-0.5"><Trash2 size={15}/></button>
      </div>

      {open && (
        <div className="border-t border-gray-100 p-3 space-y-3">
          {characters.length > 0 && (
            <div className="flex justify-end">
              <CharacterPicker characters={characters} label="Use character" onPick={applyCharacter} />
            </div>
          )}
          {/* Images */}
          <div>
            <label className="text-xs text-gray-500 block mb-1.5 font-medium">Images ({post.imageUrls.length}/4)</label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {post.imageUrls.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <img src={url} className="w-full h-full object-cover" alt=""/>
                  <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full w-4 h-4 flex items-center justify-center text-white hover:bg-black/80">
                    <X size={9}/>
                  </button>
                </div>
              ))}
              {post.imageUrls.length < 4 && (
                <button onClick={() => imgRef.current?.click()}
                  className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors">
                  <Image size={18}/>
                </button>
              )}
            </div>
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={addImage}/>
          </div>
          {/* Stats + timestamp */}
          <div className="grid grid-cols-2 gap-2">
            {(['likes','retweets','replies','views'] as const).map(k => (
              <div key={k}>
                <label className="text-[10px] text-gray-400 capitalize block mb-0.5">{k}</label>
                <input type="number" min={0} value={post[k]}
                  onChange={e => onUpdate(post.id, { [k]: Math.max(0, parseInt(e.target.value)||0) })}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 bg-white"/>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[10px] text-gray-400">Timestamp</label>
                <button onClick={() => onUpdate(post.id, { timestamp: formatTwitterTimestamp(new Date()) })} className="text-[10px] text-blue-400 hover:text-blue-500 font-medium">Now</button>
              </div>
              <input type="text" value={post.timestamp} onChange={e => onUpdate(post.id, { timestamp: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 bg-white"/>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-0.5">Verified</label>
              <select value={post.verified ? post.verifiedType : 'none'}
                onChange={e => onUpdate(post.id, e.target.value==='none' ? { verified:false } : { verified:true, verifiedType: e.target.value as any })}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 bg-white">
                <option value="none">None</option>
                <option value="blue">Blue ✓</option>
                <option value="gold">Gold ✓</option>
                <option value="gray">Gray ✓</option>
              </select>
            </div>
          </div>
          {/* Avatar color */}
          {!post.avatarPhotoUrl && (
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Avatar color</label>
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_COLORS.map(c => (
                  <button key={c} onClick={() => onUpdate(post.id, { avatarColor: c })}
                    className="w-5 h-5 rounded-full border-2 transition-all"
                    style={{ background:c, borderColor:post.avatarColor===c?'#007AFF':'transparent', boxShadow:post.avatarColor===c?'0 0 0 1px white,0 0 0 2.5px #007AFF':'none' }}/>
                ))}
              </div>
            </div>
          )}
          {post.avatarPhotoUrl && (
            <button onClick={() => onUpdate(post.id, { avatarPhotoUrl: null })} className="text-xs text-red-400 hover:text-red-500 font-medium">Remove avatar photo</button>
          )}
        </div>
      )}
    </div>
  );
}

const TwitterEditor: React.FC<{ config: TwitterFeedConfig; onChange: (u: Partial<TwitterFeedConfig>) => void; characters: Character[] }> = ({ config, onChange, characters }) => {
  const [showModal, setShowModal] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {}),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const posts = [...config.posts];
      const oi = posts.findIndex(p => p.id === active.id);
      const ni = posts.findIndex(p => p.id === over.id);
      const [rem] = posts.splice(oi, 1);
      posts.splice(ni, 0, rem);
      onChange({ posts });
    }
  }

  function addPost(opts: { username: string; handle: string; avatarColor: string; avatarPhotoUrl: string | null }) {
    const p: TwitterPost = {
      id: generateId(),
      username: opts.username,
      handle: opts.handle,
      avatarColor: opts.avatarColor,
      avatarPhotoUrl: opts.avatarPhotoUrl,
      verified: false, verifiedType: 'blue',
      text: '', imageUrls: [],
      timestamp: formatTwitterTimestamp(new Date()),
      likes: 0, retweets: 0, replies: 0, views: 0,
    };
    onChange({ posts: [...config.posts, p] });
    setShowModal(false);
  }

  function updatePost(id: string, u: Partial<TwitterPost>) {
    onChange({ posts: config.posts.map(p => p.id===id ? {...p,...u} : p) });
  }

  function deletePost(id: string) {
    onChange({ posts: config.posts.filter(p => p.id!==id) });
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {showModal && (
        <NewPostModal
          characters={characters}
          platform="twitter"
          onConfirm={addPost}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Theme + status */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Theme</span>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
              {(['light','dim','dark'] as const).map(t => (
                <button key={t} onClick={() => onChange({ theme: t })}
                  className={`px-2.5 py-1.5 font-medium capitalize transition-colors ${config.theme===t ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  {t==='light'?'☀️':t==='dim'?'🌆':'🌙'} {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">Status time</span>
            <input type="text" value={config.statusBarTime} onChange={e => onChange({ statusBarTime: e.target.value })}
              className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 text-center bg-white"/>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Posts ({config.posts.length})</span>
        </div>

        {config.posts.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <div className="text-3xl mb-2">𝕏</div>
            <p className="text-sm">No posts yet</p>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={config.posts.map(p=>p.id)} strategy={verticalListSortingStrategy}>
            {config.posts.map(post => (
              <SortablePostRow key={post.id} post={post} onUpdate={updatePost} onDelete={deletePost} characters={characters}/>
            ))}
          </SortableContext>
        </DndContext>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">
          <p className="text-[11px] text-amber-700 leading-relaxed"><span className="font-semibold">⚠️ Fictional mockup only.</span> Do not use to impersonate real people or misrepresent real posts.</p>
        </div>
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50/80">
        <button onClick={() => setShowModal(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors">
          <Plus size={15}/> Add Post
        </button>
      </div>
    </div>
  );
};

export default TwitterEditor;
