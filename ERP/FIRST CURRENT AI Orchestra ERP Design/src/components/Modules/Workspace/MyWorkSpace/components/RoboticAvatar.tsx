import { motion } from "motion/react";

interface RoboticAvatarProps {
  color: string;
  size?: number;
}

export function RoboticAvatar({ color, size = 48 }: RoboticAvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Antenna with pulsing light */}
      <line x1="24" y1="18" x2="24" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <motion.circle
        cx="24"
        cy="10"
        r="3"
        fill={color}
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Main head - rounded rectangle */}
      <rect x="10" y="18" width="28" height="24" rx="8" fill={color} opacity="0.95" />
      
      {/* Cute big eyes */}
      <g>
        {/* Left eye */}
        <ellipse cx="18" cy="26" rx="4" ry="5" fill="white" opacity="0.95" />
        <motion.circle
          cx="18"
          cy="27"
          r="2.5"
          fill={color}
          animate={{ y: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="17.5" cy="26" r="1" fill="white" opacity="0.8" />
        
        {/* Right eye */}
        <ellipse cx="30" cy="26" rx="4" ry="5" fill="white" opacity="0.95" />
        <motion.circle
          cx="30"
          cy="27"
          r="2.5"
          fill={color}
          animate={{ y: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="29.5" cy="26" r="1" fill="white" opacity="0.8" />
      </g>
      
      {/* Cute smile */}
      <motion.path
        d="M 16 34 Q 24 38 32 34"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
        animate={{ d: ["M 16 34 Q 24 38 32 34", "M 16 34 Q 24 39 32 34", "M 16 34 Q 24 38 32 34"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Cheek blush */}
      <circle cx="13" cy="30" r="2.5" fill="white" opacity="0.2" />
      <circle cx="35" cy="30" r="2.5" fill="white" opacity="0.2" />
      
      {/* Cute ears/handles */}
      <motion.rect
        x="6"
        y="24"
        width="3"
        height="10"
        rx="1.5"
        fill={color}
        opacity="0.7"
        animate={{ height: [10, 12, 10] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.rect
        x="39"
        y="24"
        width="3"
        height="10"
        rx="1.5"
        fill={color}
        opacity="0.7"
        animate={{ height: [10, 12, 10] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* Small decorative dots */}
      <circle cx="24" cy="22" r="0.8" fill="white" opacity="0.4" />
      <circle cx="20" cy="22" r="0.6" fill="white" opacity="0.3" />
      <circle cx="28" cy="22" r="0.6" fill="white" opacity="0.3" />
    </svg>
  );
}
