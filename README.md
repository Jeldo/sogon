# 소곤 (Sogon)

> 속삭이듯 기록하고, 비밀친구가 반응해주는 프라이빗 일기장

---

## 로컬 실행 가이드

### 사전 준비

| 도구 | 설치 방법 |
|------|-----------|
| **Node.js** v20+ | [nodejs.org](https://nodejs.org) 또는 `brew install node` |
| **pnpm** | `npm install -g pnpm` |
| **Task** | `brew install go-task` 또는 [taskfile.dev](https://taskfile.dev/installation/) |

```bash
node -v   # v20 이상
pnpm -v
task --version
```

---

### 1단계 — 저장소 클론

```bash
git clone https://github.com/jeldo/sogon.git
cd sogon
```

---

### 2단계 — 의존성 설치 & `.env.local` 생성

```bash
task setup
```

`sogon/.env.local` 파일이 자동으로 생성돼. 다음 단계에서 실제 값을 채워줘.

---

### 3단계 — 환경 변수 설정

`sogon/.env.local` 을 열어서 값을 채워줘. 각 항목의 발급 위치는 `sogon/.env.example` 주석을 참고해.

#### 필수 항목

| 변수 | 설명 | 발급 위치 |
|------|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Supabase 대시보드 > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase 공개 키 | Supabase 대시보드 > Project Settings > API > anon/public |
| `SUPABASE_SECRET_DEFAULT_KEY` | Supabase 시크릿 키 (서버 전용) | Supabase 대시보드 > Project Settings > API > service_role |
| `GEMINI_API_KEY` | Gemini API 키 (AI 리액션 생성) | [Google AI Studio](https://aistudio.google.com/app/apikey) |

#### 선택 항목 (Google 로그인)

| 변수 | 설명 | 발급 위치 |
|------|------|-----------|
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Google Cloud Console > APIs & Services > Credentials |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | 위와 동일 |
| `SUPABASE_PASSWORD` | DB 비밀번호 (CLI 마이그레이션 시 필요) | Supabase 대시보드 > Project Settings > Database |

---

### 4단계 — DB 스키마 적용

[Supabase 대시보드](https://supabase.com/dashboard) → SQL Editor 에서 `sogon/supabase/schema.sql` 내용을 실행해.

---

### 5단계 — 개발 서버 실행

```bash
task dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

---

## Taskfile 명령어

```bash
task            # 사용 가능한 태스크 목록
task setup      # 최초 설치 (의존성 + .env.local 생성)
task dev        # 개발 서버 실행
task build      # 프로덕션 빌드
task start      # 프로덕션 빌드 후 서버 실행
task lint       # ESLint 실행
task test       # 단위 테스트 실행
task test:watch # Vitest 워치 모드
task deploy     # Vercel 프로덕션 배포
```
