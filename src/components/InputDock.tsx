import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Send, Loader2 } from 'lucide-react';

interface InputDockProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function InputDock({ onSend, isLoading, disabled }: InputDockProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const charCountRef = useRef<HTMLSpanElement>(null);
  const MAX_CHARS = 2000;

  const charCount = text.length;
  const nearLimit = charCount >= MAX_CHARS - 50;
  const canSend = text.trim().length > 0 && !isLoading;

  // Pulse animation when near limit
  useEffect(() => {
    if (nearLimit && charCountRef.current) {
      gsap.to(charCountRef.current, {
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });
    }
  }, [charCount, nearLimit]);

  const handleSubmit = () => {
    if (!canSend) return;
    onSend(text);
    setText('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setText(value);
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0" style={{ zIndex: 50 }}>
      {/* Gradient fade */}
      <div
        className="pointer-events-none h-[60px]"
        style={{
          background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
        }}
      />

      {/* Input bar */}
      <div
        style={{
          background: 'rgba(26, 10, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(123, 47, 190, 0.3)',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="max-w-[800px] mx-auto px-4 md:px-6 py-3 flex items-end gap-3 relative">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask ZYPHER AI..."
              disabled={disabled}
              rows={1}
              className="w-full bg-black/80 rounded-xl py-3 px-4 text-white text-sm font-inter placeholder:text-white/60 focus:outline-none resize-none overflow-hidden transition-all duration-200 disabled:opacity-50"
              style={{
                border: isFocused
                  ? '1px solid #00F5FF'
                  : '1px solid rgba(123, 47, 190, 0.35)',
                boxShadow: isFocused
                  ? '0 0 12px rgba(0, 245, 255, 0.15), inset 0 0 8px rgba(0, 245, 255, 0.05)'
                  : 'none',
                minHeight: '44px',
                maxHeight: '150px',
              }}
            />

            {/* Character Counter */}
            <span
              ref={charCountRef}
              className="absolute -bottom-[18px] right-0 text-[10px] transition-colors duration-200"
              style={{ color: nearLimit ? '#FF2D9B' : 'rgba(255, 255, 255, 0.6)' }}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className="shrink-0 w-11 h-11 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canSend
                ? 'linear-gradient(135deg, #7B2FBE 0%, rgba(0, 245, 255, 0.4) 100%)'
                : 'linear-gradient(135deg, #7B2FBE 0%, rgba(0, 245, 255, 0.2) 100%)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              cursor: canSend ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => {
              if (canSend) {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #7B2FBE 0%, rgba(0, 245, 255, 0.6) 100%)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 245, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = canSend
                ? 'linear-gradient(135deg, #7B2FBE 0%, rgba(0, 245, 255, 0.4) 100%)'
                : 'linear-gradient(135deg, #7B2FBE 0%, rgba(0, 245, 255, 0.2) 100%)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
              if (canSend) e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              if (canSend) e.currentTarget.style.transform = 'scale(1.05)';
            }}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
