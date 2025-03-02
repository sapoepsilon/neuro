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
