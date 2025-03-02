/**
 * Color utility functions for handling modern color formats
 * Particularly focused on converting oklch colors to hex for PDF export compatibility
 */

// Wes Anderson-inspired color palette
export const WES_ANDERSON_PALETTE = {
  // Primary colors
  pastelBlue: "#A4CAED",
  pastelBlueDark: "#5A8BBF",
  pastelGreen: "#C3DBC5",
  pastelBeige: "#F2E8DC",
  
  // Secondary colors
  pastelPink: "#F5C4C4",
  pastelYellow: "#F5E1A4",
  pastelLavender: "#D8C4E9",
  pastelRed: "#F5A4A4",
  pastelMint: "#A4E9D4",
  
  // Button colors
  primary: "#3A6EA5",
  primaryHover: "#2A5A8F",
  
  // Text colors
  text: "#333333",
  textLight: "#666666",
  
  // Fallback colors
  fallbackBackground: "#FFFFFF",
  fallbackText: "#333333",
  fallbackBorder: "#DDDDDD"
};

/**
 * Applies a CSS override style to handle oklch colors
 * This function creates a style element that overrides all oklch colors with hex equivalents
 * @returns The created style element
 */
export function applyOklchOverrideStyles(): HTMLStyleElement {
  // Create a style element
  const styleEl = document.createElement('style');
  styleEl.id = 'oklch-override-styles';
  
  // Define CSS overrides for common oklch colors used in the app
  const cssOverrides = `
    /* Override oklch colors with hex equivalents */
    :root {
      --pastel-blue: ${WES_ANDERSON_PALETTE.pastelBlue} !important;
      --pastel-blue-dark: ${WES_ANDERSON_PALETTE.pastelBlueDark} !important;
      --pastel-green: ${WES_ANDERSON_PALETTE.pastelGreen} !important;
      --pastel-beige: ${WES_ANDERSON_PALETTE.pastelBeige} !important;
      --pastel-pink: ${WES_ANDERSON_PALETTE.pastelPink} !important;
      --pastel-yellow: ${WES_ANDERSON_PALETTE.pastelYellow} !important;
      --pastel-lavender: ${WES_ANDERSON_PALETTE.pastelLavender} !important;
      --pastel-red: ${WES_ANDERSON_PALETTE.pastelRed} !important;
      --pastel-mint: ${WES_ANDERSON_PALETTE.pastelMint} !important;
    }
    
    /* Override specific elements with oklch colors */
    .text-pastel-blue { color: ${WES_ANDERSON_PALETTE.pastelBlue} !important; }
    .text-pastel-blue-dark { color: ${WES_ANDERSON_PALETTE.pastelBlueDark} !important; }
    .text-pastel-green { color: ${WES_ANDERSON_PALETTE.pastelGreen} !important; }
    .text-pastel-red { color: ${WES_ANDERSON_PALETTE.pastelRed} !important; }
    .text-pastel-red-dark { color: ${WES_ANDERSON_PALETTE.pastelRed} !important; }
    
    .bg-pastel-blue { background-color: ${WES_ANDERSON_PALETTE.pastelBlue} !important; }
    .bg-pastel-blue-dark { background-color: ${WES_ANDERSON_PALETTE.pastelBlueDark} !important; }
    .bg-pastel-green { background-color: ${WES_ANDERSON_PALETTE.pastelGreen} !important; }
    .bg-pastel-beige { background-color: ${WES_ANDERSON_PALETTE.pastelBeige} !important; }
    
    /* Override button colors */
    .btn-high-contrast { 
      background-color: ${WES_ANDERSON_PALETTE.primary} !important;
      color: white !important;
    }
    
    /* Force all SVG elements to use explicit colors */
    svg text { fill: #333333 !important; }
    svg path { stroke: #333333 !important; }
    
    /* Force all gradients to use solid colors */
    [style*="linear-gradient"], [style*="radial-gradient"] {
      background: ${WES_ANDERSON_PALETTE.fallbackBackground} !important;
    }
  `;
  
  styleEl.textContent = cssOverrides;
  return styleEl;
}

/**
 * Maps an oklch color to the closest color in the Wes Anderson palette
 * This is used for PDF export where modern color formats are not supported
 * 
 * @param colorValue - The oklch color string to convert
 * @returns A hex color string from the Wes Anderson palette
 */
export function mapOklchToWesAndersonPalette(colorValue: string): string {
  if (!colorValue || typeof colorValue !== 'string') {
    return WES_ANDERSON_PALETTE.fallbackBackground;
  }
  
  // If it's already a hex color, return it
  if (colorValue.startsWith('#')) {
    return colorValue;
  }
  
  // If it's rgb or rgba, return it as is
  if (colorValue.startsWith('rgb')) {
    return colorValue;
  }
  
  // Check if it's an oklch color
  if (colorValue.includes('oklch')) {
    try {
      // Extract the oklch values using regex
      // Handle both comma and space separated values
      // oklch(0.95 0.02 270 / 0.5) or oklch(0.95, 0.02, 270, 0.5)
      const oklchRegex = /oklch\(\s*([0-9.]+)[\s,]+([0-9.]+)[\s,]+([0-9.]+)(?:[\s,/]+([0-9.]+))?\s*\)/i;
      const match = colorValue.match(oklchRegex);
      
      if (match) {
        // Extract lightness, chroma, and hue
        const lightness = parseFloat(match[1]);
        const chroma = parseFloat(match[2]);
        const hue = parseFloat(match[3]);
        // Alpha is optional
        const alpha = match[4] ? parseFloat(match[4]) : 1;
        
        // Map to Wes Anderson palette based on hue and lightness
        // This is a simplified mapping - in a real implementation you might want
        // to use a more sophisticated color distance algorithm
        
        // Very light colors (high lightness)
        if (lightness > 0.9) {
          if (alpha < 0.5) return 'rgba(255, 255, 255, ' + alpha + ')';
          return WES_ANDERSON_PALETTE.fallbackBackground;
        }
        
        // Very dark colors (low lightness)
        if (lightness < 0.2) {
          if (alpha < 0.5) return 'rgba(51, 51, 51, ' + alpha + ')';
          return WES_ANDERSON_PALETTE.text;
        }
        
        // Map based on hue
        // Blues (around 240-280)
        if ((hue >= 220 && hue <= 280) || (hue >= -140 && hue <= -80)) {
          return lightness > 0.6 ? WES_ANDERSON_PALETTE.pastelBlue : WES_ANDERSON_PALETTE.pastelBlueDark;
        }
        
        // Greens (around 120-160)
        if ((hue >= 100 && hue <= 180) || (hue >= -260 && hue <= -180)) {
          return WES_ANDERSON_PALETTE.pastelGreen;
        }
        
        // Reds/Pinks (around 0-30 or 330-360)
        if ((hue >= 0 && hue <= 30) || (hue >= 330 && hue <= 360) || 
            (hue >= -30 && hue <= 0) || (hue >= -30 && hue <= -0)) {
          return chroma > 0.1 ? WES_ANDERSON_PALETTE.pastelRed : WES_ANDERSON_PALETTE.pastelPink;
        }
        
        // Yellows (around 60-90)
        if ((hue >= 40 && hue <= 100) || (hue >= -320 && hue <= -260)) {
          return WES_ANDERSON_PALETTE.pastelYellow;
        }
        
        // Purples/Lavenders (around 270-310)
        if ((hue >= 260 && hue <= 320) || (hue >= -100 && hue <= -40)) {
          return WES_ANDERSON_PALETTE.pastelLavender;
        }
        
        // Mints/Teals (around 160-200)
        if ((hue >= 150 && hue <= 210) || (hue >= -210 && hue <= -150)) {
          return WES_ANDERSON_PALETTE.pastelMint;
        }
        
        // Default fallback based on lightness
        if (lightness > 0.7) return WES_ANDERSON_PALETTE.pastelBeige;
        if (lightness > 0.4) return WES_ANDERSON_PALETTE.pastelBlueDark;
        return WES_ANDERSON_PALETTE.primary;
      }
    } catch (error) {
      console.error("Error parsing oklch color:", error);
    }
  }
  
  // Fallback for gradients and other complex values
  if (colorValue.includes('gradient')) {
    return WES_ANDERSON_PALETTE.fallbackBackground;
  }
  
  // Default fallback
  return WES_ANDERSON_PALETTE.fallbackBackground;
}

/**
 * Pre-processes the document for PDF export by replacing all oklch colors with hex equivalents
 * This should be called before html2canvas is used
 * @param rootElement - The root element to process (defaults to document.body)
 */
export const preprocessDocumentForPdfExport = async (rootElement: HTMLElement = document.body): Promise<void> => {
  // 1. Apply global CSS overrides
  const styleEl = applyOklchOverrideStyles();
  document.head.appendChild(styleEl);
  
  // 2. Process all elements with inline styles
  processElementsForPdfExport(rootElement);
  
  // 3. Apply a more aggressive approach to handle computed styles
  forceHexColorsOnComputedStyles(rootElement);
  
  // 4. Specifically process Recharts elements
  const rechartsStyleEl = processRechartsForPdfExport(rootElement);
  
  // 5. Add a global stylesheet to force hex colors on any elements with oklch
  const globalStylesheet = document.createElement('style');
  globalStylesheet.id = 'pdf-export-global-override';
  globalStylesheet.textContent = `
    [style*="oklch"] {
      color: ${WES_ANDERSON_PALETTE.text} !important;
      background-color: transparent !important;
      border-color: ${WES_ANDERSON_PALETTE.fallbackBorder} !important;
    }
    
    /* Force all SVG elements to use explicit colors */
    svg * { 
      fill: ${WES_ANDERSON_PALETTE.pastelBlue} !important;
      stroke: ${WES_ANDERSON_PALETTE.text} !important;
    }
    
    /* Force specific Recharts elements */
    .recharts-sector { fill: ${WES_ANDERSON_PALETTE.pastelBlue} !important; }
    .recharts-curve { stroke: ${WES_ANDERSON_PALETTE.pastelBlueDark} !important; }
    .recharts-bar-rectangle { fill: ${WES_ANDERSON_PALETTE.pastelBlue} !important; }
    
    /* Force all gradients to use solid colors */
    [style*="linear-gradient"], [style*="radial-gradient"] {
      background: ${WES_ANDERSON_PALETTE.fallbackBackground} !important;
    }
  `;
  document.head.appendChild(globalStylesheet);
  
  // 6. Force a small delay to ensure styles are applied
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500); // Increased delay for better style application
  });
}

/**
 * Processes all elements in a container to replace oklch colors with hex equivalents
 * This is useful for PDF export where modern color formats are not supported
 * 
 * @param container - The HTML element to process
 */
export function processElementsForPdfExport(container: HTMLElement): void {
  // Create a map of class names to their hex color equivalents
  const classColorMap: Record<string, string> = {
    'text-pastel-blue': WES_ANDERSON_PALETTE.pastelBlue,
    'text-pastel-blue-dark': WES_ANDERSON_PALETTE.pastelBlueDark,
    'text-pastel-green': WES_ANDERSON_PALETTE.pastelGreen,
    'text-pastel-red': WES_ANDERSON_PALETTE.pastelRed,
    'bg-pastel-blue': WES_ANDERSON_PALETTE.pastelBlue,
    'bg-pastel-blue-dark': WES_ANDERSON_PALETTE.pastelBlueDark,
    'bg-pastel-green': WES_ANDERSON_PALETTE.pastelGreen,
    'bg-pastel-beige': WES_ANDERSON_PALETTE.pastelBeige,
    'btn-high-contrast': WES_ANDERSON_PALETTE.primary,
  };

  // Process all elements
  const allElements = container.querySelectorAll('*');
  allElements.forEach(el => {
    const element = el as HTMLElement;
    
    // 1. Process inline styles
    const computedStyle = window.getComputedStyle(element);
    
    // List of CSS properties that might contain color values
    const colorProperties = [
      'color', 'background-color', 'border-color', 
      'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
      'outline-color', 'text-decoration-color', 'fill', 'stroke'
    ];
    
    colorProperties.forEach(prop => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value.includes('oklch')) {
        element.style.setProperty(prop, mapOklchToWesAndersonPalette(value), 'important');
      }
    });
    
    // 2. Handle background image (for gradients)
    const backgroundImage = computedStyle.backgroundImage;
    if (backgroundImage && backgroundImage.includes('oklch')) {
      element.style.backgroundImage = 'none';
      element.style.backgroundColor = WES_ANDERSON_PALETTE.fallbackBackground;
    }
    
    // 3. Apply explicit colors based on class names
    if (element.className) {
      const classNames = element.className.split(' ');
      classNames.forEach(className => {
        if (classColorMap[className]) {
          // If this is a text color class
          if (className.startsWith('text-')) {
            element.style.color = classColorMap[className];
          }
          // If this is a background color class
          else if (className.startsWith('bg-')) {
            element.style.backgroundColor = classColorMap[className];
          }
          // Special case for buttons
          else if (className === 'btn-high-contrast') {
            element.style.backgroundColor = classColorMap[className];
            element.style.color = '#FFFFFF';
          }
        }
      });
    }
    
    // 4. Special handling for SVG elements
    if (element.tagName.toLowerCase() === 'svg') {
      // Fix SVG text elements
      const textElements = element.querySelectorAll('text');
      textElements.forEach(textEl => {
        (textEl as SVGTextElement).style.fill = '#333333';
        textEl.setAttribute('fill', '#333333');
      });
      
      // Fix SVG path elements
      const pathElements = element.querySelectorAll('path');
      pathElements.forEach(pathEl => {
        const fill = pathEl.getAttribute('fill');
        if (fill && (fill.includes('url') || fill.includes('oklch'))) {
          pathEl.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
        }
      });
    }
  });
}

/**
 * Force hex colors on all elements using computed styles
 * This is a more aggressive approach to handle oklch colors
 * @param container - The container to process
 */
export function forceHexColorsOnComputedStyles(container: HTMLElement): void {
  const allElements = container.querySelectorAll('*');
  
  allElements.forEach(el => {
    const element = el as HTMLElement;
    if (!element.style) return;
    
    try {
      // Get computed styles
      const computedStyle = window.getComputedStyle(element);
      
      // Properties that might contain color values
      const colorProperties = [
        'color', 'background-color', 'border-color', 
        'border-top-color', 'border-right-color', 
        'border-bottom-color', 'border-left-color',
        'outline-color', 'box-shadow', 'text-shadow'
      ];
      
      // Apply explicit hex colors for each property
      colorProperties.forEach(prop => {
        try {
          const value = computedStyle.getPropertyValue(prop);
          
          // Skip if the property is not set or doesn't contain oklch
          if (!value || !value.includes('oklch')) return;
          
          // Convert to a safe hex color
          let safeColor;
          
          // Choose appropriate fallback based on property
          if (prop === 'color') {
            safeColor = WES_ANDERSON_PALETTE.text;
          } else if (prop === 'background-color') {
            safeColor = WES_ANDERSON_PALETTE.fallbackBackground;
          } else if (prop.includes('border') || prop === 'outline-color') {
            safeColor = WES_ANDERSON_PALETTE.fallbackBorder;
          } else {
            safeColor = WES_ANDERSON_PALETTE.fallbackText;
          }
          
          // Apply the safe color as an inline style with !important
          element.style.setProperty(prop, safeColor, 'important');
        } catch (err) {
          // Ignore errors for individual properties
          console.log(`Error processing property ${prop}:`, err);
        }
      });
      
      // Special handling for background property which might contain gradients
      const backgroundValue = computedStyle.getPropertyValue('background');
      if (backgroundValue && backgroundValue.includes('oklch')) {
        element.style.setProperty('background', WES_ANDERSON_PALETTE.fallbackBackground, 'important');
      }
      
      // Special handling for SVG elements
      if (element.tagName.toLowerCase() === 'svg' || 
          element.tagName.toLowerCase() === 'path' || 
          element.tagName.toLowerCase() === 'rect' || 
          element.tagName.toLowerCase() === 'circle' || 
          element.tagName.toLowerCase() === 'text') {
        
        // Remove any fill or stroke that uses oklch
        const fill = element.getAttribute('fill');
        if (fill && fill.includes('oklch')) {
          element.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
        }
        
        const stroke = element.getAttribute('stroke');
        if (stroke && stroke.includes('oklch')) {
          element.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
        }
      }
      
      // Special handling for Recharts elements
      if (element.classList.contains('recharts-sector')) {
        element.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
        element.setAttribute('stroke', WES_ANDERSON_PALETTE.pastelBlueDark);
      } else if (element.classList.contains('recharts-rectangle') || 
                element.classList.contains('recharts-bar-rectangle')) {
        element.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
        element.setAttribute('stroke', WES_ANDERSON_PALETTE.pastelBlueDark);
      } else if (element.classList.contains('recharts-curve')) {
        if (element.classList.contains('recharts-area-area')) {
          element.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
          element.setAttribute('fill-opacity', '0.6');
        } else {
          element.setAttribute('stroke', WES_ANDERSON_PALETTE.pastelBlueDark);
        }
      } else if (element.classList.contains('recharts-text')) {
        element.setAttribute('fill', WES_ANDERSON_PALETTE.text);
        element.setAttribute('font-family', 'Inter, system-ui, sans-serif');
      } else if (element.classList.contains('recharts-cartesian-axis-line') || 
                element.classList.contains('recharts-cartesian-axis-tick-line')) {
        element.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
      }
      
      // Handle any element with class containing "recharts" to ensure we catch everything
      if (element.className && element.className.includes && element.className.includes('recharts')) {
        // For any recharts element with a fill attribute
        if (element.hasAttribute('fill')) {
          const fillValue = element.getAttribute('fill');
          if (fillValue && (fillValue.includes('oklch') || fillValue.includes('url(#'))) {
            element.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
          }
        }
        
        // For any recharts element with a stroke attribute
        if (element.hasAttribute('stroke')) {
          const strokeValue = element.getAttribute('stroke');
          if (strokeValue && strokeValue.includes('oklch')) {
            element.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
          }
        }
      }
    } catch (err) {
      console.log('Error processing element:', err);
    }
  });
}

/**
 * Process Recharts elements specifically for PDF export
 * This function targets Recharts-specific elements and applies explicit hex colors
 */
export const processRechartsForPdfExport = (container: HTMLElement): void => {
  // Process all Recharts components
  const rechartsComponents = container.querySelectorAll('.recharts-wrapper');
  rechartsComponents.forEach(component => {
    // Process sectors (pie chart slices)
    const sectors = component.querySelectorAll('.recharts-sector');
    sectors.forEach((sector, index) => {
      // Apply colors from our palette in a rotating fashion
      const colorKeys = Object.keys(WES_ANDERSON_PALETTE).filter(key => 
        key.startsWith('pastel') || key.startsWith('vintage')
      );
      const colorKey = colorKeys[index % colorKeys.length] as keyof typeof WES_ANDERSON_PALETTE;
      const color = WES_ANDERSON_PALETTE[colorKey] || WES_ANDERSON_PALETTE.pastelBlue;
      
      sector.setAttribute('fill', color);
      sector.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
    });
    
    // Process bars (bar chart rectangles)
    const bars = component.querySelectorAll('.recharts-bar-rectangle');
    bars.forEach((bar, index) => {
      const colorKeys = Object.keys(WES_ANDERSON_PALETTE).filter(key => 
        key.startsWith('pastel') || key.startsWith('vintage')
      );
      const colorKey = colorKeys[index % colorKeys.length] as keyof typeof WES_ANDERSON_PALETTE;
      const color = WES_ANDERSON_PALETTE[colorKey] || WES_ANDERSON_PALETTE.pastelBlue;
      
      bar.setAttribute('fill', color);
      bar.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
    });
    
    // Process area (area chart)
    const areas = component.querySelectorAll('.recharts-area-area');
    areas.forEach((area, index) => {
      const colorKeys = Object.keys(WES_ANDERSON_PALETTE).filter(key => 
        key.startsWith('pastel') || key.startsWith('vintage')
      );
      const colorKey = colorKeys[index % colorKeys.length] as keyof typeof WES_ANDERSON_PALETTE;
      const color = WES_ANDERSON_PALETTE[colorKey] || WES_ANDERSON_PALETTE.pastelBlue;
      
      area.setAttribute('fill', color);
      area.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
      area.setAttribute('fill-opacity', '0.6'); // Add some transparency
    });
    
    // Process lines (line chart)
    const lines = component.querySelectorAll('.recharts-line-curve');
    lines.forEach((line, index) => {
      const colorKeys = Object.keys(WES_ANDERSON_PALETTE).filter(key => 
        key.startsWith('pastel') || key.startsWith('vintage')
      );
      const colorKey = colorKeys[index % colorKeys.length] as keyof typeof WES_ANDERSON_PALETTE;
      const color = WES_ANDERSON_PALETTE[colorKey] || WES_ANDERSON_PALETTE.pastelBlue;
      
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '2');
    });
    
    // Process dots (scatter plot, line chart points)
    const dots = component.querySelectorAll('.recharts-dot');
    dots.forEach((dot, index) => {
      const colorKeys = Object.keys(WES_ANDERSON_PALETTE).filter(key => 
        key.startsWith('pastel') || key.startsWith('vintage')
      );
      const colorKey = colorKeys[index % colorKeys.length] as keyof typeof WES_ANDERSON_PALETTE;
      const color = WES_ANDERSON_PALETTE[colorKey] || WES_ANDERSON_PALETTE.pastelBlue;
      
      dot.setAttribute('fill', color);
      dot.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
    });
    
    // Process text elements
    const texts = component.querySelectorAll('.recharts-text, .recharts-cartesian-axis-tick-value');
    texts.forEach(text => {
      text.setAttribute('fill', WES_ANDERSON_PALETTE.text);
      text.setAttribute('font-family', 'Inter, system-ui, sans-serif');
    });
    
    // Process legends
    const legends = component.querySelectorAll('.recharts-legend-item-text');
    legends.forEach(legend => {
      legend.setAttribute('fill', WES_ANDERSON_PALETTE.text);
      legend.setAttribute('font-family', 'Inter, system-ui, sans-serif');
    });
    
    // Process gradients
    const defs = component.querySelectorAll('defs');
    defs.forEach(def => {
      const gradients = def.querySelectorAll('linearGradient, radialGradient');
      gradients.forEach(gradient => {
        // Replace gradient stops with solid colors from our palette
        const stops = gradient.querySelectorAll('stop');
        stops.forEach((stop, index) => {
          const colorKeys = Object.keys(WES_ANDERSON_PALETTE).filter(key => 
            key.startsWith('pastel') || key.startsWith('vintage')
          );
          const colorKey = colorKeys[index % colorKeys.length] as keyof typeof WES_ANDERSON_PALETTE;
          const color = WES_ANDERSON_PALETTE[colorKey] || WES_ANDERSON_PALETTE.pastelBlue;
          
          stop.setAttribute('stop-color', color);
        });
      });
    });
  });
};

/**
 * Process gradient definitions in SVG elements for PDF export
 * Replaces gradient definitions with solid colors from our palette
 */
export const processGradientsForPdfExport = (container: HTMLElement): void => {
  // Find all SVG elements
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    // Find all gradient definitions
    const defs = svg.querySelectorAll('defs');
    defs.forEach(def => {
      const gradients = def.querySelectorAll('linearGradient, radialGradient');
      gradients.forEach(gradient => {
        // Get the gradient ID to find elements using this gradient
        const gradientId = gradient.id;
        if (!gradientId) return;
        
        // Find a suitable replacement color
        const replacementColor = WES_ANDERSON_PALETTE.pastelBlue;
        
        // Replace gradient stops with a single color
        const stops = gradient.querySelectorAll('stop');
        stops.forEach(stop => {
          stop.setAttribute('stop-color', replacementColor);
        });
        
        // Find all elements using this gradient and replace with solid color
        const elementsUsingGradient = svg.querySelectorAll(`[fill="url(#${gradientId})"], [stroke="url(#${gradientId})"]`);
        elementsUsingGradient.forEach(element => {
          // Check if it's using the gradient as fill or stroke
          if (element.getAttribute('fill')?.includes(`url(#${gradientId})`)) {
            element.setAttribute('fill', replacementColor);
          }
          if (element.getAttribute('stroke')?.includes(`url(#${gradientId})`)) {
            element.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
          }
        });
      });
    });
  });
};

/**
 * Enhanced preprocessDocumentForPdfExport function that includes gradient processing
 */
export const enhancedPreprocessDocumentForPdfExport = async (container: HTMLElement): Promise<void> => {
  // First, force hex colors on all computed styles
  forceHexColorsOnComputedStyles(container);
  
  // Process gradients in SVG elements
  processGradientsForPdfExport(container);
  
  // Process Recharts elements specifically
  processRechartsForPdfExport(container);
  
  // Add a delay to ensure all processing is complete
  await new Promise(resolve => setTimeout(resolve, 100));
};
