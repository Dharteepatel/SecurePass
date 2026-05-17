import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getStrength } from '../utils/passwordGenerator';
import api from '../utils/api';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef();
  const [name, setName] = useState(user?.name||'');
  const [avatar, setAvatar] = useState(user?.avatar||'');
  const [savingProfile, setSavingProfile] = useState(false);
  const [pwd, setPwd] = useState({ current:'', new:'', confirm:'' });
  const [savingPwd, setSavingPwd] = useState(false);
  const [showPwd, setShowPwd] = useState({ current:false, new:false, confirm:false });
  const strength = getStrength(pwd.new);
  const sColor = { Weak:'#ef4444', Fair:'#f59e0b', Good:'#3b82f6', Strong:'#22c55e' }[strength.label]||'#ef4444';
  const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'?';

  const handleAvatarChange = e => {
    const file=e.target.files[0]; if(!file) return;
    if(file.size>2*1024*1024) return toast('Image must be under 2MB.','error');
    const reader=new FileReader(); reader.onload=ev=>setAvatar(ev.target.result); reader.readAsDataURL(file);
  };

  const saveProfile = async e => {
    e.preventDefault(); setSavingProfile(true);
    try { await api.put('/profile',{name,avatar}); await refreshUser(); toast('Profile updated!','success'); }
    catch(err) { toast(err.response?.data?.message||'Update failed.','error'); }
    finally { setSavingProfile(false); }
  };

  const changePassword = async e => {
    e.preventDefault();
    if(pwd.new!==pwd.confirm) return toast('Passwords do not match.','error');
    if(pwd.new.length<8) return toast('Password must be at least 8 characters.','error');
    setSavingPwd(true);
    try { await api.put('/profile/password',{currentPassword:pwd.current,newPassword:pwd.new}); toast('Password changed!','success'); setPwd({current:'',new:'',confirm:''}); }
    catch(err) { toast(err.response?.data?.message||'Failed to change password.','error'); }
    finally { setSavingPwd(false); }
  };

  const EyeBtn = ({ k }) => (
    <button type="button" onClick={()=>setShowPwd(p=>({...p,[k]:!p[k]}))} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', display:'flex' }}>
      <svg width={17} height={17} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPwd[k]?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}/></svg>
    </button>
  );

  const SCard = ({ title, icon, children }) => (
    <div className="card" style={{ padding:28 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{icon}</div>
        <h3 style={{ fontWeight:700, fontSize:15, color:'#f1f5f9' }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, marginBottom:8 }}>
      <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:13, fontWeight:600, color:'#f1f5f9' }}>{value}</span>
    </div>
  );

  return (
    <Layout title="Profile">
      <div style={{ maxWidth:700, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>

        <SCard title="Profile Information" icon="👤">
          <form onSubmit={saveProfile} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:20 }}>
              <div style={{ width:80, height:80, borderRadius:24, background:'rgba(99,102,241,0.12)', border:'2px solid rgba(99,102,241,0.25)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                {avatar ? <img src={avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontSize:28, fontWeight:800, background:'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{initials}</span>}
              </div>
              <div>
                <button type="button" onClick={()=>fileRef.current?.click()} style={{ padding:'8px 18px', borderRadius:10, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)', color:'#a5b4fc', fontSize:13, fontWeight:600, cursor:'pointer', display:'block', marginBottom:8, fontFamily:'inherit' }}>📷 Upload Photo</button>
                {avatar && <button type="button" onClick={()=>setAvatar('')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', fontSize:12, fontFamily:'inherit' }}>Remove photo</button>}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }}/>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:4 }}>JPG, PNG · Max 2MB</p>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div>
                <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:7, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>Full Name</label>
                <input className="input" value={name} onChange={e=>setName(e.target.value)} required/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:7, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>Email (read-only)</label>
                <input className="input" value={user?.email||''} disabled style={{ opacity:0.5, cursor:'not-allowed' }}/>
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={savingProfile} style={{ width:'auto', padding:'10px 26px' }}>{savingProfile?'Saving…':'Save Changes'}</button>
          </form>
        </SCard>

        <SCard title="Account Information" icon="📊">
          <InfoRow label="Member Since" value={new Date(user?.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}/>
          <InfoRow label="Last Login" value={user?.lastLogin?new Date(user.lastLogin).toLocaleString('en-US'):'Just now'}/>
          <InfoRow label="Email Verified" value={user?.isEmailVerified?'✅ Verified':'❌ Not verified'}/>
          <InfoRow label="Two-Factor Auth" value={user?.twoFactorEnabled?'✅ Enabled':'❌ Disabled'}/>
        </SCard>

        <SCard title="Change Password" icon="🔑">
          <form onSubmit={changePassword} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[{label:'Current Password',k:'current'},{label:'New Password',k:'new'},{label:'Confirm New Password',k:'confirm'}].map(f=>(
              <div key={f.k}>
                <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:7, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>{f.label}</label>
                <div style={{ position:'relative' }}>
                  <input className="input" type={showPwd[f.k]?'text':'password'} required value={pwd[f.k]} onChange={e=>setPwd({...pwd,[f.k]:e.target.value})} placeholder="••••••••" style={{ paddingRight:44 }}/>
                  <EyeBtn k={f.k}/>
                </div>
                {f.k==='new'&&pwd.new&&(
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                    <div style={{ flex:1, display:'flex', gap:3 }}>{[1,2,3,4,5].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=strength.score?sColor:'rgba(255,255,255,0.08)', transition:'background 0.3s' }}/>)}</div>
                    <span style={{ fontSize:11, color:sColor, fontWeight:700 }}>{strength.label}</span>
                  </div>
                )}
                {f.k==='confirm'&&pwd.confirm&&pwd.new===pwd.confirm&&<p style={{ marginTop:5, fontSize:11, color:'#4ade80' }}>✓ Passwords match</p>}
              </div>
            ))}
            <button className="btn-primary" type="submit" disabled={savingPwd} style={{ width:'auto', padding:'10px 26px' }}>{savingPwd?'Updating…':'Change Password'}</button>
          </form>
        </SCard>

      </div>
    </Layout>
  );
}
