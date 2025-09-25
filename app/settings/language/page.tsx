'use client';
import React from 'react';
import Container from '../../../components/ui/Container';
import { Card, CardBody } from '../../../components/ui/Card';
import { useI18n } from '../../../lib/i18n';
import { AVAILABLE_LANGS } from '../../../lib/locale';

export default function LanguagePage() {
  const { lang, setLang, t } = useI18n();
  return (
    <main className="py-4">
      <Container>
        <h1 className="text-2xl font-semibold mb-4">{t('settings','language_title')}</h1>
        <div className="space-y-2">
          {AVAILABLE_LANGS.map((code) => {
            const selected = lang === code;
            return (
              <Card key={code}>
                <button
                  type="button"
                  onClick={() => setLang(code)}
                  className="w-full text-left"
                  aria-pressed={selected}
                >
                  <CardBody className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t('lang', code)}</div>
                      {selected && (
                        <div className="text-sm text-gray-500">{t('settings','language_current')}</div>
                      )}
                    </div>
                    {selected && (
                      <div className="w-6 h-6 rounded-full border bg-black border-black text-white">
                        <span className="block text-center leading-6">✓</span>
                      </div>
                    )}
                  </CardBody>
                </button>
              </Card>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3">{t('settings','language_hint')}</p>
      </Container>
    </main>
  );
}
