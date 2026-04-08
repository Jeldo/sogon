export default function TermsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
      <h1 className="text-2xl font-heading text-foreground mb-2">이용약관</h1>
      <p className="text-sm text-neutral-400 mb-10">최종 수정일: 2025년 4월 8일</p>

      <div className="space-y-8 text-base font-body text-neutral-700 leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. 서비스 소개</h2>
          <p>
            소곤은 AI 비밀친구가 리액션해주는 프라이빗 일기 서비스입니다.
            본 약관은 소곤 서비스 이용에 관한 조건을 규정합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. 이용 조건</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Google 계정으로 로그인하여 서비스를 이용할 수 있습니다.</li>
            <li>만 14세 이상의 사용자를 대상으로 합니다.</li>
            <li>개인적, 비상업적 목적으로만 사용 가능합니다.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. 금지 행위</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>타인의 계정 또는 데이터에 무단 접근하는 행위</li>
            <li>서비스를 상업적으로 이용하거나 복제·배포하는 행위</li>
            <li>불법적인 콘텐츠를 기록하거나 전송하는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. 서비스 변경 및 중단</h2>
          <p>
            서비스 내용은 사전 고지 없이 변경될 수 있으며, 불가피한 사유로
            서비스가 중단될 수 있습니다. 중요한 변경 사항은 서비스 내 공지를 통해
            안내합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. 면책 조항</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>AI 리액션은 참고용이며 전문적인 상담을 대체하지 않습니다.</li>
            <li>
              천재지변, 시스템 오류 등 불가항력으로 인한 데이터 손실에 대해
              책임을 지지 않습니다.
            </li>
            <li>사용자가 직접 작성한 기록의 내용에 대한 책임은 사용자에게 있습니다.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. 준거법</h2>
          <p>본 약관은 대한민국 법률에 따라 해석 및 적용됩니다.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. 문의</h2>
          <p>
            서비스 이용 관련 문의는 아래로 연락해 주세요.
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
