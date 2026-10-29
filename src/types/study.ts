import { LayerOpacity, LayerVisibility, ViewPreset } from './anatomy';

export interface UserNote {
  id: string;
  structureId: string;
  structureName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  imageUrl?: string;
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  selectedStructureId?: string;
  cameraPreset: ViewPreset;
  layers: LayerVisibility;
  opacities: LayerOpacity;
  xrayMode: boolean;
  activePathologyId?: string;
  createdAt: string;
}

export type QuizDifficulty = 'basico' | 'intermediario' | 'avancado';

export type QuizSceneMode = 'full_anatomy' | 'teeth_lineup' | 'instrument_3d';

export interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  category: 'anatomia_geral' | 'dentes' | 'nervos_vasos' | 'patologias' | 'periodonto' | 'instrumentos' | 'lingua';
  difficulty: QuizDifficulty;
  type: 'multiple_choice' | 'structure_identification';
  /** Modo de cena 3D para a questão: 'teeth_lineup' exibe os 32 dentes enfileirados; 'instrument_3d' exibe o modelo do instrumental cirúrgico; 'full_anatomy' exibe o crânio e tecidos */
  sceneMode?: QuizSceneMode;
  instrumentId?: string;
  options?: {
    id: string;
    text: string;
    instrumentId?: string;
  }[];
  correctOptionId?: string;
  targetStructureId?: string; // Para identificar clicando no 3D
  referenceTitle?: string;
}

export interface QuizResult {
  difficulty?: QuizDifficulty;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  date: string;
  answers: {
    questionId: string;
    userAnswer: string;
    correct: boolean;
  }[];
}
