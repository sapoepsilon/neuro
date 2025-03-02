/**
 * Functions for generating and processing chart data for market analysis
 */

import { GeminiClient } from "@/lib/gemini";
import { SchemaType } from "@google/generative-ai";
import { chartDataSchema, getChartDataSchema, GenerateChartDataOptions } from "./schema";
import { ChartData, PieChartItem } from "./types";

/**
 * Validates and sanitizes chart data to ensure it meets requirements
 * @param data Raw chart data from API response
 * @returns Sanitized chart data
 */
export function sanitizeChartData(data: any): ChartData {
  const sanitized: ChartData = {};
  
  // Process pie chart data
  if (Array.isArray(data?.pieChart) && data.pieChart.length > 0) {
    sanitized.pieChart = data.pieChart.map((item: any) => ({
      name: item.name || 'Other',
      value: typeof item.value === 'number' ? item.value : 0,
      // Add percentage for easier access in components
      percentage: typeof item.value === 'number' ? item.value : 0
    }));
  }
  
  // Process area chart data - typically represents market size or revenue over time
  if (Array.isArray(data?.areaChart) && data.areaChart.length > 0) {
    sanitized.areaChart = data.areaChart.map((item: any) => ({
      name: item.name || 'Unknown',
      value: typeof item.value === 'number' ? item.value : 0,
      // Value represents dollars/currency for area charts
      formattedValue: typeof item.value === 'number' ? `$${item.value.toLocaleString()}` : '$0'
    }));
  }
  
  // Process bar chart data
  if (Array.isArray(data?.barChart) && data.barChart.length > 0) {
    sanitized.barChart = data.barChart.map((item: any) => {
      const name = item.name || 'Unknown';
      const value = typeof item.value === 'number' ? item.value : 0;
      const secondaryValue = typeof item.secondaryValue === 'number' ? item.secondaryValue : undefined;
      
      // Determine unit based on metric name
      let unit = '';
      if (name.toLowerCase().includes('revenue') || name.toLowerCase().includes('sales')) {
        unit = '$';
      } else if (name.toLowerCase().includes('share') || name.toLowerCase().includes('growth')) {
        unit = '%';
      } else if (name.toLowerCase().includes('users') || name.toLowerCase().includes('customers')) {
        unit = ' users';
      }
      
      return {
        name,
        value,
        secondaryValue,
        unit
      };
    });
  }
  
  return sanitized;
}

/**
 * Generates chart data using the Gemini API
 * @param content Text content to analyze for chart data generation
 * @param geminiClient Gemini API client instance
 * @param options Optional configuration for chart data generation
 * @returns Generated chart data or fallback data if generation fails
 */
export async function generateChartData(
  content: string,
  geminiClient: GeminiClient,
  options: GenerateChartDataOptions = {}
): Promise<ChartData> {
  try {
    const schema = getChartDataSchema(options);
    
    const prompt = `
      Analyze the following market information and generate chart data for visualization.
      Create data for pie charts showing market share distribution, area charts showing trends over time,
      and bar charts comparing key metrics.
      
      Use realistic values based on the content. Ensure all data points have descriptive names
      and numeric values. Avoid using 'undefined' or generic labels.
      
      Content to analyze:
      ${content}
    `;
    
    const result = await geminiClient.generateWithStructuredOutput(prompt, schema);
    
    if (!result || typeof result !== 'object') {
      console.warn('Failed to generate chart data, using fallback');
      return getFallbackChartData();
    }
    
    // Validate and sanitize the data
    return sanitizeChartData(result);
  } catch (error) {
    console.error('Error generating chart data:', error);
    return getFallbackChartData();
  }
}

/**
 * Provides fallback chart data when generation fails
 */
export function getFallbackChartData(): ChartData {
  return {
    pieChart: [
      { name: 'Market Leader', value: 35, percentage: 35 },
      { name: 'Competitor A', value: 25, percentage: 25 },
      { name: 'Competitor B', value: 20, percentage: 20 },
      { name: 'Others', value: 20, percentage: 20 }
    ],
    areaChart: [
      { name: '2019', value: 1200000, formattedValue: '$1,200,000', year: 2019 },
      { name: '2020', value: 1100000, formattedValue: '$1,100,000', year: 2020 },
      { name: '2021', value: 1500000, formattedValue: '$1,500,000', year: 2021 },
      { name: '2022', value: 2200000, formattedValue: '$2,200,000', year: 2022 },
      { name: '2023', value: 3100000, formattedValue: '$3,100,000', year: 2023 }
    ],
    barChart: [
      { name: 'Revenue', value: 4800000, secondaryValue: 3000000, unit: '$' },
      { name: 'Market Share', value: 35, secondaryValue: 25, unit: '%' },
      { name: 'Growth Rate', value: 28, secondaryValue: 15, unit: '%' },
      { name: 'Customer Base', value: 520000, secondaryValue: 380000, unit: ' users' }
    ]
  };
}
