import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function VerifyOtpPage() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const type  = params.get('type') || 'verify-email';
  const isReset = type === 'reset-password';
  const { setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['','','','','','']);
  const [newPwd, setNewPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showPwd, setShowPwd] = useState(false);
  const refs = useRef([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => { if (timer<=0) return; const t=setTimeout(()=>setTimer(s=>s-1),1000); return()=>clearTimeout(t); }, [timer]);

  const handleOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next=[...otp]; next[i]=val; setOtp(next);
    if (val && i<5) refs.current[i+1]?.focus();
  };
  const handleKey = (i, e) => { if (e.key==='Backspace'&&!otp[i]&&i>0) refs.current[i-1]?.focus(); };
  const handlePaste = e => {
    e.preventDefault();
    const p=e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    const next=Array(6).fill(''); for(let i=0;i<p.length;i++) next[i]=p[i];
    setOtp(next); refs.current[Math.min(p.length,5)]?.focus();
  };

  const submit = async e => {
    e.preventDefault();
    const code=otp.join('');
    if (code.length<6) return toast('Enter the 6-digit OTP.','error');
    setLoading(true);
    try {
      if (isReset) {
        if (!newPwd||newPwd.length<8) return toast('Password must be at least 8 characters.','error');
        await api.post('/auth/reset-password',{ email, otp:code, newPassword:newPwd });
        toast('Password reset successfully!','success'); navigate('/login');
      } else {
        const r=await api.post('/auth/verify-email',{ email, otp:code });
        localStorage.setItem('sp_token',r.data.token); setUser(r.data);
        toast('Email verified! Welcome to SecurePass.','success'); navigate('/');
      }
    } catch (err) { toast(err.response?.data?.message||'Verification failed.','error'); setOtp(['','','','','','']); refs.current[0]?.focus(); }
    finally { setLoading(false); }
  };

  const resend = async () => {
    setResending(true);
    try { await api.post('/auth/resend-otp',{email,type}); toast('New OTP sent.','success'); setTimer(60); setOtp(['','','','','','']); refs.current[0]?.focus(); }
    catch (err) { toast(err.response?.data?.message||'Failed to resend.','error'); }
    finally { setResending(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f', padding:16, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-10%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'rgba(124,58,237,0.12)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'-10%', width:500, height:500, borderRadius:'50%', background:'rgba(99,102,241,0.12)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:30 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 8px 32px rgba(79,70,229,0.35)' }}>
            <svg width={28} height={28} fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h1 style={{ fontWeight:800, fontSize:27, color:'#f1f5f9', letterSpacing:'-0.02em' }}>{isReset?'Reset Password':'Verify Your Email'}</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', marginTop:8, fontSize:14, lineHeight:1.6 }}>
            We sent a 6-digit OTP to<br/><strong style={{ color:'#818cf8' }}>{email}</strong>
          </p>
        </div>
        <div className="glass" style={{ borderRadius:24, padding:'30px 32px 26px' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:22 }}>
            <div>
              <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:16, textAlign:'center', fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Enter OTP Code</label>
              <div style={{ display:'flex', gap:10, justifyContent:'center' }} onPaste={handlePaste}>
                {otp.map((v,i) => (
                  <input key={i} ref={el=>refs.current[i]=el} value={v} onChange={e=>handleOtp(i,e.target.value)} onKeyDown={e=>handleKey(i,e)}
                    maxLength={1} inputMode="numeric"
                    style={{ width:50, height:58, textAlign:'center', fontSize:24, fontWeight:800, borderRadius:14, background:v?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.05)', border:v?'1.5px solid rgba(99,102,241,0.5)':'1.5px solid rgba(255,255,255,0.1)', color:'#f1f5f9', outline:'none', transition:'all 0.15s', fontFamily:'inherit' }}
                    onFocus={e=>{e.target.style.borderColor='#6366f1';e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)';}}
                    onBlur={e=>{e.target.style.borderColor=v?'rgba(99,102,241,0.5)':'rgba(255,255,255,0.1)';e.target.style.boxShadow='none';}}
                  />
                ))}
              </div>
            </div>
            {isReset && (
              <div>
                <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:7, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>New Password</label>
                <div style={{ position:'relative' }}>
                  <input className="input" type={showPwd?'text':'password'} placeholder="Min 8 characters" value={newPwd} onChange={e=>setNewPwd(e.target.value)} required style={{ paddingRight:44 }} />
                  <button type="button" onClick={()=>setShowPwd(!showPwd)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', display:'flex' }}>
                    <svg width={17} height={17} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPwd?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}/></svg>
                  </button>
                </div>
              </div>
            )}
            <button className="btn-primary" type="submit" disabled={loading||otp.join('').length<6} style={{ padding:'13px' }}>
              {loading?'Verifying…':isReset?'Reset Password':'Verify Email'}
            </button>
          </form>
          <div style={{ textAlign:'center', marginTop:18 }}>
            {timer>0
              ? <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)' }}>Resend OTP in <strong style={{ color:'#f59e0b' }}>{timer}s</strong></p>
              : <button onClick={resend} disabled={resending} style={{ background:'none', border:'none', cursor:'pointer', color:'#818cf8', fontSize:13, fontWeight:700, display:'inline-flex', alignItems:'center', gap:6 }}>
                  {resending?'Sending…':'Resend OTP'}
                </button>}
          </div>
        </div>
      </div>
    </div>
  );
}
