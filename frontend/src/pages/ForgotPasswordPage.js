import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast('OTP sent to your email!','success');
      navigate(`/verify-email?email=${encodeURIComponent(email)}&type=reset-password`);
    } catch (err) { toast(err.response?.data?.message || 'Failed to send OTP.','error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f', padding:16, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-10%', left:'-10%', width:500, height:500, borderRadius:'50%', background:'rgba(99,102,241,0.12)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'rgba(124,58,237,0.12)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 8px 32px rgba(79,70,229,0.35)' }}>
            <svg width={28} height={28} fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
          </div>
          <h1 style={{ fontWeight:800, fontSize:27, color:'#f1f5f9', letterSpacing:'-0.02em' }}>Reset Password</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', marginTop:6, fontSize:14 }}>Enter your email and we'll send a reset OTP</p>
        </div>
        <div className="glass" style={{ borderRadius:24, padding:'30px 32px 26px' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:7, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Email Address</label>
              <input className="input" type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ padding:'13px' }}>
              {loading?'Sending OTP…':'Send Reset OTP'}
            </button>
          </form>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginTop:22, gap:6 }}>
            <svg width={14} height={14} fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <Link to="/login" style={{ fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none' }}>Back to <span style={{ color:'#818cf8', fontWeight:700 }}>Sign In</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
