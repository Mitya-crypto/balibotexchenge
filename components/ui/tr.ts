import { t as translate } from '../../lib/i18n';

export function tr(ns: string, key: string, fallback?: string) {
  const value = translate(ns, key);
  if (value === key && fallback !== undefined) {
    return fallback;
  }
  return value;
}
