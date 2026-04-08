export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
      <h1 className="text-2xl font-heading text-foreground mb-2">개인정보처리방침</h1>
      <p className="text-sm text-neutral-400 mb-10">최종 수정일: 2025년 4월 8일</p>

      <div className="space-y-8 text-base font-body text-neutral-700 leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. 수집하는 개인정보</h2>
          <p>소곤은 서비스 제공을 위해 아래와 같은 정보를 수집합니다.</p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Google 로그인을 통한 이메일 주소 및 프로필 정보</li>
            <li>사용자가 직접 작성한 일기 기록 및 첨부 이미지</li>
            <li>비밀친구 AI 리액션 내용</li>
            <li>선택한 비밀친구 톤(따뜻한/쿨한/텐션 높은)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. 수집 목적</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>일기 기록 저장 및 열람 서비스 제공</li>
            <li>AI 비밀친구 리액션 생성</li>
            <li>기기 변경 시 데이터 유지</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. 제3자 서비스 이용</h2>
          <p>소곤은 서비스 운영을 위해 아래 외부 서비스를 활용합니다.</p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li><strong>Supabase</strong> — 데이터베이스 및 이미지 저장 (미국)</li>
            <li><strong>Google Gemini API</strong> — AI 리액션 생성 (기록 내용이 API로 전송됩니다)</li>
            <li><strong>Google OAuth</strong> — 로그인 인증</li>
            <li><strong>Vercel</strong> — 서비스 호스팅 (미국)</li>
          </ul>
          <p className="text-neutral-500 text-sm">
            위 서비스 외 제3자에게 개인정보를 제공하거나 판매하지 않습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. 보관 기간</h2>
          <p>
            수집된 정보는 서비스 이용 기간 동안 보관됩니다. 회원 탈퇴 또는 삭제 요청 시
            관련 데이터를 즉시 삭제합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. 보안</h2>
          <p>
            모든 데이터는 본인만 접근 가능하도록 보호됩니다. 다른 사용자는 타인의 기록에
            접근할 수 없습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. 사용자 권리</h2>
          <p>사용자는 언제든지 아래 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>본인 데이터 조회 및 삭제</li>
            <li>서비스 탈퇴 및 계정 삭제 요청</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. 문의</h2>
          <p>
            개인정보 관련 문의는 아래로 연락해 주세요.
            <br />
            <a
              href="mailto:jeldo@kakao.com"
              className="text-primary-600 hover:underline"
            >
              astrokwak@gmail.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
