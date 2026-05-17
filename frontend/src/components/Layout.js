import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Icon = ({ d, size=20 }) => <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d}/></svg>;
const D = {
  dash: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  profile: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  menu: 'M4 6h16M4 12h16M4 18h7',
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  moon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  close: 'M6 18L18 6M6 6l12 12',
};

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const nav = [
    { path:'/',         label:'Dashboard', icon:D.dash },
    { path:'/profile',  label:'Profile',   icon:D.profile },
    { path:'/settings', label:'Settings',  icon:D.settings },
  ];

  const isLight = theme==='light';
  const tp = isLight?'#0f172a':'#f1f5f9';
  const tm = isLight?'#64748b':'rgba(255,255,255,0.45)';
  const sb = isLight?'rgba(0,0,0,0.07)':'rgba(255,255,255,0.06)';
  const dbg = isLight?'#fff':'#15152a';
  const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'?';
  const AEl = user?.avatar
    ? <img src={user.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
    : <span style={{ color:'#818cf8', fontWeight:800, fontSize:13 }}>{initials}</span>;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:isLight?'#f1f5f9':'#0a0a0f' }}>
      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:98, backdropFilter:'blur(4px)' }} />}

      <aside style={{ width:228, flexShrink:0, background:isLight?'#fff':'#0c0c15', borderRight:`1px solid ${sb}`, display:'flex', flexDirection:'column', padding:'20px 12px', position:'fixed', top:0, bottom:0, left:sidebarOpen?0:-240, zIndex:99, transition:'left 0.25s cubic-bezier(0.4,0,0.2,1)', boxShadow:sidebarOpen?'4px 0 24px rgba(0,0,0,0.3)':'none' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 6px', marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(79,70,229,0.4)', flexShrink:0 }}>
              <Icon d={D.lock} size={17}/>
            </div>
            <span style={{ fontWeight:800, fontSize:15, color:tp, letterSpacing:'-0.01em' }}>SecurePass</span>
          </div>
          <button onClick={()=>setSidebarOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:tm, padding:4, display:'flex' }}><Icon d={D.close} size={18}/></button>
        </div>

        <p style={{ fontSize:10, fontWeight:700, color:tm, letterSpacing:'0.08em', textTransform:'uppercase', padding:'0 8px', marginBottom:6 }}>Navigation</p>
        <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          {nav.map(item => (
            <button key={item.path} className={`sidebar-link ${location.pathname===item.path?'active':''}`} onClick={()=>{navigate(item.path);setSidebarOpen(false);}}>
              <Icon d={item.icon} size={17}/>{item.label}
            </button>
          ))}
        </nav>

        <div style={{ height:1, background:sb, margin:'12px 4px' }} />
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          <button className="sidebar-link" onClick={()=>{toggleTheme();setSidebarOpen(false);}}><Icon d={isLight?D.moon:D.sun} size={17}/>{isLight?'Dark Mode':'Light Mode'}</button>
          <button className="sidebar-link" onClick={handleLogout} style={{ color:'#f87171' }}><Icon d={D.logout} size={17}/>Sign Out</button>
        </div>
        <div style={{ marginTop:12, padding:'10px', borderRadius:12, background:isLight?'#f8fafc':'rgba(255,255,255,0.04)', border:`1px solid ${sb}`, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(99,102,241,0.15)', border:'2px solid rgba(99,102,241,0.3)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>{AEl}</div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:12, fontWeight:700, color:tp, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</p>
            <p style={{ fontSize:10, color:tm, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p>
          </div>
        </div>
      </aside>

      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        <header style={{ height:60, background:isLight?'rgba(255,255,255,0.92)':'rgba(10,10,18,0.88)', borderBottom:`1px solid ${sb}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={()=>setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:tm, padding:6, borderRadius:8, display:'flex' }}><Icon d={D.menu} size={22}/></button>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon d={D.lock} size={14}/></div>
              <h1 style={{ fontWeight:700, fontSize:15, color:tp }}>{title}</h1>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={toggleTheme} style={{ width:36, height:36, borderRadius:10, background:isLight?'#f1f5f9':'rgba(255,255,255,0.06)', border:`1px solid ${sb}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:tm }}>
              <Icon d={isLight?D.moon:D.sun} size={16}/>
            </button>
            <div style={{ position:'relative' }}>
              <button onClick={()=>setProfileOpen(!profileOpen)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(99,102,241,0.15)', border:'2px solid rgba(99,102,241,0.3)', overflow:'hidden', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{AEl}</button>
              {profileOpen && (
                <>
                  <div onClick={()=>setProfileOpen(false)} style={{ position:'fixed', inset:0, zIndex:49 }} />
                  <div style={{ position:'absolute', right:0, top:'calc(100% + 10px)', width:210, background:dbg, border:`1px solid ${sb}`, borderRadius:16, padding:8, zIndex:50, boxShadow:`0 16px 48px rgba(0,0,0,${isLight?0.12:0.45})`, animation:'dropIn 0.15s ease' }}>
                    <div style={{ padding:'10px 12px', borderBottom:`1px solid ${sb}`, marginBottom:4 }}>
                      <p style={{ fontWeight:700, fontSize:13, color:tp, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</p>
                      <p style={{ fontSize:11, color:tm, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p>
                    </div>
                    {[{label:'Profile',path:'/profile'},{label:'Settings',path:'/settings'}].map(item => (
                      <button key={item.path} onClick={()=>{navigate(item.path);setProfileOpen(false);}} style={{ width:'100%', textAlign:'left', padding:'9px 12px', background:'none', border:'none', cursor:'pointer', borderRadius:10, fontSize:13, color:tm, fontFamily:'inherit', display:'flex', alignItems:'center', gap:10, transition:'background 0.1s' }}
                        onMouseEnter={e=>e.currentTarget.style.background=isLight?'#f1f5f9':'rgba(255,255,255,0.06)'}
                        onMouseLeave={e=>e.currentTarget.style.background='none'}>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop:`1px solid ${sb}`, marginTop:4, paddingTop:4 }}>
                      <button onClick={handleLogout} style={{ width:'100%', textAlign:'left', padding:'9px 12px', background:'none', border:'none', cursor:'pointer', borderRadius:10, fontSize:13, color:'#f87171', fontFamily:'inherit', transition:'background 0.1s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                        onMouseLeave={e=>e.currentTarget.style.background='none'}>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main style={{ flex:1, padding:'24px 20px', overflowY:'auto', maxWidth:1200, width:'100%', margin:'0 auto', boxSizing:'border-box' }}>
          {children}
        </main>
      </div>
      <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-8px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}
