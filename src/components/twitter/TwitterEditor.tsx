import React, { useRef } from 'react';
import { TwitterConfig } from '../../types';
import { AVATAR_COLORS, getInitials } from '../../utils/helpers';

interface TwitterEditorProps {
  config: TwitterConfig;
  onChange: (updates: Partial<TwitterConfig>) => void;
}

const TwitterEditor: React.FC<TwitterEditorProps> = ({ config, onChange }) => {
  const photoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ avatarPhotoUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ imageUrl: ev.target?.result as string });
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
            style={{ background: config.avatarColor }}
            onClick={() => photoRef.current?.click()}
          >
            {config.avatarPhotoUrl
              ? <img src={config.avatarPhotoUrl} className="w-full h-full object-cover" alt="" />
              : <span className="text-white font-bold text-lg">{getInitials(config.username)}</span>
            }
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <span className="text-white text-[10px] font-medium">Edit</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <input type="text" value={config.username} onChange={(e) => onChange({ username: e.target.value })} placeholder="Display name" className={inputClass} />
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">@</span>
              <input type="text" value={config.handle} onChange={(e) => onChange({ handle: e.target.value.replace(/^@/, '') })} placeholder="handle" className={`${inputClass} flex-1`} />
            </div>
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

        {/* Avatar colors */}
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
        {config.avatarPhotoUrl && (
          <button onClick={() => onChange({ avatarPhotoUrl: null })} className="text-xs text-red-400 hover:text-red-500 font-medium">Remove photo</button>
        )}

        {/* Verified */}
        <div className={row}>
          <label className={label}>Verified badge</label>
          <button onClick={() => onChange({ verified: !config.verified })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${config.verified ? 'bg-green-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${config.verified ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {config.verified && (
          <div className={row}>
            <label className={label}>Badge type</label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
              {(['blue', 'gold', 'gray'] as const).map((t) => (
                <button key={t} onClick={() => onChange({ verifiedType: t })}
                  className={`px-3 py-1.5 font-medium capitalize transition-colors ${config.verifiedType === t ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Tweet content */}
      <section>
        <h3 className={sectionTitle}>Tweet</h3>
        <textarea
          value={config.tweetText}
          onChange={(e) => onChange({ tweetText: e.target.value })}
          placeholder="What's happening?"
          rows={4}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white resize-none transition-colors"
        />
        <div className="mt-2">
          <label className={`${label} block mb-1.5`}>Attached image</label>
          {config.imageUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img src={config.imageUrl} alt="" className="w-full max-h-40 object-cover" />
              <button onClick={() => onChange({ imageUrl: null })}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full hover:bg-black/80">Remove</button>
            </div>
          ) : (
            <button onClick={() => imageRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors">
              + Upload image
            </button>
          )}
          <input ref={imageRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
        <div className="mt-3">
          <label className={`${label} block mb-1.5`}>Timestamp</label>
          <input type="text" value={config.timestamp} onChange={(e) => onChange({ timestamp: e.target.value })} className={inputClass} />
        </div>
      </section>

      {/* Engagement */}
      <section>
        <h3 className={sectionTitle}>Engagement</h3>
        <div className="grid grid-cols-2 gap-2">
          {([['likes', 'Likes'], ['retweets', 'Reposts'], ['replies', 'Replies'], ['views', 'Views']] as const).map(([key, label_]) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 block">{label_}</label>
              <input type="number" min={0} value={config[key]}
                onChange={(e) => onChange({ [key]: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:border-blue-400 bg-white" />
            </div>
          ))}
        </div>
      </section>

      {/* Theme */}
      <section>
        <h3 className={sectionTitle}>Theme</h3>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          {(['light', 'dim', 'dark'] as const).map((t) => (
            <button key={t} onClick={() => onChange({ theme: t })}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${config.theme === t ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {t === 'light' ? '☀️ Light' : t === 'dim' ? '🌆 Dim' : '🌙 Dark'}
            </button>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 pb-4">
        <p className="text-[11px] text-amber-700 leading-relaxed">
          <span className="font-semibold">⚠️ Fictional mockup only.</span> Do not use to impersonate real people or misrepresent real posts.
        </p>
      </div>
    </div>
  );
};

export default TwitterEditor;
