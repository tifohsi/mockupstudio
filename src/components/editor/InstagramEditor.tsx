import React, { useRef, useState } from 'react';
import { InstagramFeedConfig, InstagramPost, Character } from '../../types';
import { generateId, getInitials, AVATAR_COLORS } from '../../utils/helpers';
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

const POST_COLORS = ['#C7B8EA','#FFDDD2','#B5EAD7','#FFD700','#AED9E0','#FAD2E1','#CDE8F5','#F9C784','#D4F0C0','#E8D5C4'];

function SortablePostRow({ post, onUpdate, onDelete, characters }: {
  post: InstagramPost;
  onUpdate: (id: string, u: Partial<InstagramPost>) => void;
  onDelete: (id: string) => void;
  characters: Character[];
}) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const imgRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const STORY_GRADIENT = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

  function addImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => onUpdate(post.id, { imageUrls: [...post.imageUrls, ev.target?.result as string] });
    r.readAsDataURL(file);
    e.target.value = '';
  }

  function applyCharacter(char: Character) {
    onUpdate(post.id, {
      username: char.name,
      avatarColor: char.avatarColor,
      avatarPhotoUrl: char.avatarPhotoUrl,
    });
  }

  return (
    <div ref={setNodeRef} style={style}
      className={`bg-white border border-gray-200 rounded-xl mb-2 overflow-hidden ${isDragging ? 'shadow-2xl' : 'shadow-sm'}`}>
      <div className="flex items-start gap-2 p-2.5">
        <button className="opacity-30 hover:opacity-60 cursor-grab active:cursor-grabbing text-gray-400 flex-shrink-0 mt-1" {...attributes} {...listeners}><GripVertical size={16}/></button>
        {/* Avatar */}
        <div className="flex-shrink-0 cursor-pointer" style={{ padding:'2px', background: STORY_GRADIENT, borderRadius:'50%', width:'36px', height:'36px' }}
          onClick={() => avatarRef.current?.click()}>
          <div className="w-full h-full rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-white text-xs font-bold" style={{ background: post.avatarColor }}>
            {post.avatarPhotoUrl ? <img src={post.avatarPhotoUrl} className="w-full h-full object-cover" alt=""/> : getInitials(post.username)}
          </div>
        </div>
        <input ref={avatarRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>onUpdate(post.id,{avatarPhotoUrl:ev.target?.result as string}); r.readAsDataURL(f); }}/>
        {/* Username + caption */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <input type="text" value={post.username} onChange={e => onUpdate(post.id, { username: e.target.value })}
            placeholder="username" className="w-full text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-pink-400 bg-white"/>
          <textarea value={post.caption} onChange={e => onUpdate(post.id, { caption: e.target.value })}
            placeholder="Caption…" rows={2}
            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-pink-400 bg-white resize-none"/>
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
            <label className="text-xs text-gray-500 block mb-1.5 font-medium">Post images ({post.imageUrls.length})</label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {post.imageUrls.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <img src={url} className="w-full h-full object-cover" alt=""/>
                  <button onClick={() => onUpdate(post.id, { imageUrls: post.imageUrls.filter((_,j)=>j!==i) })}
                    className="absolute top-0.5 right-0.5 bg-black/60 rounded-full w-4 h-4 flex items-center justify-center text-white hover:bg-black/80">
                    <X size={9}/>
                  </button>
                </div>
              ))}
              <button onClick={() => imgRef.current?.click()}
                className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-pink-300 hover:text-pink-400 transition-colors">
                <Image size={18}/>
              </button>
            </div>
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={addImage}/>
            {/* Placeholder color */}
            {post.imageUrls.length === 0 && (
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Placeholder color</label>
                <div className="flex flex-wrap gap-1.5">
                  {POST_COLORS.map(c => (
                    <button key={c} onClick={() => onUpdate(post.id, { imagePlaceholderColor: c })}
                      className="w-5 h-5 rounded-md border-2 transition-all"
                      style={{ background:c, borderColor:post.imagePlaceholderColor===c?'#007AFF':'transparent', boxShadow:post.imagePlaceholderColor===c?'0 0 0 1px white,0 0 0 2.5px #007AFF':'none' }}/>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-0.5">Likes</label>
              <input type="number" min={0} value={post.likes} onChange={e => onUpdate(post.id, { likes: Math.max(0,parseInt(e.target.value)||0) })}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-pink-400 bg-white"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[10px] text-gray-400">Time ago</label>
                <button onClick={() => onUpdate(post.id, { timeAgo: 'Just now' })} className="text-[10px] text-pink-400 hover:text-pink-500 font-medium">Now</button>
              </div>
              <input type="text" value={post.timeAgo} onChange={e => onUpdate(post.id, { timeAgo: e.target.value })}
                placeholder="e.g. 2 hours ago"
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-pink-400 bg-white"/>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-gray-400 block mb-0.5">Location</label>
              <input type="text" value={post.location} onChange={e => onUpdate(post.id, { location: e.target.value })} placeholder="Add location"
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-pink-400 bg-white"/>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-500 font-medium">Verified</label>
            <button onClick={() => onUpdate(post.id, { verified: !post.verified })}
              className={`relative w-10 h-5 rounded-full transition-colors ${post.verified ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${post.verified ? 'translate-x-5' : 'translate-x-0.5'}`}/>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-500 font-medium">Story ring</label>
            <button onClick={() => onUpdate(post.id, { hasStory: !post.hasStory })}
              className={`relative w-10 h-5 rounded-full transition-colors ${post.hasStory ? 'bg-pink-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${post.hasStory ? 'translate-x-5' : 'translate-x-0.5'}`}/>
            </button>
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

const InstagramEditor: React.FC<{ config: InstagramFeedConfig; onChange: (u: Partial<InstagramFeedConfig>) => void; characters: Character[] }> = ({ config, onChange, characters }) => {
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
    const postColors = ['#C7B8EA','#FFDDD2','#B5EAD7','#AED9E0','#FAD2E1'];
    const p: InstagramPost = {
      id: generateId(),
      username: opts.username,
      avatarColor: opts.avatarColor,
      avatarPhotoUrl: opts.avatarPhotoUrl,
      verified: false, location: '',
      imageUrls: [],
      imagePlaceholderColor: postColors[config.posts.length % postColors.length],
      caption: '', likes: 0,
      timeAgo: 'Just now',
      hasStory: false,
    };
    onChange({ posts: [...config.posts, p] });
    setShowModal(false);
  }

  function updatePost(id: string, u: Partial<InstagramPost>) {
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
          platform="instagram"
          onConfirm={addPost}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Theme</span>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
              {(['light','dark'] as const).map(t => (
                <button key={t} onClick={() => onChange({ theme: t })}
                  className={`px-3 py-1.5 font-medium capitalize transition-colors ${config.theme===t ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  {t==='light'?'☀️ Light':'🌙 Dark'}
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
            <div className="text-3xl mb-2">📸</div>
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
          <p className="text-[11px] text-amber-700 leading-relaxed"><span className="font-semibold">⚠️ Fictional mockup only.</span> Do not use to impersonate real accounts.</p>
        </div>
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50/80">
        <button onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
          <Plus size={15}/> Add Post
        </button>
      </div>
    </div>
  );
};

export default InstagramEditor;
