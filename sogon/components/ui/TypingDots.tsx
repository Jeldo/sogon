export function TypingDots() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-4 py-3.5 bg-[var(--surface-3)] rounded-[22px_22px_22px_6px]"
      aria-label="비밀친구가 답을 쓰는 중"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
          style={{
            animation: `typing-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
