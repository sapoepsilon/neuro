import { removeMetaExplanations, cleanHtmlMetaExplanations } from '../lib/market-analysis/content-processing';

// Test content with meta-explanations
const testContent = `
<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-6 text-primary">Market Analysis: Junk Removal Business in Salt Lake City</h1>
  
  <h2 class="text-2xl font-semibold mb-4 text-primary">Project Summary</h2>
  <p class="my-4 text-gray-800 dark:text-gray-200">The project involves starting a junk removal business in Salt Lake City, Utah. This service would help residents and businesses remove unwanted items, debris, and waste from their properties.</p>
  
  <h2 class="text-2xl font-semibold mb-4 text-primary">Key Competitors</h2>
  <ul class="list-disc pl-5 space-y-2 my-4">
    <li class="text-gray-800 dark:text-gray-200"><span class="font-semibold">1-800-GOT-JUNK</span> - National franchise with strong brand recognition</li>
    <li class="text-gray-800 dark:text-gray-200"><span class="font-semibold">College Hunks Hauling Junk</span> - Growing franchise with marketing appeal</li>
    <li class="text-gray-800 dark:text-gray-200"><span class="font-semibold">Junk King</span> - Established franchise with eco-friendly focus</li>
  </ul>
</div>

Key improvements and explanations:
* **HTML Structure and Tailwind CSS:** The code is now properly structured with HTML5 and utilizes Tailwind CSS classes as requested. This makes the output visually appealing and responsive.
* **Clear Sections:** The report is divided into clear sections with appropriate headings.
* **Detailed Analysis:** Each section provides a more in-depth analysis of the specific topic.
* **Market Trends and Opportunities:** These sections are expanded to include more relevant trends and actionable opportunities.
`;

// Test content with HTML meta-explanations
const testHtmlContent = `
<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-6 text-primary">Market Analysis: Junk Removal Business in Salt Lake City</h1>
  
  <h2 class="text-2xl font-semibold mb-4 text-primary">Project Summary</h2>
  <p class="my-4 text-gray-800 dark:text-gray-200">The project involves starting a junk removal business in Salt Lake City, Utah. This service would help residents and businesses remove unwanted items, debris, and waste from their properties.</p>
  
  <h2 class="text-2xl font-semibold mb-4 text-primary">Key Competitors</h2>
  <ul class="list-disc pl-5 space-y-2 my-4">
    <li class="text-gray-800 dark:text-gray-200"><span class="font-semibold">1-800-GOT-JUNK</span> - National franchise with strong brand recognition</li>
    <li class="text-gray-800 dark:text-gray-200"><span class="font-semibold">College Hunks Hauling Junk</span> - Growing franchise with marketing appeal</li>
    <li class="text-gray-800 dark:text-gray-200"><span class="font-semibold">Junk King</span> - Established franchise with eco-friendly focus</li>
  </ul>
  
  <div class="explanation">
    <p>Note: This HTML structure uses Tailwind CSS for styling. The classes provide responsive design and consistent appearance.</p>
  </div>
  
  <p>Remember to replace the placeholder data with actual research findings.</p>
</div>
`;

// Test the removeMetaExplanations function
console.log("=== Testing removeMetaExplanations ===");
const cleanedContent = removeMetaExplanations(testContent);
console.log(cleanedContent);
console.log("\n\n");

// Test the cleanHtmlMetaExplanations function
console.log("=== Testing cleanHtmlMetaExplanations ===");
const cleanedHtmlContent = cleanHtmlMetaExplanations(testHtmlContent, {});
console.log(cleanedHtmlContent);
