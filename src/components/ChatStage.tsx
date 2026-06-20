import { forwardRef, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Message } from '../App';
import WelcomeCard from './WelcomeCard';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatStageProps {
  messages: Message[];
  isTyping: boolean;
  messagesExist: boolean;
}

const ChatStage = forwardRef<HTMLDivElement, ChatStageProps>(
  ({ messages, isTyping, messagesExist }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasAnimatedWelcome = useRef(false);

    // Animate new messages
    useEffect(() => {
      if (messages.length > 0) {
        const lastMessageEl = messagesEndRef.current?.previousElementSibling;
        if (lastMessageEl) {
          const isUser = lastMessageEl.querySelector('[data-role="user"]');
          gsap.fromTo(
            lastMessageEl,
            { opacity: 0, x: isUser ? 30 : -30 },
            { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
          );
        }
      }
    }, [messages]);

    return (
      <div
        ref={ref}
        className="flex-1 overflow-y-auto"
        style={{
          padding: '88px 16px 80px 16px',
        }}
      >
        <div className="max-w-[800px] mx-auto md:px-6">
          {!messagesExist && (
            <WelcomeCard hasAnimated={hasAnimatedWelcome.current} />
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }
);

ChatStage.displayName = 'ChatStage';
export default ChatStage;
