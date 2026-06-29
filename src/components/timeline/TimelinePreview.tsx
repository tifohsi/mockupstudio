import React from 'react';
import { TimelineConfig } from '../../types';

interface TimelinePreviewProps {
  config: TimelineConfig;
}

const TimelinePreview: React.FC<TimelinePreviewProps> = ({ config }) => {
  const dark = config.theme === 'dark';
  const bg = dark ? '#0F0F0F' : '#FFFFFF';
  const cardBg = dark ? '#1A1A1A' : '#F8F9FA';
  const cardBorder = dark ? '#2A2A2A' : '#E9ECEF';
  const textPrimary = dark ? '#F1F3F5' : '#111827';
  const textSecondary = dark ? '#9CA3AF' : '#6B7280';
  const lineColor = dark ? '#2D2D2D' : '#E5E7EB';

  if (config.style === 'minimal') {
    return (
      <div id="timeline-export-target" style={{
        width: '600px', background: bg, fontFamily: "'Inter', sans-serif",
        borderRadius: '16px', overflow: 'hidden', padding: '40px 48px',
        border: `1px solid ${cardBorder}`,
      }}>
        {config.title && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, margin: 0, letterSpacing: '-0.03em' }}>{config.title}</h2>
            {config.subtitle && <p style={{ fontSize: '14px', color: textSecondary, marginTop: '4px', margin: '4px 0 0' }}>{config.subtitle}</p>}
          </div>
        )}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '11px', top: '6px', bottom: '6px', width: '1px', background: lineColor }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {config.events.map((event, i) => (
              <div key={event.id} style={{ display: 'flex', gap: '24px', paddingBottom: i < config.events.length - 1 ? '28px' : '0' }}>
                {/* Dot */}
                <div style={{ flexShrink: 0, width: '23px', display: 'flex', justifyContent: 'center', paddingTop: '4px' }}>
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: event.color, boxShadow: `0 0 0 3px ${dark ? '#0F0F0F' : '#FFFFFF'}, 0 0 0 4px ${event.color}` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: textPrimary, letterSpacing: '-0.01em' }}>{event.title}</span>
                    <span style={{ fontSize: '12px', color: textSecondary, fontWeight: 500 }}>{event.date}</span>
                  </div>
                  {event.description && (
                    <p style={{ fontSize: '13px', color: textSecondary, margin: 0, lineHeight: 1.55 }}>{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (config.style === 'bold') {
    return (
      <div id="timeline-export-target" style={{
        width: '600px', fontFamily: "'Inter', sans-serif",
        borderRadius: '20px', overflow: 'hidden',
        background: dark ? '#0A0A0A' : config.accentColor,
      }}>
        {/* Header */}
        <div style={{ padding: '36px 40px 28px', background: dark ? '#0A0A0A' : config.accentColor }}>
          {config.title && (
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.04em' }}>{config.title}</h2>
          )}
          {config.subtitle && (
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '6px 0 0', fontWeight: 500 }}>{config.subtitle}</p>
          )}
        </div>
        {/* Events */}
        <div style={{ background: dark ? '#111111' : '#FFFFFF', padding: '8px 0 8px' }}>
          {config.events.map((event, i) => (
            <div key={event.id} style={{
              display: 'flex', alignItems: 'stretch', padding: '0 40px',
              borderBottom: i < config.events.length - 1 ? `1px solid ${dark ? '#1F1F1F' : '#F3F4F6'}` : 'none',
            }}>
              {/* Left date column */}
              <div style={{ width: '80px', flexShrink: 0, paddingTop: '20px', paddingBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: event.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{event.date}</span>
              </div>
              {/* Accent bar */}
              <div style={{ width: '3px', background: event.color, borderRadius: '2px', margin: '12px 20px', flexShrink: 0, opacity: 0.7 }} />
              {/* Content */}
              <div style={{ flex: 1, paddingTop: '20px', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>{event.icon}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: dark ? '#F1F3F5' : '#111827', letterSpacing: '-0.02em' }}>{event.title}</span>
                </div>
                {event.description && (
                  <p style={{ fontSize: '13px', color: dark ? '#6B7280' : '#6B7280', margin: 0, lineHeight: 1.55 }}>{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: cards style
  return (
    <div id="timeline-export-target" style={{
      width: '600px', background: bg, fontFamily: "'Inter', sans-serif",
      borderRadius: '16px', overflow: 'hidden', padding: '36px 36px',
      border: `1px solid ${cardBorder}`,
    }}>
      {(config.title || config.subtitle) && (
        <div style={{ marginBottom: '28px' }}>
          {config.title && <h2 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, margin: 0, letterSpacing: '-0.03em' }}>{config.title}</h2>}
          {config.subtitle && <p style={{ fontSize: '13px', color: textSecondary, margin: '4px 0 0' }}>{config.subtitle}</p>}
        </div>
      )}
      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', background: lineColor, borderRadius: '1px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {config.events.map((event) => (
            <div key={event.id} style={{ position: 'relative' }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: '-32px', top: '14px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: event.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8px',
                boxShadow: `0 0 0 3px ${bg}`,
              }} />
              {/* Card */}
              <div style={{
                background: cardBg, border: `1px solid ${cardBorder}`,
                borderRadius: '12px', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', lineHeight: 1 }}>{event.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, letterSpacing: '-0.01em' }}>{event.title}</span>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: event.color,
                    background: `${event.color}18`, padding: '2px 8px', borderRadius: '999px',
                    flexShrink: 0, marginLeft: '8px',
                  }}>{event.date}</span>
                </div>
                {event.description && (
                  <p style={{ fontSize: '13px', color: textSecondary, margin: 0, lineHeight: 1.55 }}>{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelinePreview;
