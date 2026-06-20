import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomProps {
  chatStageRef: React.RefObject<HTMLDivElement | null>;
  onScrollToBottom: () => void;
}

export default function ScrollToBottom({ chatStageRef, onScrollToBottom }: ScrollToBottomProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const chatStage = chatStageRef.current;
    if (!chatStage) return;

    const handleScroll = () => {
      const scrollBottom = chatStage.scrollHeight - chatStage.scrollTop - chatStage.clientHeight;
      setIsVisible(scrollBottom > 50);
    };

    chatStage.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => chatStage.removeEventListener('scroll', handleScroll);
  }, [chatStageRef]);

  // Animate visibility
  useEffect(() => {
    const el = document.getElementById('scroll-to-bottom-btn');
    if (!el) return;

    if (isVisible) {
      gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2 });
    } else {
      gsap.to(el, { opacity: 0, y: 10, duration: 0.2 });
    }
  }, [isVisible]);

  return (
    <button
      id="scroll-to-bottom-btn"
      onClick={onScrollToBottom}
      className="fixed w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-110"
      style={{
        bottom: '80px',
        right: '24px',
        zIndex: 40,
        background: '#1a0a2e',
        border: '1px solid rgba(0, 245, 255, 0.4)',
        opacity: 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 245, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <ChevronDown size={18} className="text-neonCyan" />
    </button>
  );
}
