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

// Types
export type PieChartData = Array<{ name: string; value: number; unit?: string }>;
export type AreaChartData = Array<{ name: string; value: number; unit?: string }>;
export type BarChartData = Array<{
  name: string;
  value: number;
  unit?: string;
  secondaryValue?: number;
  secondaryUnit?: string;
}>;

export interface ChartData {
  pieChart?: PieChartData;
  areaChart?: AreaChartData;
  barChart?: BarChartData;
}

interface MarketAnalysisChartsProps {
  chartData?: ChartData;
}

// Constants
const CHART_COLORS = [
  WES_ANDERSON_PALETTE.pastelBlue,
  WES_ANDERSON_PALETTE.pastelPink,
  WES_ANDERSON_PALETTE.pastelGreen,
  WES_ANDERSON_PALETTE.pastelBeige,
  WES_ANDERSON_PALETTE.pastelYellow,
];

// Utility Functions
const formatValue = (value: number, unit?: string) => {
  if (!unit) {
    return value.toLocaleString();
  }

  switch (unit.toLowerCase()) {
    case '%':
      return `${value}%`;
    case 'b usd':
    case 'billion usd':
    case 'b':
      return `$${value}B`;
    case 'm usd':
    case 'million usd':
    case 'm':
      return `$${value}M`;
    case 'm users':
    case 'million users':
      return `${value}M users`;
    case 'k users':
    case 'thousand users':
      return `${value}K users`;
    default:
      return `${value}${unit ? ` ${unit}` : ''}`;
  }
};

const formatYAxisTick = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value}`;
};

const formatTooltipValue = (value: number, label?: string) => {
  if (label?.toLowerCase().includes('percentage') || label?.toLowerCase().includes('share')) {
    return `${value}%`;
  }
  if (label?.toLowerCase().includes('revenue') || label?.toLowerCase().includes('sales')) {
    return formatYAxisTick(value);
  }
  return value;
};

// PDF Mode Components and Hooks
const usePdfMode = () => {
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    const checkPdfMode = () => {
      const pdfExportContainer = document.getElementById("pdf-export-container");
      const pdfExportStyles = document.getElementById("pdf-export-global-styles");
      const pdfModeAttribute = document.querySelector('[data-pdf-mode="true"]');
      return !!pdfExportContainer || !!pdfExportStyles || !!pdfModeAttribute || isPdf;
    };

    setIsPdf(checkPdfMode());

    const observer = new MutationObserver(() => {
      setIsPdf(checkPdfMode());
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-pdf-mode"],
    });

    return () => observer.disconnect();
  }, [isPdf]);

  return isPdf;
};

// Individual Chart Components
const MarketSharePieChart = ({ data }: { data: PieChartData }) => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={150}
        fill={WES_ANDERSON_PALETTE.pastelBlue}
        dataKey="value"
        label={({ name, value, payload }) => `${name}: ${formatValue(value, payload?.unit || '%')}`}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number, name: string, entry: any) => [
          formatValue(value, entry?.payload?.unit || '%'),
          name,
        ]}
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

const MarketGrowthAreaChart = ({ data }: { data: AreaChartData }) => (
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="areaChartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={WES_ANDERSON_PALETTE.pastelBlue} stopOpacity={0.8} />
          <stop offset="95%" stopColor={WES_ANDERSON_PALETTE.pastelBlue} stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis 
        tickFormatter={(value) => formatValue(value, data[0]?.unit || 'B USD')}
        label={{ 
          value: 'Market Size (Billion USD)', 
          angle: -90, 
          position: 'insideLeft',
          style: { textAnchor: 'middle' }
        }}
      />
      <Tooltip
        formatter={(value: number, name: string, entry: any) => [
          formatValue(value, entry?.payload?.unit || 'B USD'),
          'Market Size',
        ]}
      />
      <Area
        type="monotone"
        dataKey="value"
        stroke={WES_ANDERSON_PALETTE.pastelBlue}
        fillOpacity={1}
        fill="url(#areaChartGradient)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

const ComparisonBarChart = ({ data }: { data: BarChartData }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data}>
      <defs>
        <linearGradient id="barChartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={WES_ANDERSON_PALETTE.pastelBlue} stopOpacity={0.8} />
          <stop offset="95%" stopColor={WES_ANDERSON_PALETTE.pastelBlue} stopOpacity={0.2} />
        </linearGradient>
        <linearGradient id="barChartSecondaryGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={WES_ANDERSON_PALETTE.pastelPink} stopOpacity={0.8} />
          <stop offset="95%" stopColor={WES_ANDERSON_PALETTE.pastelPink} stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="name" 
        angle={-45}
        textAnchor="end"
        height={80}
        interval={0}
      />
      <YAxis 
        tickFormatter={(value) => formatValue(value, data[0]?.unit)}
        label={{ 
          value: data[0]?.unit ? `Value (${data[0].unit})` : 'Value', 
          angle: -90, 
          position: 'insideLeft',
          style: { textAnchor: 'middle' }
        }}
      />
      <Tooltip
        formatter={(value: number, name: string, entry: any) => {
          const isSecondary = name.includes('Secondary');
          const payload = entry?.payload;
          return [
            formatValue(value, isSecondary ? payload?.secondaryUnit : payload?.unit),
            name,
          ];
        }}
      />
      <Legend />
      <Bar 
        dataKey="value" 
        fill="url(#barChartGradient)" 
        name="Primary Value"
        label={{
          position: 'top',
          formatter: (value: number, entry: any) => formatValue(value, entry?.payload?.unit),
        }}
      />
      {data.some((item) => item.secondaryValue !== undefined) && (
        <Bar
          dataKey="secondaryValue"
          fill="url(#barChartSecondaryGradient)"
          name="Secondary Value"
          label={{
            position: 'top',
            formatter: (value: number, entry: any) => formatValue(value, entry?.payload?.secondaryUnit),
          }}
        />
      )}
    </BarChart>
  </ResponsiveContainer>
);

// Main Component
export function MarketAnalysisCharts({ chartData }: MarketAnalysisChartsProps) {
  const [activeChart, setActiveChart] = useState<"pie" | "area" | "bar">("pie");
  const chartsRef = useRef<HTMLDivElement>(null);
  const isPdf = usePdfMode();

  const availableCharts = {
    pie: chartData?.pieChart && chartData.pieChart.length > 0,
    area: chartData?.areaChart && chartData.areaChart.length > 0,
    bar: chartData?.barChart && chartData.barChart.length > 0,
  };

  useEffect(() => {
    if (!availableCharts[activeChart]) {
      if (availableCharts.pie) setActiveChart("pie");
      else if (availableCharts.area) setActiveChart("area");
      else if (availableCharts.bar) setActiveChart("bar");
    }
  }, [availableCharts, activeChart]);

  if (!chartData) return null;

  return (
    <div ref={chartsRef} className="space-y-4">
      {!isPdf && (
        <div className="flex gap-2">
          {availableCharts.pie && (
            <Button
              variant={activeChart === "pie" ? "default" : "outline"}
              onClick={() => setActiveChart("pie")}
            >
              Market Share
            </Button>
          )}
          {availableCharts.area && (
            <Button
              variant={activeChart === "area" ? "default" : "outline"}
              onClick={() => setActiveChart("area")}
            >
              Growth Trend
            </Button>
          )}
          {availableCharts.bar && (
            <Button
              variant={activeChart === "bar" ? "default" : "outline"}
              onClick={() => setActiveChart("bar")}
            >
              Comparison
            </Button>
          )}
        </div>
      )}

      <GlassCard className="p-6">
        {activeChart === "pie" && chartData.pieChart && (
          <MarketSharePieChart data={chartData.pieChart} />
        )}
        {activeChart === "area" && chartData.areaChart && (
          <MarketGrowthAreaChart data={chartData.areaChart} />
        )}
        {activeChart === "bar" && chartData.barChart && (
          <ComparisonBarChart data={chartData.barChart} />
        )}
      </GlassCard>
    </div>
  );
}
