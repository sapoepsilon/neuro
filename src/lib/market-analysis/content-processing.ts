/**
 * Functions for processing market analysis content
 * Handles HTML and markdown conversion, source formatting, etc.
 */

import { GroundingMetadata } from "./types";

/**
 * Process HTML content from the market analysis response
 * Adds source references if available
 * 
 * @param content - The raw HTML content
 * @param groundingMetadata - Metadata containing grounding information
 * @param groundingChunks - Chunks containing source information
 * @returns Processed HTML content with sources
 */
export function processHtmlContent(
  content: string,
  groundingMetadata?: GroundingMetadata,
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>
): string {
  let htmlContent = content;

  // If we have grounding supports, we can add source references
  if (
    groundingMetadata &&
    groundingMetadata.groundingSupports &&
    groundingChunks
  ) {
    // Add a sources section at the end if not already present
    if (!htmlContent.includes("<h2") && groundingChunks.length > 0) {
      htmlContent += `
        <h2 class="text-xl font-semibold mt-8 mb-4 text-primary">Sources</h2>
        <ol class="list-decimal pl-5 space-y-2">
          ${groundingChunks
            .map((chunk) => {
              if (chunk.web) {
                return `<li class="text-sm text-gray-700 dark:text-gray-300">
              <a href="${chunk.web.uri}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                ${chunk.web.title}
              </a>
            </li>`;
              }
              return "";
            })
            .join("")}
        </ol>
      `;
    }
  }

  return htmlContent;
}

/**
 * Convert HTML content to markdown format
 * This is used for backward compatibility
 * 
 * @param content - The HTML content to convert
 * @param groundingMetadata - Metadata containing grounding information
 * @param groundingChunks - Chunks containing source information
 * @returns Markdown formatted content
 */
export function convertHtmlToMarkdown(
  content: string,
  groundingMetadata?: GroundingMetadata,
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>
): string {
  // If the content doesn't appear to be HTML, return it as is
  if (
    !content.includes("<h1") &&
    !content.includes("<h2") &&
    !content.includes("<p")
  ) {
    return content;
  }

  // This is a very basic HTML to markdown conversion for backward compatibility
  let markdownContent = content
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, "$1\n")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<sup>(.*?)<\/sup>/gi, "^$1")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<[^>]*>/g, ""); // Remove any remaining HTML tags

  // Add sources section in markdown format if needed
  if (groundingMetadata && groundingChunks && groundingChunks.length > 0) {
    markdownContent += "\n\n## Sources\n";
    groundingChunks.forEach((chunk, index) => {
      if (chunk.web) {
        markdownContent += `${index + 1}. ${chunk.web.title}\n`;
      }
    });
  }

  return markdownContent;
}

/**
 * Clean up content by removing markdown code blocks and language tags
 * 
 * @param content - The content to clean
 * @returns Cleaned content
 */
export function cleanupContent(content: string): string {
  return content
    .replace(/```(\w+)?\n/g, "") // Remove opening code block with optional language
    .replace(/```\n?/g, "") // Remove closing code block
    .trim();
}

/**
 * Removes meta-explanations and implementation notes from the generated content
 * @param content The raw content to clean
 * @returns Cleaned content without meta-explanations
 */
export function removeMetaExplanations(content: string): string {
  if (!content) return '';
  
  // Remove sections that start with "Key improvements and explanations:"
  content = content.replace(/Key improvements and explanations:[\s\S]*$/, '');
  
  // Remove any explanatory sections that use asterisks for bullets and explain implementation details
  content = content.replace(/\*\s*\*\*[\w\s]+:\*\*\s*[\s\S]*?(?=\*\s*\*\*|$)/g, '');
  
  // Remove reminders about replacing placeholder data
  content = content.replace(/\*[^*]*placeholder[^*]*\*/gi, '');
  
  // Remove implementation instructions
  content = content.replace(/Remember to replace[\s\S]*?(?=\n\n|$)/g, '');
  content = content.replace(/You would need to[\s\S]*?(?=\n\n|$)/g, '');
  content = content.replace(/A simple way to[\s\S]*?(?=\n\n|$)/g, '');
  
  // Remove any trailing notes about running servers
  content = content.replace(/Simply opening the HTML[\s\S]*?(?=\n\n|$)/g, '');
  
  // Remove explanations about code structure or implementation
  content = content.replace(/This improved response provides[\s\S]*?(?=\n\n|$)/g, '');
  content = content.replace(/I've structured the[\s\S]*?(?=\n\n|$)/g, '');
  content = content.replace(/I've designed this[\s\S]*?(?=\n\n|$)/g, '');
  
  // Remove explanations about what was added/changed
  content = content.replace(/I've added[\s\S]*?(?=\n\n|$)/g, '');
  content = content.replace(/I've included[\s\S]*?(?=\n\n|$)/g, '');
  content = content.replace(/I've implemented[\s\S]*?(?=\n\n|$)/g, '');
  
  // Remove explanations about Tailwind CSS
  content = content.replace(/The Tailwind CSS classes[\s\S]*?(?=\n\n|$)/g, '');
  content = content.replace(/Using Tailwind CSS[\s\S]*?(?=\n\n|$)/g, '');
  
  // Remove any additional notes or explanations at the end
  content = content.replace(/Note:[\s\S]*$/, '');
  content = content.replace(/Additional notes:[\s\S]*$/, '');
  
  // Clean up any double line breaks that might have been created
  content = content.replace(/\n{3,}/g, '\n\n');
  
  return content.trim();
}

/**
 * Process HTML content specifically to remove meta-explanations
 * @param content HTML content to process
 * @param options Processing options
 * @returns Processed HTML content
 */
export function cleanHtmlMetaExplanations(
  content: string,
  options: ProcessContentOptions = {}
): string {
  if (!content) return '';
  
  // Check if the content is actually HTML
  const isHtml = content.includes('<html') || 
                 content.includes('<body') || 
                 content.includes('<div') || 
                 content.includes('<h1') || 
                 content.includes('<p');
  
  if (!isHtml) {
    // If it's not HTML, just return the content as is
    return content;
  }
  
  // Remove any HTML comments that might contain explanations
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove any script tags that might contain explanations
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  // Remove any style tags that might contain explanations
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // Remove any meta-explanation paragraphs at the end
  // Look for patterns like <p>Note: This is a meta-explanation</p> at the end of the document
  content = content.replace(/<p[^>]*>(?:Note:|Additional notes:|Remember to)[\s\S]*?<\/p>\s*$/gi, '');
  
  // Remove any explanatory sections with specific class names
  content = content.replace(/<div[^>]*class="[^"]*explanation[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*class="[^"]*note[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Remove any sections with IDs that suggest they're explanations
  content = content.replace(/<[^>]*id="[^"]*explanation[^"]*"[^>]*>[\s\S]*?<\/[^>]*>/gi, '');
  content = content.replace(/<[^>]*id="[^"]*note[^"]*"[^>]*>[\s\S]*?<\/[^>]*>/gi, '');
  
  return content;
}

/**
 * Process market analysis content for display
 * @param content Raw market analysis content
 * @param options Processing options
 * @returns Processed content
 */
export function processMarketAnalysisContent(
  content: string,
  options: ProcessContentOptions = {}
): string {
  if (!content) return '';
  
  // First remove any meta-explanations
  content = removeMetaExplanations(content);
  
  // Process the content based on format
  if (options.format === 'html') {
    content = cleanHtmlMetaExplanations(content, options);
    return processHtmlContent(content, options);
  } else {
    return processMarkdownContent(content, options);
  }
}
