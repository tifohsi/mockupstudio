import React from 'react';
import { TwitterConfig } from '../../types';
import { getInitials } from '../../utils/helpers';

interface TwitterPreviewProps {
  config: TwitterConfig;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

function VerifiedBadge({ type }: { type: 'blue' | 'gold' | 'gray' }) {
  const color = type === 'blue' ? '#1D9BF0' : type === 'gold' ? '#FFD400' : '#829AAB';
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.124-.49.124-1.003 0-1.493.498-.309.882-.749 1.092-1.258s.239-1.07.084-1.595c-.523-.197-1.087-.194-1.608.006-.521.2-.979.567-1.302 1.05-.26-.484-.628-.897-1.07-1.205s-.952-.502-1.482-.568c-.53.066-1.04.26-1.483.568-.441.308-.809.72-1.07 1.205-.322-.483-.78-.85-1.302-1.05-.521-.2-1.085-.203-1.608-.006-.154.525-.126 1.086.084 1.595.21.509.594.949 1.092 1.258-.124.49-.124 1.002 0 1.493-.586.274-1.084.706-1.438 1.246-.355.541-.552 1.17-.57 1.816.018.646.215 1.275.57 1.817.353.54.852.972 1.437 1.246-.124.49-.124 1.002 0 1.493-.498.309-.882.748-1.092 1.257-.21.509-.239 1.07-.084 1.595.523.198 1.087.195 1.608-.005.521-.2.98-.568 1.302-1.05.26.484.629.897 1.07 1.205.443.307.953.501 1.482.568.53-.067 1.04-.261 1.483-.568.441-.308.81-.721 1.07-1.205.322.482.78.85 1.302 1.05.521.2 1.085.203 1.608.005.155-.525.126-1.086-.084-1.595-.21-.509-.594-.948-1.092-1.257.124-.49.124-1.003 0-1.493.585-.274 1.084-.706 1.438-1.246.354-.542.551-1.171.57-1.817z"
        fill={color}
      />
      <path d="M7.5 11.5l2.5 2.5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XLogo({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.26 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const TwitterPreview: React.FC<TwitterPreviewProps> = ({ config }) => {
  const dark = config.theme === 'dark';
  const dim = config.theme === 'dim';

  const bg = dark ? '#000000' : dim ? '#15202B' : '#FFFFFF';
  const cardBg = dark ? '#16181C' : dim ? '#1E2732' : '#FFFFFF';
  const border = dark ? '#2F3336' : dim ? '#38444D' : '#CFD9DE';
  const textPrimary = dark || dim ? '#E7E9EA' : '#0F1419';
  const textSecondary = dark || dim ? '#71767B' : '#536471';
  const actionColor = dark || dim ? '#71767B' : '#536471';
  const divider = dark ? '#2F3336' : dim ? '#38444D' : '#EFF3F4';

  const initials = getInitials(config.username);

  return (
    <div
      id="twitter-export-target"
      style={{
        width: '598px',
        background: bg,
        fontFamily: "'Inter', sans-serif",
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${border}`,
      }}
    >
      {/* Card */}
      <div style={{ background: cardBg, padding: '16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            {/* Avatar */}
            <div
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: config.avatarColor, flexShrink: 0,
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {config.avatarPhotoUrl
                ? <img src={config.avatarPhotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>{initials}</span>
              }
            </div>
            {/* Name + handle */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: textPrimary, lineHeight: 1.2 }}>
                  {config.username || 'Username'}
                </span>
                {config.verified && <VerifiedBadge type={config.verifiedType} />}
              </div>
              <div style={{ fontSize: '14px', color: textSecondary, marginTop: '1px' }}>
                @{config.handle || 'handle'}
              </div>
            </div>
          </div>
          {/* X/Twitter logo */}
          <div style={{ color: textPrimary, marginTop: '2px' }}>
            <XLogo size={22} color={textPrimary} />
          </div>
        </div>

        {/* Tweet text */}
        <div style={{
          fontSize: '17px', lineHeight: '1.55', color: textPrimary,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: '16px',
          letterSpacing: '-0.01em',
        }}>
          {config.tweetText || 'What\'s happening?'}
        </div>

        {/* Attached image */}
        {config.imageUrl && (
          <div style={{
            borderRadius: '16px', overflow: 'hidden', marginBottom: '16px',
            border: `1px solid ${border}`,
          }}>
            <img src={config.imageUrl} alt="" style={{ width: '100%', display: 'block', maxHeight: '400px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Timestamp */}
        <div style={{ fontSize: '14px', color: textSecondary, marginBottom: '12px' }}>
          {config.timestamp}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: divider, marginBottom: '12px' }} />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
          {[
            { label: 'Reposts', value: formatCount(config.retweets) },
            { label: 'Quotes', value: formatCount(Math.floor(config.retweets * 0.3)) },
            { label: 'Likes', value: formatCount(config.likes) },
            { label: 'Bookmarks', value: formatCount(Math.floor(config.likes * 0.15)) },
            { label: 'Views', value: formatCount(config.views) },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: '4px', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: textPrimary }}>{value}</span>
              <span style={{ fontSize: '14px', color: textSecondary }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: divider, marginBottom: '4px' }} />

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
          {/* Reply */}
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: actionColor, padding: '8px', borderRadius: '9999px' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{formatCount(config.replies)}</span>
          </button>
          {/* Retweet */}
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: actionColor, padding: '8px', borderRadius: '9999px' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" />
              <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{formatCount(config.retweets)}</span>
          </button>
          {/* Like */}
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: actionColor, padding: '8px', borderRadius: '9999px' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{formatCount(config.likes)}</span>
          </button>
          {/* Bookmark */}
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: actionColor, padding: '8px', borderRadius: '9999px' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
          {/* Share */}
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: actionColor, padding: '8px', borderRadius: '9999px' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterPreview;
