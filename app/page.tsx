// app/page.tsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { skills, projects, certificates } from "@/lib/data";

export default function Portfolio() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("tutorialSeen")) {
      setShowTutorial(true);
      sessionStorage.setItem("tutorialSeen", "true");
    }
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const fullText = "Full-Stack Developer";
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; color: string; left: number; delay: number }[]>([]);
  const confettiId = useRef(0);

  const dragStartY = useRef(0);
  const MAX_PULL = 50;
  const TRIGGER_PULL = 35;

  const tiltCardsRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // --- 1. โหลดสถานะ Dark Mode จาก Local Storage ตอนเข้าเว็บ ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const triggerConfetti = useCallback(() => {
    const colors = ["#6366f1", "#facc15", "#f43f5e", "#22c55e", "#3b82f6", "#ec4899"];
    const pieces = Array.from({ length: 30 }).map((_, i) => ({
      id: confettiId.current++,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
    }));
    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 1500);
  }, []);

  // --- 2. อัปเดตสถานะ Dark Mode ลงใน Local Storage และคลาสของเว็บ ---
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
    setIsSwinging(true);
    triggerConfetti();
    setTimeout(() => setIsSwinging(false), 1200);
  }, [triggerConfetti]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (showTutorial) setShowTutorial(false);
    if (isSwinging) return;
    setIsDragging(true);
    dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = y - dragStartY.current;
    if (diff > 0) setPullDistance(Math.min(diff, MAX_PULL));
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    if (pullDistance > TRIGGER_PULL) toggleTheme();
    setIsDragging(false);
    setPullDistance(0);
  }, [isDragging, pullDistance, toggleTheme]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const cards = tiltCardsRef.current;
    const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    };
    const handleMouseLeave = (card: HTMLElement) => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    };

    const listeners: { card: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];
    cards.forEach((card) => {
      if (!card) return;
      const move = (e: MouseEvent) => handleMouseMove(e, card);
      const leave = () => handleMouseLeave(card);
      card.addEventListener("mousemove", move as EventListener);
      card.addEventListener("mouseleave", leave);
      listeners.push({ card, move, leave });
    });
    return () => {
      listeners.forEach(({ card, move, leave }) => {
        card.removeEventListener("mousemove", move as EventListener);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("reveal-visible");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    revealRefs.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const addRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = "ripple-effect";
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <style>{`
        @keyframes swing { 0% { transform: rotate(0deg); } 15% { transform: rotate(12deg); } 30% { transform: rotate(-10deg); } 45% { transform: rotate(8deg); } 60% { transform: rotate(-6deg); } 75% { transform: rotate(3deg); } 100% { transform: rotate(0deg); } }
        @keyframes reveal { 0% { opacity: 0; transform: translateY(35px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        @keyframes confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes float-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-swing { animation: swing 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
        .reveal-hidden { opacity: 0; transform: translateY(35px); transition: all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1); }
        .reveal-visible { opacity: 1; transform: translateY(0); }
        .ripple-effect { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.4); transform: scale(0); animation: ripple 0.6s linear; pointer-events: none; }
        .gradient-text-animated { background: linear-gradient(to right, #6366f1, #a855f7, #6366f1); background-size: 200% 200%; animation: gradient-shift 3s ease infinite; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        :root { --color-pv-bg: #f8fafc; --color-pv-card: #ffffff; --color-pv-title: #0f172a; --color-pv-text: #475569; --color-pv-border: #e2e8f0; }
        .dark { --color-pv-bg: #0f172a; --color-pv-card: #1e293b; --color-pv-title: #f8fafc; --color-pv-text: #94a3b8; --color-pv-border: #334155; }
        .bg-pv-bg { background-color: var(--color-pv-bg); } .bg-pv-card { background-color: var(--color-pv-card); } .text-pv-title { color: var(--color-pv-title); } .text-pv-text { color: var(--color-pv-text); } .border-pv-border { border-color: var(--color-pv-border); }
      `}</style>

      <div className="min-h-screen bg-pv-bg text-pv-text transition-colors duration-500 overflow-x-hidden relative">
        <div className="fixed pointer-events-none z-[1000] hidden md:block" style={{ left: mousePos.x - 20, top: mousePos.y - 20, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", transition: "left 0.1s ease, top 0.1s ease", filter: "blur(4px)" }}></div>

        {confettiPieces.map((p) => (
          <div key={p.id} className="fixed top-0 z-[200] pointer-events-none" style={{ left: `${p.left}%`, width: 10, height: 10, backgroundColor: p.color, borderRadius: 2, animation: `confetti-fall 1.5s ${p.delay}s linear forwards` }}></div>
        ))}

        <div className={`fixed top-0 right-6 md:right-16 z-[101] flex flex-col items-center ${isSwinging ? 'animate-swing' : ''}`} style={{ transform: isDragging ? `translateY(${pullDistance * 0.2}px)` : 'translateY(0)', transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <div className="w-6 h-3 bg-slate-800 dark:bg-slate-700 rounded-b-md shadow-md border border-t-0 border-slate-700 dark:border-slate-600"></div>
          <div className="w-0.5 bg-slate-400 dark:bg-slate-500 origin-top shadow-sm" style={{ height: isDragging ? `${70 + pullDistance}px` : '70px', transition: isDragging ? 'none' : 'height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}></div>
          <div onMouseDown={handleDragStart} onTouchStart={handleDragStart} className={`w-9 h-9 -mt-1 rounded-full cursor-grab active:cursor-grabbing border-4 shadow-lg flex items-center justify-center text-[9px] font-black select-none touch-none transition-all duration-300 ${isDarkMode ? 'bg-yellow-400 border-white text-slate-900 shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 'bg-indigo-600 border-indigo-100 text-white hover:bg-indigo-500'}`}>
            {isDarkMode ? 'ON' : 'OFF'}
          </div>
        </div>

        {showTutorial && (
          <div className="fixed top-28 right-4 md:right-12 z-[100] w-64 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-slate-700 reveal-hidden reveal-visible animate-float-gentle">
            <div className="absolute -top-2 right-4 md:right-6 w-4 h-4 bg-white dark:bg-slate-800 border-l border-t border-slate-200 dark:border-slate-700 rotate-45 transform"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5"><span className="text-lg">💡</span> ลูกเล่นใหม่!</h3>
                <button onClick={() => setShowTutorial(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                ลอง<span className="text-indigo-600 dark:text-indigo-400 font-bold mx-1">ลากดึงสวิตช์โคมไฟ</span>ด้านบนลงมา เพื่อสลับใช้งาน Dark Mode ดูก่อนสิครับ!
              </p>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center reveal-hidden reveal-visible">
              <button className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 rounded-full p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              <img src={selectedImage} alt="Expanded" className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
          </div>
        )}

        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-pv-card/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center pr-24 md:pr-32">
            <Link href="/" className="text-xl md:text-2xl font-black text-pv-title tracking-tight gradient-text-animated">FAM<span className="text-indigo-500">.DEV</span></Link>
            <div className="hidden md:flex space-x-6 font-bold text-pv-text text-sm">
              {["หน้าแรก", "ทักษะ", "ผลงาน", "เกียรติบัตร", "ติดต่อ"].map((item, idx) => (
                <a key={idx} href={`#${["home", "skills", "projects", "certificates", "contact"][idx]}`} className="relative overflow-hidden hover:text-indigo-600 transition-colors group">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <button className="md:hidden text-pv-title p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
          <div className={`md:hidden absolute top-full left-0 w-full bg-pv-card border-b border-pv-border shadow-lg transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible h-0"}`}>
            <div className="flex flex-col px-4 py-4 space-y-3 text-center font-bold text-pv-text text-sm">
              {["หน้าแรก", "ทักษะ", "ผลงาน", "เกียรติบัตร", "ติดต่อ"].map((item, idx) => (
                <a key={idx} href={`#${["home", "skills", "projects", "certificates", "contact"][idx]}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:bg-pv-bg rounded-xl transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </nav>

        <section id="home" className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-6 min-h-screen flex items-center overflow-hidden bg-[radial-gradient(var(--color-pv-border)_1px,transparent_1px)] [background-size:30px_30px]" style={{ backgroundPositionY: mousePos.y * 0.02 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pv-bg/50 to-pv-bg pointer-events-none"></div>
          <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start order-2 md:order-1 reveal-hidden reveal-visible">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold text-xs md:text-sm shadow-sm hover:scale-105 transition-transform">👋 สวัสดีครับ ผมชื่อ ปรมัตถ์ พรหมวิชัย (แฟ้ม)</div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-pv-title tracking-tight mb-4 leading-none">
                <span className="block">Full-Stack</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400 block mt-2 text-4xl md:text-5xl lg:text-6xl">{typedText}<span className="animate-pulse">|</span></span>
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8 text-xs md:text-sm font-bold">
                <div className="bg-pv-card px-4 py-2 rounded-xl shadow-sm border border-pv-border hover:border-indigo-400 transition-colors">🎓 ม.เกษตรศาสตร์ (ปี 4)</div>
                <div className="bg-pv-card px-4 py-2 rounded-xl shadow-sm border border-pv-border hover:border-indigo-400 transition-colors">📚 GPA: 3.72</div>
                <div className="bg-pv-card px-4 py-2 rounded-xl shadow-sm border border-pv-border hover:border-indigo-400 transition-colors">📍 จ.สกลนคร</div>
              </div>
              <p className="text-base md:text-lg text-pv-text mb-8 max-w-xl leading-relaxed">นักศึกษาวิศวกรรมคอมพิวเตอร์ที่หลงใหลการเขียนโค้ดและพัฒนา Web Application, Mobile App รวมถึงระบบ IoT พร้อมเรียนรู้งานและร่วมงานกับทีมอย่างเป็นมืออาชีพครับ</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 md:px-0">
                <a href="#projects" onClick={addRipple} className="relative overflow-hidden px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-center shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-200">ดูผลงานโปรเจกต์</a>
                <a href="#contact" onClick={addRipple} className="relative overflow-hidden px-8 py-3.5 bg-pv-card text-pv-title border border-pv-border rounded-xl font-bold text-center hover:bg-pv-bg transition-all duration-200">ติดต่อสอบถาม</a>
              </div>
            </div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 order-1 md:order-2 reveal-hidden reveal-visible" style={{ animation: "float 4s ease-in-out infinite" }}>
              <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] rotate-6 scale-105 opacity-10 animate-pulse"></div>
              <div className="relative w-full h-full group z-10 cursor-zoom-in" onClick={() => setSelectedImage("/image/myprofile.jpg")}>
                <img src="/image/myprofile.jpg" alt="Paramat" className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border-4 border-pv-card group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] flex items-center justify-center pointer-events-none z-20">
                  <span className="bg-white/90 text-indigo-900 font-bold px-4 py-2 rounded-full backdrop-blur-sm text-sm shadow-lg">🔍 ดูรูปใหญ่</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-20 bg-pv-card relative border-y border-pv-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12 reveal-hidden" ref={(el) => { revealRefs.current[0] = el; }}>
              <h2 className="text-2xl md:text-4xl font-black text-pv-title mb-3">ทักษะและความสามารถ</h2>
              <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((group, idx) => (
                <div key={idx} ref={(el) => { revealRefs.current[idx + 1] = el; }} className="reveal-hidden bg-pv-bg rounded-2xl p-6 border border-pv-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-indigo-400">
                  <h3 className="text-base md:text-lg font-black text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> {group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 bg-pv-card border border-pv-border rounded-lg text-xs md:text-sm font-bold text-pv-title transition-colors cursor-default">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 bg-pv-bg">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12 reveal-hidden" ref={(el) => { revealRefs.current[skills.length + 1] = el; }}>
              <h2 className="text-2xl md:text-4xl font-black text-pv-title mb-3">ประสบการณ์พัฒนาโปรเจกต์</h2>
              <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, idx) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  ref={(el) => { tiltCardsRef.current[idx] = el; }}
                  className="group bg-pv-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-pv-border transition-all duration-300 flex flex-col transform-gpu will-change-transform cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold text-white backdrop-blur-sm">คลิกดูรายละเอียด 🔍</div>
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-indigo-600 text-white px-2.5 py-1 rounded-md shadow-md">{p.year}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-black text-pv-title mb-2 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                    <p className="text-xs md:text-sm text-pv-text mb-4 flex-grow leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.techStack.map((t, i) => (
                        <span key={i} className="text-[10px] px-2.5 py-0.5 bg-pv-bg text-indigo-600 dark:text-indigo-400 font-bold rounded-md border border-pv-border">{t}</span>
                      ))}
                    </div>
                    <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                      ดูรายละเอียดโปรเจกต์ <span>➔</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="certificates" className="py-20 bg-pv-card border-t border-pv-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12 reveal-hidden" ref={(el) => { revealRefs.current[skills.length + 2] = el; }}>
              <h2 className="text-2xl md:text-4xl font-bold text-pv-title mb-3">เกียรติบัตรและการอบรม</h2>
              <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {certificates.map((cert, idx) => (
                <div key={idx} ref={(el) => { tiltCardsRef.current[projects.length + idx] = el; }} className="group bg-pv-bg rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-pv-border transition-all duration-300 transform-gpu will-change-transform cursor-pointer flex flex-col" onClick={() => setSelectedImage(cert.image)}>
                  <div className="relative h-44 md:h-52 overflow-hidden bg-slate-200">
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white">🔍 คลิกเพื่อขยายเกียรติบัตร</div>
                  </div>
                  <div className="p-5 flex flex-col items-center justify-center flex-grow text-center">
                    <h3 className="text-sm md:text-base font-black text-pv-title mb-1.5">{cert.title}</h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-3">{cert.issuer} • ปี {cert.date}</p>
                    <div className="mt-auto text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 transition-colors">
                      🔍 ดูรูปขยาย
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="pt-20 pb-10 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10 reveal-hidden" ref={(el) => { revealRefs.current[skills.length + 3] = el; }}>
            <h2 className="text-2xl md:text-4xl font-black mb-4">สนใจร่วมงานหรือสอบถามข้อมูลเพิ่มเติม</h2>
            <p className="text-slate-400 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">หากบริษัทของท่าน กำลังมองหานักศึกษาฝึกงานตำแหน่ง Software Developer มั่นใจได้เลยว่าผมพร้อมทุ่มเทลุยงานเต็มที่ครับ!</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
              <a href="mailto:paramat2020fam@gmail.com" onClick={addRipple} className="relative overflow-hidden flex items-center gap-2.5 px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 text-sm w-full sm:w-auto justify-center">📧 paramat2020fam@gmail.com</a>
              <a href="tel:0658764737" onClick={addRipple} className="relative overflow-hidden flex items-center gap-2.5 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-sm w-full sm:w-auto justify-center">📞 065-876-4737</a>
              <a href="https://github.com/ParamatPromwichai" target="_blank" rel="noopener noreferrer" onClick={addRipple} className="relative overflow-hidden flex items-center gap-2.5 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-sm w-full sm:w-auto justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
            <div className="border-t border-slate-900 pt-8 text-xs md:text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left"><p className="text-slate-400 font-bold">ปรมัตถ์ พรหมวิชัย (Paramat Promwichai)</p><p className="text-xs mt-1">110 ม.1 ต.ค้อเขียว อ.วาริชภูมิ จ.สกลนคร 47150</p></div>
              <p className="text-xs">© {new Date().getFullYear()} Fam DevFolio. All rights reserved.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
