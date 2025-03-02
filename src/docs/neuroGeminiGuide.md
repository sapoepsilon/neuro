# Grounding with Google Search for Neuro

## Overview

Neuro's AI-powered project manager uses Google Search grounding to provide accurate, up-to-date information about market trends, competitor analysis, and industry insights. This feature improves the factuality and relevance of AI-generated market analyses by connecting responses to real-time web data.

## Table of Contents

- [Implementation Guide](#implementation-guide)
  - [Setting Up Google Search as a Tool](#setting-up-google-search-as-a-tool)
  - [Configuring Search Grounding](#configuring-search-grounding)
  - [Handling Grounded Responses](#handling-grounded-responses)
- [Using Search Suggestions](#using-search-suggestions)
  - [Display Requirements](#display-requirements)
  - [Implementation Example](#implementation-example)
- [Best Practices](#best-practices)
- [FAQ](#faq)

## Implementation Guide

### Setting Up Google Search as a Tool

Starting with Gemini 2.0, Google Search is available as a tool that the model can decide when to use. This approach is ideal for Neuro's market analysis feature.

```typescript
// lib/gemini-client.ts
import { GoogleGenerativeAI, GenerateContentConfig } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

export async function analyzeMarket(projectDescription: string) {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `
    Analyze the following project idea and provide a market analysis:
    - Identify key competitors
    - Analyze market trends
    - Identify potential opportunities
    - Estimate market size
    
    Project: ${projectDescription}
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
    },
    tools: [{
      googleSearch: {}
    }]
  });
  
  return result;
}
```

### Configuring Search Grounding

Neuro uses Google Search as a tool, allowing the AI to decide when external data is needed. The model can determine when to use Google Search based on the query context.

```typescript
// lib/market-analysis.ts
import { analyzeMarket } from "./gemini-client";

// Define types for grounding metadata
interface GroundingMetadata {
  webSearchQueries?: string[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
}

// Extend the GenerateContentCandidate type to include groundingMetadata
declare module "@google/generative-ai" {
  interface GenerateContentCandidate {
    groundingMetadata?: GroundingMetadata;
  }
}

export interface MarketAnalysisResult {
  content: string;
  isGrounded: boolean;
  searchSuggestions: string[];
  renderedContent: string | null;
}

export async function generateMarketAnalysis(projectDescription: string): Promise<MarketAnalysisResult> {
  try {
    const result = await analyzeMarket(projectDescription);

    // Extract the grounded content
    const content = result.response.text();

    // Check if we have grounding metadata
    const candidates = result.response.candidates || [];
    const firstCandidate = candidates[0];
    const hasGroundingData = firstCandidate?.groundingMetadata;

    // Extract search suggestions if available
    const searchSuggestions = hasGroundingData
      ? firstCandidate.groundingMetadata?.webSearchQueries || []
      : [];

    // Extract rendered content for search suggestions
    const renderedContent = hasGroundingData
      ? firstCandidate.groundingMetadata?.searchEntryPoint?.renderedContent || null
      : null;

    return {
      content,
      isGrounded: !!hasGroundingData,
      searchSuggestions,
      renderedContent,
    };
  } catch (error) {
    console.error("Error generating market analysis:", error);
    throw error;
  }
}
```

### Handling Grounded Responses

When a response is grounded with Google Search, the API returns:
- The generated content
- Grounding metadata including:
  - Search entry point with rendered content for Search Suggestions
  - Grounding chunks (sources used)
  - Web search queries

Neuro handles both grounded and non-grounded responses in the market analysis component:

```tsx
// components/market-analysis.tsx
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GoogleSearchSuggestions } from "@/components/google-search-suggestions";
import type { MarketAnalysisResult } from "@/lib/market-analysis";

interface MarketAnalysisProps {
  projectId: string;
  projectDescription: string;
}

export function MarketAnalysis({
  projectId,
  projectDescription,
}: MarketAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<MarketAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch("/api/market-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, projectDescription }),
        });

        const data = await response.json();
        setAnalysisData(data);
      } catch (error) {
        console.error("Error fetching market analysis:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalysis();
  }, [projectId, projectDescription]);

  if (isLoading) {
    return <div>Loading market analysis...</div>;
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 gradient-text">
          Market Analysis
        </h2>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: analysisData?.content }}
        />
      </GlassCard>

      {analysisData?.isGrounded && analysisData?.renderedContent && (
        <GoogleSearchSuggestions
          renderedContent={analysisData.renderedContent}
        />
      )}
    </div>
  );
}
```

## Using Search Suggestions

To use Grounding with Google Search, you must display Google Search Suggestions whenever showing grounded content. These suggestions help users find search results corresponding to the grounded response.

### Display Requirements

1. **Show Suggestions As Provided**: Display the Search Suggestion exactly as provided in the `renderedContent` field without modifications to colors, fonts, or appearance.
2. **Direct Link to Search**: When users click a suggestion, take them directly to the Google Search results page without any interstitial screens or additional steps.
3. **Maintain Visibility**: Keep the suggestion visible whenever the related grounded content is shown.
4. **Follow Branding Guidelines**: Strictly adhere to Google's Guidelines for Third Party Use of Google Brand Features.
5. **Full Width**: Google Search Suggestions should be at minimum the full width of the grounded response.

### Implementation Example

Neuro implements Google Search Suggestions by directly using the rendered HTML/CSS provided in the API response:

```tsx
// components/google-search-suggestions.tsx
import { useEffect, useRef } from "react";

interface GoogleSearchSuggestionsProps {
  renderedContent: string;
}

export function GoogleSearchSuggestions({
  renderedContent,
}: GoogleSearchSuggestionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && renderedContent) {
      containerRef.current.innerHTML = renderedContent;
    }
  }, [renderedContent]);

  return <div ref={containerRef} className="mt-4" />;
}
```

This component injects the pre-styled HTML/CSS provided by Google directly into the DOM, ensuring compliance with all display requirements. The rendered content automatically adapts to the user's device settings, displaying in either light or dark mode based on the user's preference.

## Best Practices

1. **Appropriate Use Cases**: Use Google Search grounding for:
   - Enhancing factuality and recency in market analyses
   - Retrieving web content for further analysis
   - Finding relevant information for technical research
   - Accessing region-specific market data

2. **Query Construction**: Craft prompts that clearly indicate when external information is needed.

3. **Error Handling**: Always implement robust error handling for cases where grounding might not be available.

4. **User Experience**: Clearly indicate to users when information is grounded with external sources.

5. **Compliance**: Always display Google Search Suggestions according to the requirements to maintain API access.

## FAQ

### How does Neuro determine when to use Google Search?

When using Gemini 2.0, the model itself decides when to use Google Search based on the nature of the query. For market analysis queries that require up-to-date information, the model will typically leverage Google Search automatically.

### Are there usage limits for Google Search grounding?

Yes. On the paid tier of the Gemini Developer API, you get 1,500 Grounding with Google Search queries per day for free, with additional queries billed at $35 per 1,000 queries.

### How do I handle cases where grounding isn't available?

Neuro's implementation checks for the presence of grounding metadata and gracefully handles cases where it's not available by still displaying the AI-generated content without the search suggestions.

### Can I modify the appearance of Google Search Suggestions?

No. You must display the Search Suggestion exactly as provided without any modifications to colors, fonts, or appearance. The provided HTML/CSS in the `renderedContent` field already handles light/dark mode adaptations.

### How long are the search redirection URLs valid?

The URIs provided in the grounding metadata remain accessible for 30 days after the grounded result is generated.
