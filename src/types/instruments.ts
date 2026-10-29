export type InstrumentCategory =
  | 'exame_clinico'
  | 'rotatorios_operatoria'
  | 'dentistica_restauradora'
  | 'isolamento_absoluto';

export interface DentalInstrument {
  id: string;
  name: string;
  category: InstrumentCategory;
  categoryLabel: string;
  description: string;
  primaryFunction: string;
  indications: string[];
  handlingTechnique: string;
  biosafety: string;
  clinicalTips: string;
  colorAccent: string;
}

