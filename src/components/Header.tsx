import { forwardRef, useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Zap, Eye, EyeOff, Trash2, Sliders } from 'lucide-react';

const MODELS = [
  { value: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B' },
  { value: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B' },
  { value: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B' },
  { value: 'microsoft/phi-3-mini-128k-instruct:free', label: 'Phi-3 Mini' },
  { value: 'openchat/openchat-3.5-0106:free', label: 'OpenChat 3.5' },
  { value: 'huggingfaceh4/zephyr-7b-beta:free', label: 'Zephyr 7B' },
  { value: 'nousresearch/nous-capybara-7b:free', label: 'Capybara 7B' },
  { value: 'gryphe/mythomist-7b:free', label: 'MythoMist 7B' },
];

interface HeaderProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onClearClick: () => void;
  messagesExist: boolean;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ apiKey, setApiKey, selectedModel, setSelectedModel, onClearClick, messagesExist }, ref) => {
    const [showKey, setShowKey] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const logoIconRef = useRef<HTMLSpanElement>(null);

    // Logo icon pulse animation
    useEffect(() => {
      if (logoIconRef.current) {
        gsap.to(logoIconRef.current, {
          filter: 'drop-shadow(0 0 10px rgba(0, 245, 255, 0.9))',
          duration: 1.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, []);

    return (
      <header
        ref={ref}
        className="fixed top-0 left-0 right-0 transition-all duration-300"
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(123, 47, 190, 0.25)',
          boxShadow: '0 1px 12px rgba(0, 245, 255, 0.15)',
          zIndex: 50,
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              ref={logoIconRef}
              className="text-neonCyan"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0, 245, 255, 0.6))' }}
            >
              <Zap size={22} fill="#00F5FF" />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span
                  className="font-rajdhani font-bold text-white text-lg md:text-2xl tracking-[0.15em] leading-none"
                >
                  ZYPHER
                </span>
                <span className="font-rajdhani font-bold text-neonCyan text-lg md:text-2xl tracking-[0.15em] leading-none">
                  AI
                </span>
              </div>
              <span className="font-rajdhani font-medium text-[9px] md:text-[10px] tracking-[0.3em] text-white/60 leading-none mt-0.5">
                THE FUTURE LEAKS HERE
              </span>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* API Key Input */}
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key..."
                className="w-[220px] bg-deepPurple border border-royalPurple/40 rounded-lg py-1.5 pl-2.5 pr-8 text-white text-xs placeholder:text-white/60 focus:outline-none focus:border-neonCyan transition-all duration-200"
                style={{
                  boxShadow: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00F5FF';
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 245, 255, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(123, 47, 190, 0.4)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Model Selector */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-[240px] bg-deepPurple border border-royalPurple/40 rounded-lg py-1.5 pl-2.5 pr-8 text-white text-xs focus:outline-none focus:border-neonCyan transition-all duration-200 cursor-pointer"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#00F5FF';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 245, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(123, 47, 190, 0.4)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>

            {/* Clear Button */}
            {messagesExist && (
              <button
                onClick={onClearClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-hotPink rounded-lg text-hotPink text-xs font-semibold hover:bg-hotPink/15 transition-all duration-200"
                style={{
                  boxShadow: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 45, 155, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Right Section - Power Badge + Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-3">
            <span
              className="hidden sm:inline-block font-rajdhani font-semibold text-[9px] tracking-[0.2em] text-neonCyan/70 border border-neonCyan/30 rounded px-2 py-0.5"
            >
              ZYPHER VORTEX
            </span>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-royalPurple/40 text-white/70 hover:text-white hover:border-neonCyan/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Sliders size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3"
            style={{
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(123, 47, 190, 0.3)',
            }}
          >
            {/* API Key Input */}
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key..."
                className="w-full bg-deepPurple border border-royalPurple/40 rounded-lg py-2 pl-3 pr-10 text-white text-sm placeholder:text-white/60 focus:outline-none focus:border-neonCyan transition-all duration-200"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00F5FF';
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 245, 255, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(123, 47, 190, 0.4)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Model Selector */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-deepPurple border border-royalPurple/40 rounded-lg py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:border-neonCyan transition-all duration-200 cursor-pointer"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#00F5FF';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 245, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(123, 47, 190, 0.4)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>

            {/* Clear Button */}
            {messagesExist && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onClearClick();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 border border-hotPink rounded-lg text-hotPink text-sm font-semibold hover:bg-hotPink/15 transition-all duration-200"
              >
                <Trash2 size={16} />
                <span>Clear Chat</span>
              </button>
            )}
          </div>
        )}
      </header>
    );
  }
);

Header.displayName = 'Header';
export default Header;
