import OpenAI from 'openai';
import { LLMAdapter, LLMOptions, LLMResponse, LLMError } from './types';

export class OpenAIAdapter implements LLMAdapter {
  private client: OpenAI | null = null;
  private readonly defaultModel = 'gpt-4o';

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async generateCompletion(prompt: string, options: LLMOptions = {}): Promise<LLMResponse> {
    if (!this.client) {
      throw new Error('OpenAI client is not initialized. Please check your API key.');
    }

    try {
      const messages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [];
      
      if (options.systemMessage) {
        messages.push({
          role: 'system',
          content: options.systemMessage,
        });
      }

      messages.push({
        role: 'user',
        content: prompt,
      });

      const response = await this.client.chat.completions.create({
        model: options.model || this.defaultModel,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
      });

      const completion = response.choices[0]?.message?.content;
      if (!completion) {
        throw new Error('No completion received from OpenAI');
      }

      return {
        content: completion,
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        const llmError: LLMError = new Error(error.message);
        llmError.code = error.code || undefined;
        llmError.status = error.status;
        throw llmError;
      }
      throw new Error('Unexpected error during OpenAI API call');
    }
  }
}
