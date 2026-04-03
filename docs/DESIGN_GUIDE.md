# 소곤 (Sogon) 디자인 가이드

> 속삭이듯 기록하고, 비밀친구가 반응해주는 프라이빗 일기장

---

## 1. Brand Identity

### 브랜드 키워드

**속삭임 · 따뜻함 · 부드러움 · 안전함 · 친밀함**

소곤은 조용하고 따뜻하며 친밀한 동반자다. 시끄럽지 않고, 임상적이지 않고, 기업적이지 않다. 가까운 친구에게서 온 편지를 여는 느낌, 아늑한 방에서 속삭이는 느낌이어야 한다. 절대 생산성 도구나 의료/상담 앱처럼 느껴지면 안 된다.

### Voice & Tone

| 상황 | 톤 | 예시 |
|------|-----|------|
| UI 카피 | 캐주얼, 다정한 반말/존댓말 혼용 | "오늘 뭐 했어?", "오늘은 어땠어?" |
| 에러 메시지 | 부드럽고 안심시키는 톤 | "앗, 잠깐 문제가 생겼어. 다시 해볼까?" |
| 빈 상태 | 초대하는 톤 (죄책감 유발 X) | "아직 오늘 기록이 없어. 뭐든 좋으니까 한마디 남겨봐!" |
| 성공 피드백 | 가볍고 따뜻한 확인 | "기록 완료!" |

### 용어 규칙

| 개념 | 사용 O | 사용 X |
|------|--------|--------|
| AI 캐릭터 | **비밀친구** | AI 어시스턴트, 챗봇 |
| 사용자 글 | **기록** | 포스트, 노트, 글 |
| AI 답변 | **리액션** | 응답, 답변, 댓글 |
| 기록 열람 | **모아보기** | 히스토리, 아카이브 |
| 글 작성 | **기록하기** | 작성, 쓰기 |

---

## 2. Color System

### Primary — Peach-Coral 계열

페이지 전반의 따뜻함을 담당하는 메인 컬러 스케일.

| Token | Hex | 용도 |
|-------|-----|------|
| `primary-50` | `#FFF8F0` | 페이지 배경 |
| `primary-100` | `#FFF1E6` | 카드 배경, 서피스 |
| `primary-200` | `#FFE4CC` | 호버, 보조 서피스 |
| `primary-300` | `#FFD4B0` | 보더, 구분선 |
| `primary-400` | `#FFBC8A` | 보조 버튼, 태그 |
| `primary-500` | `#F4A574` | 주요 인터랙티브 요소 |
| `primary-600` | `#E8895A` | 메인 버튼, 링크 |
| `primary-700` | `#D47048` | 버튼 호버, 액티브 |
| `primary-800` | `#B85A38` | 강조 텍스트 |
| `primary-900` | `#8C3E24` | 헤딩 (라이트 모드) |

### Neutral — Warm Gray

순수한 회색이 아닌 따뜻한 회색 계열. 텍스트와 보더 등 중립적 요소에 사용.

| Token | Hex | 용도 |
|-------|-----|------|
| `neutral-50` | `#FAF8F5` | 최밝은 배경 |
| `neutral-100` | `#F0EDE8` | 서브 배경 |
| `neutral-200` | `#E4DFD8` | 보더, 구분선 |
| `neutral-300` | `#C9C2B8` | 플레이스홀더 |
| `neutral-400` | `#A69E93` | 보조 텍스트 |
| `neutral-500` | `#857C72` | 본문 (보조) |
| `neutral-600` | `#6B6359` | 본문 |
| `neutral-700` | `#524B42` | 헤딩 |
| `neutral-800` | `#3A352E` | 강한 텍스트 |
| `neutral-900` | `#231F1B` | 가장 어두운 텍스트 |

### Accent — 비밀친구 톤 & 기능별

비밀친구 성격별 컬러와 기능적 구분 컬러.

| Token | Hex | 용도 |
|-------|-----|------|
| `accent-lavender` | `#C4B1D4` | 따뜻한 친구 |
| `accent-sky` | `#A8C8E8` | 쿨한 친구 |
| `accent-yellow` | `#FFD98C` | 텐션 높은 친구 |
| `accent-sage` | `#B5C9B3` | 캘린더 기록 표시 |
| `accent-rose` | `#E8A0A0` | 사진 첨부 표시 |

### Semantic — 상태 컬러

시맨틱 컬러도 뮤트된 웜톤으로, 알람/경고가 공격적이지 않게.

| Token | Hex | 용도 |
|-------|-----|------|
| `success` | `#8BBF8B` | 성공 (웜 그린) |
| `warning` | `#E8C46A` | 경고 (웜 앰버) |
| `error` | `#D48B8B` | 에러 (뮤트 웜 레드) |
| `info` | `#8BB0D4` | 정보 (뮤트 웜 블루) |

### Chat Bubble — 대화 버블 컬러

유저 기록과 비밀친구 리액션의 시각적 구분.

| Token | Hex | 용도 |
|-------|-----|------|
| `bubble-user` | `#FFF1E6` | 유저 기록 버블 |
| `bubble-friend` | `#F5EDE4` | 비밀친구 리액션 버블 |
| `bubble-friend-border` | `#E8DDD0` | 리액션 버블 보더 |

### Dark Mode — Warm Dark

다크 모드에서도 따뜻함을 유지. 순수 검정이 아닌 웜 다크 톤.

| Token | Hex | 용도 |
|-------|-----|------|
| `dark-bg` | `#1C1917` | 페이지 배경 |
| `dark-surface` | `#292524` | 카드/서피스 |
| `dark-surface-raised` | `#332E2B` | 부양 서피스 |
| `dark-border` | `#44403C` | 보더 |
| `dark-text-primary` | `#F5F0EB` | 본문 |
| `dark-text-secondary` | `#B8AFA5` | 보조 텍스트 |
| `dark-primary` | `#F4A574` | 메인 액센트 |
| `dark-bubble-user` | `#3A3230` | 유저 버블 (다크) |
| `dark-bubble-friend` | `#2E2926` | 친구 버블 (다크) |

---

## 3. Typography

### 폰트 패밀리

| 역할 | 폰트 | 설명 | Fallback |
|------|------|------|----------|
| **본문/UI** | `Gowun Dodum` | 정갈하면서 따뜻한 한글 산세리프 | `'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif` |
| **헤딩/디스플레이** | `Gowun Batang` | 연필로 쓴 듯한 세리프. 일기장 느낌 | `'Noto Serif KR', serif` |
| **비밀친구 리액션** | `Nanum Pen Script` | 손글씨체. "누군가가 써준" 느낌 강화 | `'Gaegu', cursive` |

**Google Fonts import:**
```
Gowun+Dodum&family=Gowun+Batang:wght@400;700&family=Nanum+Pen+Script
```

### 타입 스케일

| Token | Size | Line Height | Weight | 용도 |
|-------|------|-------------|--------|------|
| `text-xs` | 12px (0.75rem) | 1.5 | 400 | 타임스탬프, 메타데이터 |
| `text-sm` | 14px (0.875rem) | 1.5 | 400 | 캡션, 도움말 |
| `text-base` | 16px (1rem) | 1.6 | 400 | 본문, UI 라벨 |
| `text-lg` | 18px (1.125rem) | 1.6 | 400 | 기록 텍스트, 카드 콘텐츠 |
| `text-xl` | 20px (1.25rem) | 1.5 | 400 | 섹션 헤딩 |
| `text-2xl` | 24px (1.5rem) | 1.4 | 700 | 페이지 타이틀 |
| `text-3xl` | 30px (1.875rem) | 1.3 | 700 | 온보딩 헤딩 |

### 특수 타이포그래피

- **비밀친구 리액션**: `Nanum Pen Script`, `text-xl` (20px) — 유저 텍스트(Gowun Dodum)와 시각적으로 명확히 구분
- **페이지 타이틀**: `Gowun Batang`, `text-2xl`, weight 700 — 일기장 표지 느낌
- **타임스탬프**: `text-xs`, `neutral-400` — 존재하지만 시선을 끌지 않는 정도

---

## 4. Spacing & Layout

### 데스크톱 우선 레이아웃

일기장처럼 좁고 친밀한 중앙 컬럼 + 고정 사이드바 구조.

| 영역 | Max Width | Padding |
|------|-----------|---------|
| 메인 콘텐츠 (기록) | 720px | 24px 좌우 |
| 모아보기 (타임라인) | 720px | 24px 좌우 |
| 캘린더 뷰 | 840px | 24px 좌우 |
| 온보딩 | 560px | 32px 좌우 |
| 설정 모달 | 480px | 32px 좌우 |

### 사이드바

- 너비: **240px** 고정
- 접힘 가능 (아이콘 전용 모드: 64px)
- 배경: `primary-100`

### 반응형 브레이크포인트

| 구간 | 너비 | 레이아웃 |
|------|------|----------|
| **Desktop** | >= 1024px | 사이드바 (240px) + 중앙 콘텐츠 |
| **Tablet** | 768 ~ 1023px | 사이드바 아이콘만 (64px) + 콘텐츠 |
| **Mobile** | < 768px | 하단 탭 내비 + 풀폭 콘텐츠 |

### Spacing Scale (4px 기반)

```
space-0:   0px
space-1:   4px
space-2:   8px
space-3:  12px
space-4:  16px
space-5:  20px
space-6:  24px
space-8:  32px
space-10: 40px
space-12: 48px
space-16: 64px
space-20: 80px
space-24: 96px
```

---

## 5. Border Radius & Shadows

### Border Radius

날카로운 모서리 없음. 모든 UI 요소에 최소 6px radius 적용.

| Token | 값 | 용도 |
|-------|-----|------|
| `rounded-sm` | 6px | 태그, 뱃지, 작은 요소 |
| `rounded-md` | 10px | 버튼, 인풋 필드 |
| `rounded-lg` | 16px | 카드, 모달 |
| `rounded-xl` | 20px | 큰 카드, 온보딩 패널 |
| `rounded-2xl` | 24px | 채팅 버블, 피처드 카드 |
| `rounded-full` | 9999px | 아바타, 원형 버튼, 필 |

### Shadows — 웜톤 그림자

**원칙**: 순수 검정/회색 그림자 사용 금지. 모든 그림자는 웜브라운(`rgba(139, 109, 80, ...)`) 베이스.

| Token | 값 | 용도 |
|-------|-----|------|
| `shadow-sm` | `0 1px 3px rgba(139, 109, 80, 0.06)` | 태그, 작은 카드 |
| `shadow-md` | `0 4px 12px rgba(139, 109, 80, 0.08)` | 카드, 기록 항목 |
| `shadow-lg` | `0 8px 24px rgba(139, 109, 80, 0.10)` | 모달, 플로팅 요소 |
| `shadow-xl` | `0 12px 40px rgba(139, 109, 80, 0.12)` | 온보딩 패널, 팝업 |
| `shadow-inner` | `inset 0 2px 4px rgba(139, 109, 80, 0.04)` | 인풋 필드 (포커스) |

---

## 6. Component Design Tokens

### 버튼

#### Primary Button
```
배경: primary-600 (#E8895A)
텍스트: white (#FFFFFF)
Radius: rounded-md (10px)
Padding: 12px 24px
폰트: Gowun Dodum, text-base, weight 400
Hover: primary-700 (#D47048)
Active: primary-800 (#B85A38)
Shadow: shadow-sm
Transition: 150ms ease-out
```

#### Secondary Button
```
배경: primary-100 (#FFF1E6)
텍스트: primary-700 (#D47048)
Border: 1px solid primary-300 (#FFD4B0)
Hover 배경: primary-200 (#FFE4CC)
```

#### Ghost Button
```
배경: transparent
텍스트: neutral-600 (#6B6359)
Hover 배경: neutral-100 (#F0EDE8)
```

### 인풋 필드

```
배경: #FFFFFF (라이트) / dark-surface (다크)
Border: 1.5px solid neutral-200 (#E4DFD8)
Radius: rounded-md (10px)
Padding: 12px 16px
Focus Border: primary-500 (#F4A574)
Focus Shadow: shadow-inner + 0 0 0 3px rgba(244, 165, 116, 0.15)
Placeholder: neutral-300 (#C9C2B8)
폰트: Gowun Dodum, text-base
```

### 기록 입력 Textarea — 핵심 컴포넌트

```
Min Height: 120px
Border: 없음 (배경 대비로 구분)
배경: primary-50 (#FFF8F0)
Radius: rounded-lg (16px)
Padding: 20px
폰트: Gowun Dodum, text-lg (18px)
Placeholder: "오늘은 어떤 하루였어?" — neutral-300
```

### 채팅 버블 — 비밀친구 리액션

#### 유저 기록 버블
```
배경: bubble-user (#FFF1E6)
Radius: rounded-2xl (24px), 우하단만 rounded-sm (6px)
Padding: 16px 20px
Max Width: 85%
정렬: 우측
폰트: Gowun Dodum, text-lg
```

#### 비밀친구 리액션 버블
```
배경: bubble-friend (#F5EDE4)
Border: 1px solid bubble-friend-border (#E8DDD0)
Radius: rounded-2xl (24px), 좌하단만 rounded-sm (6px)
Padding: 16px 20px
Max Width: 85%
정렬: 좌측
폰트: Nanum Pen Script, text-xl (20px)
아바타: 좌측에 16~20px 친구 아이콘
```

### 사이드바 네비게이션

```
배경: primary-100 (#FFF1E6)
너비: 240px

활성 항목:
  배경: primary-200 (#FFE4CC)
  텍스트: primary-700 (#D47048)
  좌측 보더: 3px solid primary-600 (#E8895A)

비활성 항목:
  텍스트: neutral-500 (#857C72)

Hover: primary-200 배경, 150ms 트랜지션

네비 항목:
  - 기록하기 (pen-line 아이콘)
  - 모아보기 (book-open 아이콘)
  - 설정 (settings 아이콘)
```

### 캘린더

```
날짜 셀: 40x40px, rounded-full
기록 있는 날: 하단 도트 accent-sage (#B5C9B3)
선택된 날: 배경 primary-600 (#E8895A), 흰 텍스트
오늘: ring border primary-400 (#FFBC8A)
헤더: Gowun Batang, text-xl
```

### 기록 카드 (타임라인)

```
배경: #FFFFFF (라이트) / dark-surface (다크)
Border: 1px solid neutral-200 (#E4DFD8)
Radius: rounded-xl (20px)
Padding: 20px
Shadow: shadow-md
Hover Shadow: shadow-lg (살짝 부양 효과)

구성 요소:
  - 타임스탬프 (text-xs, neutral-400)
  - 기록 텍스트 (text-lg, Gowun Dodum)
  - 사진 (있는 경우, rounded-lg)
  - 비밀친구 리액션 (Nanum Pen Script, text-xl)
```

---

## 7. Iconography

### 스타일

- **라인 스타일**: Outlined (filled X)
- **Stroke cap/join**: 둥근 (rounded)
- **Stroke width**: 1.5px
- **크기**: 20x20 (기본), 24x24 (네비게이션), 16x16 (인라인)
- **컬러**: 텍스트 컬러 상속 (`neutral-500` 또는 `neutral-600`)

### 아이콘 라이브러리

**Lucide Icons** (`lucide-react`) — 오픈소스, 둥근 스타일, stroke width 커스터마이징 가능.

### 주요 아이콘 매핑

| 용도 | Lucide 아이콘 |
|------|---------------|
| 기록하기 | `pen-line` 또는 `feather` |
| 모아보기 | `book-open` |
| 타임라인 | `list` |
| 캘린더 | `calendar` |
| 설정 | `settings` |
| 사진 첨부 | `image-plus` |
| 전송 | `send` 또는 `arrow-up` (원형 안) |
| 비밀친구 | 커스텀 일러스트 또는 `smile` |
| 뒤로 | `chevron-left` |
| 닫기 | `x` |

---

## 8. Motion & Animation

### 트랜지션 속도

| Token | 값 | 용도 |
|-------|-----|------|
| `duration-fast` | 100ms | 호버 컬러 변경, opacity |
| `duration-normal` | 200ms | 버튼 프레스, 토글 |
| `duration-slow` | 350ms | 페이지 전환, 카드 등장 |
| `duration-gentle` | 500ms | 비밀친구 리액션 등장, 온보딩 |

### Easing 커브

| Token | 값 | 느낌 |
|-------|-----|------|
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 빠른 시작, 부드러운 정지. 대부분의 UI 인터랙션 |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 부드러운 전환. 페이지 전환 |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 살짝 바운스. 리액션 등장 등 재미 요소 |

### 핵심 마이크로 인터랙션

#### 비밀친구 리액션 등장 (시그니처 모먼트)

소곤의 가장 중요한 순간. 기록 전송 후 비밀친구가 반응하는 경험.

1. **타이핑 인디케이터**: 기록 전송 직후, 친구 버블 영역에 세 점이 부드럽게 펄스
   - `opacity: 0.3 → 1 → 0.3`, 1.2초 루프
2. **리액션 버블 등장**: 1~2초 후 (자연스러운 딜레이)
   - `opacity: 0 → 1`
   - `translateY: 8px → 0`
   - Duration: 500ms (`duration-gentle`)
   - Easing: `ease-spring`
3. **미세 스케일**: `scale: 0.97 → 1.0` (숨 들이쉬는 느낌)

#### 타임라인 카드 등장
- 스크롤 진입 시 stagger 등장
- 각 카드: `translateY: 12px → 0`, `opacity: 0 → 1`
- Duration: 350ms (`duration-slow`)
- Stagger 간격: 50ms

#### 버튼 프레스
- `scale: 1 → 0.97` on active
- Duration: 100ms (`duration-fast`)
- Easing: `ease-out`

#### 온보딩 친구 선택 카드
- Hover: `scale: 1 → 1.02`, 200ms
- 선택됨: `box-shadow: 0 0 0 3px rgba(244, 165, 116, 0.3)` 글로우

#### 페이지 전환
- Crossfade: `opacity` 전환
- Duration: 350ms (`duration-slow`)
- Easing: `ease-in-out`

---

## 9. 디자인 원칙

소곤의 모든 디자인 결정은 이 7가지 원칙을 기반으로 한다.

### 1. 좁은 콘텐츠 컬럼 (720px)
친밀함 > 정보 밀도. 넓은 화면에 콘텐츠를 펼치지 않는다. 일기장처럼 좁고 집중된 공간.

### 2. 넉넉한 여백
기록 사이사이에 충분한 공간. 빽빽하거나 답답한 느낌 없이, 기록이 숨 쉬는 공간을 만든다.

### 3. 웜톤 그림자만
순수 회색/검정 그림자 사용 금지. 모든 그림자는 웜브라운 베이스로 부드럽고 따뜻하게.

### 4. 손글씨체로 친구 구분
비밀친구의 리액션은 `Nanum Pen Script`로 표시해 시각적으로 "다른 사람이 써준" 느낌을 준다. 유저 텍스트와 확실히 구분.

### 5. 날카로운 모서리 없음
모든 UI 요소에 최소 6px radius. 둥글고 부드러운 형태로 안전하고 포근한 느낌 전달.

### 6. 느리고 부드러운 애니메이션
갑작스러운 전환 없음. 모든 것이 부드럽게 나타나고 사라진다. 특히 비밀친구 리액션은 천천히 숨 쉬듯 등장.

### 7. 뮤트된 시맨틱 컬러
에러나 경고 상태도 공격적이지 않다. 부드럽고 따뜻한 톤의 시맨틱 컬러로 안심하는 느낌.
