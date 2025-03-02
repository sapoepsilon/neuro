"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarketAnalysisResult } from "@/lib/market-analysis";
import { MarketAnalysisSkeleton } from "@/components/market-analysis-skeleton";
import { SendIcon, Command } from "lucide-react";
import { MarketAnalysisSummary } from "./summary";
import { MarketAnalysisCharts } from "@/components/market-analysis-charts";

export function MarketAnalysisForm() {
  const [projectDescription, setProjectDescription] = useState("");
  const [analysisData, setAnalysisData] = useState<MarketAnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Check if user is on macOS
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!projectDescription.trim()) {
        setError("Please enter a project description");
        return;
      }

      setIsLoading(true);
      setError(null);

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

  // Add keyboard shortcut handler for Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (!isLoading && projectDescription.trim()) {
          handleSubmit(e as unknown as React.FormEvent);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
                <SendIcon className="w-5 h-5 mr-2" />
                <span className="mr-2">Generate Market Analysis</span>
                <div className="flex items-center text-xs opacity-80 bg-white/10 px-2 py-1 rounded">
                  {isMac ? (
                    <Command className="w-3.5 h-3.5 mr-1" />
                  ) : (
                    <span className="font-mono mr-1">Ctrl</span>
                  )}
                  <span>+</span>
                  <span className="ml-1">Enter</span>
                </div>
              </>
            )}
          </Button>
        </div>
      </GlassCard>

      {isLoading ? (
        <MarketAnalysisSkeleton />
      ) : (
        analysisData && (
          <div className="space-y-8">
            {/* Charts section */}
            {analysisData.chartData && (
              <GlassCard className="p-8">
                <h2 className="text-xl font-semibold mb-4 text-pastel-blue-dark">
                  Market Analysis Charts
                </h2>
                <MarketAnalysisCharts chartData={analysisData.chartData} />
              </GlassCard>
            )}

            {/* Analysis content */}
            <MarketAnalysisSummary analysisData={analysisData} />
          </div>
        )
      )}
    </div>
  );
}
