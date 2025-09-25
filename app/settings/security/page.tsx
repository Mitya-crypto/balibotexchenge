'use client';
import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../lib/i18n';

export default function SecurityPage(){
  const { t } = useI18n();
  const [email,setEmail] = useState<string|undefined>();
  const [verified,setVerified] = useState(false);
  const [pin,setPin] = useState(false);
  const [hide,setHide] = useState(false);

  useEffect(()=>{ try{
    setEmail(localStorage.getItem('userEmail')||undefined);
    setVerified(localStorage.getItem('userEmailVerified')==='1');
    setPin(localStorage.getItem('pin_enabled')==='1');
    setHide(localStorage.getItem('hideBalance')==='1');
  }catch{} },[]);

  const toggle = (key:string, setter: React.Dispatch<React.SetStateAction<boolean>>)=>()=>{
    setter(v=>{ const n=!v; try{ localStorage.setItem(key, n?'1':'0'); }catch{}; return n; });
  };

  return (
    <div style={{maxWidth:480, margin:'0 auto 96px', padding:'12px 16px'}}>
      <h1 className="sect-title" style={{marginTop:4}}>{t('security','title')}</h1>
      <div className="list-card">
        <div className="list-row">
          <span className="row-ico">{IconMail()}</span>
          <span className="row-label">{t('profile','email')}</span>
          <span className="row-value" style={{marginLeft:'auto'}}>{
            email ? (verified ? t('profile','email_ok') : t('profile','email_verify')) : t('profile','email_add')
          }</span>
        </div>
      </div>

      <h2 className="sect-title">{t('security','subtitle')}</h2>
      <div className="list-card">
        <div className="list-row">
          <span className="row-ico">{IconPin()}</span>
          <span className="row-label">{pin ? t('security','pin_on') : t('security','pin_off')}</span>
          <button className="row-pill" data-on={pin?1:0} onClick={toggle('pin_enabled', setPin)}>{t('security','toggle_pin')}</button>
        </div>
        <div className="list-row">
          <span className="row-ico">{IconEye()}</span>
          <span className="row-label">{hide ? t('security','hide_on') : t('security','hide_off')}</span>
          <button className="row-pill" data-on={hide?1:0} onClick={toggle('hideBalance', setHide)}>{t('security','toggle_hide')}</button>
        </div>
      </div>
    </div>
  );
}

function IconMail(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16v12H4z"/><path d="M4 8l8 6 8-6"/></svg>);}
function IconPin(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg>);}
function IconEye(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>);}
