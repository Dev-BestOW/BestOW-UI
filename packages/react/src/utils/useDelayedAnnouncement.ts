import { useEffect, useState } from 'react';

/** 입력이 멈춘 뒤 알림을 넣기까지 기다리는 시간 (Combobox "결과가 없어요" 와 같은 값) */
export const ANNOUNCE_DELAY = 800;

/**
 * 입력 중에 생긴 메시지(자동 검증 오류 등)를 잠시 뒤에 live region 으로 알리기 위한 글자.
 * 글자를 칠 때 바로 바꾸면 VoiceOver 가 입력한 글자를 읽느라 알림을 버린다(스크린리더 수동 점검 2026-10-21).
 * 반환값은 **처음부터 있는** `role="status"` 영역에 넣는다 — 글자를 담은 채 새로 생긴 live region 은 읽히지 않는다.
 * 메시지가 '' 가 되면 바로 비우므로, 고쳤다가 같은 오류가 다시 나도 다시 알린다.
 */
export function useDelayedAnnouncement(message: string, delay = ANNOUNCE_DELAY): string {
  const [announced, setAnnounced] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setAnnounced(message), message ? delay : 0);
    return () => clearTimeout(timer);
  }, [message, delay]);
  return message && announced === message ? message : '';
}
