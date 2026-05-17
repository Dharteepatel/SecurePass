import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await login(form.email, form.password); navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.needsVerification) { toast('Email not verified. OTP resent.','info'); navigate(`/verify-email?email=${encodeURIComponent(data.email)}&type=verify-email`); }
      else toast(data?.message || 'Login failed.','error');
    } finally { setLoading(false); }
  };

  const BG = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f', padding:16, position:'relative', overflow:'hidden' };
  const Orb = ({ style }) => <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none', ...style }} />;

  return (
    <div style={BG}>
      <Orb style={{ top:'-10%', left:'-10%', width:500, height:500, background:'rgba(99,102,241,0.12)' }} />
      <Orb style={{ bottom:'-10%', right:'-10%', width:500, height:500, background:'rgba(124,58,237,0.12)' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 8px 32px rgba(79,70,229,0.35)' }}>
            <svg width={28} height={28} fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h1 style={{ fontWeight:800, fontSize:28, color:'#f1f5f9', letterSpacing:'-0.02em' }}>Welcome back</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', marginTop:6, fontSize:14 }}>Sign in to your SecurePass vault</p>
        </div>
        <div className="glass" style={{ borderRadius:24, padding:'32px 32px 28px' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:7, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity:0.3 }} width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <input className="input" type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handle} style={{ paddingLeft:38 }} />
              </div>
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                <label style={{ fontSize:12, color:'rgba(255,255,255,0.55)', fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize:12, color:'#818cf8', textDecoration:'none', fontWeight:600 }}>Forgot password?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity:0.3 }} width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <input className="input" type={showPwd?'text':'password'} name="password" required placeholder="••••••••" value={form.password} onChange={handle} style={{ paddingLeft:38, paddingRight:44 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', display:'flex' }}>
                  <svg width={17} height={17} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPwd?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}/></svg>
                </button>
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop:4, padding:'13px' }}>
              {loading ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ animation:'spin 0.8s linear infinite' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>Signing in…</span> : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:22, fontSize:13, color:'rgba(255,255,255,0.35)' }}>
            Don't have an account? <Link to="/register" style={{ color:'#818cf8', textDecoration:'none', fontWeight:700 }}>Create one</Link>
          </p>
        </div>
        <p style={{ textAlign:'center', marginTop:18, fontSize:12, color:'rgba(255,255,255,0.2)' }}>🔒 Your vault is encrypted and secure</p>
      </div>
    </div>
  );
}
