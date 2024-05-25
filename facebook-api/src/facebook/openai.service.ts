import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ChatCompletionResponse,
  GPTPayload,
  GPTads,
} from 'src/facebook/models/FacebookInterfaces';
import {
  AnalysisResults,
  CreativeAnalysis,
  CreativeAnalysisResult,
  ImagePromptResponse,
  LandingPageAnalysis,
  LandingPageAnalysisResult,
  TextAnalysis,
  TextAnalysisError,
} from 'src/facebook/models/interfaceGpt';

@Injectable()
export class OpenAIService {
  private readonly OPEN_AI_API_KEY: string;
  private readonly OPEN_AI_API_URL: string;
  private readonly GPT_TEXT_MODEL: string;
  constructor(private configService: ConfigService) {
    (this.OPEN_AI_API_KEY = this.configService.get<string>('OPEN_AI_API_KEY')),
      { infer: true };
    (this.OPEN_AI_API_URL = this.configService.get<string>('OPEN_AI_API_URL')),
      { infer: true };
    (this.GPT_TEXT_MODEL = this.configService.get<string>('GPT_TEXT_MODEL')),
      { infer: true };
  }

  async sendTextPrompt(
    promptData: GPTads,
    brandName: string,
  ): Promise<TextAnalysis|TextAnalysisError> {
    const system_content = `
ROLE: Imagine that you are a marketing strategy consultant for a new innovative technology. You need to analyze this Facebook text ad from the competition to provide a complete launch strategy. Here are the elements you must cover:
LANGUAGE : USE ONLY ENGLISH IN YOUR ANSWER.
JSON GUIDELINES:
value_proposition:Identify the unique selling points  that competitors emphasize to differentiate themselves,  for instance fast delivery, unbeatable quality, or unique features.
promises:Identify the promise that competitors emphasize to differentiate themselves, for instance fast delivery, unbeatable quality, or unique features.
genders: Is this product aimed at a specific gender, or is it universal? Why do you think so?
age_range: To which age group is this product primarily targeted? Why?
emotions:Determine the sentiments competitors aim to evoke, such as humor, urgency, or curiosity, and whether they use interactive elements like questions to engage the reader.
tone:Analyze the choice of language (plain vs. fancy terms) and the tone used (formal, playful, or authoritative) to understand the brand's persona and target audience.
cta:Identify the clear next steps or CTAs used in the ads (e.g., "Buy Now," "Learn More") to gain insights into later stages of the sales funnel and overall objectives.
problem_solving:Examine how competitors frame a problem and position their product or service as the solution within the ad copy, as this is a classic persuasion approach.
Use these guidelines to structure your analysis and fill in the following JSON with detailed and specific information for each category. The resulting JSON object should be in this format: {"q":"string","a":"string"} ONLY RESPOND WITH THIS JSON, NOTHING ELSE:
{"value_proposition":"","promises":"","genders":"","age_range":"","emotions":"","tone":"","cta":"","problem_solving":""}
AD TEXT :
${promptData.ad_creative_bodies}
  
    `;
    try {
      const body = JSON.stringify({
        model: this.GPT_TEXT_MODEL, // Specify the model you wish to use
        messages: [
          {
            role: 'system',
            content: system_content,
          },
          {
            role: 'user',
            content: JSON.stringify(promptData),
          },
        ],
        temperature: 1,
        max_tokens: 1500,
      });
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.OPEN_AI_API_KEY}`,
      };
      const response = await fetch(this.OPEN_AI_API_URL, {
        body,
        method: 'POST',
        headers,
      });
      const data: ChatCompletionResponse = await response.json();
      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }

      const result = this.cleanJsonString(data?.choices[0].message.content);
      console.log(
        'TXT PROMPT FINISHED BECAUSE =>',
        data.choices[0].finish_reason,
      );
      return result as TextAnalysis;
    } catch (error) {
      console.error('Unexpected error:', error);
      return {
      
        value_proposition:"",
        promises: "",
        genders: "",
        emotions: "",
        tone: "",
        description: "",
        cta: "",
        problem_solving:"",
      };
    }
  }

  async requestImageAnalysis(
    img_url: string,
    prompt: string,
    promptData: GPTads,
  ): Promise<ImagePromptResponse | null> {
    try {
      const body: GPTPayload = {
        model: 'gpt-4o-2024-05-13', // Specify the model you wish to use
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
          {
            role: 'user',
            content: [
              // {
              //   type: "text",
              //   text: "Analyse that image from a marketing perspective, what is the message ? How good it is ? what could be improved",
              // },
              {
                type: 'image_url',
                image_url: {
                  url: img_url as string,
                },
              },
            ],
          },
        ],
        temperature: 1,
        max_tokens: 2000,
      };
      console.log(
        'API URL FROM IAMGE => this.OPEN_AI_API_URL',
        this.OPEN_AI_API_URL,
      );
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.OPEN_AI_API_KEY}`,
      };
      const response = await fetch(this.OPEN_AI_API_URL, {
        body: JSON.stringify(body),
        method: 'POST',
        headers,
      });
      const { choices }: ChatCompletionResponse = await response.json();

      return {
        response: choices[0].message.content,
        eu_total_reach: promptData.eu_total_reach,
        creative_src: promptData.creative_src as string,
        landing_page_src: promptData.landing_page_src
          ? promptData.landing_page_src
          : null,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async analyzeCreative(
    promptData: GPTads,
    brandName: string,
  ): Promise<CreativeAnalysisResult | null> {
    const creative_prompt = `  I would like you to analyze this image from a ${brandName} advertisement on Facebook. This advertisement is targeted at ${JSON.stringify(
      promptData.target_ages,
    )} in ${JSON.stringify(promptData.target_locations)}.
      Please consider several essential aspects to provide me with a complete evaluation. Fill in the following information based on your analysis:
      You must provide an advanced marketing analysis.
      Key message that the product/service is trying to communicate:
      Key features of the product/service (list of 3 strengths, in 1 word each):
      Main colors used in the product design or in its marketing communication, and their emotional or symbolic impact:
      Type of design (modern, minimalist, complex, vintage, etc.):
      cta:Clarity of the message: How does the product/service communicate its value or usefulness to the consumer?
      Visual impact: The aesthetic appeal or the first impression that the product/service leaves:
      Detailed description of the product's features:
      Branding elements present (logo, brand color palette, typography):
      Areas of optimization: What aspects of the product/service could be improved to better meet consumer needs or to strengthen the brand message?
      Use these guidelines for a thorough and objective analysis, based on the available information or your interpretation if details are not explicitly provided. Provide a structured response in the following JSON with clearly defined sections corresponding to the points above.
      Feel free to write on multiple lines. Don't hesitate, be confident. Do not escape the double quotes in the output. The resulting JSON object should be in this format: {"q":"string","a":"string"} ONLY RESPOND WITH THIS JSON, NOTHING ELSE
      {"key_message": "","key_features": [],"colors": "","design_type": "","cta": "","message_clarity": "","visual_impact": "","branding": "","area_of_optimization": ""}
          `;
    try {
      const response = await this.requestImageAnalysis(
        promptData.creative_src as string,
        creative_prompt,
        promptData,
      );
      if (!response) throw new Error('Creative Analysis failed');
      return {
        response: this.cleanJsonString(response.response) as CreativeAnalysis,
        eu_total_reach: promptData.eu_total_reach,
        creative_src: promptData.creative_src as string,
        ad_delivery_start_time: promptData.ad_delivery_start_time,
        full_ad_src: promptData.full_ad_src,
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  async analyzeLandingPage(
    promptData: GPTads,
    brandName: string,
  ): Promise<LandingPageAnalysisResult | null> {
    const landing_page_prompt = ` 
      Analyze the ${brandName} landing page provided from a marketing perspective for benchmarking or improvement purposes. Based on the following criteria, fill in the JSON below with precise, detailed, and relevant information, feel free to write multiple sentences:
  brand_elements: Identify and describe the visual or textual elements that communicate the brand's identity, such as the logo, brand colors, typography, and slogans.
  communication_tone: Assess the page's communication tone. Is it formal, friendly, persuasive, professional?
  brand_image_consistency: Analyze whether the landing page maintains consistency with the overall brand image through its various elements.
  title_and_subtitles_clarity: Evaluate how easily the titles and subtitles communicate the main offer or the page's intent.
  persuasive_content: Identify content elements aimed at persuading the visitor, such as testimonials, case studies, success statistics, etc.
  keywords_usage: Examine how keywords are used for SEO and whether they are naturally integrated into the content.
   visual_quality: Assess the quality of images, videos, and the overall design of the page.
  calls_to_action_cta: Detail the CTAs present on the page. Are they clearly visible and compelling?
  message_clarity: Is the main message of the page clear and easily understandable from the first moments of the visit?
  forms_conciseness: Are the forms present concise and only ask for essential information?
  social_proof_elements: Identify elements that add credibility to the offer, such as testimonials, customer reviews, quality badges, etc.
  sense_of_urgency: Does the page create a sense of urgency to prompt action, for example, through limited-time offers, counters, etc.?
  Never hesitate! Be confident.Fill in each criterion in the following JSON with observations and evaluations based on the analysis of the landing page, Return only a JSON 
  {"brand_elements": "","communication_tone": "","brand_image_consistency": "","title_and_subtitles_clarity": "","persuasive_content": "","keywords_usage": "",  "visual_quality": "","cta": "","message_clarity": "" "social_proof_elements": "","sense_of_urgency": ""}
  Make sure to provide specific details and examples for each point.
      `;
    try {
      const response = await this.requestImageAnalysis(
        promptData.landing_page_src as string,
        landing_page_prompt,
        promptData,
      );
      if (!response) throw new Error('Landing Page Analysis failed');
      return {
        response: this.cleanJsonString(
          response.response,
        ) as LandingPageAnalysis,
        landing_page_src: promptData.landing_page_src,
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  async analyzeAds(
    ads: GPTads[],
    brandName: string,
  ): Promise<AnalysisResults[]> {
    let analysisResults: AnalysisResults[];
    try {
      analysisResults = await Promise.all(
        ads.map(async (ad: GPTads): Promise<AnalysisResults> => {
          let textAnalysisResult = null;
          let creativeAnalysisResult = null;
          let landingPageAnalysisResult = null;

          try {
            textAnalysisResult = await this.sendTextPrompt(ad, brandName);
          } catch (error) {
            console.error('Error in text analysis', error);
          }

          try {
            creativeAnalysisResult = await this.analyzeCreative(ad, brandName);
          } catch (error) {
            console.error('Error in creative analysis', error);
          }

          try {
            landingPageAnalysisResult = await this.analyzeLandingPage(
              ad,
              brandName,
            );
          } catch (error) {
            console.error('Error in landing page analysis', error);
          }

          return {
            textAnalysis: textAnalysisResult,
            creativeAnalysis: creativeAnalysisResult,
            landingPageAnalysis: landingPageAnalysisResult,
          };
        }),
      );

      return analysisResults;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  cleanJsonString(
    jsonString: string,
  ): TextAnalysis | CreativeAnalysis | LandingPageAnalysis {
    // Step 1: Replace single quotes around keys and values with double quotes
    console.log('TEST => ', jsonString);

    const cleanedString = jsonString.replace(/`/g, '').replace(/json/g, '');

    // Return the cleaned string
    return JSON.parse(cleanedString);
  }
}
