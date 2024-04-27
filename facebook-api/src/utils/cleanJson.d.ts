import { CreativeAnalysis, LandingPageAnalysis, TextAnalysis } from "../models/interfaceGpt";
declare const cleanJsonString: (jsonString: string) => TextAnalysis | CreativeAnalysis | LandingPageAnalysis;
export default cleanJsonString;
