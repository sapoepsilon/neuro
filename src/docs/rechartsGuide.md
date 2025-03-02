# Recharts Guide for Neuro

This guide provides a quick reference for implementing charts in the Neuro project using Recharts, following our Wes Anderson-inspired design system.

## Table of Contents

1. [Installation](#installation)
2. [Common Components](#common-components)
3. [Chart Types](#chart-types)
   - [PieChart](#piechart)
   - [AreaChart](#areachart)
   - [BarChart](#barchart)
4. [Styling Guidelines](#styling-guidelines)
5. [Market Analysis Implementation](#market-analysis-implementation)

## Installation

```bash
npm install recharts
```

## Common Components

These components can be used across different chart types:

- **ResponsiveContainer**: Wrapper that makes charts responsive
- **Legend**: Displays a legend for the chart
- **Tooltip**: Shows data when hovering over chart elements
- **Cell**: Used for customizing individual segments in charts

## Chart Types

### PieChart

PieChart is ideal for showing proportional data as slices of a circle.

#### Basic Example

```jsx
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';

// Sample data format
const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

// Wes Anderson inspired colors
const COLORS = ['#A4CAED', '#C3DBC5', '#F8D0C8', '#F5E3A4', '#D8C8E3'];

function MyPieChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

#### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| data | Array | Array of objects with name and value properties |
| dataKey | String | The key of a group of data which should be unique in an array of data |
| nameKey | String | The key of name for each data |
| cx | String/Number | The x-coordinate of center | 
| cy | String/Number | The y-coordinate of center |
| innerRadius | Number | The inner radius of pie |
| outerRadius | Number | The outer radius of pie |
| paddingAngle | Number | The angle between two adjacent sectors |

#### Donut Chart Variation

```jsx
<Pie
  data={data}
  cx="50%"
  cy="50%"
  innerRadius={60}
  outerRadius={80}
  fill="#8884d8"
  dataKey="value"
/>
```

### AreaChart

AreaChart is useful for showing trends over time with filled areas under the line.

#### Basic Example

```jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data format
const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

function MyAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A4CAED" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#A4CAED" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#5A8BBF" 
          fillOpacity={1} 
          fill="url(#colorValue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

#### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| data | Array | Array of data objects |
| width | Number | The width of chart container |
| height | Number | The height of chart container |
| margin | Object | The margin around the chart |
| stackOffset | String | Type of offset: 'expand', 'none', 'wiggle', 'silhouette' |
| baseValue | Number/String | The base value of area: number, 'dataMin', 'dataMax', 'auto' |

### BarChart

BarChart displays data as horizontal or vertical bars.

#### Basic Example

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data format
const data = [
  { name: 'Page A', uv: 4000, pv: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398 },
  { name: 'Page C', uv: 2000, pv: 9800 },
  { name: 'Page D', uv: 2780, pv: 3908 },
  { name: 'Page E', uv: 1890, pv: 4800 },
];

function MyBarChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#A4CAED" />
        <Bar dataKey="uv" fill="#C3DBC5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

#### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| data | Array | Array of data objects |
| layout | String | 'horizontal' or 'vertical' |
| barSize | Number | The width or height of each bar |
| maxBarSize | Number | The maximum width/height of the bar |
| barGap | Number/String | Gap between bars in the same category |
| barCategoryGap | Number/String | Gap between bar categories |
| stackOffset | String | Type of stacking: 'expand', 'none', 'wiggle', 'silhouette', 'sign' |

## Styling Guidelines

When implementing charts in the Neuro project, follow these guidelines to maintain consistency with our Wes Anderson-inspired design system:

1. **Colors**: Use our pastel color palette defined in globals.css
   - Primary colors: `var(--pastel-blue)`, `var(--pastel-green)`, etc.
   - For gradients, use lighter opacity variations

2. **Typography**: 
   - Use consistent font sizes with the rest of the application
   - Ensure good contrast for readability

3. **Container Styling**:
   - Wrap charts in `<GlassCard>` components when appropriate
   - Add proper padding around charts (typically 1.5-2rem)

4. **Responsiveness**:
   - Always use `<ResponsiveContainer>` to ensure charts adapt to different screen sizes
   - Set percentage width and fixed height for predictable rendering

5. **Accessibility**:
   - Ensure color combinations have sufficient contrast
   - Include descriptive tooltips and legends
   - Consider adding aria labels for screen readers

## Market Analysis Implementation

The Market Analysis feature uses Recharts to visualize data from the market analysis API. The implementation includes:

### Chart Types

1. **Pie Chart**: Shows market share distribution among competitors or market segments
2. **Area Chart**: Displays market growth trends over time
3. **Bar Chart**: Compares key metrics across competitors or market segments

### Data Structure

The chart data follows this structure:

```typescript
interface ChartData {
  pieChart?: Array<{ name: string; value: number }>;
  areaChart?: Array<{ name: string; value: number }>;
  barChart?: Array<{ name: string; value: number; secondaryValue?: number }>;
}
```

### Implementation Details

- **Component**: `MarketAnalysisCharts` in `/src/components/market-analysis-charts.tsx`
- **Integration**: Used within the `MarketAnalysisForm` component
- **Data Source**: Chart data is generated by the market analysis API and included in the response

### Color Palette

The charts use two color palettes:

```javascript
// Pastel colors for primary elements
const PASTEL_COLORS = [
  "#A4CAED", // Pastel Blue
  "#C3DBC5", // Pastel Green
  "#F2E8DC", // Pastel Beige
  "#F5C0C0", // Pastel Pink
  "#F5E1A4", // Pastel Yellow
  "#D8C4E9", // Pastel Lavender
  "#F5A4A4", // Pastel Red
  "#A4E9D4"  // Pastel Mint
];

// Darker versions for better contrast
const DARK_PASTEL_COLORS = [
  "#5A8BBF", // Pastel Blue Dark
  "#7EA98F", // Pastel Green Dark
  "#C5B8A5", // Pastel Beige Dark
  // ...etc
];
```

### Example Usage

To add the charts to a component:

```jsx
import { MarketAnalysisCharts } from "@/components/market-analysis-charts";

// In your component
{analysisData.chartData && (
  <MarketAnalysisCharts chartData={analysisData.chartData} />
)}
