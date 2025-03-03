import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanHtml = (html: string) => {
  // Remove ```html and ``` markers
  return html
    .replace(/```html\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
};
