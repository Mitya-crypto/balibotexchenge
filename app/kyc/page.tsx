'use client';
import React from 'react';
import { useI18n } from '../../lib/i18n';

export default function KycHub(){
  const { t } = useI18n();
  return (
    <div className="container" style={{maxWidth:480, margin:'16px auto 96px', padding:'0 16px'}}>
      <section className="card" style={{display:'grid', gap:12, padding:'16px'}}>
        <h1 style={{margin:0, fontSize:18, fontWeight:900}}>{t('kyc','title')}</h1>
        <p className="meta" style={{margin:'0 0 4px'}}>{t('kyc','subtitle')}</p>

        <div className="kyc-list">
          <KycTile href="/kyc/passport" label={t('kyc','passport')}            icon={<IconDoc/>}/>
          <KycTile href="/kyc/id"       label={t('kyc','idcard')}             icon={<IconId/>}/>
          <KycTile href="/kyc/driver"   label={t('kyc','driver')} icon={<IconDriver/>}/>
        </div>
      </section>
    </div>
  );
}

function KycTile({href,label,icon}:{href:string; label:string; icon:React.ReactNode}){
  return (
    <a href={href as any} className="kyc-long" style={{textDecoration:'none'}}>
      <div className="kyc-ico">{icon}</div>
      <div className="kyc-label"><strong>{label}</strong></div>
      <span className="kyc-arrow" aria-hidden>›</span>
    </a>
  );
}

function IconDoc(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M8 7h8M8 11h8M8 15h6"/></svg>);}
function IconId(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M12 12h6"/></svg>);}
function IconDriver(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 13h5"/></svg>);}
