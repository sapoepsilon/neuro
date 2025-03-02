import { PromptTemplate, TemplateInput, PromptError } from './types';
import { templates } from './templates';

export function getTemplateById(id: string): PromptTemplate {
  const template = templates.find(t => t.id === id);
  if (!template) {
    const error: PromptError = new Error(`Template with id '${id}' not found`);
    error.code = 'TEMPLATE_NOT_FOUND';
    error.details = { templateId: id };
    throw error;
  }
  return template;
}

export function validateTemplateInput(template: PromptTemplate, input: TemplateInput): void {
  const missingVariables = template.variables.filter(
    variable => !(variable in input)
  );

  if (missingVariables.length > 0) {
    const error: PromptError = new Error(
      `Missing required variables: ${missingVariables.join(', ')}`
    );
    error.code = 'MISSING_VARIABLE';
    error.details = {
      templateId: template.id,
      missingVariables
    };
    throw error;
  }
}

export function fillTemplate(template: PromptTemplate, input: TemplateInput): {
  systemMessage: string;
  userMessage: string;
} {
  validateTemplateInput(template, input);

  let userMessage = template.userTemplate;
  for (const [key, value] of Object.entries(input)) {
    userMessage = userMessage.replace(
      new RegExp(`{{${key}}}`, 'g'),
      String(value)
    );
  }

  return {
    systemMessage: template.systemMessage,
    userMessage
  };
}
