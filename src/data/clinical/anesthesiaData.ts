export interface SoftTissueZone3D {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  label?: string;
}

export interface AnesthesiaTechnique {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  arch: 'mandibular' | 'maxillary';
  successRate: string;
  targetNerveIds: string[];
  /** Substrings de malhas em neurovascular.glb que acendem como feixe nervoso bloqueado */
  targetMeshNames: string[];
  /** Dentes (FDI) com anestesia pulpar efetiva neste bloqueio */
  anesthetizedTeeth: string[];
  /** Dentes (FDI) cuja gengiva/mucosa adjacente é anestesiada (mesmo sem polpa) */
  softTissueTeeth: string[];
  anesthetizedStructuresSummary: string[];
  needleSpec: string;
  insertionDepthMm: string;
  anestheticVolume: string;
  aspirationRisk: string;
  landmarks: string[];
  stepByStep: string[];
  complications: string[];
  /** Coordenadas em espaço local do modelo GLB (DentalScopeModel) */
  syringeHubPos: [number, number, number];
  targetPoint: [number, number, number];
  diffusionRadius: number;
  softTissueZones: SoftTissueZone3D[];
  /** Enquadramento ideal de câmera em coordenadas de mundo do Canvas */
  cameraView: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
}

export const ANESTHESIA_TECHNIQUES: AnesthesiaTechnique[] = [
  {
    id: 'bloqueio_nai',
    name: 'Bloqueio do Nervo Alveolar Inferior (BNAI)',
    shortName: 'Alveolar Inferior (Spix)',
    subtitle: 'Técnica de Halsted / Spix no espaço pterigomandibular',
    arch: 'mandibular',
    successRate: '80% – 85%',
    targetNerveIds: ['nervo_alveolar_inferior', 'nervo_mentual', 'nervo_lingual'],
    targetMeshNames: [
      'inferior-alveolar-nerve-left',
      'mandibular-canal-left',
      'mental-nerve-left',
      'incisive-nerve-left',
    ],
    anesthetizedTeeth: ['31', '32', '33', '34', '35', '36', '37', '38'],
    softTissueTeeth: ['31', '32', '33', '34', '35'],
    anesthetizedStructuresSummary: [
      'Polpas dentárias de todos os dentes mandibulares do quadrante (38 até 31)',
      'Corpo da mandíbula e porção inferior do ramo mandibular',
      'Mucoperiósteo vestibular e gengiva anterior ao forame mentual (35 até 31)',
      'Pele e mucosa do lábio inferior e mento homolateral (via ramo mentual)',
      'Frequentemente os 2/3 anteriores da língua e gengiva lingual por difusão ao N. Lingual',
    ],
    needleSpec: 'Agulha Longa calibre 25G ou 27G (32–35 mm)',
    insertionDepthMm: '20 a 25 mm (2/3 a 3/4 da agulha longa até contato ósseo suave)',
    anestheticVolume: '1,5 a 1,8 mL (quase 1 tubete completo, injetado em 60 segundos)',
    aspirationRisk: 'Muito Alta (10% a 15% positiva — Artéria e Veia Alveolar Inferior)',
    landmarks: [
      'Incisura coronóidea (maior concavidade na borda anterior do ramo mandibular)',
      'Rafe pterigomandibular (prega vertical visível da maxila à mandíbula)',
      'Plano oclusal dos molares inferiores (punção de 6 a 10 mm acima deste plano)',
      'Pré-molares contralaterais (apoio da seringa Carpule no lado oposto)',
    ],
    stepByStep: [
      'Posicionar o paciente com a boca em abertura máxima para tensionar a rafe pterigomandibular.',
      'Palpar a incisura coronóidea com o polegar e posicionar a seringa sobre os pré-molares contralaterais.',
      'Introduzir a agulha longa 6–10 mm acima do plano oclusal inferior, lateralmente à rafe pterigomandibular.',
      'Avançar lentamente 20–25 mm até sentir toque suave na parede medial do ramo (acima da língula de Spix).',
      'Recuar 1 mm, realizar dupla aspiração negativa e depositar 1,5 mL lentamente ao longo de 60 s.',
    ],
    complications: [
      'Paralisia facial transitória (NC VII): punção posterior excessiva sem toque ósseo atingindo a glândula parótida.',
      'Trismo pós-operatório: trauma da agulha ou hematoma no músculo pterigóideo medial.',
      'Injeção intravascular na artéria alveolar inferior causando taquicardia ou toxicidade sistêmica.',
      'Choque elétrico e parestesia labial ou lingual por contato direto do bisel com o tronco nervoso.',
    ],
    syringeHubPos: [-1.85, 0.95, 2.85],
    targetPoint: [2.85, 0.95, -2.95],
    diffusionRadius: 0.72,
    softTissueZones: [
      {
        position: [1.15, -1.65, 1.95],
        scale: [1.35, 0.55, 0.65],
        rotation: [0, -0.45, 0],
        label: 'Lábio Inferior & Vestíbulo Anterior',
      },
    ],
    cameraView: {
      position: [-6.2, 3.2, 8.8],
      lookAt: [1.1, 0.1, -0.6],
    },
  },
  {
    id: 'bloqueio_lingual',
    name: 'Bloqueio do Nervo Lingual',
    shortName: 'Nervo Lingual',
    subtitle: 'Anestesia da hemilíngua anterior, assoalho bucal e fibromucosa lingual inferior',
    arch: 'mandibular',
    successRate: '95%',
    targetNerveIds: ['nervo_lingual'],
    targetMeshNames: ['lingual-nerve-left'],
    anesthetizedTeeth: [],
    softTissueTeeth: ['31', '32', '33', '34', '35', '36', '37', '38'],
    anesthetizedStructuresSummary: [
      '2/3 anteriores da língua homolateral (sensibilidade geral tátil, térmica e dolorosa)',
      'Mucosa e submucosa do assoalho da cavidade bucal homolateral',
      'Gengiva inserida e mucoperiósteo lingual de todos os dentes inferiores (38 até 31)',
    ],
    needleSpec: 'Agulha Longa 27G (aproveitando o retorno do BNAI)',
    insertionDepthMm: '15 mm (cerca de 5 a 8 mm mais superficial e medial que o NAI)',
    anestheticVolume: '0,3 a 0,5 mL',
    aspirationRisk: 'Baixa a Moderada (~2%)',
    landmarks: [
      'Mesmo trajeto contralateral do Bloqueio do Nervo Alveolar Inferior',
      'Espaço pterigomandibular anterior e medial ao NAI',
      'Crista temporal e prega pterigomandibular',
    ],
    stepByStep: [
      'Logo após depositar a solução no NAI, retirar aproximadamente metade da agulha (cerca de 5 a 8 mm).',
      'Alternativamente, puncionar na mesma referência do BNAI avançando apenas 15 mm sem necessidade de toque ósseo profundo.',
      'Realizar aspiração prévia negativa.',
      'Depositar suavemente 0,3 a 0,5 mL de solução anestésica e retirar a agulha protegendo o bisel.',
    ],
    complications: [
      'Parestesia lingual ou disgeusia transitória (alteração do paladar via fibras da corda do tímpano do NC VII acopladas ao N. Lingual).',
      'Mordedura acidental da borda lateral da língua no pós-operatório (especialmente em odontopediatria).',
    ],
    syringeHubPos: [-1.65, 0.9, 2.75],
    targetPoint: [2.35, 0.88, -2.35],
    diffusionRadius: 0.62,
    softTissueZones: [
      {
        position: [1.05, -0.65, -0.35],
        scale: [1.1, 0.45, 2.25],
        rotation: [0, -0.22, 0],
        label: '2/3 Anteriores da Língua & Gengiva Lingual (38–31)',
      },
    ],
    cameraView: {
      position: [-5.8, 4.4, 8.2],
      lookAt: [1.0, 0.1, -0.5],
    },
  },
  {
    id: 'bloqueio_bucal',
    name: 'Bloqueio do Nervo Bucal (Longo)',
    shortName: 'Nervo Bucal',
    subtitle: 'Complementação vestibular indispensável para molares inferiores',
    arch: 'mandibular',
    successRate: '95% – 98%',
    targetNerveIds: ['nervo_bucal'],
    targetMeshNames: ['buccal-nerve-left'],
    anesthetizedTeeth: [],
    softTissueTeeth: ['36', '37', '38'],
    anesthetizedStructuresSummary: [
      'Tecidos moles e periósteo vestibular aos molares inferiores (36, 37 e 38)',
      'Mucosa jugal adjacente ao fundo de vestíbulo posterior inferior',
      'Não promove anestesia pulpar dentária nem bloqueio motor do bucinador',
    ],
    needleSpec: 'Agulha Longa 27G (após BNAI) ou Curta 27G',
    insertionDepthMm: '2 a 4 mm apenas (até tocar suavemente o periósteo da linha oblíqua)',
    anestheticVolume: '0,3 mL (cerca de 1/6 de tubete)',
    aspirationRisk: 'Muito Baixa (< 0,7%)',
    landmarks: [
      'Molares mandibulares mais distais presentes no arco (37 ou 38)',
      'Borda anterior do ramo da mandíbula (linha oblíqua externa)',
      'Prega mucovestibular distal e vestibular ao último molar inferior',
    ],
    stepByStep: [
      'Afastar lateralmente a mucosa jugal com espelho clínico ou dedo indicador para tensionar o tecido.',
      'Alinhar a seringa paralelamente ao plano oclusal mandibular do mesmo lado da intervenção (ipsilateral), vestibular aos dentes.',
      'Puncionar a mucosa distal e vestibular ao último molar inferior.',
      'Avançar apenas 2 a 4 mm até tocar suavemente o periósteo da borda anterior do ramo, aspirar e depositar 0,3 mL.',
    ],
    complications: [
      'Pequeno hematoma submucoso jugal caso a artéria bucal seja transfixada.',
      'Dor leve à injeção se depositada sob o periósteo com pressão excessiva.',
    ],
    syringeHubPos: [3.45, 0.72, 2.95],
    targetPoint: [3.12, 0.52, -2.25],
    diffusionRadius: 0.55,
    softTissueZones: [
      {
        position: [2.75, -0.55, -1.25],
        scale: [0.45, 0.55, 1.55],
        rotation: [0, 0.25, 0],
        label: 'Gengiva & Mucosa Vestibular dos Molares (36–38)',
      },
    ],
    cameraView: {
      position: [8.8, 3.2, 6.8],
      lookAt: [1.8, -0.1, -0.8],
    },
  },
  {
    id: 'bloqueio_mentual',
    name: 'Bloqueio do Nervo Mentual / Incisivo',
    shortName: 'Mentual / Incisivo',
    subtitle: 'Bloqueio na emergência do forame mentual entre pré-molares inferiores',
    arch: 'mandibular',
    successRate: '85% – 95%',
    targetNerveIds: ['nervo_mentual', 'nervo_alveolar_inferior'],
    targetMeshNames: ['mental-nerve-left', 'incisive-nerve-left'],
    anesthetizedTeeth: ['31', '32', '33', '34', '35'],
    softTissueTeeth: ['31', '32', '33', '34', '35'],
    anesthetizedStructuresSummary: [
      'Mucosa vestibular anterior ao forame mentual (do 2º pré-molar 35 à linha média 31)',
      'Pele e mucosa do lábio inferior e mento homolateral',
      'Com compressão digital de 2 min (Bloqueio Incisivo): polpas dentárias de pré-molares, canino e incisivos (35 a 31) sem anestesiar a língua!',
    ],
    needleSpec: 'Agulha Curta calibre 27G (20–25 mm)',
    insertionDepthMm: '5 a 6 mm no fundo de vestíbulo inferior (sem penetrar dentro do forame!)',
    anestheticVolume: '0,6 mL (1/3 de tubete)',
    aspirationRisk: 'Moderada (5,7% — Artéria Mentual)',
    landmarks: [
      'Pré-molares inferiores (34 e 35) — o forame situa-se tipicamente entre seus ápices ou abaixo do 35',
      'Prega mucovestibular mandibular inferior',
      'Radiografia periapical ou panorâmica prévia para confirmar a altura exata do forame mentual',
    ],
    stepByStep: [
      'Palpar suavemente a cortical vestibular na região apical dos pré-molares inferiores até localizar uma leve depressão dolorosa.',
      'Tracionar o lábio inferior e a bochecha lateralmente para expor o fundo de saco vestibular.',
      'Introduzir a agulha curta na prega mucovestibular na altura do 1º ou 2º pré-molar, direcionada ao forame.',
      'Não penetrar no interior do canal mentual (evita lesão nervosa). Aspirar e injetar 0,6 mL lentamente.',
      'Manter pressão digital suave sobre o sítio por 2 minutos para impulsionar o anestésico pelo forame (bloqueio do N. Incisivo).',
    ],
    complications: [
      'Hematoma submucoso visível no vestíbulo/queixo (facilmente contido por compressão imediata com gaze por 2 min).',
      'Parestesia labial inferior caso a agulha seja forçada para o interior ósseo do forame mentual.',
    ],
    syringeHubPos: [3.95, 0.45, 3.65],
    targetPoint: [1.92, -1.88, 0.92],
    diffusionRadius: 0.58,
    softTissueZones: [
      {
        position: [1.25, -1.75, 1.85],
        scale: [1.25, 0.55, 0.95],
        rotation: [0, -0.52, 0],
        label: 'Mucosa Labial, Mento & Pré-Molares a Incisivos',
      },
    ],
    cameraView: {
      position: [7.6, 0.8, 8.8],
      lookAt: [1.1, -0.9, 0.8],
    },
  },
  {
    id: 'bloqueio_asp',
    name: 'Bloqueio Alveolar Superior Posterior (ASP)',
    shortName: 'ASP (Tuberosidade)',
    subtitle: 'Bloqueio dos molares superiores na tuberosidade da maxila',
    arch: 'maxillary',
    successRate: '95%',
    targetNerveIds: ['nervo_maxilar_v2', 'plexo_pterigoideo'],
    targetMeshNames: ['posterior-superior-alveolar-nerve-left'],
    anesthetizedTeeth: ['26', '27', '28'],
    softTissueTeeth: ['26', '27', '28'],
    anesthetizedStructuresSummary: [
      'Polpas do 3º, 2º e 1º molares superiores (28, 27 e 26 — atenção: a raiz mésio-vestibular do 26 recebe inervação do N. ASM em ~28% dos pacientes)',
      'Osso alveolar vestibular de suporte e ligamento periodontal desses molares',
      'Gengiva inserida e mucosa vestibular sobrejacente aos molares superiores',
      'Parede póstero-lateral da mucosa do seio maxilar',
    ],
    needleSpec: 'Agulha Curta calibre 27G (recomendada para evitar penetração excessiva)',
    insertionDepthMm: '16 mm em adultos (10–14 mm em crânios pequenos/crianças)',
    anestheticVolume: '0,9 a 1,8 mL (1/2 a 1 tubete)',
    aspirationRisk: 'Moderada (3,1% — proximidade crítica com o Plexo Venoso Pterigóideo)',
    landmarks: [
      'Prega mucovestibular na altura do 2º molar superior (27)',
      'Tuberosidade da maxila (contorno póstero-lateral convexo)',
      'Processo zigomático da maxila (pilar zigomático-maxilar anterior ao ponto de punção)',
    ],
    stepByStep: [
      'Solicitar abertura parcial da boca e deslocamento da mandíbula para o lado da injeção (amplia o corredor vestibular entre o processo coronoide e a maxila!).',
      'Puncionar no fundo de vestíbulo acima do 2º molar superior (27).',
      'Avançar em movimento único a 45° em três planos simultâneos: para CIMA, para DENTRO e para TRÁS, contornando a tuberosidade.',
      'Avançar no máximo 16 mm (não deve haver resistência óssea; se tocar osso cedo, o ângulo está medial demais).',
      'Realizar dupla aspiração cuidadosa e injetar lentamente durante 30 a 60 segundos.',
    ],
    complications: [
      'Hematoma volumoso e imediato na fossa infratemporal/bochecha por transfixação do Plexo Venoso Pterigóideo ou Artéria Maxilar (quando a agulha ultrapassa 16 mm posteriormente).',
      'Anestesia mandibular ocasional caso o anestésico difunda lateralmente até a divisão V3.',
    ],
    syringeHubPos: [4.65, 0.25, 1.35],
    targetPoint: [2.52, 3.08, -1.88],
    diffusionRadius: 0.68,
    softTissueZones: [
      {
        position: [2.72, 1.55, -1.05],
        scale: [0.45, 0.65, 1.55],
        rotation: [0, 0.15, 0],
        label: 'Vestíbulo & Periodonto dos Molares (26–28)',
      },
    ],
    cameraView: {
      position: [8.8, 3.6, 6.2],
      lookAt: [1.6, 1.4, -0.6],
    },
  },
  {
    id: 'bloqueio_infraorbital',
    name: 'Bloqueio do Nervo Infraorbital (ASA / ASM)',
    shortName: 'Infraorbital (ASA/ASM)',
    subtitle: 'Bloqueio troncular anterior e médio da maxila via forame infraorbital',
    arch: 'maxillary',
    successRate: '90% – 95%',
    targetNerveIds: ['nervo_maxilar_v2'],
    targetMeshNames: [
      'infraorbital-nerve-left',
      'anterior-superior-alveolar-nerve-left',
      'middle-superior-alveolar-nerve-left',
    ],
    anesthetizedTeeth: ['21', '22', '23', '24', '25'],
    softTissueTeeth: ['21', '22', '23', '24', '25'],
    anesthetizedStructuresSummary: [
      'Polpas dos incisivos central e lateral, canino e 1º/2º pré-molares superiores (21 a 25) + raiz MV do 26',
      'Osso alveolar vestibular, periósteo e gengiva vestibular de toda a região anterior e pré-molar',
      'Pálpebra inferior, aspecto lateral da pirâmide/asa nasal e lábio superior homolateral',
    ],
    needleSpec: 'Agulha Longa calibre 25G ou 27G (ou Curta 27G em pacientes de face curta)',
    insertionDepthMm: '16 mm em média (cerca de metade da agulha longa até o teto do forame)',
    anestheticVolume: '0,9 a 1,2 mL',
    aspirationRisk: 'Baixa (0,7% — Vasos Infraorbitais)',
    landmarks: [
      'Margem infraorbital óssea e incisura infraorbital (palpável 8–10 mm acima do forame)',
      'Pupila do paciente olhando fixamente para frente (alinha-se verticalmente ao forame e ao 1º pré-molar 24)',
      'Prega mucovestibular na altura do 1º pré-molar superior (24)',
    ],
    stepByStep: [
      'Localizar a incisura infraorbital por palpação extraoral e deslizar o dedo 8–10 mm inferiormente para manter pressão sobre o forame infraorbital.',
      'Elevar o lábio superior tracionando a mucosa vestibular e puncionar no fundo de saco acima do 1º pré-molar (24).',
      'Orientar o corpo da seringa paralelamente ao longo eixo do 1º pré-molar para evitar toque precoce na fossa canina.',
      'Avançar ~16 mm até sentir a agulha sob o dedo indicador extraoral na borda superior do forame.',
      'Aspirar, depositar 0,9 a 1,2 mL lentamente mantendo compressão digital firme sobre o forame por 2 minutos.',
    ],
    complications: [
      'Equimose ou hematoma periorbitário inferior ("olho roxo" transitório) por lesão da artéria/veia infraorbital.',
      'Raramente diplopia transitória se o anestésico for forçado para o assoalho orbitário através de deiscência óssea.',
    ],
    syringeHubPos: [2.45, -1.65, 2.55],
    targetPoint: [2.18, 3.25, 1.38],
    diffusionRadius: 0.68,
    softTissueZones: [
      {
        position: [1.35, 1.45, 2.35],
        scale: [1.35, 0.75, 0.95],
        rotation: [0, -0.55, 0],
        label: 'Lábio Superior, Asa Nasal & Vestíbulo (21–25)',
      },
    ],
    cameraView: {
      position: [6.8, 2.8, 9.5],
      lookAt: [1.2, 1.3, 0.8],
    },
  },
  {
    id: 'bloqueio_palatino_maior',
    name: 'Bloqueio do Nervo Palatino Maior',
    shortName: 'Palatino Maior',
    subtitle: 'Anestesia da abóbada palatina posterior (de 3º molar a 1º pré-molar)',
    arch: 'maxillary',
    successRate: '95%+',
    targetNerveIds: ['nervo_palatino_maior', 'osso_palatino'],
    targetMeshNames: ['greater-palatine-nerve-left'],
    anesthetizedTeeth: [],
    softTissueTeeth: ['24', '25', '26', '27', '28'],
    anesthetizedStructuresSummary: [
      'Fibromucosa queratinizada e osso do palato duro posterior homolateral',
      'Estende-se desde o 3º molar (28) anteriormente até o 1º pré-molar (24) e medialmente até a rafe palatina mediana',
      'Não anestesia polpas dentárias (atua em conjunto com ASP ou Infraorbital para exodontias e cirurgias periodontais)',
    ],
    needleSpec: 'Agulha Curta calibre 27G ou 30G',
    insertionDepthMm: '4 a 6 mm (até contato suave com o osso palatino)',
    anestheticVolume: '0,45 a 0,6 mL (1/4 a 1/3 de tubete — até leve isquemia tecidual)',
    aspirationRisk: 'Baixa (< 1%)',
    landmarks: [
      'Forame palatino maior (depressão palpável palatal ao 2º molar superior 27 ou entre 27 e 28, a ~1 cm da margem gengival)',
      'Junção entre o processo alveolar maxilar vertical e a lâmina horizontal do osso palatino',
      'Rafe palatina mediana (limite medial da difusão)',
    ],
    stepByStep: [
      'Solicitar ampla abertura bucal e hiperextensão cervical para visão direta da abóbada palatina.',
      'Localizar a depressão do forame palatino maior com haste de algodão (cotonete), aplicando anestesia por pressão ("isquemia mecânica") no ponto 1–2 mm anterior ao forame.',
      'Abordar a partir da comissura labial oposta formando ângulo reto (90°) com a curvatura do osso palatino.',
      'Introduzir a agulha lentamente 4–6 mm até tocar o osso palatino, aspirar e depositar 0,45 mL muito lentamente (fibromucosa densa e aderida).',
    ],
    complications: [
      'Sensação de engasgo ou disfagia incômoda caso o anestésico difunda posteriormente atingindo os nervos palatinos menores (palato mole/úvula).',
      'Isquemia excessiva ou necrose epitelial palatina caso sejam usadas altas concentrações de vasoconstritor (ex: noradrenalina ou excesso de volume sob pressão).',
    ],
    syringeHubPos: [-1.95, -1.45, 2.65],
    targetPoint: [1.28, 1.48, -1.45],
    diffusionRadius: 0.55,
    softTissueZones: [
      {
        position: [1.05, 1.38, -0.55],
        scale: [0.85, 0.25, 1.85],
        rotation: [0, 0.08, 0],
        label: 'Fibromucosa do Palato Duro Posterior (28–24)',
      },
    ],
    cameraView: {
      position: [-3.8, -4.8, 6.8],
      lookAt: [0.6, 0.9, -0.4],
    },
  },
  {
    id: 'bloqueio_nasopalatino',
    name: 'Bloqueio do Nervo Nasopalatino (Forame Incisivo)',
    shortName: 'Nasopalatino (Scarpa)',
    subtitle: 'Bloqueio bilateral da pré-maxila palatina (de canino 13 a canino 23)',
    arch: 'maxillary',
    successRate: '95%+',
    targetNerveIds: ['nervo_nasopalatino', 'osso_vomer'],
    targetMeshNames: ['nasopalatine-nerve-left', 'nasopalatine-nerve-right'],
    anesthetizedTeeth: [],
    softTissueTeeth: ['13', '12', '11', '21', '22', '23'],
    anesthetizedStructuresSummary: [
      'Porção anterior do palato duro (pré-maxila) BILATERALMENTE com uma única punção!',
      'Fibromucosa e periósteo palatino da mesial do 1º pré-molar direito (13) à mesial do 1º pré-molar esquerdo (23)',
      'Complementa bloqueios infraorbitais ou infiltrativos anteriores em cirurgias e implantes na zona estética',
    ],
    needleSpec: 'Agulha Curta ou Extracurta calibre 27G ou 30G',
    insertionDepthMm: '3 a 5 mm na margem lateral da papila incisiva',
    anestheticVolume: 'Máximo de 0,45 mL (1/4 de tubete injetado em 15–30 segundos)',
    aspirationRisk: 'Baixa (< 1%)',
    landmarks: [
      'Incisivos centrais superiores (11 e 21)',
      'Papila incisiva na linha média palatina, situada imediatamente atrás dos incisivos centrais sobre o forame incisivo',
    ],
    stepByStep: [
      'Aplicar anestésico tópico por 2 minutos seguido de compressão firme com cotonete sobre a papila incisiva até causar isquemia.',
      'Aproximar a agulha a 45° em relação à papila incisiva (NUNCA puncionar diretamente no centro da papila, que é extremamente inervada; entrar na base lateral da papila!).',
      'Avançar suavemente 3 a 5 mm até contato ósseo na entrada da fossa incisiva.',
      'Recuar 1 mm, aspirar e depositar lentamente até no máximo 0,45 mL observando a isquemia suave da pré-maxila.',
    ],
    complications: [
      'Dor aguda durante a punção caso não seja realizada anestesia tópica + compressão isquêmica prévia ou injeção rápida demais.',
      'Papilite transitória na papila incisiva por trauma mecânico da agulha.',
    ],
    syringeHubPos: [0.55, -2.15, 4.35],
    targetPoint: [-0.06, 1.25, 1.82],
    diffusionRadius: 0.55,
    softTissueZones: [
      {
        position: [-0.06, 1.25, 1.45],
        scale: [1.55, 0.25, 1.05],
        rotation: [0.15, 0, 0],
        label: 'Palato Anterior Bilateral (Pré-Maxila 13 a 23)',
      },
    ],
    cameraView: {
      position: [1.8, -5.2, 7.8],
      lookAt: [-0.04, 0.7, 1.1],
    },
  },
];

export const ANESTHESIA_MAP: Record<string, AnesthesiaTechnique> = Object.fromEntries(
  ANESTHESIA_TECHNIQUES.map((t) => [t.id, t])
);

