# 다크 모드 UI 반영 디자인 스펙

## Context

설정 모달에 테마 토글(라이트/다크/시스템)이 이미 구현되어 있으나, 실제 UI에는 `--background`과 `--foreground`만 전환되고 나머지 색상(카드, 사이드바, 보더, 리액션 등)은 하드코딩되어 다크 모드에서 깨진다. 모든 UI 컴포넌트에 다크 모드를 실제로 반영해야 한다.

## 결정 사항

- **팔레트**: Warm Charcoal (차콜 베이스 #1c1e1d, 순수 검정 X)
- **구현 방식**: CSS 변수 (시맨틱 토큰). `bg-white` → `bg-background`, `bg-neutral-50` → `bg-surface` 등으로 교체
- **기본값**: 시스템 (브라우저 설정 따라가기) — 현재 구현 유지

## 시맨틱 컬러 토큰

globals.css의 `@theme inline` 블록에 새 시맨틱 토큰을 추가하고, `.dark` / `.system-theme` 에서 오버라이드한다.

| 토큰 | 용도 | 라이트 | 다크 |
|------|------|--------|------|
| `--color-background` | 페이지 배경 | #ffffff | #1c1e1d |
| `--color-foreground` | 본문 텍스트 | #1a1c1b | #e5e7e6 |
| `--color-surface` | 사이드바, 카드, 입력 필드 배경 | #FAFBFA | #242726 |
| `--color-elevated` | 리액션 버블, 호버 상태, 세그먼트 배경 | #F3F5F4 | #2d302f |
| `--color-border` | 테두리, 구분선 | #E5E7E6 | #3a3d3c |
| `--color-text-primary` | 주요 텍스트 | #1a1c1b | #e5e7e6 |
| `--color-text-secondary` | 보조 텍스트 | #7D8381 | #8a8f8d |
| `--color-text-tertiary` | 힌트, 타임스탬프 | #A8ADAA | #6b706e |
| `--color-text-placeholder` | 플레이스홀더 | #D0D3D1 | #4a4d4c |
| `--color-primary-muted` | 활성 네비 배경, 선택된 톤 배경 | #EAF6E5 | #2a3d25 |

### Primary 컬러 (다크 모드에서 변경 없음)

Primary 컬러 스케일(primary-50~800)은 다크 모드에서도 동일하게 유지. 단, primary-muted 토큰만 추가하여 활성 상태 배경에 사용.

### 기존 Neutral 스케일 유지

neutral-50~600은 그대로 유지하되, 컴포넌트에서는 시맨틱 토큰으로 대체:
- `bg-white` → `bg-background`
- `bg-neutral-50` → `bg-surface`
- `bg-neutral-100` → `bg-elevated`
- `border-neutral-200` → `border-border`
- `text-neutral-500` → `text-text-secondary`
- `text-neutral-400` → `text-text-tertiary`
- `placeholder:text-neutral-300` → `placeholder:text-text-placeholder`

## 수정할 파일

| 파일 | 변경 내용 |
|------|-----------|
| `app/globals.css` | 시맨틱 토큰 정의, `.dark`/`.system-theme` 오버라이드 확장 |
| `components/Sidebar.tsx` | `bg-neutral-50` → `bg-surface`, `border-neutral-200` → `border-border` 등 |
| `components/BottomNav.tsx` | `bg-white` → `bg-background`, 보더 교체 |
| `components/EntryCard.tsx` | `bg-white` → `bg-background`, 리액션 영역 `bg-elevated` |
| `components/SettingsModal.tsx` | `bg-white` → `bg-background`, 디바이더/토글 교체 |
| `components/ConfirmModal.tsx` | `bg-white` → `bg-background` |
| `app/ToneCard.tsx` | `bg-white` → `bg-background` |
| `app/page.tsx` | 온보딩 페이지 배경/텍스트 |
| `app/(main)/record/page.tsx` | textarea, 버튼 배경 |
| `app/(main)/record/[id]/reaction/ReactionView.tsx` | 카드, 리액션 버블 |
| `app/(main)/collection/page.tsx` | 탭 전환기 배경 |
| `app/(main)/collection/CalendarView.tsx` | 캘린더 컨테이너, 셀 |
| `app/(main)/collection/TimelineView.tsx` | 타임라인 카드 (EntryCard 사용하므로 간접 반영될 수 있음) |

## 교체 규칙

모든 컴포넌트에서 다음 패턴으로 일괄 교체:

```
bg-white                    → bg-background
bg-neutral-50               → bg-surface
bg-neutral-100              → bg-elevated
border-neutral-200          → border-border
hover:bg-neutral-100        → hover:bg-elevated
hover:bg-neutral-200        → hover:bg-border
text-neutral-500            → text-text-secondary
text-neutral-400            → text-text-tertiary
placeholder:text-neutral-300 → placeholder:text-text-placeholder
```

### 교체하지 않는 것

- `bg-primary-*`, `text-primary-*` — Primary 컬러는 라이트/다크 동일
- `bg-[#e57373]`, `bg-[#fce4e4]` 등 시맨틱 레드 — 삭제/초기화 경고는 모드 불문 동일
- `text-white` — 버튼 위 흰 텍스트는 양쪽 모드에서 동일

## 검증 방법

1. 설정 모달에서 테마를 다크로 변경 → 전체 UI가 Warm Charcoal 톤으로 전환
2. 사이드바, 카드, 리액션 버블, 입력 필드 등 모든 요소가 어두운 배경에 맞게 표시
3. 텍스트 대비(contrast ratio) 확인 — 본문 최소 4.5:1
4. 라이트로 다시 변경 → 원래 모습 그대로 복원
5. 시스템 설정 → OS 다크모드 전환 시 자동 반영
6. 새로고침 → 테마 유지, 플래시 없음
7. 모바일 뷰에서도 동일하게 동작
