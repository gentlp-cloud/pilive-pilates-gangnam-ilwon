# PILIVE BODY CARE SYSTEM — 필라이브필라테스 강남일원점

- 사이트: Next.js (App Router) + TypeScript
- 콘텐츠·이미지 저장: Vercel Blob (이 프로젝트 전용 저장소)
- 관리자 페이지: `/admin` (비밀번호 로그인)

## 환경변수 (Vercel → Settings → Environment Variables)

| 이름 | 설명 |
| --- | --- |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 |
| `SESSION_SECRET` | 로그인 쿠키 서명용 임의의 긴 문자열 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 저장소를 프로젝트에 연결하면 자동으로 추가됩니다 |

GitHub `main` 브랜치에 커밋이 올라가면 Vercel이 자동으로 다시 배포합니다.
