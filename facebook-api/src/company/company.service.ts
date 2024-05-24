import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class CompanyService {
  constructor(private configService: ConfigService) {
    //   const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    //   this.s3 = new AWS.S3();
  }

  async initBrowser(headless = false) {
    // Start the browser
    const browser: Browser = await puppeteer.launch({
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROME_PATH,
    });

    const page: Page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // Définir l'agent utilisateur et les en-têtes supplémentaires
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    const headers = {
      'User-Agent': userAgent,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      DNT: '1',

      Referer: 'https://google.com', // Add this line to include the Referer header
    };

    await page.setUserAgent(userAgent);
    await page.setExtraHTTPHeaders(headers);
    return { browser, page };
  }

  async getAllCopyableText(url: string): Promise<string> {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url);

      const text = await page.evaluate(() => {
        var elements = document.querySelectorAll('body *');
        var text = '';
        const filteredTags = [
          'STYLE',
          'SVG',
          'SCRIPT',
          'IMG',
          'NAV',
          'PATH',
          'G',
          'IFRAME',
          'NOSCRIPT',
          'CLIPPATH',
          'RECT',
          'DESC',
          'FOOTER',
        ];

        function containsFilteredTag(element) {
          if (filteredTags.includes(element.tagName)) return true;
          for (let child of element.children) {
            if (containsFilteredTag(child)) return true;
          }
          return false;
        }

        elements.forEach((element) => {
          if (!containsFilteredTag(element)) {
            text += element.textContent + ' ';
          }
        });

        return text.replace(/\s+/g, ' ').trim();
      });

      await browser.close();
      console.log(" TEXT LENGTH =>",text.length)
      return text;
    } catch (error) {
      throw new Error(
        'Failed to extract text due to an error with the browser or the page.',
      );
    }
  }

  async sendPromptToOpenAI(companyContent: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPEN_AI_API_KEY');
    const prompt = `
You ll be give a TEXT_INFO, answer unising the JSON format provided, respect the formatting and answsert the following points . Your output MUST only be the provided json : 

Product: Describe the website product. What problem does it solve? What features does it offer? How does it benefit users?

Mission and Values: Outline the core mission and values of your company. What is the overarching goal of your business, and what principles guide your actions and decisions?

Industry : One or two words identifying the global industry of the company. Example : Construction, SaaS,...

Position : The market positionnement of the company

Key Customers and Partners: Define your target customers for the SaaS product. Who are the ideal users or clients? Additionally, specify potential partners or collaborators who could enhance your product's value or reach.

Competitive Advantage: Highlight the unique selling points and advantages of your SaaS product compared to competitors. What sets your product apart in terms of features, pricing, usability, or any other aspect?

VALID JSON : {"product":{"description":"","problem_solved":"","benefits":""},"mission_and_values":{"mission":"","values":""},"industry":"","position":"","key_customers_and_partners":{"target_customers":"","potential_partners":""},"competitive_advantage":{"unique_selling_points":"","advantages":""}}


TEXT_INFO: 
${companyContent}

`;
const url =   this.configService.get<string>('OPEN_AI_API_URL')
console.log(url)
try {
  const response = await fetch(url
    ,
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-0125',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
          ],
          temperature: 1,
          max_tokens: 4096,
        }),
      },
    );
    
 
 

    const data = await response.json()
    const cleanedJson = data.choices[0].message.content.replace("```json","","```","")
    return JSON.parse(cleanedJson)

}catch(e){
  console.log(e)
}
  
  }
}
 