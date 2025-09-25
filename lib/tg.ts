export type TGUser = { id:number; username?:string; first_name?:string; last_name?:string; photo_url?:string; };

const TELEGRAM_USERNAME_REGEX = /^[a-z][a-z0-9_]{4,31}$/;

function normalizeCandidate(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withoutAt = trimmed.replace(/^@+/, '');
  const onlySafeChars = withoutAt.replace(/[^0-9a-z_]/gi, '');
  if (!onlySafeChars) return null;
  const truncated = onlySafeChars.slice(0, 32);
  if (!TELEGRAM_USERNAME_REGEX.test(truncated.toLowerCase())) return null;
  return truncated;
}

function resolveFallback(fallback: unknown): string {
  const normalized = normalizeCandidate(fallback) ?? 'unknown';
  return `@${normalized}`;
}

export function sanitizeTelegramUsername(value: unknown, fallback: unknown = '@unknown'): string {
  const fallbackHandle = resolveFallback(fallback);
  const normalized = normalizeCandidate(value);
  return normalized ? `@${normalized}` : fallbackHandle;
}

export function getTG(){ return (typeof window!=='undefined') ? (window as any).Telegram?.WebApp : undefined; }
export function getUser(): TGUser | null {
  const tg = getTG();
  if (tg?.initDataUnsafe?.user) return tg.initDataUnsafe.user as TGUser;
  if (process.env.NEXT_PUBLIC_TG_MOCK === '1') return { id: 777, username: 'mock_user', first_name: 'Mock', last_name: 'User' };
  return null;
}
