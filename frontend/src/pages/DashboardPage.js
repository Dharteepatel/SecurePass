import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import PasswordCard from '../components/PasswordCard';
import AddPasswordModal from '../components/AddPasswordModal';
import api from '../utils/api';

const CATS = ['All','Social','Work','Finance','Shopping','Entertainment','Other'];

const StatCard = ({ label, value, icon, color }) => (
  <div className="card" style={{ padding:'20px 22px', display:'flex', alignItems:'center', gap:16 }}>
    <div style={{ width:48, height:48, borderRadius:14, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{icon}</div>
    <div>
      <div style={{ fontSize:26, fontWeight:800, color:'#f1f5f9', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4, fontWeight:500 }}>{label}</div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [stats, setStats] = useState({ total:0, favorites:0, recentlyAdded:0 });
  const [search, setSearch] = useState('');
  const [dSearch, setDSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { const t=setTimeout(()=>setDSearch(search),350); return()=>clearTimeout(t); }, [search]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (dSearch) params.search = dSearch;
      if (category !== 'All') params.category = category;
      const [pwRes, stRes] = await Promise.all([api.get('/passwords',{params}), api.get('/passwords/stats')]);
      setPasswords(pwRes.data); setStats(stRes.data);
    } catch {} finally { setLoading(false); }
  }, [dSearch, category]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const hour = new Date().getHours();
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
  const firstName = user?.name?.split(' ')[0]||'there';

  return (
    <Layout title="Dashboard">
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:24, fontWeight:800, color:'#f1f5f9', letterSpacing:'-0.02em' }}>
          {greeting},{' '}
          <span style={{ background:'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{firstName}</span> 👋
        </h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, marginTop:5 }}>Your vault is secured and up to date.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:28 }}>
        <StatCard label="Total Passwords" value={stats.total}         icon="🔐" color="#6366f1"/>
        <StatCard label="Favorites"       value={stats.favorites}     icon="⭐" color="#f59e0b"/>
        <StatCard label="Added This Week" value={stats.recentlyAdded} icon="🆕" color="#22c55e"/>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:200, position:'relative' }}>
          <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity:0.35 }} width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input className="input" style={{ paddingLeft:38 }} placeholder="Search by site or username…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <button onClick={()=>setShowModal(true)} style={{ padding:'10px 20px', borderRadius:12, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:700, fontSize:13, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:7, boxShadow:'0 4px 16px rgba(79,70,229,0.35)', whiteSpace:'nowrap', fontFamily:'inherit' }}>
          <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Add Password
        </button>
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:6, marginBottom:22, overflowX:'auto', paddingBottom:4 }}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCategory(c)} style={{ padding:'6px 16px', borderRadius:20, fontSize:12, fontWeight:600, border:category===c?'1px solid rgba(99,102,241,0.4)':'1px solid rgba(255,255,255,0.08)', cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', background:category===c?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.04)', color:category===c?'#818cf8':'rgba(255,255,255,0.4)' }}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:14 }}>
          {[...Array(6)].map((_,i)=><div key={i} className="card" style={{ height:180, animation:'pulse 1.5s ease infinite', animationDelay:`${i*0.1}s` }}/>)}
        </div>
      ) : passwords.length===0 ? (
        <div style={{ textAlign:'center', padding:'70px 20px' }}>
          <div style={{ width:80, height:80, borderRadius:24, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 16px' }}>🔐</div>
          <h3 style={{ color:'rgba(255,255,255,0.5)', fontWeight:700, marginBottom:6, fontSize:16 }}>{dSearch||category!=='All'?'No results found':'Your vault is empty'}</h3>
          <p style={{ color:'rgba(255,255,255,0.25)', fontSize:13, marginBottom:20 }}>{dSearch||category!=='All'?'Try a different search or category':'Click "Add Password" to store your first credential'}</p>
          {!dSearch&&category==='All'&&(
            <button onClick={()=>setShowModal(true)} style={{ padding:'10px 24px', borderRadius:12, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:700, fontSize:13, border:'none', cursor:'pointer', fontFamily:'inherit' }}>+ Add Your First Password</button>
          )}
        </div>
      ) : (
        <>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginBottom:14 }}>{passwords.length} {passwords.length===1?'item':'items'} found</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:14 }}>
            {passwords.map(e=>(
              <PasswordCard key={e._id} entry={e}
                onDelete={id=>{setPasswords(p=>p.filter(x=>x._id!==id));fetchAll();}}
                onToggleFavorite={(id,fav)=>{setPasswords(p=>p.map(x=>x._id===id?{...x,isFavorite:fav}:x));fetchAll();}}
              />
            ))}
          </div>
        </>
      )}

      {showModal && <AddPasswordModal onClose={()=>setShowModal(false)} onAdded={e=>{setPasswords(p=>[e,...p]);fetchAll();}}/>}
    </Layout>
  );
}
