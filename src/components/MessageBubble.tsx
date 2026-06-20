import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Zap, User, Copy, Check } from 'lucide-react';
import type { Message } from '../App';

interface MessageBubbleProps {
  message: Message;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const isAI = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);

      // Animate the check icon
      if (copyBtnRef.current) {
        const icon = copyBtnRef.current.querySelector('svg');
        if (icon) {
          gsap.fromTo(icon, { scale: 0.5 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
        }
      }

      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: create temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = message.content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (isAI) {
    return (
      <div className="mb-4 group">
        <div
          className="relative max-w-[92%] md:max-w-[75%] rounded-[14px] rounded-bl-[4px] p-3.5 md:p-4"
          style={{
            background: '#1a0a2e',
            borderLeft: '3px solid #00F5FF',
            boxShadow: '0 2px 16px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Copy Button */}
          <button
            ref={copyBtnRef}
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 p-1 rounded-md border border-neonCyan/30 bg-neonCyan/10 text-neonCyan cursor-pointer hover:bg-neonCyan/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Copy message"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>

          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={12} className="text-neonCyan" fill="#00F5FF" />
            <span className="font-rajdhani font-semibold text-[11px] text-neonCyan tracking-[0.1em]">
              ZYPHER AI
            </span>
          </div>

          {/* Message Body */}
          <div
            className="text-sm text-white/[0.92] leading-relaxed whitespace-pre-wrap"
            data-role="assistant"
          >
            {message.content}
          </div>

          {/* Timestamp */}
          <div className="mt-2 text-[10px] text-white/35">
            {getRelativeTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className="mb-4 flex justify-end" data-role="user">
      <div
        className="max-w-[92%] md:max-w-[70%] rounded-[14px] rounded-br-[4px] p-3.5 md:p-4"
        style={{
          background: '#7B2FBE',
          boxShadow: '0 2px 16px rgba(123, 47, 190, 0.3)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-end gap-1.5 mb-2">
          <span className="font-rajdhani font-semibold text-[11px] text-white/70 tracking-[0.1em]">
            You
          </span>
          <User size={12} className="text-white/50" />
        </div>

        {/* Message Body */}
        <div className="text-sm text-white/[0.92] leading-relaxed whitespace-pre-wrap text-right">
          {message.content}
        </div>

        {/* Timestamp */}
        <div className="mt-2 text-[10px] text-white/35 text-right">
          {getRelativeTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
