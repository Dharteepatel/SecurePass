import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Toggle = ({ label, desc, checked, onChange }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
    <div><p style={{ fontSize:13, fontWeight:600, color:'#f1f5f9', marginBottom:2 }}>{label}</p>{desc&&<p style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{desc}</p>}</div>
    <button onClick={onChange} style={{ width:44, height:24, borderRadius:12, border:'none', cursor:'pointer', transition:'background 0.2s', background:checked?'#4f46e5':'rgba(255,255,255,0.1)', position:'relative', flexShrink:0 }}>
      <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:3, transition:'left 0.2s', left:checked?22:4, boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }}/>
    </button>
  </div>
);

const Section = ({ title, icon, children, defaultOpen=false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card" style={{ overflow:'hidden' }}>
      <button onClick={()=>setOpen(!open)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', background:'none', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{icon}</div>
          <span style={{ fontWeight:700, fontSize:14, color:'#f1f5f9' }}>{title}</span>
        </div>
        <svg width={18} height={18} fill="none" stroke="rgba(255,255,255,0.35)" viewBox="0 0 24 24" style={{ transition:'transform 0.2s', transform:open?'rotate(180deg)':'none', flexShrink:0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open&&<div style={{ padding:'4px 22px 22px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>{children}</div>}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
    <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{label}</span>
    <span style={{ fontSize:13, fontWeight:600, color:'#f1f5f9' }}>{value}</span>
  </div>
);

const Btn = ({ onClick, children, color='#a5b4fc', bg='rgba(99,102,241,0.12)', border='rgba(99,102,241,0.3)' }) => (
  <button onClick={onClick} style={{ padding:'9px 20px', borderRadius:10, background:bg, border:`1px solid ${border}`, color, fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>{children}</button>
);

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const notif = user?.settings?.notifications||{};
  const privacy = user?.settings?.privacy||{};

  const saveSetting = async data => {
    try { await api.put('/settings',data); await refreshUser(); toast('Settings saved!','success'); }
    catch { toast('Failed to save.','error'); }
  };

  const toggle2FA = async () => {
    try { const r=await api.put('/settings/2fa'); await refreshUser(); toast(r.data.message,'success'); }
    catch { toast('Failed.','error'); }
  };

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePwd, setDeletePwd] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteAccount = async () => {
    if (deleteConfirm!=='DELETE') return toast('Type DELETE to confirm.','error');
    try { await api.delete('/profile',{data:{password:deletePwd}}); logout(); navigate('/login'); toast('Account deleted.','info'); }
    catch(err) { toast(err.response?.data?.message||'Delete failed.','error'); }
  };

  return (
    <Layout title="Settings">
      <div style={{ maxWidth:700, margin:'0 auto', display:'flex', flexDirection:'column', gap:10 }}>

        <Section icon="👤" title="Edit Profile">
          <div style={{ paddingTop:14 }}>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:14 }}>Update your name and profile picture from the Profile page.</p>
            <Btn onClick={()=>navigate('/profile')}>Go to Profile →</Btn>
          </div>
        </Section>

        <Section icon="🔑" title="Change Password">
          <div style={{ paddingTop:14 }}>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:14 }}>Update your master vault password securely.</p>
            <Btn onClick={()=>navigate('/profile')}>Change Password →</Btn>
          </div>
        </Section>

        <Section icon="🎨" title="Appearance" defaultOpen>
          <div style={{ paddingTop:8 }}>
            <Toggle label="Dark Mode" desc="Switch between dark and light interface" checked={theme==='dark'}
              onChange={()=>{toggleTheme();saveSetting({theme:theme==='dark'?'light':'dark'});}}/>
          </div>
        </Section>

        <Section icon="🔔" title="Notification Settings">
          <div style={{ paddingTop:4 }}>
            <Toggle label="Email Alerts" desc="Get important account alerts via email" checked={!!notif.emailAlerts} onChange={()=>saveSetting({notifications:{...notif,emailAlerts:!notif.emailAlerts}})}/>
            <Toggle label="Security Alerts" desc="Get notified of suspicious activity" checked={!!notif.securityAlerts} onChange={()=>saveSetting({notifications:{...notif,securityAlerts:!notif.securityAlerts}})}/>
            <Toggle label="Weekly Report" desc="Receive a weekly vault summary" checked={!!notif.weeklyReport} onChange={()=>saveSetting({notifications:{...notif,weeklyReport:!notif.weeklyReport}})}/>
          </div>
        </Section>

        <Section icon="🛡️" title="Privacy Settings">
          <div style={{ paddingTop:4 }}>
            <Toggle label="Show Email Publicly" desc="Allow others to see your email" checked={!!privacy.showEmail} onChange={()=>saveSetting({privacy:{...privacy,showEmail:!privacy.showEmail}})}/>
            <Toggle label="Public Profile" desc="Make your profile visible to others" checked={!!privacy.publicProfile} onChange={()=>saveSetting({privacy:{...privacy,publicProfile:!privacy.publicProfile}})}/>
          </div>
        </Section>

        <Section icon="🔒" title="Security Settings">
          <div style={{ paddingTop:12 }}>
            <InfoRow label="Account Created" value={new Date(user?.createdAt).toLocaleDateString()}/>
            <InfoRow label="Email Verified" value={user?.isEmailVerified?'✅ Yes':'❌ No'}/>
            <InfoRow label="Password Hashing" value="bcrypt (12 rounds)"/>
            <InfoRow label="Vault Encryption" value="🔐 AES-256-GCM"/>
            <InfoRow label="Token Expiry" value="7 days"/>
          </div>
        </Section>

        <Section icon="🛡️" title="Two-Factor Authentication (2FA)">
          <div style={{ paddingTop:14, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:'#f1f5f9', marginBottom:4 }}>Status: <span style={{ color:user?.twoFactorEnabled?'#22c55e':'#f87171' }}>{user?.twoFactorEnabled?'Enabled':'Disabled'}</span></p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>Adds an extra layer of security to your account</p>
            </div>
            <Btn onClick={toggle2FA} color={user?.twoFactorEnabled?'#fca5a5':'#a5b4fc'} bg={user?.twoFactorEnabled?'rgba(239,68,68,0.12)':'rgba(99,102,241,0.12)'} border={user?.twoFactorEnabled?'rgba(239,68,68,0.3)':'rgba(99,102,241,0.3)'}>
              {user?.twoFactorEnabled?'Disable 2FA':'Enable 2FA'}
            </Btn>
          </div>
        </Section>

        <Section icon="⏱️" title="Session Management">
          <div style={{ paddingTop:14 }}>
            <div style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:12, padding:'14px 16px', marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:'#f1f5f9', marginBottom:2 }}>Current Session</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>Active now</p>
              </div>
              <span style={{ fontSize:11, padding:'3px 10px', background:'rgba(34,197,94,0.15)', color:'#86efac', borderRadius:20, fontWeight:700 }}>Active</span>
            </div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', lineHeight:1.6 }}>JWT tokens expire automatically after 7 days.</p>
          </div>
        </Section>

        <Section icon="🌐" title="Language Settings">
          <div style={{ paddingTop:14 }}>
            <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:7, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>Interface Language</label>
            <select className="input" style={{ maxWidth:260, cursor:'pointer' }} value={user?.settings?.language||'en'} onChange={e=>saveSetting({language:e.target.value})}>
              {[['en','English'],['hi','Hindi'],['gu','Gujarati'],['mr','Marathi'],['ta','Tamil'],['te','Telugu']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </Section>

        <Section icon="🚪" title="Logout">
          <div style={{ paddingTop:14 }}>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:14 }}>Sign out of your current session. Your vault data remains safe.</p>
            <Btn onClick={()=>{logout();navigate('/login');}} color="#fbbf24" bg="rgba(251,191,36,0.1)" border="rgba(251,191,36,0.25)">Sign Out Now</Btn>
          </div>
        </Section>

        <Section icon="⚠️" title="Delete Account">
          <div style={{ paddingTop:14 }}>
            <div style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:12, padding:14, marginBottom:16 }}>
              <p style={{ fontSize:13, color:'#fca5a5', fontWeight:700, marginBottom:4 }}>⚠️ This action is irreversible</p>
              <p style={{ fontSize:12, color:'rgba(239,68,68,0.6)', lineHeight:1.5 }}>Permanently removes all your saved passwords and account data.</p>
            </div>
            {!showDeleteModal
              ? <Btn onClick={()=>setShowDeleteModal(true)} color="#f87171" bg="rgba(239,68,68,0.1)" border="rgba(239,68,68,0.25)">Delete My Account</Btn>
              : <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <input className="input" type="password" placeholder="Enter your current password" value={deletePwd} onChange={e=>setDeletePwd(e.target.value)}/>
                  <input className="input" placeholder='Type "DELETE" to confirm' value={deleteConfirm} onChange={e=>setDeleteConfirm(e.target.value)}/>
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={()=>setShowDeleteModal(false)} style={{ flex:1, padding:'11px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
                    <button onClick={deleteAccount} style={{ flex:1, padding:'11px', borderRadius:12, background:'rgba(239,68,68,0.18)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>Permanently Delete</button>
                  </div>
                </div>}
          </div>
        </Section>

      </div>
    </Layout>
  );
}
