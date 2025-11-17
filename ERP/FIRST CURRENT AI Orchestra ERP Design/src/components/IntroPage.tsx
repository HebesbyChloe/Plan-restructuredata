"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, TrendingDown, Clock, Database, BarChart3, FileText, Brain, Sparkles, Zap } from 'lucide-react';

interface IntroPageProps {
  onComplete: () => void;
}

export default function IntroPage({ onComplete }: IntroPageProps) {
  const [scene, setScene] = useState(1);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    // Auto-transition from scene 1 to 2
    if (scene === 1) {
      const timer = setTimeout(() => setScene(2), 3500);
      return () => clearTimeout(timer);
    }
    // Auto-transition from scene 2 to 3
    if (scene === 2) {
      const timer = setTimeout(() => {
        setScene(3);
        setShowCTA(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  // Floating data fragments for chaos scene
  const dataFragments = [
    { icon: AlertTriangle, text: "Inventory delayed", color: "text-red-400" },
    { icon: TrendingDown, text: "Ad performance down", color: "text-orange-400" },
    { icon: Clock, text: "Order pending", color: "text-yellow-400" },
    { icon: Database, text: "Sync failed", color: "text-red-400" },
    { icon: BarChart3, text: "Report missing", color: "text-orange-400" },
    { icon: FileText, text: "Invoice overdue", color: "text-yellow-400" },
  ];

  // Particle network nodes
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AnimatePresence mode="wait">
        {/* Scene 1: Chaos */}
        {scene === 1 && (
          <motion.div
            key="chaos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background noise effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-orange-950/20 to-yellow-950/10" />
            </div>

            {/* Floating data fragments */}
            {dataFragments.map((fragment, index) => (
              <motion.div
                key={index}
                initial={{ 
                  x: `${Math.random() * 100 - 50}vw`, 
                  y: `${Math.random() * 100 - 50}vh`,
                  opacity: 0,
                  rotate: Math.random() * 360,
                  scale: 0.5
                }}
                animate={{ 
                  x: [`${Math.random() * 100 - 50}vw`, `${Math.random() * 100 - 50}vw`, `${Math.random() * 100 - 50}vw`],
                  y: [`${Math.random() * 100 - 50}vh`, `${Math.random() * 100 - 50}vh`, `${Math.random() * 100 - 50}vh`],
                  opacity: [0, 1, 0.8, 0],
                  rotate: [0, 180, 360],
                  scale: [0.5, 1, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  times: [0, 0.3, 0.7, 1],
                  ease: "easeInOut"
                }}
                className="absolute"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 shadow-lg">
                  <fragment.icon className={`w-4 h-4 ${fragment.color}`} />
                  <span className="text-slate-300 text-sm whitespace-nowrap">{fragment.text}</span>
                </div>
              </motion.div>
            ))}

            {/* Center text */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl md:text-5xl text-slate-200 mb-6"
              >
                Every business owner's dashboard looks like this.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-xl md:text-2xl text-slate-400"
              >
                Too many tabs. Too little time.
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Scene 2: The Shift (AI Awakens) */}
        {scene === 2 && (
          <motion.div
            key="shift"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Gradient background shift */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-blue-950/30 to-amber-950/20"
            />

            {/* Particle network */}
            <svg className="absolute inset-0 w-full h-full">
              {particles.map((particle, i) => (
                <motion.g key={particle.id}>
                  {/* Connection lines */}
                  {particles.slice(i + 1, i + 3).map((target, j) => (
                    <motion.line
                      key={`${i}-${j}`}
                      initial={{ 
                        x1: `${particle.x}%`, 
                        y1: `${particle.y}%`,
                        x2: `${particle.x}%`, 
                        y2: `${particle.y}%`,
                        opacity: 0 
                      }}
                      animate={{ 
                        x1: `${particle.x}%`, 
                        y1: `${particle.y}%`,
                        x2: `${target.x}%`, 
                        y2: `${target.y}%`,
                        opacity: [0, 0.6, 0.4] 
                      }}
                      transition={{ 
                        delay: particle.delay + 0.5,
                        duration: 1.5,
                        times: [0, 0.5, 1]
                      }}
                      stroke="url(#gradient)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Particle nodes */}
                  <motion.circle
                    initial={{ 
                      cx: `${particle.x}%`, 
                      cy: `${particle.y}%`, 
                      r: 0,
                      opacity: 0 
                    }}
                    animate={{ 
                      cx: `${particle.x}%`, 
                      cy: `${particle.y}%`, 
                      r: [0, 6, 4],
                      opacity: [0, 1, 0.8] 
                    }}
                    transition={{ 
                      delay: particle.delay,
                      duration: 1.5,
                      times: [0, 0.5, 1]
                    }}
                    fill="#4B6BFB"
                    filter="url(#glow)"
                  />
                </motion.g>
              ))}
              
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4B6BFB" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#DAB785" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* Central AI core */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
              className="relative z-10"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4B6BFB] to-[#DAB785] blur-3xl"
              />
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#4B6BFB] to-[#DAB785] flex items-center justify-center">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-20 text-center px-6 max-w-3xl mt-64">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="text-3xl md:text-5xl text-slate-100 mb-6"
                >
                  What if your system didn't just track — it thought?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  className="text-xl md:text-2xl text-slate-300"
                >
                  Amo IQ reads your business, explains it, and guides your next move.
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scene 3: Clarity (CTA) */}
        {scene === 3 && (
          <motion.div
            key="clarity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Calm gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-amber-950/20" />

            {/* Subtle interface silhouettes in background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 overflow-hidden"
            >
              <div className="absolute top-1/4 left-1/4 w-64 h-40 rounded-xl bg-gradient-to-br from-[#4B6BFB]/20 to-transparent blur-2xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-48 rounded-xl bg-gradient-to-br from-[#DAB785]/20 to-transparent blur-2xl" />
            </motion.div>

            {/* Main content */}
            <div className="relative z-10 text-center px-6 max-w-4xl">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="mb-12 flex justify-center"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4B6BFB] to-[#DAB785] blur-2xl"
                  />
                  
                  {/* Logo container */}
                  <div className="relative px-12 py-8 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4B6BFB] to-[#DAB785] flex items-center justify-center shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h1 className="text-4xl md:text-5xl bg-gradient-to-r from-[#4B6BFB] to-[#DAB785] bg-clip-text text-transparent">
                          Amo IQ
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">AI-Powered ERP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-4xl md:text-6xl text-slate-100 mb-6"
              >
                Your Business. Simplified by Intelligence.
              </motion.h2>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-xl md:text-2xl text-slate-300 mb-12"
              >
                From data to decision — in one dashboard.
              </motion.p>

              {/* CTA Button */}
              {showCTA && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="flex flex-col items-center gap-6"
                >
                  <motion.button
                    onClick={onComplete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-12 py-5 rounded-2xl bg-gradient-to-r from-[#4B6BFB] to-[#6B8BFB] text-white text-xl shadow-2xl overflow-hidden"
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-[#4B6BFB] via-[#6B8BFB] to-[#4B6BFB] opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundSize: '200% 100%' }}
                    />
                    
                    {/* Pulse effect */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-2xl bg-white"
                    />
                    
                    <span className="relative flex items-center gap-3">
                      Launch Dashboard
                      <Zap className="w-6 h-6" />
                    </span>
                  </motion.button>

                  {/* Microcopy */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="text-slate-500 text-sm"
                  >
                    Built by entrepreneurs. Powered by AI.
                  </motion.p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
