export type PathologyCategory = 
  | 'caries'
  | 'endodontic'
  | 'periodontal'
  | 'mucosal'
  | 'developmental';

export type PathologySeverity = 'mild' | 'moderate' | 'severe';

export interface OralPathology {
  id: string;
  name: string;
  scientificName: string;
  category: PathologyCategory;
  affectedStructures: string[]; // IDs de dentes, ossos ou mucosas
  stages?: {
    stage: number;
    title: string;
    description: string;
    tissueDepth: string; // Ex: "Apenas esmalte", "Dentina média", "Exposição pulpar"
    radiographicAppearance: string;
  }[];
  etiology: string[];
  clinicalSigns: string[];
  differentialDiagnosis: string[];
  treatmentOptions: string[];
  urgencyWarning?: string;
  prevention: string[];
  referenceIds: string[];
  colorHighlight: string;
}
