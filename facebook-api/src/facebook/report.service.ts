import { Injectable } from '@nestjs/common';
import { AnalysisResults } from 'src/facebook/models/interfaceGpt';

@Injectable()
export class ReportService {
  async makeReport(
    brandName: string,
    analysisResults: AnalysisResults[],
  ): Promise<string> {
 
    const url = 'SUCCESSFULLY NOT GENERATED PDF';
    console.log(url);
    return url;
  }
}
