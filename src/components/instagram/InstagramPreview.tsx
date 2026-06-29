import React from 'react';
import { InstagramConfig } from '../../types';
import { getInitials } from '../../utils/helpers';

interface InstagramPreviewProps {
  config: InstagramConfig;
}

function formatLikes(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

function InstagramVerified() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3897F0">
      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm-2 16.5l-4-4 1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5-8 8z" />
    </svg>
  );
}

const aspectRatioMap = {
  '1:1': '100%',
  '4:5': '125%',
  '1.91:1': '52.36%',
};

const InstagramPreview: React.FC<InstagramPreviewProps> = ({ config }) => {
  const dark = config.theme === 'dark';
  const bg = dark ? '#000000' : '#FFFFFF';
  const textPrimary = dark ? '#FFFFFF' : '#000000';
  const textSecondary = dark ? '#A8A8A8' : '#8E8E8E';
  const border = dark ? '#262626' : '#DBDBDB';
  const iconColor = dark ? '#FFFFFF' : '#000000';

  const initials = getInitials(config.username);

  // Instagram gradient for story ring
  const storyGradient = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

  return (
    <div
      id="instagram-export-target"
      style={{
        width: '468px',
        background: bg,
        fontFamily: "'Inter', sans-serif",
        border: `1px solid ${border}`,
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Avatar with story ring */}
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%', padding: '2px',
            background: storyGradient, flexShrink: 0,
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              border: `2px solid ${bg}`, overflow: 'hidden',
              background: config.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {config.avatarPhotoUrl
                ? <img src={config.avatarPhotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{initials}</span>
              }
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: 600, fontSize: '13.5px', color: textPrimary, lineHeight: 1.2 }}>
                {config.username || 'username'}
              </span>
              {config.verified && <InstagramVerified />}
            </div>
            {config.location && (
              <div style={{ fontSize: '11px', color: textSecondary, marginTop: '1px' }}>{config.location}</div>
            )}
          </div>
        </div>
        {/* More icon */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: '4px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Post image */}
      <div style={{ width: '100%', position: 'relative', paddingTop: aspectRatioMap[config.aspectRatio], background: config.postImageColor, overflow: 'hidden' }}>
        {config.postImageUrl
          ? <img src={config.postImageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '8px',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500 }}>No image</span>
            </div>
          )
        }
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 6px' }}>
        <div style={{ display: 'flex', gap: '14px' }}>
          {/* Heart */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          {/* Comment */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </button>
          {/* Share */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        {/* Bookmark */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      </div>

      {/* Likes */}
      <div style={{ padding: '0 16px 6px', fontSize: '13.5px', fontWeight: 600, color: textPrimary }}>
        {formatLikes(config.likes)} likes
      </div>

      {/* Caption */}
      {config.caption && (
        <div style={{ padding: '0 16px 8px', fontSize: '13.5px', color: textPrimary, lineHeight: 1.55 }}>
          <span style={{ fontWeight: 600 }}>{config.username}</span>
          {' '}
          <span>{config.caption}</span>
        </div>
      )}

      {/* Time */}
      <div style={{ padding: '0 16px 16px', fontSize: '11px', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        {config.timeAgo}
      </div>
    </div>
  );
};

export default InstagramPreview;
