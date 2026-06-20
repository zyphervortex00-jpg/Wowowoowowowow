import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorToastProps {
  error: string | null;
  onClose: () => void;
}

export default function ErrorToast({ error, onClose }: ErrorToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!toastRef.current) return;

    if (error) {
      gsap.fromTo(
        toastRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      isFirstRender.current = false;
    } else if (!isFirstRender.current) {
      gsap.to(toastRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [error]);

  if (!error) return null;

  return (
    <div
      ref={toastRef}
      role="alert"
      aria-live="assertive"
      className="fixed left-1/2 -translate-x-1/2 flex items-center gap-2.5 max-w-[480px] w-[90%] rounded-xl px-5 py-3"
      style={{
        top: '72px',
        zIndex: 100,
        background: 'rgba(255, 45, 155, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 45, 155, 0.4)',
      }}
    >
      <AlertTriangle size={16} className="text-hotPink shrink-0" />
      <span className="text-[13px] text-white flex-1">{error}</span>
      <button
        onClick={onClose}
        className="text-white/60 hover:text-white transition-colors shrink-0"
        aria-label="Dismiss error"
      >
        <X size={14} />
      </button>
    </div>
  );
}
