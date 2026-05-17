import React, { useState } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { generatePassword, getStrength } from '../utils/passwordGenerator';

const CATS = ['Social','Work','Finance','Shopping','Entertainment','Other'];

export default function AddPasswordModal({ onClose, onAdded }) {
  const toast = useToast();
  const [form, setForm] = useState({ siteName:'', siteUrl:'', username:'', password:'', category:'Other', notes:'' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [genLen, setGenLen] = useState(16);
  const [genOpts, setGenOpts] = useState({ uppercase:true, lowercase:true, numbers:true, symbols:true });
  const strength = getStrength(form.password);
  const sColor = { Weak:'#ef4444', Fair:'#f59e0b', Good:'#3b82f6', Strong:'#22c55e' }[strength.label]||'#ef4444';
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const r = await api.post('/passwords', form);
      onAdded(r.data); toast('Password saved!','success'); onClose();
    } catch (err) { toast(err.response?.data?.message||'Failed to save.','error'); }
    finally { setLoading(false); }
  };

  const L = ({ children }) => <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:6, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>{children}</label>;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(0,0,0,0.72)', backdropFilter:'blur(8px)' }}>
      <div className="glass" style={{ width:'100%', maxWidth:520, borderRadius:24, padding:'28px 30px', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width={18} height={18} fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h2 style={{ fontWeight:800, fontSize:18, color:'#f1f5f9' }}>Add New Password</h2>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', color:'rgba(255,255,255,0.5)', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><L>Site Name *</L><input className="input" name="siteName" required placeholder="GitHub" value={form.siteName} onChange={handle}/></div>
            <div><L>Site URL</L><input className="input" name="siteUrl" placeholder="github.com" value={form.siteUrl} onChange={handle}/></div>
          </div>
          <div><L>Username / Email *</L><input className="input" name="username" required placeholder="your@email.com" value={form.username} onChange={handle}/></div>
          <div>
            <L>Password *</L>
            <div style={{ position:'relative' }}>
              <input className="input" name="password" required type={showPwd?'text':'password'} placeholder="••••••••" value={form.password} onChange={handle} style={{ paddingRight:44, fontFamily:'monospace' }}/>
              <button type="button" onClick={()=>setShowPwd(!showPwd)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', fontSize:15 }}>
                {showPwd?'🙈':'👁'}
              </button>
            </div>
            {form.password && (
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                <div style={{ flex:1, display:'flex', gap:3 }}>
                  {[1,2,3,4,5].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=strength.score?sColor:'rgba(255,255,255,0.08)', transition:'background 0.3s' }}/>)}
                </div>
                <span style={{ fontSize:11, color:sColor, fontWeight:700, width:36 }}>{strength.label}</span>
              </div>
            )}
          </div>
          {/* Generator */}
          <div style={{ background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:14, padding:16 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:700, marginBottom:12, letterSpacing:'0.05em', textTransform:'uppercase' }}>⚙️ Password Generator</p>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', whiteSpace:'nowrap' }}>Length: <strong style={{ color:'#a5b4fc' }}>{genLen}</strong></span>
              <input type="range" min={8} max={32} value={genLen} onChange={e=>setGenLen(+e.target.value)} style={{ flex:1, accentColor:'#6366f1' }}/>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:14, marginBottom:12 }}>
              {Object.keys(genOpts).map(k=>(
                <label key={k} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                  <input type="checkbox" checked={genOpts[k]} onChange={e=>setGenOpts({...genOpts,[k]:e.target.checked})} style={{ accentColor:'#6366f1' }}/>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', textTransform:'capitalize' }}>{k}</span>
                </label>
              ))}
            </div>
            <button type="button" onClick={()=>setForm({...form,password:generatePassword(genLen,genOpts)})} style={{ width:'100%', padding:'9px', borderRadius:10, background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.3)', color:'#a5b4fc', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              ⚡ Generate Strong Password
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><L>Category</L><select className="input" name="category" value={form.category} onChange={handle}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><L>Notes</L><input className="input" name="notes" placeholder="Optional…" value={form.notes} onChange={handle}/></div>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:'11px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
            <button className="btn-primary" type="submit" disabled={loading} style={{ flex:2 }}>{loading?'Saving…':'🔐 Save Password'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
