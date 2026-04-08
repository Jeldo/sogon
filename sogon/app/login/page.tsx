"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center min-h-dvh px-6 py-12">
      <div className="w-full max-w-[480px] space-y-10 text-center">
        {/* Brand */}
        <div className="space-y-2">
          <h1 className="text-3xl font-heading text-foreground">소곤</h1>
          <p className="text-neutral-500 text-base font-body">
            비밀친구가 반응해주는 나만의 일기장
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white border border-neutral-200 rounded-[20px] p-8 shadow-sm space-y-6">
          <p className="text-sm text-neutral-500 font-body">
            로그인하면 어디서든 기록을 이어볼 수 있어
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-[10px] border border-neutral-200 bg-white text-neutral-700 text-base font-body hover:bg-neutral-50 active:scale-[0.97] shadow-sm transition-all duration-150"
          >
            <GoogleIcon />
            Google로 시작하기
          </button>
        </div>

        {/* Legal links */}
        <p className="text-xs text-neutral-400 font-body">
          <a href="/privacy" className="hover:text-neutral-600 transition-colors">
            개인정보처리방침
          </a>
          {" · "}
          <a href="/terms" className="hover:text-neutral-600 transition-colors">
            이용약관
          </a>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.4c-.23 1.23-.94 2.27-2 2.97v2.46h3.23c1.9-1.75 3-4.32 3-7.22z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.97-.9 6.62-2.42l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H1.07v2.58A9.99 9.99 0 0010 20z"
        fill="#34A853"
      />
      <path
        d="M4.41 11.92A5.99 5.99 0 014.2 10c0-.66.12-1.3.21-1.92V5.5H1.07A10 10 0 000 10c0 1.6.38 3.12 1.07 4.5l3.34-2.58z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.96c1.47 0 2.79.5 3.82 1.5L16.69 2.6C14.96.99 12.7 0 10 0 6.09 0 2.72 2.24 1.07 5.5l3.34 2.58C5.2 5.72 7.4 3.96 10 3.96z"
        fill="#EA4335"
      />
    </svg>
  );
}
