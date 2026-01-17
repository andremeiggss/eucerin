export enum AppState {
  WELCOME = 'WELCOME',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export enum SkinType {
  OILY = 'Grasa',
  DRY = 'Seca',
  COMBINATION = 'Mixta',
  NORMAL = 'Normal',
  SENSITIVE = 'Sensible'
}

export interface AnalysisResult {
  skinType: string; // Changed from Enum to string to allow specific titles like "Mixta Deshidratada"
  confidence: number;
  characteristics: string[];
  productName: string;
  productBenefit: string;
  routine: string[];
}