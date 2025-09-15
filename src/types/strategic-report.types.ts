export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ColorPalette {
  hex: string;
  name: string;
}

export interface ReportMetadata {
  analyzedCompanyName: string;
  analysisDate: string;
}

export interface ExecutiveSummary {
  mainDemographic: string;
  mainMarket: string;
  overlookedDemographic: string;
  businessModel: string;
  mainCustomerProblem: string;
  competitorStrength: string;
  strategyGap: string;
}

export interface FunnelStage {
  usedTools: string[];
  mainMessage: string | null;
}

export interface CustomerJourney {
  ToFu: FunnelStage;
  MoFu: FunnelStage;
  BoFu: FunnelStage;
}

export interface Demographics {
  mainLocation: string;
  dominantGender: string;
  totalReachEU: number;
  chartData: ChartData;
  analysis: string;
}

export interface Psychographics {
  painsAndProblems: string[];
  desiresAndGoals: string[];
  offeredTransformation: string;
}

export interface CustomerProfile {
  demographics: Demographics;
  psychographics: Psychographics;
}

export interface Communication {
  toneOfVoice: string;
  dominantEmotions: string[];
  salesAngles: string[];
  analysis: string;
}

export interface Visuals {
  dominantStyle: string;
  commonElements: string[];
  colorPalette: ColorPalette[];
  analysis: string;
}

export interface MessagingAnatomy {
  communication: Communication;
  visuals: Visuals;
}

export interface DistributionAndFormats {
  formatsChartData: Array<{
    label: string;
    value: number;
  }>;
  platformStrategyAnalysis: string;
}

export interface TacticalPlay {
  playName: 'adapt' | 'exploit' | 'test';
  description: string;
}

export interface AdHook {
  hookText: string;
  referenceUrl: string;
  effectiveness?: number;
}

export interface CompetitiveOpportunity {
  weakness: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface KeyMetrics {
  dominantAgeGroup: string;
  dominantGender: string;
  mainGoal: string;
  mostUsedFormat: string;
}

export interface StrategicReportData {
  reportMetadata: ReportMetadata;
  executiveSummary: ExecutiveSummary;
  customerJourney: CustomerJourney;
  customerProfile: CustomerProfile;
  messagingAnatomy: MessagingAnatomy;
  distributionAndFormats: DistributionAndFormats;
  tacticalPlaybook: TacticalPlay[];
  topHooksAnalysis?: {
    hooks: AdHook[];
  };
  adHooks?: AdHook[];  // For backward compatibility
  competitivePositioning?: {
    opportunities: CompetitiveOpportunity[];
  };
  competitiveOpportunities?: CompetitiveOpportunity[];  // For backward compatibility
  keyMetrics: KeyMetrics;
}