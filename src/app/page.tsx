"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { ErrorResponse, SuccessResponse } from "./api/generate/route";
import { ResultsCard } from "@/components/ResultsCard";

export default function Home() {
  const [mvpIdea, setMvpIdea] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuccessResponse | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: "mission-statement",
          input: {
            productIdea: mvpIdea,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data as ErrorResponse);
        return;
      }

      setResult(data as SuccessResponse);
    } catch (err: unknown) {
      setError({
        error: {
          message:
            err instanceof Error ? err.message : "Failed to generate roadmap",
          code: "NETWORK_ERROR",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden noise-texture">
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl justify-center items-center">
          {/* Hero Card */}
          <div className="glass-card p-8 mb-10 backdrop-blur-[10px] bg-white/60 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl">
            <div className="text-center mb-8">
              <h1
                className="text-[3.5rem] leading-[1.2] font-bold mb-4 text-white"
              >
                Neuro MVP
              </h1>
              <p className="text-lg text-white/90">
                Turn your startup idea into an actionable development plan
              </p>
            </div>

            <form
              onSubmit={handleGenerateRoadmap}
              className="w-full flex flex-col items-center space-y-6"
            >
              <div className="w-full">
                <Textarea
                  value={mvpIdea}
                  onChange={(e) => setMvpIdea(e.target.value)}
                  placeholder="Describe your MVP idea..."
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-white/30 rounded-xl h-12 overflow-hidden transition-all duration-200 p-4 text-white placeholder:text-white/60"
                  style={{
                    height: mvpIdea ? "auto" : "48px",
                    minHeight: "48px",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isLoading}
                className="relative bg-primary hover:bg-primary-hover text-white text-lg font-semibold px-8 py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden group noise-texture"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>See what we can do</span>
                    <Sparkles
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isHovered ? "text-white" : "text-white/70"
                      }`}
                    />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
        {/* Results Section */}
        {result && (
          <ResultsCard
            content={result.content}
            model={result.model}
            usage={result.usage}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 glass-card p-6 rounded-xl border border-red-400/50 bg-red-500/10">
            <p className="text-white/90">{error.error.message}</p>
            {error.error.code && (
              <p className="text-sm mt-2 text-white/70">
                Error code: {error.error.code}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
