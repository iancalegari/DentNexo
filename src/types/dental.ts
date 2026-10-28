export type ToothType = 
  | 'central_incisor'
  | 'lateral_incisor'
  | 'canine'
  | 'first_premolar'
  | 'second_premolar'
  | 'first_molar'
  | 'second_molar'
  | 'third_molar';

export type DentitionType = 'permanent' | 'deciduous';

export type ArchType = 'maxillary' | 'mandibular';

export type QuadrantType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ToothViewMode = 
  | 'external'
  | 'cross_section'
  | 'xray'
  | 'pulp_isolation';

export type WisdomToothState = 
  | 'erupted'
  | 'mesioangular'
  | 'horizontal'
  | 'distoangular'
  | 'impacted'
  | 'absent';

export type AlignmentState = 
  | 'aligned'
  | 'crowded_anterior'
  | 'diastema_central'
  | 'rotation_bicuspid';

export interface ToothInternalLayer {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  composition: string;
  radiodensity: 'radiopaque' | 'intermediate' | 'radiolucent';
  thicknessMm?: string;
  colorHex: string;
}

export interface DetailedToothData {
  fdi: string;
  name: string;
  popularName: string;
  dentition: DentitionType;
  arch: ArchType;
  quadrant: QuadrantType;
  type: ToothType;
  eruptionAgeYears: string;
  rootsCount: number;
  canalsCount: string;
  coronaryAnatomy: {
    cusps?: number;
    ridges: string[];
    fossa: string[];
    grooves: string[];
    dimensionsMm: {
      crownHeight: number;
      crownWidthMD: number;
      crownWidthVL: number;
      rootLength: number;
      totalLength: number;
    };
  };
  internalAnatomy: {
    pulpChamberShape: string;
    pulpHornsCount: number;
    canalsDescription: string;
    apicalForamen: string;
  };
  clinicalRelevance: string;
  pathologyIds: string[];
}
