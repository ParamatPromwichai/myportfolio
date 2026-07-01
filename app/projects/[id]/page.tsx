// app/projects/[id]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { projects } from "@/lib/data";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // แกะค่า params สำหรับ Next.js 15
  const resolvedParams = React.use(params);
  const project = projects.find((p) => p.id === resolvedParams.id);

  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">ไม่พบข้อมูลโปรเจกต์ 😢 <Link href="/" className="text-indigo-600 ml-2 hover:underline">กลับหน้าหลัก</Link></div>;
  }

  return (
    <div>
      <style>{`
        @keyframes swing { 0% { transform: rotate(0deg); } 15% { transform: rotate(12deg); } 30% { transform: rotate(-10deg); } 45% { transform: rotate(8deg); } 60% { transform: rotate(-6deg); } 75% { transform: rotate(3deg); } 100% { transform: rotate(0deg); } }
        @keyframes confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes float-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-swing { animation: swing 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
        :root { --color-pv-bg: #f8fafc; --color-pv-card: #ffffff; --color-pv-title: #0f172a; --color-pv-text: #475569; --color-pv-border: #e2e8f0; }
        .dark { --color-pv-bg: #0f172a; --color-pv-card: #1e293b; --color-pv-title: #f8fafc; --color-pv-text: #94a3b8; --color-pv-border: #334155; }
        .bg-pv-bg { background-color: var(--color-pv-bg); } .bg-pv-card { background-color: var(--color-pv-card); } .text-pv-title { color: var(--color-pv-title); } .text-pv-text { color: var(--color-pv-text); } .border-pv-border { border-color: var(--color-pv-border); }
      `}</style>

      <div className="min-h-screen bg-pv-bg text-pv-text transition-colors duration-500 overflow-x-hidden relative">
        <div className="fixed pointer-events-none z-[1000] hidden md:block" style={{ left: mousePos.x - 20, top: mousePos.y - 20, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", transition: "left 0.1s ease, top 0.1s ease", filter: "blur(4px)" }}></div>

        {/* --- Modal ซูมรูป --- */}
        {selectedImage && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
              <button className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 rounded-full p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              <img src={selectedImage} alt="Expanded" className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
          </div>
        )}

        <nav className="fixed top-0 w-full z-50 bg-pv-card/90 backdrop-blur-md shadow-sm py-4">
          <div className="max-w-4xl mx-auto px-4 flex justify-between items-center pr-24">
            <Link href="/" className="text-xl font-black text-pv-title tracking-tight hover:text-indigo-600 transition-colors">
              ← กลับหน้าหลัก
            </Link>
          </div>
        </nav>

        {/* --- ข้อมูลโปรเจกต์ --- */}
        <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 md:px-6">
          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl md:text-5xl font-black text-pv-title uppercase tracking-tight">{project.title}</h1>
            <span className="bg-indigo-600 text-white text-sm md:text-base px-4 py-1.5 rounded-lg font-bold shadow-md">{project.year}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {project.techStack.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-pv-card border border-pv-border text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-md shadow-sm">{t}</span>
            ))}
          </div>

          {(project as any).websiteUrl && (
            <div className="mb-10">
              <a href={(project as any).websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition-all shadow-lg shadow-indigo-500/30 text-lg group">
                <span>🌐</span> เข้าชมเว็บไซต์ 
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>
          )}

          <div className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-12 border-4 border-pv-card cursor-zoom-in group" onClick={() => setSelectedImage(project.image)}>
            <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white/90 text-indigo-900 font-bold px-4 py-2 rounded-full backdrop-blur-sm">🔍 ขยายภาพ</span>
            </div>
          </div>

          <div className="bg-pv-card p-8 md:p-10 rounded-3xl border border-pv-border shadow-sm mb-16">
            <h2 className="text-2xl font-black text-pv-title mb-6 flex items-center gap-3"><span className="text-indigo-500">📝</span> รายละเอียดการพัฒนา</h2>
            <p className="text-pv-text leading-loose text-base md:text-lg">{project.fullDescription}</p>
          </div>

          {(project as any).video && (
            <div className="mb-16">
              <h2 className="text-2xl font-black text-pv-title mb-6 flex items-center gap-3"><span className="text-indigo-500">🎥</span> วิดีโอสาธิต</h2>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-pv-card bg-black flex justify-center w-full">
                {String((project as any).video).includes('youtube.com') || String((project as any).video).includes('youtu.be') ? (
                  <iframe 
                    src={(() => {
                      const url = (project as any).video;
                      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                      const match = url.match(regExp);
                      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
                    })()}
                    title="YouTube video player" 
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full aspect-video"
                  ></iframe>
                ) : (
                  <video 
                    src={(project as any).video} 
                    controls 
                    className="w-full max-h-[600px] object-contain"
                    poster={project.image}
                  />
                )}
              </div>
            </div>
          )}

          {project.additionalImages && project.additionalImages.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-pv-title mb-6 flex items-center gap-3"><span className="text-indigo-500">📸</span> รูปภาพเพิ่มเติม</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.additionalImages.map((img, idx) => (
                  <div key={idx} className="relative h-64 rounded-2xl overflow-hidden bg-slate-200 cursor-zoom-in group shadow-md hover:shadow-xl transition-all" onClick={() => setSelectedImage(img)}>
                    <img src={img} alt={`screenshot ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-3xl drop-shadow-md">🔍</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}