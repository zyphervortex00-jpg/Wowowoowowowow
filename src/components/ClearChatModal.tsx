import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ClearChatModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ClearChatModal({ onCancel, onConfirm }: ClearChatModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    }
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    }
  }, []);

  const handleDismiss = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    }
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: onCancel,
      });
    } else {
      onCancel();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 200,
      }}
      onClick={handleDismiss}
    >
      <div
        ref={modalRef}
        className="rounded-2xl p-7 w-[90%] max-w-[360px] text-center"
        style={{
          background: '#1a0a2e',
          border: '1px solid rgba(255, 45, 155, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-rajdhani font-semibold text-lg text-white">
          Clear Chat?
        </h2>
        <p className="text-[13px] text-white/60 mt-2">
          This will delete all messages. This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-[13px] font-semibold hover:border-white/40 transition-colors cursor-pointer bg-transparent"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (overlayRef.current) {
                gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
              }
              if (modalRef.current) {
                gsap.to(modalRef.current, {
                  opacity: 0,
                  scale: 0.9,
                  duration: 0.2,
                  onComplete: onConfirm,
                });
              } else {
                onConfirm();
              }
            }}
            className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-semibold hover:brightness-120 transition-all cursor-pointer"
            style={{ background: '#FF2D9B' }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
