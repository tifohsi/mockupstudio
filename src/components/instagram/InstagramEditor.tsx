import React, { useRef } from 'react';
import { InstagramConfig } from '../../types';
import { AVATAR_COLORS, getInitials } from '../../utils/helpers';

interface InstagramEditorProps {
  config: InstagramConfig;
  onChange: (updates: Partial<InstagramConfig>) => void;
}

const POST_BG_COLORS = [
  '#C7B8EA', '#FFDDD2', '#B5EAD7', '#FFD700', '#AED9E0',
  '#FAD2E1', '#CDE8F5', '#F9C784', '#D4F0C0', '#E8D5C4',
];

const InstagramEditor: React.FC<InstagramEditorProps> = ({ config, onChange }) => {
  const photoRef = useRef<HTMLInputElement>(null);
  const postImageRef = useRef<HTMLInputElement>(null);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ avatarPhotoUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  function handlePostImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ postImageUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  const sectionTitle = "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3";
  const label = "text-sm text-gray-600 font-medium";
  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white transition-colors";
  const row = "flex items-center justify-between gap-3 mb-3";

  return (
    <div className="overflow-y-auto h-full p-4 space-y-5">

      {/* Profile */}
      <section>
        <h3 className={sectionTitle}>Profile</h3>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer relative group"
            style={{
              padding: '2px',
              background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            }}
            onClick={() => photoRef.current?.click()}
          >
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center border-2 border-white" style={{ background: config.avatarColor }}>
              {config.avatarPhotoUrl
                ? <img src={config.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
                : <span className="text-white font-bold text-base">{getInitials(config.username)}</span>
              }
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <input type="text" value={config.username} onChange={(e) => onChange({ username: e.target.value })} placeholder="username" className={inputClass} />
            <button onClick={() => photoRef.current?.click()} className="text-xs text-blue-500 hover:text-blue-600 font-medium">
              {config.avatarPhotoUrl ? 'Change photo' : 'Upload photo'}
            </button>
            {config.avatarPhotoUrl && (
              <button onClick={() => onChange({ avatarPhotoUrl: null })} className="ml-3 text-xs text-red-400 hover:text-red-500 font-medium">Remove</button>
            )}
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

        {!config.avatarPhotoUrl && (
          <div className="mb-3">
            <span className={`${label} block mb-2`}>Avatar color</span>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((color) => (
                <button key={color} onClick={() => onChange({ avatarColor: color })}
                  className="w-6 h-6 rounded-full border-2 transition-all"
                  style={{ background: color, borderColor: config.avatarColor === color ? '#007AFF' : 'transparent', boxShadow: config.avatarColor === color ? '0 0 0 2px white, 0 0 0 4px #007AFF' : 'none' }} />
              ))}
            </div>
          </div>
        )}

        <div className={row}>
          <label className={label}>Verified</label>
          <button onClick={() => onChange({ verified: !config.verified })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${config.verified ? 'bg-green-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${config.verified ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </section>

      {/* Post image */}
      <section>
        <h3 className={sectionTitle}>Post Image</h3>
        {config.postImageUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-3">
            <img src={config.postImageUrl} alt="" className="w-full max-h-48 object-cover" />
            <button onClick={() => onChange({ postImageUrl: null })}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full hover:bg-black/80">Remove</button>
          </div>
        ) : (
          <button onClick={() => postImageRef.current?.click()}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-pink-300 hover:text-pink-400 transition-colors mb-3">
            + Upload post image
          </button>
        )}
        <input ref={postImageRef} type="file" accept="image/*" onChange={handlePostImageUpload} className="hidden" />

        {!config.postImageUrl && (
          <div>
            <span className={`${label} block mb-2`}>Placeholder color</span>
            <div className="flex flex-wrap gap-2">
              {POST_BG_COLORS.map((color) => (
                <button key={color} onClick={() => onChange({ postImageColor: color })}
                  className="w-6 h-6 rounded-lg border-2 transition-all"
                  style={{ background: color, borderColor: config.postImageColor === color ? '#007AFF' : 'transparent', boxShadow: config.postImageColor === color ? '0 0 0 2px white, 0 0 0 4px #007AFF' : 'none' }} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-3">
          <span className={`${label} block mb-2`}>Aspect ratio</span>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {(['1:1', '4:5', '1.91:1'] as const).map((ratio) => (
              <button key={ratio} onClick={() => onChange({ aspectRatio: ratio })}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${config.aspectRatio === ratio ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {ratio}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Caption & details */}
      <section>
        <h3 className={sectionTitle}>Post Details</h3>
        <div className="space-y-3">
          <div>
            <label className={`${label} block mb-1.5`}>Caption</label>
            <textarea value={config.caption} onChange={(e) => onChange({ caption: e.target.value })}
              placeholder="Write a caption..." rows={3}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 bg-white resize-none" />
          </div>
          <div>
            <label className={`${label} block mb-1.5`}>Location</label>
            <input type="text" value={config.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="Add location" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Likes</label>
              <input type="number" min={0} value={config.likes} onChange={(e) => onChange({ likes: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:border-blue-400 bg-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Time ago</label>
              <input type="text" value={config.timeAgo} onChange={(e) => onChange({ timeAgo: e.target.value })} placeholder="2 hours ago"
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:border-blue-400 bg-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Theme */}
      <section>
        <h3 className={sectionTitle}>Theme</h3>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          {(['light', 'dark'] as const).map((t) => (
            <button key={t} onClick={() => onChange({ theme: t })}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${config.theme === t ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {t === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
          ))}
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 pb-4">
        <p className="text-[11px] text-amber-700 leading-relaxed">
          <span className="font-semibold">⚠️ Fictional mockup only.</span> Do not use to impersonate real accounts or misrepresent real posts.
        </p>
      </div>
    </div>
  );
};

export default InstagramEditor;
