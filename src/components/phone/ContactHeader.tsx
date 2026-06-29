import React from 'react';
import { ConversationConfig } from '../../types';
import { getInitials } from '../../utils/helpers';

interface ContactHeaderProps {
  config: ConversationConfig;
}

const ContactHeader: React.FC<ContactHeaderProps> = ({ config }) => {
  const dark = config.iosTheme === 'dark';
  const bgColor = dark ? '#1C1C1E' : '#F2F2F7';
  const textPrimary = dark ? '#FFFFFF' : '#000000';
  const textSecondary = dark ? '#8E8E93' : '#8E8E93';
  const chevronColor = '#007AFF';
  const borderColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
  const initials = getInitials(config.contactName);

  return (
    <div
      className="flex flex-col items-center pb-2 pt-1 relative"
      style={{
        background: bgColor,
        borderBottom: `0.5px solid ${borderColor}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Back button row */}
      <div className="w-full flex items-center px-2 mb-1">
        <button className="flex items-center gap-0.5 text-[17px]" style={{ color: chevronColor }}>
          <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
            <path d="M9.5 1L1.5 9.5L9.5 18" stroke={chevronColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[17px] ml-0.5" style={{ color: chevronColor, fontFamily: "'Inter', sans-serif" }}>
            5
          </span>
        </button>
      </div>

      {/* Avatar + Name centered */}
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center overflow-hidden mb-1"
          style={{ background: config.contactColor }}
        >
          {config.contactPhotoUrl ? (
            <img
              src={config.contactPhotoUrl}
              alt={config.contactName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className="text-white font-semibold text-[20px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {initials}
            </span>
          )}
        </div>

        {/* Name */}
        <div className="flex items-center gap-1">
          <span
            className="text-[13px] font-semibold"
            style={{ color: textPrimary, fontFamily: "'Inter', sans-serif" }}
          >
            {config.contactName || 'Contact'}
          </span>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M1.5 1L6.5 6L1.5 11" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Right icons (video + phone) */}
      <div className="absolute right-3 bottom-3 flex items-center gap-3">
        <button style={{ color: chevronColor }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill={dark ? '#2C2C2E' : '#E5E5EA'} />
            <path d="M7 11a2 2 0 012-2h5a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6zm10 1.5l3.5-2v7L17 16v-3.5z" fill={chevronColor}/>
          </svg>
        </button>
        <button style={{ color: chevronColor }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill={dark ? '#2C2C2E' : '#E5E5EA'} />
            <path d="M10.5 9C10.5 9 9 9.5 9 11.5C9 15.5 12.5 19 16.5 19C18.5 19 19 17.5 19 17.5L17 15.5C17 15.5 16.5 16 16 16C15.5 16 13 13.5 13 13C13 12.5 13.5 12 13.5 12L11.5 10L10.5 9Z" fill={chevronColor} />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContactHeader;
