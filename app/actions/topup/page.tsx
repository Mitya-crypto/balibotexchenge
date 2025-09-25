'use client';
import { useI18n } from '../../../lib/i18n';

export default function Top_upPage(){
  const { t } = useI18n();
  return (
    <div style={{padding:16}}>
      <h1 style={{margin:0}}>{t('topup','title')}</h1>
      <p>{t('topup','demo_note')}</p>
    </div>
  );
}
