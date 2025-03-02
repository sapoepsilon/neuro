/**
 * Test file for chart data generation and visualization
 */

import { sanitizeChartData, getFallbackChartData } from '../lib/market-analysis/chart-data';

/**
 * Test sanitizeChartData function
 */
function testSanitizeChartData() {
  console.log('Testing sanitizeChartData function...');
  
  // Test with valid data
  const validData = {
    pieChart: [
      { name: 'Segment A', value: 30 },
      { name: 'Segment B', value: 40 },
      { name: 'Segment C', value: 30 }
    ],
    areaChart: [
      { name: '2020', value: 100 },
      { name: '2021', value: 120 },
      { name: '2022', value: 150 }
    ],
    barChart: [
      { name: 'Metric 1', value: 80, secondaryValue: 70 },
      { name: 'Metric 2', value: 60, secondaryValue: 50 }
    ]
  };
  
  console.log('Sanitized valid data:', sanitizeChartData(validData));
  
  // Test with invalid data (missing names, non-numeric values)
  const invalidData = {
    pieChart: [
      { name: '', value: 'not-a-number' },
      { name: undefined, value: 40 },
      { value: 30 }
    ],
    areaChart: [
      { value: 100 },
      { name: '2021', value: null },
      { name: '2022', value: undefined }
    ],
    barChart: [
      { name: 'Metric 1', value: 'invalid', secondaryValue: 'also-invalid' },
      { name: '', value: 60, secondaryValue: undefined }
    ]
  };
  
  console.log('Sanitized invalid data:', sanitizeChartData(invalidData));
  
  // Test with empty data
  console.log('Sanitized empty data:', sanitizeChartData({}));
  
  // Test fallback data
  console.log('Fallback chart data:', getFallbackChartData());
}

/**
 * Run all tests
 */
function runTests() {
  testSanitizeChartData();
}

// Run tests
runTests();
