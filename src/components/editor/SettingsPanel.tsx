import React, { useRef } from 'react';
import { ConversationConfig } from '../../types';
import { AVATAR_COLORS, getInitials } from '../../utils/helpers';

interface SettingsPanelProps {
  config: ConversationConfig;
  onChange: (updates: Partial<ConversationConfig>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onChange }) => {
  const photoInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ contactPhotoUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  function handleNameChange(name: string) {
    onChange({
      contactName: name,
      contactInitials: getInitials(name),
    });
  }

  const sectionTitle = "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3";
  const label = "text-sm text-gray-600 font-medium";
  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white transition-colors";
  const row = "flex items-center justify-between gap-3 mb-3";

  return (
    <div className="overflow-y-auto h-full p-4 space-y-6">

      {/* === CONTACT === */}
      <section>
        <h3 className={sectionTitle}>Contact</h3>

        {/* Avatar preview + upload */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer relative group"
            style={{ background: config.contactColor }}
            onClick={() => photoInputRef.current?.click()}
          >
            {config.contactPhotoUrl ? (
              <img src={config.contactPhotoUrl} alt="Contact" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-semibold text-xl">
                {getInitials(config.contactName)}
              </span>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <span className="text-white text-[10px] font-medium">Edit</span>
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={config.contactName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contact name"
              className={inputClass}
            />
            <button
              onClick={() => photoInputRef.current?.click()}
              className="mt-1.5 text-xs text-blue-500 hover:text-blue-600 font-medium"
            >
              {config.contactPhotoUrl ? 'Change photo' : 'Upload photo'}
            </button>
            {config.contactPhotoUrl && (
              <button
                onClick={() => onChange({ contactPhotoUrl: null })}
                className="mt-1.5 ml-3 text-xs text-red-400 hover:text-red-500 font-medium"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {/* Avatar color picker (only when no photo) */}
        {!config.contactPhotoUrl && (
          <div className="mb-3">
            <span className={`${label} block mb-2`}>Avatar color</span>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onChange({ contactColor: color })}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    background: color,
                    borderColor: config.contactColor === color ? '#007AFF' : 'transparent',
                    boxShadow: config.contactColor === color ? '0 0 0 2px white, 0 0 0 4px #007AFF' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* === APPEARANCE === */}
      <section>
        <h3 className={sectionTitle}>Appearance</h3>

        <div className={row}>
          <span className={label}>Theme</span>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => onChange({ iosTheme: 'light' })}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                config.iosTheme === 'light'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => onChange({ iosTheme: 'dark' })}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                config.iosTheme === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </section>

      {/* === STATUS BAR === */}
      <section>
        <h3 className={sectionTitle}>Status Bar</h3>

        <div className="space-y-3">
          <div className={row}>
            <label htmlFor="status-time" className={label}>Time</label>
            <input
              id="status-time"
              type="text"
              value={config.statusBarTime}
              onChange={(e) => onChange({ statusBarTime: e.target.value })}
              placeholder="9:41"
              className="w-24 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 text-center bg-white"
            />
          </div>

          <div className={row}>
            <label className={label}>Battery %</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={config.batteryLevel}
                onChange={(e) => onChange({ batteryLevel: Number(e.target.value) })}
                className="w-24 accent-blue-500"
              />
              <span className="text-sm text-gray-600 w-8 text-right">{config.batteryLevel}%</span>
            </div>
          </div>

          <div className={row}>
            <label className={label}>Signal bars</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={4}
                value={config.signalBars}
                onChange={(e) => onChange({ signalBars: Number(e.target.value) })}
                className="w-20 accent-blue-500"
              />
              <span className="text-sm text-gray-600 w-3 text-right">{config.signalBars}</span>
            </div>
          </div>

          <div className={row}>
            <label className={label}>Wi-Fi connected</label>
            <button
              onClick={() => onChange({ wifiConnected: !config.wifiConnected })}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-200
                ${config.wifiConnected ? 'bg-green-500' : 'bg-gray-300'}
              `}
            >
              <div
                className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                  ${config.wifiConnected ? 'translate-x-6' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>
        </div>
      </section>

      {/* === CONVERSATION === */}
      <section>
        <h3 className={sectionTitle}>Conversation</h3>

        <div className="space-y-3">
          <div className={row}>
            <label className={label}>Show read receipts</label>
            <button
              onClick={() => onChange({ showReadReceipts: !config.showReadReceipts })}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-200
                ${config.showReadReceipts ? 'bg-green-500' : 'bg-gray-300'}
              `}
            >
              <div
                className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                  ${config.showReadReceipts ? 'translate-x-6' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>

          <div className={row}>
            <label className={label}>Typing indicator</label>
            <button
              onClick={() => onChange({ showTypingIndicator: !config.showTypingIndicator })}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-200
                ${config.showTypingIndicator ? 'bg-green-500' : 'bg-gray-300'}
              `}
            >
              <div
                className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                  ${config.showTypingIndicator ? 'translate-x-6' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <span className="font-semibold">⚠️ For creative & design use only.</span>{' '}
            This tool generates fictional message mockups for entertainment, storytelling, and UI design purposes.
            Do not use generated images to misrepresent real communications or deceive others.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SettingsPanel;
