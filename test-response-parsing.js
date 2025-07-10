// Test file for OpenAI response parsing
// Run with: node test-response-parsing.js

// Mock response data (to be replaced with real data from debug logs)
const mockResponses = [
  {
    model: "gpt-4o",
    description: "Clean JSON response",
    response: `{"reviews": [{"lineNumber": "10", "reviewComment": "Consider using const instead of let"}]}`
  },
  {
    model: "gpt-4",
    description: "Markdown-wrapped JSON response",
    response: `\`\`\`json
{"reviews": [{"lineNumber": "15", "reviewComment": "This function could be simplified"}]}
\`\`\``
  },
  {
    model: "gpt-3.5-turbo",
    description: "Markdown-wrapped with extra whitespace",
    response: `\`\`\`json

{"reviews": [{"lineNumber": "20", "reviewComment": "Missing error handling"}]}

\`\`\``
  }
];

// Parsing function (copied from main.ts logic)
function parseOpenAIResponse(responseText) {
  // Always clean markdown-wrapped JSON (some models still return wrapped JSON even with json_object mode)
  let cleanedText = responseText;
  
  // Remove markdown code block wrapper if present
  if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/, '');  // Remove opening ```json
  }
  if (cleanedText.endsWith('```')) {
    cleanedText = cleanedText.replace(/\n?\s*```\s*$/, '');       // Remove closing ```
  }
  
  cleanedText = cleanedText.trim();
  
  try {
    return JSON.parse(cleanedText).reviews;
  } catch (parseError) {
    console.error("JSON parse error");
    console.error("Original response:", responseText);
    console.error("Cleaned text:", cleanedText);
    console.error("Parse error:", parseError);
    return null;
  }
}

// Test function
function runTests() {
  console.log("Testing OpenAI response parsing...\n");
  
  mockResponses.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`Model: ${testCase.model}`);
    console.log(`Input: ${JSON.stringify(testCase.response)}`);
    
    const result = parseOpenAIResponse(testCase.response);
    
    if (result && Array.isArray(result)) {
      console.log("✅ SUCCESS - Parsed reviews:", result);
    } else {
      console.log("❌ FAILED - Could not parse response");
    }
    console.log("---\n");
  });
}

// Run tests
runTests();

// Instructions for adding real data:
console.log("TO ADD REAL DATA:");
console.log("1. Run the AI code reviewer with debug prints enabled");
console.log("2. Copy the raw response from the debug logs");
console.log("3. Add it to the mockResponses array above");
console.log("4. Run this test file again to verify parsing works"); 