/**
 * Functions for generating and processing market analysis summaries
 */

import { geminiClient } from "../gemini-client";

/**
 * Generate a concise summary of a market analysis
 * This uses Gemini to create a 1-2 paragraph summary of the full analysis
 * 
 * @param analysisContent - The full analysis content to summarize
 * @returns A concise summary of the analysis
 */
export async function generateMarketAnalysisSummary(
  analysisContent: string
): Promise<string> {
  try {
    // Create a prompt that asks for a concise summary
    const summaryPrompt = `
      Below is a detailed market analysis. Please create a concise 1-2 paragraph summary that captures the most important insights.
      Focus on market size, growth potential, key competitors, and unique opportunities.
      Make the summary informative yet brief, highlighting only the most critical information.

      MARKET ANALYSIS:
      ${analysisContent}
    `;

    // Generate the summary using Gemini without search capabilities
    const result = await geminiClient.generateWithoutTools(
      summaryPrompt,
      0.5 // Lower temperature for more focused output
    );

    // Extract the summary content
    let summary = result.response.text();
    
    // Remove any markdown formatting
    summary = summary
      .replace(/^#+ /gm, "") // Remove headings
      .replace(/\*\*/g, "")   // Remove bold
      .replace(/\*/g, "")     // Remove italics
      .trim();

    return summary;
  } catch (error) {
    console.error("Error generating market analysis summary:", error);
    return "Unable to generate summary. Please refer to the full analysis.";
  }
}

/**
 * Extract the first paragraph from HTML content as a fallback summary
 * 
 * @param htmlContent - The HTML content to extract from
 * @returns The first paragraph or a default message
 */
export function extractFirstParagraphAsSummary(htmlContent: string): string {
  try {
    // Use a simple regex to extract the first paragraph
    const match = htmlContent.match(/<p>(.*?)<\/p>/);
    if (match && match[0]) {
      return match[0];
    }
  } catch (error) {
    console.error("Error extracting first paragraph:", error);
  }
  
  return "<p>No summary available.</p>";
}
