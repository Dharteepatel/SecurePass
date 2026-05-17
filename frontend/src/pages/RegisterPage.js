import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getStrength } from '../utils/passwordGenerator';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const strength = getStrength(form.password);
  const sColor = { Weak:'#ef4444', Fair:'#f59e0b', Good:'#3b82f6', Strong:'#22c55e' }[strength.label] || '#ef4444';
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast('Passwords do not match.','error');
    if (form.password.length < 8) return toast('Password must be at least 8 characters.','error');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast('Account created! Check your email for OTP.','success');
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}&type=verify-email`);
    } catch (err) { toast(err.response?.data?.message || 'Registration failed.','error'); }
    finally { setLoading(false); }
  };

  const checks = [
    { label:'8+ characters', met: form.password.length >= 8 },
    { label:'Uppercase', met: /[A-Z]/.test(form.password) },
    { label:'Number', met: /[0-9]/.test(form.password) },
    { label:'Special char', met: /[^A-Za-z0-9]/.test(form.password) },
  ];

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f', padding:'24px 16px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-15%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'rgba(124,58,237,0.12)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'-10%', width:500, height:500, borderRadius:'50%', background:'rgba(99,102,241,0.12)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 8px 32px rgba(79,70,229,0.35)' }}>
            <svg width={28} height={28} fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h1 style={{ fontWeight:800, fontSize:27, color:'#f1f5f9', letterSpacing:'-0.02em' }}>Create your vault</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', marginTop:6, fontSize:14 }}>Secure all your passwords in one place</p>
        </div>
        <div className="glass" style={{ borderRadius:24, padding:'30px 32px 26px' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[{label:'Full Name',name:'name',type:'text',ph:'Jane Smith'},{label:'Email Address',name:'email',type:'email',ph:'you@example.com'}].map(f => (
              <div key={f.name}>
                <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:7, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>{f.label}</label>
                <input className="input" type={f.type} name={f.name} required placeholder={f.ph} value={form[f.name]} onChange={handle} />
              </div>
            ))}
            <div>
              <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:7, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input className="input" type={showPwd?'text':'password'} name="password" required placeholder="Create a strong password" value={form.password} onChange={handle} style={{ paddingRight:44 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', display:'flex' }}>
                  <svg width={17} height={17} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPwd?"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21":"M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}/></svg>
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:'flex', gap:4, marginBottom:5 }}>
                    {[1,2,3,4,5].map(i => <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=strength.score?sColor:'rgba(255,255,255,0.08)', transition:'background 0.3s' }} />)}
                    <span style={{ fontSize:10, color:sColor, fontWeight:700, width:36, textAlign:'right' }}>{strength.label}</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3px 8px' }}>
                    {checks.map(c => <div key={c.label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:c.met?'#4ade80':'rgba(255,255,255,0.3)' }}><span>{c.met?'✓':'○'}</span>{c.label}</div>)}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:7, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Confirm Password</label>
              <input className="input" type="password" name="confirm" required placeholder="Repeat your password" value={form.confirm} onChange={handle} style={{ borderColor: form.confirm&&form.password===form.confirm?'rgba(34,197,94,0.4)':undefined }} />
              {form.confirm && form.password===form.confirm && <p style={{ marginTop:5, fontSize:11, color:'#4ade80' }}>✓ Passwords match</p>}
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop:4, padding:'13px' }}>{loading?'Creating vault…':'Create Account'}</button>
          </form>
          <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'rgba(255,255,255,0.35)' }}>
            Already have an account? <Link to="/login" style={{ color:'#818cf8', textDecoration:'none', fontWeight:700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
