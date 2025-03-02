"use client";

import { useState, useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { WES_ANDERSON_PALETTE } from "@/lib/color-utils";

// Define chart data types
type PieChartData = Array<{ name: string; value: number }>;
type AreaChartData = Array<{ name: string; value: number }>;
type BarChartData = Array<{
  name: string;
  value: number;
  secondaryValue?: number;
}>;

interface ChartData {
  pieChart?: PieChartData;
  areaChart?: AreaChartData;
  barChart?: BarChartData;
}

interface MarketAnalysisChartsProps {
  chartData?: ChartData;
}

// Use only hex colors for better PDF compatibility
// Pastel colors for chart elements
const PASTEL_COLORS = [
  "#A4CAED", // Pastel Blue
  "#C3DBC5", // Pastel Green
  "#F5E1A4", // Pastel Yellow
  "#D8C4E9", // Pastel Lavender
  "#F5A4A4", // Pastel Red
  "#A4E9D4", // Pastel Mint
];

// Darker versions of the colors for better contrast
const DARK_PASTEL_COLORS = [
  "#5A8BBF", // Pastel Blue Dark
  "#7AB07E", // Pastel Green Dark
  "#C5B36A", // Pastel Yellow Dark
  "#A58BBF", // Pastel Lavender Dark
  "#C56A6A", // Pastel Red Dark
  "#6AC5A4", // Pastel Mint Dark
];

const CHART_COLORS = [
  WES_ANDERSON_PALETTE.pastelBlue,
  WES_ANDERSON_PALETTE.pastelPink,
  WES_ANDERSON_PALETTE.pastelGreen,
  WES_ANDERSON_PALETTE.vintageBrown,
  WES_ANDERSON_PALETTE.vintageYellow,
];

const areaChartGradientId = "areaChartGradient";
const barChartGradientId = "barChartGradient";
const barChartSecondaryGradientId = "barChartSecondaryGradient";

export function MarketAnalysisCharts({ chartData }: MarketAnalysisChartsProps) {
  const [activeChart, setActiveChart] = useState<"pie" | "area" | "bar">("pie");
  const [isPdfMode, setIsPdfMode] = useState(false);
  const chartsRef = useRef<HTMLDivElement>(null);

  // Check if we have any chart data
  if (
    !chartData ||
    (!chartData.pieChart?.length &&
      !chartData.areaChart?.length &&
      !chartData.barChart?.length)
  ) {
    return null;
  }

  // Determine which charts are available
  const availableCharts = {
    pie: chartData.pieChart && chartData.pieChart.length > 0,
    area: chartData.areaChart && chartData.areaChart.length > 0,
    bar: chartData.barChart && chartData.barChart.length > 0,
  };

  // Set the first available chart as active if the current active chart is not available
  useEffect(() => {
    if (!availableCharts[activeChart]) {
      if (availableCharts.pie) setActiveChart("pie");
      else if (availableCharts.area) setActiveChart("area");
      else if (availableCharts.bar) setActiveChart("bar");
    }
    
    // Check if we're in a PDF export context
    const checkForPdfExport = () => {
      // Look for the PDF export container
      const isPdfExport = !!document.getElementById("pdf-export-container");
      setIsPdfMode(isPdfExport);
    };
    
    checkForPdfExport();
    
    // Set up a mutation observer to detect when the PDF container is added
    const observer = new MutationObserver(checkForPdfExport);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [activeChart, availableCharts]);

  // Apply explicit styles to chart elements for PDF export
  useEffect(() => {
    if (isPdfMode && chartsRef.current) {
      // Add a specific style element for chart PDF export
      const chartStyleEl = document.createElement('style');
      chartStyleEl.id = 'chart-pdf-styles';
      chartStyleEl.textContent = `
        .recharts-wrapper {
          background-color: rgba(255, 255, 255, 0.4) !important;
        }
        .recharts-surface {
          overflow: visible !important;
        }
        .recharts-sector {
          fill: ${WES_ANDERSON_PALETTE.pastelBlue} !important;
          stroke: ${WES_ANDERSON_PALETTE.text} !important;
        }
        .recharts-curve.recharts-area-area {
          fill: ${WES_ANDERSON_PALETTE.pastelBlue} !important;
          fill-opacity: 0.6 !important;
        }
        .recharts-curve.recharts-area-curve {
          stroke: ${WES_ANDERSON_PALETTE.pastelBlue} !important;
        }
        .recharts-rectangle.recharts-bar-rectangle {
          fill: ${WES_ANDERSON_PALETTE.pastelBlue} !important;
          stroke: ${WES_ANDERSON_PALETTE.text} !important;
        }
        .recharts-rectangle.recharts-bar-rectangle[name="Secondary Metric"] {
          fill: ${WES_ANDERSON_PALETTE.pastelPink} !important;
        }
        .recharts-text {
          fill: ${WES_ANDERSON_PALETTE.text} !important;
          font-family: Inter, system-ui, sans-serif !important;
        }
        .recharts-cartesian-axis-line, .recharts-cartesian-axis-tick-line {
          stroke: ${WES_ANDERSON_PALETTE.text} !important;
        }
        .recharts-legend-item-text {
          color: ${WES_ANDERSON_PALETTE.text} !important;
        }
      `;
      document.head.appendChild(chartStyleEl);
      
      // Ensure all SVG elements have explicit styling
      const svgElements = chartsRef.current.querySelectorAll('svg');
      svgElements.forEach(svg => {
        svg.setAttribute('style', 'overflow: visible; width: 100%; height: 100%;');
        
        // Fix text elements
        const textElements = svg.querySelectorAll('text');
        textElements.forEach(text => {
          text.setAttribute('fill', WES_ANDERSON_PALETTE.text);
          text.setAttribute('font-family', 'Inter, system-ui, sans-serif');
        });
        
        // Fix path elements (lines, areas)
        const pathElements = svg.querySelectorAll('path');
        pathElements.forEach(path => {
          const currentFill = path.getAttribute('fill');
          if (currentFill && (currentFill.includes('url') || currentFill.includes('oklch'))) {
            // For gradient fills, use a solid color instead
            path.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
            path.setAttribute('fill-opacity', '0.6');
          }
          
          // Ensure stroke is set
          if (path.getAttribute('stroke')) {
            path.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
          }
        });
        
        // Fix specific Recharts elements
        const sectors = svg.querySelectorAll('.recharts-sector');
        sectors.forEach(sector => {
          sector.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
          sector.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
        });
        
        const bars = svg.querySelectorAll('.recharts-bar-rectangle');
        bars.forEach(bar => {
          bar.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
          bar.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
        });
      });
      
      return () => {
        // Clean up the style element when component unmounts or PDF mode changes
        const styleEl = document.getElementById('chart-pdf-styles');
        if (styleEl) {
          document.head.removeChild(styleEl);
        }
      };
    }
  }, [isPdfMode]);

  const chartTitles = {
    pie: "Market Share Distribution",
    area: "Market Growth Trends",
    bar: "Competitive Metrics Comparison",
  };
  
  // Custom tooltip styles that work in both regular and PDF mode
  const tooltipStyle = {
    backgroundColor: "#FFFFFF", // White
    borderRadius: "0.75rem",
    border: "1px solid #EEEEEE", // Light gray
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "0.75rem",
  };

  const customTooltipStyle = {
    backgroundColor: WES_ANDERSON_PALETTE.fallbackBackground,
    border: `1px solid ${WES_ANDERSON_PALETTE.fallbackBorder}`,
    padding: "8px",
    borderRadius: "4px",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "12px",
    color: WES_ANDERSON_PALETTE.text,
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={customTooltipStyle}>
          <p>{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6" ref={chartsRef} id="market-analysis-charts">
      <GlassCard className="p-6" style={{ backgroundColor: isPdfMode ? "#F2E8DC" : undefined }}>
        <h2 
          className="text-xl font-semibold text-pastel-blue-dark mb-4"
          style={{ color: "#5A8BBF", fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {chartTitles[activeChart]}
        </h2>

        {/* Chart type selector buttons - hide in PDF mode */}
        {!isPdfMode && (
          <div className="flex flex-wrap gap-2 mb-6">
            {availableCharts.pie && (
              <Button
                onClick={() => setActiveChart("pie")}
                variant={activeChart === "pie" ? "default" : "outline"}
                className={`noise-texture ${
                  activeChart === "pie" ? "btn-high-contrast" : "bg-white/40"
                }`}
                style={{
                  backgroundColor: activeChart === "pie" ? "#3A6EA5" : "rgba(255, 255, 255, 0.4)",
                  color: activeChart === "pie" ? "#FFFFFF" : "#333333"
                }}
              >
                Market Share
              </Button>
            )}
            {availableCharts.area && (
              <Button
                onClick={() => setActiveChart("area")}
                variant={activeChart === "area" ? "default" : "outline"}
                className={`noise-texture ${
                  activeChart === "area" ? "btn-high-contrast" : "bg-white/40"
                }`}
                style={{
                  backgroundColor: activeChart === "area" ? "#3A6EA5" : "rgba(255, 255, 255, 0.4)",
                  color: activeChart === "area" ? "#FFFFFF" : "#333333"
                }}
              >
                Growth Trends
              </Button>
            )}
            {availableCharts.bar && (
              <Button
                onClick={() => setActiveChart("bar")}
                variant={activeChart === "bar" ? "default" : "outline"}
                className={`noise-texture ${
                  activeChart === "bar" ? "btn-high-contrast" : "bg-white/40"
                }`}
                style={{
                  backgroundColor: activeChart === "bar" ? "#3A6EA5" : "rgba(255, 255, 255, 0.4)",
                  color: activeChart === "bar" ? "#FFFFFF" : "#333333"
                }}
              >
                Metrics Comparison
              </Button>
            )}
          </div>
        )}

        {/* In PDF mode, display all available charts instead of just the active one */}
        {isPdfMode ? (
          <div className="space-y-8">
            {availableCharts.pie && (
              <div className="chart-container">
                <h3 className="text-lg font-medium mb-4" style={{ color: "#5A8BBF" }}>
                  Market Share Distribution
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.pieChart}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill={WES_ANDERSON_PALETTE.pastelBlue}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {chartData.pieChart?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={isPdfMode ? CHART_COLORS[index % CHART_COLORS.length] : CHART_COLORS[index % CHART_COLORS.length]}
                            stroke={WES_ANDERSON_PALETTE.text}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {availableCharts.area && (
              <div className="chart-container mt-10">
                <h3 className="text-lg font-medium mb-4" style={{ color: "#5A8BBF" }}>
                  Market Growth Trends
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData.areaChart}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        {!isPdfMode && (
                          <linearGradient
                            id={areaChartGradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={WES_ANDERSON_PALETTE.pastelBlue}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={WES_ANDERSON_PALETTE.pastelBlue}
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        )}
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={WES_ANDERSON_PALETTE.fallbackBorder}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: WES_ANDERSON_PALETTE.text }}
                        stroke={WES_ANDERSON_PALETTE.text}
                      />
                      <YAxis
                        tick={{ fill: WES_ANDERSON_PALETTE.text }}
                        stroke={WES_ANDERSON_PALETTE.text}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={WES_ANDERSON_PALETTE.pastelBlue}
                        fillOpacity={1}
                        fill={isPdfMode ? WES_ANDERSON_PALETTE.pastelBlue : `url(#${areaChartGradientId})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {availableCharts.bar && (
              <div className="chart-container mt-10">
                <h3 className="text-lg font-medium mb-4" style={{ color: "#5A8BBF" }}>
                  Competitive Metrics Comparison
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.barChart}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        {!isPdfMode && (
                          <>
                            <linearGradient
                              id={barChartGradientId}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={WES_ANDERSON_PALETTE.pastelBlue}
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor={WES_ANDERSON_PALETTE.pastelBlue}
                                stopOpacity={0.4}
                              />
                            </linearGradient>
                            <linearGradient
                              id={barChartSecondaryGradientId}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={WES_ANDERSON_PALETTE.pastelPink}
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor={WES_ANDERSON_PALETTE.pastelPink}
                                stopOpacity={0.4}
                              />
                            </linearGradient>
                          </>
                        )}
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={WES_ANDERSON_PALETTE.fallbackBorder}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: WES_ANDERSON_PALETTE.text }}
                        stroke={WES_ANDERSON_PALETTE.text}
                      />
                      <YAxis
                        tick={{ fill: WES_ANDERSON_PALETTE.text }}
                        stroke={WES_ANDERSON_PALETTE.text}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => (
                          <span style={{ color: WES_ANDERSON_PALETTE.text }}>
                            {value === "value" ? "Primary Metric" : "Secondary Metric"}
                          </span>
                        )}
                      />
                      <Bar
                        dataKey="value"
                        name="Primary Metric"
                        fill={isPdfMode ? WES_ANDERSON_PALETTE.pastelBlue : `url(#${barChartGradientId})`}
                        stroke={WES_ANDERSON_PALETTE.text}
                        strokeWidth={1}
                      />
                      {chartData.barChart?.some((item) => item.secondaryValue !== undefined) && (
                        <Bar
                          dataKey="secondaryValue"
                          name="Secondary Metric"
                          fill={isPdfMode ? WES_ANDERSON_PALETTE.pastelPink : `url(#${barChartSecondaryGradientId})`}
                          stroke={WES_ANDERSON_PALETTE.text}
                          strokeWidth={1}
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Regular mode - show only the active chart
          <div className="chart-container">
            {activeChart === "pie" && availableCharts.pie && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.pieChart}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill={WES_ANDERSON_PALETTE.pastelBlue}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.pieChart?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={isPdfMode ? CHART_COLORS[index % CHART_COLORS.length] : CHART_COLORS[index % CHART_COLORS.length]}
                          stroke={WES_ANDERSON_PALETTE.text}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeChart === "area" && availableCharts.area && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData.areaChart}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      {!isPdfMode && (
                        <linearGradient
                          id={areaChartGradientId}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={WES_ANDERSON_PALETTE.pastelBlue}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={WES_ANDERSON_PALETTE.pastelBlue}
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      )}
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={WES_ANDERSON_PALETTE.fallbackBorder}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: WES_ANDERSON_PALETTE.text }}
                      stroke={WES_ANDERSON_PALETTE.text}
                    />
                    <YAxis
                      tick={{ fill: WES_ANDERSON_PALETTE.text }}
                      stroke={WES_ANDERSON_PALETTE.text}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={WES_ANDERSON_PALETTE.pastelBlue}
                      fillOpacity={1}
                      fill={isPdfMode ? WES_ANDERSON_PALETTE.pastelBlue : `url(#${areaChartGradientId})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeChart === "bar" && availableCharts.bar && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.barChart}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      {!isPdfMode && (
                        <>
                          <linearGradient
                            id={barChartGradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={WES_ANDERSON_PALETTE.pastelBlue}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={WES_ANDERSON_PALETTE.pastelBlue}
                              stopOpacity={0.4}
                            />
                          </linearGradient>
                          <linearGradient
                            id={barChartSecondaryGradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={WES_ANDERSON_PALETTE.pastelPink}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={WES_ANDERSON_PALETTE.pastelPink}
                              stopOpacity={0.4}
                            />
                          </linearGradient>
                        </>
                      )}
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={WES_ANDERSON_PALETTE.fallbackBorder}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: WES_ANDERSON_PALETTE.text }}
                      stroke={WES_ANDERSON_PALETTE.text}
                    />
                    <YAxis
                      tick={{ fill: WES_ANDERSON_PALETTE.text }}
                      stroke={WES_ANDERSON_PALETTE.text}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: WES_ANDERSON_PALETTE.text }}>
                          {value === "value" ? "Primary Metric" : "Secondary Metric"}
                        </span>
                      )}
                    />
                    <Bar
                      dataKey="value"
                      name="Primary Metric"
                      fill={isPdfMode ? WES_ANDERSON_PALETTE.pastelBlue : `url(#${barChartGradientId})`}
                      stroke={WES_ANDERSON_PALETTE.text}
                      strokeWidth={1}
                    />
                    {chartData.barChart?.some((item) => item.secondaryValue !== undefined) && (
                      <Bar
                        dataKey="secondaryValue"
                        name="Secondary Metric"
                        fill={isPdfMode ? WES_ANDERSON_PALETTE.pastelPink : `url(#${barChartSecondaryGradientId})`}
                        stroke={WES_ANDERSON_PALETTE.text}
                        strokeWidth={1}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
