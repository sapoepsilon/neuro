import { LLMAdapter, LLMOptions, LLMResponse } from './types';
import { OpenAIAdapter } from './openai';

export class LLMEngine {
  private adapter: LLMAdapter;

  constructor(adapter?: LLMAdapter) {
    this.adapter = adapter || new OpenAIAdapter();
  }

  isAvailable(): boolean {
    return this.adapter.isAvailable();
  }

  async generateCompletion(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    return this.adapter.generateCompletion(prompt, options);
  }

  async generateJSON<T>(
    prompt: string,
    options?: LLMOptions
  ): Promise<T> {
    const enhancedPrompt = `${prompt}\n\nRespond with valid JSON only.`;
    const response = await this.generateCompletion(enhancedPrompt, {
      ...options,
      temperature: 0, // Use deterministic output for JSON
    });

    try {
      return JSON.parse(response.content) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse JSON response from LLM: ${error.message}`);
      }
      throw new Error('Failed to parse JSON response from LLM: Unknown error');
    }
  }
}
