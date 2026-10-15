# PILIVE PILATES — 필라이브필라테스 강남 일원점 공식 웹사이트

- 공개 주소: https://pilive-pilates-gangnam-ilwon.vercel.app
- 관리자: https://pilive-pilates-gangnam-ilwon.vercel.app/admin

## 페이지

| 주소 | 내용 |
| --- | --- |
| `/` | 브랜드 홈페이지 (소개 · 장점 · 개인레슨 · 바디케어 · 시간표 · 강사진 · 상담예약 · 오시는 길) |
| `/private` | 1:1 개인레슨 상세 페이지 |
| `/bodycare` | PILIVE BODY CARE SYSTEM 페이지 (기존 바디케어 페이지, 내용 그대로 이동) |
| `/admin` | 관리자 — 상단에서 '브랜드 홈페이지' / '바디케어 페이지' 를 골라 수정 |

## 구성

- Next.js (App Router) + TypeScript
- 브랜드 홈페이지 스타일: Tailwind CSS (`app/(site)/site.css`)
- 바디케어 페이지 스타일: 기존 CSS (`app/(bodycare)/globals.css`) — 두 페이지의 스타일이 섞이지 않게 분리
- 콘텐츠·이미지 저장: Vercel Blob (이 프로젝트 전용 저장소)
  - 브랜드 홈페이지 저장본: `brand/` 폴더
  - 바디케어 페이지 저장본: `content/` 폴더
  - 관리자에서 올린 사진: `images/` 폴더
- 기본 문구·강사 정보: `lib/brand.ts`, `lib/instructors.ts` (관리자에서 저장하기 전까지 이 값이 보입니다)
- 사진: `public/assets` (강사 프로필 · 시간표 · 스튜디오 · 공유 이미지), `public/images` (바디케어 페이지 사진)

## 환경변수 (Vercel → Settings → Environment Variables)

| 이름 | 설명 |
| --- | --- |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 |
| `SESSION_SECRET` | 로그인 쿠키 서명용 임의의 긴 문자열 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 저장소를 프로젝트에 연결하면 자동으로 추가됩니다 |

GitHub `main` 브랜치에 커밋이 올라가면 Vercel이 자동으로 다시 배포합니다.
