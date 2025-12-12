// Animation utilities for consistent micro-interactions
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
};

// Shadow utilities for modern depth
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  none: 'shadow-none',
};

// Border radius utilities for modern design
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
  full: 'rounded-full',
};

// Spacing utilities
export const spacing = {
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
  '2xl': 'p-16',
};

// Modern gradient utilities
export const gradients = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
  accent: 'bg-gradient-to-r from-accent-500 to-accent-600',
  success: 'bg-gradient-to-r from-success-500 to-success-600',
  warning: 'bg-gradient-to-r from-warning-500 to-warning-600',
  error: 'bg-gradient-to-r from-error-500 to-error-600',
  hero: 'bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700',
  heroOverlay: 'bg-gradient-to-r from-black/40 to-transparent',
};

// Modern blur utilities
export const blur = {
  none: 'backdrop-blur-none',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

// Interactive states
export const interactions = {
  hover: {
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
    scale: 'hover:scale-105 transition-transform duration-200',
    glow: 'hover:shadow-xl hover:shadow-primary-500/20 transition-shadow duration-200',
  },
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    glow: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50',
  },
  active: {
    press: 'active:scale-95 transition-transform duration-75',
  },
};

// Glass morphism utilities
export const glass = {
  light: 'bg-white/10 backdrop-blur-md border border-white/20',
  medium: 'bg-white/20 backdrop-blur-lg border border-white/30',
  dark: 'bg-black/10 backdrop-blur-md border border-black/20',
};

// Modern button variants helper
export const getButtonVariant = (variant: string) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };
  return variants[variant as keyof typeof variants] || variants.primary;
};

// Modern card variants helper
export const getCardVariant = (variant: string) => {
  const variants = {
    default: 'card',
    elevated: 'card-elevated',
    outline: 'card border-2',
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

// Color palette for consistent usage
export const colors = {
  primary: {
    50: 'primary-50',
    100: 'primary-100',
    500: 'primary-500',
    600: 'primary-600',
    700: 'primary-700',
    900: 'primary-900',
  },
  accent: {
    300: 'accent-300',
    500: 'accent-500',
    600: 'accent-600',
  },
  success: {
    500: 'success-500',
    600: 'success-600',
  },
  warning: {
    500: 'warning-500',
    600: 'warning-600',
  },
  error: {
    500: 'error-500',
    600: 'error-600',
  },
  slate: {
    50: 'slate-50',
    100: 'slate-100',
    600: 'slate-600',
    800: 'slate-800',
    900: 'slate-900',
  },
};
