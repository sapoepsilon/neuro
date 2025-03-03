import { NextRequest } from "next/server";
import { LLMEngine } from "@/lib/llm";
import { getTemplateById, fillTemplate } from "@/lib/prompts";
import type { PromptError } from "@/lib/prompts";

export interface GenerateRequest {
  templateId: string;
  input: Record<string, string | number | boolean>;
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
}

export interface SuccessResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as GenerateRequest;
    if (!body.templateId || !body.input) {
      return Response.json(
        {
          error: {
            message: "Missing required fields: templateId or input",
            code: "INVALID_REQUEST",
          },
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Get and fill template
    const template = getTemplateById(body.templateId);
    const filled = fillTemplate(template, body.input);

    // Initialize LLM engine and generate response
    const llm = new LLMEngine();
    if (!llm.isAvailable()) {
      return Response.json(
        {
          error: {
            message: "LLM service is not available",
            code: "SERVICE_UNAVAILABLE",
          },
        } as ErrorResponse,
        { status: 503 }
      );
    }

    const response = await llm.generateCompletion(filled.userMessage, {
      systemMessage: filled.systemMessage,
    });

    console.log(`response: ${JSON.stringify(response)}`);

    return Response.json(response as SuccessResponse);
  } catch (error: unknown) {
    // Check if error matches PromptError shape
    if (
      error instanceof Error &&
      "code" in error &&
      "details" in error &&
      typeof (error as PromptError).code === "string"
    ) {
      const promptError = error as PromptError;
      return Response.json(
        {
          error: {
            message: promptError.message,
            code: promptError.code,
            details: promptError.details,
          },
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return Response.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          code: "INTERNAL_ERROR",
        },
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
