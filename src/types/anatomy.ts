export type AnatomicalCategory = 
  | 'skeletal'
  | 'dental'
  | 'muscular'
  | 'nervous'
  | 'vascular'
  | 'oral_tissue'
  | 'pathology';

export type AnatomicalRegion = 
  | 'craniofacial'
  | 'maxilla'
  | 'mandible'
  | 'dental_arch_upper'
  | 'dental_arch_lower'
  | 'temporomandibular'
  | 'perioral'
  | 'tongue_palate';

export interface ScientificReference {
  id: string;
  title: string;
  authors: string;
  year: number;
  source: string;
  doiOrUrl?: string;
  type: 'journal' | 'textbook' | 'guideline' | 'consensus';
}

export interface AnatomicalStructure {
  id: string;
  name: string;
  scientificName: string; // Latim / Nome Internacional
  synonyms: string[];
  category: AnatomicalCategory;
  region: AnatomicalRegion;
  fdiNotation?: string; // Para dentes, ex: "11", "36"
  description: string;
  function: string;
  location: string;
  relations: string[]; // Conexões com outros IDs ou nomes
  innervation?: string;
  vascularization?: string;
  muscularOrigin?: string;
  muscularInsertion?: string;
  articulations?: string[];
  tissueComposition?: string[];
  clinicalRelevance: string;
  pathologyIds: string[];
  referenceIds: string[];
  meshId: string;
  colorHex?: string;
}

export type ViewPreset = 
  | 'frontal'
  | 'lateral_right'
  | 'lateral_left'
  | 'superior'
  | 'inferior'
  | 'occlusal_upper'
  | 'occlusal_lower'
  | 'isometric';

export interface LayerVisibility {
  skeletal: boolean;
  dental: boolean;
  muscular: boolean;
  nervous: boolean;
  vascular: boolean;
  oral_tissue: boolean;
  pathologies: boolean;
}

export interface LayerOpacity {
  skeletal: number;
  dental: number;
  muscular: number;
  nervous: number;
  vascular: number;
  oral_tissue: number;
}
