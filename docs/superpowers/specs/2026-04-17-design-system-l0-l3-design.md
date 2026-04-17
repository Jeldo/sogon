# 소곤 디자인 시스템 L0–L3 설계

**작성일**: 2026-04-17
**범위**: L0 원칙 · L1 Foundation(폰트 교체·타이포 스케일 포함) · L2 토큰 3단 계층 · L3 코어 프리미티브 7개 · 소곤다움 체크리스트
**범위 밖**: L4 Patterns · L5 Guidelines/리빙 카탈로그 · L6 Governance · 새 일러스트 · Toast/Tooltip/Dropdown/Calendar 세부

---

## 개요

소곤은 이미 `DESIGN_GUIDE.md`(브랜드·톤·컴포넌트 스펙 상세)와 `globals.css`(컬러 팔레트, 시맨틱 컬러, 다크모드 오버라이드)를 보유하고 있다. 그러나:

- **L2 시맨틱 토큰이 빈약**하여 페이지마다 `dark:` 분기가 반복된다.
- **L3 프리미티브 컴포넌트가 없다**. `Sidebar`, `EntryCard` 등 소곤 전용 위젯만 존재하며 공통 기반 없이 각자 스타일링한다.
- **L0 원칙(의사결정 북스타)이 공식적으로 정의되지 않았다**. 기존 `DESIGN_GUIDE §9`는 "어떻게 생겨야 하는가"(visual execution rules)를 다루므로 L1 Foundation의 사용 규칙으로 재배치한다.

이 스펙은 위 세 구멍을 채운다. 접근법은 **파일럿 중심(B)** — 시그니처 컴포넌트(Textarea, ChatBubble)를 end-to-end로 먼저 설계하여 토큰 아키텍처를 실사용 압력 아래 검증한 뒤, 나머지 프리미티브를 같은 형틀로 양산한다.

---

## §1. L0 Principles + L1 Foundation

### §1-A. L0 — 디자인 원칙 (의사결정 북스타)

의사결정이 애매할 때 돌아오는 3원칙. 각 원칙은 **충돌할 때 선택**을 명시하여 비교 가능한 북스타 역할을 한다.

#### 1. 속삭이듯 (Whisper, not announce)
기능을 "알리지" 말고 "내비친다". 큰 CTA·굵은 텍스트·밝은 accent보다 작고 부드러운 제스처를 먼저 고려. 토스트·배너·팝업보다 제자리 피드백을 우선.
**충돌할 때**: 시끄러운 명료함 vs. 조용한 충분함 → 조용한 쪽.

#### 2. 친구처럼 (Companion, not tool)
UI 카피·마이크로카피·버튼 레이블이 "도구"가 아니라 "친구"의 목소리를 낸다. 시스템 메시지("Entry saved")보다 친밀한 표현("기록 완료!").
**충돌할 때**: 생산성 앱스러움 vs. 관계스러움 → 관계스러움.

#### 3. 안전하게 (Safe to be vulnerable)
사용자가 약한 감정을 꺼낼 수 있어야 한다. 평가·수치(카운트, 스트릭)·비교·FOMO 유발 요소는 기본적으로 거부. 삭제·실수·오류도 죄책감 없이 복구 가능하게.
**충돌할 때**: 게임화·성과 피드백 vs. 무조건적 수용 → 수용.

---

### §1-B. L1 Foundation — 시각 언어의 기초 재료

소곤의 L1 Foundation은 8개 카테고리로 구성된다. 대부분 `DESIGN_GUIDE.md`에 이미 정의돼 있으며, 아래 표는 각 카테고리의 권위있는 정의 위치와 본 스펙에서 추가·변경되는 부분을 명시한다.

| # | 카테고리 | 권위 위치 | 이 스펙의 변경 |
|---|---------|----------|----------------|
| 1 | 색 | `DESIGN_GUIDE §3–§4` + `globals.css` | §2에서 L2 시맨틱 확장, shadcn 네이밍 |
| 2 | 타이포 | `DESIGN_GUIDE §1` (폰트만) | **폰트 교체 + 역할 스케일 신설** (아래) |
| 3 | 간격 | `DESIGN_GUIDE §2` (4px 스케일) | 변경 없음 |
| 4 | 레이아웃 그리드 | `DESIGN_GUIDE §2` (720/840/240/64 + BP) | 변경 없음 |
| 5 | 아이콘 | `DESIGN_GUIDE §5` (Lucide, 1.5px stroke) | 변경 없음 |
| 6 | 모션 | `DESIGN_GUIDE §8` | §2에서 L2 시맨틱 모션 토큰화 |
| 7 | 일러스트 | — | **의도적 out-of-scope** (D+) |
| 8 | 보이스앤톤 | `DESIGN_GUIDE §1` Voice & Tone | 5번째 카테고리 "진행중 상태" 추가 (아래) |

#### §1-B.1 L1 사용 규칙 (기존 `DESIGN_GUIDE §9` 재분류)

현행 7개 항목 — 좁은 컬럼, 넉넉한 여백, 최소 그림자, 손글씨체로 친구 구분, 날카로운 모서리 없음, 느리고 부드러운 애니메이션, 컬러 미니멀리즘 — 은 L0 북스타가 아니라 **L1 Foundation의 "사용 규칙"** 으로 재분류한다. 가이드 파일 구조는 그대로 두되, L0(의사결정 원칙)와 L1(시각 언어 규칙)을 명시적으로 구분.

#### §1-B.2 L1 폰트 교체 (신규)

**현재** (`layout.tsx` + `globals.css`):
- Body: Gowun Dodum
- Heading: Gowun Batang
- Handwriting: Nanum Pen Script

**교체 후**:
- Body / Heading: **Pretendard** (자체 호스팅, `next/font/local`, variable woff2)
- Handwriting (비밀친구 리액션 전용): **Gaegu** (`next/font/google`, weights 300/400/700)

근거:
- Pretendard는 한글 본문·제목 모두에 가독성·가중 다양성 우수. 변동 가중치(100~900)로 역할 스케일 전체를 단일 폰트로 처리.
- Gaegu는 따뜻하고 동글한 손글씨체로 원칙 ②(친구처럼)에 부합. 기존 Nanum Pen Script 대비 톤이 덜 구식.

#### §1-B.3 L1 타이포 역할 스케일 (신규)

Primitive 폰트 3종 위에 **역할(Semantic)** 을 덧씌워 컴포넌트가 직접 참조:

| 역할 | 크기 | 폰트·가중 | line-height | letter-spacing | 사용처 |
|------|-----|-----------|-------------|---------------|--------|
| `display` | 28px | Pretendard 700 | 1.3 | -0.02em | 온보딩 큰 제목 |
| `heading` | 20px | Pretendard 600 | 1.4 | -0.01em | 섹션 헤더, 캘린더 월 |
| `body-lg` | 18px | Pretendard 400 | 1.65 | 0 | 기록 본문 (Textarea diary, Card body) |
| `body` | 16px | Pretendard 400 | 1.6 | 0 | 기본 텍스트, 버튼 라벨 |
| `body-sm` | 14px | Pretendard 400 | 1.55 | 0 | 보조 텍스트, small 버튼 |
| `caption` | 12px | Pretendard 500 | 1.5 | 0.01em | 타임스탬프, 카운터, 배지 |
| `friend` | 18px | Gaegu 400 | 1.55 | 0 | 비밀친구 리액션 전용 |

L2 시맨틱 타이포 토큰으로 `globals.css`에 구현 (Tailwind 유틸리티 `text-display` / `text-heading` / `text-body-lg` / `text-body` / `text-body-sm` / `text-caption` / `text-friend` 로 생성). 프리미티브 코드는 반드시 이 역할 클래스만 사용, raw `text-lg` 등 primitive 크기 유틸리티 직접 사용 금지.

#### §1-B.4 L1 Voice & Tone 확장 (신규 5번째 카테고리)

현재 가이드는 4개 카테고리(UI 카피 / 에러 / 빈 상태 / 성공)만 정의. 5번째 추가:

| 상황 | 톤 | 시그니처 카피 |
|------|-----|--------------|
| **진행중 상태** | 원칙 ②(친구처럼) 강 발현, 시스템스럽지 않게 | **"비밀친구에게 전하고 있어…"** |

이 카피는 Textarea 전송, 리액션 대기, 기타 로딩 상태의 톤 기준점.

---

## §2. L2 — 토큰 3단 계층 아키텍처

### 계층 구조

```
L1 Primitive   →   L2 Semantic   →   L3 Component
(값)               (목적, 테마 스위칭 지점)   (컴포넌트 전용 로컬)
```

- **L1 Primitive**: 원본 값. `--color-primary-600: #57A347`, `--radius-lg: 16px`. 다크모드에서도 불변.
- **L2 Semantic**: 의미 매핑. `--color-surface`, `--color-accent`, `--radius-card`, `--motion-reaction-appear`. **다크모드 오버라이드는 이 단에서만** 일어난다.
- **L3 Component**: 컴포넌트 전용. `--btn-primary-bg`, `--textarea-border-focus`. **전역 `@theme` 바깥**, 컴포넌트 모듈 내부에서만 정의(전역 네임스페이스 오염 방지).

### 핵심 결정

**결정 ① 다크모드 오버라이드 지점 = L2 Semantic 전용**
Primitive는 건드리지 않는다. Component 토큰은 Semantic을 참조하므로 자동 적응. 현재 남아 있는 페이지 단위 `dark:bg-*` 수동 분기는 L2 보강 후 제거한다.

**결정 ② Component 토큰은 전역 `@theme`에 두지 않는다**
Tailwind v4의 `@theme`는 CSS 변수를 유틸리티로도 생성한다(`--color-foo` → `bg-foo`). Component 토큰을 여기 두면 `bg-btn-primary-bg` 같은 유틸이 양산되어 네임스페이스가 오염된다. 대신 각 프리미티브 파일에서 로컬 CSS(`@layer components` 또는 인라인 CSS 변수) 로 정의.

**결정 ③ shadcn 스타일 단어 네이밍 — 유틸리티 가독성 우선**
현재 `--color-text-primary` → `text-text-primary` 의 중복 어색함을 제거.

| 현재 | 신규 | 사용 예 |
|------|------|---------|
| `--color-surface` | `--color-surface` | `bg-surface` |
| — | `--color-elevated` | `bg-elevated` |
| — | `--color-muted` | `bg-muted` |
| `--color-text-primary` | `--color-foreground` | `text-foreground` |
| `--color-text-secondary` | `--color-muted-foreground` | `text-muted-foreground` |
| `--color-text-tertiary` | `--color-subtle-foreground` | `text-subtle-foreground` |
| `--color-text-placeholder` | `--color-placeholder` | `placeholder:text-placeholder` |
| — | `--color-accent` | `bg-accent` (primary-600) |
| — | `--color-accent-hover` | primary-700 |
| — | `--color-accent-muted` | `bg-accent-muted` (primary-100) |
| — | `--color-accent-foreground` | `text-accent-foreground` (white) |
| `--color-border` | `--color-border` | `border-border` |
| — | `--color-border-focus` | `ring-border-focus` |
| — | `--color-danger` / `--color-danger-muted` | (제한적 사용) |
| — | `--color-overlay-scrim` | `bg-overlay-scrim` (모달 배경) |

**추가 L2 토큰**
- **Radius 의미 매핑**: `--radius-control`(10, Button/Input/compact Textarea), `--radius-field`(16, Textarea diary), `--radius-card`(20, EntryCard), `--radius-bubble`(24, ChatBubble main), `--radius-bubble-tail`(6, ChatBubble tail corner), `--radius-pill`(9999)
- **모션 묶음(duration+easing)**: `--motion-hover`, `--motion-press`, `--motion-page`, `--motion-reaction-appear`
- **타이포 역할 토큰**: §1-B.3 스케일을 `--text-display / --text-heading / --text-body-lg / --text-body / --text-body-sm / --text-caption / --text-friend` 로 토큰화. 각 토큰은 font-size · line-height · font-weight · letter-spacing · font-family 를 함께 지정. 프리미티브는 반드시 역할 클래스(`text-body-lg` 등)만 사용, raw `text-lg` 직접 사용 금지.

### 다크모드 신규 Primitive 추가 필요
`neutral-700: #3A3D3C`, `neutral-900: #1C1E1D` 등 다크 시맨틱을 지탱할 저채도 primitive 보강. (현재 `neutral-600`까지만 존재.)

---

## §3. 컴포넌트 API 컨벤션

모든 L3 프리미티브가 공통으로 따르는 규약 5가지. 이것이 지켜져야 "컴포넌트화됐다"고 부른다.

### 규약 ① Anatomy (구조) — 파일 상단 JSDoc
각 컴포넌트 파일 최상단에 주석으로 구조를 한 줄 명시.
```
/** Button anatomy: [leadingIcon?] [label] [trailingIcon?] */
```

### 규약 ② States — 7가지 상태 토큰화
인터랙티브 프리미티브는 아래 중 해당하는 상태를 빠짐없이 정의:
`default · hover · focus-visible · active · disabled · loading · error`
Tailwind 변형(`hover:`, `focus-visible:`, `disabled:`, `aria-busy:`)으로 구현.

### 규약 ③ Variants + Size — React 19 스타일
- props 타입은 `React.ComponentProps<"button">` 등 네이티브 타입 확장.
- `ref`는 props로 그대로 받는다(forwardRef 금지).
- variant/size 분기는 `clsx` + 간단한 record 맵핑. **CVA 의존성은 쓰지 않는다** (소곤 규모에 오버킬).

### 규약 ④ Accessibility — 필수 체크리스트
- 시맨틱 요소 우선(`<button>`, `<input>`, `<dialog>`) — `<div>` 인터랙티브 금지.
- 키보드 조작(Tab/Enter/Space/Escape) 가능.
- `focus-visible` 스타일은 `--color-border-focus` 사용.
- ARIA는 필요 최소(`aria-label`, `aria-describedby`, `aria-invalid`, `aria-busy`).
- Modal: focus trap, Escape 닫기, 배경 스크롤 잠금, 복귀 포커스.

### 규약 ⑤ 파일 구조
```
components/
  ui/                   ← 신규: 프리미티브 전용
    Button.tsx
    Input.tsx
    Textarea.tsx
    Card.tsx
    Modal.tsx
    Badge.tsx
    ChatBubble.tsx
  Sidebar.tsx           ← 기존: 내부에서 ui/ 프리미티브 사용
  EntryCard.tsx         ← 기존: ui/Card 위에 재구성
  SettingsModal.tsx     ← 기존: ui/Modal 위에 재구성
```

### Atomic Design 어휘 매핑 (참고)

본 시스템은 L0–L6 프레임을 기본 뼈대로 삼되, 업계 공통어인 Atomic Design 용어와의 대응을 명시해 외부 커뮤니케이션 시 활용한다. **디렉토리 구조를 atom/molecule/organism으로 쪼개지 않음** — 어휘만 매핑.

| Atomic 단위 | 본 시스템 대응 | 예시 |
|-------------|---------------|------|
| **Atoms** | L3 단일 프리미티브 | Button, Input, Badge |
| **Molecules** | L3 복합 프리미티브 (슬롯 조합) | Card, Modal, Textarea(+counter+error), ChatBubble(avatar+버블) |
| **Organisms** | `components/` 루트의 소곤 전용 위젯 | Sidebar, BottomNav, EntryCard, SettingsModal, ConfirmModal |
| **Templates** | `app/(main)/*/layout.tsx` | (main) 레이아웃 |
| **Pages** | `app/**/page.tsx` | record, collection, onboarding |

Atomic Design은 **컴포넌트 조립 어휘**만 다루므로 L0 원칙·L1 Foundation·L2 토큰·L5 가이드라인·L6 거버넌스는 본 시스템의 고유 영역으로 남는다.

---

## §4. Textarea 파일럿 (시그니처 1)

### 역할
기록 입력의 심장. 소곤의 시그니처 컴포넌트.

### Variant
| size | 용도 | 특성 |
|------|------|------|
| `"diary"` (기본) | 기록 페이지 메인 입력 | `text-body-lg` (18px Pretendard), 20px 패딩, min-height 120px, `--radius-field`(16) |
| `"compact"` | 모달/덧붙임 | `text-body-sm` (14px Pretendard), 14px 패딩, min-height 72px, `--radius-control`(10) |

### States (6)
default · focus · filled · submitting · error · disabled

### Props API
```tsx
type TextareaProps = React.ComponentProps<"textarea"> & {
  size?: "diary" | "compact";              // default: "diary"
  error?: boolean;
  errorMessage?: string;
  showCounter?: boolean;
  submitOnEnter?: "cmd" | "shift" | false; // default: "cmd" (Cmd/Ctrl+Enter 제출, Enter 줄바꿈)
  onSubmit?: (value: string) => void;
};
```
- **maxLength 기본 2000**. `showCounter=true`이면 `N / 2000` 표기.
- `submitting` 상태는 prop이 아니라 `aria-busy={true}` + `disabled` 조합으로 상위에서 표현.

### a11y
- 부모가 `<label htmlFor>` 제공 권장. 없으면 `aria-label` 강제(타입 수준 enforcement은 범위 밖, 런타임 console.warn).
- `error=true` 시 `aria-invalid` + `aria-describedby={errorMessageId}`.
- 제출 중 `aria-busy={true}`, textarea `disabled`.
- 포커스 링: `var(--color-border-focus)` + 3px focus-ring(`rgba(primary-500, 0.18)`).

### 카피 (Voice & Tone 적용)
- 기본 placeholder: `"오늘은 어떤 하루였어?"` (기존 가이드)
- 제출 중: **`"비밀친구에게 전하고 있어…"`** (신규 진행중 상태 시그니처)
- 에러: `"앗, 잠깐 문제가 생겼어. 다시 보내볼까?"` (기존 톤 예시 준수)

### 사용되는 토큰
L2: `--color-surface`, `--color-foreground`, `--color-placeholder`, `--color-border`, `--color-border-focus`, `--color-danger`, `--radius-field`(diary) / `--radius-control`(compact), `--motion-hover`, `text-body-lg`(diary) / `text-body-sm`(compact).

---

## §5. ChatBubble 파일럿 (시그니처 2)

### 역할
유저 기록 + 비밀친구 리액션을 동일 컴포넌트로 표현. 손글씨체 대비로 "다른 사람이 써준" 감각 구현.

### Props API
```tsx
type ChatBubbleProps = {
  author: "user" | "friend";          // 정렬 / 배경 / radius tail 방향 / 폰트 결정
  content: "text" | "photo";          // 버블 모양: 텍스트 패딩형 vs 이미지 edge-to-edge
  timestamp?: string;                 // 표시할 경우만
  avatar?: React.ReactNode;           // friend일 때만. 1단계는 이모지 권장. 슬롯만 뚫어둠.
  appearOnMount?: boolean;            // friend 리액션 등장 시 true → reaction-appear 애니메이션
  children: React.ReactNode;          // text 모드면 문자열/노드, photo 모드면 <img> 등
};
```

### 디자인 결정
- **사진은 별도 버블**로 렌더. 사진+텍스트 메시지는 두 개의 ChatBubble이 연달아 렌더된다(호출부 책임).
- **아바타 슬롯은 ReactNode prop**. 컴포넌트 내부에 친구→이모지 매핑 테이블을 두지 않는다(데이터-컴포넌트 결합 방지).
- **등장 애니메이션은 `reaction-appear` 재사용**. `globals.css`에 이미 정의된 keyframes(`opacity 0→1`, `translateY 8→0`, `scale 0.97→1`, 500ms, ease-spring).
- **타이핑 인디케이터는 별도 `TypingIndicator` 컴포넌트 유지**. ChatBubble에 흡수하지 않는다. 타이핑→리액션 시퀀스는 상위 페이지가 제어.

### 버블 스타일
| author | 정렬 | 배경 | radius(TL/TR/BR/BL) | 폰트 |
|--------|------|------|---------------------|------|
| user | 우측 | `--color-surface` + `border` | `bubble`/`bubble`/`bubble-tail`/`bubble` | `text-body` |
| friend | 좌측 | `--color-elevated` | `bubble`/`bubble`/`bubble`/`bubble-tail` | `text-friend` (Gaegu 18px) |

(`bubble` = `--radius-bubble`(24), `bubble-tail` = `--radius-bubble-tail`(6))

### a11y
- 타이핑 인디케이터는 `aria-live="polite"` + `aria-label="비밀친구가 리액션을 작성하고 있어요"`.
- 등장 애니메이션은 `prefers-reduced-motion` 체크 → 페이드만.

---

## §6. 나머지 프리미티브

### Button
```tsx
variant: "primary" | "secondary" | "ghost" | "icon"; // default "primary"
size: "sm" | "md" | "lg";                             // default "md"
loading?: boolean;
leadingIcon?: React.ReactNode;
trailingIcon?: React.ReactNode;
```
- `icon` variant는 40×40 원형(`--radius-pill`), 내부 아이콘 중앙 정렬.
- `loading=true` 시 텍스트 대신 스피너 + `aria-busy`.

### Input
```tsx
React.ComponentProps<"input"> & {
  error?: boolean;
  errorMessage?: string;
  leadingIcon?: React.ReactNode;
};
```
- size variant 없음(단일 크기). 필요 시 후속.

### Card
```tsx
padding?: "sm" | "md" | "lg"; // 기본 "md" (20px)
interactive?: boolean;        // hover shadow 부양 효과
children: React.ReactNode;
```
- 타이머/사진 등 소곤 특화 위젯은 EntryCard로 확장(마이그레이션 §7).

### Modal
```tsx
open: boolean;
onOpenChange: (open: boolean) => void;
size?: "sm" | "md" | "lg";            // default "md"
title?: string;                       // aria 연결
children: React.ReactNode;
```
- **데스크톱: 중앙 다이얼로그, 모바일(<768px): 바텀 시트**. CSS 미디어 쿼리로 분기.
- 배경: `--color-overlay-scrim` 반투명.
- ESC / 배경 클릭 닫기, focus trap, 스크롤 잠금, 복귀 포커스 — 규약 ④ 준수.

### Badge
```tsx
variant?: "default" | "accent" | "danger"; // default "default"
children: React.ReactNode;
```
Pill 형태(`--radius-pill`), inline-flex.

### 이번 스펙에서 제외
Toast, Tooltip, Dropdown, Select, Calendar 세부 — 필요 시 후속 스펙.

---

## §7. 마이그레이션 전략

**원칙**: 프리미티브 추가는 기존 코드에 영향 0. 갈아끼우기는 위젯 단위로 한 번에 하나씩, 시각·기능 동등성 확인 후 다음.

### 순서
1. `components/ui/` 디렉토리 신설 + 7개 프리미티브(Button, Input, Textarea, Card, Modal, Badge, ChatBubble) 작성 + 단위 테스트.
2. `globals.css` L2 토큰 확장 + 네이밍 마이그레이션(`--color-text-primary` → `--color-foreground` 등). 기존 페이지·컴포넌트의 클래스 참조 일괄 치환.
3. `SettingsModal` → `ui/Modal` 기반으로 재구성. (구조가 가장 단순)
4. `ConfirmModal` → `ui/Modal`.
5. `app/(main)/record` 의 Textarea+전송 버튼 → `ui/Textarea` + `ui/Button(variant="icon")`.
6. `EntryCard` → `ui/Card` 기반으로 재구성.
7. `Sidebar`, `BottomNav` 내부 링크/아이콘 버튼 → `ui/Button(variant="ghost")`.

각 단계 완료 시점에 수동 페이지 순회(record, collection, settings)로 회귀 확인.

---

## §8. 테스팅 전략

프로젝트 `testing.md`(classicist TDD) 준수.

- **단위 테스트 (필수)**: 각 프리미티브에 `*.test.tsx` — 렌더, 클릭/키보드 인터랙션, variant 스위칭, a11y 기본(role, label).
- **통합/E2E 테스트는 범위 밖**: 기존 커버리지에 의존, 마이그레이션 회귀는 수동 확인.
- **시각 회귀 테스트 없음**: 소곤 규모에 오버킬.
- **리빙 카탈로그 페이지 없음**: L5 영역, 별도 후속 스펙.

---

## §9. 소곤다움 체크리스트 (프리미티브 구현 시 필수 반영)

L0 원칙·L1 사용 규칙·DESIGN_GUIDE §8(Motion) 의 미세 지침을 프리미티브 코드에 명시적으로 박아둔다. "소곤다운 디테일"이 실수로 누락되지 않도록 구현/리뷰 공통 체크리스트.

### 모든 프리미티브 공통
- [ ] **radius는 L2 시맨틱 토큰만 사용** — `rounded-control / rounded-field / rounded-card / rounded-bubble / rounded-bubble-tail / rounded-pill`. Primitive radius(`rounded-sm/md/lg/xl/2xl`) 직접 참조 금지.
- [ ] **타이포는 L2 역할 토큰만 사용** — `text-display / heading / body-lg / body / body-sm / caption / friend`. Primitive size 유틸(`text-xs/sm/base/lg/xl`) 직접 참조 금지.
- [ ] **모션은 L2 시맨틱 토큰 사용** — `transition:var(--motion-hover)` / `var(--motion-press)` / `var(--motion-reaction-appear)` 등.
- [ ] **`prefers-reduced-motion` 폴백** — 애니메이션·transition 포함 컴포넌트는 `@media (prefers-reduced-motion: reduce)` 분기에서 transition/transform을 해제하고 `opacity` fade만 남김. 원칙 ①(속삭이듯) 적용.
- [ ] **다크모드 분기 없음** — 컴포넌트 코드에 `dark:` 클래스 직접 작성 금지. 색은 반드시 L2 시맨틱 토큰을 거치고, 다크모드 스위칭은 `globals.css .dark` 오버라이드에 맡긴다.
- [ ] **focus-visible ring** — 모든 포커스 가능 요소는 `--color-border-focus` 기반 링 적용.

### Button 전용
- [ ] **Active press** — `active:scale-[0.97]` (DESIGN_GUIDE §8 마이크로 인터랙션).
- [ ] **Hover transition 속도** — `var(--motion-hover)` 사용 (150ms ease-out).
- [ ] **Loading 상태** — 스피너 렌더 시 `aria-busy=true` + `disabled`.
- [ ] **Primary 버튼의 "조용함"** — 기본 shadow는 `shadow-sm` 이하로 억제. 과한 그림자/애니는 원칙 ①(속삭이듯) 위배.

### Input / Textarea 전용
- [ ] **기본 placeholder 톤** — 소곤 V&T 가이드 준수. 시스템스럽지 않게 (예: `"오늘은 어떤 하루였어?"`).
- [ ] **Error 메시지 톤** — "앗, 잠깐 문제가 생겼어. 다시 해볼까?" 패턴. 비난/명령형 금지.
- [ ] **Textarea diary**: `text-body-lg` (Pretendard 18px) + `--radius-field` 사용.
- [ ] **Textarea submitting 카피** — 상위 페이지가 설정 시 기본 "비밀친구에게 전하고 있어…" 권장.

### ChatBubble 전용
- [ ] **friend variant는 `text-friend` 역할 토큰** (Gaegu 18px) 강제. Primitive 폰트 직접 참조 금지.
- [ ] **Tail 코너**: 반드시 `--radius-bubble-tail` 토큰 사용 (hard-coded 6px 금지).
- [ ] **`reaction-appear` 애니메이션**: `var(--motion-reaction-appear)` 토큰 사용. `prefers-reduced-motion` 시 fade만.

### Modal 전용
- [ ] **`prefers-reduced-motion` 시 등장 애니메이션 생략** (opacity만).
- [ ] **모바일 바텀시트 slide-up**도 reduced-motion 시 fade로 대체.
- [ ] **Overlay 색**은 반드시 `--color-overlay-scrim` 사용.

### Card 전용
- [ ] **hover 부양 효과** (`interactive=true`) 는 `shadow-sm` → `shadow-md` 전환. scale/translate 사용 금지 (너무 요란함).

---

## §10. 범위 밖 (명시)

이 스펙이 **의도적으로 포함하지 않는 것**:
- L4 Patterns (온보딩, 로그인, 빈 상태, 에러 처리 패턴 문서화)
- L5 Guidelines/Do-Don't 문서
- 리빙 디자인 시스템 카탈로그 페이지(`/design-system` 같은 라우트)
- L6 Governance
- 새 일러스트·비밀친구 비주얼 랭귀지(기존 D+ 범위)
- Toast, Tooltip, Dropdown, Select, 자체 Calendar 컴포넌트

이들은 본 스펙 완료 후 후속 스펙으로 나누어 진행한다.

---

## 성공 기준

이 스펙의 구현이 끝났다는 것은:

1. `components/ui/` 에 7개 프리미티브(Button, Input, Textarea, Card, Modal, Badge, ChatBubble) 가 존재하고 각각 단위 테스트 통과.
2. `globals.css` L2 시맨틱 토큰이 신규 네이밍·타이포 역할 스케일·모션 묶음까지 정리되어 있고, `.dark` 오버라이드만으로 다크모드가 작동(페이지 단위 `dark:` 수동 분기 제거).
3. 폰트 교체 완료: Body/Heading은 Pretendard(자체 호스팅), Handwriting은 Gaegu(Google Fonts). 기존 Gowun/Nanum 임포트 전부 제거.
4. 기존 컴포넌트(`Sidebar`, `BottomNav`, `EntryCard`, `SettingsModal`, `ConfirmModal`) 가 프리미티브를 사용하도록 리팩토링되었고 시각·기능 회귀 없음.
5. `DESIGN_GUIDE.md` 에: L0 원칙 섹션 + L1 Foundation 8 카테고리 enumerate + 타이포 역할 스케일 표 + "진행중 상태" 톤 행 모두 반영.
6. 모든 프리미티브가 §9 "소곤다움 체크리스트" 를 통과 (구현 + 리뷰 체크).
