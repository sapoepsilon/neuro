import { MarketAnalysisForm } from "@/components/market-analysis";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market Analysis - Neuro",
  description:
    "Generate comprehensive market analysis for your project using Google's Gemini AI",
  openGraph: {
    title: "Market Analysis - Neuro AI Project Manager",
    description: "Generate comprehensive market analysis for your project using Google's Gemini AI",
    type: "website",
  },
};

export default function MarketAnalysisPage() {
  return (
    <main className="container mx-auto py-6 md:py-12 px-4 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-3 md:mb-4">
            Market Analysis
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Generate comprehensive market analysis for your project using
            Google&apos;s Gemini AI. Get insights on competitors, market trends,
            opportunities, and market size.
          </p>
        </div>

        <MarketAnalysisForm />
      </div>
    </main>
  );
}
