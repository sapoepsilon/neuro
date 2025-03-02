"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GoogleSearchSuggestions } from "@/components/google-search-suggestions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarketAnalysisResult } from "@/lib/market-analysis";
import { MarketAnalysisSkeleton } from "@/components/market-analysis-skeleton";
import {
  SendIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Download,
} from "lucide-react";
import { MarketAnalysisCharts } from "@/components/market-analysis-charts";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  mapOklchToWesAndersonPalette, 
  processElementsForPdfExport, 
  applyOklchOverrideStyles,
  preprocessDocumentForPdfExport,
  processRechartsForPdfExport,
  WES_ANDERSON_PALETTE
} from "@/lib/color-utils";

export function MarketAnalysisForm() {
  const [projectDescription, setProjectDescription] = useState("");
  const [analysisData, setAnalysisData] = useState<MarketAnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [summaryHtml, setSummaryHtml] = useState<string>("");
  const analysisContentRef = useRef<HTMLDivElement>(null);

  // Define handleSubmit with useCallback to avoid dependency issues
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!projectDescription.trim()) {
        setError("Please enter a project description");
        return;
      }

      setIsLoading(true);
      setError(null);
      setShowFullAnalysis(false); // Reset full analysis visibility for new analysis
      setSummaryHtml(""); // Clear previous summary

      try {
        const response = await fetch("/api/market-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectDescription }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to generate market analysis"
          );
        }

        const data = await response.json();
        setAnalysisData(data);
        console.log("Analysis data received:", data);
        console.log("Chart data available:", !!data.chartData);

        // Reset sources visibility for new analysis
        setShowSources(false);

        // If the API doesn't provide a summary, fetch it separately
        if (!data.summary && data.content) {
          await fetchSummary(data.content);
        } else if (data.summary) {
          setSummaryHtml(`<p>${data.summary}</p>`);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [projectDescription]
  );

  // Function to fetch summary separately
  const fetchSummary = async (content: string) => {
    setIsSummaryLoading(true);
    try {
      const response = await fetch("/api/market-analysis-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisContent: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummaryHtml(`<p>${data.summary}</p>`);
    } catch (error) {
      console.error("Error fetching summary:", error);
      // Fallback to extracting first paragraph
      extractFirstParagraph();
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Fallback method to extract first paragraph
  const extractFirstParagraph = () => {
    if (analysisData?.htmlContent) {
      try {
        // Use a simple regex to extract the first paragraph
        const match = analysisData.htmlContent.match(/<p>(.*?)<\/p>/);
        if (match && match[0]) {
          setSummaryHtml(match[0]);
        } else {
          setSummaryHtml("<p>No summary available.</p>");
        }
      } catch (err: unknown) {
        console.error("Error extracting summary:", err);
        setSummaryHtml("<p>No summary available.</p>");
      }
    }
  };

  // Extract summary from HTML content when analysis data changes
  useEffect(() => {
    if (analysisData?.htmlContent && !summaryHtml) {
      // If we already have analysis data but no summary, try to extract it
      if (analysisData.summary) {
        setSummaryHtml(`<p>${analysisData.summary}</p>`);
      } else if (analysisData.content) {
        fetchSummary(analysisData.content);
      } else {
        extractFirstParagraph();
      }
    }
  }, [analysisData, summaryHtml]);

  // Function to handle PDF export
  const handleExportPDF = async () => {
    if (!analysisData || !analysisContentRef.current) {
      toast.error("No analysis data to export");
      return;
    }

    setIsPdfLoading(true);
    toast.info("Preparing PDF export...");

    try {
      // First, inject a global stylesheet to force hex colors
      const globalStylesheet = document.createElement('style');
      globalStylesheet.id = 'pdf-export-global-styles';
      globalStylesheet.textContent = `
        * {
          color: #333333 !important;
          background-color: transparent !important;
          border-color: #DDDDDD !important;
        }
        [style*="oklch"] {
          color: #333333 !important;
          background-color: transparent !important;
          border-color: #DDDDDD !important;
        }
        svg text { fill: #333333 !important; }
        svg path { fill: #A4CAED !important; stroke: #333333 !important; }
        .recharts-sector { fill: #A4CAED !important; }
        .recharts-curve { stroke: #5A8BBF !important; }
        .recharts-bar-rectangle { fill: #A4CAED !important; }
      `;
      document.head.appendChild(globalStylesheet);

      // Create a temporary container for PDF export
      const pdfContainer = document.createElement("div");
      pdfContainer.id = "pdf-export-container";
      pdfContainer.style.width = "800px"; // Fixed width for PDF
      pdfContainer.style.padding = "20px";
      pdfContainer.style.backgroundColor = "#F2E8DC"; // Pastel Beige background
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px"; // Position off-screen
      document.body.appendChild(pdfContainer);

      // Add title and project description
      const titleElement = document.createElement("h1");
      titleElement.textContent = "Market Analysis Report";
      titleElement.style.fontSize = "24px";
      titleElement.style.fontWeight = "bold";
      titleElement.style.marginBottom = "16px";
      titleElement.style.color = "#3A6EA5"; // Primary button color
      pdfContainer.appendChild(titleElement);

      const projectDescElement = document.createElement("div");
      projectDescElement.innerHTML = `<h2 style="font-size: 18px; margin-bottom: 12px; font-weight: 600;">Project Description:</h2>
        <p style="margin-bottom: 20px; padding: 12px; background-color: rgba(255, 255, 255, 0.4); border-radius: 12px;">${projectDescription}</p>`;
      pdfContainer.appendChild(projectDescElement);

      // Clone the analysis content
      const contentClone = analysisContentRef.current.cloneNode(
        true
      ) as HTMLElement;

      // Remove any interactive elements or elements we don't want in the PDF
      const elementsToRemove = contentClone.querySelectorAll(
        ".toggle-button, button:not(.chart-button)"
      );
      elementsToRemove.forEach((el) => el.remove());

      // Make sure all charts are visible in the PDF
      const chartContainers = contentClone.querySelectorAll(".chart-container");
      chartContainers.forEach((container) => {
        (container as HTMLElement).style.display = "block";
      });

      pdfContainer.appendChild(contentClone);

      // Preprocess the document for PDF export (replaces oklch colors with hex)
      await preprocessDocumentForPdfExport(pdfContainer);
      
      // Specifically process Recharts elements in the PDF container
      processRechartsForPdfExport(pdfContainer);

      // Add a safety measure to replace any remaining oklch colors with hex
      // This is a more aggressive approach that directly modifies the HTML content
      const allElements = pdfContainer.querySelectorAll('*');
      allElements.forEach(el => {
        if (!(el instanceof HTMLElement)) return;
        
        // Replace any inline styles containing oklch
        if (el.style.cssText && el.style.cssText.includes('oklch')) {
          // Apply safe default styles
          el.style.color = WES_ANDERSON_PALETTE.text;
          el.style.backgroundColor = WES_ANDERSON_PALETTE.fallbackBackground;
          el.style.borderColor = WES_ANDERSON_PALETTE.fallbackBorder;
        }
        
        // Handle SVG elements specifically
        if (el.tagName.toLowerCase() === 'svg' || 
            el.tagName.toLowerCase() === 'path' || 
            el.tagName.toLowerCase() === 'rect' || 
            el.tagName.toLowerCase() === 'circle') {
          
          const fill = el.getAttribute('fill');
          if (fill && fill.includes('oklch')) {
            el.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
          }
          
          const stroke = el.getAttribute('stroke');
          if (stroke && stroke.includes('oklch')) {
            el.setAttribute('stroke', WES_ANDERSON_PALETTE.text);
          }
        }
      });

      // Directly modify all SVG elements to ensure they use hex colors
      const svgElements = pdfContainer.querySelectorAll('svg');
      svgElements.forEach(svg => {
        // Force explicit styling on SVG
        svg.setAttribute('style', 'overflow: visible; width: 100%; height: 100%;');
        
        // Fix text elements
        const textElements = svg.querySelectorAll('text');
        textElements.forEach(text => {
          text.setAttribute('fill', '#333333');
          text.setAttribute('font-family', 'Inter, system-ui, sans-serif');
        });
        
        // Fix path elements
        const pathElements = svg.querySelectorAll('path');
        pathElements.forEach(path => {
          const currentFill = path.getAttribute('fill');
          if (currentFill && (currentFill.includes('url') || currentFill.includes('oklch'))) {
            path.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
          }
          path.setAttribute('stroke', '#333333');
        });
        
        // Fix recharts specific elements
        const sectors = svg.querySelectorAll('.recharts-sector');
        sectors.forEach(sector => {
          sector.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
        });
        
        const bars = svg.querySelectorAll('.recharts-bar-rectangle');
        bars.forEach(bar => {
          bar.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
        });
        
        // Fix gradient definitions
        const defs = svg.querySelectorAll('defs');
        defs.forEach(def => {
          const gradients = def.querySelectorAll('linearGradient, radialGradient');
          gradients.forEach(gradient => {
            // Replace gradient stops with solid colors
            const stops = gradient.querySelectorAll('stop');
            stops.forEach(stop => {
              stop.setAttribute('stop-color', WES_ANDERSON_PALETTE.pastelBlue);
            });
          });
        });
      });

      // Add a safety style element directly to the container
      const safetyStyle = document.createElement('style');
      safetyStyle.textContent = `
        * {
          color: #333333 !important;
          background-color: transparent !important;
          border-color: #DDDDDD !important;
        }
        svg text { fill: #333333 !important; }
        svg path { fill: #A4CAED !important; stroke: #333333 !important; }
        .recharts-sector { fill: #A4CAED !important; }
        .recharts-curve { stroke: #5A8BBF !important; }
        .recharts-bar-rectangle { fill: #A4CAED !important; }
      `;
      pdfContainer.appendChild(safetyStyle);

      // Generate PDF using html2canvas and jsPDF with explicit configuration
      let canvas;
      try {
        // Force a small delay to ensure styles are applied
        await new Promise(resolve => setTimeout(resolve, 500));
        
        canvas = await html2canvas(pdfContainer, {
          scale: 1.5, // Higher scale for better quality
          useCORS: true,
          logging: false, // Disable logging to avoid console clutter
          backgroundColor: "#F2E8DC", // Pastel Beige background
          allowTaint: true, // Allow tainted canvas
          foreignObjectRendering: false, // Disable foreignObject rendering which can cause issues
          removeContainer: true, // Remove the container after rendering
          onclone: (clonedDoc) => {
            // Additional processing on the cloned document
            const clonedContainer = clonedDoc.getElementById('pdf-export-container');
            if (clonedContainer) {
              // Apply explicit styles to all elements
              const allElements = clonedContainer.querySelectorAll('*');
              allElements.forEach(el => {
                if (!(el instanceof HTMLElement)) return;
                
                // Replace any remaining oklch colors
                for (const prop of ['color', 'backgroundColor', 'borderColor']) {
                  const propValue = el.style[prop as any];
                  if (propValue && propValue.includes('oklch')) {
                    el.style[prop as any] = WES_ANDERSON_PALETTE.fallbackText;
                  }
                }
                
                // Force explicit colors on SVG elements
                if (el.tagName.toLowerCase() === 'svg') {
                  el.setAttribute('style', 'overflow: visible; width: 100%; height: 100%;');
                  
                  // Fix text elements
                  const textElements = el.querySelectorAll('text');
                  textElements.forEach(text => {
                    text.setAttribute('fill', '#333333');
                    text.setAttribute('font-family', 'Inter, system-ui, sans-serif');
                  });
                  
                  // Fix path elements
                  const pathElements = el.querySelectorAll('path');
                  pathElements.forEach(path => {
                    const currentFill = path.getAttribute('fill');
                    if (currentFill && (currentFill.includes('url') || currentFill.includes('oklch'))) {
                      path.setAttribute('fill', WES_ANDERSON_PALETTE.pastelBlue);
                    }
                    path.setAttribute('stroke', '#333333');
                  });
                }
              });
              
              // Apply Recharts-specific processing to the cloned document
              processRechartsForPdfExport(clonedContainer);
              
              // Add a safety style element to the cloned document
              const safetyStyle = clonedDoc.createElement('style');
              safetyStyle.textContent = `
                * {
                  color: #333333 !important;
                  background-color: transparent !important;
                  border-color: #DDDDDD !important;
                }
                svg text { fill: #333333 !important; }
                svg path { fill: #A4CAED !important; stroke: #333333 !important; }
                .recharts-sector { fill: #A4CAED !important; }
                .recharts-curve { stroke: #5A8BBF !important; }
                .recharts-bar-rectangle { fill: #A4CAED !important; }
              `;
              clonedDoc.head.appendChild(safetyStyle);
            }
          }
        });
      } catch (canvasError) {
        console.error("Error generating canvas:", canvasError);
        
        // Fallback approach: try with a simpler configuration
        toast.info("Trying alternative export method...");
        
        try {
          // Apply even more aggressive style overrides
          const styleOverride = document.createElement('style');
          styleOverride.textContent = `
            * {
              color: #333333 !important;
              background: #F2E8DC !important;
              border-color: #DDDDDD !important;
              font-family: Arial, sans-serif !important;
            }
            svg * {
              fill: #333333 !important;
              stroke: #333333 !important;
            }
          `;
          document.head.appendChild(styleOverride);
          
          // Try with simpler options
          canvas = await html2canvas(pdfContainer, {
            scale: 1, // Lower scale for better compatibility
            useCORS: true,
            backgroundColor: "#F2E8DC",
            logging: false,
            allowTaint: true,
            foreignObjectRendering: false,
          });
          
          // Clean up
          document.head.removeChild(styleOverride);
        } catch (fallbackError) {
          console.error("Fallback canvas generation failed:", fallbackError);
          throw new Error("PDF export failed after multiple attempts");
        }
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions to fit the content properly
      const imgWidth = 210; // A4 width in mm (210mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      // If content is longer than a single page, add additional pages
      while (position > -imgHeight) {
        position -= 297; // A4 height in mm (297mm)
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      }

      // Save the PDF
      pdf.save(`Market_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`);

      // Clean up
      document.body.removeChild(pdfContainer);
      document.head.removeChild(globalStylesheet);

      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Add keyboard shortcut handler for Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (!isLoading && projectDescription.trim()) {
          handleSubmit(new Event("submit") as any);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoading, projectDescription, handleSubmit]);

  return (
    <div className="space-y-10 w-full max-w-4xl mx-auto px-4">
      <GlassCard className="w-full p-8">
        <Textarea
          id="projectDescription"
          placeholder="Describe your project or business idea in detail... (e.g., 'A mobile app for personalized workout plans')"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="bg-white/40 backdrop-blur-sm border border-white/18 focus:border-pastel-blue-dark/50 rounded-xl min-h-[150px] py-4 px-5 text-base mb-6"
          disabled={isLoading}
        />

        {error && (
          <div className="text-pastel-red-dark text-sm p-4 rounded-lg bg-pastel-red/15 font-medium mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button
            onClick={handleSubmit}
            type="button"
            variant="default"
            size="lg"
            className="w-full noise-texture btn-high-contrast rounded-lg text-lg py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                <span>Generating Analysis...</span>
              </>
            ) : (
              <>
                <SendIcon className="h-5 w-5 mr-3" />
                <span>Generate Market Analysis</span>
              </>
            )}
          </Button>
          <div className="text-xs text-center text-muted-foreground">
            Press{" "}
            <kbd className="px-2 py-1 bg-white/20 rounded-md font-mono">
              ⌘ + Enter
            </kbd>{" "}
            to generate
          </div>
        </div>
      </GlassCard>

      {isLoading && (
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-pastel-blue-dark">
            Generating Market Analysis...
          </h2>
          <p className="text-muted-foreground mb-8">
            We&apos;re researching the market for your project. This may take a
            minute or two.
          </p>
          <MarketAnalysisSkeleton />
        </GlassCard>
      )}

      {!isLoading && analysisData && (
        <div className="space-y-10">
          {/* Chart Visualization - Moved to the top */}
          {analysisData.chartData && (
            <div id="market-analysis-charts">
              <MarketAnalysisCharts chartData={analysisData.chartData} />
            </div>
          )}

          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pastel-blue-dark">
                Market Analysis Results
              </h2>

              {/* Export to PDF button */}
              <Button
                onClick={handleExportPDF}
                variant="outline"
                size="sm"
                className="bg-white/40 hover:bg-white/60 flex items-center gap-2"
                disabled={isPdfLoading}
              >
                {isPdfLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-pastel-blue-dark border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export PDF</span>
                  </>
                )}
              </Button>
            </div>

            <div
              id="market-analysis-content"
              className="prose prose-lg max-w-none dark:prose-invert"
              ref={analysisContentRef}
            >
              {isSummaryLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-pastel-blue-dark border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-muted-foreground">Generating summary...</p>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: summaryHtml }} />
              )}

              {/* Toggle button for full analysis */}
              <Button
                onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                variant="outline"
                className="mb-6 w-full justify-between noise-texture bg-pastel-blue/8 border-pastel-blue/20 hover:bg-pastel-blue/10 mt-4"
              >
                <span>
                  {showFullAnalysis
                    ? "Hide Full Analysis"
                    : "Show Full Analysis"}
                </span>
                {showFullAnalysis ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </Button>

              {/* Full analysis content */}
              {showFullAnalysis && (
                <div
                  className="prose prose-lg max-w-none dark:prose-invert animate-in fade-in slide-in-from-top-2 duration-300 mt-4"
                  dangerouslySetInnerHTML={{ __html: analysisData.htmlContent }}
                />
              )}
            </div>

            {analysisData.isGrounded &&
              analysisData.groundingChunks &&
              analysisData.groundingChunks.length > 0 && (
                <div className="mt-10 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setShowSources(!showSources)}
                    className="flex items-center justify-between w-full text-left text-lg font-semibold text-btn-primary mb-4 hover:bg-pastel-blue/10 transition-all noise-texture bg-pastel-blue/8 p-4 rounded-lg border border-pastel-blue/20"
                  >
                    <span>Sources ({analysisData.groundingChunks.length})</span>
                    {showSources ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>

                  {showSources && (
                    <div className="grid grid-cols-1 gap-3 mt-5 pl-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {analysisData.groundingChunks.map(
                        (chunk, index) =>
                          chunk.web && (
                            <a
                              key={index}
                              href={chunk.web.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-btn-primary hover:underline flex items-center gap-3 p-3 rounded-lg hover:bg-pastel-blue/10 transition-colors"
                            >
                              <span className="inline-flex items-center justify-center bg-btn-primary/15 text-btn-primary rounded-full w-7 h-7 text-xs font-medium flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="line-clamp-1">
                                {chunk.web.title}
                              </span>
                            </a>
                          )
                      )}
                    </div>
                  )}
                </div>
              )}
          </GlassCard>

          {analysisData.isGrounded && analysisData.renderedContent && (
            <GoogleSearchSuggestions
              renderedContent={analysisData.renderedContent}
            />
          )}
        </div>
      )}
    </div>
  );
}
