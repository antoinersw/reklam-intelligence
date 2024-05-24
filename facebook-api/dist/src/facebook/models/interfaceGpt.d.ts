export interface TextAnalysisError {
    value_proposition: string;
    promises: string;
    genders: string;
    emotions: string;
    tone: string;
    description: string;
    cta: string;
    problem_solving: string;
}
export interface LandingPageAnalysis {
    brand_elements: string;
    communication_tone: string;
    brand_image_consistency: string;
    title_and_subtitles_clarity: string;
    persuasive_content: string;
    keywords_usage: string;
    navigation_ease: string;
    visual_quality: string;
    cta: string;
    message_clarity: string;
    social_proof_elements: string;
    sense_of_urgency: string;
}
export interface ReportJsonData {
    textAnalysis: TextAnalysis;
    creativeAnalysis: CreativeAnalysis;
    landingPageAnalysis: LandingPageAnalysis;
    eu_total_reach: number;
    creative_src: string;
    landing_page_src: string;
    full_ad_src: string;
}
export interface ChatCompletionResponseError {
    error: {
        message: string;
        type: string;
        param: string;
        code: string;
    };
}
export interface AnalysisResults {
    textAnalysis: TextAnalysis;
    creativeAnalysis: CreativeAnalysisResult | CreativeAnalysisResultError;
    landingPageAnalysis: LandingPageAnalysisResult | LandingPageAnalysisResultError;
}
export interface TextAnalysis {
    value_proposition: string;
    promises: string;
    genders: string;
    emotions: string;
    tone: string;
    cta: string;
    problem_solving: string;
}
export interface CreativeAnalysis {
    key_message: string;
    key_features: string[];
    colors: string;
    design_type: string;
    cta: string;
    message_clarity: string;
    visual_impact: string;
    branding: string;
    area_of_optimization: string;
}
export interface CreativeAnalysisResult {
    response: CreativeAnalysis;
    eu_total_reach: number;
    creative_src: string;
    ad_delivery_start_time: string;
    full_ad_src: string;
}
export interface ImagePromptResponse {
    response: any;
    eu_total_reach: number;
    creative_src: string;
    landing_page_src: string | null;
}
export interface LandingPageAnalysisResult {
    response: LandingPageAnalysis;
    landing_page_src: string;
}
export interface CreativeAnalysisResultError {
    response: string;
}
export interface LandingPageAnalysisResultError {
    response: string;
}
