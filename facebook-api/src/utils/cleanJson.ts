import {
  CreativeAnalysis,
  LandingPageAnalysis,
  TextAnalysis,
} from '../facebook/models/interfaceGpt';

const cleanJsonString = (
  jsonString: string,
): TextAnalysis | CreativeAnalysis | LandingPageAnalysis => {
  // Step 1: Replace single quotes around keys and values with double quotes
  console.log('TEST => ', jsonString);

  const cleanedString = jsonString.replace(/`/g, '').replace(/json/g, '');

  // Return the cleaned string
  return JSON.parse(cleanedString);
};

export default cleanJsonString;
