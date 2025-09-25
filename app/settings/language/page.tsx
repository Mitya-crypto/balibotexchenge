'use client';
import React from 'react';
import Container from '../../../components/ui/Container';
import { Card, CardBody } from '../../../components/ui/Card';
import { useI18n } from '../../../lib/i18n';

const LANGS: { code: 'ru' | 'en' | 'id'; label: string }[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
];

export default function LanguagePage() {
  const { lang, setLang, t } = useI18n();

  return (
    <main className="py-4">
      <Container>
        <h1 className="text-2xl font-semibold mb-4">{t('settings.language.title')}</h1>
        <div className="space-y-3">
          {LANGS.map((L) => {
            const isActive = lang === L.code;
            return (
              <button
                key={L.code}
                type="button"
                onClick={() => setLang(L.code)}
                className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded-2xl"
                aria-pressed={isActive}
              >
                <Card className={isActive ? 'border-black shadow-md' : ''}>
                  <CardBody className="flex items-center justify-between">
                    <span className="font-medium">{L.label}</span>
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        isActive ? 'bg-black border-black text-white' : 'border-gray-300 text-transparent'
                      }`}
                      aria-hidden
                    >
                      ✓
                    </span>
                  </CardBody>
                </Card>
              </button>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
