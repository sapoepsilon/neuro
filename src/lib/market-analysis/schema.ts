/**
 * JSON schema definitions for structured output with the Gemini API
 */

/**
 * Schema for chart data generation
 * This defines the structure for the Gemini API structured output
 */
export const chartDataSchema: SchemaType = {
  type: "object",
  properties: {
    pieChart: {
      type: "array",
      description: "Data for a pie chart showing market share distribution. Each item should have a descriptive name and a numeric value representing percentage or quantity. Avoid generic or undefined names.",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the market segment, competitor, or category. Should be descriptive and specific (e.g., 'Enterprise Solutions', 'Small Business', 'Healthcare Sector')."
          },
          value: {
            type: "number",
            description: "Numeric value representing the size of this segment (typically a percentage of total market)."
          },
          percentage: {
            type: "number",
            description: "Optional percentage value for this segment (0-100)."
          }
        },
        required: ["name", "value"]
      },
      minItems: 3,
      maxItems: 8
    },
    areaChart: {
      type: "array",
      description: "Data for an area chart showing market growth trends over time. Each item should have a time period (e.g., year or quarter) and a numeric value. Ensure time periods are in chronological order.",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Time period label (e.g., '2019', 'Q1 2020'). Should be in chronological order."
          },
          value: {
            type: "number",
            description: "Numeric value for this time period (e.g., market size, revenue, growth rate)."
          }
        },
        required: ["name", "value"]
      },
      minItems: 4,
      maxItems: 10
    },
    barChart: {
      type: "array",
      description: "Data for a bar chart comparing metrics between the subject and competitors. Each item should have a metric name and values for comparison.",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the metric being compared (e.g., 'Revenue', 'Market Share', 'Growth Rate'). Should be descriptive and specific."
          },
          value: {
            type: "number",
            description: "Primary value for this metric (typically representing the subject of analysis)."
          },
          secondaryValue: {
            type: "number",
            description: "Optional secondary value for comparison (typically representing a competitor or industry average)."
          }
        },
        required: ["name", "value"]
      },
      minItems: 3,
      maxItems: 8
    }
  },
  required: ["pieChart", "areaChart", "barChart"]
};

/**
 * Options for chart data generation
 */
export interface GenerateChartDataOptions {
  minItems?: number;
  maxItems?: number;
}

/**
 * Get chart data schema with custom options
 * @param options Options to customize the schema
 * @returns Customized schema
 */
export function getChartDataSchema(options: GenerateChartDataOptions = {}): SchemaType {
  const schema = JSON.parse(JSON.stringify(chartDataSchema)) as SchemaType;
  
  // Apply customizations if provided
  if (options.minItems) {
    if (schema.properties.pieChart) {
      schema.properties.pieChart.minItems = options.minItems;
    }
    if (schema.properties.areaChart) {
      schema.properties.areaChart.minItems = options.minItems;
    }
    if (schema.properties.barChart) {
      schema.properties.barChart.minItems = options.minItems;
    }
  }
  
  if (options.maxItems) {
    if (schema.properties.pieChart) {
      schema.properties.pieChart.maxItems = options.maxItems;
    }
    if (schema.properties.areaChart) {
      schema.properties.areaChart.maxItems = options.maxItems;
    }
    if (schema.properties.barChart) {
      schema.properties.barChart.maxItems = options.maxItems;
    }
  }
  
  return schema;
}
