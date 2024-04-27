import { ConfigService } from '@nestjs/config';
import { GPTads } from 'src/facebook/models/FacebookInterfaces';
import { AnalysisResults, CreativeAnalysis, CreativeAnalysisResult, ImagePromptResponse, LandingPageAnalysis, LandingPageAnalysisResult, TextAnalysis } from 'src/facebook/models/interfaceGpt';
export declare class OpenAIService {
    private configService;
    private readonly OPEN_AI_API_KEY;
    private readonly OPEN_AI_API_URL;
    private readonly GPT_TEXT_MODEL;
    constructor(configService: ConfigService);
    sendTextPrompt(promptData: GPTads, brandName: string): Promise<TextAnalysis>;
    requestImageAnalysis(img_url: string, prompt: string, promptData: GPTads): Promise<ImagePromptResponse | null>;
    analyzeCreative(promptData: GPTads, brandName: string): Promise<CreativeAnalysisResult | null>;
    analyzeLandingPage(promptData: GPTads, brandName: string): Promise<LandingPageAnalysisResult | null>;
    analyzeAds(ads: GPTads[], brandName: string): Promise<AnalysisResults[]>;
    cleanJsonString(jsonString: string): TextAnalysis | CreativeAnalysis | LandingPageAnalysis;
}
