export type ToothFace = 'biting' | 'inner' | 'facial' | 'mesial' | 'distal';

export interface SurfaceFeature {
  id: string;
  name: string;
  face: ToothFace;
  description: string;
  clinicalSignificance: string;
  // Offset relativo ao centro da coroa do dente [dx, dy, dz]
  offset: [number, number, number];
}

export interface ToothSurfaceInfo {
  fdi: string;
  name: string;
  popularName: string;
  type: 'incisor' | 'canine' | 'premolar' | 'molar';
  arch: 'maxillary' | 'mandibular';
  quadrant: 1 | 2 | 3 | 4;
  center: [number, number, number];
  features: SurfaceFeature[];
}

import { DECIDUOUS_TO_HOMOLOGOUS_MAP } from './deciduousTeethData';

// Coordenadas mundiais exatas extraídas do modelo Dental Scope para todos os 32 dentes
export const TOOTH_3D_CENTERS: Record<string, [number, number, number]> = {
  // Quadrante 1 (Superior Direito)
  '11': [-0.498, 0.919, 2.508],
  '12': [-1.146, 0.972, 2.29],
  '13': [-1.716, 1.185, 1.978],
  '14': [-2.013, 1.153, 1.245],
  '15': [-2.297, 1.138, 0.659],
  '16': [-2.399, 1.285, -0.179],
  '17': [-2.355, 1.543, -0.999],
  '18': [-2.358, 1.545, -1.866],

  // Quadrante 2 (Superior Esquerdo)
  '21': [0.368, 0.919, 2.509],
  '22': [1.016, 0.972, 2.307],
  '23': [1.584, 1.185, 1.977],
  '24': [1.883, 1.154, 1.245],
  '25': [2.166, 1.14, 0.659],
  '26': [2.269, 1.286, -0.179],
  '27': [2.225, 1.544, -0.997],
  '28': [2.222, 1.549, -1.866],

  // Quadrante 3 (Inferior Esquerdo)
  '31': [0.229, -1.412, 1.79],
  '32': [0.701, -1.402, 1.793],
  '33': [1.125, -1.406, 1.484],
  '34': [1.554, -1.102, 0.958],
  '35': [1.851, -1.019, 0.348],
  '36': [2.126, -0.588, -0.357],
  '37': [2.458, -0.128, -1.479],
  '38': [2.779, -0.039, -2.411],

  // Quadrante 4 (Inferior Direito)
  '41': [-0.359, -1.412, 1.79],
  '42': [-0.832, -1.402, 1.793],
  '43': [-1.256, -1.405, 1.482],
  '44': [-1.685, -1.101, 0.958],
  '45': [-1.982, -1.019, 0.347],
  '46': [-2.257, -0.585, -0.357],
  '47': [-2.589, -0.132, -1.478],
  '48': [-2.901, -0.043, -2.384],
};

// Mapear coordenadas dos 20 dentes decíduos para seus homólogos na arcada
Object.entries(DECIDUOUS_TO_HOMOLOGOUS_MAP).forEach(([decFdi, permFdi]) => {
  if (TOOTH_3D_CENTERS[permFdi]) {
    TOOTH_3D_CENTERS[decFdi] = TOOTH_3D_CENTERS[permFdi];
  }
});

// Dicionário de Acidentes Anatômicos de Superfície por Tipo de Dente em Português
export const getToothSurfaceFeatures = (fdi: string): SurfaceFeature[] => {
  const resolvedFdi = DECIDUOUS_TO_HOMOLOGOUS_MAP[fdi] || fdi;
  const toothNumber = parseInt(resolvedFdi, 10);
  const isUpper = toothNumber >= 11 && toothNumber <= 28;
  const isRight = (toothNumber >= 11 && toothNumber <= 18) || (toothNumber >= 41 && toothNumber <= 48);
  const lastDigit = toothNumber % 10;

  // Direções vetoriais segundo a hemi-arcada
  const mesialDir = isRight ? 1 : -1; // Mesial aproxima-se de X=0
  const distalDir = isRight ? -1 : 1; // Distal afasta-se de X=0
  const incisalY = isUpper ? -0.45 : 0.45; // Bordo incisal voltado para o plano oclusal
  const cervicalY = isUpper ? 0.35 : -0.35; // Terço cervical voltado para a raiz

  // 1. INCISIVOS (11, 12, 21, 22, 31, 32, 41, 42)
  if (lastDigit === 1 || lastDigit === 2) {
    return [
      {
        id: 'fossa_lingual',
        name: 'Fossa Lingual',
        face: 'inner',
        description: 'Ampla depressão côncava na face palatina/lingual, delimitada lateralmente pelas cristas marginais e no terço cervical pelo cíngulo.',
        clinicalSignificance: 'Área comumente acometida por lesões de cárie e erosão ácida; fundamental para guia anterior na desoclusão.',
        offset: [0, 0, -0.18],
      },
      {
        id: 'bordo_incisal',
        name: 'Bordo Incisal',
        face: 'biting',
        description: 'Margem cortante coronal resultante da convergência das faces vestibular e lingual, responsável pela apreensão e secção dos alimentos.',
        clinicalSignificance: 'Região vulnerável a fraturas por trauma dental (classes IV de Black) e desgaste por atrito ou bruxismo.',
        offset: [0, incisalY, 0.15],
      },
      {
        id: 'crista_marginal_distal',
        name: 'Crista Marginal Distal',
        face: 'distal',
        description: 'Eminência linear de esmalte orientada longitudinalmente ao longo da margem distal da face lingual.',
        clinicalSignificance: 'Forma o ponto de contato proximal com o dente vizinho, evitando impactação alimentar interdental.',
        offset: [distalDir * 0.28, 0, -0.08],
      },
      {
        id: 'crista_marginal_mesial',
        name: 'Crista Marginal Mesial',
        face: 'mesial',
        description: 'Eminência linear de esmalte situada na borda mesial, mais longa e retilínea que a crista distal.',
        clinicalSignificance: 'Define o contorno interproximal e a estética da linha média dentária.',
        offset: [mesialDir * 0.28, 0, -0.08],
      },
      {
        id: 'cingulo',
        name: 'Cíngulo',
        face: 'inner',
        description: 'Convexidade arredondada volumosa e bem desenvolvida que ocupa o terço cervical da face lingual ou palatina.',
        clinicalSignificance: 'Protege a gengiva marginal inserida contra o impacto direto do bolo alimentar durante a mastigação.',
        offset: [0, cervicalY, -0.22],
      },
    ];
  }

  // 2. CANINOS (13, 23, 33, 43)
  if (lastDigit === 3) {
    return [
      {
        id: 'apice_cuspide',
        name: 'Ápice da Cúspide',
        face: 'biting',
        description: 'Ponta de cúspide aguda e cônica única, proeminente e adaptada para perfuração e dilaceração de alimentos.',
        clinicalSignificance: 'Dente com a raiz mais longa da dentição humana, responsável pela fundamental Guia Canina de desoclusão lateral.',
        offset: [0, incisalY * 1.1, 0.12],
      },
      {
        id: 'crista_labial',
        name: 'Crista Labial / Vestibular',
        face: 'facial',
        description: 'Elevação longitudinal convexa que percorre o centro da face vestibular do canino até o ápice cuspídeo.',
        clinicalSignificance: 'Confere grande espessura ao esmalte vestibular, transmitindo forças axiais pesadas com segurança.',
        offset: [0, 0, 0.26],
      },
      {
        id: 'crista_lingual',
        name: 'Crista Lingual',
        face: 'inner',
        description: 'Crista que se estende do cíngulo até a ponta da cúspide, dividindo a face palatina em fossas mésio e disto-linguais.',
        clinicalSignificance: 'Reforço estrutural lingual contra forças de cisalhamento.',
        offset: [0, 0, -0.18],
      },
      {
        id: 'fossa_mesiolingual',
        name: 'Fossa Mésio-Lingual',
        face: 'inner',
        description: 'Depressão lingual entre a crista marginal mesial e a crista lingual.',
        clinicalSignificance: 'Área côncava receptora de desoclusão funcional.',
        offset: [mesialDir * 0.18, 0, -0.14],
      },
      {
        id: 'fossa_distolingual',
        name: 'Fossa Disto-Lingual',
        face: 'inner',
        description: 'Depressão lingual entre a crista marginal distal e a crista lingual, tipicamente mais ampla que a mesial.',
        clinicalSignificance: 'Superfície de contato protético e guia dinâmica.',
        offset: [distalDir * 0.18, 0, -0.14],
      },
      {
        id: 'cingulo',
        name: 'Cíngulo Proeminente',
        face: 'inner',
        description: 'Cíngulo volumoso e fortemente projetado na região cérvico-lingual.',
        clinicalSignificance: 'Proeminência anatômica de referência para grampos ortodônticos e preparos de coroas totais.',
        offset: [0, cervicalY, -0.25],
      },
    ];
  }

  // 3. PRÉ-MOLARES (14, 15, 24, 25, 34, 35, 44, 45)
  if (lastDigit === 4 || lastDigit === 5) {
    return [
      {
        id: 'cuspide_vestibular',
        name: 'Cúspide Vestibular',
        face: 'facial',
        description: 'Cúspide maior e mais alta que a lingual, conferindo formato pontiagudo à silhueta facial do pré-molar.',
        clinicalSignificance: 'Cúspide não-contida (de corte) na maxila e cúspide de contenção cêntrica na mandíbula.',
        offset: [0, incisalY * 0.8, 0.24],
      },
      {
        id: 'cuspide_lingual',
        name: 'Cúspide Lingual / Palatina',
        face: 'inner',
        description: 'Cúspide menor e mais arredondada voltada para o espaço da língua/palato.',
        clinicalSignificance: 'Cúspide de suporte ou estampagem na oclusão cêntrica superior.',
        offset: [0, incisalY * 0.8, -0.24],
      },
      {
        id: 'sulco_central',
        name: 'Sulco Central de Desenvolvimento',
        face: 'biting',
        description: 'Sulco retilíneo ou levemente curvo que percorre a face oclusal de mesial para distal, separando as cúspides.',
        clinicalSignificance: 'Sítio primário de acúmulo de biofilme e indicação eletiva para aplicação de selantes de fóssulas e fissuras.',
        offset: [0, incisalY * 0.95, 0],
      },
      {
        id: 'fossa_mesial',
        name: 'Fóssula Triangular Mesial',
        face: 'mesial',
        description: 'Depressão triangular na terminação mesial do sulco principal oclusal.',
        clinicalSignificance: 'Ponto chave para terminação de cavidades restauradoras de Classe II (MO).',
        offset: [mesialDir * 0.26, incisalY * 0.7, 0],
      },
      {
        id: 'fossa_distal',
        name: 'Fóssula Triangular Distal',
        face: 'distal',
        description: 'Depressão triangular na terminação distal do sulco oclusal.',
        clinicalSignificance: 'Região de retenção mecânica e escoamento do bolo alimentar.',
        offset: [distalDir * 0.26, incisalY * 0.7, 0],
      },
      {
        id: 'crista_marginal_mesial',
        name: 'Crista Marginal Mesial',
        face: 'mesial',
        description: 'Barreira de esmalte que limita a superfície oclusal na margem mesial.',
        clinicalSignificance: 'Resiste a forças compressivas elevadas durante a mastigação de alimentos duros.',
        offset: [mesialDir * 0.32, incisalY * 0.5, 0],
      },
    ];
  }

  // 4. MOLARES (16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48)
  const isUpperMolar = isUpper;
  const molarFeatures: SurfaceFeature[] = [
    {
      id: 'cuspide_mesiovestibular',
      name: 'Cúspide Mésio-Vestibular',
      face: 'facial',
      description: 'Cúspide volumosa localizada no ângulo mésio-vestibular da tábua oclusal.',
      clinicalSignificance: 'Referência primordial para a Classificação de Oclusão de Angle (Chave de Angle / Classe I).',
      offset: [mesialDir * 0.28, incisalY * 0.75, 0.3],
    },
    {
      id: 'cuspide_distovestibular',
      name: 'Cúspide Disto-Vestibular',
      face: 'facial',
      description: 'Segunda cúspide vestibular, ligeiramente menor e mais arredondada que a mésio-vestibular.',
      clinicalSignificance: 'Atua nos movimentos de lateralidade e estabilização de mastigação posterior.',
      offset: [distalDir * 0.28, incisalY * 0.75, 0.3],
    },
    {
      id: 'cuspide_mesiolingual',
      name: 'Cúspide Mésio-Lingual / Palatina',
      face: 'inner',
      description: 'A maior e mais volumosa de todas as cúspides dos molares.',
      clinicalSignificance: 'Principal cúspide de contenção cêntrica; no 1º molar superior pode apresentar a Cúspide de Carabelli.',
      offset: [mesialDir * 0.28, incisalY * 0.75, -0.3],
    },
    {
      id: 'cuspide_distolingual',
      name: 'Cúspide Disto-Lingual',
      face: 'inner',
      description: 'Cúspide menor no quadrante disto-lingual do dente molar.',
      clinicalSignificance: 'Em segundos e terceiros molares pode sofrer redução anatômica de tamanho.',
      offset: [distalDir * 0.28, incisalY * 0.75, -0.3],
    },
    {
      id: 'fossa_central',
      name: 'Fossa Central Oclusal',
      face: 'biting',
      description: 'Ampla e profunda depressão central onde convergem os principais sulcos de desenvolvimento oclusais.',
      clinicalSignificance: 'Ponto de máximo contato intercuspídeo (MIH) e local mais comum para restaurações de amálgama e resina composta.',
      offset: [0, incisalY * 0.95, 0],
    },
    {
      id: 'sulco_central',
      name: 'Sulco Central de Desenvolvimento',
      face: 'biting',
      description: 'Sulco transversal contínuo que divide as cúspides vestibulares das cúspides linguais.',
      clinicalSignificance: 'Canal de fuga e escoamento do bolo alimentar triturado.',
      offset: [0, incisalY * 0.9, 0.05],
    },
    {
      id: 'crista_marginal_mesial',
      name: 'Crista Marginal Mesial',
      face: 'mesial',
      description: 'Robusto rebordo de esmalte que delimita a face oclusal mesialmente.',
      clinicalSignificance: 'Sua integridade é essencial para manter a dimensão da arcada e proteger o septo ósseo interproximal.',
      offset: [mesialDir * 0.38, incisalY * 0.5, 0],
    },
    {
      id: 'crista_marginal_distal',
      name: 'Crista Marginal Distal',
      face: 'distal',
      description: 'Rebordo distal do dente, ligeiramente mais baixo que o mesial.',
      clinicalSignificance: 'Contato proximal com o dente distal subjacente.',
      offset: [distalDir * 0.38, incisalY * 0.5, 0],
    },
  ];

  if (isUpperMolar) {
    molarFeatures.splice(4, 0, {
      id: 'ponte_esmalte',
      name: 'Ponte de Esmalte (Crista Oblíqua)',
      face: 'biting',
      description: 'Saliência linear contínua e robusta de esmalte que une obliquamente a cúspide mésio-palatina à disto-vestibular.',
      clinicalSignificance: 'Reforço mecânico fundamental nos molares superiores. Recomenda-se sua preservação máxima em cavidades conservadoras.',
      offset: [0, incisalY * 0.95, 0],
    });
  }

  return molarFeatures;
};

// Posição de câmera calculada para cada face de um dente específico
export const getToothFaceCameraPreset = (
  toothFdi: string,
  face: ToothFace | null
): { position: [number, number, number]; lookAt: [number, number, number] } => {
  const resolvedFdi = DECIDUOUS_TO_HOMOLOGOUS_MAP[toothFdi] || toothFdi;
  const center = TOOTH_3D_CENTERS[resolvedFdi] || [0, 0, 0];
  const toothNumber = parseInt(resolvedFdi, 10);
  const isUpper = toothNumber >= 11 && toothNumber <= 28;
  const isRight = (toothNumber >= 11 && toothNumber <= 18) || (toothNumber >= 41 && toothNumber <= 48);

  const lookAt: [number, number, number] = [center[0], center[1], center[2]];
  const distance = 2.4; // Distância perfeita de zoom para enquadrar a coroa

  if (!face) {
    // Visão geral frontal do dente
    return {
      position: [center[0] * 1.1, center[1] + (isUpper ? -0.3 : 0.3), center[2] + distance],
      lookAt,
    };
  }

  switch (face) {
    case 'biting': {
      // Bordo Incisal / Face Oclusal:
      // Para superiores, câmera olha de baixo para cima (+Z / -Y)
      // Para inferiores, câmera olha de cima para baixo (+Z / +Y)
      const yOffset = isUpper ? -distance * 0.95 : distance * 0.95;
      return {
        position: [center[0], center[1] + yOffset, center[2] + 0.3],
        lookAt,
      };
    }

    case 'inner': {
      // Face Lingual / Palatina: Câmera posicionada no interior da boca, olhando para fora (+Z)
      return {
        position: [center[0] * 0.85, center[1], center[2] - distance],
        lookAt,
      };
    }

    case 'facial': {
      // Face Vestibular: Câmera posicionada na frente dos lábios/bochechas (+Z / lateral)
      const xFactor = center[0] !== 0 ? Math.sign(center[0]) * 0.4 : 0;
      return {
        position: [center[0] + xFactor, center[1], center[2] + distance],
        lookAt,
      };
    }

    case 'mesial': {
      // Face Mesial: Câmera posicionada pelo lado da linha média (olhando para fora)
      const mesialOffset = isRight ? distance * 0.9 : -distance * 0.9;
      return {
        position: [center[0] + mesialOffset, center[1], center[2] + 0.4],
        lookAt,
      };
    }

    case 'distal': {
      // Face Distal: Câmera posicionada pelo lado distal (olhando para dentro da linha média)
      const distalOffset = isRight ? -distance * 0.9 : distance * 0.9;
      return {
        position: [center[0] + distalOffset, center[1], center[2] - 0.2],
        lookAt,
      };
    }
  }
};
