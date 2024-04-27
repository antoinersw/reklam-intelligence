import { Injectable } from '@nestjs/common';
import { AnalysisResults } from 'src/facebook/models/interfaceGpt';

@Injectable()
export class ReportService {
  async makeReport(
    brandName: string,
    analysisResults: AnalysisResults[],
  ): Promise<string> {
    // const htmlData = jsonToHtml(brandName, analysisResults);
    // const date = getDate();
    // const url = await generatePDFfromHTML(`/Report_facebook_${brandName}_${date}.pdf`, htmlData);
    const url = 'SUCCESSFULLY NOT GENERATED PDF';
    console.log(url);
    return url;
  }
}
