import { PromptTemplate } from './types';

export const templates: PromptTemplate[] = [
  {
    id: 'mission-statement',
    name: 'Mission Statement Generator',
    description: 'Generates a compelling mission statement for a company or organization',
    systemMessage: `You are an expert in crafting clear, inspiring mission statements that capture an organization's purpose and values. Follow these guidelines:
- Keep it concise and memorable
- Focus on impact and value
- Use active, inspiring language
- Avoid jargon and buzzwords
- Make it specific to the organization`,
    userTemplate: `Create a mission statement for {{companyName}}, a {{industry}} company that {{mainActivity}}.
Consider these key aspects:
- Target audience: {{targetAudience}}
- Key values: {{values}}
- Unique approach: {{uniqueApproach}}`,
    variables: ['companyName', 'industry', 'mainActivity', 'targetAudience', 'values', 'uniqueApproach']
  },
  {
    id: 'product-description',
    name: 'Product Description Generator',
    description: 'Creates engaging product descriptions with key features and benefits',
    systemMessage: `You are a skilled product copywriter who creates compelling, benefit-focused product descriptions. Follow these principles:
- Lead with the most compelling benefit
- Use vivid, descriptive language
- Highlight unique selling points
- Include specific features and their benefits
- Maintain the brand's tone of voice`,
    userTemplate: `Write a product description for {{productName}}, a {{category}} product.
Key details to include:
- Main benefit: {{mainBenefit}}
- Key features: {{features}}
- Target user: {{targetUser}}
- Price point: {{pricePoint}}
- Brand tone: {{brandTone}}`,
    variables: ['productName', 'category', 'mainBenefit', 'features', 'targetUser', 'pricePoint', 'brandTone']
  }
];
