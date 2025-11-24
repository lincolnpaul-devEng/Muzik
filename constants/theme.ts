// constants/theme.ts

// --- Color Palette ---
// These colors are chosen to provide a consistent dark theme experience.
// They are directly inspired by common dark mode design principles.
export const Colors = {
  // Primary Backgrounds
  background: '#121212', // Very dark gray, common for app backgrounds
  card: '#1E1E1E',       // Slightly lighter than background for cards/components
  
  // Text Colors
  textPrimary: '#FFFFFF', // Pure white for main text
  textSecondary: '#B3B3B3', // Lighter gray for secondary text/subtitles
  textMuted: '#888888',     // Even lighter gray for less prominent text

  // Accent Colors - picked to be vibrant and complement dark backgrounds
  primary: '#FF6B6B',     // A vibrant red/pink for primary actions/highlights
  secondary: '#4CAF50',   // A clean green for success or alternative actions
  accent: '#1DA1F2',      // A bright blue for links/interactive elements

  // Status Colors
  success: '#4CAF50', // Green
  warning: '#FFC107', // Amber
  error: '#DC3545',   // Red
  info: '#17A2B8',    // Cyan

  // Grayscale for borders, dividers, etc.
  border: '#333333',
  divider: '#2D2D2D',
};

// --- Typography Scale ---
// Defines a consistent scale for text sizes and styles.
export const Typography = {
  // Font Families (can be extended with custom fonts)
  fontFamily: 'System', // Default system font for cross-platform consistency

  // Font Sizes
  size: {
    h1: 28,
    h2: 24,
    h3: 20,
    large: 18,
    medium: 16,
    small: 14,
    xSmall: 12,
  },

  // Font Weights
  weight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line Heights (relative to font size for better readability)
  lineHeight: {
    h1: 36,
    h2: 32,
    h3: 28,
    large: 26,
    medium: 24,
    small: 20,
    xSmall: 18,
  },
};

// --- Spacing Constants ---
// Consistent padding and margin values.
export const Spacing = {
  none: 0,
  xSmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 32,
  xxLarge: 48,
};

// --- Component-Specific Styles (Examples) ---
// These can be extended with full style objects or functions
// that return style objects based on props.
export const Components = {
  Button: {
    primary: {
      backgroundColor: Colors.primary,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondary: {
      backgroundColor: Colors.secondary,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: Colors.textPrimary,
      fontSize: Typography.size.medium,
      fontWeight: Typography.weight.semibold,
    },
  },
  Input: {
    default: {
      height: 40,
      borderColor: Colors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: Spacing.medium,
      color: Colors.textPrimary,
      backgroundColor: Colors.card,
    },
    placeholder: Colors.textMuted,
  },
  Card: {
    default: {
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: Spacing.medium,
      shadowColor: Colors.background, // Subtle shadow for elevation
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

// --- Theme Object for easy access ---
// This combines all constants into a single, accessible theme object.
export const theme = {
  Colors,
  Typography,
  Spacing,
  Components,
};

// Export default for easier import in some contexts
export default theme;
