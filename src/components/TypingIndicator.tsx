export default function TypingIndicator() {
  return (
    <div className="mb-4" aria-live="polite" aria-label="AI is typing">
      <div
        className="max-w-[120px] rounded-[14px] rounded-bl-[4px] px-5 py-4"
        style={{
          background: '#1a0a2e',
          borderLeft: '3px solid #00F5FF',
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-neonCyan animate-dot-pulse-1"
          />
          <span
            className="w-2 h-2 rounded-full bg-neonCyan animate-dot-pulse-2"
          />
          <span
            className="w-2 h-2 rounded-full bg-neonCyan animate-dot-pulse-3"
          />
        </div>
      </div>
    </div>
  );
}
