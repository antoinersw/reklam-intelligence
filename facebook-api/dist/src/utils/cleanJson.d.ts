import { CreativeAnalysis, LandingPageAnalysis, TextAnalysis } from '../facebook/models/interfaceGpt';
declare const cleanJsonString: (jsonString: string) => TextAnalysis | CreativeAnalysis | LandingPageAnalysis;
export default cleanJsonString;
