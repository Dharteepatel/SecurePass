import React, { useState } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const CC = { Social:'cat-social', Work:'cat-work', Finance:'cat-finance', Shopping:'cat-shopping', Entertainment:'cat-entertainment', Other:'cat-other' };

export default function PasswordCard({ entry, onDelete, onToggleFavorite }) {
  const toast = useToast();
  const [showPwd, setShowPwd] = useState(false);
  const [copied, setCopied] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const copy = async (text, field) => {
    try {
      try { await navigator.clipboard.writeText(text); }
      catch { const t=document.createElement('textarea'); t.value=text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
      setCopied(field); toast(`${field==='username'?'Username':'Password'} copied!`,'success');
      setTimeout(()=>setCopied(null),2000);
    } catch {}
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${entry.siteName}"?`)) return;
    setDeleting(true);
    try { await api.delete(`/passwords/${entry._id}`); onDelete(entry._id); toast('Entry deleted.','info'); }
    catch { toast('Delete failed.','error'); setDeleting(false); }
  };

  const handleFav = async () => {
    if (favLoading) return; setFavLoading(true);
    try { const r=await api.patch(`/passwords/${entry._id}/favorite`); onToggleFavorite(entry._id,r.data.isFavorite); }
    catch {} finally { setFavLoading(false); }
  };

  const favicon = entry.siteUrl ? `https://www.google.com/s2/favicons?domain=${entry.siteUrl}&sz=32` : null;

  return (
    <div className="card" style={{ padding:20, display:'flex', flexDirection:'column', gap:16, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#4f46e5,#7c3aed)', opacity:0.5, borderRadius:'16px 16px 0 0' }} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.15)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
            {favicon ? <img src={favicon} alt="" width={22} onError={e=>{e.target.style.display='none';}} /> : null}
            <span style={{ fontWeight:800, color:'#818cf8', fontSize:16 }}>{entry.siteName?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p style={{ fontWeight:700, fontSize:14, color:'#f1f5f9', marginBottom:2 }}>{entry.siteName}</p>
            {entry.siteUrl && <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', maxWidth:130, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{entry.siteUrl}</p>}
          </div>
        </div>
        <div style={{ display:'flex', gap:2 }}>
          <button onClick={handleFav} style={{ background:'none', border:'none', cursor:'pointer', padding:6, borderRadius:8, color:entry.isFavorite?'#fbbf24':'rgba(255,255,255,0.2)', fontSize:18, lineHeight:1, transition:'transform 0.1s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.15)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            {entry.isFavorite?'★':'☆'}
          </button>
          <button onClick={handleDelete} disabled={deleting} style={{ background:'none', border:'none', cursor:'pointer', padding:6, borderRadius:8, color:'rgba(255,255,255,0.2)', display:'flex', transition:'color 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.color='#f87171'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.2)'}>
            <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>

      {/* Fields */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {/* Username */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, padding:'8px 12px', gap:8 }}>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginBottom:3, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>Username</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{entry.username}</p>
          </div>
          <button onClick={()=>copy(entry.username,'username')} style={{ fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:8, border:'none', cursor:'pointer', flexShrink:0, transition:'all 0.15s', background:copied==='username'?'rgba(34,197,94,0.15)':'rgba(255,255,255,0.07)', color:copied==='username'?'#4ade80':'rgba(255,255,255,0.5)' }}>
            {copied==='username'?'✓ Copied':'Copy'}
          </button>
        </div>
        {/* Password */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, padding:'8px 12px', gap:8 }}>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginBottom:3, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>Password</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', fontFamily:'monospace', letterSpacing:showPwd?1:4 }}>{showPwd?entry.password:'••••••••'}</p>
          </div>
          <div style={{ display:'flex', gap:4, flexShrink:0 }}>
            <button onClick={()=>setShowPwd(!showPwd)} style={{ background:'rgba(255,255,255,0.07)', border:'none', borderRadius:8, cursor:'pointer', padding:'5px 9px', color:'rgba(255,255,255,0.45)', fontSize:12, display:'flex', alignItems:'center' }}>
              {showPwd?'🙈':'👁'}
            </button>
            <button onClick={()=>copy(entry.password,'password')} style={{ fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:8, border:'none', cursor:'pointer', transition:'all 0.15s', background:copied==='password'?'rgba(34,197,94,0.15)':'rgba(255,255,255,0.07)', color:copied==='password'?'#4ade80':'rgba(255,255,255,0.5)' }}>
              {copied==='password'?'✓ Copied':'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }} className={CC[entry.category]||'cat-other'}>{entry.category}</span>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)' }}>{new Date(entry.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
      </div>
    </div>
  );
}
