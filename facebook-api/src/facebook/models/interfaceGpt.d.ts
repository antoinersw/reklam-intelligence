export interface TextAnalysis {
    location: string;
    technology_feature: string;
    key_selling_point: string;
    age_range: string;
    genders: string;
    description: string;
    focus: string;
    promotional_strategies: string;
    platforms: string;
    strategies: string;
    strategic_positioning: string;
    recommendations: string;
}
export interface TextAnalysisError {
    location: string;
    technology_feature: string;
    key_selling_point: string;
    age_range: string;
    genders: string;
    description: string;
    focus: string;
    promotional_strategies: string;
    platforms: string;
    strategies: string;
    strategic_positioning: string;
    recommendations: string;
}
export interface LandingPageAnalysis {
    brand_elements: string;
    communication_tone: string;
    brand_image_consistency: string;
    title_and_subtitles_clarity: string;
    persuasive_content: string;
    keywords_usage: string;
    navigation_ease: string;
    responsive_design: string;
    visual_quality: string;
    calls_to_action_cta: string;
    visibility: string;
    message_clarity: string;
    forms_conciseness: string;
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
export interface CreativeAnalysis {
    product_type: string;
    key_message: string;
    key_features: string[];
    colors: string;
    design_type: string;
    interactivity: string;
    message_clarity: string;
    visual_impact: string;
    branding: string;
    area_of_optimization: string;
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
export interface ImagePromptResponse {
    response: any;
    eu_total_reach: number;
    creative_src: string;
    landing_page_src: string | null;
}
export interface CreativeAnalysisResult {
    response: CreativeAnalysis;
    eu_total_reach: number;
    creative_src: string;
    ad_delivery_start_time: string;
    full_ad_src: string;
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
