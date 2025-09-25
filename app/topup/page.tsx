'use client';
import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n';

const TABS = ['IDR','RUB','USD','EUR'] as const;
type Cur = typeof TABS[number];

export default function TopUpPage(){
  const { t } = useI18n();
  const [cur, setCur] = useState<Cur>('RUB');

  return (
    <div className="container" style={{maxWidth:480, margin:'90px auto 96px', padding:'0 16px', display:'grid', gap:12}}>
      <section className="card" style={{display:'grid', gap:10}}>
        <h1 style={{fontSize:18, fontWeight:800, margin:0}}>{t('topup','title')}</h1>
        <div className="seg">{TABS.map(t=><button key={t} data-active={cur===t?1:0} onClick={()=>setCur(t)}>{t}</button>)}</div>
        <div className="field"><input placeholder={`${t('topup','amount_in')} ${cur}`} inputMode="decimal" /><span className="meta">{t('topup','currency')}</span></div>
        <p className="meta" style={{margin:0}}>{t('topup','demo_note')}</p>
      </section>

      <section className="card" style={{display:'grid', gap:10}}>
        <h2 style={{fontSize:16, fontWeight:800, margin:0}}>{t('topup','methods')}</h2>
        <Method href="/wallets" icon={<IconCard/>} title={t('topup','card')} note={t('topup','card_note')} />
        <Method href="/wallets" icon={<IconCrypto/>} title={t('topup','crypto')} note={t('topup','crypto_note')} />
        <Method href="/scan"    icon={<IconQR/>}    title={t('topup','qr')}          note={t('topup','qr_note')} />
        <Method href="/promo"   icon={<IconGift/>}  title={t('topup','gift')} note={t('topup','gift_note')} />
        <a href="/home" className="btn" style={{width:'100%'}}>{t('topup','done')}</a>
      </section>
    </div>
  );
}

function Method({href, icon, title, note}:{href:string; icon:React.ReactNode; title:string; note:string}){
  return (
    <a href={href as any} className="linkrow" style={{textDecoration:'none'}}>
      <span className="iconbtn" aria-hidden>{icon}</span>
      <div style={{display:'grid'}}>
        <strong style={{fontSize:14}}>{title}</strong>
        <small className="meta">{note}</small>
      </div>
      <span style={{marginLeft:'auto', opacity:.6}} aria-hidden>›</span>
    </a>
  );
}

function IconCard(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 14h4"/></svg>);}
function IconCrypto(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4.5v9L12 20 4 15.5v-9L12 2z"/><path d="M12 7v10"/></svg>);}
function IconQR(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM16 14h2v2h-2zM18 18h2v2h-2zM14 18h2"/></svg>);}
function IconGift(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M2 7h20v5H2z"/><path d="M12 2c-1.5 0-3 1-3 2.5S10.5 7 12 7s3-1 3-2.5S13.5 2 12 2z"/><path d="M12 7v15"/></svg>);}
