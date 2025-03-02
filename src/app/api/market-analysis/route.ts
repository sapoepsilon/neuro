import { NextRequest, NextResponse } from "next/server";
import { generateMarketAnalysis } from "@/lib/market-analysis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectDescription } = body;

    if (!projectDescription) {
      return NextResponse.json(
        { error: "Project description is required" },
        { status: 400 }
      );
    }

    const analysisData = await generateMarketAnalysis(projectDescription);

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("Error in market analysis API:", error);
    return NextResponse.json(
      { error: "Failed to generate market analysis" },
      { status: 500 }
    );
  }
}
