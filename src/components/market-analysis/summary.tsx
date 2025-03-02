"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { MarketAnalysisResult } from "@/lib/market-analysis";

interface MarketAnalysisSummaryProps {
  analysisData: MarketAnalysisResult;
}

export function MarketAnalysisSummary({ analysisData }: MarketAnalysisSummaryProps) {
  const [showSources, setShowSources] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [summaryHtml, setSummaryHtml] = useState<string>("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

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
      extractFirstParagraph();
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const extractFirstParagraph = () => {
    if (analysisData?.htmlContent) {
      try {
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

  useEffect(() => {
    if (analysisData?.htmlContent && !summaryHtml) {
      if (analysisData.summary) {
        setSummaryHtml(`<p>${analysisData.summary}</p>`);
      } else if (analysisData.content) {
        fetchSummary(analysisData.content);
      } else {
        extractFirstParagraph();
      }
    }
  }, [analysisData, summaryHtml]);

  return (
    <GlassCard className="w-full p-8">
      <div className="prose prose-lg max-w-none">
        {isSummaryLoading ? (
          <p className="text-gray-600">Generating summary...</p>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: showFullAnalysis
                ? analysisData.htmlContent || ""
                : summaryHtml,
            }}
          />
        )}
      </div>

      {analysisData.htmlContent && (
        <button
          onClick={() => setShowFullAnalysis(!showFullAnalysis)}
          className="flex items-center text-pastel-blue-dark hover:text-pastel-blue-darker font-medium mt-4"
        >
          {showFullAnalysis ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" />
              Show Full Analysis
            </>
          )}
        </button>
      )}

      {analysisData.sources && (
        <div className="mt-6">
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center text-pastel-blue-dark hover:text-pastel-blue-darker font-medium"
          >
            {showSources ? (
              <>
                <ChevronUpIcon className="w-4 h-4 mr-1" />
                Hide Sources
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4 mr-1" />
                Show Sources
              </>
            )}
          </button>

          {showSources && (
            <div className="mt-4 p-4 bg-white/20 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Sources:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {analysisData.sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pastel-blue-dark hover:text-pastel-blue-darker break-all"
                    >
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
