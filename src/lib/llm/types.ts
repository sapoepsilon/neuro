export interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMError extends Error {
  code?: string;
  status?: number;
}

export interface LLMAdapter {
  generateCompletion(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
  isAvailable(): boolean;
}
