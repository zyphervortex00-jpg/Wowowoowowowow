import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import Header from './components/Header';
import ChatStage from './components/ChatStage';
import InputDock from './components/InputDock';
import ScrollToBottom from './components/ScrollToBottom';
import ErrorToast from './components/ErrorToast';
import ClearChatModal from './components/ClearChatModal';
import Footer from './components/Footer';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('meta-llama/llama-3.3-70b-instruct:free');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const chatStageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Grid pulse animation
  useEffect(() => {
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        opacity: 0.08,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }, []);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const scrollY = chatStageRef.current?.scrollTop || 0;
      if (scrollY > 10) {
        headerRef.current.style.background = 'rgba(10, 10, 10, 0.95)';
        headerRef.current.style.borderBottomColor = 'rgba(123, 47, 190, 0.5)';
      } else {
        headerRef.current.style.background = 'rgba(10, 10, 10, 0.85)';
        headerRef.current.style.borderBottomColor = 'rgba(123, 47, 190, 0.25)';
      }
    };

    const chatStage = chatStageRef.current;
    if (chatStage) {
      chatStage.addEventListener('scroll', handleScroll);
      return () => chatStage.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    if (chatStageRef.current) {
      chatStageRef.current.scrollTo({
        top: chatStageRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Auto-dismiss error toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const generateId = () => Math.random().toString(36).substring(2, 10);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key first.');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'ZYPHER AI',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: text.trim() }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(errorData.error?.message || 'Something went wrong. Please try again.');
        }
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || 'No response received.';

      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please check your connection.';
      setError(errorMessage);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowClearModal(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-void">
      {/* Ambient glow layer */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(123, 47, 190, 0.08) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Grid layer */}
      <div
        ref={gridRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/bg-grid.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          mixBlendMode: 'screen',
          opacity: 0.06,
          zIndex: 1,
        }}
      />

      {/* Content layer */}
      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 2 }}>
        <Header
          ref={headerRef}
          apiKey={apiKey}
          setApiKey={setApiKey}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onClearClick={() => setShowClearModal(true)}
          messagesExist={messages.length > 0}
        />

        <ChatStage
          ref={chatStageRef}
          messages={messages}
          isTyping={isTyping}
          messagesExist={messages.length > 0}
        />

        <ScrollToBottom chatStageRef={chatStageRef} onScrollToBottom={scrollToBottom} />

        <InputDock
          onSend={sendMessage}
          isLoading={isLoading}
          disabled={isLoading}
        />

        {messages.length === 0 && <Footer />}

        <ErrorToast error={error} onClose={() => setError(null)} />

        {showClearModal && (
          <ClearChatModal
            onCancel={() => setShowClearModal(false)}
            onConfirm={clearChat}
          />
        )}
      </div>
    </div>
  );
}

export default App;
