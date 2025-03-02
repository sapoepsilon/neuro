/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Wes Anderson inspired color palette
        pastel: {
          pink: "var(--pastel-pink)",
          blue: "var(--pastel-blue)",
          yellow: "var(--pastel-yellow)",
          green: "var(--pastel-green)",
          red: "var(--pastel-red)",
          beige: "var(--pastel-beige)",
          lavender: "var(--pastel-lavender)",
          mint: "var(--pastel-mint)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        // Gradient backgrounds - RESERVED FOR SPECIAL OCCASIONS ONLY
        "primary-gradient":
          "linear-gradient(135deg, var(--ocean-blue) 0%, var(--emerald-green) 100%)",
        "secondary-gradient":
          "linear-gradient(135deg, var(--sky-blue) 0%, var(--lime-green) 100%)",
        "neutral-gradient": "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        // Wes Anderson inspired subtle backgrounds
        "pastel-gradient-pink-blue": 
          "linear-gradient(135deg, var(--pastel-pink) 0%, var(--pastel-blue) 100%)",
        "pastel-gradient-yellow-green": 
          "linear-gradient(135deg, var(--pastel-yellow) 0%, var(--pastel-green) 100%)",
        "pastel-gradient-beige-lavender": 
          "linear-gradient(135deg, var(--pastel-beige) 0%, var(--pastel-lavender) 100%)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "inherit",
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "underline",
              fontWeight: "500",
            },
            h1: {
              fontWeight: "700",
              letterSpacing: "-0.025em",
            },
            h2: {
              fontWeight: "700",
              letterSpacing: "-0.025em",
            },
            h3: {
              fontWeight: "600",
            },
            "h4,h5,h6": {
              fontWeight: "600",
            },
            code: {
              fontWeight: "400",
            },
            strong: {
              fontWeight: "600",
            },
            li: {
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "hsl(var(--primary) / 0.3)",
            },
          },
        },
      },
    },
  },
};
