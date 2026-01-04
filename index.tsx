import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Heart, 
  Music, 
  Upload, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Play, 
  Pause,
  Volume2,
  Maximize2,
  Image as ImageIcon,
  PartyPopper,
  Sparkles,
  ArrowRight,
  Keyboard,
  RotateCw,
  Zap,
  MousePointer2
} from 'lucide-react';

// --- Types ---
type View = 'login' | 'welcome' | 'home';

interface Photo {
  id: string;
  url: string;
  isInitial: boolean;
  timestamp: number;
  likes: number;
}

// --- Constants ---
const USERNAME = 'lyy';
const PASSWORD = '20050113';
const INITIAL_PHOTOS_URLS = [
  '/images/initial/J1.png',
  '/images/initial/J2.png',
  '/images/initial/J3.png',
  '/images/initial/J4.png',
  '/images/initial/J5.png',
  '/images/initial/J6.png',
  '/images/initial/J7.png',
  '/images/initial/J8.png',
];

const BLESSING_LINES = [
  "TO 楼哥: 生日快乐！",
  "HAPPY EVERYDAY!",
  "May dawn bring new magic",
  "Stars dance for you tonight",
  "旦逢良辰",
  "顺颂时宜",
  "常欢愉",
  "皆胜意",
  "MADE BY DL ❤"
];

// --- Utilities ---
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max = 1920;
        if (width > height && width > max) {
          height *= max / width;
          width = max;
        } else if (height > max) {
          width *= max / height;
          height = max;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// --- Components ---

const Fireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createParticle = (x: number, y: number) => {
      const colors = ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#fff'];
      for (let i = 0; i < 20; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0.01);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.alpha *= 0.96;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    const handleClick = (e: MouseEvent) => createParticle(e.clientX, e.clientY);
    window.addEventListener('click', handleClick);
    animate();
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return <canvas id="fireworks" ref={canvasRef} className="z-10" />;
};

const HeartParticles = ({ sizeFraction = 0.66 }: { sizeFraction?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      const w = Math.max(100, window.innerWidth * sizeFraction);
      const h = Math.max(100, window.innerHeight * sizeFraction);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // heart parametric function
    const heartPoint = (t: number) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      return { x, y };
    };

    // 红白粉三种颜色
    const colors = ['#FF0000', '#FFFFFF', '#FF69B4'];

    // generate particle positions along heart with more density
    const particles: { 
      x: number; 
      y: number; 
      color: string; 
      r: number;
      phase: number;
      speed: number;
    }[] = [];
    const steps = 1000;
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const p = heartPoint(t);
      const cx = p.x;
      const cy = -p.y;
      particles.push({
        x: cx,
        y: cy,
        color: colors[Math.floor(Math.random() * colors.length)],
        r: Math.random() * 3 + 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.5
      });
    }

    let start = performance.now();

    const render = (now: number) => {
      const elapsed = (now - start) / 1000;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // center and scale
      const scale = Math.min(w, h) / 40;
      const cx = w / 2;
      const cy = h / 2;

      // Enhanced pulse effect with multiple frequencies
      const pulse = 1 + 0.12 * Math.sin(elapsed * 5) + 0.05 * Math.sin(elapsed * 12);
      const beat = 0.15 * Math.sin(elapsed * 3.5); // Heartbeat effect

      particles.forEach((p, idx) => {
        // Particle animation with phase offset
        const particlePulse = 1 + 0.3 * Math.sin(elapsed * p.speed * 8 + p.phase);
        const particleBeat = 0.2 * Math.sin(elapsed * 3.5 + p.phase);
        
        const px = cx + p.x * scale * (pulse + beat);
        const py = cy + p.y * scale * (pulse + beat);
        
        // Particle glow effect
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9 + 0.1 * Math.sin(elapsed * 6 + p.phase);
        ctx.arc(px, py, p.r * particlePulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset shadow for other elements
      ctx.shadowBlur = 0;

      // Enhanced glowing overlay with heartbeat
      const overlayAlpha = 0.1 + 0.08 * Math.sin(elapsed * 3.5);
      const overlayScale = pulse + beat * 0.5;
      
      // Red outer glow
      ctx.globalAlpha = overlayAlpha * 0.5;
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.min(w, h) / 3 * overlayScale, Math.min(w, h) / 3.4 * overlayScale, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Pink middle glow
      ctx.globalAlpha = overlayAlpha * 0.7;
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.min(w, h) / 3.5 * overlayScale, Math.min(w, h) / 3.9 * overlayScale, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // White inner glow
      ctx.globalAlpha = overlayAlpha;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.min(w, h) / 4 * overlayScale, Math.min(w, h) / 4.4 * overlayScale, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [sizeFraction]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none">
      <div style={{ width: '66vw', height: '66vh' }} className="flex items-center justify-center animate-in fade-in-50 duration-1000">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

const BirthdayFireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    type FireParticle = { x:number,y:number,vx:number,vy:number,alpha:number,color:string,size:number };
    let particles: FireParticle[] = [];

    const spawnBurst = (cx:number, cy:number) => {
      const count = 120 + Math.floor(Math.random() * 80);
      for (let i=0;i<count;i++){
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        particles.push({ x:cx, y:cy, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, alpha:1, color: ['#FFD700','#FF69B4','#FF4500','#FFFFFF'][Math.floor(Math.random()*4)], size: Math.random()*2+1 });
      }
    };

    // spawn initial bursts
    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth*0.1;
      const y = Math.random() * window.innerHeight * 0.6 + window.innerHeight*0.1;
      spawnBurst(x,y);
    }, 300);

    const animate = () => {
      ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
      particles = particles.filter(p => p.alpha > 0.02);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.alpha *= 0.98;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[1000] pointer-events-none" />;
};

const HeartBalloons = ({ count = 18 }: { count?: number }) => {
  return (
    <div className="fixed inset-0 z-[1001] pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 90 + 5;
        const delay = Math.random() * 1.5;
        const duration = 3 + Math.random() * 3;
        const size = 28 + Math.random() * 36;
        const color = Math.random() > 0.5 ? '#FF69B4' : (Math.random() > 0.5 ? '#FF1493' : '#FFFFFF');
        return (
          <div
            key={i}
            style={{ left: `${left}%`, bottom: '-10%', animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
            className="absolute flex items-center justify-center animate-rise"
          >
            <Heart size={size} fill={color as any} className="drop-shadow-xl" />
          </div>
        );
      })}
      <style>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(0.9); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-130vh) scale(1); opacity: 0; }
        }
        .animate-rise { animation-name: rise; animation-timing-function: cubic-bezier(.22,.9,.32,1); animation-fill-mode: both; }
      `}</style>
    </div>
  );
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showList, setShowList] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/music/bgm.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') setIsPlaying(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) audioRef.current?.play().catch(() => setIsPlaying(false));
    else audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">
      {showList && (
        <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-pink-200 w-48 animate-in slide-in-from-bottom-4">
          <h4 className="text-pink-600 font-bold text-sm mb-2 flex items-center gap-2">
            <Music size={14} /> Playlist
          </h4>
          <div className="text-xs text-slate-600 space-y-2">
            <div className="flex justify-between items-center bg-pink-50 p-2 rounded">
              <span className="truncate">Birthday BGM</span>
              <span className="opacity-50">3:45</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Volume2 size={14} className="text-pink-400" />
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-full accent-pink-500 h-1"
            />
          </div>
        </div>
      )}
      <button 
        onContextMenu={(e) => { e.preventDefault(); setShowList(!showList); }}
        onClick={() => setIsPlaying(!isPlaying)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${
          isPlaying ? 'bg-pink-500 text-white animate-spin-slow' : 'bg-white text-pink-500'
        }`}
        style={{ animationDuration: '4s' }}
      >
        {isPlaying ? <Music size={24} /> : <Play size={24} />}
      </button>
    </div>
  );
};

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  delay: number;
}

const ParticleCanvas = ({ 
  targets, 
  onFinished, 
  holdDuration = 1000,
  particleSize = 1.8,
  accentColor = '#FF69B4'
}: { 
  targets: {x: number, y: number, color: string}[], 
  onFinished: () => void,
  holdDuration?: number,
  particleSize?: number,
  accentColor?: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [assembled, setAssembled] = useState(false);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = targets.map(t => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tx: t.x,
      ty: t.y,
      vx: 0,
      vy: 0,
      size: Math.random() * particleSize + 1,
      color: t.color,
      delay: Math.random() * 15
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      let arrivedCount = 0;
      particles.forEach(p => {
        if (frame < p.delay) return;

        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 2) {
          arrivedCount++;
          p.x = p.tx + Math.sin(frame * 0.05 + p.delay) * 1.5;
          p.y = p.ty + Math.cos(frame * 0.05 + p.delay) * 1.5;
        } else {
          p.vx = dx * 0.06;
          p.vy = dy * 0.06;
          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if ((arrivedCount > particles.length * 0.92 || frame > 400) && !assembled) {
        setAssembled(true);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if(animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [targets]);

  useEffect(() => {
    if (assembled) {
      const timer = setTimeout(() => onFinished(), holdDuration);
      return () => clearTimeout(timer);
    }
  }, [assembled, onFinished, holdDuration]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />;
};

const LYYBirthdayApp = () => {
  const [view, setView] = useState<View>('login');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hotkeyTriggered, setHotkeyTriggered] = useState<string | null>(null);
  const [keyBuffer, setKeyBuffer] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('lyy_photos');
    if (saved) {
      try {
        const parsed: Photo[] = JSON.parse(saved);
        const normalized = parsed.map((p, i) => {
          if (p.isInitial) {
            const url = INITIAL_PHOTOS_URLS[i % INITIAL_PHOTOS_URLS.length];
            return { ...p, url };
          }
          return p;
        });
        setPhotos(normalized);
        localStorage.setItem('lyy_photos', JSON.stringify(normalized));
      } catch (e) {
        const initial = INITIAL_PHOTOS_URLS.map((url, i) => ({
          id: `init-${i}`,
          url,
          isInitial: true,
          timestamp: Date.now(),
          likes: 0
        }));
        setPhotos(initial);
        localStorage.setItem('lyy_photos', JSON.stringify(initial));
      }
    } else {
      const initial = INITIAL_PHOTOS_URLS.map((url, i) => ({
        id: `init-${i}`,
        url,
        isInitial: true,
        timestamp: Date.now(),
        likes: 0
      }));
      setPhotos(initial);
      localStorage.setItem('lyy_photos', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'login') return;
      if (['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) return;

      const newBuffer = (keyBuffer + e.key.toLowerCase()).slice(-20);
      setKeyBuffer(newBuffer);

      if (newBuffer.endsWith('lyy')) {
        setHotkeyTriggered('lyy');
        setTimeout(() => setHotkeyTriggered(null), 5000);
      } else if (newBuffer.endsWith('birthday')) {
        setHotkeyTriggered('birthday');
        setTimeout(() => setHotkeyTriggered(null), 5000);
      } else if (newBuffer.endsWith('dl')) {
        setHotkeyTriggered('dl');
        setTimeout(() => setHotkeyTriggered(null), 5000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyBuffer, view]);

  const handleLogin = (u: string, p: string) => {
    if (u === USERNAME && p === PASSWORD) setView('welcome');
  };

  return (
    <div className={`min-h-screen selection:bg-pink-200 bg-white ${view === 'home' ? '' : 'overflow-hidden'}`}>
      <Fireworks />
      <MusicPlayer />
      
      {hotkeyTriggered === 'lyy' && (
        <HeartParticles />
      )}
      
      {hotkeyTriggered === 'birthday' && (
        <>
          <BirthdayFireworks />
          <HeartBalloons />
        </>
      )}

      {hotkeyTriggered === 'dl' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] animate-in zoom-in-50 fade-in duration-800">
          <div className="bg-gradient-to-br from-white to-pink-50 p-12 sm:p-16 rounded-[3rem] shadow-2xl border-4 border-pink-200 text-center relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-200/50 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-300/50 rounded-full blur-3xl animate-pulse delay-700"></div>
            
            {/* 文字效果 */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-pink-400 animate-in slide-in-from-bottom-4 duration-1000">
              让我们大声喊出: DL大帅哥
            </h1>
            
            {/* 装饰元素 */}
            <div className="absolute top-4 left-4 text-pink-300 animate-spin-slow">
              <Sparkles size={24} />
            </div>
            <div className="absolute top-4 right-4 text-pink-300 animate-spin-slow delay-500">
              <Sparkles size={24} />
            </div>
            <div className="absolute bottom-4 left-4 text-pink-300 animate-bounce">
              <Heart size={20} fill="currentColor" />
            </div>
            <div className="absolute bottom-4 right-4 text-pink-300 animate-bounce delay-300">
              <Heart size={20} fill="currentColor" />
            </div>
          </div>
        </div>
      )}

      {view === 'login' && <LoginView onLogin={handleLogin} />}
      {view === 'welcome' && <WelcomeSequence onComplete={() => setView('home')} />}
      {view === 'home' && <HomeView photos={photos} setPhotos={setPhotos} />}
    </div>
  );
};

const LoginView = ({ onLogin }: { onLogin: (u: string, p: string) => void }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === USERNAME && p === PASSWORD) onLogin(u, p);
    else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-white">
      <form onSubmit={handleSubmit} className={`w-full max-w-sm bg-white p-10 rounded-[2.5rem] shadow-2xl border-t-8 border-pink-300 transition-all ${error ? 'animate-shake' : ''}`}>
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
            <PartyPopper size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Hello, LYY</h1>
        </div>
        <div className="space-y-4">
          <input 
            type="text" placeholder="Username" value={u} onChange={e => setU(e.target.value)}
            autoComplete="off"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-pink-300 focus:outline-none transition-all"
          />
          <input 
            type="password" placeholder="Birthday Password" value={p} onChange={e => setP(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-pink-300 focus:outline-none transition-all"
          />
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
            Unlock Birthday 🎂
          </button>
        </div>
      </form>
    </div>
  );
};

const WelcomeSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<'cake' | 'blessing' | 'final'>('cake');
  const [blessingIndex, setBlessingIndex] = useState(0);

  const cakeTargets = useMemo(() => {
    const targets: {x: number, y: number, color: string}[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 + 80;

    const drawEllipsePoints = (cx: number, cy: number, rx: number, ry: number, count: number, color: string) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        targets.push({ x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry, color });
      }
    };

    const drawCylinderPoints = (cx: number, cy: number, rx: number, ry: number, h: number, count: number, color: string, stripeColor?: string) => {
      drawEllipsePoints(cx, cy, rx, ry, count / 4, color);
      drawEllipsePoints(cx, cy + h, rx, ry, count / 4, color);
      const lineCount = 24;
      for (let j = 0; j < lineCount; j++) {
         const angle = (j / lineCount) * Math.PI * 2;
         const sx = cx + Math.cos(angle) * rx;
         const sy = cy + Math.sin(angle) * ry;
         const c = (stripeColor && j % 4 === 0) ? stripeColor : color;
         for(let k=0; k<15; k++) targets.push({ x: sx, y: sy + (k/15)*h, color: c });
      }
    };

    drawEllipsePoints(centerX, centerY, 160, 48, 150, '#f8f9fa');
    drawCylinderPoints(centerX, centerY - 60, 130, 39, 65, 400, '#FFB6C1', '#FF69B4');
    drawCylinderPoints(centerX, centerY - 115, 100, 30, 55, 350, '#FFC0CB', '#FF1493');
    drawCylinderPoints(centerX, centerY - 160, 70, 21, 45, 300, '#FF69B4', '#fff');
    for(let i=0; i<30; i++) targets.push({ x: centerX, y: centerY - 160 - i, color: '#fff' });
    for(let i=0; i<40; i++) {
      targets.push({ 
        x: centerX + (Math.random()-0.5)*14, 
        y: centerY - 195 + (Math.random()-0.5)*22, 
        color: Math.random() > 0.6 ? '#FFA500' : (Math.random() > 0.3 ? '#FF4500' : '#FFFFE0')
      });
    }
    return targets;
  }, []);

  const getTextTargets = (text: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const isNarrow = w < 768;

    // Default (original) behavior for wide screens: single-line large text
    if (!isNarrow) {
      let fontSize = Math.floor(w * 0.15);
      ctx.font = `bold ${fontSize}px "Inter", "Microsoft YaHei", sans-serif`;
      let metrics = ctx.measureText(text);
      while (metrics.width > w * 0.8 && fontSize > 20) {
        fontSize -= 5;
        ctx.font = `bold ${fontSize}px "Inter", "Microsoft YaHei", sans-serif`;
        metrics = ctx.measureText(text);
      }

      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.clearRect(0, 0, w, h);
      ctx.fillText(text, w / 2, h / 2);

      const data = ctx.getImageData(0, 0, w, h).data;
      const points: { x: number; y: number; color: string }[] = [];
      const step = fontSize > 100 ? 6 : 4;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            points.push({ x, y, color: '#FF69B4' });
          }
        }
      }
      return points;
    }

    // Narrow screens: try to render as two lines at most
    let fontSize = Math.floor(w * 0.12);
    const minFont = 14;
    const maxTextWidth = Math.floor(w * 0.9);
    const setFont = (s: number) => { ctx.font = `bold ${s}px "Inter", "Microsoft YaHei", sans-serif`; };
    setFont(fontSize);

    const measure = (s: string) => ctx.measureText(s).width;
    // Decrease if overall too wide
    while (fontSize > minFont && measure(text) > maxTextWidth * 2) {
      fontSize -= 2;
      setFont(fontSize);
    }

    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';
    for (let i = 0; i < words.length; i++) {
      const trial = current ? current + ' ' + words[i] : words[i];
      if (measure(trial) <= maxTextWidth) {
        current = trial;
      } else {
        if (current) lines.push(current);
        current = words[i];
        if (lines.length === 1) {
          // if we already have one line, force remaining into second line
          const remaining = words.slice(i + 1).join(' ');
          current = current + (remaining ? ' ' + remaining : '');
          break;
        }
      }
    }
    if (current) lines.push(current);
    // Ensure max 2 lines
    if (lines.length > 2) {
      const merged = lines.slice(1).join(' ');
      lines.splice(1, lines.length - 1, merged);
    }

    setFont(fontSize);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.clearRect(0, 0, w, h);

    const lineHeight = Math.max(fontSize * 1.1, 18);
    const totalHeight = lines.length * lineHeight;
    const startY = Math.floor(h / 2 - totalHeight / 2 + lineHeight / 2);
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], w / 2, startY + i * lineHeight);
    }

    const data = ctx.getImageData(0, 0, w, h).data;
    const points: { x: number; y: number; color: string }[] = [];
    const step = fontSize > 60 ? 6 : fontSize > 30 ? 5 : 4;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 128) {
          points.push({ x, y, color: '#FF69B4' });
        }
      }
    }
    return points;
  };

  const textTargets = useMemo(() => getTextTargets(BLESSING_LINES[blessingIndex]), [blessingIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && stage === 'final') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stage, onComplete]);

  const onCakeFinished = () => {
    setStage('blessing');
  };

  const onTextFinished = () => {
    if (blessingIndex < BLESSING_LINES.length - 1) {
      setBlessingIndex(prev => prev + 1);
    } else {
      setStage('final');
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white overflow-hidden p-6">
      {stage === 'cake' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
           <ParticleCanvas targets={cakeTargets} onFinished={onCakeFinished} />
           <p className="absolute bottom-24 text-pink-400 font-medium animate-pulse flex items-center gap-2">
             <Sparkles size={18} /> Preparing your surprise...
           </p>
        </div>
      )}
      
      {stage === 'blessing' && (
        <div className="relative w-full h-full">
           <ParticleCanvas 
              key={blessingIndex}
              targets={textTargets} 
              onFinished={onTextFinished}
              particleSize={3.5} 
              holdDuration={1000}
           />
        </div>
      )}

      {stage === 'final' && (
        <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in duration-1000">
           <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center text-pink-400 animate-bounce">
                <Heart size={48} fill="currentColor" />
              </div>
           </div>
           
           <div className="space-y-8">
             <h1 className="text-5xl md:text-7xl font-romantic text-pink-600 leading-relaxed">
               Welcome to your special place
             </h1>
             <p className="text-slate-500 text-xl">Click below or press Space to see our memories</p>
           </div>
           
           <div className="flex flex-col items-center gap-6">
             <button 
               onClick={onComplete}
               className="px-16 py-6 bg-pink-500 text-white rounded-full text-xl font-bold shadow-2xl hover:bg-pink-600 transition-all flex items-center gap-4 transform hover:scale-105 active:scale-95"
             >
               Explore the Gallery <ArrowRight size={28} />
             </button>
             
             <p className="text-pink-300 text-base flex items-center gap-2 animate-pulse">
               <Keyboard size={18} /> 按空格键继续 / Press Space to continue
             </p>
           </div>
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced scrollable 3D Dimension Wall
 */
const HomeView = ({ photos, setPhotos }: { photos: Photo[], setPhotos: React.Dispatch<React.SetStateAction<Photo[]>> }) => {
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [likesEffect, setLikesEffect] = useState<{x: number, y: number, id: number}[]>([]);
  const [isNarrow, setIsNarrow] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  const rotationRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Perspective Tilt Angle
  const TILT_ANGLE = 15;

  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    let frame: number;
    const animate = () => {
      if (isRotating && !fullscreenIdx && !isDragging.current) {
        rotationRef.current += 0.22;
        setRotation(rotationRef.current);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [isRotating, fullscreenIdx]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    setIsRotating(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    rotationRef.current += delta * 0.3;
    setRotation(rotationRef.current);
    startX.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (!fullscreenIdx) setIsRotating(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const currentUploadedCount = photos.filter(p => !p.isInitial).length;
    const remaining = 24 - currentUploadedCount;
    const toUpload = Array.from(files).slice(0, remaining);
    const newPhotos: Photo[] = [];
    for (const file of toUpload) {
      if (file.size > 10 * 1024 * 1024) continue;
      const base64 = await compressImage(file);
      newPhotos.push({
        id: `user-${Date.now()}-${Math.random()}`,
        url: base64,
        isInitial: false,
        timestamp: Date.now(),
        likes: 0
      });
    }
    const updated = [...photos, ...newPhotos];
    setPhotos(updated);
    localStorage.setItem('lyy_photos', JSON.stringify(updated));
    setUploading(false);
  };

  const deletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    localStorage.setItem('lyy_photos', JSON.stringify(updated));
    if(fullscreenIdx !== null) setFullscreenIdx(null);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    if (e.detail === 2) {
      const effect = { x: e.clientX, y: e.clientY, id: Date.now() };
      setLikesEffect(prev => [...prev, effect]);
      setTimeout(() => setLikesEffect(prev => prev.filter(p => p.id !== effect.id)), 2000);
      const updated = photos.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
      setPhotos(updated);
      localStorage.setItem('lyy_photos', JSON.stringify(updated));
    }
  };

  const radius = useMemo(() => {
    return Math.max(500, photos.length * 60);
  }, [photos.length]);

  return (
    <div 
      className="min-h-screen bg-[#030303] text-white relative select-none scroll-smooth"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <header className="fixed top-0 left-0 right-0 h-24 bg-black/60 backdrop-blur-3xl border-b border-white/10 z-[100] flex items-center justify-between px-12">
        <div className="flex flex-col">
          <h2 className="text-3xl font-romantic text-pink-400">LYY's Memory Wall</h2>
          <p className="text-white/20 text-[14px] tracking-[0.4em] uppercase">Scroll to explore | Drag to spin</p>
        </div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => setIsRotating(!isRotating)}
            className={`p-3 rounded-full border transition-all ${isRotating ? 'border-pink-500/50 bg-pink-500/10 text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-white/10 text-white/20'}`}
          >
            <RotateCw size={24} className={isRotating ? 'animate-spin-slow' : ''} />
          </button>
          <label className="flex items-center gap-3 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3.5 rounded-full cursor-pointer shadow-[0_0_50px_rgba(236,72,153,0.3)] transition-all active:scale-95 group">
            <Upload size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-black text-sm tracking-widest">UPLOAD MEMORY</span>
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </header>

      {likesEffect.map(eff => (
        <div key={eff.id} className="heart-float z-[3000]" style={{ left: eff.x, top: eff.y }}>
          <Heart fill="currentColor" size={40} />
        </div>
      ))}

      {!isNarrow ? (
        <div className="relative pt-64 pb-96 flex flex-col items-center justify-center perspective-[3000px] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[800px] bg-gradient-to-b from-pink-500/5 to-transparent blur-[160px] rounded-full rotate-x-75 animate-pulse pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[550px] border-2 border-white/5 rounded-full rotate-x-75 pointer-events-none shadow-[0_0_150px_rgba(255,255,255,0.03)]"></div>
          
          <div 
            className="relative preserve-3d w-[320px] h-[450px] pointer-events-auto"
            style={{ transform: `rotateX(${TILT_ANGLE}deg) rotateY(${rotation}deg)` }}
          >
            {photos.map((photo, idx) => {
              const angle = (idx / photos.length) * 360;
              return (
                <div 
                  key={photo.id}
                  className="absolute inset-0 cursor-pointer preserve-3d transition-transform duration-500"
                  style={{ 
                    transform: `rotateY(${angle}deg) translateZ(${radius}px) rotateY(${-angle - rotation}deg) rotateX(${-TILT_ANGLE}deg)` 
                  }}
                  onClick={(e) => {
                    if(!isDragging.current) {
                      setFullscreenIdx(idx);
                      handleLike(photo.id, e as any);
                    }
                  }}
                >
                  <div className="relative w-full h-full group rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_30px_100px_rgba(0,0,0,0.8)] hover:border-pink-500/40 transition-all duration-700 hover:-translate-y-16 hover:scale-105 active:scale-95">
                    <img src={photo.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" alt="Memory" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                      <div className="flex items-center gap-3 text-pink-400">
                        <Heart size={24} fill={photo.likes > 0 ? "currentColor" : "none"} />
                        <span className="text-xl font-black tracking-tighter">{photo.likes}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-30"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-32 opacity-20 flex flex-col items-center gap-4 animate-bounce">
            <p className="text-[10px] font-black tracking-[0.5em] uppercase">Scroll Down to explore more</p>
            <div className="w-px h-12 bg-white/40"></div>
          </div>
        </div>
      ) : (
        <div className="px-4 pt-28 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo, idx) => (
                <div key={photo.id} className="cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/8" onClick={(e) => { if(!isDragging.current) { setFullscreenIdx(idx); handleLike(photo.id, e as any); } }}>
                  <img src={photo.url} className="w-full h-40 sm:h-48 object-cover" alt="Memory" />
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pink-400">
                      <Heart size={18} fill={photo.likes > 0 ? 'currentColor' : 'none'} />
                      <span className="text-sm font-black">{photo.likes}</span>
                    </div>
                    {!photo.isInitial && <span className="text-xs text-white/40">Uploaded</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {fullscreenIdx !== null && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-[40px] animate-in fade-in duration-700" onClick={() => setFullscreenIdx(null)} />
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6 sm:gap-10">
            {/* Close Button Mobile/Top */}
            <button 
              onClick={() => setFullscreenIdx(null)} 
              className="absolute top-4 right-4 sm:top-10 sm:right-10 text-white/40 hover:text-white transition-colors z-50 p-2"
            >
              <X size={32} />
            </button>

            <div className="flex items-center justify-center w-full max-w-7xl h-[60vh] sm:h-[75vh]">
              {/* Previous Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setFullscreenIdx(prev => (prev! - 1 + photos.length) % photos.length); }} 
                className="hidden sm:block p-4 sm:p-8 text-white/10 hover:text-white transition-all transform hover:scale-110 active:scale-90"
              >
                <ChevronLeft size={80} className="lg:size-120" strokeWidth={1} />
              </button>
              
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-pink-500/20 blur-[100px] animate-gacha-flash pointer-events-none rounded-[5rem]"></div>
                
                <div className="relative w-full max-w-[min(90vw,520px)] h-full rounded-[2.5rem] sm:rounded-[4.5rem] overflow-hidden border-2 border-white/20 shadow-[0_0_120px_rgba(236,72,153,0.3)] animate-gacha-card bg-transparent">
                  {/* Photo fills entire card */}
                  <div className="w-full h-full relative group">
                    <img 
                      src={photos[fullscreenIdx].url} 
                      className="w-full h-full object-cover" 
                      alt="Expanded Memory"
                    />
                    {!photos[fullscreenIdx].isInitial && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); deletePhoto(photos[fullscreenIdx!].id); }} 
                        className="absolute bottom-4 right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg flex items-center justify-center text-white/40 transition-all transform opacity-0 translate-y-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto z-50"
                        aria-label="Delete Photo"
                        title="Delete Photo"
                      >
                        <Trash2 size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setFullscreenIdx(prev => (prev! + 1) % photos.length); }} 
                className="hidden sm:block p-4 sm:p-8 text-white/10 hover:text-white transition-all transform hover:scale-110 active:scale-90"
              >
                <ChevronRight size={80} className="lg:size-120" strokeWidth={1} />
              </button>
            </div>
            
            {/* Mobile Navigation and Close Button */}
            <div className="flex items-center gap-4">
               <button 
                onClick={(e) => { e.stopPropagation(); setFullscreenIdx(prev => (prev! - 1 + photos.length) % photos.length); }} 
                className="sm:hidden p-4 bg-white/5 rounded-full text-white/40"
              >
                <ChevronLeft size={32} />
              </button>
              
              <button 
                onClick={() => setFullscreenIdx(null)} 
                className="flex items-center gap-4 px-10 sm:px-20 py-4 sm:py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/40 font-black tracking-[0.4em] text-[8px] sm:text-[10px] transition-all backdrop-blur-3xl hover:text-white hover:border-pink-500/40 group"
              >
                <X size={14} className="group-hover:rotate-90 transition-transform" /> CLOSE GALLERY
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); setFullscreenIdx(prev => (prev! + 1) % photos.length); }} 
                className="sm:hidden p-4 bg-white/5 rounded-full text-white/40"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#110011_0%,_transparent_70%)] opacity-30"></div>
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/20 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.15,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          ></div>
        ))}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-8 z-[100] pointer-events-none">
        <p className="text-white/10 text-[9px] font-black tracking-[1.5em] uppercase flex items-center gap-10">
          <span className="w-32 h-[1px] bg-gradient-to-r from-transparent to-white/10"></span>
          FOR LYY ALWAYS <Heart size={14} className="text-pink-900/40 mx-2" fill="currentColor" /> MADE BY DL 2026
          <span className="w-32 h-[1px] bg-gradient-to-l from-transparent to-white/10"></span>
        </p>
      </footer>

      <style>{`
        @keyframes gacha-flash {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.6); }
        }
        @keyframes gacha-card {
          0% { transform: translateY(400px) rotateX(60deg) scale(0.2); opacity: 0; filter: blur(20px); }
          100% { transform: translateY(0) rotateX(0) scale(1); opacity: 1; filter: blur(0); }
        }
        .animate-gacha-flash { animation: gacha-flash 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-gacha-card { animation: gacha-card 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .rotate-x-75 { transform: rotateX(75deg); }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};

// --- Execution ---
const root = createRoot(document.getElementById('root')!);
root.render(<LYYBirthdayApp />);

// --- Fonts ---
const style = document.createElement('style');
style.textContent = `
  @font-face {
    font-family: 'AlimamaDaoLiTi';
    src: url('/fonts/AlimamaDaoLiTi.woff2') format('woff2'),
         url('/fonts/AlimamaDaoLiTi.woff') format('woff'),
         url('/fonts/AlimamaDaoLiTi.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'GreatVibes';
    src: url('/fonts/GreatVibes-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  /* Apply fonts to specific elements */
  .font-alimama {
    font-family: 'AlimamaDaoLiTi', cursive;
  }
  
  .font-greatvibes {
    font-family: 'GreatVibes', cursive;
  }
  
  /* Apply to Chinese text */
  h1, h2, h3, h4, .text-chinese {
    font-family: 'AlimamaDaoLiTi', cursive;
  }
  
  /* Apply to English romantic text */
  .text-romantic, .font-romantic {
    font-family: 'GreatVibes', cursive;
  }
`;
document.head.appendChild(style);