import React from 'react';
import { InstagramFeedConfig, InstagramPost } from '../../types';
import { getInitials } from '../../utils/helpers';
import StatusBar from '../phone/StatusBar';

const STORY_GRADIENT = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

function formatN(n: number) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1).replace(/\.0$/,'')+'M';
  if (n >= 1_000) return (n/1_000).toFixed(1).replace(/\.0$/,'')+'K';
  return n.toLocaleString();
}

function IGVerified() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="#3897F0"><path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm-2 16.5l-4-4 1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5-8 8z"/></svg>;
}

function PostImageCarousel({ urls, placeholderColor }: { urls: string[]; placeholderColor: string }) {
  const [idx, setIdx] = React.useState(0);

  if (urls.length === 0) {
    return (
      <div style={{ width:'100%', paddingTop:'100%', position:'relative', background: placeholderColor }}>
        <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ color:'rgba(255,255,255,0.7)',fontSize:'12px',fontWeight:500 }}>No image</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:'relative', width:'100%', paddingTop:'100%', overflow:'hidden', background:'#000' }}>
      <img src={urls[idx]} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',display:'block' }} alt=""/>
      {urls.length > 1 && (
        <>
          <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0}
            style={{ position:'absolute',left:'8px',top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.5)',border:'none',borderRadius:'50%',width:'30px',height:'30px',cursor:'pointer',color:'white',fontSize:'18px',opacity:idx===0?0:1,pointerEvents:idx===0?'none':'auto',display:'flex',alignItems:'center',justifyContent:'center' }}>‹</button>
          <button onClick={()=>setIdx(i=>Math.min(urls.length-1,i+1))} disabled={idx===urls.length-1}
            style={{ position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.5)',border:'none',borderRadius:'50%',width:'30px',height:'30px',cursor:'pointer',color:'white',fontSize:'18px',opacity:idx===urls.length-1?0:1,pointerEvents:idx===urls.length-1?'none':'auto',display:'flex',alignItems:'center',justifyContent:'center' }}>›</button>
          {/* Dot indicators */}
          <div style={{ position:'absolute',bottom:'10px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'4px' }}>
            {urls.map((_,i)=>(
              <div key={i} style={{ width:'6px',height:'6px',borderRadius:'50%',background:i===idx?'#3897F0':'rgba(255,255,255,0.7)',transition:'background 0.2s' }}/>
            ))}
          </div>
          {/* Counter badge */}
          <div style={{ position:'absolute',top:'10px',right:'10px',background:'rgba(0,0,0,0.6)',borderRadius:'12px',padding:'3px 8px' }}>
            <span style={{ color:'white',fontSize:'12px',fontWeight:600 }}>{idx+1}/{urls.length}</span>
          </div>
        </>
      )}
    </div>
  );
}

function StoryBubble({ post, bg }: { post: InstagramPost; bg: string }) {
  const initials = getInitials(post.username);
  const ringBg = post.hasStory ? STORY_GRADIENT : (bg === '#000000' ? '#3A3A3C' : '#DBDBDB');
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',flexShrink:0 }}>
      <div style={{ padding:'2px',background:ringBg,borderRadius:'50%',width:'60px',height:'60px' }}>
        <div style={{ width:'100%',height:'100%',borderRadius:'50%',border:`2px solid ${bg}`,overflow:'hidden',background:post.avatarColor,display:'flex',alignItems:'center',justifyContent:'center' }}>
          {post.avatarPhotoUrl
            ? <img src={post.avatarPhotoUrl} style={{ width:'100%',height:'100%',objectFit:'cover' }} alt=""/>
            : <span style={{ color:'white',fontWeight:700,fontSize:'18px' }}>{initials}</span>
          }
        </div>
      </div>
      <span style={{ fontSize:'10px',color:'inherit',width:'60px',textAlign:'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
        {post.username}
      </span>
    </div>
  );
}

function PostCard({ post, dark }: { post: InstagramPost; dark: boolean }) {
  const border = dark ? '#262626' : '#DBDBDB';
  const bg = dark ? '#000000' : '#FFFFFF';
  const textPrimary = dark ? '#FFFFFF' : '#000000';
  const textSecondary = dark ? '#A8A8A8' : '#8E8E8E';
  const iconColor = dark ? '#FFFFFF' : '#000000';
  const initials = getInitials(post.username);

  return (
    <div style={{ borderBottom:`1px solid ${border}`, background:bg }}>
      {/* Post header */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'9px' }}>
          <div style={{ padding:'2px',background:post.hasStory ? STORY_GRADIENT : (dark ? '#3A3A3C' : '#DBDBDB'),borderRadius:'50%',width:'34px',height:'34px',flexShrink:0 }}>
            <div style={{ width:'100%',height:'100%',borderRadius:'50%',border:`2px solid ${bg}`,overflow:'hidden',background:post.avatarColor,display:'flex',alignItems:'center',justifyContent:'center' }}>
              {post.avatarPhotoUrl
                ? <img src={post.avatarPhotoUrl} style={{ width:'100%',height:'100%',objectFit:'cover' }} alt=""/>
                : <span style={{ color:'white',fontWeight:700,fontSize:'11px' }}>{initials}</span>
              }
            </div>
          </div>
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:'4px' }}>
              <span style={{ fontSize:'13px',fontWeight:600,color:textPrimary }}>{post.username}</span>
              {post.verified && <IGVerified/>}
            </div>
            {post.location && <span style={{ fontSize:'11px',color:textSecondary }}>{post.location}</span>}
          </div>
        </div>
        <button style={{ background:'none',border:'none',cursor:'pointer',color:iconColor,padding:'4px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Image */}
      <PostImageCarousel urls={post.imageUrls} placeholderColor={post.imagePlaceholderColor}/>

      {/* Actions */}
      <div style={{ padding:'10px 12px 6px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <div style={{ display:'flex',gap:'14px' }}>
          {[
            <svg key="h" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
            <svg key="c" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
            <svg key="s" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
          ].map((ic, i) => <button key={i} style={{ background:'none',border:'none',cursor:'pointer',padding:0 }}>{ic}</button>)}
        </div>
        <button style={{ background:'none',border:'none',cursor:'pointer',padding:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
        </button>
      </div>

      {/* Likes */}
      <div style={{ padding:'0 12px 4px',fontSize:'13px',fontWeight:600,color:textPrimary }}>{formatN(post.likes)} likes</div>

      {/* Caption */}
      {post.caption && (
        <div style={{ padding:'0 12px 6px',fontSize:'13px',color:textPrimary,lineHeight:1.4 }}>
          <span style={{ fontWeight:600 }}>{post.username}</span>{' '}
          <span>{post.caption}</span>
        </div>
      )}

      {/* Time */}
      <div style={{ padding:'0 12px 12px',fontSize:'10px',color:textSecondary,textTransform:'uppercase',letterSpacing:'0.04em' }}>{post.timeAgo}</div>
    </div>
  );
}

const InstagramFeed: React.FC<{ config: InstagramFeedConfig }> = ({ config }) => {
  const dark = config.theme === 'dark';
  const border = dark ? '#262626' : '#DBDBDB';
  const bg = dark ? '#000000' : '#FFFFFF';
  const textPrimary = dark ? '#FFFFFF' : '#000000';
  const textSecondary = dark ? '#A8A8A8' : '#8E8E8E';

  return (
    <div id="instagram-export-target" style={{ position:'relative',width:'393px',height:'852px',flexShrink:0 }}>
      <div style={{ position:'absolute',inset:0,borderRadius:'54px',overflow:'hidden',background:dark?'#1A1A1A':'#E8E8E8', boxShadow:dark?'0 0 0 1.5px #3A3A3A,0 0 0 3px #2A2A2A,inset 0 1px 0 rgba(255,255,255,0.08),0 40px 120px rgba(0,0,0,0.7)':'0 0 0 1.5px #C8C8C8,0 0 0 3px #D8D8D8,inset 0 1px 0 rgba(255,255,255,0.8),0 40px 120px rgba(0,0,0,0.25)' }}>
        <div style={{ position:'absolute',inset:'3px',borderRadius:'52px',overflow:'hidden',background:bg,display:'flex',flexDirection:'column' }}>
          <StatusBar time={config.statusBarTime} batteryLevel={config.batteryLevel} signalBars={4} wifiConnected={true} dark={dark}/>

          {/* IG App header */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 16px 8px',borderBottom:`1px solid ${border}`,background:bg }}>
            {/* App wordmark (generic, non-trademarked styling) */}
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '22px',
              letterSpacing: '-0.02em',
              color: textPrimary,
            }}>
              Instagram
            </span>
            <div style={{ display:'flex',gap:'16px' }}>
              {[
                <svg key="p" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={textPrimary} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
                <svg key="m" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={textPrimary} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
              ].map((ic,i) => <button key={i} style={{ background:'none',border:'none',cursor:'pointer',padding:0 }}>{ic}</button>)}
            </div>
          </div>

          {/* Stories row */}
          <div style={{ borderBottom:`1px solid ${border}`,padding:'10px 12px',background:bg }}>
            <div style={{ display:'flex',gap:'12px',overflowX:'auto',color:textPrimary }}>
              {/* Your story */}
              <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',flexShrink:0 }}>
                <div style={{ width:'60px',height:'60px',borderRadius:'50%',border:`1px dashed ${textSecondary}`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',background:dark?'#1C1C1E':'#F2F2F7' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <span style={{ fontSize:'10px',color:textSecondary }}>Your story</span>
              </div>
              {config.posts.map(post => <StoryBubble key={post.id} post={post} bg={bg}/>)}
            </div>
          </div>

          {/* Feed */}
          <div style={{ flex:1,overflowY:'auto' }}>
            {config.posts.map(post => <PostCard key={post.id} post={post} dark={dark}/>)}
            {config.posts.length === 0 && (
              <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'200px',color:textSecondary,gap:'8px' }}>
                <span style={{ fontSize:'32px' }}>📸</span>
                <span style={{ fontSize:'14px' }}>No posts yet</span>
              </div>
            )}
          </div>

          {/* Bottom nav */}
          <div style={{ display:'flex',justifyContent:'space-around',alignItems:'center',padding:'10px 0 4px',borderTop:`1px solid ${border}`,background:bg }}>
            {[
              <svg key="h" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
              <svg key="s" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>,
              <svg key="a" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>,
              <svg key="r" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
              <div key="u" style={{ width:'22px',height:'22px',borderRadius:'50%',background:'#657786',border:`2px solid ${textPrimary}` }}/>,
            ].map((ic,i) => (
              <button key={i} style={{ background:'none',border:'none',cursor:'pointer',color:i===0?'#E1306C':textPrimary,padding:'4px 8px',display:'flex',alignItems:'center',justifyContent:'center' }}>
                {ic}
              </button>
            ))}
          </div>
          <div style={{ display:'flex',justifyContent:'center',paddingBottom:'8px',background:bg }}>
            <div style={{ width:'134px',height:'5px',borderRadius:'3px',background:dark?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.2)' }}/>
          </div>
        </div>
        <div style={{ position:'absolute',inset:0,borderRadius:'54px',background:'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 60%)',pointerEvents:'none' }}/>
      </div>
      {[{t:'116px'},{t:'160px'},{t:'206px'}].map((s,i)=>(
        <div key={i} style={{ position:'absolute',left:'-3px',top:s.t,width:'3px',height:'36px',borderRadius:'2px 0 0 2px',background:dark?'#2A2A2A':'#C0C0C0' }}/>
      ))}
      <div style={{ position:'absolute',right:'-3px',top:'176px',width:'3px',height:'72px',borderRadius:'0 2px 2px 0',background:dark?'#2A2A2A':'#C0C0C0' }}/>
    </div>
  );
};

export default InstagramFeed;
