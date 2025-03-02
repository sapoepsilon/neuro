# Structured Output with Gemini API

This guide explains how to use structured output with the Gemini API in the Neuro project.

## Table of Contents

1. [Introduction](#introduction)
2. [Implementation](#implementation)
3. [JSON Schema Definition](#json-schema-definition)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)

## Introduction

Gemini generates unstructured text by default, but some applications require structured text. For these use cases, we can constrain Gemini to respond with JSON, a structured data format suitable for automated processing.

Using structured output provides several advantages:
- Consistent, predictable response format
- No need for regex pattern matching or complex parsing
- Reduced errors in data extraction
- Better integration with frontend components

## Implementation

The Neuro project implements structured output through the `generateWithStructuredOutput` method in the `GeminiClient` class:

```typescript
/**
 * Generate content using Gemini 2.0 with structured JSON output
 * This uses a prompt-based approach to request structured data
 */
public async generateWithStructuredOutput(
  prompt: string, 
  schema: any, 
  temperature: number = 0.7,
  model: string = "gemini-2.0-flash"
) {
  // Create a prompt that instructs the model to return data in the specified format
  const schemaString = JSON.stringify(schema, null, 2);
  const structuredPrompt = `
${prompt}

IMPORTANT: You must respond ONLY with a valid JSON object that follows this schema:
${schemaString}

Do not include any explanations, markdown formatting, or anything else outside the JSON object.
Just return the raw JSON object that matches the schema.
`;

  const genModel = this.client.getGenerativeModel({
    model: model,
    generationConfig: {
      temperature,
    },
  });

  return genModel.generateContent({
    contents: [{ role: "user", parts: [{ text: structuredPrompt }] }],
  });
}
```

## JSON Schema Definition

When configuring the model to return a JSON response, you need to define a schema that specifies the structure of the expected data. The schema uses the `SchemaType` enum from the Gemini API.

Example schema for chart data:

```typescript
const chartDataSchema = {
  type: SchemaType.OBJECT,
  properties: {
    pieChart: {
      type: SchemaType.ARRAY,
      description: "Pie chart data showing market share distribution",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: {
            type: SchemaType.STRING,
            description: "Name of the competitor or market segment",
          },
          value: {
            type: SchemaType.NUMBER,
            description: "Market share percentage value",
          },
        },
        required: ["name", "value"],
      },
    },
    // Additional chart types...
  },
  required: ["pieChart", "areaChart", "barChart"],
};
```

## Usage Examples

### Market Analysis Chart Data

The market analysis feature uses structured output to generate chart data:

```typescript
// Define prompt for chart data
const chartDataPrompt = `
  Based on the following project description, generate chart data for market analysis visualization:
  
  Project Description: ${projectDescription}
  
  Generate realistic and relevant data for:
  1. Market share distribution among key competitors or market segments (pieChart)
  2. Market growth trends over time for the past 5 years (areaChart)
  3. Comparison of key metrics between the project and competitors (barChart)
`;

// Generate structured chart data
const chartDataResult = await geminiClient.generateWithStructuredOutput(
  chartDataPrompt,
  chartDataSchema
);

// Extract the chart data from the response
let chartData;
try {
  // Get the raw text response
  const responseText = chartDataResult.response.text();
  
  // Try to extract JSON from the response
  // First, look for JSON within code blocks if present
  let jsonText = responseText;
  
  // Remove any markdown code block indicators if present
  jsonText = jsonText.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
  
  // Trim any whitespace
  jsonText = jsonText.trim();
  
  // Parse the JSON
  chartData = JSON.parse(jsonText);
  console.log("Generated chart data:", chartData);
} catch (error) {
  console.error("Error parsing chart data:", error);
  // Provide fallback chart data if parsing fails
  chartData = {
    // Fallback data...
  };
}
```

## Best Practices

1. **Be Specific in Descriptions**: Include detailed descriptions for each field in your schema to guide the model.

2. **Use Required Fields**: Specify which fields are required to ensure the model includes them.

3. **Property Ordering**: When working with JSON schemas, the order of properties matters. Use the `propertyOrdering` field if the order is important.

4. **Error Handling**: Always include error handling when parsing the response.

5. **Prompt Engineering**: Craft clear prompts that align with your schema structure.

6. **Temperature Setting**: Use lower temperature values (0.2-0.5) for more predictable structured outputs.

7. **Schema Validation**: Consider adding runtime validation of the returned JSON against your expected schema.

## Schema Types Reference

The Gemini API supports the following schema types:

- `SchemaType.STRING` - For text values
- `SchemaType.NUMBER` - For numeric values
- `SchemaType.INTEGER` - For integer values
- `SchemaType.BOOL` - For boolean values
- `SchemaType.ARRAY` - For arrays of items
- `SchemaType.OBJECT` - For nested objects

Each type supports specific fields:
- `string` -> enum, format
- `integer` -> format
- `number` -> format
- `bool`
- `array` -> minItems, maxItems, items
- `object` -> properties, required, propertyOrdering, nullable

> **Note:** This approach uses prompt engineering rather than the native schema support in the Gemini API. The current version of the API (0.2.1) doesn't support the `responseSchema` and `responseMimeType` options in the generation configuration.
