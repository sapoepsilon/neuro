# Neuro AI Project Manager - Style Guide

## Brand Identity

### Name

**Neuro** - An AI-powered project validation and task breakdown tool

### Tagline

"From idea to action, intelligently broken down."

## Color Palette

### Primary Colors (Wes Anderson Inspired)

- **Pastel Blue** `#A4CAED` - Primary brand color, used for main actions and highlights
- **Pastel Blue Dark** `#5A8BBF` - Darker shade for better contrast on interactive elements
- **Pastel Green** `#C3DBC5` - Secondary color, used for accents and success states
- **Pastel Beige** `#F2E8DC` - Background color, provides a clean canvas

### Secondary Colors (Wes Anderson Inspired)

- **Pastel Pink** `#F8D0C8` - Used for highlights and accent elements
- **Pastel Yellow** `#F5E3A4` - Used for highlights and positive indicators
- **Pastel Lavender** `#D8C8E3` - Used for inactive elements and dividers
- **Pastel Red** `#E8B4B8` - Used for warnings and alerts
- **Pastel Red Dark** `#C7868B` - Darker red for better contrast on error messages
- **Pastel Mint** `#C2E6D6` - Used for success states

### High Contrast Button Colors

- **Button Primary** `#3A6EA5` - Used for primary action buttons
- **Button Primary Hover** `#2A5A8F` - Hover state for primary buttons
- **Button Danger** `#B54B4B` - Used for destructive action buttons
- **Button Danger Hover** `#973E3E` - Hover state for destructive buttons

### Special Occasion Gradient Combinations (Reserved for Key Features Only)

- **Primary Gradient**: `linear-gradient(135deg, #2563EB 0%, #10B981 100%)`
- **Secondary Gradient**: `linear-gradient(135deg, #0EA5E9 0%, #84CC16 100%)`
- **Neutral Gradient**: `linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)`

### Wes Anderson Inspired Gradient Combinations (Preferred for Regular Use)

- **Pastel Pink-Blue**: `linear-gradient(135deg, #F8D0C8 0%, #A4CAED 100%)`
- **Pastel Yellow-Green**: `linear-gradient(135deg, #F5E3A4 0%, #C3DBC5 100%)`
- **Pastel Beige-Lavender**: `linear-gradient(135deg, #F2E8DC 0%, #D8C8E3 100%)`

### Functional Colors

- **Success Green** `#C3DBC5` - Used for confirmations and completed tasks
- **Warning Yellow** `#F5E3A4` - Used for alerts and warnings
- **Error Red** `#E8B4B8` - Used for errors and critical actions

## Glassmorphism Specifications

### Glass Card

- **Background**: `rgba(255, 255, 255, 0.6)`
- **Backdrop Filter**: `blur(10px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.18)`
- **Border Radius**: `16px`
- **Box Shadow**: `0 8px 32px rgba(0, 0, 0, 0.1)`

### Glass Input

- **Background**: `rgba(255, 255, 255, 0.4)`
- **Backdrop Filter**: `blur(5px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.18)`
- **Focus Border**: `rgba(37, 99, 235, 0.5)`

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

- **Heading 1** `2rem/32px` - Main page headings
- **Heading 2** `1.5rem/24px` - Section headings
- **Heading 3** `1.25rem/20px` - Subsection headings
- **Body** `1rem/16px` - Regular text
- **Small** `0.875rem/14px` - Secondary information
- **Tiny** `0.75rem/12px` - Captions and meta text

## Component Styling Guidelines

### Buttons

#### Primary Action Buttons
- **Background**: `var(--btn-primary)` (#3A6EA5)
- **Text Color**: White
- **Font Weight**: 600 (Semi-Bold)
- **Padding**: `1rem 1.5rem` (16px 24px)
- **Border Radius**: `0.5rem` (8px)
- **Hover State**: `var(--btn-primary-hover)` (#2A5A8F)
- **Shadow**: `0 2px 4px rgba(0, 0, 0, 0.1)`
- **Noise Texture**: Applied with 20% opacity and overlay blend mode

#### Secondary/Outline Buttons
- **Border**: `1px solid var(--btn-primary)`
- **Text Color**: `var(--btn-primary)`
- **Background**: Transparent
- **Hover Background**: `var(--btn-primary)` at 5% opacity
- **Font Weight**: 500 (Medium)

#### Destructive Buttons
- **Background**: `var(--btn-danger)` (#B54B4B)
- **Text Color**: White
- **Hover State**: `var(--btn-danger-hover)` (#973E3E)

### Form Inputs

#### Text Inputs & Textareas
- **Background**: `rgba(255, 255, 255, 0.4)`
- **Backdrop Filter**: `blur(5px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.18)`
- **Border Radius**: `0.75rem` (12px)
- **Padding**: `0.75rem 1rem` (12px 16px)
- **Focus Border**: `var(--pastel-blue-dark)` at 50% opacity
- **Font Size**: `1rem` (16px)
- **Min Height** (Textarea): `120px`

### Cards & Containers

#### Standard Card
- **Background**: `rgba(255, 255, 255, 0.6)`
- **Backdrop Filter**: `blur(10px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.18)`
- **Border Radius**: `1rem` (16px)
- **Box Shadow**: `0 8px 32px rgba(0, 0, 0, 0.1)`
- **Padding**: `1.5rem 2rem` (24px 32px)
- **Margin Between Cards**: `2rem` (32px)

#### Content Sections
- **Spacing Between Sections**: `2.5rem` (40px)
- **Heading Bottom Margin**: `1rem` (16px)
- **Paragraph Bottom Margin**: `1.25rem` (20px)

### Noise Texture

A subtle noise texture should be applied to buttons and selected UI elements to create a vintage film-like aesthetic that complements the Wes Anderson-inspired color palette.

- **Opacity**: 20%
- **Blend Mode**: overlay
- **Base Frequency**: 0.85
- **Implementation**: Using SVG filter with feTurbulence

```css
.noise-texture::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  z-index: 1;
}
```

### Notifications and Feedback

### Toast Notifications

Neuro uses Sonner for toast notifications to provide user feedback for actions and events.

- **Implementation**: `import { toast } from "sonner";`
- **Usage**:
  - Success: `toast.success("Operation completed successfully");`
  - Error: `toast.error("An error occurred");`
  - Info: `toast.info("Here's some information");`
- **Styling**: Toast notifications follow the Neuro color palette with appropriate colors for different notification types.

### PDF Export

Neuro includes functionality to export content to PDF with consistent styling.

- **Implementation**: `import { exportToPdf } from "@/lib/pdf-export";`
- **Usage**: `exportToPdf("element-id", "filename");`
- **Styling**:
  - Background: Pastel Beige (`#F2E8DC`)
  - Headings: Pastel Blue Dark (`#5A8BBF`)
  - Links: Button Primary (`#3A6EA5`)
  - Borders: Pastel Blue (`#A4CAED`)
  - Font: Inter
- **Features**:
  - Neuro branding header with logo and date
  - Formatted content with consistent styling
  - Footer with branding
  - Multi-page support for long content

## Implementation Examples

### PDF Export Button

```tsx
<Button
  onClick={async () => {
    try {
      await exportToPdf("content-id", "export-filename");
      toast.success("Exported to PDF successfully");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  }}
  variant="outline"
  size="sm"
  className="noise-texture bg-pastel-blue/8 border-pastel-blue/20 hover:bg-pastel-blue/10 flex items-center gap-2"
>
  <FileDown className="h-4 w-4" />
  <span>Export PDF</span>
</Button>
```

## Component Guidelines

### Buttons

#### Primary Button

- Uses primary color background
- Text: White `#FFFFFF`
- Hover: Slightly darker color
- Border Radius: `0.75rem`
- Padding: `0.625rem 1rem`
- Glass effect on hover

```tsx
// components/ui/button.tsx - Modifications
// Add this variant to the Button component from shadcn/ui

variants: {
  // existing variants...
  gradient: {
    DEFAULT: "inline-flex items-center justify-center rounded-xl bg-primary-gradient text-sm font-medium text-primary-foreground shadow transition-colors hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  },
},
```

### Button Styling Guidelines

#### Standard Buttons

All buttons should use the `Button` component from `@/components/ui/button.tsx` with appropriate variants and sizes. Avoid using custom button styles directly in components.

#### Primary Action Buttons

For primary actions (like form submissions):
- Use the `variant="default"` or `variant="secondary"` prop
- Apply appropriate size using the `size` prop
- Do not override with custom background gradients in the className
- Use the built-in loading state pattern

```tsx
// Correct implementation
<Button 
  type="submit" 
  variant="default"
  size="lg"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Processing...</span>
    </>
  ) : (
    <>
      <IconComponent />
      <span>Action Label</span>
    </>
  )}
</Button>
```

#### Button Variants

- `default`: Primary actions (blue background)
- `secondary`: Secondary actions (green background)
- `destructive`: Dangerous actions (red background)
- `outline`: Subtle actions with border
- `ghost`: Very subtle actions without background
- `link`: Text-only actions that look like links
- `gradient`: Gradient background buttons (requires additional bg-*-gradient class)

#### Button Sizes

- `default`: Standard size for most buttons
- `sm`: Smaller buttons for compact UIs
- `lg`: Larger buttons for primary CTAs
- `icon`: Square buttons for icon-only buttons

### Gradient Buttons (Special Occasions Only)

Gradient buttons should be used sparingly and only for special occasions or key features that need to stand out. For regular buttons, use the standard variants with Wes Anderson-inspired colors.

```tsx
// For special occasion primary gradient buttons
<Button 
  variant="gradient"
  className="bg-primary-gradient"
>
  Special Feature Button
</Button>

// For regular buttons, use standard variants with Wes Anderson colors
<Button 
  variant="default"
>
  Regular Button
</Button>

// For subtle gradient buttons, use Wes Anderson inspired gradients
<Button 
  variant="gradient"
  className="bg-pastel-gradient-pink-blue"
>
  Subtle Gradient Button
</Button>
```

### Cards

#### Glass Card

- Background: `rgba(255, 255, 255, 0.6)`
- Backdrop Filter: `blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.18)`
- Border Radius: `1rem`
- Box Shadow: `0 8px 32px rgba(0, 0, 0, 0.1)`
- Padding: `1.5rem`

#### Gradient Card

- Background: Linear gradient (Primary or Secondary)
- Border Radius: `1rem`
- Box Shadow: `0 8px 32px rgba(0, 0, 0, 0.1)`
- Padding: `1.5rem`
- Text Color: White

### Input Fields

- Background: `rgba(255, 255, 255, 0.4)`
- Backdrop Filter: `blur(5px)`
- Border: `1px solid rgba(255, 255, 255, 0.18)`
- Border Radius: `0.75rem`
- Focus: Primary color border and ring
- Padding: `0.75rem 1rem`

### Task Items

- Glass card style
- Border-left: 3px solid (color coded by priority)
- Border Radius: `0.75rem`
- Padding: `1rem`
- Margin: `0.5rem 0`
- Hover: Slightly more opaque

## Layout Guidelines

### Spacing System

- **4px** - Minimal spacing, used for related elements
- **8px** - Default spacing between related elements
- **16px** - Standard spacing between distinct elements
- **24px** - Spacing between sections
- **32px** - Large spacing for major sections

### Responsive Breakpoints

- **Mobile**: 0-639px
- **Tablet**: 640px-1023px
- **Desktop**: 1024px+

### Background Treatments

- Use subtle gradient backgrounds for page sections
- Consider a light pattern overlay for added texture
- Apply a very subtle noise texture for depth

## UI Elements

### Icons

- Use Lucide React icons for consistency
- Icon size should be proportional to the text they accompany
- Default icon size: `20px`
- Consider gradient or glass effect on important icons

### Loading States

- Use subtle shimmer effects for loading states
- Gradient loading spinners
- Loading duration: 750ms

### Animations

- Transition duration: 150ms
- Easing function: `cubic-bezier(0.4, 0, 0.2, 1)`
- Subtle hover animations for interactive elements
- Consider gentle floating animations for cards

## Next.js Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── projects/
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   ├── market-analysis/
│   │   │   ├── mvp-definition/
│   │   │   └── tasks/
│   │   └── new/
│   └── survey/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── glass-card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── project-input.tsx
│   ├── market-analysis.tsx
│   ├── task-breakdown.tsx
│   └── ...
├── lib/
│   ├── utils.ts
│   ├── supabase.ts
│   ├── search-api.ts
│   └── task-helpers.ts
└── ...
```

## Example Component Implementation

### GlassMorphic Project Input

```tsx
// components/project-input.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";

export function ProjectInput({
  onSubmit,
}: {
  onSubmit: (input: string) => void;
}) {
  const [projectIdea, setProjectIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectIdea.trim()) {
      onSubmit(projectIdea);
    }
  };

  return (
    <GlassCard className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 gradient-text">
        What do you want to build?
      </h2>
      <p className="text-gray-600 mb-6">
        Describe your project idea and we'll analyze the market and create a
        breakdown of tasks.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            className="glass-input pr-12 min-h-[120px] py-4"
            placeholder="I want to build a meal planning app that suggests recipes based on dietary restrictions..."
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
            as="textarea"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="gradient" className="px-6">
            <SendIcon className="mr-2 h-4 w-4" /> Analyze
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
```

## Accessibility Guidelines

- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Focus states must be clearly visible
- All interactive elements must be accessible via keyboard
- Use aria attributes appropriately
- Ensure all form elements have associated labels
- Provide useful alt text for all images
- Test glassmorphism effects for sufficient contrast
