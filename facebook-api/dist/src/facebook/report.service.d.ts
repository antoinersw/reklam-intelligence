import { AnalysisResults } from 'src/facebook/models/interfaceGpt';
export declare class ReportService {
    makeReport(brandName: string, analysisResults: AnalysisResults[]): Promise<string>;
}
