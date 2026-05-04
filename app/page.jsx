"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AgenticWorkflowDeck() {
  const [activeIndex, setActiveIndex] = useState(1);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");
            if (index) setActiveIndex(Number(index));
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="fixed bottom-8 left-8 z-50 font-mono text-sm tracking-widest flex items-center gap-2 text-white">
        <span className="font-bold text-lg">0{activeIndex}</span>
        <span className="opacity-30">/</span>
        <span className="opacity-50">05</span>
      </div>

      <section ref={(el) => { sectionRefs.current[0] = el; }} data-index="1" className="relative z-10 h-screen w-full snap-center flex flex-col justify-center items-center px-6 text-center">
        <div className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-widest uppercase text-gray-300 mb-8">
          Superteam Earn | Agentic Workflow
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">Audd Flow Web</h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">A premium, production-ready Solana payments frontend built entirely through an agentic development pipeline.</p>
        <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce opacity-70">
          <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll to Explore</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      <section ref={(el) => { sectionRefs.current[1] = el; }} data-index="2" className="relative z-10 h-screen w-full snap-center flex flex-col justify-center items-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 tracking-tight">Part I: Project Vision</h2>
        <div className="flex flex-col gap-6 w-full max-w-3xl">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">What is it?</h3>
            <p className="text-gray-400">A no-code Solana dashboard designed to streamline payment flows effortlessly.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Who is it for?</h3>
            <p className="text-gray-400">Creators and builders wanting a seamless, jargon-free Web3 payment experience.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Why Solana?</h3>
            <p className="text-gray-400">Sub-second finality and near-zero fees for consumer crypto applications.</p>
          </div>
        </div>
      </section>

      <section ref={(el) => { sectionRefs.current[2] = el; }} data-index="3" className="relative z-10 h-screen w-full snap-center flex flex-col justify-center items-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 tracking-tight">Part II: Poof for Seeker</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-3">Generated Logic</h3>
            <p className="text-sm text-gray-400">Complex on-chain interactions generated autonomously. Zero Rust required.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-3">Live Balance</h3>
            <p className="text-sm text-gray-400">Real-time RPC integration to display accurate wallet balances instantly.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-3">Solana Pay</h3>
            <p className="text-sm text-gray-400">Full adherence to Solana Pay specs for flawless mobile scanning.</p>
          </div>
        </div>
      </section>

      <section ref={(el) => { sectionRefs.current[3] = el; }} data-index="4" className="relative z-10 h-screen w-full snap-center flex flex-col justify-center items-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 tracking-tight">Part III: Replit Agent</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12 text-center">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <div className="text-4xl font-extrabold text-white mb-2">1,600+</div>
            <div className="text-xs text-gray-400 uppercase font-semibold">AI Lines</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <div className="text-4xl font-extrabold text-white mb-2">0</div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Manual Lines</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <div className="text-4xl font-extrabold text-white mb-2">100%</div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Agentic</div>
          </div>
        </div>
        <p className="text-gray-400 max-w-2xl text-center leading-relaxed bg-white/5 p-6 rounded-xl border border-white/5">
          The Replit Agent autonomously resolved conflicts and implemented precise UI fixes including custom dark-mode QR rendering.
        </p>
      </section>

      <section ref={(el) => { sectionRefs.current[4] = el; }} data-index="5" className="relative z-10 h-screen w-full snap-center flex flex-col justify-center items-center px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Execution Complete</h2>
        <p className="text-xl text-gray-400 mb-12">Superteam Submission</p>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 w-full max-w-md mb-12">
          <ul className="space-y-4 text-left">
            <li className="flex items-center gap-4 text-white"><div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">✓</div> Devnet connection</li>
            <li className="flex items-center gap-4 text-white"><div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">✓</div> Scannable QR Code</li>
            <li className="flex items-center gap-4 text-white"><div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">✓</div> Standard Solana packages</li>
          </ul>
        </div>
        <button className="px-8 py-4 bg-white text-black font-bold rounded-full transition-transform hover:scale-105">View Live Application</button>
      </section>
    </main>
  );
}
