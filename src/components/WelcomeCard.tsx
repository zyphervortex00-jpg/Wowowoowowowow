import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Zap } from 'lucide-react';

interface WelcomeCardProps {
  hasAnimated: boolean;
}

export default function WelcomeCard({ hasAnimated }: WelcomeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );

      if (iconRef.current) {
        gsap.fromTo(
          iconRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, delay: 0.4, ease: 'back.out(1.5)' }
        );
      }
    });

    return () => ctx.revert();
  }, [hasAnimated]);

  const steps = [
    'Enter your OpenRouter API key above',
    'Select or add your own AI model',
    'Start chatting!',
  ];

  return (
    <div
      ref={cardRef}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div
        className="max-w-[560px] w-full text-center rounded-2xl p-8 md:p-10"
        style={{
          background: 'rgba(26, 10, 46, 0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(123, 47, 190, 0.3)',
          borderLeft: '3px solid #00F5FF',
        }}
      >
        {/* Greeting Icon */}
        <div ref={iconRef} className="mb-5 flex justify-center">
          <Zap
            size={48}
            className="text-neonCyan"
            style={{ filter: 'drop-shadow(0 0 12px rgba(0, 245, 255, 0.5))' }}
            fill="#00F5FF"
          />
        </div>

        {/* Title */}
        <h1 className="font-rajdhani font-bold text-xl md:text-[22px] text-white mb-2">
          ⚡ Welcome to ZYPHER AI
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-white/60 mb-6">
          I am your personal AI assistant powered by ZYPHER VORTEX.
        </p>

        {/* Steps List */}
        <div className="flex flex-col gap-2.5 text-left max-w-[360px] mx-auto mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-royalPurple text-white text-[11px] font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-[13px] text-white/80">{step}</span>
            </div>
          ))}
        </div>

        {/* CTA Link */}
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[13px] text-neonCyan underline underline-offset-[3px] hover:brightness-130 transition-all"
        >
          Get free API key at openrouter.ai →
        </a>

        {/* Tagline */}
        <p className="font-rajdhani font-medium text-[13px] text-hotPink tracking-[0.1em] mt-4">
          The Future Leaks Here 🔥
        </p>
      </div>
    </div>
  );
}
