# Neuro AI Project Manager - Style Guide

## Brand Identity

### Name

**Neuro** - An AI-powered project validation and task breakdown tool

### Tagline

"From idea to action, intelligently broken down."

## Color System

### Text Colors

We use a minimalist white-based text system for maximum readability:

- Primary Text: `text-white` (100% opacity)
- Secondary Text: `text-white/90` (90% opacity)
- Tertiary Text: `text-white/70` (70% opacity)
- Placeholder Text: `text-white/60` (60% opacity)

### UI Colors

- Background Gradient: `var(--gradient-wes)`
- Glass Effect: `bg-white/60` with `backdrop-blur-[10px]`
- Button Primary: `bg-primary`
- Button Hover: `bg-primary-hover`

## Button System

### Primary Action Button

- Background: Primary Button (`#3A6EA5`)
- Text: White
- Border Radius: `rounded-xl` (0.75rem)
- Padding: `px-6 py-4`
- Shadow: `shadow-md`
- Hover:
  - Background: `#2A5A8F`
  - Shadow: `shadow-lg`
- Noise Effect: 20% opacity overlay

### Action Buttons with Icons

- Default State:
  - Icon: Lucide React icons in outline style
  - Color: Current color (inherits from parent)
  - Size: 20px (default)
- Hover State:
  - Icon: Switches to filled variant
  - Smooth transition: `transition-all duration-200`
- Implementation Example:

  ```tsx
  import { Mail, MailCheck } from "lucide-react";

  // In your component
  const [isHovered, setIsHovered] = useState(false);

  <button
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {isHovered ? <MailCheck /> : <Mail />}
  </button>;
  ```

## Effects

### Noise Texture

- Applied to buttons and special elements
- SVG-based noise for better performance
- Opacity: 20%
- Blend Mode: overlay
- Implementation:
  ```css
  .noise-texture::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,...");
    opacity: 0.2;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
  ```

## Typography

### Primary Font

**Inter** - A clean, modern sans-serif that is highly readable on screens

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
```

### Font Weights

- **Regular (400)** - Main body text
- **Medium (500)** - Subheadings and emphasized text
- **Semi-Bold (600)** - Section headings
- **Bold (700)** - Main headings and CTAs

### Type Scale

- **Display** `3.5rem/56px` - Hero headlines
- **H1** `2.5rem/40px` - Main headlines
- **H2** `2rem/32px` - Section headlines
- **H3** `1.5rem/24px` - Subsection headlines
- **H4** `1.25rem/20px` - Card headlines
- **Body** `1rem/16px` - Regular text
- **Small** `0.875rem/14px` - Secondary information
- **Tiny** `0.75rem/12px` - Captions and meta text

## Best Practices

1. **Icon Consistency**

   - Always use Lucide React icons
   - Maintain consistent sizing within button groups
   - Use outline variants by default, filled on hover

2. **Button Hierarchy**

   - Primary actions: Full Primary Button color
   - Secondary actions: Outline or ghost style
   - Use icon-only buttons for compact UI areas

3. **Accessibility**
   - Maintain minimum touch target size of 44x44px
   - Ensure sufficient color contrast (WCAG AA)
   - Add hover/focus states for all interactive elements

## Component Styling Guidelines

### Cards & Containers

#### Standard Card

- **Background**: `rgba(255, 255, 255, 0.6)`
- **Backdrop Filter**: `blur(10px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.18)`
- **Border Radius**: `rounded-2xl`
- **Box Shadow**: `0 8px 32px rgba(0, 0, 0, 0.1)`
- **Padding**: `1.5rem 2rem` (24px 32px)
- **Margin Between Cards**: `2rem` (32px)

#### Content Sections

- **Spacing Between Sections**: `2.5rem` (40px)
- **Heading Bottom Margin**: `1rem` (16px)
- **Paragraph Bottom Margin**: `1.25rem` (20px)

## Animation

### Transitions

- Default: `transition-all duration-300`
- Quick: `transition-all duration-200`
- Slow: `transition-all duration-500`

### Hover Effects

- Scale: `hover:scale-105`
- Shadow: `hover:shadow-xl`
- Opacity: `hover:opacity-90`

## Special Effects

### Noise Texture

Applied to buttons and selected UI elements for a vintage film-like aesthetic:

```css
.noise-texture {
  @apply relative overflow-hidden;
}
```

### Gradient Background

The signature Wes Anderson-inspired gradient:

```css
--gradient-wes: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%);
```
