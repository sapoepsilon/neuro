import DOMPurify from "dompurify";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface Usage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

interface ResultsCardProps {
  content: string;
  model?: string;
  usage?: Usage;
  title?: string;
}

// Configure DOMPurify once at module level
const sanitizeOptions = {
  USE_PROFILES: { html: true },
  ALLOWED_TAGS: ["article", "section", "h3", "h4", "p", "div", "ul", "li"],
  ADD_ATTR: ["class"],
};

export function ResultsCard({
  content,
  model,
  usage,
  title = "Your MVP Strategy",
}: ResultsCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    // Defer sanitization to after initial render
    const timer = setTimeout(() => {
      setSanitizedContent(DOMPurify.sanitize(content, sanitizeOptions));
    }, 100); // Small delay to ensure smooth animation
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="mt-8 glass-card p-6 fade-in ">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <div
            className={`transform transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-[#6D90B9]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#6D90B9]" />
            )}
          </div>
        </button>
      </div>

      <div
        className={`transition-all duration-200 ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        {sanitizedContent ? (
          <div
            className="mt-4 space-y-6 text-white text-left"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        ) : (
          <div className="mt-4 space-y-6 text-[#C9D4DD] text-center">
            Loading...
          </div>
        )}
        {usage && (
          <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <Sparkles className="w-4 h-4 text-[#96AD8E]" />
              {model && <span>Model: {model}</span>}
              <span>
                Usage: Prompt: {usage.promptTokens || 0}, Completion:{" "}
                {usage.completionTokens || 0}, Total: {usage.totalTokens || 0}
                Cost: $
                {(((usage.completionTokens || 0) * 0.01) / 1000).toFixed(
                  4
                )}{" "}
                (Output), $
                {(((usage.promptTokens || 0) * 0.0025) / 1000).toFixed(4)}{" "}
                (Input)
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
