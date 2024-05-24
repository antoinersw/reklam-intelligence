import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { CompanyService } from './company/company.service';
 

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('extract')
  async extractText(@Body() body: { companyWebsite: string }): Promise<string> {
    const url = body.companyWebsite;
    try {
        const text  = await this.companyService.getAllCopyableText(url)
        const data = await this.companyService.sendPromptToOpenAI(text)
      return  data ;
    } catch (error) {
      throw new HttpException('Error extracting text from website', HttpStatus.BAD_REQUEST);
    }
  }
}
