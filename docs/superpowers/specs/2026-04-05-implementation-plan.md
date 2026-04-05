# Sogon MVP 구현 계획

## Context

소곤 MVP의 4개 화면(온보딩, 기록, 리액션, 모아보기)을 와이어프레임 스펙(`2026-04-05-wireframe-design.md`) 기반으로 구현한다. 현재 Next.js 16 + Tailwind v4 초기 세팅만 존재하며, 모든 UI와 로직을 새로 만든다. 데이터는 localStorage에 저장하고, AI 리액션은 Anthropic API(서버)를 통해 생성한다.

---

## 핵심 결정

| 항목 | 결정 | 근거 |
|------|------|------|
| 데이터 저장 | **localStorage** (Supabase 미사용) | PRD의 "device-based first" 원칙. MVP에서 서버 의존성 최소화 |
| 사진 첨부 | **Phase 2에서 함께 구현** | Data URL로 localStorage에 저장 (MVP 단순화) |
| 기록 ↔ 리액션 | **분리형**, 기록 제출 후 자동 전환 | 와이어프레임 논의에서 확정 |
| AI 리액션 호출 | **Next.js API Route** (`/api/reaction`) | ANTHROPIC_API_KEY를 서버에서만 사용 |
| 모아보기 기본 뷰 | **캘린더** (타임라인은 탭 전환) | 일기장 성격에 맞는 날짜 중심 탐색 |

---

## 의존성

### 추가 설치 필요
```bash
cd sogon && pnpm add @anthropic-ai/sdk lucide-react
```

### 테스트 환경 (Phase 5)
```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom vite-tsconfig-paths
```

---

## Phase 0: 디자인 시스템 + 프로젝트 기반

### 0-1. CLAUDE.md 수정
**파일**: `.claude/CLAUDE.md`

Database 섹션을 localStorage로 변경:
```
## Database
- **Provider**: localStorage (device-based, no server dependency for MVP)
```

### 0-2. globals.css — 디자인 시스템 토큰
**파일**: `sogon/app/globals.css`

`@theme inline` 블록에 정의할 토큰:

**컬러 (DESIGN_GUIDE.md 기반)**:
- primary: 50(#F7FCEF) ~ 800(#366B2E)
- neutral: 50(#FAFBFA) ~ 600(#5C6260)

**폰트 패밀리**:
- `--font-body`: Gowun Dodum (UI 텍스트, 버튼, 인풋)
- `--font-heading`: Gowun Batang (캘린더 헤더)
- `--font-handwriting`: Nanum Pen Script (비밀친구 리액션)

**Border Radius 커스텀**:
- rounded-sm: 6px, rounded-md: 10px, rounded-lg: 16px, rounded-xl: 20px, rounded-2xl: 24px

**Shadow 토큰**:
- shadow-sm: `0 1px 3px rgba(0,0,0,0.06)`
- shadow-md: `0 4px 12px rgba(0,0,0,0.08)`
- shadow-lg: `0 8px 24px rgba(0,0,0,0.10)`

**커스텀 키프레임**:
- `typing-pulse`: opacity 0.3→1→0.3, 1.2초 루프 (타이핑 인디케이터용)

### 0-3. layout.tsx — 루트 레이아웃
**파일**: `sogon/app/layout.tsx`

- `next/font/google`로 3개 폰트 임포트: `Gowun_Dodum`, `Gowun_Batang`, `Nanum_Pen_Script`
- `lang="ko"`
- metadata: `title: "소곤"`, `description: "프라이빗한데 반응이 있는 하루 기록 공간"`
- 폰트 CSS 변수를 html 요소에 적용

### 0-4. 공유 타입
**파일**: `sogon/lib/types.ts`

```typescript
export const FRIEND_TONES = ["warm", "cool", "energetic"] as const;
export type FriendTone = (typeof FRIEND_TONES)[number];

export type DiaryEntry = {
  id: string;
  content: string;
  imageDataUrl: string | null;
  createdAt: string;  // ISO string
};

export type Reaction = {
  id: string;
  entryId: string;
  content: string;
  tone: FriendTone;
  createdAt: string;
};

export type EntryWithReaction = DiaryEntry & { reaction: Reaction | null };

export type DeviceProfile = {
  friendTone: FriendTone;
  createdAt: string;
};
```

### 0-5. localStorage CRUD
**파일**: `sogon/lib/storage.ts` (`"use client"`)

| 함수 | 키 | 설명 |
|------|-----|------|
| `getDeviceProfile()` | `sogon_profile` | 프로필 조회 (null이면 온보딩 미완료) |
| `setDeviceProfile(tone)` | `sogon_profile` | 톤 선택 저장 |
| `getEntries()` | `sogon_entries` | 전체 기록 조회 |
| `addEntry(entry)` | `sogon_entries` | 기록 추가 |
| `getReactions()` | `sogon_reactions` | 전체 리액션 조회 |
| `addReaction(reaction)` | `sogon_reactions` | 리액션 추가 |
| `getEntriesByDate(date)` | — | 특정 날짜 기록 필터링 |
| `getEntriesByMonth(year, month)` | — | 특정 월 기록 필터링 |
| `getEntryWithReaction(entryId)` | — | 기록 + 리액션 조인 |

ID 생성: `crypto.randomUUID()`

### 0-6. 날짜 유틸리티
**파일**: `sogon/lib/date-utils.ts`

| 함수 | 반환 예시 |
|------|----------|
| `formatKoreanDate(date)` | "4월 5일 토요일" |
| `formatTime(date)` | "오후 3:24" |
| `getDaysInMonth(year, month)` | 캘린더 그리드 배열 |
| `isSameDay(a, b)` | boolean |
| `isToday(date)` | boolean |

### 0-7. 톤 상수
**파일**: `sogon/lib/constants.ts`

```typescript
export const TONE_OPTIONS = [
  { tone: "warm", emoji: "🤗", bgColor: "#fde8e8", name: "따뜻한 친구", exampleReaction: "그랬구나, 고생했다 오늘도" },
  { tone: "cool", emoji: "😎", bgColor: "#e0f0ff", name: "쿨한 친구", exampleReaction: "오 괜찮은데? 잘했네" },
  { tone: "energetic", emoji: "🎉", bgColor: "#fff8e0", name: "텐션 높은 친구", exampleReaction: "헐 대박!! 완전 좋다!!" },
] as const satisfies readonly ToneOption[];
```

### 0-8. 환경 변수
**파일**: `sogon/.env.local`
```
ANTHROPIC_API_KEY=
```

### 검증
- `pnpm dev` 정상 실행
- DevTools에서 폰트 로딩 + CSS 변수 확인

---

## Phase 1: 온보딩 화면

### 1-1. 온보딩 페이지
**파일**: `sogon/app/page.tsx` (기존 교체, `"use client"`)

- 진입 시 `getDeviceProfile()` 확인 → 있으면 `/record`로 리다이렉트
- 560px 중앙 정렬 (`max-w-[560px] mx-auto`)
- 상단: 로고 아이콘 (둥근 primary 배경) + "소곤" + "비밀친구를 골라봐!"
- 중앙: `<ToneCard>` 3개 세로 나열, 12px 간격
- 하단: "시작하기" Primary Button (톤 미선택 시 비활성화)

### 1-2. ToneCard 컴포넌트
**파일**: `sogon/app/ToneCard.tsx` (`"use client"`)

Props:
```typescript
type ToneCardProps = {
  emoji: string;
  bgColor: string;
  name: string;
  exampleReaction: string;
  selected: boolean;
  onSelect: () => void;
};
```

스타일:
- 기본: `bg-white border-2 border-neutral-200 rounded-xl p-4`
- hover: `scale-[1.02]` transition 200ms
- 선택: `border-primary-500 shadow-[0_0_0_3px_rgba(110,189,90,0.15)]`
- 이모지 아이콘: 40x40, `bgColor` 배경, rounded-xl

### 1-3. 완료 로직
"시작하기" 클릭 → `setDeviceProfile(selectedTone)` → `router.push("/record")`

### 검증
- `/` 접속 → 3개 카드 → 선택 + "시작하기" → `/record` 이동
- 재접속 시 자동 리다이렉트

---

## Phase 2: 기록 + 리액션 + 사진 (핵심 플로우)

### 2-1. 메인 레이아웃
**파일**: `sogon/app/(main)/layout.tsx` (`"use client"`)

- 온보딩 미완료 시 `/`로 리다이렉트
- `<Sidebar>` + children + `<BottomNav>` (모바일)
- prop으로 사이드바 모드 제어 (expanded/collapsed)

### 2-2. Sidebar
**파일**: `sogon/components/Sidebar.tsx` (`"use client"`)

| 모드 | 너비 | 표시 |
|------|------|------|
| expanded | 240px | 로고 + 텍스트 네비 |
| collapsed | 64px | 아이콘만 |
| hidden | 0 | 모바일 (<768px) |

네비 항목:
- 기록하기: `PenLine` 아이콘, 링크 `/record`
- 모아보기: `BookOpen` 아이콘, 링크 `/collection`
- 설정: `Settings` 아이콘, 하단 고정 (MVP에서는 placeholder)

활성 상태: `usePathname()`으로 감지, `bg-primary-100 text-primary-700 border-l-3 border-primary-600`

### 2-3. BottomNav
**파일**: `sogon/components/BottomNav.tsx` (`"use client"`)

768px 미만에서만 표시. 기록하기 / 모아보기 / 설정 3탭.

### 2-4. 기록 화면
**파일**: `sogon/app/(main)/record/page.tsx` (`"use client"`)

구성:
- 헤더: "기록하기" (text-xl, font-semibold) + 날짜 (text-sm, neutral-500)
- Textarea: `min-h-[120px] rounded-lg p-5`, placeholder "오늘 뭐 했어?", font-body text-lg
- 액션바:
  - 좌: 사진 첨부 (`ImagePlus` 아이콘, 36x36 neutral-100 배경)
  - 우: "기록하기" (`Send` 아이콘, Primary Button), 텍스트 비면 비활성화
- 구분선 아래: 오늘 기록 리스트 (`<EntryCard>` 사용), 없으면 영역 숨김

### 2-5. 사진 첨부
**파일**: `sogon/lib/image.ts`

```typescript
export async function compressImage(file: File): Promise<string>
```
- canvas API로 max 1200px 리사이즈, quality 0.8
- Data URL 반환 → localStorage에 저장

UI:
- 파일 선택 → textarea 하단에 썸네일 미리보기 (rounded-lg) + X 버튼
- 제출 시 `imageDataUrl`로 entry에 포함

### 2-6. AI 리액션 API
**파일**: `sogon/app/api/reaction/route.ts`

```typescript
// POST /api/reaction
// Body: { content: string; tone: FriendTone }
// Response: { reaction: string }
```

**파일**: `sogon/lib/ai/generate-reaction.ts`

톤별 시스템 프롬프트:
| 톤 | 프롬프트 핵심 |
|----|-------------|
| warm | 따뜻하고 공감적. "그랬구나", "고생했다" 같은 표현 |
| cool | 쿨하고 담담. "괜찮은데", "잘했네" 같은 표현 |
| energetic | 텐션 높고 신남. "헐 대박!!", "완전!!" 같은 표현 |

공통 규칙: 한국어, 1~2문장, 친구처럼 반말. 상담사/AI/챗봇처럼 하지 않기.

에러 시 폴백: 톤별 기본 메시지 반환.

### 2-7. 기록 제출 플로우
```
사용자 "기록하기" 클릭
  → addEntry(entry) → localStorage
  → POST /api/reaction { content, tone }
  → addReaction(reaction) → localStorage
  → router.push(/record/${entryId}/reaction)
```

### 2-8. 리액션 화면
**파일**: `sogon/app/(main)/record/[id]/reaction/page.tsx` (`"use client"`)

레이아웃: 사이드바 collapsed (64px) + 480px 중앙 정렬

**파일**: `sogon/app/(main)/record/[id]/reaction/ReactionView.tsx` (`"use client"`)

애니메이션 시퀀스:
1. 내 기록 카드 즉시 표시 ("방금 나의 기록" 라벨 + 기록 내용)
2. `<TypingIndicator>` 1.5초 표시
3. 리액션 버블 슬라이드인:
   - `opacity: 0→1`, `translateY: 8px→0`, `scale: 0.97→1.0`
   - 500ms, `cubic-bezier(0.34, 1.56, 0.64, 1)` (ease-spring)
4. 하단 버튼: "하나 더 기록하기" (Secondary → `/record`) + "모아보기" (Ghost → `/collection`)

### 2-9. TypingIndicator
**파일**: `sogon/components/TypingIndicator.tsx`

세 점 (`●●●`) 펄스 애니메이션. CSS `@keyframes typing-pulse` 사용.

### 2-10. EntryCard (공유 컴포넌트)
**파일**: `sogon/components/EntryCard.tsx`

기록 텍스트 + 이미지(있으면, `next/image`) + 리액션(Nanum Pen Script) + 타임스탬프. 기록 화면, 리액션 화면, 모아보기에서 재사용.

### 검증
- 기록 → 제출 → 리액션 화면 자동 전환 → 타이핑 → 리액션 등장
- 사진 첨부 → 미리보기 → 제출
- "하나 더 기록하기" → 기록 화면 (오늘 기록에 방금 것 표시)

---

## Phase 3: 모아보기 (캘린더 + 타임라인)

### 3-1. 모아보기 페이지
**파일**: `sogon/app/(main)/collection/page.tsx` (`"use client"`)

헤더: "모아보기" + 탭 스위처 (pill 스타일: `bg-neutral-100 rounded-lg p-[3px]`, 활성: `bg-white shadow-sm`)

### 3-2. CalendarView
**파일**: `sogon/app/(main)/collection/CalendarView.tsx`

| 요소 | 스타일 |
|------|--------|
| 월 헤더 | Gowun Batang, text-xl, 좌우 화살표 (`ChevronLeft`/`ChevronRight`) |
| 요일 헤더 | text-xs, neutral-400 |
| 날짜 셀 | 40x40px, rounded-full |
| 기록 도트 | 4px, primary-400, 하단 중앙 |
| 오늘 | ring-2 ring-primary-300 |
| 선택됨 | bg-primary-600, text-white |

날짜 선택 → 아래에 기록 카드 리스트 (`<EntryCard>`)
빈 상태: "이 날은 기록이 없어. 오늘 하나 남겨볼까?" + `/record` 링크

### 3-3. TimelineView
**파일**: `sogon/app/(main)/collection/TimelineView.tsx`

- 최신순, 날짜 구분선으로 그룹핑
- `<EntryCard>` 재사용
- Intersection Observer로 stagger 등장: `translateY 12px→0`, `opacity 0→1`, 350ms, 50ms 간격
- 빈 상태: "아직 기록이 없어. 첫 기록을 남겨봐!" + 기록하기 버튼

### 검증
- 캘린더 도트 + 날짜 선택 → 기록 리스트
- 타임라인 전환 + 날짜 그룹핑
- 빈 상태 메시지

---

## Phase 4: 반응형 + 애니메이션 마무리

### 반응형

| 브레이크포인트 | 사이드바 | 콘텐츠 |
|---------------|---------|--------|
| Desktop (>=1024px) | 240px 펼침 | max-width per screen |
| Tablet (768~1023px) | 64px 아이콘 | 동일 |
| Mobile (<768px) | 숨김 + 하단 탭 | 풀폭 - 패딩 |

### 애니메이션

| 요소 | 스펙 |
|------|------|
| 타이핑 인디케이터 | opacity 0.3→1→0.3, 1.2초 루프 |
| 리액션 버블 | opacity+translateY+scale, 500ms, ease-spring |
| 타임라인 카드 | stagger 등장 350ms, 50ms 간격 |
| 버튼 active | scale 0.97, 100ms |
| 온보딩 카드 hover | scale 1.02, 200ms |

---

## Phase 5: 테스트

### 유닛 테스트
- `lib/date-utils.test.ts` — 날짜 포맷팅
- `lib/storage.test.ts` — localStorage CRUD (mock)
- `lib/ai/generate-reaction.test.ts` — 프롬프트 구성 (mock Anthropic)

### 컴포넌트 테스트
- `app/ToneCard.test.tsx` — 렌더링, 선택 콜백
- `components/EntryCard.test.tsx` — 기록+리액션 표시

---

## 최종 디렉토리 구조

```
sogon/
  app/
    globals.css                       # 디자인 시스템 토큰
    layout.tsx                        # 루트 레이아웃 (폰트)
    page.tsx                          # 온보딩
    ToneCard.tsx                      # 톤 선택 카드
    api/
      reaction/
        route.ts                      # AI 리액션 API
    (main)/
      layout.tsx                      # 사이드바 레이아웃
      record/
        page.tsx                      # 기록 화면
        [id]/
          reaction/
            page.tsx                  # 리액션 화면
            ReactionView.tsx          # 애니메이션 리액션
      collection/
        page.tsx                      # 모아보기
        CalendarView.tsx              # 캘린더 뷰
        TimelineView.tsx              # 타임라인 뷰
  components/
    Sidebar.tsx                       # 사이드바 네비게이션
    BottomNav.tsx                     # 모바일 하단 탭
    TypingIndicator.tsx               # 타이핑 점 애니메이션
    EntryCard.tsx                     # 기록 카드 (공유)
  lib/
    types.ts                          # 타입 정의
    constants.ts                      # 톤 데이터, 상수
    storage.ts                        # localStorage CRUD
    date-utils.ts                     # 날짜 유틸
    image.ts                          # 이미지 압축
    ai/
      generate-reaction.ts            # 프롬프트 구성
  .env.local                          # ANTHROPIC_API_KEY
  vitest.config.ts
  tests/
    setup.ts
```
