export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  systemMessage: string;
  userTemplate: string;
  variables: string[];
}

export interface TemplateInput {
  [key: string]: string | number | boolean;
}

export interface PromptError extends Error {
  code: 'MISSING_VARIABLE' | 'TEMPLATE_NOT_FOUND';
  details?: {
    templateId?: string;
    missingVariables?: string[];
  };
}
