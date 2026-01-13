/** @type {import('tailwindcss').Config} */

/**
 * CashWise Tailwind Configuration
 *
 * Color Philosophy:
 * - Dominant colors that command attention
 * - Sharp accents for visual hierarchy
 * - Bold contrasts, not timid distributions
 */

module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ========================================
        // Brand Primary - Blue (Light) / Teal (Dark)
        // ========================================
        primary: {
          50: "#E6F3FA",
          100: "#CCE7F5",
          200: "#99CFEB",
          300: "#66B7E1",
          400: "#339FD7",
          500: "#007CBE", // Default primary
          600: "#006398",
          700: "#004A72",
          800: "#00324C",
          900: "#001926",
          DEFAULT: "#007CBE",
        },

        // Teal - Dark mode primary, success accents
        teal: {
          50: "#E6FAF9",
          100: "#CCF5F3",
          200: "#99EBE8",
          300: "#66E1DC",
          400: "#33D7D1",
          500: "#02C3BD", // Dark mode primary
          600: "#029C97",
          700: "#017571",
          800: "#014E4C",
          900: "#002726",
          DEFAULT: "#02C3BD",
        },

        // ========================================
        // Brand Accent - Gold (Light) / Purple (Dark)
        // ========================================
        accent: {
          50: "#FFFBEB",
          100: "#FFF7AE",
          200: "#FFED70",
          300: "#FFE033",
          400: "#FFD000", // Light mode accent
          500: "#E6B800",
          600: "#CC9F00",
          700: "#997700",
          800: "#665000",
          900: "#332800",
          DEFAULT: "#FFD000",
        },

        purple: {
          50: "#F0E8F7",
          100: "#E1D1EF",
          200: "#C3A3DF",
          300: "#A575CF",
          400: "#8747BF",
          500: "#4E148C", // Dark mode accent
          600: "#3E1070",
          700: "#2F0C54",
          800: "#1F0838",
          900: "#10041C",
          DEFAULT: "#4E148C",
        },

        // ========================================
        // Semantic Colors
        // ========================================
        success: {
          light: "#10B981",
          DEFAULT: "#10B981",
          dark: "#34D399",
          muted: "#D1FAE5",
        },
        warning: {
          light: "#F59E0B",
          DEFAULT: "#F59E0B",
          dark: "#FBBF24",
          muted: "#FEF3C7",
        },
        error: {
          light: "#EF4444",
          DEFAULT: "#EF4444",
          dark: "#F87171",
          muted: "#FEE2E2",
        },
        info: {
          light: "#3B82F6",
          DEFAULT: "#3B82F6",
          dark: "#60A5FA",
          muted: "#DBEAFE",
        },

        // Financial specific
        income: "#10B981",
        expense: "#EF4444",

        // ========================================
        // Neutral Scale (warm undertone)
        // ========================================
        neutral: {
          0: "#FFFFFF",
          50: "#FAFAFA",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
          950: "#0C0A09",
        },

        // ========================================
        // Surface Colors
        // ========================================
        surface: {
          light: "#FFFFFF",
          DEFAULT: "#FFFFFF",
          dark: "#1C1917",
          elevated: {
            light: "#FFFFFF",
            dark: "#292524",
          },
        },

        background: {
          light: "#F5F5F4",
          DEFAULT: "#F5F5F4",
          dark: "#000000",
        },

        // ========================================
        // Legacy aliases (for backwards compat)
        // ========================================
        "cw-blue": "#007CBE",
        "cw-yellow": "#FFF7AE",
        "cw-teal": "#02C3BD",
        "cw-purple": "#4E148C",
      },

      // ========================================
      // Typography
      // ========================================
      fontFamily: {
        // Display font - Fraunces (distinctive serif)
        "display-light": ["Fraunces_300Light"],
        display: ["Fraunces_400Regular"],
        "display-medium": ["Fraunces_500Medium"],
        "display-semibold": ["Fraunces_600SemiBold"],
        "display-bold": ["Fraunces_700Bold"],
        "display-black": ["Fraunces_900Black"],
        // Body font - Plus Jakarta Sans (refined sans-serif)
        "body-extralight": ["PlusJakartaSans_200ExtraLight"],
        "body-light": ["PlusJakartaSans_300Light"],
        body: ["PlusJakartaSans_400Regular"],
        "body-medium": ["PlusJakartaSans_500Medium"],
        "body-semibold": ["PlusJakartaSans_600SemiBold"],
        "body-bold": ["PlusJakartaSans_700Bold"],
        "body-extrabold": ["PlusJakartaSans_800ExtraBold"],
      },

      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
      },

      letterSpacing: {
        tighter: "-0.5px",
        tight: "-0.25px",
        wide: "0.5px",
        wider: "1px",
        widest: "2px",
      },

      // ========================================
      // Spacing & Sizing
      // ========================================
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ========================================
      // Shadows (for cards, elevated surfaces)
      // ========================================
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.12)",
        elevated: "0 8px 24px rgba(0, 0, 0, 0.16)",
      },

      // ========================================
      // Opacity values for overlays
      // ========================================
      opacity: {
        8: "0.08",
        12: "0.12",
        15: "0.15",
      },
    },
  },
  plugins: [require("nativewind/gradients")],
};
