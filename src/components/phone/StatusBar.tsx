import React from 'react';

interface StatusBarProps {
  time: string;
  batteryLevel: number;
  signalBars: number;
  wifiConnected: boolean;
  dark: boolean;
}

function SignalBars({ bars, color }: { bars: number; color: string }) {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      {[1,2,3,4].map((bar) => (
        <rect key={bar} x={(bar-1)*4.5} y={12-bar*3} width="3" height={bar*3} rx="0.5"
          fill={color} opacity={bar <= bars ? 1 : 0.3} />
      ))}
    </svg>
  );
}

function WifiIcon({ color }: { color: string }) {
  // Real iOS-style WiFi glyph: three concentric arcs + a dot, built with strokes
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      {/* outer arc */}
      <path
        d="M1.2 4.4C4.5 1.2 11.5 1.2 14.8 4.4"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* middle arc */}
      <path
        d="M3.3 6.7C5.6 4.5 10.4 4.5 12.7 6.7"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* inner arc */}
      <path
        d="M5.5 9C6.7 7.8 9.3 7.8 10.5 9"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* dot */}
      <circle cx="8" cy="10.6" r="1" fill={color} />
    </svg>
  );
}

function BatteryIcon({ level, color }: { level: number; color: string }) {
  const fillColor = level <= 20 ? '#FF3B30' : color;
  const w = Math.round((level / 100) * 20);
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
      <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke={color} strokeOpacity="0.35"/>
      <path d="M23.5 4.5V8.5C24.3 8.17 25 7.43 25 6.5C25 5.57 24.3 4.83 23.5 4.5Z" fill={color} fillOpacity="0.4"/>
      <rect x="2" y="2" width={w} height="9" rx="2" fill={fillColor}/>
    </svg>
  );
}

const StatusBar: React.FC<StatusBarProps> = ({ time, batteryLevel, signalBars, wifiConnected, dark }) => {
  const color = dark ? '#FFFFFF' : '#000000';
  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-1" style={{ height: '44px', minHeight: '44px' }}>
      <span className="text-[15px] font-semibold tracking-tight" style={{ color, fontFamily: "'Inter', sans-serif" }}>{time}</span>
      <div className="flex items-center gap-1.5">
        {wifiConnected ? <WifiIcon color={color}/> : <SignalBars bars={signalBars} color={color}/>}
        {wifiConnected && <SignalBars bars={signalBars} color={color}/>}
        <BatteryIcon level={batteryLevel} color={color}/>
      </div>
    </div>
  );
};

export default StatusBar;
