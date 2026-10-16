declare const process: { env: { NODE_ENV?: string } } | undefined;

const warned = new Set<string>();

/**
 * 개발 모드에서 같은 메시지를 한 번만 경고한다 (deprecated API 안내 등).
 * production 빌드에서는 번들러가 `process.env.NODE_ENV` 를 바꿔 넣어 아무것도 하지 않는다.
 * 번들러 없이(CDN 등) 쓰여 `process` 가 없으면 개발 모드로 보고 경고한다.
 */
export function warnOnce(message: string) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return;
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[BestOW UI] ${message}`);
}
