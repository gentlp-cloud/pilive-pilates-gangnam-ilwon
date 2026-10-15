'use client';

import { useActionState } from 'react';
import { login, type ActionResult } from './actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(login, null);
  return (
    <div className="login">
      <form action={action}>
        <p className="eyebrow">PILIVE Admin</p>
        <h1>관리자 로그인</h1>
        <p>사이트 문구, 이미지, 예약 링크를 수정할 수 있습니다.</p>
        <label className="field">
          <span>비밀번호</span>
          <input type="password" name="password" id="password" autoComplete="current-password" required autoFocus />
        </label>
        {state && !state.ok ? <p className="err">{state.message}</p> : null}
        <button className="adm-btn dark" type="submit" disabled={pending}>
          {pending ? '확인 중…' : '로그인'}
        </button>
      </form>
    </div>
  );
}
