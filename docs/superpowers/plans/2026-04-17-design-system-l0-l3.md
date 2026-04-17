# 소곤 Design System L0–L3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation of 소곤's design system — codify L0 principles, formalize L1 Foundation (incl. font replacement to Pretendard + Gaegu and a typography role scale), restructure tokens into a 3-tier hierarchy (Primitive / Semantic / Component), implement 7 primitive components (Button, Input, Textarea, Card, Modal, Badge, ChatBubble), and migrate existing components to use them while meeting the "소곤다움 체크리스트".

**Architecture:** Pilot-first. Fonts are replaced (Pretendard via `next/font/local` for body/heading; Gaegu via `next/font/google` for handwriting). Typography roles (`text-display / heading / body-lg / body / body-sm / caption / friend`) are Tailwind v4 `@utility` definitions composing font+size+line-height+weight+letter-spacing. L2 semantic tokens live in `globals.css` with dark mode overrides localized there. New primitives live in `components/ui/` and consume only Semantic tokens (no primitive sizes/radii). Existing 소곤-specific widgets (`Sidebar`, `EntryCard`, `SettingsModal`, etc.) are refactored to compose the new primitives. All code uses Tailwind v4 + React 19 conventions (no `forwardRef`, no CVA, `ComponentProps<T>` extension, `ref` as prop). Every primitive is built to pass the "소곤다움 체크리스트" in spec §9.

**Tech Stack:** Next.js 16.2.2, React 19.2.4, TypeScript 6.0.2, Tailwind CSS v4, Vitest + React Testing Library, clsx.

**Spec:** `docs/superpowers/specs/2026-04-17-design-system-l0-l3-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `.claude/rules/design-guide/DESIGN_GUIDE.md` | Modify | Add L0 Principles + L1 Foundation (8 categories + typography scale + font replacement) + "진행중 상태" tone row |
| `sogon/public/fonts/PretendardVariable.woff2` | Create | Pretendard Variable font file (downloaded from orioncactus/pretendard repo) |
| `sogon/app/layout.tsx` | Modify | Replace Gowun/Nanum imports with Pretendard (next/font/local) + Gaegu (next/font/google) |
| `sogon/public/logo.svg` | Modify | Replace Gowun Batang reference with Pretendard |
| `sogon/app/globals.css` | Modify | Update font primitives + add L2 semantic tokens (shadcn naming, radius roles, motion bundles, typography role utilities) + dark overrides; deprecate old text-* names |
| `sogon/components/ui/Button.tsx` | Create | Primitive — 4 variants, 3 sizes, loading, icon slots |
| `sogon/components/ui/Button.test.tsx` | Create | RTL unit tests |
| `sogon/components/ui/Input.tsx` | Create | Primitive — text input with error, leading icon |
| `sogon/components/ui/Input.test.tsx` | Create | RTL unit tests |
| `sogon/components/ui/Textarea.tsx` | Create | Signature — 2 sizes, Cmd/Ctrl+Enter submit, counter, error |
| `sogon/components/ui/Textarea.test.tsx` | Create | RTL unit tests |
| `sogon/components/ui/Card.tsx` | Create | Primitive — padding variants, optional interactive hover |
| `sogon/components/ui/Card.test.tsx` | Create | RTL unit tests |
| `sogon/components/ui/Modal.tsx` | Create | Primitive — desktop dialog / mobile bottom sheet, focus trap, ESC |
| `sogon/components/ui/Modal.test.tsx` | Create | RTL unit tests |
| `sogon/components/ui/Badge.tsx` | Create | Primitive — 3 variants, pill shape |
| `sogon/components/ui/Badge.test.tsx` | Create | RTL unit tests |
| `sogon/components/ui/ChatBubble.tsx` | Create | Signature — user/friend × text/photo, appear animation |
| `sogon/components/ui/ChatBubble.test.tsx` | Create | RTL unit tests |
| `sogon/components/ConfirmModal.tsx` | Modify | Refactor on top of `ui/Modal` + `ui/Button` |
| `sogon/components/SettingsModal.tsx` | Modify | Refactor on top of `ui/Modal` |
| `sogon/app/(main)/record/page.tsx` | Modify | Use `ui/Textarea` + `ui/Button(variant="icon")` |
| `sogon/components/EntryCard.tsx` | Modify | Refactor on top of `ui/Card` + `ui/ChatBubble` |
| `sogon/components/Sidebar.tsx` | Modify | Nav items → `ui/Button(variant="ghost")` |
| `sogon/components/BottomNav.tsx` | Modify | Nav items → `ui/Button(variant="ghost")` |
| ~11 files with `text-text-*` usages | Modify | Mechanical rename to new token names |

**Testing commands:**
- Run all tests: `pnpm vitest run` (from `sogon/` dir)
- Watch mode: `pnpm vitest`
- Lint: `pnpm lint`
- Dev server: `pnpm dev` (for manual migration verification)

---

## Task 1: Install `clsx` dependency

Light dependency used across all primitives to compose class strings conditionally.

**Files:**
- Modify: `sogon/package.json` (via package manager)

- [ ] **Step 1: Install clsx**

Run from `sogon/` directory:
```bash
pnpm add clsx
```

Expected: `clsx` appears in `dependencies` (version ^2.x).

- [ ] **Step 2: Verify install**

Run:
```bash
pnpm list clsx
```
Expected: lists `clsx ^2.x.x`.

- [ ] **Step 3: Commit**

```bash
git add sogon/package.json sogon/pnpm-lock.yaml
git commit -m "chore: add clsx for primitive class composition"
```

---

## Task 2: Update DESIGN_GUIDE.md — L0 principles + L1 Foundation + typography + tone row

Extends the guide with L0 decision principles, an explicit L1 Foundation section covering 8 categories, a typography role scale (Pretendard + Gaegu), and the 5th Voice & Tone category.

**Files:**
- Modify: `.claude/rules/design-guide/DESIGN_GUIDE.md`

- [ ] **Step 1: Add L0 principles section at top of Brand Identity**

Open `.claude/rules/design-guide/DESIGN_GUIDE.md`. Find `### 브랜드 키워드` inside `## 1. Brand Identity`. Directly above it insert:

```markdown
### 디자인 원칙 (L0 — 의사결정 북스타)

의사결정이 애매할 때 돌아오는 3원칙. 각 원칙에는 "충돌할 때 선택" 규칙이 명시돼 있다.

#### 1. 속삭이듯 (Whisper, not announce)
기능을 "알리지" 말고 "내비친다". 큰 CTA·굵은 텍스트·밝은 accent보다 작고 부드러운 제스처를 먼저 고려. 토스트·배너·팝업보다 제자리 피드백을 우선.
**충돌할 때**: 시끄러운 명료함 vs. 조용한 충분함 → 조용한 쪽.

#### 2. 친구처럼 (Companion, not tool)
UI 카피·마이크로카피·버튼 레이블이 "도구"가 아니라 "친구"의 목소리를 낸다.
**충돌할 때**: 생산성 앱스러움 vs. 관계스러움 → 관계스러움.

#### 3. 안전하게 (Safe to be vulnerable)
사용자가 약한 감정을 꺼낼 수 있어야 한다. 평가·수치(카운트, 스트릭)·비교·FOMO 유발 요소는 기본적으로 거부. 삭제·실수·오류도 죄책감 없이 복구 가능하게.
**충돌할 때**: 게임화·성과 피드백 vs. 무조건적 수용 → 수용.

```

- [ ] **Step 2: Add "진행중 상태" row to Voice & Tone table**

Find the `### Voice & Tone` section. Current table ends with:
```
| 성공 피드백 | 가볍고 따뜻한 확인 | "기록 완료!" |
```
After that line, add:
```
| 진행중 상태 | 원칙 ②(친구처럼) 강 발현, 시스템스럽지 않게 | "비밀친구에게 전하고 있어…" |
```

- [ ] **Step 3: Add L1 Foundation section (new, placed after the Voice & Tone section)**

Scroll down past the Voice & Tone table and past `### 용어 규칙`. Before `## 2. Spacing & Layout`, insert a new section:

````markdown
### L1 Foundation — 시각 언어의 기초 재료

소곤의 L1 Foundation은 8개 카테고리로 구성된다.

| # | 카테고리 | 이 가이드 내 위치 |
|---|---------|-------------------|
| 1 | 색 | `§3 Border Radius & Shadows` + `globals.css` 토큰 |
| 2 | 타이포 | 본 절 (아래) + `#폰트` 단락 |
| 3 | 간격 | `§2 Spacing & Layout` |
| 4 | 레이아웃 그리드 | `§2 Spacing & Layout` |
| 5 | 아이콘 | `§5 Iconography` |
| 6 | 모션 | `§8 Motion & Animation` |
| 7 | 일러스트 | 현재 out-of-scope (D+ 영역, 후속 스펙) |
| 8 | 보이스앤톤 | `§1 Voice & Tone` |

#### 폰트

| 역할 | 폰트 | 로딩 방식 |
|------|------|-----------|
| Body / Heading | **Pretendard** (Variable 45-920) | `next/font/local` (`public/fonts/PretendardVariable.woff2`) |
| Handwriting (비밀친구 리액션 전용) | **Gaegu** (300/400/700) | `next/font/google` |

기존 Gowun Dodum / Gowun Batang / Nanum Pen Script 임포트는 전부 제거한다.

#### 타이포 역할 스케일

프리미티브 컴포넌트는 반드시 아래 역할 토큰만 사용한다 (`text-lg` 같은 primitive 크기 유틸리티 직접 참조 금지).

| 역할 (Tailwind 유틸) | 크기 | 폰트·가중 | line-height | letter-spacing | 사용처 |
|-------------------|-----|-----------|-------------|---------------|--------|
| `text-display` | 28px | Pretendard 700 | 1.3 | -0.02em | 온보딩 큰 제목 |
| `text-heading` | 20px | Pretendard 600 | 1.4 | -0.01em | 섹션 헤더, 캘린더 월 |
| `text-body-lg` | 18px | Pretendard 400 | 1.65 | 0 | 기록 본문 (Textarea diary, Card body) |
| `text-body` | 16px | Pretendard 400 | 1.6 | 0 | 기본 텍스트, 버튼 라벨 |
| `text-body-sm` | 14px | Pretendard 400 | 1.55 | 0 | 보조 텍스트 |
| `text-caption` | 12px | Pretendard 500 | 1.5 | 0.01em | 타임스탬프, 카운터, 배지 |
| `text-friend` | 18px | Gaegu 400 | 1.55 | 0 | 비밀친구 리액션 전용 |

#### 레이어 구분 (L0 vs L1)

- **L0 원칙** (위 `### 디자인 원칙` 섹션) — 의사결정 북스타. 세 원칙 + 충돌 기준.
- **L1 사용 규칙** (기존 `§9 디자인 원칙` 7개 항목) — "시각 언어의 사용 방식". 좁은 컬럼, 넉넉한 여백, 최소 그림자, 손글씨체로 친구 구분, 날카로운 모서리 없음, 느리고 부드러운 애니메이션, 컬러 미니멀리즘.

`§9 디자인 원칙` 은 그대로 두되 제목을 `## 9. L1 사용 규칙 (Visual Execution Rules)` 로 교체한다 (다음 단계에서).
````

- [ ] **Step 4: Rename `§9 디자인 원칙` section heading**

Find `## 9. 디자인 원칙` heading near the bottom of the file. Replace it with:
```markdown
## 9. L1 사용 규칙 (Visual Execution Rules)
```

Keep all sub-content under it unchanged.

- [ ] **Step 5: Commit**

```bash
git add .claude/rules/design-guide/DESIGN_GUIDE.md
git commit -m "docs: add L0 principles, L1 Foundation section, typography role scale, tone row"
```

---

## Task 3: Replace fonts (Pretendard + Gaegu), expand `globals.css` with typography role tokens + L2 semantic tokens

This task does three things in one commit since they're interdependent:

1. Download Pretendard Variable woff2 and load it via `next/font/local`; add Gaegu via `next/font/google`; remove existing Gowun/Nanum imports.
2. Update `globals.css` font variables to reference the new fonts.
3. Add new L2 semantic tokens (colors, radius roles, motion bundles) AND typography role tokens (text-display/heading/body-lg/body/body-sm/caption/friend).

**Files:**
- Modify: `sogon/app/layout.tsx`
- Create: `sogon/public/fonts/PretendardVariable.woff2`
- Modify: `sogon/app/globals.css`
- Modify: `sogon/public/logo.svg` (remove Gowun Batang reference)

- [ ] **Step 1: Download Pretendard Variable woff2**

From `sogon/` directory:
```bash
mkdir -p public/fonts
curl -L -o public/fonts/PretendardVariable.woff2 \
  "https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"
ls -lh public/fonts/PretendardVariable.woff2
```
Expected: file size around 1.1 MB.

- [ ] **Step 2: Update `layout.tsx` font imports**

Replace the entire contents of `sogon/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Gaegu } from "next/font/google";
import "./globals.css";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const gaegu = Gaegu({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "\uC18C\uACE4",
  description: "\uD504\uB77C\uC774\uBE57\uD55C\uB370 \uBC18\uC751\uC774 \uC788\uB294 \uD558\uB8E8 \uAE30\uB85D \uACF5\uAC04",
  verification: {
    google: "ggKZ1AlVWDBwCfiFZ0cPmk_dOBSPmU8D4_KwrPz348o",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${gaegu.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('sogon_theme');if(t==='dark')document.documentElement.classList.add('dark');else if(t!=='light')document.documentElement.classList.add('system-theme')})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Replace `@theme inline { … }` block in `globals.css`**

Open `sogon/app/globals.css`. Find the `@theme inline { … }` block. Replace only the "Font families" section (4 lines `--font-body`, `--font-heading`, `--font-handwriting`, and any related) with:

```css
  /* ============ L1 Primitive — Fonts ============ */
  --font-body: var(--font-pretendard);
  --font-heading: var(--font-pretendard);
  --font-handwriting: var(--font-gaegu);
```

Leave all other lines in the block (color primitives, radius primitives, shadow primitives, ease primitives) unchanged.

- [ ] **Step 4: Replace the second `@theme { … }` block (non-inline) with expanded tokens**

Still in `globals.css`, find the second `@theme { … }` block (without `inline`, around line 55 before any edits). Replace it with:

```css
@theme {
  /* ============ L2 Semantic — Colors (light defaults) ============ */
  /* Surfaces */
  --color-surface: #FFFFFF;
  --color-elevated: #F3F5F4;
  --color-muted: #EAF6E5;

  /* Foregrounds (text / icon on surface) */
  --color-foreground: #1a1c1b;
  --color-muted-foreground: #7D8381;
  --color-subtle-foreground: #A8ADAA;
  --color-placeholder: #D0D3D1;

  /* Accent (brand) */
  --color-accent: #57A347;
  --color-accent-hover: #45873A;
  --color-accent-muted: #EAF6E5;
  --color-accent-foreground: #FFFFFF;

  /* Border */
  --color-border: #E5E7E6;
  --color-border-focus: #6EBD5A;

  /* Status */
  --color-danger: #c94f4f;
  --color-danger-muted: #fce7e7;

  /* Overlay */
  --color-overlay-scrim: rgba(0, 0, 0, 0.5);

  /* ============ L2 Semantic — Radius roles ============ */
  --radius-control: 10px;
  --radius-field: 16px;
  --radius-card: 20px;
  --radius-bubble: 24px;
  --radius-bubble-tail: 6px;
  --radius-pill: 9999px;

  /* ============ L2 Semantic — Motion bundles (duration + easing) ============ */
  --motion-hover: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --motion-press: 100ms cubic-bezier(0.16, 1, 0.3, 1);
  --motion-page: 350ms cubic-bezier(0.65, 0, 0.35, 1);
  --motion-reaction-appear: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ============ Legacy (to be removed in Task 4) ============ */
  --color-primary-muted: #EAF6E5;
  --color-text-primary: #1a1c1b;
  --color-text-secondary: #7D8381;
  --color-text-tertiary: #A8ADAA;
  --color-text-placeholder: #D0D3D1;
}
```

- [ ] **Step 5: Add typography role tokens as Tailwind utility classes via `@utility`**

Append the following to `globals.css` (below the `@keyframes` blocks, above the `body` rule):

```css
/* ============ L2 Semantic — Typography roles ============ */
/* Tailwind v4 @utility lets us define role utilities that compose
   font-family + size + line-height + weight + letter-spacing. */
@utility text-display {
  font-family: var(--font-heading);
  font-size: 28px;
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: -0.02em;
}
@utility text-heading {
  font-family: var(--font-heading);
  font-size: 20px;
  line-height: 1.4;
  font-weight: 600;
  letter-spacing: -0.01em;
}
@utility text-body-lg {
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.65;
  font-weight: 400;
}
@utility text-body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
}
@utility text-body-sm {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.55;
  font-weight: 400;
}
@utility text-caption {
  font-family: var(--font-body);
  font-size: 12px;
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: 0.01em;
}
@utility text-friend {
  font-family: var(--font-handwriting);
  font-size: 18px;
  line-height: 1.55;
  font-weight: 400;
}
```

- [ ] **Step 6: Replace the `.dark` override block**

Find the existing `.dark { … }` block. Replace it with:

```css
.dark {
  --background: #1c1e1d;
  --foreground: #e5e7e6;

  /* L2 Semantic overrides */
  --color-surface: #242726;
  --color-elevated: #2d302f;
  --color-muted: #2a3d25;
  --color-foreground: #e5e7e6;
  --color-muted-foreground: #8a8f8d;
  --color-subtle-foreground: #6b706e;
  --color-placeholder: #4a4d4c;
  --color-accent: #6EBD5A;
  --color-accent-hover: #93D17E;
  --color-accent-muted: #2a3d25;
  --color-accent-foreground: #1c1e1d;
  --color-border: #3a3d3c;
  --color-border-focus: #93D17E;
  --color-danger: #d97878;
  --color-danger-muted: #3d2626;

  /* Legacy (remove with Task 4) */
  --color-primary-muted: #2a3d25;
  --color-text-primary: #e5e7e6;
  --color-text-secondary: #8a8f8d;
  --color-text-tertiary: #6b706e;
  --color-text-placeholder: #4a4d4c;
}
```

- [ ] **Step 7: Replace the `@media (prefers-color-scheme: dark) .system-theme` block**

Replace its body identically to the `.dark` block body above.

- [ ] **Step 8: Update `public/logo.svg` to remove Gowun Batang**

Open `sogon/public/logo.svg`. Find the `@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@700&display=swap');` and the `font-family="'Gowun Batang'"` attribute. Replace both to use Pretendard:

```
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
```
and the font-family attribute:
```
font-family="'Pretendard'"
```

(The CDN import works for standalone SVG rendering since SVG files aren't served by Next.)

- [ ] **Step 9: Run dev server and visually verify**

```bash
cd sogon && pnpm dev
```
Open http://localhost:3000. Verify:
- All text renders with Pretendard (no Gowun).
- Friend-style text (if visible) renders with Gaegu.
- Logo still renders correctly.
- Dark mode toggle still works.

Stop dev server.

- [ ] **Step 10: Commit**

```bash
git add sogon/public/fonts/PretendardVariable.woff2 sogon/app/layout.tsx sogon/app/globals.css sogon/public/logo.svg
git commit -m "feat: replace fonts with Pretendard + Gaegu, add typography role tokens and L2 semantic tokens"
```

---

## Task 4: Mechanical rename of legacy token usages → new names

Replace all 41 uses of `text-text-primary` / `text-text-secondary` / `text-text-tertiary` / `text-text-placeholder` across 11 files. Remove the legacy tokens from `globals.css` afterward.

**Files affected (11):**
- `sogon/components/SettingsModal.tsx`
- `sogon/components/BottomNav.tsx`
- `sogon/components/EntryCard.tsx`
- `sogon/components/Sidebar.tsx`
- `sogon/components/ConfirmModal.tsx`
- `sogon/app/page.tsx`
- `sogon/app/ToneCard.tsx`
- `sogon/app/(main)/record/page.tsx`
- `sogon/app/(main)/record/[id]/reaction/ReactionView.tsx`
- `sogon/app/(main)/collection/page.tsx`
- `sogon/app/(main)/collection/CalendarView.tsx`

**Rename mapping:**

| Old class | New class |
|-----------|-----------|
| `text-text-primary` | `text-foreground` |
| `text-text-secondary` | `text-muted-foreground` |
| `text-text-tertiary` | `text-subtle-foreground` |
| `text-text-placeholder` | `text-placeholder` |
| `placeholder:text-text-placeholder` | `placeholder:text-placeholder` |

Also rename these bg/border usages discovered in the codebase:

| Old class | New class |
|-----------|-----------|
| `bg-primary-muted` | `bg-accent-muted` |
| `border-primary-muted` | `border-accent-muted` |
| `text-primary-muted` | `text-accent-muted` |

- [ ] **Step 1: Verify current occurrence count (baseline)**

Run from repo root:
```bash
grep -rE "text-text-(primary|secondary|tertiary|placeholder)" sogon/ | wc -l
```
Expected: a number around 41.

```bash
grep -rE "(bg|border|text)-primary-muted" sogon/ | wc -l
```
Expected: some number (record it).

- [ ] **Step 2: Perform replacements across the codebase**

Run these `sed` commands from the repo root (they operate in-place):

```bash
# text-text-* renames
find sogon -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/text-text-primary/text-foreground/g' \
  -e 's/text-text-secondary/text-muted-foreground/g' \
  -e 's/text-text-tertiary/text-subtle-foreground/g' \
  -e 's/text-text-placeholder/text-placeholder/g' \
  -e 's/placeholder:text-text-placeholder/placeholder:text-placeholder/g' \
  {} +

# *-primary-muted renames
find sogon -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/bg-primary-muted/bg-accent-muted/g' \
  -e 's/border-primary-muted/border-accent-muted/g' \
  -e 's/text-primary-muted/text-accent-muted/g' \
  {} +
```

- [ ] **Step 3: Verify zero legacy class occurrences remain**

```bash
grep -rE "text-text-(primary|secondary|tertiary|placeholder)" sogon/ || echo "CLEAN"
grep -rE "(bg|border|text)-primary-muted" sogon/ || echo "CLEAN"
```
Expected: both print `CLEAN`.

- [ ] **Step 4: Remove legacy tokens from globals.css**

Open `sogon/app/globals.css`. In the `@theme { … }` block, delete the 5 legacy lines:
```css
  /* ============ Legacy (to be removed in Task 4) ============ */
  --color-primary-muted: #EAF6E5;
  --color-text-primary: #1a1c1b;
  --color-text-secondary: #7D8381;
  --color-text-tertiary: #A8ADAA;
  --color-text-placeholder: #D0D3D1;
```

In both the `.dark` block and the `@media (prefers-color-scheme: dark) .system-theme` block, delete the corresponding legacy lines:
```css
  /* Legacy (remove with Task 4) */
  --color-primary-muted: #2a3d25;
  --color-text-primary: #e5e7e6;
  --color-text-secondary: #8a8f8d;
  --color-text-tertiary: #6b706e;
  --color-text-placeholder: #4a4d4c;
```

- [ ] **Step 5: Type-check and lint**

```bash
cd sogon && pnpm lint && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Run dev server and verify visually**

```bash
cd sogon && pnpm dev
```
Visit http://localhost:3000, toggle dark mode in settings, walk through record / collection / settings pages. Verify nothing looks broken. Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add sogon/
git commit -m "refactor: rename legacy color tokens to shadcn-style semantic names"
```

---

## Task 5: Create `ui/Button` primitive

Most-used primitive. 4 variants × 3 sizes × loading state. Used by migration tasks later.

**Files:**
- Create: `sogon/components/ui/Button.tsx`
- Create: `sogon/components/ui/Button.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `sogon/components/ui/Button.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>저장</Button>);
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>누르기</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        저장
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows a spinner and sets aria-busy when loading", () => {
    render(<Button loading>저장</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });

  it("renders leadingIcon and trailingIcon slots", () => {
    render(
      <Button
        leadingIcon={<span data-testid="lead">L</span>}
        trailingIcon={<span data-testid="trail">T</span>}
      >
        label
      </Button>,
    );
    expect(screen.getByTestId("lead")).toBeInTheDocument();
    expect(screen.getByTestId("trail")).toBeInTheDocument();
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">2차</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-accent-muted/);
  });

  it("renders icon variant as round button", () => {
    render(
      <Button variant="icon" aria-label="전송">
        ↑
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "전송" });
    expect(btn.className).toMatch(/rounded-pill/);
  });
});
```

- [ ] **Step 2: Run the failing tests**

```bash
cd sogon && pnpm vitest run components/ui/Button.test.tsx
```
Expected: FAIL — `Button` not found (module resolution error).

- [ ] **Step 3: Implement Button**

Create `sogon/components/ui/Button.tsx` with:

```tsx
"use client";

import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

/** Button anatomy: [leadingIcon?] [label | spinner] [trailingIcon?] */

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm",
  secondary:
    "bg-accent-muted text-accent border border-accent-muted hover:brightness-95",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-elevated hover:text-foreground",
  icon:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm rounded-pill",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-body-sm",
  md: "h-10 px-5 text-body-sm",
  lg: "h-12 px-6 text-body",
};

const ICON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "w-8 h-8 px-0",
  md: "w-10 h-10 px-0",
  lg: "w-12 h-12 px-0",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leadingIcon,
  trailingIcon,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const isIcon = variant === "icon";
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      style={{ transition: "background-color var(--motion-hover), transform var(--motion-press)" }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-control font-medium",
        "active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
        "motion-reduce:active:scale-100 motion-reduce:transition-none",
        VARIANT_CLASSES[variant],
        isIcon ? ICON_SIZE_CLASSES[size] : SIZE_CLASSES[size],
        className,
      )}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {leadingIcon}
          {children}
          {trailingIcon}
        </>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
    />
  );
}
```

- [ ] **Step 4: Run tests until they pass**

```bash
cd sogon && pnpm vitest run components/ui/Button.test.tsx
```
Expected: all 7 tests PASS.

- [ ] **Step 5: Type-check**

```bash
cd sogon && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add sogon/components/ui/Button.tsx sogon/components/ui/Button.test.tsx
git commit -m "feat: add ui/Button primitive with 4 variants, 3 sizes, loading state"
```

---

## Task 6: Create `ui/Input` primitive

Single-line text input with error state and optional leading icon.

**Files:**
- Create: `sogon/components/ui/Input.tsx`
- Create: `sogon/components/ui/Input.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `sogon/components/ui/Input.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with a placeholder", () => {
    render(<Input placeholder="이름" />);
    expect(screen.getByPlaceholderText("이름")).toBeInTheDocument();
  });

  it("fires onChange when typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("sets aria-invalid when error is true", () => {
    render(<Input error aria-label="이름" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders error message and links it via aria-describedby", () => {
    render(<Input error errorMessage="비워둘 수 없어" aria-label="이름" />);
    const input = screen.getByRole("textbox");
    const descId = input.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(screen.getByText("비워둘 수 없어")).toHaveAttribute("id", descId!);
  });

  it("renders leading icon slot", () => {
    render(
      <Input leadingIcon={<span data-testid="icon">🔍</span>} aria-label="검색" />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run failing tests**

```bash
cd sogon && pnpm vitest run components/ui/Input.test.tsx
```
Expected: FAIL — `Input` not found.

- [ ] **Step 3: Implement Input**

Create `sogon/components/ui/Input.tsx`:

```tsx
"use client";

import clsx from "clsx";
import { useId, type ComponentProps, type ReactNode } from "react";

/** Input anatomy: [leadingIcon?] [<input>] + [errorMessage?] */

export type InputProps = ComponentProps<"input"> & {
  error?: boolean;
  errorMessage?: string;
  leadingIcon?: ReactNode;
  wrapperClassName?: string;
};

export function Input({
  error = false,
  errorMessage,
  leadingIcon,
  className,
  wrapperClassName,
  id,
  ...rest
}: InputProps) {
  const autoId = useId();
  const descriptionId = errorMessage ? `${autoId}-err` : undefined;

  return (
    <div className={clsx("flex flex-col gap-1", wrapperClassName)}>
      <div
        className={clsx(
          "flex items-center gap-2 rounded-control bg-surface",
          "border transition-colors duration-150 ease-out",
          error
            ? "border-danger focus-within:ring-2 focus-within:ring-danger/20"
            : "border-border focus-within:border-border-focus focus-within:ring-[3px] focus-within:ring-border-focus/20",
        )}
      >
        {leadingIcon ? (
          <span className="pl-3 text-muted-foreground" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <input
          {...rest}
          id={id ?? rest.name ?? autoId}
          aria-invalid={error || undefined}
          aria-describedby={descriptionId}
          className={clsx(
            "flex-1 bg-transparent px-4 py-2.5 text-foreground outline-none",
            "placeholder:text-placeholder",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leadingIcon && "pl-0",
            className,
          )}
        />
      </div>
      {errorMessage ? (
        <p id={descriptionId} className="text-caption text-danger">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd sogon && pnpm vitest run components/ui/Input.test.tsx
```
Expected: all 5 tests PASS.

- [ ] **Step 5: Type-check**

```bash
cd sogon && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add sogon/components/ui/Input.tsx sogon/components/ui/Input.test.tsx
git commit -m "feat: add ui/Input primitive with error state and leading icon slot"
```

---

## Task 7: Create `ui/Badge` primitive

Small pill with 3 variants.

**Files:**
- Create: `sogon/components/ui/Badge.tsx`
- Create: `sogon/components/ui/Badge.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `sogon/components/ui/Badge.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>오늘</Badge>);
    expect(screen.getByText("오늘")).toBeInTheDocument();
  });

  it("applies accent variant classes", () => {
    render(<Badge variant="accent">3일</Badge>);
    expect(screen.getByText("3일").className).toMatch(/bg-accent-muted/);
  });

  it("applies danger variant classes", () => {
    render(<Badge variant="danger">실패</Badge>);
    expect(screen.getByText("실패").className).toMatch(/bg-danger-muted/);
  });
});
```

- [ ] **Step 2: Run failing tests**

```bash
cd sogon && pnpm vitest run components/ui/Badge.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement Badge**

Create `sogon/components/ui/Badge.tsx`:

```tsx
import clsx from "clsx";
import type { ComponentProps } from "react";

/** Badge anatomy: [children] (pill-shaped) */

type BadgeVariant = "default" | "accent" | "danger";

export type BadgeProps = ComponentProps<"span"> & {
  variant?: BadgeVariant;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-elevated text-muted-foreground",
  accent: "bg-accent-muted text-accent",
  danger: "bg-danger-muted text-danger",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={clsx(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-caption",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd sogon && pnpm vitest run components/ui/Badge.test.tsx
```
Expected: all 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add sogon/components/ui/Badge.tsx sogon/components/ui/Badge.test.tsx
git commit -m "feat: add ui/Badge primitive with default/accent/danger variants"
```

---

## Task 8: Create `ui/Card` primitive

Generic surface card. Composable — 소곤-specific EntryCard will build on top.

**Files:**
- Create: `sogon/components/ui/Card.tsx`
- Create: `sogon/components/ui/Card.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `sogon/components/ui/Card.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>hello</Card>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("applies default md padding", () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId("c").className).toMatch(/p-5/);
  });

  it("applies sm padding when specified", () => {
    render(
      <Card data-testid="c" padding="sm">
        x
      </Card>,
    );
    expect(screen.getByTestId("c").className).toMatch(/p-3/);
  });

  it("applies hover shadow when interactive", () => {
    render(
      <Card data-testid="c" interactive>
        x
      </Card>,
    );
    expect(screen.getByTestId("c").className).toMatch(/hover:shadow-md/);
  });
});
```

- [ ] **Step 2: Run failing tests**

```bash
cd sogon && pnpm vitest run components/ui/Card.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement Card**

Create `sogon/components/ui/Card.tsx`:

```tsx
import clsx from "clsx";
import type { ComponentProps } from "react";

/** Card anatomy: rounded surface with padding; optional hover lift */

type CardPadding = "sm" | "md" | "lg";

export type CardProps = ComponentProps<"div"> & {
  padding?: CardPadding;
  interactive?: boolean;
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  padding = "md",
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "rounded-card bg-surface border border-border shadow-sm",
        PADDING_CLASSES[padding],
        interactive && "transition-shadow duration-150 ease-out hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd sogon && pnpm vitest run components/ui/Card.test.tsx
```
Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add sogon/components/ui/Card.tsx sogon/components/ui/Card.test.tsx
git commit -m "feat: add ui/Card primitive with padding variants and interactive hover"
```

---

## Task 9: Create `ui/Textarea` primitive (signature 1)

소곤의 시그니처 기록 입력. 2 sizes, Cmd/Ctrl+Enter submit, char counter, error.

**Files:**
- Create: `sogon/components/ui/Textarea.tsx`
- Create: `sogon/components/ui/Textarea.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `sogon/components/ui/Textarea.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders with placeholder", () => {
    render(<Textarea placeholder="오늘은 어떤 하루였어?" aria-label="기록" />);
    expect(screen.getByPlaceholderText("오늘은 어떤 하루였어?")).toBeInTheDocument();
  });

  it("applies diary size as default", () => {
    render(<Textarea aria-label="기록" data-testid="ta" />);
    expect(screen.getByTestId("ta").className).toMatch(/rounded-field/);
  });

  it("applies compact size when specified", () => {
    render(<Textarea size="compact" aria-label="기록" data-testid="ta" />);
    expect(screen.getByTestId("ta").className).toMatch(/rounded-control/);
  });

  it("shows counter when showCounter is set", () => {
    render(
      <Textarea
        showCounter
        value="hello"
        onChange={() => {}}
        aria-label="기록"
        maxLength={100}
      />,
    );
    expect(screen.getByText("5 / 100")).toBeInTheDocument();
  });

  it("renders error message and aria-invalid when error", () => {
    render(
      <Textarea
        error
        errorMessage="앗, 잠깐 문제가 생겼어."
        aria-label="기록"
      />,
    );
    const ta = screen.getByRole("textbox");
    expect(ta).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("앗, 잠깐 문제가 생겼어.")).toBeInTheDocument();
  });

  it("calls onSubmit on Cmd/Ctrl+Enter by default", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Textarea onSubmit={onSubmit} aria-label="기록" />);
    const ta = screen.getByRole("textbox");
    await user.type(ta, "hello");
    await user.keyboard("{Meta>}{Enter}{/Meta}");
    expect(onSubmit).toHaveBeenCalledWith("hello");
  });

  it("does not submit on plain Enter (default submitOnEnter='cmd')", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Textarea onSubmit={onSubmit} aria-label="기록" />);
    const ta = screen.getByRole("textbox");
    await user.type(ta, "hello");
    await user.keyboard("{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run failing tests**

```bash
cd sogon && pnpm vitest run components/ui/Textarea.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement Textarea**

Create `sogon/components/ui/Textarea.tsx`:

```tsx
"use client";

import clsx from "clsx";
import {
  useCallback,
  useId,
  type ComponentProps,
  type KeyboardEvent,
} from "react";

/** Textarea anatomy: <textarea> + [counter?] + [errorMessage?] */

type TextareaSize = "diary" | "compact";
type SubmitKey = "cmd" | "shift" | false;

export type TextareaProps = Omit<ComponentProps<"textarea">, "size"> & {
  size?: TextareaSize;
  error?: boolean;
  errorMessage?: string;
  showCounter?: boolean;
  submitOnEnter?: SubmitKey;
  onSubmit?: (value: string) => void;
  wrapperClassName?: string;
};

const SIZE_CLASSES: Record<TextareaSize, string> = {
  diary:
    "rounded-field text-body-lg p-5 min-h-[120px]",
  compact: "rounded-control text-body-sm p-3.5 min-h-[72px]",
};

export function Textarea({
  size = "diary",
  error = false,
  errorMessage,
  showCounter = false,
  submitOnEnter = "cmd",
  onSubmit,
  onKeyDown,
  maxLength = 2000,
  value,
  className,
  wrapperClassName,
  id,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const describedBy = errorMessage ? `${autoId}-err` : undefined;
  const currentLength = typeof value === "string" ? value.length : 0;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (submitOnEnter === false || !onSubmit) return;

      const triggered =
        e.key === "Enter" &&
        ((submitOnEnter === "cmd" && (e.metaKey || e.ctrlKey)) ||
          (submitOnEnter === "shift" && e.shiftKey));

      if (triggered) {
        e.preventDefault();
        onSubmit(e.currentTarget.value);
      }
    },
    [onKeyDown, submitOnEnter, onSubmit],
  );

  return (
    <div className={clsx("flex flex-col gap-1", wrapperClassName)}>
      <textarea
        {...rest}
        id={id ?? autoId}
        value={value}
        maxLength={maxLength}
        onKeyDown={handleKeyDown}
        aria-invalid={error || undefined}
        aria-describedby={describedBy}
        className={clsx(
          "w-full bg-surface text-foreground border outline-none resize-vertical",
          "placeholder:text-placeholder",
          "transition-colors duration-150 ease-out",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-elevated",
          error
            ? "border-danger focus:ring-[3px] focus:ring-danger/20"
            : "border-border focus:border-border-focus focus:ring-[3px] focus:ring-border-focus/20",
          SIZE_CLASSES[size],
          className,
        )}
      />
      <div className="flex justify-between items-start gap-2 min-h-[1em]">
        {errorMessage ? (
          <p id={describedBy} className="text-caption text-danger">
            {errorMessage}
          </p>
        ) : (
          <span />
        )}
        {showCounter ? (
          <span className="text-caption text-subtle-foreground tabular-nums shrink-0">
            {currentLength} / {maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd sogon && pnpm vitest run components/ui/Textarea.test.tsx
```
Expected: all 7 tests PASS.

- [ ] **Step 5: Type-check**

```bash
cd sogon && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add sogon/components/ui/Textarea.tsx sogon/components/ui/Textarea.test.tsx
git commit -m "feat: add ui/Textarea primitive with diary/compact sizes and submit shortcut"
```

---

## Task 10: Create `ui/Modal` primitive

Desktop dialog / mobile bottom sheet. Uses native `<dialog>` — gives focus trap and ESC-to-close for free.

**Files:**
- Create: `sogon/components/ui/Modal.tsx`
- Create: `sogon/components/ui/Modal.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `sogon/components/ui/Modal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("does not render content when closed", () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="제목">
        <p>내용</p>
      </Modal>,
    );
    expect(screen.queryByText("내용")).not.toBeInTheDocument();
  });

  it("renders content when open", () => {
    render(
      <Modal open onOpenChange={() => {}} title="제목">
        <p>내용</p>
      </Modal>,
    );
    expect(screen.getByText("내용")).toBeInTheDocument();
  });

  it("uses dialog role with aria-label from title", () => {
    render(
      <Modal open onOpenChange={() => {}} title="설정">
        <p>x</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "설정");
  });

  it("calls onOpenChange(false) when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="x">
        <p>내용</p>
      </Modal>,
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
```

- [ ] **Step 2: Run failing tests**

```bash
cd sogon && pnpm vitest run components/ui/Modal.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement Modal**

Create `sogon/components/ui/Modal.tsx`:

```tsx
"use client";

import clsx from "clsx";
import { useEffect, useRef, type ReactNode } from "react";

/** Modal anatomy: backdrop scrim + centered dialog (desktop) / bottom sheet (mobile) */

type ModalSize = "sm" | "md" | "lg";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
};

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
};

export function Modal({
  open,
  onOpenChange,
  title,
  size = "md",
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClick={(e) => {
        if (e.target === dialogRef.current) onOpenChange(false);
      }}
      className={clsx(
        "bg-transparent p-0 m-0 max-w-full max-h-full w-full h-full",
        "backdrop:bg-overlay-scrim",
      )}
    >
      <div
        role="dialog"
        aria-label={title}
        className={clsx(
          "fixed inset-0 flex items-end sm:items-center justify-center",
          "animate-[reaction-appear_350ms_var(--ease-out)_forwards] motion-reduce:animate-none",
        )}
      >
        <div
          className={clsx(
            "w-full bg-surface text-foreground shadow-lg",
            "rounded-t-card sm:rounded-card",
            "sm:mx-4",
            SIZE_CLASSES[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </dialog>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd sogon && pnpm vitest run components/ui/Modal.test.tsx
```
Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add sogon/components/ui/Modal.tsx sogon/components/ui/Modal.test.tsx
git commit -m "feat: add ui/Modal primitive using native dialog with responsive sheet layout"
```

---

## Task 11: Create `ui/ChatBubble` primitive (signature 2)

`author: "user" | "friend"` × `content: "text" | "photo"`. Friend bubbles use handwriting font and optional appear animation.

**Files:**
- Create: `sogon/components/ui/ChatBubble.tsx`
- Create: `sogon/components/ui/ChatBubble.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `sogon/components/ui/ChatBubble.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatBubble } from "./ChatBubble";

describe("ChatBubble", () => {
  it("renders text content for user author", () => {
    render(
      <ChatBubble author="user" content="text">
        오늘 공원에 갔어
      </ChatBubble>,
    );
    expect(screen.getByText("오늘 공원에 갔어")).toBeInTheDocument();
  });

  it("renders friend bubble with text-friend role class (Gaegu handwriting)", () => {
    render(
      <ChatBubble author="friend" content="text" data-testid="b">
        잘 쉬었네
      </ChatBubble>,
    );
    expect(screen.getByTestId("b").className).toMatch(/text-friend/);
  });

  it("applies user tail radius (BR = radius-bubble-tail)", () => {
    render(
      <ChatBubble author="user" content="text" data-testid="b">
        x
      </ChatBubble>,
    );
    expect(screen.getByTestId("b").className).toMatch(/rounded-br-bubble-tail/);
  });

  it("applies friend tail radius (BL = radius-bubble-tail)", () => {
    render(
      <ChatBubble author="friend" content="text" data-testid="b">
        x
      </ChatBubble>,
    );
    expect(screen.getByTestId("b").className).toMatch(/rounded-bl-bubble-tail/);
  });

  it("renders timestamp when provided", () => {
    render(
      <ChatBubble author="user" content="text" timestamp="오후 9:42">
        x
      </ChatBubble>,
    );
    expect(screen.getByText("오후 9:42")).toBeInTheDocument();
  });

  it("renders avatar slot for friend author", () => {
    render(
      <ChatBubble
        author="friend"
        content="text"
        avatar={<span data-testid="avatar">🌱</span>}
      >
        x
      </ChatBubble>,
    );
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("applies appear animation class when appearOnMount is true", () => {
    render(
      <ChatBubble author="friend" content="text" appearOnMount data-testid="b">
        x
      </ChatBubble>,
    );
    expect(screen.getByTestId("b").className).toMatch(/reaction-appear/);
  });
});
```

- [ ] **Step 2: Run failing tests**

```bash
cd sogon && pnpm vitest run components/ui/ChatBubble.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement ChatBubble**

Create `sogon/components/ui/ChatBubble.tsx`:

```tsx
import clsx from "clsx";
import type { ReactNode } from "react";

/** ChatBubble anatomy:
 *   user:   [timestamp?]  [bubble]
 *   friend: [avatar?] [bubble]
 */

type ChatBubbleAuthor = "user" | "friend";
type ChatBubbleContent = "text" | "photo";

export type ChatBubbleProps = {
  author: ChatBubbleAuthor;
  content: ChatBubbleContent;
  timestamp?: string;
  avatar?: ReactNode;
  appearOnMount?: boolean;
  className?: string;
  children: ReactNode;
  "data-testid"?: string;
};

export function ChatBubble({
  author,
  content,
  timestamp,
  avatar,
  appearOnMount = false,
  className,
  children,
  ...rest
}: ChatBubbleProps) {
  const isUser = author === "user";
  const isFriend = author === "friend";
  const isPhoto = content === "photo";

  const bubbleClasses = clsx(
    "inline-block max-w-[85%] shadow-sm",
    isUser
      ? "bg-surface text-foreground border border-border rounded-bubble rounded-br-bubble-tail text-body"
      : "bg-elevated text-foreground rounded-bubble rounded-bl-bubble-tail text-friend",
    isPhoto ? "p-0 overflow-hidden" : "px-5 py-3.5",
    appearOnMount &&
      "animate-[reaction-appear_500ms_var(--ease-spring)_both] motion-reduce:animate-none",
    className,
  );

  const rowClasses = clsx(
    "flex items-end gap-2",
    isUser ? "justify-end" : "justify-start",
  );

  const content_ = (
    <div className={bubbleClasses} {...rest}>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {timestamp ? (
        <p
          className={clsx(
            "text-caption text-subtle-foreground",
            isUser ? "text-right" : "text-left",
          )}
        >
          {timestamp}
        </p>
      ) : null}
      <div className={rowClasses}>
        {isFriend && avatar ? (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-pill bg-accent-muted text-accent shrink-0 mb-0.5">
            {avatar}
          </span>
        ) : null}
        {content_}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd sogon && pnpm vitest run components/ui/ChatBubble.test.tsx
```
Expected: all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add sogon/components/ui/ChatBubble.tsx sogon/components/ui/ChatBubble.test.tsx
git commit -m "feat: add ui/ChatBubble primitive with user/friend authors and text/photo content"
```

---

## Task 12: Refactor `ConfirmModal` to use `ui/Modal` + `ui/Button`

Simplest modal to migrate first. Validates ui/Modal API against a real case.

**Files:**
- Modify: `sogon/components/ConfirmModal.tsx`

- [ ] **Step 1: Replace ConfirmModal implementation**

Replace the entire contents of `sogon/components/ConfirmModal.tsx` with:

```tsx
"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "취소",
}: ConfirmModalProps) {
  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()} title={title} size="sm">
      <div className="p-7 text-center">
        <div className="w-12 h-12 bg-danger-muted rounded-pill flex items-center justify-center mx-auto mb-4 text-[22px]">
          ⚠️
        </div>
        <h3 className="text-body font-medium text-foreground mb-2">
          {title}
        </h3>
        <p className="text-body-sm text-subtle-foreground mb-6">
          {description}
        </p>
        <div className="flex gap-2.5">
          <Button variant="ghost" onClick={onClose} className="flex-1 bg-elevated text-foreground hover:bg-border">
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-danger text-white hover:bg-danger/90">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: Run dev server and verify**

```bash
cd sogon && pnpm dev
```
Trigger a confirm modal (e.g., settings page → delete entry flow). Verify:
- Modal opens, backdrop visible.
- ESC closes.
- Clicking backdrop closes.
- Confirm button works.
- Both light and dark mode OK.

Stop dev server.

- [ ] **Step 3: Run full test suite**

```bash
cd sogon && pnpm vitest run
```
Expected: all existing tests still pass.

- [ ] **Step 4: Commit**

```bash
git add sogon/components/ConfirmModal.tsx
git commit -m "refactor: rebuild ConfirmModal on top of ui/Modal and ui/Button"
```

---

## Task 13: Refactor `SettingsModal` to use `ui/Modal`

**Files:**
- Modify: `sogon/components/SettingsModal.tsx`

- [ ] **Step 1: Read the current SettingsModal**

```bash
cat sogon/components/SettingsModal.tsx
```

Note the current structure: outer `<div>` backdrop + inner modal container. The inner content (tab navigation, settings items, theme toggle) is kept as-is; only the modal shell (backdrop + container + ESC handling) is replaced with `<Modal>`.

- [ ] **Step 2: Refactor SettingsModal**

In `sogon/components/SettingsModal.tsx`:
1. Remove the outer fixed-position backdrop div + ESC key effect.
2. Wrap the existing content in `<Modal open={open} onOpenChange={...} title="설정" size="md">`.
3. Import `Modal` from `@/components/ui/Modal`.
4. Keep all inner settings UI and event handlers unchanged.

Replace any `bg-black/50` backdrop or ESC-key `useEffect` patterns with `<Modal>` — the primitive handles both.

- [ ] **Step 3: Run dev server and verify**

```bash
cd sogon && pnpm dev
```
Open settings. Verify:
- Modal opens/closes with the existing gear-icon trigger.
- Tabs and inner controls still work.
- Theme toggle inside still works.
- Dark mode looks correct.

Stop dev.

- [ ] **Step 4: Run full test suite**

```bash
cd sogon && pnpm vitest run
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add sogon/components/SettingsModal.tsx
git commit -m "refactor: rebuild SettingsModal on top of ui/Modal"
```

---

## Task 14: Refactor record page Textarea + send button

Swap the inline textarea and send button in `app/(main)/record/page.tsx` for `ui/Textarea` + `ui/Button(variant="icon")`.

**Files:**
- Modify: `sogon/app/(main)/record/page.tsx`

- [ ] **Step 1: Read current record page**

```bash
cat "sogon/app/(main)/record/page.tsx"
```

Locate: the `<textarea>` element + the circular send button below/beside it. Note any state (`const [draft, setDraft] = useState("")`, submit handler).

- [ ] **Step 2: Replace textarea + send button**

In `sogon/app/(main)/record/page.tsx`:

1. Import:
```tsx
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
```

2. Replace the current `<textarea>` with:
```tsx
<Textarea
  value={draft}
  onChange={(e) => setDraft(e.target.value)}
  onSubmit={handleSubmit}
  placeholder="오늘은 어떤 하루였어?"
  showCounter
  maxLength={2000}
  aria-label="오늘의 기록"
/>
```
(Rename `draft`/`handleSubmit` to match the existing variables in the page.)

3. Replace the existing send button with:
```tsx
<Button
  variant="icon"
  size="md"
  disabled={!draft.trim()}
  loading={isSubmitting}
  onClick={handleSubmit}
  aria-label="기록 전송"
>
  ↑
</Button>
```
Use the existing icon (e.g., `<ArrowUp />` from lucide-react) instead of the arrow character if that's already used.

4. If a "submitting" status text is displayed nearby, update its copy to the new signature:
```
"비밀친구에게 전하고 있어…"
```

- [ ] **Step 3: Run dev server and verify**

```bash
cd sogon && pnpm dev
```
Open record page. Verify:
- Textarea looks like the signature (radius 16px, 18px text, placeholder).
- Counter increments.
- Cmd/Ctrl+Enter submits.
- Send button disabled when empty.
- Dark mode OK.

Stop dev.

- [ ] **Step 4: Run full test suite**

```bash
cd sogon && pnpm vitest run
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "sogon/app/(main)/record/page.tsx"
git commit -m "refactor: use ui/Textarea and ui/Button(icon) on record page"
```

---

## Task 15: Refactor `EntryCard` to use `ui/Card` + `ui/ChatBubble`

EntryCard is a composite: timestamp, user text/photo, friend reaction. After refactor it composes `ui/Card` as the outer surface and `ui/ChatBubble` for the inner user record and friend reaction.

**Files:**
- Modify: `sogon/components/EntryCard.tsx`

- [ ] **Step 1: Read current EntryCard**

```bash
cat sogon/components/EntryCard.tsx
```

Identify three sections: outer card, user content (text and optional photo), friend reaction.

- [ ] **Step 2: Refactor EntryCard**

In `sogon/components/EntryCard.tsx`:

1. Import:
```tsx
import { Card } from "@/components/ui/Card";
import { ChatBubble } from "@/components/ui/ChatBubble";
```

2. Replace the outer card `<div>` with `<Card>`. Remove redundant classes that `Card` already provides (bg/border/shadow/rounded/padding — Card default `padding="md"` = 20px matches current).

3. Replace the inner user-content block with `<ChatBubble author="user" content="text" timestamp={formattedTime}>{entry.text}</ChatBubble>` (keep photo handling — if the entry has a photo, render a second `<ChatBubble author="user" content="photo">` with an `<Image>` child).

4. Replace the friend reaction block with `<ChatBubble author="friend" content="text" avatar={friend.emoji}>{entry.reaction}</ChatBubble>`. Keep the existing text-muted small caption if the current component has any.

Preserve props, delete handler, and any other EntryCard-specific logic unchanged.

- [ ] **Step 3: Run dev server and verify**

```bash
cd sogon && pnpm dev
```
Open collection page. Verify:
- Cards render with timestamp, user text bubble (right-aligned), friend reaction (left-aligned, handwriting).
- Dark mode OK.
- Entries with photos render a photo bubble.

Stop dev.

- [ ] **Step 4: Run full test suite**

```bash
cd sogon && pnpm vitest run
```

- [ ] **Step 5: Commit**

```bash
git add sogon/components/EntryCard.tsx
git commit -m "refactor: rebuild EntryCard on top of ui/Card and ui/ChatBubble"
```

---

## Task 16: Refactor `Sidebar` nav items to use `ui/Button(variant="ghost")`

The sidebar's nav links share the same visual pattern as a ghost button (transparent, hover elevated, optional active state). Swap their ad-hoc classes for `<Button variant="ghost">`.

**Files:**
- Modify: `sogon/components/Sidebar.tsx`

- [ ] **Step 1: Read current Sidebar**

```bash
cat sogon/components/Sidebar.tsx
```

Identify: list of nav items (기록하기 / 모아보기 / 설정), each currently an `<a>` or `<Link>` or `<button>` with custom Tailwind classes for hover/active state.

- [ ] **Step 2: Extract nav item styling into `ui/Button(variant="ghost")`**

Import `Button` and `Link`:
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
```

Replace each nav item with:
```tsx
<Button
  variant="ghost"
  size="md"
  className={clsx(
    "justify-start w-full px-3",
    isActive && "bg-accent-muted text-accent border-l-[3px] border-accent rounded-l-none",
  )}
  leadingIcon={<Icon className="w-5 h-5" />}
  asChild
>
  <Link href={href}>{label}</Link>
</Button>
```

**Note:** Current `Button` does not implement `asChild`. Since this is the only use site that needs it, there are two options:
- (Simpler) Wrap `<Link>` around `<Button>`: `<Link href={href}><Button …>{label}</Button></Link>` (loses correct HTML semantics when Link renders an `<a>` — but fine for nav).
- (Alternative) Render a `<Link>` styled with the same classes by factoring class composition into a small helper. For this plan, **use the Link-wraps-Button approach** — it's the simplest and does not require extending Button.

Use:
```tsx
<Link href={href}>
  <Button
    variant="ghost"
    size="md"
    leadingIcon={<Icon className="w-5 h-5" />}
    className={clsx(
      "w-full justify-start px-3",
      isActive && "bg-accent-muted text-accent",
    )}
  >
    {label}
  </Button>
</Link>
```

Keep the existing active-state detection logic (from `usePathname`).

- [ ] **Step 3: Run dev server and verify**

```bash
cd sogon && pnpm dev
```
Verify sidebar nav items render with the same look, hover, and active state. Dark mode OK.

Stop dev.

- [ ] **Step 4: Run full test suite**

```bash
cd sogon && pnpm vitest run
```

- [ ] **Step 5: Commit**

```bash
git add sogon/components/Sidebar.tsx
git commit -m "refactor: use ui/Button(ghost) for sidebar nav items"
```

---

## Task 17: Refactor `BottomNav` to use `ui/Button(variant="ghost")`

Same pattern as sidebar but for mobile.

**Files:**
- Modify: `sogon/components/BottomNav.tsx`

- [ ] **Step 1: Read current BottomNav**

```bash
cat sogon/components/BottomNav.tsx
```

- [ ] **Step 2: Replace nav items**

Same pattern as Task 16: wrap each `<Link>` around a ghost-variant `<Button>` with a `leadingIcon` prop (or rely on children if the icon should be stacked above the label). If the nav items in BottomNav use a vertical icon-on-top / label-below layout, add a custom `className` with the `text-caption` role utility (not raw `text-xs`).

Example:
```tsx
<Link href={href}>
  <Button
    variant="ghost"
    size="md"
    className={clsx(
      "flex-col h-auto py-2 px-3 text-caption gap-1",
      isActive && "text-accent",
    )}
  >
    <Icon className="w-5 h-5" />
    {label}
  </Button>
</Link>
```

- [ ] **Step 3: Run dev server and verify (mobile view)**

```bash
cd sogon && pnpm dev
```
Open at a mobile width (<768px). Verify bottom nav renders, active state works, dark mode OK.

Stop dev.

- [ ] **Step 4: Run full test suite**

```bash
cd sogon && pnpm vitest run
```

- [ ] **Step 5: Commit**

```bash
git add sogon/components/BottomNav.tsx
git commit -m "refactor: use ui/Button(ghost) for bottom nav items"
```

---

## Task 18: Final verification — type-check, lint, full test run, dev walkthrough

**Files:** (verification only)

- [ ] **Step 1: Type-check**

```bash
cd sogon && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 2: Lint**

```bash
cd sogon && pnpm lint
```
Expected: no new warnings/errors.

- [ ] **Step 3: Full test suite**

```bash
cd sogon && pnpm vitest run
```
Expected: all PASS. Count should include 7 new test files × ~5–7 tests each (~35–45 new tests).

- [ ] **Step 4: Production build**

```bash
cd sogon && pnpm build
```
Expected: build succeeds.

- [ ] **Step 5: Manual page walkthrough**

```bash
cd sogon && pnpm dev
```

Walk through these pages in both light and dark mode:
1. `/` onboarding (if reachable without auth)
2. `/record` — Textarea, send button, submit flow with "비밀친구에게 전하고 있어…" copy.
3. `/collection` — Timeline with EntryCards (user + friend bubbles), calendar view.
4. Settings modal (gear icon) — opens, ESC closes, tabs work, theme toggle works.
5. Delete confirmation modal — opens, buttons work.
6. Sidebar nav (desktop ≥1024px) — links, active state.
7. Bottom nav (mobile <768px) — links, active state.

Stop dev.

- [ ] **Step 6: Final commit (if any stray changes)**

```bash
git status
# If anything unstaged from manual fixes during walkthrough:
git add -p
git commit -m "chore: final polish after design-system l0-l3 migration"
```

---

## Success Criteria (from spec §성공 기준)

1. ✅ `components/ui/` contains 7 primitives (Button, Input, Textarea, Card, Modal, Badge, ChatBubble) with passing unit tests.
2. ✅ `globals.css` has new L2 semantic tokens (shadcn naming + radius roles + motion bundles + typography role utilities); `.dark` overrides only at Semantic layer; no page-level `dark:` manual branches remain.
3. ✅ Fonts replaced: Pretendard via `next/font/local` for body/heading, Gaegu via `next/font/google` for handwriting. All Gowun/Nanum imports removed. `logo.svg` updated.
4. ✅ `Sidebar`, `BottomNav`, `EntryCard`, `SettingsModal`, `ConfirmModal`, record page all use primitives; visual/functional parity confirmed in both light and dark.
5. ✅ `DESIGN_GUIDE.md` has: L0 Principles section + L1 Foundation 8-category table + typography role scale + Voice & Tone "진행중 상태" row + `§9` renamed to L1 사용 규칙.
6. ✅ Every primitive passes spec §9 "소곤다움 체크리스트" (role tokens only, no primitive sizes/radii direct usage, `prefers-reduced-motion` fallbacks, `motion-reduce:` classes where animations run).
