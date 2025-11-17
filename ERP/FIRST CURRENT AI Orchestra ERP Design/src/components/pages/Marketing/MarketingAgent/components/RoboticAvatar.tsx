import { motion } from "motion/react";

interface RoboticAvatarProps {
  color: string;
  size?: number;
}

export function RoboticAvatar({ color, size = 64 }: RoboticAvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Robot head */}
      <rect x="12" y="16" width="24" height="20" rx="4" fill={color} opacity="0.9" />
      
      {/* Antenna */}
      <line x1="24" y1="16" x2="24" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="9" r="2" fill={color} />
      <motion.circle
        cx="24"
        cy="9"
        r="3"
        fill={color}
        opacity="0.3"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Eyes - glowing rectangles */}
      <rect x="17" y="22" width="5" height="4" rx="1" fill="white" opacity="0.9" />
      <rect x="26" y="22" width="5" height="4" rx="1" fill="white" opacity="0.9" />
      
      {/* Eye glow */}
      <rect x="18" y="23" width="3" height="2" rx="0.5" fill={color} opacity="0.4" />
      <rect x="27" y="23" width="3" height="2" rx="0.5" fill={color} opacity="0.4" />
      
      {/* Mouth - digital smile */}
      <path
        d="M 19 30 L 21 32 L 23 30 L 25 32 L 27 30 L 29 32"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      
      {/* Side panels */}
      <rect x="10" y="20" width="2" height="8" rx="1" fill={color} opacity="0.7" />
      <rect x="36" y="20" width="2" height="8" rx="1" fill={color} opacity="0.7" />
      
      {/* Detail lines */}
      <line x1="14" y1="18" x2="34" y2="18" stroke="white" strokeWidth="0.5" opacity="0.3" />
      <line x1="14" y1="34" x2="34" y2="34" stroke="white" strokeWidth="0.5" opacity="0.3" />
      
      {/* Corner details */}
      <circle cx="15" cy="19" r="1" fill="white" opacity="0.5" />
      <circle cx="33" cy="19" r="1" fill="white" opacity="0.5" />
    </svg>
  );
}
