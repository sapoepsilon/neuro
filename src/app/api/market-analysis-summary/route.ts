import { NextRequest, NextResponse } from "next/server";
import { generateMarketAnalysisSummary } from "@/lib/market-analysis";

export async function POST(request: NextRequest) {
  try {
    const { analysisContent } = await request.json();

    if (!analysisContent) {
      return NextResponse.json(
        { error: "Analysis content is required" },
        { status: 400 }
      );
    }

    // Generate the summary
    const summary = await generateMarketAnalysisSummary(analysisContent);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error in market analysis summary API:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
