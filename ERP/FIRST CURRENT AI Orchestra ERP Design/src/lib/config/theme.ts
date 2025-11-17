/**
 * Theme Configuration
 * Font, spacing, radius, and other design tokens
 */

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Font Families (defined in globals.css)
  fontFamily: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  
  // Font Sizes (using default browser sizes from globals.css)
  // Note: Do not use these directly in Tailwind classes
  // The globals.css already defines proper typography
  fontSize: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
  },
  
  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  // Component spacing
  component: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
    "3xl": "4rem",   // 64px
  },
  
  // Page spacing
  page: {
    padding: "1.5rem",        // 24px - Page padding
    sectionGap: "1.5rem",     // 24px - Gap between sections
    cardGap: "1rem",          // 16px - Gap between cards
  },
  
  // Layout spacing
  layout: {
    topNavHeight: "4rem",           // 64px
    sidebarWidth: "16rem",          // 256px
    sidebarCollapsedWidth: "4rem",  // 64px
  },
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  none: "0",
  sm: "0.375rem",    // 6px
  md: "0.5rem",      // 8px
  lg: "0.75rem",     // 12px
  xl: "1rem",        // 16px
  "2xl": "1.5rem",   // 24px
  full: "9999px",
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  glow: "0 0 20px rgba(75, 107, 251, 0.3)",
} as const;

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },
  
  timing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const;

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ============================================
// ANIMATION
// ============================================

export const animation = {
  // Framer Motion variants
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
} as const;
