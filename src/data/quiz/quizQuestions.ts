import { QuizDifficulty, QuizQuestion } from '@/types/study';

export const QUIZ_QUESTIONS_PER_ROUND = 5;

export const QUIZ_LEVEL_META: Record<
  QuizDifficulty,
  {
    id: QuizDifficulty;
    step: number;
    title: string;
    subtitle: string;
    description: string;
    badgeColor: string;
    topics: string[];
  }
> = {
  basico: {
    id: 'basico',
    step: 1,
    title: 'Nível 1 • Básico',
    subtitle: 'Fundamentos Anatômicos & Notação FDI',
    description:
      'Reconhecimento dos grupos dentários, quadrantes da notação internacional FDI, tecidos mineralizados do dente e principais ossos da face.',
    badgeColor: '#10B981',
    topics: ['Notação FDI', 'Grupos Dentários', 'Esmalte, Dentina e Polpa', 'Ossos Principais'],
  },
  intermediario: {
    id: 'intermediario',
    step: 2,
    title: 'Nível 2 • Intermediário',
    subtitle: 'Sistemas Musculares, Nervos, Seios & Periodonto',
    description:
      'Morfologia radicular comparada, músculos da mastigação e expressão perioral, divisões do nervo trigêmeo, seios paranasais e ligamento periodontal.',
    badgeColor: '#F59E0B',
    topics: ['Músculos Orofaciais', 'Ramos do Trigêmeo', 'Seios da Face', 'Periodonto'],
  },
  avancado: {
    id: 'avancado',
    step: 3,
    title: 'Nível 3 • Avançado',
    subtitle: 'Clínica Odontológica, Cirurgia, Endodontia & Patologias',
    description:
      'Correlações cirúrgicas e anestésicas, diagnóstico diferencial de pulpite e abscesso, emergências cervicofaciais, traumatologia e anatomia endodôntica.',
    badgeColor: '#EF4444',
    topics: ['Anestesiologia & Cirurgia', 'Endodontia Clínica', 'Patologias Orais', 'Traumatologia'],
  },
};

export const quizQuestions: QuizQuestion[] = [
  // ============================================================================
  // NÍVEL 1: BÁSICO (20 QUESTÕES: 6 INTERATIVAS 3D + 14 MÚLTIPLA ESCOLHA)
  // ============================================================================
  {
    id: 'b_3d_1',
    question:
      'Nos dentes enfileirados em 3D ao lado, clique no Incisivo Central Superior Direito (FDI 11):',
    category: 'dentes',
    difficulty: 'basico',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_11',
    explanation:
      'O dente 11 situa-se imediatamente à direita da linha média na fileira superior (Quadrante 1, posição 1), apresentando coroa ampla em formato de pá e raiz cônica única.',
    referenceTitle: 'FDI Two-Digit Notation (ISO 3950) & Wheeler Dental Anatomy',
  },
  {
    id: 'b_3d_2',
    question:
      'Na vitrine 3D de dentes enfileirados, identifique e clique no Canino Superior Direito (FDI 13):',
    category: 'dentes',
    difficulty: 'basico',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_13',
    explanation:
      'O Canino Superior Direito (13) é o terceiro dente a partir da linha média no Quadrante 1, facilmente reconhecido por sua cúspide única pontiaguda e pela raiz mais longa da arcada humana.',
    referenceTitle: 'Wheeler\'s Dental Anatomy, Physiology and Occlusion',
  },
  {
    id: 'b_3d_3',
    question:
      'Observe os 32 dentes enfileirados no 3D e clique no Primeiro Molar Inferior Esquerdo (FDI 36):',
    category: 'dentes',
    difficulty: 'basico',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_36',
    explanation:
      'Na notação FDI, o Quadrante 3 corresponde ao hemi-arco inferior esquerdo. Contando 6 posições a partir da linha média inferior para a direita da tela (esquerda do paciente), encontra-se o dente 36.',
    referenceTitle: 'ISO 3950 / FDI World Dental Federation',
  },
  {
    id: 'b_3d_4',
    question:
      'Nos dentes enfileirados em 3D, selecione o Terceiro Molar Superior Esquerdo — Siso Superior Esquerdo (FDI 28):',
    category: 'dentes',
    difficulty: 'basico',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_28',
    explanation:
      'O dente 28 ocupa a oitava e última posição distal da fileira superior esquerda (Quadrante 2), na extremidade superior direita da vitrine panorâmica.',
    referenceTitle: 'FDI World Dental Federation Two-Digit System',
  },
  {
    id: 'b_3d_5',
    question:
      'Clique diretamente no modelo 3D sobre a Mandíbula, o único osso móvel do esqueleto craniofacial:',
    category: 'anatomia_geral',
    difficulty: 'basico',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'mandibula',
    explanation:
      'A Mandíbula sustenta toda a arcada dentária inferior, articula-se bilateralmente na ATM e abriga o canal mandibular.',
    referenceTitle: 'Terminologia Anatomica & Sobotta Atlas',
  },
  {
    id: 'b_3d_6',
    question:
      'Identifique clicando no modelo 3D o Osso Frontal, que forma a fronte (testa) e o teto das órbitas:',
    category: 'anatomia_geral',
    difficulty: 'basico',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'osso_frontal',
    explanation:
      'O Osso Frontal é um osso ímpar e pneumatizado na região anterossuperior do neurocrânio, protegendo os lobos frontais e abrigando os seios frontais.',
    referenceTitle: 'Sobotta Atlas de Anatomia Humana — Cabeça e Pescoço',
  },
  {
    id: 'b_mc_1',
    question:
      'Quantos dentes compõem a dentição permanente humana completa (incluindo os terceiros molares)?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: '20 dentes' },
      { id: 'b', text: '28 dentes' },
      { id: 'c', text: '32 dentes' },
      { id: 'd', text: '36 dentes' },
    ],
    correctOptionId: 'c',
    explanation:
      'A dentição permanente completa possui 32 dentes (8 em cada um dos 4 quadrantes: 2 incisivos, 1 canino, 2 pré-molares e 3 molares). Já a dentição decídua possui 20 dentes.',
    referenceTitle: 'Wheeler\'s Dental Anatomy',
  },
  {
    id: 'b_mc_2',
    question:
      'Qual é o tecido mais duro e altamente mineralizado do corpo humano, que reveste a coroa anatômica dos dentes?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Dentina coronária' },
      { id: 'b', text: 'Esmalte dentário' },
      { id: 'c', text: 'Cemento radicular' },
      { id: 'd', text: 'Osso cortical alveolar' },
    ],
    correctOptionId: 'b',
    explanation:
      'O esmalte dentário possui cerca de 96% de matriz mineral inorgânica (cristais de hidroxiapatita), sendo o tecido mais mineralizado e resistente ao desgaste do organismo.',
    referenceTitle: 'Ten Cate Histologia Oral',
  },
  {
    id: 'b_mc_3',
    question:
      'Na notação internacional FDI (dois dígitos), o primeiro dígito "4" (ex.: dente 44) indica qual quadrante?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Superior direito permanente' },
      { id: 'b', text: 'Superior esquerdo permanente' },
      { id: 'c', text: 'Inferior esquerdo permanente' },
      { id: 'd', text: 'Inferior direito permanente' },
    ],
    correctOptionId: 'd',
    explanation:
      'Nos dentes permanentes, os quadrantes seguem sentido horário olhando para o paciente: 1 = superior direito, 2 = superior esquerdo, 3 = inferior esquerdo e 4 = inferior direito.',
    referenceTitle: 'ISO 3950 — Notação Dentária FDI',
  },
  {
    id: 'b_mc_4',
    question:
      'Qual ramo nervoso do trigêmeo é responsável pela inervação sensitiva pulpar de todos os dentes inferiores?',
    category: 'nervos_vasos',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Nervo Alveolar Superior Posterior' },
      { id: 'b', text: 'Nervo Alveolar Inferior (ramo de V3)' },
      { id: 'c', text: 'Nervo Lingual' },
      { id: 'd', text: 'Nervo Facial (NC VII)' },
    ],
    correctOptionId: 'b',
    explanation:
      'O nervo alveolar inferior penetra no forame mandibular e percorre o canal mandibular, emitindo ramos dentais para molares e pré-molares e o ramo incisivo para canino e incisivos inferiores.',
    referenceTitle: 'Sobotta Atlas de Anatomia Humana',
  },
  {
    id: 'b_mc_5',
    question:
      'Qual grupo dentário tem como função primordial apreender, perfurar e dilacerar os alimentos, guiando os movimentos de lateralidade?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Incisivos' },
      { id: 'b', text: 'Caninos' },
      { id: 'c', text: 'Segundos molares' },
      { id: 'd', text: 'Terceiros molares' },
    ],
    correctOptionId: 'b',
    explanation:
      'Os caninos possuem cúspide robusta e raiz longa implantada na eminência canina, atuando na dilaceração dos alimentos e na guia canina de desoclusão lateral.',
    referenceTitle: 'Okeson — Tratamento das Desordens Temporomandibulares e Oclusão',
  },
  {
    id: 'b_mc_6',
    question:
      'Qual tecido conjuntivo frouxo especializado ocupa o centro do dente, abrigando odontoblastos, vasos sanguíneos e fibras nervosas?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Polpa dentária' },
      { id: 'b', text: 'Cemento celular' },
      { id: 'c', text: 'Esmalte prismático' },
      { id: 'd', text: 'Gengiva marginal livre' },
    ],
    correctOptionId: 'a',
    explanation:
      'A polpa dentária situa-se na câmara pulpar e nos canais radiculares, sendo responsável pela vitalidade, sensibilidade, nutrição dentinária e formação de dentina reparadora.',
    referenceTitle: 'Cohen — Caminhos da Polpa',
  },
  {
    id: 'b_mc_7',
    question:
      'Quais ossos pares formam o centro do terço médio da face e sustentam todos os dentes da arcada superior?',
    category: 'anatomia_geral',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Ossos temporais' },
      { id: 'b', text: 'Maxilas' },
      { id: 'c', text: 'Ossos parietais' },
      { id: 'd', text: 'Ossos nasais' },
    ],
    correctOptionId: 'b',
    explanation:
      'As duas maxilas articulam-se na linha média formando toda a arcada dentária superior, parte do palato duro, paredes laterais da cavidade nasal e assoalho orbitário.',
    referenceTitle: 'Terminologia Anatomica (FCAT)',
  },
  {
    id: 'b_mc_8',
    question:
      'Na face de um dente anterior (incisivo ou canino), como é denominada a superfície voltada diretamente para os lábios?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Face lingual ou palatina' },
      { id: 'b', text: 'Face vestibular (ou labial)' },
      { id: 'c', text: 'Face distal' },
      { id: 'd', text: 'Face cervical' },
    ],
    correctOptionId: 'b',
    explanation:
      'A face vestibular é aquela voltada para o vestíbulo bucal: nos dentes anteriores chama-se também face labial e, nos posteriores, face jugal ou bucal.',
    referenceTitle: 'Madeira — Anatomia do Dente',
  },
  {
    id: 'b_mc_9',
    question:
      'Qual articulação sinovial bilateral conecta o côndilo da mandíbula à fossa mandibular do osso temporal?',
    category: 'anatomia_geral',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Sutura frontozigomática' },
      { id: 'b', text: 'Articulação Temporomandibular (ATM)' },
      { id: 'c', text: 'Gonfose dentoalveolar' },
      { id: 'd', text: 'Sínfise mentoniana' },
    ],
    correctOptionId: 'b',
    explanation:
      'A ATM é uma articulação gínglimo-artrodial (permite rotação e translação) interposta por um disco articular fibrocartilaginoso entre a mandíbula e o osso temporal.',
    referenceTitle: 'Okeson — Anatomia Funcional da ATM',
  },
  {
    id: 'b_mc_10',
    question:
      'Quantos dentes compõem a dentição decídua ("dentes de leite") completa e qual grupo dentário está ausente nela?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: '20 dentes; não há pré-molares decíduos' },
      { id: 'b', text: '24 dentes; não há caninos decíduos' },
      { id: 'c', text: '20 dentes; não há molares decíduos' },
      { id: 'd', text: '16 dentes; não há incisivos laterais decíduos' },
    ],
    correctOptionId: 'a',
    explanation:
      'Cada quadrante decíduo possui 5 dentes: incisivo central, incisivo lateral, canino, primeiro molar e segundo molar (total = 20). Os pré-molares permanentes sucedem os molares decíduos.',
    referenceTitle: 'Odontopediatria — Guedes-Pinto',
  },
  {
    id: 'b_mc_11',
    question:
      'Qual tecido mineralizado recobre especificamente a superfície externa da raiz anatômica e recebe a inserção das fibras do ligamento periodontal?',
    category: 'periodonto',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Esmalte cervical' },
      { id: 'b', text: 'Cemento radicular' },
      { id: 'c', text: 'Mucosa alveolar' },
      { id: 'd', text: 'Dentina secundária' },
    ],
    correctOptionId: 'b',
    explanation:
      'O cemento radicular reveste a dentina radicular e ancora as fibras colágenas de Sharpey do ligamento periodontal ao osso alveolar.',
    referenceTitle: 'Lindhe — Tratado de Periodontia Clínica',
  },
  {
    id: 'b_mc_12',
    question:
      'Na notação FDI, qual é o nome anatômico completo do dente "24"?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Primeiro Pré-Molar Superior Esquerdo' },
      { id: 'b', text: 'Segundo Pré-Molar Superior Direito' },
      { id: 'c', text: 'Canino Superior Esquerdo' },
      { id: 'd', text: 'Primeiro Molar Inferior Direito' },
    ],
    correctOptionId: 'a',
    explanation:
      'O dígito "2" representa o quadrante superior esquerdo permanente e o dígito "4" representa o primeiro pré-molar (quarta posição a partir da linha média).',
    referenceTitle: 'ISO 3950 — Notação FDI',
  },
  {
    id: 'b_mc_13',
    question:
      'Qual osso par forma a proeminência das maçãs do rosto e compõe parte da parede lateral da órbita e do arco zigomático?',
    category: 'anatomia_geral',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Osso Occipital' },
      { id: 'b', text: 'Osso Zigomático (Malar)' },
      { id: 'c', text: 'Osso Etmoide' },
      { id: 'd', text: 'Osso Palatino' },
    ],
    correctOptionId: 'b',
    explanation:
      'O osso zigomático articula-se com a maxila, frontal, esfenoide e temporal, constituindo o pilar zigomático de absorção mastigatória e a proeminência malar.',
    referenceTitle: 'Sobotta Atlas de Anatomia Humana',
  },
  {
    id: 'b_mc_14',
    question:
      'Como é chamada a face de contato de um dente que fica mais próxima da linha média da arcada dentária?',
    category: 'dentes',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Face distal' },
      { id: 'b', text: 'Face mesial' },
      { id: 'c', text: 'Face oclusal' },
      { id: 'd', text: 'Face apical' },
    ],
    correctOptionId: 'b',
    explanation:
      'Nas faces proximais, a face mesial é sempre aquela voltada para a linha média sagital do arco, enquanto a face distal é a que se afasta da linha média.',
    referenceTitle: 'Madeira — Anatomia do Dente',
  },

  // ============================================================================
  // NÍVEL 2: INTERMEDIÁRIO (20 QUESTÕES: 6 INTERATIVAS 3D + 14 MÚLTIPLA ESCOLHA)
  // ============================================================================
  {
    id: 'i_3d_1',
    question:
      'Nos dentes enfileirados em 3D, clique no Primeiro Pré-Molar Superior Direito (FDI 14), classicamente caracterizado por possuir duas raízes (vestibular e palatina):',
    category: 'dentes',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_14',
    explanation:
      'O Primeiro Pré-Molar Superior Direito (14) é o quarto dente a partir da linha média no Quadrante 1, imediatamente distal ao canino 13, sendo o único pré-molar tipicamente birradicular.',
    referenceTitle: 'Wheeler\'s Dental Anatomy & Cohen Endodontics',
  },
  {
    id: 'i_3d_2',
    question:
      'Na vitrine 3D de dentes enfileirados, identifique e clique no Primeiro Molar Superior Esquerdo (FDI 26), portador de três raízes divergentes:',
    category: 'dentes',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_26',
    explanation:
      'O dente 26 é o sexto dente a partir da linha média no Quadrante 2 (superior esquerdo), exibindo coroa romboide volumosa (frequentemente com tubérculo de Carabelli) e três raízes.',
    referenceTitle: 'Madeira — Anatomia do Dente',
  },
  {
    id: 'i_3d_3',
    question:
      'Clique no Canino Inferior Direito (FDI 43) dentre os dentes enfileirados no 3D:',
    category: 'dentes',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_43',
    explanation:
      'O Canino Inferior Direito (43) ocupa a terceira posição a partir da linha média na fileira inferior direita (Quadrante 4), com coroa mais estreita no sentido mesiodistal do que o canino superior.',
    referenceTitle: 'ISO 3950 & Wheeler\'s Dental Anatomy',
  },
  {
    id: 'i_3d_4',
    question:
      'Nos dentes enfileirados em 3D, localize e clique no Segundo Pré-Molar Inferior Esquerdo (FDI 35):',
    category: 'dentes',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_35',
    explanation:
      'O dente 35 ocupa a quinta posição a partir da linha média no Quadrante 3 (inferior esquerdo), posicionado imediatamente mesial ao primeiro molar inferior 36.',
    referenceTitle: 'FDI World Dental Federation & Madeira',
  },
  {
    id: 'i_3d_5',
    question:
      'No modelo anatômico 3D, clique no Músculo Masseter, potente elevador inserido na face lateral do ramo e ângulo da mandíbula:',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'masseter',
    explanation:
      'O Músculo Masseter estende-se do arco zigomático até a tuberosidade massetérica no ângulo externo da mandíbula, gerando elevada força de fechamento oclusal.',
    referenceTitle: 'Terminologia Anatomica & Sobotta Atlas',
  },
  {
    id: 'i_3d_6',
    question:
      'Identifique clicando no modelo 3D o Músculo Mentual (Musculus mentalis), localizado na região anterior do queixo abaixo do lábio inferior:',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'musculo_mentual',
    explanation:
      'O Músculo Mentual origina-se na fossa incisiva da mandíbula e insere-se na pele do mento, elevando e protruindo o lábio inferior e enrugando a pele do queixo.',
    referenceTitle: 'Sobotta Atlas de Anatomia Humana — Músculos da Mímica',
  },
  {
    id: 'i_mc_1',
    question:
      'Qual dos quatro músculos primários da mastigação é o principal responsável pela protrusão mandibular e pelo auxílio na abertura bucal quando contraído bilateralmente?',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Músculo Masseter' },
      { id: 'b', text: 'Músculo Temporal (fibras posteriores)' },
      { id: 'c', text: 'Músculo Pterigóideo Lateral' },
      { id: 'd', text: 'Músculo Pterigóideo Medial' },
    ],
    correctOptionId: 'c',
    explanation:
      'O pterigóideo lateral traciona anteriormente o colo do côndilo mandibular e o complexo cápsula-disco da ATM: bilateralmente promove protrusão/abertura e unilateralmente lateralidade para o lado oposto.',
    referenceTitle: 'Okeson — Tratamento das Desordens Temporomandibulares',
  },
  {
    id: 'i_mc_2',
    question:
      'Qual par craniano é responsável pela inervação MOTORA dos músculos da expressão facial (como Orbicular da Boca, Bucinador e Mentual)?',
    category: 'nervos_vasos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Nervo Trigêmeo — divisão mandibular (NC V3)' },
      { id: 'b', text: 'Nervo Facial (NC VII)' },
      { id: 'c', text: 'Nervo Hipoglosso (NC XII)' },
      { id: 'd', text: 'Nervo Glossofaríngeo (NC IX)' },
    ],
    correctOptionId: 'b',
    explanation:
      'Enquanto os músculos da mastigação são inervados pelo nervo mandibular (V3), todos os músculos da mímica facial recebem inervação motora dos ramos do Nervo Facial (NC VII).',
    referenceTitle: 'Netter — Atlas de Anatomia da Cabeça e Pescoço',
  },
  {
    id: 'i_mc_3',
    question:
      'Onde desemboca fisiologicamente o óstio de drenagem do Seio Maxilar (Antro de Highmore)?',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'No meato nasal inferior, junto ao ducto nasolacrimal' },
      { id: 'b', text: 'No meato nasal médio, através do hiato semilunar' },
      { id: 'c', text: 'Diretamente na fossa pterigopalatina' },
      { id: 'd', text: 'No forame incisivo anterior do palato duro' },
    ],
    correctOptionId: 'b',
    explanation:
      'Tanto o seio maxilar quanto o seio frontal drenam para o meato nasal médio (complexo ostiomeatal). Como o óstio maxilar situa-se alto na parede medial, sua drenagem depende fortemente do batimento mucociliar.',
    referenceTitle: 'Sobotta Atlas de Anatomia Humana',
  },
  {
    id: 'i_mc_4',
    question:
      'Qual nervo emerge pelo forame mentual na mandíbula (geralmente entre os ápices dos pré-molares inferiores) para inervar pele do queixo, mucosa e lábio inferior?',
    category: 'nervos_vasos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Nervo Infraorbital' },
      { id: 'b', text: 'Nervo Mentual' },
      { id: 'c', text: 'Nervo Bucal' },
      { id: 'd', text: 'Nervo Nasopalatino' },
    ],
    correctOptionId: 'b',
    explanation:
      'O nervo mentual é um dos dois ramos terminais do nervo alveolar inferior (junto ao nervo incisivo), emergindo pelo forame mentual para fornecer sensibilidade ao lábio inferior e mento.',
    referenceTitle: 'Malamed — Manual de Anestesia Local',
  },
  {
    id: 'i_mc_5',
    question:
      'Como são chamadas as porções terminais das fibras colágenas principais do ligamento periodontal que ficam mineralizadas dentro do cemento e do osso alveolar?',
    category: 'periodonto',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Restos epiteliais de Malassez' },
      { id: 'b', text: 'Fibras de Sharpey' },
      { id: 'c', text: 'Linhas incrementais de Retzius' },
      { id: 'd', text: 'Fibras oxitalânicas livres' },
    ],
    correctOptionId: 'b',
    explanation:
      'As fibras de Sharpey são as extremidades inseridas das fibras colágenas principais no cemento radicular e na lâmina dura alveolar, absorvendo e convertendo forças compressivas em tensão óssea.',
    referenceTitle: 'Lindhe — Tratado de Periodontia Clínica',
  },
  {
    id: 'i_mc_6',
    question:
      'Qual é a espessura fisiológica média do espaço do ligamento periodontal humano saudável em radiografias e cortes histológicos?',
    category: 'periodonto',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: '0,15 mm a 0,38 mm' },
      { id: 'b', text: '1,5 mm a 2,5 mm' },
      { id: 'c', text: '3,0 mm a 4,0 mm' },
      { id: 'd', text: '0,01 mm a 0,03 mm' },
    ],
    correctOptionId: 'a',
    explanation:
      'O ligamento periodontal mede fisiologicamente entre 0,15 e 0,38 mm (sendo mais estreito no fulcro do terço médio da raiz). Seu espessamento radiográfico sugere trauma oclusal ou inflamação periapical.',
    referenceTitle: 'Ten Cate Histologia Oral & Lindhe',
  },
  {
    id: 'i_mc_7',
    question:
      'Qual músculo da bochecha é perfurado pelo ducto parotídeo (de Stenon) na altura da coroa do segundo molar superior?',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Músculo Masseter' },
      { id: 'b', text: 'Músculo Bucinador' },
      { id: 'c', text: 'Músculo Zigomático Maior' },
      { id: 'd', text: 'Músculo Pterigóideo Medial' },
    ],
    correctOptionId: 'b',
    explanation:
      'O ducto parotídeo contorna a borda anterior do masseter e perfura o músculo bucinador para abrir-se na papila parotídea do vestíbulo bucal superior, frente ao segundo molar superior.',
    referenceTitle: 'Teixeira & Reher — Anatomia Aplicada à Odontologia',
  },
  {
    id: 'i_mc_8',
    question:
      'Por qual forame da base do crânio (no osso esfenoide) emerge a divisão Maxilar (V2) do nervo trigêmeo antes de alcançar a fossa pterigopalatina?',
    category: 'nervos_vasos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Forame Oval' },
      { id: 'b', text: 'Forame Redondo' },
      { id: 'c', text: 'Forame Espinhoso' },
      { id: 'd', text: 'Fissura Orbitária Superior' },
    ],
    correctOptionId: 'b',
    explanation:
      'Na base do crânio: V1 passa pela fissura orbitária superior, V2 (nervo maxilar) atravessa o forame redondo e V3 (nervo mandibular) atravessa o forame oval.',
    referenceTitle: 'Sobotta Atlas de Anatomia Humana',
  },
  {
    id: 'i_mc_9',
    question:
      'Durante a progressão da doença periodontal, qual achado clínico-radiográfico diferencia definitivamente a periodontite da gengivite induzida por biofilme?',
    category: 'periodonto',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Sangramento gengival à sondagem delicada' },
      { id: 'b', text: 'Edema e eritema da papila interdental' },
      { id: 'c', text: 'Perda de inserção clínica e reabsorção da crista óssea alveolar' },
      { id: 'd', text: 'Presença de cálculo supragengival' },
    ],
    correctOptionId: 'c',
    explanation:
      'A gengivite é reversível e restrita ao periodonto de proteção. A periodontite envolve migração apical do epitélio juncional, destruição das fibras periodontais e reabsorção irreversível do osso alveolar.',
    referenceTitle: 'Classificação AAP/EFP 2018 das Doenças Periodontais',
  },
  {
    id: 'i_mc_10',
    question:
      'Qual artéria é um dos dois ramos terminais da artéria carótida externa e fornece a irrigação profunda para todos os dentes superiores e inferiores?',
    category: 'nervos_vasos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Artéria Facial' },
      { id: 'b', text: 'Artéria Maxilar' },
      { id: 'c', text: 'Artéria Lingual' },
      { id: 'd', text: 'Artéria Oftálmica' },
    ],
    correctOptionId: 'b',
    explanation:
      'A artéria maxilar origina-se atrás do colo da mandíbula (junto à artéria temporal superficial) e emite as artérias alveolar inferior, alveolar superior posterior, infraorbital e palatina descendente.',
    referenceTitle: 'Netter — Anatomia de Cabeça e Pescoço para Dentistas',
  },
  {
    id: 'i_mc_11',
    question:
      'As fibras posteriores horizontais do Músculo Temporal têm como principal ação biomecânica sobre a mandíbula:',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Protrusão mandibular máxima' },
      { id: 'b', text: 'Retrusão (recuo posterior) da mandíbula' },
      { id: 'c', text: 'Abertura bucal forçada' },
      { id: 'd', text: 'Compressão da mucosa jugal' },
    ],
    correctOptionId: 'b',
    explanation:
      'Enquanto as fibras verticais anteriores do temporal elevam a mandíbula, suas fibras posteriores quase horizontais tracionam o processo coronoide para trás, promovendo a retrusão mandibular.',
    referenceTitle: 'Okeson — Oclusão Funcional',
  },
  {
    id: 'i_mc_12',
    question:
      'Qual nervo fornece a sensibilidade geral (tato, dor e temperatura) aos dois terços anteriores da língua e à gengiva lingual inferior?',
    category: 'nervos_vasos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Nervo Lingual (ramo de V3)' },
      { id: 'b', text: 'Nervo Hipoglosso (NC XII)' },
      { id: 'c', text: 'Nervo Alveolar Inferior' },
      { id: 'd', text: 'Nervo Palatino Maior' },
    ],
    correctOptionId: 'a',
    explanation:
      'O nervo lingual (ramo de V3) confere sensibilidade geral aos 2/3 anteriores da língua e assoalho bucal/gengiva lingual (já a gustação dessa área vem do nervo corda do tímpano, ramo do VII).',
    referenceTitle: 'Malamed & Sobotta',
  },
  {
    id: 'i_mc_13',
    question:
      'Qual par de seios paranasais localiza-se na espessura do osso frontal, posteriormente aos arcos superciliares, sendo causa frequente de cefaleia frontal referida?',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Seios Esfenoidais' },
      { id: 'b', text: 'Seios Frontais' },
      { id: 'c', text: 'Células Mastóideas' },
      { id: 'd', text: 'Seios Maxilares' },
    ],
    correctOptionId: 'b',
    explanation:
      'Os seios frontais situam-se entre as tábuas externa e interna do osso frontal acima do teto orbitário, inervados pelos ramos supraorbitais de V1.',
    referenceTitle: 'Terminologia Anatomica & Sobotta',
  },
  {
    id: 'i_mc_14',
    question:
      'Qual característica anatômica distingue classicamente o Primeiro Molar Superior (16/26) dos demais molares na face mesiopalatina da coroa?',
    category: 'dentes',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Forame cego vestibular' },
      { id: 'b', text: 'Tubérculo de Carabelli' },
      { id: 'c', text: 'Ponte de esmalte distovestibular ausente' },
      { id: 'd', text: 'Cinco cúspides vestibulares alinhadas' },
    ],
    correctOptionId: 'b',
    explanation:
      'O primeiro molar superior frequentemente exibe o Tubérculo de Carabelli (quinta cúspide acessória não funcional) na superfície palatina da cúspide mesiopalatina, além da ponte de esmalte oblíqua.',
    referenceTitle: 'Madeira — Anatomia do Dente',
  },

  // ============================================================================
  // NÍVEL 3: AVANÇADO (20 QUESTÕES: 6 INTERATIVAS 3D + 14 MÚLTIPLA ESCOLHA)
  // ============================================================================
  {
    id: 'a_3d_1',
    question:
      'Nos dentes enfileirados em 3D, clique no dente do Quadrante 1 cujos três ápices radiculares guardam maior risco cirúrgico de comunicação bucosinusal e sinusite odontogênica direita (FDI 16):',
    category: 'dentes',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_16',
    explanation:
      'O Primeiro Molar Superior Direito (16) possui raízes mesiovestibular, distovestibular e palatina em íntimo contato com o assoalho do seio maxilar direito (muitas vezes separadas apenas pela membrana de Schneider).',
    referenceTitle: 'Hupp — Cirurgia Oral e Maxilofacial Contemporânea',
  },
  {
    id: 'a_3d_2',
    question:
      'Na vitrine 3D de dentes enfileirados, selecione o Terceiro Molar Inferior Esquerdo (FDI 38), cuja exodontia exige atenção crítica à proximidade do canal mandibular e da cortical lingual (nervo lingual):',
    category: 'dentes',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_38',
    explanation:
      'O dente 38 situa-se na extremidade distal do Quadrante 3 (inferior esquerdo). Suas raízes frequentemente tangenciam o canal do nervo alveolar inferior, e a tábua óssea lingual fina avizinha o nervo lingual.',
    referenceTitle: 'Peterson / Hupp — Cirurgia Oral e Maxilofacial',
  },
  {
    id: 'a_3d_3',
    question:
      'Identifique nos dentes enfileirados em 3D o Incisivo Lateral Superior Esquerdo (FDI 22), dente anterior com maior incidência de sulco palatorradicular, dens invaginatus e fossa palatina profunda:',
    category: 'dentes',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_22',
    explanation:
      'Os incisivos laterais superiores (12 e 22 — sendo o 22 o segundo dente à esquerda do paciente no Quadrante 2) são os elementos mais acometidos por dens in dente (invaginação coronária) e curvatura apical distal.',
    referenceTitle: 'Cohen — Caminhos da Polpa & Neville Patologia Oral',
  },
  {
    id: 'a_3d_4',
    question:
      'Clique nos dentes enfileirados em 3D sobre o Primeiro Molar Inferior Direito (FDI 46), elemento-chave da oclusão de Angle que apresenta tipicamente 5 cúspides (3 vestibulares e 2 linguais):',
    category: 'dentes',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'teeth_lineup',
    targetStructureId: 'dente_46',
    explanation:
      'O Primeiro Molar Inferior Direito (46, sexta posição no Quadrante 4) é o primeiro permanente a irromper (~6 anos) e possui classicamente 5 cúspides (MV, Mediana/Média, DV, ML e DL) e duas raízes (mesial e distal).',
    referenceTitle: 'Wheeler\'s Dental Anatomy & Angle Classification',
  },
  {
    id: 'a_3d_5',
    question:
      'No modelo 3D completo, clique sobre o Músculo Temporal, cujos pontos-gatilho miofasciais na fossa temporal são causa clássica de cefaleia tensional associada ao bruxismo:',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'temporal_m',
    explanation:
      'O Músculo Temporal tem amplo formato em leque na fossa temporal e converge sob o arco zigomático para inserir-se no processo coronoide e borda anterior do ramo mandibular.',
    referenceTitle: 'Okeson — Dor Orofacial e DTM',
  },
  {
    id: 'a_3d_6',
    question:
      'Clique no modelo 3D sobre o Osso Zigomático, pilar anatômico essencial na dissipação das cargas mastigatórias superiores e sede das fraturas do complexo zigomático-orbitário:',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'osso_zigomatico',
    explanation:
      'O pilar zigomático transmite as forças oclusais da região do primeiro molar superior para o frontal e o arco zigomático, sendo frequentemente abordado em traumatologia bucomaxilofacial.',
    referenceTitle: 'Fonseca — Oral and Maxillofacial Trauma',
  },
  {
    id: 'a_mc_1',
    question:
      'Qual quadro clínico em uma infecção odontogênica aguda indica risco iminente de obstrução de vias aéreas (Angina de Ludwig), exigindo encaminhamento hospitalar imediato?',
    category: 'patologias',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Fístula mucosa vestibular crônica sem edema facial' },
      { id: 'b', text: 'Elevação endurecida bilateral do assoalho bucal, disfagia, dispneia e trismo severo' },
      { id: 'c', text: 'Dor localizada à percussão vertical sem febre' },
      { id: 'd', text: 'Sensibilidade provocada ao frio que cessa em 2 segundos' },
    ],
    correctOptionId: 'b',
    explanation:
      'O acometimento bilateral dos espaços submandibular, sublingual e submentual caracteriza a Angina de Ludwig, elevando a língua contra a orofaringe com risco agudo de asfixia.',
    referenceTitle: 'Cohen\'s Pathways of the Pulp & Hupp Cirurgia Oral',
  },
  {
    id: 'a_mc_2',
    question:
      'No diagnóstico endodôntico diferencial, qual padrão de dor caracteriza classicamente a Pulpite Irreversível Sintomática em oposição à Pulpite Reversível?',
    category: 'patologias',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Dor rápida ao frio que desaparece imediatamente após remover o estímulo' },
      { id: 'b', text: 'Dor espontânea, pulsátil, prolongada após remoção do estímulo térmico e que piora em decúbito' },
      { id: 'c', text: 'Ausência completa de resposta a testes térmicos com fístula gengival ativa' },
      { id: 'd', text: 'Dor restrita exclusivamente à escovação na região cervical exposta' },
    ],
    correctOptionId: 'b',
    explanation:
      'Na pulpite irreversível sintomática há aumento crítico da pressão intrapulpar e microabscessos, gerando dor espontânea, contínua/prolongada (>30s após o teste térmico) e refratária a analgésicos simples.',
    referenceTitle: 'AAE Consensus Conference on Diagnostic Terminology / Cohen',
  },
  {
    id: 'a_mc_3',
    question:
      'Durante o bloqueio anestésico do nervo alveolar inferior, a penetração acidental da agulha e formação de hematoma em qual músculo no espaço pterigomandibular é a principal causa de trismo pós-anestésico?',
    category: 'nervos_vasos',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Músculo Pterigóideo Medial' },
      { id: 'b', text: 'Músculo Orbicular da Boca' },
      { id: 'c', text: 'Músculo Mentual' },
      { id: 'd', text: 'Ventre anterior do Digástrico' },
    ],
    correctOptionId: 'a',
    explanation:
      'O espaço pterigomandibular é delimitado lateralmente pelo ramo da mandíbula e medialmente pelo músculo pterigóideo medial; sua lesão por agulha ou anestésico contaminado desencadeia espasmo muscular (trismo).',
    referenceTitle: 'Malamed — Manual de Anestesia Local',
  },
  {
    id: 'a_mc_4',
    question:
      'Na cariologia moderna, quais são os valores aproximados de pH crítico abaixo dos quais ocorre dissolução mineral no esmalte puro e na dentina exposta, respectivamente?',
    category: 'patologias',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'pH 7,0 no esmalte e pH 7,4 na dentina' },
      { id: 'b', text: 'pH 5,5 no esmalte e pH 6,2–6,5 na dentina' },
      { id: 'c', text: 'pH 3,0 no esmalte e pH 3,5 na dentina' },
      { id: 'd', text: 'pH 6,8 no esmalte e pH 4,5 na dentina' },
    ],
    correctOptionId: 'b',
    explanation:
      'A dentina possui menor conteúdo mineral e cristais de apatita mais ricos em carbonato, desmineralizando-se já em torno de pH 6,2–6,5, enquanto o esmalte puro resiste até aproximadamente pH 5,5.',
    referenceTitle: 'Fejerskov & Kidd — Cárie Dentária: A Doença e seu Tratamento Clínico',
  },
  {
    id: 'a_mc_5',
    question:
      'Em endodontia de molares superiores (16 e 26), onde se localiza com altíssima prevalência (>70%) o quarto canal radicular frequentemente negligenciado (canal MV2 / MB2)?',
    category: 'dentes',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Na raiz palatina, distalmente ao canal principal' },
      { id: 'b', text: 'Na raiz mesiovestibular, palatinamente ao canal MV1 sobre a linha subpulpar MV–P' },
      { id: 'c', text: 'Na raiz distovestibular, junto à furca vestibular' },
      { id: 'd', text: 'No centro exato do Tubérculo de Carabelli' },
    ],
    correctOptionId: 'b',
    explanation:
      'A raiz mesiovestibular dos primeiros molares superiores é achatada no sentido mesiodistal e larga no sentido vestibulopalatino, abrigando em mais de 70–90% dos casos o segundo canal mesiovestibular (MV2).',
    referenceTitle: 'Vertucci & Cohen — Pathways of the Pulp',
  },
  {
    id: 'a_mc_6',
    question:
      'Uma lesão ulcerada única em borda lateral de língua, indolor, de bordas elevadas e endurecidas, que persiste há mais de 21 dias sem regressão exige qual conduta prioritária?',
    category: 'patologias',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Apenas prescrição de corticoide tópico por mais 30 dias' },
      { id: 'b', text: 'Biópsia incisional imediata para descartar Carcinoma Espinocelular Oral' },
      { id: 'c', text: 'Raspagem periodontal supragengival nos pré-molares vizinhos' },
      { id: 'd', text: 'Aplicação exclusiva de verniz fluoretado' },
    ],
    correctOptionId: 'b',
    explanation:
      'Qualquer úlcera oral que não cicatrize em até 14 dias — especialmente indolor e endurecida em áreas de risco como borda lateral de língua e soalho bucal — tem indicação formal de biópsia para investigação de carcinoma espinocelular.',
    referenceTitle: 'Neville et al. — Patologia Oral e Maxilofacial',
  },
  {
    id: 'a_mc_7',
    question:
      'Qual ponto craniométrico lateral do crânio (união entre frontal, parietal, temporal e asa maior do esfenoide) recobre o ramo anterior da artéria meníngea média, oferecendo alto risco de hematoma extradural em traumas?',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Glabela' },
      { id: 'b', text: 'Ptérion' },
      { id: 'c', text: 'Násio' },
      { id: 'd', text: 'Gônio' },
    ],
    correctOptionId: 'b',
    explanation:
      'O ptérion situa-se na fossa temporal onde a calvária é muito delgada; fraturas nessa zona laceram a artéria meníngea média, causando hematoma epidural agudo.',
    referenceTitle: 'Moore — Anatomia Orientada para a Clínica',
  },
  {
    id: 'a_mc_8',
    question:
      'Segundo a Classificação de Periodontite de 2018 (AAP/EFP), um paciente com perda de inserção clínica interdental ≥ 5 mm, defeitos ósseos verticais, lesão de furca Classe II/III e perda dentária periodontal enquadra-se em:',
    category: 'periodonto',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Gengivite induzida por placa em periodonto íntegro' },
      { id: 'b', text: 'Periodontite Estágio I (Inicial)' },
      { id: 'c', text: 'Periodontite Estágio III ou IV (Severa / Avançada)' },
      { id: 'd', text: 'Abscesso gengival isolado sem perda óssea' },
    ],
    correctOptionId: 'c',
    explanation:
      'Perda de inserção ≥ 5 mm, perda óssea além do terço coronal (>33%) e envolvimento de furca classe II/III definem os Estágios III (severa) e IV (avançada com colapso oclusal/múltiplas perdas).',
    referenceTitle: 'Caton, Tonetti et al. — AAP/EFP World Workshop 2018',
  },
  {
    id: 'a_mc_9',
    question:
      'Na cirurgia ortognática de osteotomia Le Fort I da maxila, a disjunção posterior para mobilização maxilar ("downfracture") ocorre na união da tuberosidade maxilar com qual estrutura do osso esfenoide?',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Asa menor do esfenoide no canal óptico' },
      { id: 'b', text: 'Processos pterigóideos do esfenoide (junção pterigomaxilar)' },
      { id: 'c', text: 'Processo mastoide do osso temporal' },
      { id: 'd', text: 'Côndilo occipital' },
    ],
    correctOptionId: 'b',
    explanation:
      'A disjunção pterigomaxilar separa a tuberosidade posterior da maxila das lâminas pterigóideas do osso esfenoide, exigindo cuidado rigoroso com a artéria maxilar e a artéria palatina descendente.',
    referenceTitle: 'Miloro — Princípios de Cirurgia Bucomaxilofacial de Peterson',
  },
  {
    id: 'a_mc_10',
    question:
      'Em acessos cirúrgicos vestibulares anteriores na sínfise mandibular (como mentoplastia ou remoção de enxerto mentoniano), a sutura inadequada do Músculo Mentual resulta classicamente em qual sequela estética e funcional?',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Ptose dos tecidos moles do mento ("queixo de bruxa") e exposição excessiva de incisivos inferiores' },
      { id: 'b', text: 'Paralisia completa da pálpebra superior' },
      { id: 'c', text: 'Desvio da úvula para o lado contralateral' },
      { id: 'd', text: 'Anosmia permanente' },
    ],
    correctOptionId: 'a',
    explanation:
      'Como o músculo mentual sustenta o coxim adiposo do queixo e o lábio inferior a partir da fossa incisiva, sua não reinserção por planos causa queda do mento (ptose mentoniana) e perda de selamento labial.',
    referenceTitle: 'Miloro & Fonseca — Cirurgia Ortognática',
  },
  {
    id: 'a_mc_11',
    question:
      'Nos desarranjos internos da ATM com deslocamento anterior do disco articular com redução, o clique/estalido recíproco audível na abertura bucal corresponde biomecanicamente a qual evento?',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Fratura do processo estiloide' },
      { id: 'b', text: 'Recaptura do disco articular pelo côndilo ao ultrapassar a banda posterior espessada do disco' },
      { id: 'c', text: 'Contato prematuro entre os terceiros molares' },
      { id: 'd', text: 'Ruptura do músculo bucinador' },
    ],
    correctOptionId: 'b',
    explanation:
      'No deslocamento anterior com redução, o disco encontra-se anteriorizado em boca fechada; durante a translação condilar de abertura, o côndilo transpõe a banda posterior e recaptura a zona intermediária do disco, produzindo o estalido.',
    referenceTitle: 'Okeson — Tratamento das Desordens Temporomandibulares',
  },
  {
    id: 'a_mc_12',
    question:
      'Qual seio paranasal profundo apresenta relação anatômica lateral direta com o seio cavernoso, a artéria carótida interna e o nervo óptico, tornando infecções fúngicas ou bacterianas severas potencialmente fatais?',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Seio Esfenoidal' },
      { id: 'b', text: 'Recesso alveolar anterior da maxila' },
      { id: 'c', text: 'Fossa sublingual' },
      { id: 'd', text: 'Forame incisivo' },
    ],
    correctOptionId: 'a',
    explanation:
      'O seio esfenoidal ocupa o corpo do esfenoide logo abaixo da hipófise (sela túrcica) e medialmente aos seios cavernosos e artérias carótidas internas, com risco de trombose séptica do seio cavernoso em sinusites invasivas.',
    referenceTitle: 'Sobotta & Netter — Neuroanatomia e Base do Crânio',
  },
  {
    id: 'a_mc_13',
    question:
      'Por que o bloqueio infiltrativo vestibular isolado na região de molares inferiores permanentes adultos frequentemente falha em obter anestesia pulpar profunda com lidocaína?',
    category: 'nervos_vasos',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Porque os molares inferiores são inervados pelo nervo facial (NC VII)' },
      { id: 'b', text: 'Devido à grande espessura e densidade da cortical óssea vestibular mandibular e da linha oblíqua externa' },
      { id: 'c', text: 'Porque a polpa de molares inferiores não possui fibras A-delta ou C' },
      { id: 'd', text: 'Devido à interposição do seio maxilar sobre o ápice inferior' },
    ],
    correctOptionId: 'b',
    explanation:
      'Diferentemente da maxila (cuja cortical vestibular é fina e porosa), a mandíbula posterior adulta possui cortical vestibular espessa e compacta reforçada pela linha oblíqua, impedindo difusão suficiente de lidocaína até o canal mandibular.',
    referenceTitle: 'Malamed — Manual de Anestesia Local',
  },
  {
    id: 'a_mc_14',
    question:
      'Em um teste de sensibilidade pulpar a frio (-50 °C) negativo combinado a intensa dor à percussão vertical, edema apical e rarefação óssea periapical circunscrita, qual é a hipótese diagnóstica mais provável?',
    category: 'patologias',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Pulpite reversível incipiente' },
      { id: 'b', text: 'Necrose pulpar associada a abscesso/periodontite apical sintomática' },
      { id: 'c', text: 'Mancha branca ativa restrita ao terço externo do esmalte' },
      { id: 'd', text: 'Estomatite aftosa recorrente menor' },
    ],
    correctOptionId: 'b',
    explanation:
      'A ausência de resposta ao frio indica necrose do tecido pulpar, enquanto a dor intensa à percussão vertical e a rarefação apical refletem inflamação/exsudato purulento nos tecidos periapicais.',
    referenceTitle: 'Cohen — Caminhos da Polpa',
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Sorteia 5 questões aleatórias dentre as 20 do nível escolhido,
 * garantindo matematicamente pelo menos 1 desafio interativo no 3D
 * (com prioridade para Dentes Enfileirados 3D + Anatomia 3D).
 */
export function drawQuizQuestionsByLevel(
  difficulty: QuizDifficulty,
  count: number = QUIZ_QUESTIONS_PER_ROUND
): QuizQuestion[] {
  const levelPool = quizQuestions.filter((q) => q.difficulty === difficulty);

  const lineupPool = shuffleArray(
    levelPool.filter((q) => q.type === 'structure_identification' && q.sceneMode === 'teeth_lineup')
  );
  const anatomy3dPool = shuffleArray(
    levelPool.filter((q) => q.type === 'structure_identification' && q.sceneMode !== 'teeth_lineup')
  );
  const mcPool = shuffleArray(levelPool.filter((q) => q.type === 'multiple_choice'));

  const selected: QuizQuestion[] = [];

  // 1. Garante sempre pelo menos 1 questão de Dentes Enfileirados 3D na rodada de 5 questões
  if (lineupPool.length > 0) {
    selected.push(lineupPool[0]);
  }

  // 2. Com 55% de probabilidade, inclui uma 2ª questão interativa 3D (do crânio/músculos ou outro dente)
  // mantendo proporção natural próxima aos 30% do banco (6/20 = 1,5 por rodada de 5)
  const remainingInteractive = [...anatomy3dPool, ...lineupPool.slice(1)];
  if (remainingInteractive.length > 0 && Math.random() < 0.55) {
    const extra3d = shuffleArray(remainingInteractive)[0];
    selected.push(extra3d);
  }

  // 3. Completa as vagas restantes (3 ou 4 questões) com múltipla escolha aleatória do nível
  const neededMc = Math.max(0, count - selected.length);
  selected.push(...mcPool.slice(0, neededMc));

  // 4. Embaralha a ordem final das 5 questões para que o desafio 3D apareça em posição imprevisível
  return shuffleArray(selected).slice(0, count);
}
