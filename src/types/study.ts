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

export interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  category: 'anatomia_geral' | 'dentes' | 'nervos_vasos' | 'patologias' | 'periodonto';
  difficulty: 'basico' | 'intermediario' | 'avancado';
  type: 'multiple_choice' | 'structure_identification';
  options?: {
    id: string;
    text: string;
  }[];
  correctOptionId?: string;
  targetStructureId?: string; // Para identificar clicando no 3D
  referenceTitle?: string;
}

export interface QuizResult {
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
