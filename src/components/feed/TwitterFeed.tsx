import React from 'react';
import { TwitterFeedConfig, TwitterPost } from '../../types';
import { getInitials } from '../../utils/helpers';
import StatusBar from '../phone/StatusBar';

function formatN(n: number) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1).replace(/\.0$/,'')+'M';
  if (n >= 1_000) return (n/1_000).toFixed(1).replace(/\.0$/,'')+'K';
  return n.toLocaleString();
}

function XLogo({ size=20, color='currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.26 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>;
}

function VerifiedBadge({ type }: { type: 'blue'|'gold'|'gray' }) {
  const color = type==='blue'?'#1D9BF0':type==='gold'?'#FFD400':'#829AAB';
  return <svg width="16" height="16" viewBox="0 0 22 22" fill="none" style={{flexShrink:0}}>
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.124-.49.124-1.003 0-1.493.498-.309.882-.749 1.092-1.258s.239-1.07.084-1.595c-.523-.197-1.087-.194-1.608.006-.521.2-.979.567-1.302 1.05-.26-.484-.628-.897-1.07-1.205s-.952-.502-1.482-.568c-.53.066-1.04.26-1.483.568-.441.308-.809.72-1.07 1.205-.322-.483-.78-.85-1.302-1.05-.521-.2-1.085-.203-1.608-.006-.154.525-.126 1.086.084 1.595.21.509.594.949 1.092 1.258-.124.49-.124 1.002 0 1.493-.586.274-1.084.706-1.438 1.246-.355.541-.552 1.17-.57 1.816.018.646.215 1.275.57 1.817.353.54.852.972 1.437 1.246-.124.49-.124 1.002 0 1.493-.498.309-.882.748-1.092 1.257-.21.509-.239 1.07-.084 1.595.523.198 1.087.195 1.608-.005.521-.2.98-.568 1.302-1.05.26.484.629.897 1.07 1.205.443.307.953.501 1.482.568.53-.067 1.04-.261 1.483-.568.441-.308.81-.721 1.07-1.205.322.482.78.85 1.302 1.05.521.2 1.085.203 1.608.005.155-.525.126-1.086-.084-1.595-.21-.509-.594-.948-1.092-1.257.124-.49.124-1.003 0-1.493.585-.274 1.084-.706 1.438-1.246.354-.542.551-1.171.57-1.817z" fill={color}/>
    <path d="M7.5 11.5l2.5 2.5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

function ImageGrid({ urls, dark }: { urls: string[]; dark: boolean }) {
  const [idx, setIdx] = React.useState(0);
  if (!urls.length) return null;
  const border = dark ? '#2F3336' : '#CFD9DE';
  if (urls.length === 1) return (
    <div style={{ borderRadius:'16px', overflow:'hidden', border:`1px solid ${border}`, marginTop:'4px' }}>
      <img src={urls[0]} style={{ width:'100%', maxHeight:'240px', objectFit:'cover', display:'block' }} alt=""/>
    </div>
  );
  if (urls.length === 2) return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px', borderRadius:'16px', overflow:'hidden', border:`1px solid ${border}`, marginTop:'4px' }}>
      {urls.map((u,i) => <img key={i} src={u} style={{ width:'100%', height:'130px', objectFit:'cover', display:'block' }} alt=""/>)}
    </div>
  );
  // 3+ = carousel
  return (
    <div style={{ borderRadius:'16px', overflow:'hidden', border:`1px solid ${border}`, marginTop:'4px', position:'relative' }}>
      <img src={urls[idx]} style={{ width:'100%', maxHeight:'240px', objectFit:'cover', display:'block' }} alt=""/>
      <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0} style={{ position:'absolute',left:'8px',top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.55)',border:'none',borderRadius:'50%',width:'28px',height:'28px',cursor:'pointer',color:'white',fontSize:'18px',lineHeight:'1',opacity:idx===0?0.3:1 }}>‹</button>
      <button onClick={()=>setIdx(i=>Math.min(urls.length-1,i+1))} disabled={idx===urls.length-1} style={{ position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.55)',border:'none',borderRadius:'50%',width:'28px',height:'28px',cursor:'pointer',color:'white',fontSize:'18px',lineHeight:'1',opacity:idx===urls.length-1?0.3:1 }}>›</button>
      <div style={{ position:'absolute',bottom:'8px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'4px' }}>
        {urls.map((_,i)=><div key={i} style={{ width:'5px',height:'5px',borderRadius:'50%',background:i===idx?'#1D9BF0':'rgba(255,255,255,0.6)' }}/>)}
      </div>
    </div>
  );
}

function TweetCard({ post, dark, dim }: { post: TwitterPost; dark: boolean; dim: boolean }) {
  const textPrimary = dark||dim ? '#E7E9EA' : '#0F1419';
  const textSecondary = dark||dim ? '#71767B' : '#536471';
  const divider = dark ? '#2F3336' : dim ? '#38444D' : '#EFF3F4';
  const cardBg = dark ? '#000000' : dim ? '#15202B' : '#FFFFFF';
  const initials = getInitials(post.username);
  return (
    <div style={{ background:cardBg, padding:'12px 16px', borderBottom:`1px solid ${divider}` }}>
      <div style={{ display:'flex', gap:'10px' }}>
        <div style={{ width:'40px',height:'40px',borderRadius:'50%',background:post.avatarColor,flexShrink:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center' }}>
          {post.avatarPhotoUrl ? <img src={post.avatarPhotoUrl} style={{ width:'100%',height:'100%',objectFit:'cover' }} alt=""/> : <span style={{ color:'white',fontWeight:700,fontSize:'15px' }}>{initials}</span>}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2px' }}>
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'3px', flex:1, minWidth:0 }}>
              <span style={{ fontWeight:700,fontSize:'14px',color:textPrimary,whiteSpace:'nowrap' }}>{post.username}</span>
              {post.verified && <VerifiedBadge type={post.verifiedType}/>}
              <span style={{ fontSize:'13px',color:textSecondary,whiteSpace:'nowrap' }}>@{post.handle} · {post.timestamp}</span>
            </div>
            <span style={{ color:textSecondary,fontSize:'18px',paddingLeft:'8px',flexShrink:0 }}>···</span>
          </div>
          <p style={{ fontSize:'14px',lineHeight:1.5,color:textPrimary,margin:'0',whiteSpace:'pre-wrap',wordBreak:'break-word' }}>{post.text}</p>
          <ImageGrid urls={post.imageUrls} dark={dark||dim}/>
          <div style={{ display:'flex',marginTop:'10px',marginLeft:'-6px' }}>
            {[
              [<svg key="r" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, formatN(post.replies)],
              [<svg key="rt" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>, formatN(post.retweets)],
              [<svg key="l" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, formatN(post.likes)],
              [<svg key="v" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, formatN(post.views)],
            ].map(([icon,val],i) => (
              <div key={i} style={{ display:'flex',alignItems:'center',gap:'4px',color:textSecondary,padding:'3px 6px',borderRadius:'999px',flex:1 }}>
                {icon}<span style={{ fontSize:'12px' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TwitterFeed: React.FC<{ config: TwitterFeedConfig }> = ({ config }) => {
  const dark = config.theme === 'dark';
  const dim = config.theme === 'dim';
  const isNight = dark || dim;
  const bg = dark ? '#000000' : dim ? '#15202B' : '#FFFFFF';
  const tabBorder = dark ? '#2F3336' : dim ? '#38444D' : '#EFF3F4';
  const textPrimary = isNight ? '#E7E9EA' : '#0F1419';
  const textSecondary = isNight ? '#71767B' : '#536471';

  return (
    <div id="twitter-export-target" style={{ position:'relative', width:'393px', height:'852px', flexShrink:0 }}>
      <div style={{ position:'absolute',inset:0,borderRadius:'54px',overflow:'hidden', background:isNight?'#1A1A1A':'#E8E8E8', boxShadow: isNight?'0 0 0 1.5px #3A3A3A,0 0 0 3px #2A2A2A,inset 0 1px 0 rgba(255,255,255,0.08),0 40px 120px rgba(0,0,0,0.7)':'0 0 0 1.5px #C8C8C8,0 0 0 3px #D8D8D8,inset 0 1px 0 rgba(255,255,255,0.8),0 40px 120px rgba(0,0,0,0.25)' }}>
        <div style={{ position:'absolute',inset:'3px',borderRadius:'52px',overflow:'hidden',background:bg,display:'flex',flexDirection:'column' }}>
          <StatusBar time={config.statusBarTime} batteryLevel={config.batteryLevel} signalBars={4} wifiConnected={true} dark={isNight}/>
          {/* App header */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 16px 8px',borderBottom:`1px solid ${tabBorder}`,background:bg }}>
            <div style={{ width:'32px',height:'32px',borderRadius:'50%',background:'#657786' }}/>
            <XLogo size={24} color={textPrimary}/>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textPrimary} strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          </div>
          {/* Tabs */}
          <div style={{ display:'flex', borderBottom:`1px solid ${tabBorder}`, background:bg }}>
            {['For you','Following'].map((tab,i) => (
              <div key={tab} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'10px 0 0',cursor:'pointer' }}>
                <span style={{ fontSize:'14px',fontWeight:i===0?700:400,color:i===0?textPrimary:textSecondary }}>{tab}</span>
                {i===0 ? <div style={{ width:'56px',height:'4px',borderRadius:'2px',background:'#1D9BF0',marginTop:'8px' }}/> : <div style={{ height:'4px',marginTop:'8px' }}/>}
              </div>
            ))}
          </div>
          {/* Feed */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {config.posts.map(post => <TweetCard key={post.id} post={post} dark={dark} dim={dim}/>)}
            {config.posts.length === 0 && (
              <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'200px',color:textSecondary,gap:'8px' }}>
                <span style={{ fontSize:'32px' }}>𝕏</span>
                <span style={{ fontSize:'14px' }}>No posts yet</span>
              </div>
            )}
          </div>
          {/* Bottom nav */}
          <div style={{ display:'flex',justifyContent:'space-around',padding:'10px 0 4px',borderTop:`1px solid ${tabBorder}`,background:bg }}>
            {[
              <path key="h" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>,
              null,null,null
            ].map((_,i) => (
              <button key={i} style={{ background:'none',border:'none',cursor:'pointer',color:i===0?'#1D9BF0':textSecondary,padding:'4px 12px' }}>
                {i===0 && <svg width="22" height="22" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>}
                {i===1 && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>}
                {i===2 && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>}
                {i===3 && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
              </button>
            ))}
          </div>
          <div style={{ display:'flex',justifyContent:'center',paddingBottom:'8px',background:bg }}>
            <div style={{ width:'134px',height:'5px',borderRadius:'3px',background:isNight?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.2)' }}/>
          </div>
        </div>
        <div style={{ position:'absolute',inset:0,borderRadius:'54px',background:'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 60%)',pointerEvents:'none' }}/>
      </div>
      {[{t:'116px'},{t:'160px'},{t:'206px'}].map((s,i)=><div key={i} style={{ position:'absolute',left:'-3px',top:s.t,width:'3px',height:'36px',borderRadius:'2px 0 0 2px',background:isNight?'#2A2A2A':'#C0C0C0' }}/>)}
      <div style={{ position:'absolute',right:'-3px',top:'176px',width:'3px',height:'72px',borderRadius:'0 2px 2px 0',background:isNight?'#2A2A2A':'#C0C0C0' }}/>
    </div>
  );
};

export default TwitterFeed;
