import React, { useState, useEffect, useContext, createContext, useCallback, useRef } from 'react';
import { 
  HashRouter, 
  Routes, 
  Route, 
  NavLink, 
  Navigate, 
  useLocation 
} from 'react-router-dom';
import { 
  Activity, 
  Heart, 
  Stethoscope, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Menu, 
  X,
  LogOut,
  Brain,
  ShieldAlert,
  Dumbbell,
  Calendar,
  CloudSun,
  Camera,
  MessageSquare,
  PlayCircle,
  Trash2,
  Plus,
  Clock,
  MapPin,
  Pencil,
  Check,
  Zap,
  Award,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Scan,
  Bot,
  Send,
  Bell,
  Gamepad2,
  Smile,
  Image as ImageIcon,
  Navigation,
  Fingerprint,
  ArrowRight,
  History,
  Droplets,
  GlassWater,
  Coffee,
  Globe,
  Github
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { GeminiService } from './services/geminiService';
import { User, Gender, MoodEntry, Appointment, WorkoutPlan, HealthStats, ChatMessage } from './types';

// --- CONFIGURATION ---
// REPLACE THIS with your actual deployed website URL or GitHub Repo URL
const APP_WEBSITE_URL = "https://github.com/your-username/surakshamitra-healthguard";

// --- Types Update ---
// Extending HealthStats to include water intake
interface ExtendedHealthStats extends HealthStats {
  waterIntake: number; // in glasses (approx 250ml)
  waterGoal: number;
}

// --- Global Background Component ---
const NeuronBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: { x: number, y: number, vx: number, vy: number }[] = [];
        const particleCount = Math.min(60, Math.floor((width * height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Check Dark Mode via class on html body
            const isDark = document.documentElement.classList.contains('dark');
            const color = isDark ? 'rgba(99, 102, 241, ' : 'rgba(14, 165, 233, '; // Indigo or Sky

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = color + '0.5)';
                ctx.fill();

                // Draw Connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = color + (0.15 - dist / 1000) + ')';
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-50" />;
};

// --- Animated Emoji Background for Welcome Screen ---
const EmojiBackground: React.FC = () => {
  const emojis = ['💧', '✨', '🌸', '🥗', '🧠', '🩺', '💊', '🧘‍♀️', '🍎', '💤'];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 20 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 10 + Math.random() * 20;
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        return (
          <div 
            key={i}
            className="absolute text-2xl md:text-4xl opacity-20 animate-float-up"
            style={{
              left: `${left}%`,
              bottom: '-50px',
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              filter: 'blur(1px)'
            }}
          >
            {emoji}
          </div>
        );
      })}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        .animate-float-up {
          animation-name: float-up;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};


// --- Context ---

interface AppContextType {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  stats: ExtendedHealthStats;
  updateStats: (newStats: Partial<ExtendedHealthStats>) => void;
  addCoins: (amount: number) => void;
  logWater: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Components ---

// Hydration Reminder Component
const HydrationReminder: React.FC = () => {
  const { stats } = useAppContext();
  const [showReminder, setShowReminder] = useState(false);
  const lastDrinkTime = useRef(Date.now());

  // Check every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      // 30 minutes = 30 * 60 * 1000 = 1800000 ms
      if (now - lastDrinkTime.current > 1800000 && stats.waterIntake < stats.waterGoal) {
        setShowReminder(true);
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [stats.waterIntake, stats.waterGoal]);

  // Reset timer when water is logged
  useEffect(() => {
    lastDrinkTime.current = Date.now();
    setShowReminder(false);
  }, [stats.waterIntake]);

  if (!showReminder) return null;

  return (
    <div className="fixed top-24 right-6 z-[60] bg-blue-500 text-white p-4 rounded-2xl shadow-2xl animate-bounce flex items-center gap-4 max-w-sm">
      <div className="bg-white/20 p-2 rounded-full">
        <GlassWater size={24} className="animate-pulse" />
      </div>
      <div>
        <h4 className="font-bold">Hydration Alert!</h4>
        <p className="text-xs opacity-90">It's been 30 mins. Time for a sip! 💧</p>
      </div>
      <button onClick={() => setShowReminder(false)} className="bg-white/20 hover:bg-white/30 p-1 rounded text-xs">
        <X size={14} />
      </button>
    </div>
  );
};

// 0. Global AI Assistant Chat Widget
const GlobalAiChat: React.FC = () => {
  const { user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await GeminiService.chatWithAssistant(messages, userMsg.content);
    
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', content: responseText };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      <div className={`pointer-events-auto transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 h-0 w-0 overflow-hidden'}`}>
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2 font-bold">
              <Bot size={20} className="animate-pulse" /> HealthGuard Pro
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20 text-sm px-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={28} />
                </div>
                <p className="font-bold text-gray-600 dark:text-gray-300 mb-1">Hi {user?.name.split(' ')[0]}!</p>
                <p>I'm using Gemini 3 Pro to answer your health queries with advanced reasoning.</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-gray-200 dark:border-slate-600 rounded-bl-none'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                 <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl rounded-bl-none border border-gray-200 dark:border-slate-600 shadow-sm">
                   <div className="flex gap-1.5">
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                   </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 text-sm p-3 bg-gray-100 dark:bg-slate-900/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 shadow-md shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-14 h-14 bg-gradient-to-tr from-primary to-blue-600 rounded-full shadow-xl shadow-primary/30 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-800"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </button>
    </div>
  );
};

// --- New Feature: Personality Hub ---
const PersonalityHub: React.FC = () => {
    const { user } = useAppContext();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<{question: string, answer: string}[]>([]);
    const [result, setResult] = useState<{ archetype: string; emoji: string; traits: string[]; description: string; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const questions = [
        { q: "How do you prefer to spend your energy?", options: ["Exploring nature 🌲", "Solving puzzles 🧩", "Helping others 🤝", "Creating art 🎨"] },
        { q: "When facing a challenge, you:", options: ["Charge forward ⚔️", "Analyze the details 🔍", "Seek advice 🗣️", "Find a workaround 🌀"] },
        { q: "Your ideal recovery day involves:", options: ["Intense workout 🏋️", "Reading/Learning 📚", "Meditation/Nap 🧘", "Socializing 🎉"] },
        { q: "Which element resonates with you?", options: ["Fire (Passion) 🔥", "Water (Flow) 💧", "Earth (Stability) 🌍", "Air (Freedom) 🌬️"] },
        { q: "What is your main health goal?", options: ["Strength 💪", "Peace of Mind 🧠", "Longevity ⏳", "Balance ⚖️"] }
    ];

    const handleOptionSelect = async (option: string) => {
        const newAnswers = [...answers, { question: questions[step].q, answer: option }];
        setAnswers(newAnswers);
        
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setLoading(true);
            const analysis = await GeminiService.analyzePersonality(newAnswers);
            setResult(analysis);
            setLoading(false);
        }
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers([]);
        setResult(null);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="bg-white/80 dark:bg-darkSurface/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 p-8 min-h-[600px] flex flex-col justify-center items-center relative overflow-hidden transition-all">
                {/* 3D Decor Elements */}
                <div className="absolute top-10 right-10 text-6xl opacity-10 animate-bounce delay-1000">🧬</div>
                <div className="absolute bottom-10 left-10 text-6xl opacity-10 animate-pulse">🔮</div>

                {!result && !loading && (
                    <div className="w-full max-w-lg animate-fade-in text-center z-10">
                        <div className="mb-8">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Question {step + 1} of {questions.length}</span>
                            <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-10 leading-tight drop-shadow-sm">
                            {questions[step].q}
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {questions[step].options.map((opt, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleOptionSelect(opt)}
                                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-transparent hover:border-primary shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg text-left flex items-center justify-between group"
                                >
                                    <span>{opt}</span>
                                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="text-center z-10 animate-pulse">
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-4 border-gray-200 dark:border-slate-700 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">✨</div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Consulting the Stars...</h3>
                        <p className="text-gray-500">Analyzing your unique energy signature</p>
                    </div>
                )}

                {result && (
                    <div className="w-full max-w-2xl text-center z-10 animate-fade-in perspective-1000">
                        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-3xl shadow-2xl transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700">
                            <div className="bg-white dark:bg-darkSurface rounded-[22px] p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                                
                                <div className="text-8xl mb-4 animate-bounce">{result.emoji}</div>
                                <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-[0.2em] mb-2">Your Archetype</h2>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-6">{result.archetype}</h1>
                                
                                <div className="flex justify-center flex-wrap gap-2 mb-8">
                                    {result.traits.map((trait, i) => (
                                        <span key={i} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-sm border border-indigo-100 dark:border-indigo-800">
                                            #{trait}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                    {result.description}
                                </p>

                                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800/50 mb-8 transform hover:scale-105 transition-transform">
                                    <p className="font-bold text-orange-800 dark:text-orange-200 italic">
                                        " {result.message} "
                                    </p>
                                </div>

                                <button onClick={resetQuiz} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
                                    <RotateCcw size={18} /> Retake Analysis
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Welcome / Landing Page with 3D Anime Push ---
const WelcomeScreen: React.FC = () => {
  const { login } = useAppContext();

  const handleStart = () => {
    login({
      id: 'guest',
      name: 'Wellness Explorer',
      email: 'guest@healthguard.ai',
      gender: Gender.PreferNotToSay,
      coins: 0,
      isPro: true
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden perspective-2000 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <EmojiBackground />
      
      {/* 3D Container */}
      <div className="relative z-10 flex items-center justify-center w-full max-w-6xl p-4 perspective-1000">
        
        {/* Main 3D Hero Card */}
        <div className="group relative w-full max-w-xl animate-push-box transform-style-3d">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-[2.5rem] blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700 p-12 rounded-[2rem] shadow-2xl transform transition-transform hover:scale-[1.01] hover:rotate-y-2">
                
                <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-tr from-white to-blue-50 p-5 rounded-full shadow-lg animate-float border-4 border-white dark:border-slate-800">
                        <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-md" />
                    </div>
                </div>
                
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 mb-2 drop-shadow-sm leading-tight">
                        HealthGuard
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto rounded-full mb-6"></div>
                    
                    <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        Your intelligent companion for <br/>
                        <span className="inline-block px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg mx-1 transform hover:-translate-y-1 transition-transform">Mind 🧠</span>
                        <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg mx-1 transform hover:-translate-y-1 transition-transform delay-75">Body 💪</span>
                        <span className="inline-block px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg mx-1 transform hover:-translate-y-1 transition-transform delay-150">Soul ✨</span>
                    </p>
                </div>

                <div className="mt-10 flex justify-center">
                    <button 
                        onClick={handleStart}
                        className="group/btn relative px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:shadow-[0_20px_80px_rgba(8,_112,_184,_0.4)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-full md:w-auto"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Begin Your Journey <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" strokeWidth={3} />
                        </span>
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover/btn:scale-100 group-hover/btn:bg-slate-700/20 dark:group-hover/btn:bg-slate-200/50"></div>
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="absolute bottom-8 z-20 flex flex-col items-center gap-2">
         <div className="text-xs text-slate-500 font-bold tracking-widest uppercase opacity-80 bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            HealthGuard • Created by Supriya
         </div>
         <a 
           href={APP_WEBSITE_URL} 
           target="_blank" 
           rel="noopener noreferrer"
           className="flex items-center gap-2 text-xs font-bold text-primary hover:text-blue-600 bg-white/80 dark:bg-black/80 px-4 py-1.5 rounded-full shadow-sm hover:scale-105 transition-all"
         >
            <Github size={12} /> Repo / Website
         </a>
      </div>

      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        
        @keyframes push-box {
            0% { transform: translateX(100vw) rotateY(-30deg) scale(0.8); opacity: 0; }
            60% { transform: translateX(-20px) rotateY(5deg) scale(1.02); opacity: 1; }
            80% { transform: translateX(10px) rotateY(-2deg) scale(1); }
            100% { transform: translateX(0) rotateY(0) scale(1); }
        }
        
        .animate-push-box { animation: push-box 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, stats, addCoins, updateStats, logWater } = useAppContext();
  const [content, setContent] = useState<{ quote: string; joke: string } | null>(null);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(stats.stepGoal.toString());

  useEffect(() => { GeminiService.getDailyContent().then(setContent); }, []);
  const handleSaveGoal = () => { const val = parseInt(tempGoal); if (!isNaN(val) && val > 0) { updateStats({ stepGoal: val }); } setIsEditingGoal(false); };
  const progressPercentage = Math.min(100, Math.round((stats.steps / stats.stepGoal) * 100));
  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
  const data = [ { name: 'Mon', steps: 4000 }, { name: 'Tue', steps: 3000 }, { name: 'Wed', steps: 2000 }, { name: 'Thu', steps: 2780 }, { name: 'Fri', steps: 1890 }, { name: 'Sat', steps: 2390 }, { name: 'Sun', steps: 3490 }, ];

  // Water calculations
  const waterPercentage = Math.min(100, (stats.waterIntake / stats.waterGoal) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="bg-gradient-to-r from-primary via-blue-500 to-secondary text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Hello, {user?.name}!</h2>
          {content ? (
            <div className="mt-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
              <p className="italic text-lg font-light leading-relaxed">"{content.quote}"</p>
              <div className="mt-3 text-sm opacity-90 border-t border-white/20 pt-3 flex items-start gap-2">
                <span className="font-bold bg-white/20 px-2 rounded text-xs py-0.5">JOKE</span> <span>{content.joke}</span>
              </div>
            </div>
          ) : ( <div className="mt-4 h-32 animate-pulse bg-white/10 rounded-2xl"></div> )}
        </div>
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-20px] left-[20%] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Steps Card */}
        <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start z-10">
                <div>
                  <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Daily Steps</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.steps.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">/ {stats.stepGoal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-full text-primary"> <Activity size={24} /> </div>
            </div>
            <div className="flex items-center gap-6 mt-6 z-10">
               <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200 dark:text-slate-700" />
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={(2 * Math.PI * 32) - (progressPercentage / 100) * (2 * Math.PI * 32)} strokeLinecap="round" className="text-primary transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-primary"> {progressPercentage}% </div>
               </div>
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-400">GOAL</span>
                    {!isEditingGoal ? ( <button onClick={() => setIsEditingGoal(true)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400 hover:text-primary transition-colors"> <Pencil size={14} /> </button> ) : ( <button onClick={handleSaveGoal} className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded-full text-green-500 transition-colors"> <Check size={14} /> </button> )}
                 </div>
                 {isEditingGoal ? ( <input type="number" value={tempGoal} onChange={(e) => setTempGoal(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded p-1 text-sm font-bold focus:ring-1 focus:ring-primary" autoFocus /> ) : ( <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stats.stepGoal.toLocaleString()}</p> )}
               </div>
            </div>
        </div>

        {/* Hydration Card - NEW */}
        <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-center z-10 mb-4">
                <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Hydration</h3>
                <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-full text-blue-500"> <Droplets size={24} /> </div>
            </div>
            <div className="z-10 flex items-center justify-between">
              <div>
                <div className="flex items-end gap-2"> 
                    <p className="text-4xl font-black text-slate-800 dark:text-slate-100">{stats.waterIntake}</p> 
                    <span className="text-lg text-gray-400 font-medium mb-1">/ {stats.waterGoal}</span> 
                </div>
                <p className="text-xs text-blue-500 font-bold mt-1 flex items-center gap-1"> <GlassWater size={12}/> Glasses (250ml) </p>
              </div>
              <button onClick={logWater} className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white p-3 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all">
                <Plus size={24} />
              </button>
            </div>
            {/* Liquid Animation Background */}
            <div className="absolute bottom-0 left-0 right-0 bg-blue-100 dark:bg-blue-900/30 transition-all duration-700 ease-out" style={{ height: `${waterPercentage}%` }}>
                <div className="absolute top-0 left-0 right-0 h-2 bg-blue-200 dark:bg-blue-800/50 opacity-50 w-full animate-pulse"></div>
            </div>
        </div>

        {/* Sleep Card */}
        <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Sleep</h3>
                <div className="p-2 bg-indigo-50 dark:bg-slate-700 rounded-full text-secondary"> <Moon size={24} /> </div>
            </div>
            <div>
              <div className="flex items-end gap-2"> <p className="text-4xl font-black text-slate-800 dark:text-slate-100">{stats.sleepHours}</p> <span className="text-lg text-gray-400 font-medium mb-1">hrs</span> </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full mt-4 overflow-hidden"> <div className="bg-secondary h-full rounded-full" style={{width: `${(stats.sleepHours/9)*100}%`}}></div> </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"> <Zap size={14} className="text-yellow-500" /> Optimal Rest </p>
            </div>
        </div>

        {/* Coins Card */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-3xl shadow-lg shadow-orange-200 dark:shadow-none flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-center z-10">
                <h3 className="font-bold text-white/80 text-sm uppercase tracking-wider">Rewards</h3>
                <div className="bg-white/20 p-1 px-2 rounded-lg text-xs font-bold backdrop-blur-sm">PRO</div>
            </div>
            <div className="z-10">
               <p className="text-4xl font-black mt-2">{user?.coins}</p>
               <p className="text-sm text-white/80">Suraksha Coins</p>
               <button onClick={() => addCoins(10)} className="mt-4 w-full bg-white text-orange-600 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"> <Award size={16} /> Claim Bonus </button>
            </div>
            <div className="absolute -bottom-6 -right-6 text-white/20 transform group-hover:rotate-12 transition-transform"> <Sun size={100} /> </div>
        </div>
      </div>

      {user?.gender === Gender.Female && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl dark:bg-orange-900/20 dark:border-orange-800 flex items-start gap-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-full text-orange-600"> <ShieldAlert size={24} /> </div>
          <div> <h4 className="font-bold text-orange-800 dark:text-orange-200">Safety Watch Active</h4> <p className="text-sm text-orange-700 dark:text-orange-300 mt-1 leading-snug"> SurakshaMitra is monitoring your activity. If you're inactive for 12 hours, we'll alert {user.trustedContact || "your trusted contacts"}. </p> </div>
        </div>
      )}
      <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 h-96">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-6">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} cursor={{fill: 'rgba(14, 165, 233, 0.1)', radius: 4}} />
            <Bar dataKey="steps" fill="url(#colorSteps)" radius={[6, 6, 6, 6]} barSize={40} />
            <defs> <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1}/> <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/> </linearGradient> </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ZenGame: React.FC = () => {
    const [cards, setCards] = useState<{id: number, icon: string, flipped: boolean, solved: boolean}[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const icons = ['🌿', '🌸', '☀️', '🌊', '🦋', '🍎', '🧘', '💖'];
    const initializeGame = () => { const duplicated = [...icons, ...icons]; const shuffled = duplicated.sort(() => Math.random() - 0.5).map((icon, index) => ({ id: index, icon, flipped: false, solved: false })); setCards(shuffled); setFlippedCards([]); setMoves(0); };
    useEffect(() => { initializeGame(); }, []);
    const handleCardClick = (id: number) => { if (flippedCards.length === 2) return; const clickedCard = cards.find(c => c.id === id); if (clickedCard?.flipped || clickedCard?.solved) return; const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c); setCards(newCards); setFlippedCards(prev => [...prev, id]); if (flippedCards.length === 1) { setMoves(prev => prev + 1); const firstId = flippedCards[0]; const firstCard = cards.find(c => c.id === firstId); if (firstCard && firstCard.icon === clickedCard?.icon) { setTimeout(() => { setCards(curr => curr.map(c => c.id === firstId || c.id === id ? { ...c, solved: true } : c)); setFlippedCards([]); }, 500); } else { setTimeout(() => { setCards(curr => curr.map(c => c.id === firstId || c.id === id ? { ...c, flipped: false } : c)); setFlippedCards([]); }, 1000); } } };
    return (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl border border-green-100 dark:border-slate-700 shadow-lg text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2 flex items-center justify-center gap-2"> <Gamepad2 /> Zen Memory Match </h3>
            <p className="text-sm text-gray-500 mb-6">Focus your mind. Find the matching pairs.</p>
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-6"> {cards.map(card => ( <div key={card.id} onClick={() => handleCardClick(card.id)} className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform ${card.flipped || card.solved ? 'rotate-y-180 bg-white dark:bg-slate-700 shadow-md scale-105' : 'bg-green-200 dark:bg-green-900 hover:bg-green-300 hover:scale-95'} flex items-center justify-center text-3xl select-none`} > {(card.flipped || card.solved) ? card.icon : ''} </div> ))} </div>
            <div className="flex justify-between items-center px-8"> <span className="font-bold text-gray-600 dark:text-gray-400">Moves: {moves}</span> <button onClick={initializeGame} className="text-sm font-bold text-green-600 hover:underline flex items-center gap-1"> <RotateCcw size={14} /> Reset </button> </div>
        </div>
    );
};

// 3. Mental Wellness Component with Image Gen & Mood Tracking
const MentalWellness: React.FC = () => {
  const [mood, setMood] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [gameMode, setGameMode] = useState(false);
  const [insight, setInsight] = useState<{ sentiment: string; tone: string; themes: string[]; insight: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  
  // Image Gen State
  const [visualPrompt, setVisualPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  const handleMoodAnalysis = async () => {
    if (!mood.trim()) return;
    const dangerPatterns = /(suicide|kill myself|end it all|hurt myself|die|give up)/i;
    if (dangerPatterns.test(mood)) { setShowSafetyAlert(true); return; }
    
    setIsProcessing(true);
    const buffer = await GeminiService.getSoothingVoice(mood);
    setIsProcessing(false);
    
    if (buffer) { 
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext; 
        const audioCtx = new AudioContextClass(); 
        const source = audioCtx.createBufferSource(); 
        source.buffer = buffer; 
        source.connect(audioCtx.destination); 
        source.start(0); 
        setAudioSource(source); 
        setIsPlaying(true); 
        source.onended = () => setIsPlaying(false); 
    }
  };

  const handleAnalyzeText = async () => {
    if (!mood.trim()) return;
    const dangerPatterns = /(suicide|kill myself|end it all|hurt myself|die|give up)/i;
    if (dangerPatterns.test(mood)) { setShowSafetyAlert(true); return; }

    setIsAnalyzing(true);
    const result = await GeminiService.analyzeMoodInsight(mood);
    setInsight(result);
    
    // Create new mood entry
    if (result) {
        const newEntry: MoodEntry = {
            id: Date.now().toString(),
            timestamp: new Date(),
            note: mood,
            sentiment: (result.sentiment.toLowerCase() as any) || 'neutral'
        };
        setMoodLog(prev => [newEntry, ...prev]);
    }
    
    setIsAnalyzing(false);
  };
  
  const handleGenerateImage = async () => {
      if(!visualPrompt.trim()) return;
      setIsGeneratingImg(true);
      const img = await GeminiService.generateWellnessImage(visualPrompt, aspectRatio);
      setGeneratedImage(img);
      setIsGeneratingImg(false);
  };

  const stopAudio = () => { if (audioSource) { audioSource.stop(); setIsPlaying(false); } };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20">
       <div className="flex justify-between items-center">
         <h2 className="text-3xl font-black flex items-center gap-3 text-slate-800 dark:text-white">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-secondary"> <Brain size={32} /> </div> Mental Sanctuary
         </h2>
         <button onClick={() => setGameMode(!gameMode)} className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${gameMode ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'}`}> <Gamepad2 size={18} /> {gameMode ? 'Close Games' : 'Zen Games'} </button>
       </div>

       {showSafetyAlert && ( <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg animate-bounce"> <h3 className="text-red-700 font-bold text-xl mb-2">You are not alone.</h3> <p className="text-red-600 mb-4">We detected distress in your message. Please connect with a professional immediately.</p> <div className="flex gap-4"> <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">Call Helpline (988)</button> <button onClick={() => setShowSafetyAlert(false)} className="text-red-600 underline hover:text-red-800">I am safe</button> </div> </div> )}

       {gameMode ? ( <ZenGame /> ) : (
         <>
            {/* Visual Sanctuary - Image Gen */}
            <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"> <ImageIcon size={20} className="text-pink-500"/> Visual Sanctuary</h3>
                <p className="text-sm text-gray-500 mb-4">Visualize a peaceful place to calm your mind. Describe your safe haven.</p>
                <div className="flex gap-3 mb-4">
                    <input 
                        type="text" 
                        value={visualPrompt}
                        onChange={e => setVisualPrompt(e.target.value)}
                        placeholder="e.g., A quiet cabin in a snowy forest at sunset"
                        className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <select 
                        value={aspectRatio}
                        onChange={e => setAspectRatio(e.target.value)}
                        className="p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 outline-none"
                    >
                        <option value="1:1">1:1</option>
                        <option value="16:9">16:9</option>
                        <option value="4:3">4:3</option>
                        <option value="9:16">9:16</option>
                    </select>
                </div>
                <button 
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImg || !visualPrompt.trim()}
                    className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 disabled:opacity-50 transition-all flex justify-center gap-2"
                >
                    {isGeneratingImg ? 'Creating your sanctuary...' : 'Visualize'}
                </button>
                
                {generatedImage && (
                    <div className="mt-6 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 animate-fade-in">
                        <img src={generatedImage} alt="Generated Sanctuary" className="w-full h-auto object-cover" />
                    </div>
                )}
            </div>

            <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800">
                <label className="block text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">How are you feeling right now?</label>
                <textarea className="w-full p-4 rounded-2xl border-gray-200 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-secondary min-h-[150px] resize-none transition-all outline-none" placeholder="I'm feeling anxious about..." value={mood} onChange={(e) => setMood(e.target.value)} ></textarea>
                <div className="mt-6 flex flex-wrap gap-4">
                    <button onClick={handleMoodAnalysis} disabled={isProcessing || isPlaying} className="bg-secondary hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"> {isProcessing ? 'Connecting...' : ( <> <PlayCircle size={20} /> Get Soothing Advice </> )} </button>
                    <button onClick={handleAnalyzeText} disabled={isAnalyzing || !mood.trim()} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all"> {isAnalyzing ? 'Analyzing...' : ( <> <Sparkles size={20} /> Analyze & Log Mood </> )} </button>
                    {isPlaying && ( <button onClick={stopAudio} className="border-2 border-red-500 text-red-500 px-6 py-3 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"> Stop Audio </button> )}
                </div>
                {insight && (
                    <div className="mt-6 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700 animate-fade-in">
                        <div className="flex items-center gap-2 mb-4"> <Sparkles className="text-secondary" size={20} /> <h3 className="font-bold text-lg">AI Reflection</h3> </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700"> <p className="text-xs text-gray-500 uppercase font-bold">Sentiment</p> <p className="font-semibold text-primary">{insight.sentiment}</p> </div>
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700"> <p className="text-xs text-gray-500 uppercase font-bold">Emotional Tone</p> <p className="font-semibold text-secondary">{insight.tone}</p> </div>
                        </div>
                        <div className="mb-4"> <p className="text-xs text-gray-500 uppercase font-bold mb-2">Key Themes</p> <div className="flex flex-wrap gap-2"> {insight.themes?.map((t, i) => ( <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"> #{t} </span> ))} </div> </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-indigo-900 dark:text-indigo-200 text-sm leading-relaxed italic"> "{insight.insight}" </div>
                    </div>
                )}
                
                {/* Mood History Log */}
                {moodLog.length > 0 && (
                    <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-6">
                        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <History size={20} /> Mood History
                        </h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {moodLog.map((entry) => (
                                <div key={entry.id} className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 text-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${entry.sentiment === 'positive' ? 'bg-green-100 text-green-700' : entry.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>
                                            {entry.sentiment}
                                        </span>
                                        <span className="text-xs text-gray-400">{entry.timestamp.toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 italic">"{entry.note}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800 hover:shadow-md transition-all cursor-pointer group"> <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2 text-lg group-hover:text-emerald-600 transition-colors">Breathing Exercise</h3> <p className="text-emerald-700/80 dark:text-emerald-300/80 mb-4">Box breathing: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s.</p> <div className="w-full bg-emerald-200 dark:bg-emerald-800 h-1.5 rounded-full overflow-hidden"> <div className="bg-emerald-500 h-full w-1/3 animate-pulse"></div> </div> </div>
                    <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-3xl border border-purple-100 dark:border-purple-800 hover:shadow-md transition-all cursor-pointer group"> <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-2 text-lg group-hover:text-purple-600 transition-colors">Grounding 5-4-3-2-1</h3> <p className="text-purple-700/80 dark:text-purple-300/80">Name 5 things you see, 4 you feel, 3 you hear...</p> </div>
            </div>
         </>
       )}
    </div>
  );
};

// ... PhysicalWellness remains largely same, just checking render ...
const PhysicalWellness: React.FC = () => {
    const { user, addCoins } = useAppContext();
    const [target, setTarget] = useState('Abs');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const generateRoutine = async () => { setLoading(true); const plan = await GeminiService.generateWorkout(target, difficulty); setWorkout(plan); setLoading(false); };
    const completeWorkout = () => { addCoins(50); alert("Workout Complete! +50 Coins"); setWorkout(null); };
    return (
        <div className="space-y-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3"> <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-primary"> <Dumbbell size={24} /> </div> Workout Generator </h2>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div> <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Target Area</label> <div className="relative"> <select value={target} onChange={e => setTarget(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 appearance-none outline-none focus:ring-2 focus:ring-primary"> <option>Abs</option> <option>Legs</option> <option>Chest</option> <option>Shoulders</option> <option>Full Body</option> </select> <div className="absolute right-3 top-3 pointer-events-none text-gray-500"><Menu size={16}/></div> </div> </div>
                        <div> <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Difficulty</label> <div className="relative"> <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 appearance-none outline-none focus:ring-2 focus:ring-primary"> <option>Beginner</option> <option>Intermediate</option> <option>Advanced</option> </select> <div className="absolute right-3 top-3 pointer-events-none text-gray-500"><Menu size={16}/></div> </div> </div>
                    </div>
                    <button onClick={generateRoutine} disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-70 shadow-lg shadow-blue-200 dark:shadow-none transition-all"> {loading ? 'Designing Your Plan...' : 'Generate Routine'} </button>
                </div>
                <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3"> <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-accent"> <Brain size={24} /> </div> Deep Focus </h2>
                    <p className="text-gray-500 mb-8 leading-relaxed"> Enhance mental clarity by blocking distractions. We track your focus sessions to award improved mental wellness scores. </p>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700"> <span className={`font-bold ${focusMode ? 'text-accent' : 'text-gray-400'}`}> {focusMode ? 'Focus Active' : 'Focus Inactive'} </span> <button onClick={() => setFocusMode(!focusMode)} className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${focusMode ? 'bg-accent text-white hover:bg-rose-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`}> {focusMode ? 'Stop' : 'Start'} </button> </div>
                </div>
            </div>
            {workout && (
                <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl animate-fade-in border-t-8 border-primary relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6 relative z-10"> <h3 className="text-3xl font-black">{workout.name}</h3> <button onClick={completeWorkout} className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-green-600 shadow-lg shadow-green-200 dark:shadow-none transition-all flex items-center gap-2"> <Check size={18} /> Complete </button> </div>
                    <div className="space-y-6 relative z-10"> {workout.exercises.map((ex, idx) => ( <div key={idx} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700"> <div className="flex justify-between font-bold text-lg mb-1"> <span>{idx + 1}. {ex.name}</span> <span className="text-primary">{ex.sets} sets × {ex.reps}</span> </div> <p className="text-gray-500 dark:text-gray-400">{ex.description}</p> </div> ))} </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                </div>
            )}
        </div>
    );
};

// 5. Medical Assistant Component - Updated with Maps & New Scanner
const MedicalAssistant: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'symptom' | 'rx' | 'appointments' | 'nearby'>('symptom');
    const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    
    // Scanner State
    const [rxImage, setRxImage] = useState<string | null>(null);
    const [rxAnalysis, setRxAnalysis] = useState('');
    const [analyzingRx, setAnalyzingRx] = useState(false);
    const [scanMode, setScanMode] = useState<'prescription' | 'xray'>('prescription');
    const [zoom, setZoom] = useState(1);

    // Nearby State
    const [nearbyQuery, setNearbyQuery] = useState('');
    const [nearbyResults, setNearbyResults] = useState('');
    const [locLoading, setLocLoading] = useState(false);

    // Appointment State
    const [appointments, setAppointments] = useState<Appointment[]>([ { id: '1', doctorName: 'Dr. Sarah Smith', specialty: 'Cardiology', date: '2024-11-15T10:00', notes: 'Routine checkup', reminderMinutes: 1440 } ]);
    const [showApptForm, setShowApptForm] = useState(false);
    const [newAppt, setNewAppt] = useState({ doctorName: '', specialty: '', date: '', notes: '', reminderMinutes: 0 });

    const handleSymptomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsThinking(true);
        const response = await GeminiService.checkSymptoms(userMsg);
        setIsThinking(false);
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
    };

    const handleRxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                setRxImage(base64);
                setZoom(1); setAnalyzingRx(true);
                const pureBase64 = base64.split(',')[1];
                let analysis = "";
                if (scanMode === 'prescription') { analysis = await GeminiService.analyzePrescription(pureBase64); } else { analysis = await GeminiService.analyzeXray(pureBase64); }
                setRxAnalysis(analysis);
                setAnalyzingRx(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFindNearby = async () => {
        if(!nearbyQuery.trim()) return;
        setLocLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const results = await GeminiService.findNearbyPlaces(nearbyQuery, { lat: latitude, lng: longitude });
                setNearbyResults(results);
                setLocLoading(false);
            }, () => {
                setNearbyResults("Permission denied for location access.");
                setLocLoading(false);
            });
        } else {
            setNearbyResults("Geolocation not supported.");
            setLocLoading(false);
        }
    };

    const handleAddAppt = (e: React.FormEvent) => { e.preventDefault(); if (!newAppt.doctorName || !newAppt.date) return; const appt: Appointment = { id: Date.now().toString(), doctorName: newAppt.doctorName, specialty: newAppt.specialty, date: newAppt.date, notes: newAppt.notes, reminderMinutes: newAppt.reminderMinutes > 0 ? newAppt.reminderMinutes : undefined }; setAppointments([...appointments, appt]); setNewAppt({ doctorName: '', specialty: '', date: '', notes: '', reminderMinutes: 0 }); setShowApptForm(false); };
    const handleDeleteAppt = (id: string) => { setAppointments(appointments.filter(a => a.id !== id)); };

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
      <button onClick={() => setActiveTab(id)} className={`px-4 md:px-6 py-4 font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === id ? 'text-primary bg-blue-50 dark:bg-slate-800 border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}> <Icon size={18} /> {label} </button>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="bg-white/90 dark:bg-darkSurface/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[700px] flex flex-col">
              <div className="flex border-b dark:border-slate-700 overflow-x-auto scrollbar-hide">
                  <TabButton id="symptom" label="Symptom Checker" icon={MessageSquare} />
                  <TabButton id="rx" label="Medical Scanner" icon={Scan} />
                  <TabButton id="appointments" label="Appointments" icon={Calendar} />
                  <TabButton id="nearby" label="Find Nearby" icon={MapPin} />
              </div>

              <div className="flex-1 bg-gray-50/50 dark:bg-darkBackground p-6">
                {activeTab === 'symptom' && (
                    <div className="h-full flex flex-col">
                        <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30 flex items-center justify-center">
                            Powered by Gemini 3 Pro Reasoning Engine
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                            {messages.length === 0 && ( <div className="text-center text-gray-400 mt-20"> <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"> <Stethoscope className="h-10 w-10 opacity-50" /> </div> <h3 className="font-bold text-lg text-gray-500">How can I help you today?</h3> <p className="text-sm">Describe symptoms like "headache" or "fever"</p> </div> )}
                            {messages.map((m, i) => ( <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}> <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-slate-600'}`}> {m.text} </div> </div> ))}
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl rounded-bl-none border border-gray-100 dark:border-slate-600 flex items-center gap-2 text-gray-500 text-sm">
                                        <Brain size={16} className="animate-pulse text-purple-500"/> Thinking...
                                    </div>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleSymptomSubmit} className="mt-4 flex gap-3">
                            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your symptoms..." className="flex-1 p-4 rounded-2xl border-none shadow-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" />
                            <button type="submit" disabled={isThinking} className="bg-primary hover:bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all disabled:opacity-50"> <MessageSquare /> </button>
                        </form>
                    </div>
                )}
                
                {activeTab === 'nearby' && (
                    <div className="h-full flex flex-col">
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"> <MapPin className="text-red-500" /> Find Health Services</h3>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    value={nearbyQuery}
                                    onChange={e => setNearbyQuery(e.target.value)}
                                    placeholder="e.g., Cardiologist, 24h Pharmacy, Gym"
                                    className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button 
                                    onClick={handleFindNearby}
                                    disabled={locLoading}
                                    className="bg-primary text-white px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                    {locLoading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/> : <Navigation size={18} />}
                                    Search
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Uses your current location and Google Maps Grounding.</p>
                         </div>
                         
                         <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 overflow-y-auto">
                            {nearbyResults ? (
                                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                                    {nearbyResults}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 mt-20">
                                    <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Search for services to see results here.</p>
                                </div>
                            )}
                         </div>
                    </div>
                )}

                {activeTab === 'rx' && (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
                                <button onClick={() => setScanMode('prescription')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${scanMode === 'prescription' ? 'bg-white dark:bg-slate-600 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}> <FileText size={16} /> Prescription </button>
                                <button onClick={() => setScanMode('xray')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${scanMode === 'xray' ? 'bg-white dark:bg-slate-600 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}> <Zap size={16} /> X-Ray Scan </button>
                            </div>
                        </div>
                        {!rxImage ? (
                          <div className="flex-1 flex items-center justify-center">
                             <div className="text-center w-full max-w-lg border-4 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl p-12 hover:border-primary/50 transition-colors bg-white dark:bg-slate-800">
                                  <input type="file" accept="image/*" onChange={handleRxUpload} className="hidden" id="rx-upload" />
                                  <label htmlFor="rx-upload" className="cursor-pointer flex flex-col items-center group"> <div className="w-20 h-20 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"> <Camera className="h-10 w-10 text-primary" /> </div> <span className="text-xl font-bold text-gray-700 dark:text-gray-200"> Upload {scanMode === 'prescription' ? 'Prescription' : 'X-Ray Image'} </span> <span className="text-sm text-gray-400 mt-2"> {scanMode === 'prescription' ? 'AI will extract dosage & instructions' : 'AI will analyze bone structure & anomalies'} </span> </label>
                              </div>
                          </div>
                        ) : (
                          <div className="flex flex-col lg:flex-row gap-8 h-full">
                              <div className="flex-1 flex flex-col items-center justify-center bg-black/5 rounded-2xl p-4 relative overflow-hidden group">
                                  <img src={rxImage} className="max-h-96 object-contain rounded-lg shadow-lg transition-transform duration-300" style={{ transform: `scale(${zoom})` }} alt="Medical Scan"/>
                                  <div className="absolute bottom-4 flex gap-2">
                                      <button onClick={() => setZoom(z => z + 0.5)} className="p-2 bg-white/80 rounded-full shadow hover:bg-white"><ZoomIn size={20}/></button>
                                      <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} className="p-2 bg-white/80 rounded-full shadow hover:bg-white"><ZoomOut size={20}/></button>
                                      <button onClick={() => setRxImage(null)} className="p-2 bg-white/80 rounded-full shadow hover:bg-white text-red-500"><Trash2 size={20}/></button>
                                  </div>
                              </div>
                              <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 overflow-y-auto">
                                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"> <Bot size={20} className="text-primary"/> Analysis Results </h3>
                                  {analyzingRx ? (
                                      <div className="space-y-4">
                                          <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                                          <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                                          <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-full animate-pulse"></div>
                                      </div>
                                  ) : (
                                      <div className="prose dark:prose-invert text-sm"> {rxAnalysis} </div>
                                  )}
                              </div>
                          </div>
                        )}
                    </div>
                )}

                {activeTab === 'appointments' && (
                  <div className="h-full flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Upcoming Visits</h3>
                        <button onClick={() => setShowApptForm(!showApptForm)} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"> <Plus size={16} /> New Appointment </button>
                      </div>
                      
                      {showApptForm && (
                        <form onSubmit={handleAddAppt} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 animate-fade-in">
                           <div className="grid grid-cols-2 gap-4 mb-4">
                              <input placeholder="Doctor Name" className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none outline-none focus:ring-1 focus:ring-primary" value={newAppt.doctorName} onChange={e => setNewAppt({...newAppt, doctorName: e.target.value})} />
                              <input placeholder="Specialty (e.g. Cardio)" className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none outline-none focus:ring-1 focus:ring-primary" value={newAppt.specialty} onChange={e => setNewAppt({...newAppt, specialty: e.target.value})} />
                              <input type="datetime-local" className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none outline-none focus:ring-1 focus:ring-primary" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
                              <select className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none outline-none focus:ring-1 focus:ring-primary" value={newAppt.reminderMinutes} onChange={e => setNewAppt({...newAppt, reminderMinutes: parseInt(e.target.value)})}>
                                <option value="0">No Reminder</option>
                                <option value="60">1 Hour Before</option>
                                <option value="1440">1 Day Before</option>
                              </select>
                           </div>
                           <input placeholder="Notes" className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border-none outline-none focus:ring-1 focus:ring-primary mb-4" value={newAppt.notes} onChange={e => setNewAppt({...newAppt, notes: e.target.value})} />
                           <button type="submit" className="w-full bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-xl font-bold">Save Appointment</button>
                        </form>
                      )}

                      <div className="space-y-4 overflow-y-auto pr-2">
                        {appointments.map(appt => (
                          <div key={appt.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center group">
                             <div className="flex gap-4 items-center">
                                <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-xl text-primary font-bold text-center min-w-[60px]">
                                   <div className="text-xs uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</div>
                                   <div className="text-xl">{new Date(appt.date).getDate()}</div>
                                </div>
                                <div>
                                   <h4 className="font-bold text-lg">{appt.doctorName}</h4>
                                   <p className="text-gray-500 text-sm">{appt.specialty} • {new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                   {appt.notes && <p className="text-gray-400 text-xs mt-1 italic">"{appt.notes}"</p>}
                                </div>
                             </div>
                             <button onClick={() => handleDeleteAppt(appt.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"> <Trash2 size={18} /> </button>
                          </div>
                        ))}
                      </div>
                  </div>
                )}
              </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

const Sidebar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => setIsOpen(false), [location]);

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `flex items-center gap-3 p-3.5 rounded-xl font-bold transition-all duration-200 ${isActive ? 'bg-primary text-white shadow-lg shadow-blue-200 dark:shadow-none translate-x-1' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'}`}
    >
      <Icon size={20} /> <span className="text-sm">{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white/80 dark:bg-darkBackground/90 backdrop-blur-md z-50 px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-primary font-black text-lg"> <Heart className="fill-current" /> HealthGuard </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-300"> {isOpen ? <X /> : <Menu />} </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-darkSurface border-r border-gray-100 dark:border-slate-800 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
         <div className="p-8 pb-4">
             <div className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1"> <Heart className="text-primary fill-primary" size={28} /> HealthGuard </div>
             <p className="text-xs text-gray-400 font-medium pl-10 tracking-widest uppercase">By SurakshaMitra</p>
         </div>

         <div className="px-4 py-2 space-y-2">
             <div className="text-xs font-bold text-gray-400 uppercase px-4 py-2 mt-4">Wellness</div>
             <NavItem to="/dashboard" icon={Activity} label="Dashboard" />
             <NavItem to="/mental" icon={Brain} label="Mental Sanctuary" />
             <NavItem to="/physical" icon={Dumbbell} label="Body & Focus" />
             
             <div className="text-xs font-bold text-gray-400 uppercase px-4 py-2 mt-6">Medical AI</div>
             <NavItem to="/medical" icon={Stethoscope} label="Medical Assistant" />
             <NavItem to="/personality" icon={Fingerprint} label="Personality Hub" />
         </div>

         <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
             <div className="flex items-center gap-3 mb-4 px-2">
                 <div className="w-10 h-10 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-white font-bold"> {user?.name.charAt(0)} </div>
                 <div className="flex-1 overflow-hidden"> 
                    <p className="font-bold text-sm truncate dark:text-white">{user?.name}</p> 
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p> 
                 </div>
                 <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"> {darkMode ? <Sun size={16} /> : <Moon size={16} />} </button>
             </div>
             
             <a href={APP_WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full p-2.5 mb-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 transition-colors group">
                <Github size={14} className="group-hover:text-black dark:group-hover:text-white transition-colors"/> GitHub Repo
             </a>

             <button onClick={logout} className="flex items-center gap-2 w-full p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 text-xs font-bold transition-colors"> <LogOut size={16} /> Sign Out </button>
         </div>
      </aside>
    </>
  );
};

const AppContent: React.FC = () => {
    const { user } = useAppContext();
    return (
        <HashRouter>
            <div className="min-h-screen text-slate-800 dark:text-slate-100 font-sans selection:bg-primary/30">
                <NeuronBackground />
                {!user ? (
                   <Routes> <Route path="*" element={<WelcomeScreen />} /> </Routes>
                ) : (
                   <div className="md:pl-72 transition-all duration-300">
                      <Sidebar />
                      <main className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto">
                         <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/mental" element={<MentalWellness />} />
                            <Route path="/physical" element={<PhysicalWellness />} />
                            <Route path="/medical" element={<MedicalAssistant />} />
                            <Route path="/personality" element={<PersonalityHub />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                         </Routes>
                      </main>
                      <GlobalAiChat />
                      <HydrationReminder />
                   </div>
                )}
            </div>
        </HashRouter>
    );
};

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<ExtendedHealthStats>({ steps: 5430, stepGoal: 10000, sleepHours: 7.5, screenTimeHours: 4.2, waterIntake: 3, waterGoal: 8 });
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    const login = (u: User) => setUser(u);
    const logout = () => setUser(null);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    const updateStats = (newStats: Partial<ExtendedHealthStats>) => setStats(prev => ({ ...prev, ...newStats }));
    const addCoins = (amount: number) => { if (user) setUser({ ...user, coins: user.coins + amount }); };
    const logWater = () => {
        setStats(prev => ({ ...prev, waterIntake: prev.waterIntake + 1 }));
        if (user) setUser(prev => prev ? ({ ...prev, coins: prev.coins + 2 }) : null); 
    };

    return (
        <AppContext.Provider value={{ user, login, logout, darkMode, toggleDarkMode, stats, updateStats, addCoins, logWater }}>
            <AppContent />
        </AppContext.Provider>
    );
}
