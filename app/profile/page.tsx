'use client';
import React, { useEffect, useState } from 'react';
import { useI18n } from '../../lib/i18n';

export default function ProfilePage(){
  const { t, lang: activeLang } = useI18n();
  const [username, setUsername] = useState('@user');
  const [email, setEmail] = useState<string|undefined>();
  const [verified, setVerified] = useState(false);
  const [devicesCount, setDevicesCount] = useState<number>(0);
  const [walletsCount, setWalletsCount] = useState<number>(0);
  const langLabel = t('lang', activeLang) || activeLang;

  useEffect(()=>{
    try{
      const u = localStorage.getItem('username') || '@user';
      setUsername(u.startsWith('@') ? u : '@'+u);
      const m = localStorage.getItem('userEmail') || undefined;
      setEmail(m);
      setVerified(localStorage.getItem('userEmailVerified')==='1');
      const rawDev = localStorage.getItem('devices_v1');
      if (rawDev){ try{ const arr = JSON.parse(rawDev); setDevicesCount(Array.isArray(arr)?arr.length:0); }catch{} }
      const rawWal = localStorage.getItem('wallets.v1');
      if (rawWal && m){ try{
        const data = JSON.parse(rawWal); const byUser = data?.[m];
        let cnt = 0; if (Array.isArray(byUser)) cnt = byUser.length;
        else if (byUser && typeof byUser === 'object') {
          const vals: unknown[] = Object.values(byUser as Record<string, unknown>);
          cnt = vals.reduce((acc: number, v: unknown) => acc + (Array.isArray(v) ? v.length : 1), 0);
        }
        setWalletsCount(cnt||0);
      }catch{} }
    }catch{}
  },[]);

  const logout = (e:React.MouseEvent)=>{ e.preventDefault(); try{ localStorage.removeItem('userEmail'); localStorage.removeItem('userEmailVerified'); localStorage.setItem('pin_enabled','0'); }catch{}; window.location.href='/home'; };

  return (
    <div className="profile-wrap tabbar-pad" style={{maxWidth:480, margin:'0 auto 96px', padding:'12px 16px'}}>
      <section className="card profile-head">
        
        <div className="ph-info">
          <div className="ph-name">{username}</div>
          
        </div>
      </section>

      <section className="mini-two">
        <a href="/kyc" className="mini-tile">
          <span className="mini-ico">{IconShield()}</span>
          <div className="mini-col">
            <div className="mini-title">{t('profile','kyc_title')}</div>
            <div className="mini-sub">{t('profile','kyc_short')}</div>
          </div>
          <span className="chev">›</span>
        </a>

        <a href="/email" className="mini-tile">
          <span className="mini-ico">{IconAt()}</span>
          <div className="mini-col">
            <div className="mini-title">{t('profile','email')}</div>
            <div className="mini-sub">
              {email
                ? (verified ? t('profile','email_ok') : t('profile','email_verify'))
                : t('profile','email_add')}
            </div>
          </div>
          <span className="chev">›</span>
        </a>
      </section>

      <h2 className="sect-title">{t('profile','ref')}</h2>
      <div className="list-card">
        <Row href="/promo/ref" icon={IconUsers()} label={t('profile','ref')} />
        <Row href="/promo"     icon={IconGift()}  label={t('profile','promo')} />
      </div>

      <h2 className="sect-title">{t('profile','settings')}</h2>
      <div className="list-card">
        <Row href="/settings/security" icon={IconLock()}    label={t('security','title')} />
        <Row href="/settings/language" icon={IconGlobe()}   label={t('profile','language')} value={langLabel}/>
        <Row href="/wallets"           icon={IconWallet()}  label={t('profile','wallets')} value={String(walletsCount || 0)} />
        <Row href="/devices"           icon={IconDevice()}  label={t('profile','devices')} value={String(devicesCount || 0)} />
      </div>

      <h2 className="sect-title">{t('profile','about')}</h2>
      <div className="list-card">
        <Row href="/official" icon={IconTg()}  label={t('profile','official_accounts')} />
        <Row href="/faq"      icon={IconHelp()} label={t('profile','faq')} />
        <Row href="/info"     icon={IconInfo()} label={t('profile','info')} />
        <Row href="/support"  icon={IconChat()} label={t('profile','support')} />
      </div>

      <button type="button" onClick={logout} className="logout-btn">{t('profile','logout')}</button>
    </div>
  );
}

function Row({href, icon, label, value}:{href:string; icon:React.ReactNode; label:string; value?:string}){
  return (
    <a href={href as any} className="list-row">
      <span className="row-ico">{icon}</span>
      <span className="row-label">{label}</span>
      {value && <span className="row-value">{value}</span>}
      <span className="chev">›</span>
    </a>
  );
}

/* Иконки */
function IconShield(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l8 4v5c0 5-4 8-8 9-4-1-8-4-8-9V7l8-4z"/></svg>);}
function IconAt(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8"/><path d="M16 12a3 3 0 1 1-3-3"/><path d="M16 12v2a2 2 0 0 0 4 0v-1"/></svg>);}
function IconUsers(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="11" r="3"/><path d="M2 20a6 6 0 0 1 12 0"/><path d="M10 20a6 6 0 0 1 12 0"/></svg>);}
function IconGift(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M2 8h20M12 8v13"/><path d="M12 8c-2 0-3-1.2-3-2.5S10 3 12 3s3 1.2 3 2.5S14 8 12 8z"/></svg>);}
function IconLock(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg>);}
function IconGlobe(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>);}
function IconWallet(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M16 12h3"/><path d="M8 10h4"/></svg>);}
function IconDevice(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="14" height="10" rx="2"/><path d="M22 9v6a2 2 0 0 1-2 2h-4"/></svg>);}
function IconTg(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L2 12l6 2 2 6 4-5 6-13z"/></svg>);}
function IconHelp(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a3 3 0 1 1 4.5 2.6c-.8.5-1 1-1 1.9"/><circle cx="12" cy="17" r="1"/></svg>);}
function IconInfo(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h2v5h-2z"/></svg>);}
function IconChat(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>);}
