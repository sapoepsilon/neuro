# Chart Visualization Guide

This document outlines the chart visualization system in the Neuro project, including recent improvements and best practices.

## Overview

The market analysis feature includes data visualization using Recharts, with three main chart types:

1. **Pie Chart**: Shows market share distribution
2. **Area Chart**: Displays market growth trends over time
3. **Bar Chart**: Compares key metrics across competitors

## Implementation Components

- `/src/components/market-analysis-charts.tsx`: Main chart component
- `/src/lib/market-analysis/chart-data.ts`: Chart data generation and processing
- `/src/lib/market-analysis/schema.ts`: JSON schema for structured output
- `/src/lib/market-analysis/types.ts`: Type definitions for chart data

## Recent Improvements

### 1. Enhanced Tooltip Handling

- Added custom tooltip component with improved formatting
- Fixed "undefined" values in tooltips with fallback display
- Added percentage display for pie charts
- Improved tooltip styling with consistent colors
- **Added appropriate units to values** (%, $, users, etc.)

### 2. Better Data Sanitization

- Added `sanitizeChartData` function to validate and clean chart data
- Prevents undefined or invalid values from causing rendering issues
- Provides sensible defaults for missing data
- Ensures consistent data structure
- **Adds formatted values with appropriate units**

### 3. Improved Schema Definition

- Enhanced JSON schema with better descriptions
- Added support for percentage values in pie charts
- Improved validation for chart data generation
- Added customization options for min/max items

### 4. Source Information

- Added source attribution to charts
- Included data context information
- Improved transparency about data generation

### 5. Visual Enhancements

- Improved chart container styling with better shadows
- Enhanced color handling for consistent palette
- Better legend formatting
- Improved PDF export rendering

## Value Formatting

The chart visualization now includes intelligent value formatting based on context:

1. **Currency Values**: 
   - Revenue, sales, and market size values are displayed with dollar signs ($)
   - Numbers are formatted with thousands separators (e.g., $1,000,000)
   - Used in area charts and relevant bar chart metrics

2. **Percentage Values**:
   - Market share, growth rates, and other percentage-based metrics
   - Displayed with percentage symbol (%)
   - Used in pie charts and relevant bar chart metrics

3. **User Counts**:
   - Customer numbers, user bases, audience sizes
   - Displayed with "users" suffix
   - Used in relevant bar chart metrics

4. **Default Formatting**:
   - All other numeric values use thousands separators
   - No specific unit applied

This context-aware formatting improves readability and provides better context for the data being displayed.

## Design Principles

The chart visualization follows these design principles:

1. **Consistent with Wes Anderson Palette**: Uses the project's established color scheme
2. **Accessible**: Ensures good contrast and readability
3. **Responsive**: Adapts to different screen sizes and PDF export
4. **Graceful Degradation**: Handles missing or invalid data gracefully
5. **Clear Data Communication**: Prioritizes clear data presentation

## Usage Example

```tsx
import { MarketAnalysisCharts } from '@/components/market-analysis-charts';

// Example usage
<MarketAnalysisCharts 
  chartData={marketAnalysisResult.chartData} 
  isPdf={false} 
/>
```

## Best Practices

1. Always validate chart data before rendering
2. Provide fallback values for missing data
3. Use the custom tooltip for consistent styling
4. Include source information for context
5. Test charts in both web and PDF modes

## Future Improvements

- Add more chart types (line, scatter, etc.)
- Implement animation options
- Add more customization options
- Create theme-based styling
- Add interactive filtering capabilities
