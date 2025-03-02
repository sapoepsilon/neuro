import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Define types for grounding metadata
export interface GroundingMetadata {
  webSearchQueries?: string[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  groundingSupports?: Array<{
    segment: {
      startIndex?: number;
      endIndex?: number;
      text: string;
    };
    groundingChunkIndices: number[];
    confidenceScores: number[];
  }>;
}

// Extend the GenerateContentCandidate type to include groundingMetadata
declare module "@google/generative-ai" {
  interface GenerateContentCandidate {
    groundingMetadata?: GroundingMetadata;
  }
  
  // Extend ModelParams to include tools property
  interface ModelParams {
    tools?: any[];
  }
  
  // Extend RequestOptions to include apiVersion
  interface RequestOptions {
    apiVersion?: string;
  }
}

// Singleton Gemini client
class GeminiClient {
  private static instance: GeminiClient;
  private client: GoogleGenerativeAI;
  private gemini2Model: GenerativeModel;
  private gemini15Model: GenerativeModel;

  private constructor() {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    this.client = new GoogleGenerativeAI(API_KEY);

    // Initialize models
    // For Gemini 2.0, we need to configure the model with tools when making the request
    // not when initializing the model
    this.gemini2Model = this.client.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // For Gemini 1.5, we use googleSearchRetrieval
    // Note: This approach is only compatible with Gemini 1.5 Flash
    this.gemini15Model = this.client.getGenerativeModel(
      {
        model: "models/gemini-1.5-flash",
        tools: [
          {
            googleSearchRetrieval: {
              dynamicRetrievalConfig: {
                mode: "MODE_DYNAMIC",
                dynamicThreshold: 0.7,
              },
            },
          },
        ],
      },
      { apiVersion: "v1beta" }
    );
  }

  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) {
      GeminiClient.instance = new GeminiClient();
    }
    return GeminiClient.instance;
  }

  /**
   * Generate content using Gemini 2.0 with Google Search as a tool
   * For Gemini 2.0, we use Search as a tool which allows the model to decide when to use Google Search
   */
  public async generateWithGemini2(prompt: string, temperature: number = 0.7) {
    // For Gemini 2.0, we need to use a different approach to configure tools
    // The tools parameter needs to be passed when creating the model config
    const model = this.client.getGenerativeModel({
      model: "gemini-2.0-flash",
      tools: [{ googleSearch: {} }],
    });

    return model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
      },
    });
  }

  /**
   * Generate content using Gemini 2.0 without any tools
   * This is useful for simple text generation tasks that don't require search
   */
  public async generateWithoutTools(prompt: string, temperature: number = 0.7) {
    const model = this.client.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature,
      },
    });

    return model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
  }

  /**
   * Generate content using Gemini 1.5 Flash with dynamic Google Search retrieval
   * This uses the pre-configured model with googleSearchRetrieval
   */
  public async generateWithGemini15(prompt: string, temperature: number = 0.7) {
    return this.gemini15Model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
      },
    });
  }

  /**
   * Generate content using Gemini 2.0 with structured JSON output
   * This uses a prompt-based approach to request structured data
   */
  public async generateWithStructuredOutput(
    prompt: string, 
    schema: any, 
    temperature: number = 0.7,
    model: string = "gemini-2.0-flash"
  ) {
    // Create a prompt that instructs the model to return data in the specified format
    const schemaString = JSON.stringify(schema, null, 2);
    const structuredPrompt = `
${prompt}

IMPORTANT: You must respond ONLY with a valid JSON object that follows this schema:
${schemaString}

Do not include any explanations, markdown formatting, or anything else outside the JSON object.
Just return the raw JSON object that matches the schema.
`;

    const genModel = this.client.getGenerativeModel({
      model: model,
      generationConfig: {
        temperature,
      },
    });

    return genModel.generateContent({
      contents: [{ role: "user", parts: [{ text: structuredPrompt }] }],
    });
  }

  /**
   * Get grounding metadata from response (if available)
   * This helper method extracts the grounding metadata from the response
   */
  public getGroundingMetadata(
    response: unknown
  ): GroundingMetadata | undefined {
    try {
      const typedResponse = response as { candidates: { groundingMetadata?: GroundingMetadata }[] };
      return typedResponse.candidates?.[0]?.groundingMetadata;
    } catch (error) {
      console.error("Error accessing grounding metadata:", error);
      return undefined;
    }
  }

  /**
   * Get search entry point rendered content (Google Search Suggestions)
   * This helper method extracts the rendered content for Google Search Suggestions
   */
  public getSearchSuggestions(response: unknown): string | undefined {
    try {
      const typedResponse = response as {
        candidates: {
          groundingMetadata?: {
            searchEntryPoint?: { 
              renderedContent?: string 
            };
          };
        }[];
      };
      
      return typedResponse.candidates?.[0]?.groundingMetadata?.searchEntryPoint?.renderedContent;
    } catch (error) {
      console.error("Error accessing search suggestions:", error);
      return undefined;
    }
  }
}

// Export the singleton instance
export const geminiClient = GeminiClient.getInstance();
