/**
 * Type definitions for market analysis functionality
 */

// Define types for grounding metadata
export interface GroundingMetadata {
  webSearchQueries?: string[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  groundingSupports?: Array<{
    segment: {
      startIndex?: number;
      endIndex?: number;
      text: string;
    };
    groundingChunkIndices: number[];
    confidenceScores: number[];
  }>;
}

// Extend the GenerateContentCandidate type to include groundingMetadata
declare module "@google/generative-ai" {
  interface GenerateContentCandidate {
    groundingMetadata?: GroundingMetadata;
  }
}

export interface MarketAnalysisResult {
  content: string;
  htmlContent: string;
  isGrounded: boolean;
  searchSuggestions: string[];
  renderedContent: string | null;
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  chartData?: {
    pieChart?: Array<{ name: string; value: number; percentage?: number }>;
    areaChart?: Array<{ name: string; value: number; formattedValue?: string }>;
    barChart?: Array<{ name: string; value: number; secondaryValue?: number; unit?: string }>;
  };
  summary?: string;
}

// Chart data types
export type PieChartData = Array<{ 
  name: string; 
  value: number; 
  percentage?: number;
}>;

export type AreaChartData = Array<{ 
  name: string; 
  value: number;
  formattedValue?: string;
}>;

export type BarChartData = Array<{
  name: string;
  value: number;
  secondaryValue?: number;
  unit?: string;
}>;

/**
 * Interface for pie chart data items
 */
export interface PieChartItem {
  name: string;
  value: number;
  percentage?: number;
}

/**
 * Interface for area chart data items
 */
export interface AreaChartItem {
  name: string;
  value: number;
  formattedValue?: string;
}

/**
 * Interface for bar chart data items
 */
export interface BarChartItem {
  name: string;
  value: number;
  secondaryValue?: number;
  unit?: string;
}

export interface ChartData {
  pieChart?: PieChartData;
  areaChart?: AreaChartData;
  barChart?: BarChartData;
}
