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
    subtitle: 'Fundamentos Anatômicos, Língua & Instrumentais Básicos',
    description:
      'Reconhecimento dos grupos dentários, quadrantes FDI, papilas e higienização lingual, tecidos dentários e instrumentais clínicos essenciais.',
    badgeColor: '#10B981',
    topics: ['Notação FDI', 'Papilas & Higiene Lingual', 'Instrumentais de Exame', 'Dentes & Ossos'],
  },
  intermediario: {
    id: 'intermediario',
    step: 2,
    title: 'Nível 2 • Intermediário',
    subtitle: 'Músculos, Nervos, Periodonto, Isolamento & Rotatórios',
    description:
      'Morfologia radicular, inervação gustativa e motora, periodonto, anquiloglossia, isolamento absoluto com Ainsworth e Palmer, e brocas rotatórias.',
    badgeColor: '#F59E0B',
    topics: ['Isolamento & Palmer', 'Brocas & Alta Rotação', 'Inervação Lingual (NC VII)', 'Periodonto & Fissuras'],
  },
  avancado: {
    id: 'avancado',
    step: 3,
    title: 'Nível 3 • Avançado',
    subtitle: 'Língua Geográfica, Dentística Estética, Cirurgia & Fotopolimerização',
    description:
      'Diagnóstico de glossite migratória benigna, paralisia do NC XII, espátulas em titânio, fotopolimerização LED, endodontia clínica e patologias orais.',
    badgeColor: '#EF4444',
    topics: ['Língua Geográfica (Munro)', 'Espátula Titânio & Compósitos', 'LED & Canforoquinona', 'Lesão NC XII & Cirurgia'],
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
    id: 'b_3d_maxila',
    question:
      'No crânio 3D ao lado, identifique e clique sobre a Maxila (osso par que sustenta a arcada dentária superior e forma o assoalho das órbitas):',
    category: 'anatomia_geral',
    difficulty: 'basico',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'maxila',
    explanation:
      'A Maxila forma o arcabouço central da face, aloja os seios maxilares em seu corpo, sustenta as raízes dos dentes superiores e compõe a maior parte do palato duro.',
    referenceTitle: 'Sobotta Atlas de Anatomia Humana — Cabeça e Pescoço',
  },
  {
    id: 'b_3d_zigomatico',
    question:
      'No crânio 3D, identifique e clique sobre o Osso Zigomático (osso malar), que forma a proeminência lateral da bochecha e o arco zigomático:',
    category: 'anatomia_geral',
    difficulty: 'basico',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'osso_zigomatico',
    explanation:
      'O Osso Zigomático forma a maçã do rosto, articula-se com os ossos frontal, maxilar, esfenóide e temporal, delimitando a margem inferolateral da órbita.',
    referenceTitle: 'Netter — Atlas de Anatomia Humana',
  },
  {
    id: 'b_3d_inst_pinca',
    question:
      'Analise o instrumento odontológico exibido em 3D ao lado. Com formato de V, hastes anguladas e microrranhuras internas na ponta ativa, qual é este instrumental?',
    category: 'instrumentos',
    difficulty: 'basico',
    type: 'multiple_choice',
    sceneMode: 'instrument_3d',
    instrumentId: 'pinca_clinica',
    options: [
      { id: 'a', text: 'Pinça Clínica Odontológica — preensão e transporte de roletes de algodão, gaze e pequenos artefatos' },
      { id: 'b', text: 'Pinça Porta-Grampos de Palmer — distensão do arco metálico do grampo de isolamento' },
      { id: 'c', text: 'Pinça de Miller — apreensão de tiras de carbono para ajuste oclusal' },
      { id: 'd', text: 'Pinça hemostática reta tipo Kelly' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Pinça Clínica Odontológica possui corpo articulado elástico em V com extremidades ativas afiladas e serrilhadas internamente para manipulação estéril e sem escorregamento de insumos bucais.',
    referenceTitle: 'Baratieri — Odontologia Restauradora',
  },
  {
    id: 'b_3d_inst_select_sonda',
    question:
      'Para diagnosticar bolsas periodontais com precisão milimétrica e ponta atraumática de 0,5 mm sem lacerar o epitélio juncional, selecione na vitrine 3D o instrumento correto:',
    category: 'instrumentos',
    difficulty: 'basico',
    type: 'multiple_choice',
    sceneMode: 'instrument_3d',
    instrumentId: 'sonda_periodontal',
    options: [
      { id: 'a', text: 'Sonda Periodontal Milimetrada (com marcações métricas pretas a laser de 1 a 15 mm)', instrumentId: 'sonda_periodontal' },
      { id: 'b', text: 'Sonda Exploradora nº 5 em gancho curvo Shepherd\'s Hook', instrumentId: 'sonda_exploradora' },
      { id: 'c', text: 'Pinça Clínica Odontológica com ponta estriada', instrumentId: 'pinca_clinica' },
      { id: 'd', text: 'Espátula nº 24 para manipulação em placa de vidro', instrumentId: 'espatula_24_placa' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Sonda Periodontal Milimetrada é o instrumento exclusivo para o exame do periodonto e periograma, com corpo cilíndrico calibrado a cada milímetro e ponta arredondada atraumática.',
    referenceTitle: 'Newman, Takei, Klokkevold, Carranza — Periodontia Clínica',
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
  {
    id: 'b_3d_lingua',
    question:
      'No modelo anatômico 3D da cavidade oral ao lado, identifique e clique diretamente no Órgão Lingual (Língua):',
    category: 'lingua',
    difficulty: 'basico',
    type: 'structure_identification',
    targetStructureId: 'lingua',
    explanation:
      'A língua é um órgão muscular situado no soalho da cavidade oral, essencial na fonação, gustação, mastigação e deglutição, revestida por mucosa com papilas no dorso e mucosa de revestimento delgada no ventre.',
    referenceTitle: 'Moore — Anatomia Orientada para a Clínica & Sobotta',
  },
  {
    id: 'b_mc_lingua_1',
    question:
      'Qual tipo de papila lingual é a mais abundante no dorso anterior da língua, apresenta formato cônico queratinizado responsável pelo atrito mecânico dos alimentos, mas NÃO possui botões gustativos?',
    category: 'lingua',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Papilas Filiformes' },
      { id: 'b', text: 'Papilas Fungiformes' },
      { id: 'c', text: 'Papilas Circunvaladas' },
      { id: 'd', text: 'Papilas Foliadas' },
    ],
    correctOptionId: 'a',
    explanation:
      'As papilas filiformes são finas, cônicas e queratinizadas, distribuídas densamente por todo o dorso anterior da língua. Diferente das demais, sua função é puramente mecânica e tátil, sem botões gustativos.',
    referenceTitle: 'Junqueira & Carneiro — Histologia Básica',
  },
  {
    id: 'b_mc_lingua_2',
    question:
      'Quais papilas gustativas volumosas (8 a 12 unidades) dispõem-se enfileiradas em formato de "V" lingual no terço posterior do dorso da língua e contêm em suas criptas os ductos das glândulas serosas de von Ebner?',
    category: 'lingua',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Papilas Filiformes' },
      { id: 'b', text: 'Papilas Circunvaladas (Caliciformes)' },
      { id: 'c', text: 'Papilas Foliadas linguais' },
      { id: 'd', text: 'Papilas Rombóides medianas' },
    ],
    correctOptionId: 'b',
    explanation:
      'As papilas circunvaladas (caliciformes) delimitam o sulco terminal em formato de V. A secreção fluida das glândulas de von Ebner lava suas fendas circulares, permitindo a contínua percepção dos estímulos gustativos.',
    referenceTitle: 'Netter — Atlas de Anatomia Humana',
  },
  {
    id: 'b_mc_lingua_3',
    question:
      'Qual é a conduta padrão ouro recomendada para a higienização do dorso lingual, visando à remoção eficaz da saburra lingual e prevenção de compostos sulfurados voláteis (halitose)?',
    category: 'lingua',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Utilizar raspador/limpador lingual anatômico deslizado suavemente do terço posterior para a ponta sem traumatizar as papilas' },
      { id: 'b', text: 'Friccionar vigorosamente com cerdas duras até sangrar as papilas linguais' },
      { id: 'c', text: 'Bochechar exclusivamente água oxigenada 10 volumes três vezes ao dia sem qualquer raspagem física' },
      { id: 'd', text: 'Nunca higienizar a língua para não remover a flora bacteriana protetora' },
    ],
    correctOptionId: 'a',
    explanation:
      'O uso suave de limpadores ou raspadores linguais específicos do fundo para a frente remove mecanicamente a camada de biofilme e células descamadas (saburra lingual) de forma atraumática para as papilas.',
    referenceTitle: 'Consenso da Associação Brasileira de Halitose (ABHA)',
  },
  {
    id: 'b_mc_inst_1',
    question:
      'Na bandeja de instrumentais para exame clínico odontológico básico, qual instrumento articulado em formato de V com extremidades afiladas e ranhuras internas é utilizado para pinçar algodão, gaze e pequenos artefatos?',
    category: 'instrumentos',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Pinça Clínica Odontológica' },
      { id: 'b', text: 'Pinça Porta-Grampo de Palmer' },
      { id: 'c', text: 'Cureta periodontal de Gracey' },
      { id: 'd', text: 'Alavanca cirúrgica reta' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Pinça Clínica Odontológica possui hastes longas anguladas e microrranhuras nas pontas ativas, garantindo preensão firme e sem escorregamento de roletes de algodão, gaze e insumos odontológicos.',
    referenceTitle: 'Baratieri — Odontologia Restauradora: Fundamentos e Possibilidades',
  },
  {
    id: 'b_mc_inst_2',
    question:
      'Qual é a diferença funcional e morfológica elementar entre a Sonda Exploradora nº 5 e a Sonda Periodontal Milimetrada?',
    category: 'instrumentos',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'A Sonda Exploradora possui ponta afilada em gancho para checagem tátil de margens e cavidades; a Sonda Periodontal possui ponta cilíndrica romba calibrada em milímetros para medir o sulco/bolsa gengival' },
      { id: 'b', text: 'A Sonda Periodontal é cortante como lâmina de bisturi e a Sonda Exploradora serve para injetar anestésicos' },
      { id: 'c', text: 'Ambas possuem ponta esférica e a mesma indicação idêntica de mensuração de profundidade' },
      { id: 'd', text: 'A Sonda Exploradora destina-se unicamente ao isolamento absoluto' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Sonda Exploradora nº 5 avalia descontinuidades tácteis no esmalte e margens restauradoras. A Sonda Periodontal é calibrada milimetricamente com ponta arredondada atraumática (0,5 mm) para periograma e exame do periodonto.',
    referenceTitle: 'Newman, Takei, Klokkevold, Carranza — Periodontia Clínica',
  },
  {
    id: 'b_mc_inst_3',
    question:
      'Qual instrumento manual metálico possui lâmina longa, lisa e flexível, sendo o padrão clássico para manipulação e aglutinação ampla de Cimento de Fosfato de Zinco e Ionômero de Vidro sobre placa de vidro resfriada?',
    category: 'instrumentos',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Espátula nº 24 flexível para cimentos' },
      { id: 'b', text: 'Espátula de Resina com ponta em titânio' },
      { id: 'c', text: 'Colher de Dentina de Black nº 17' },
      { id: 'd', text: 'Perfurador de Lençol de Ainsworth' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Espátula nº 24 metálica flexível permite espatular o cimento em amplas porções contra a placa de vidro fria, dissipando o calor exotérmico da reação do fosfato de zinco e garantindo espessura de película ideal.',
    referenceTitle: 'Anusavice — Phillips Materiais Dentários',
  },
  {
    id: 'b_mc_inst_4',
    question:
      'No conjunto de isolamento absoluto, qual instrumento dispõe de um tambor giratório com múltiplos orifícios calibrados (1 a 5) para perfurar o lençol de borracha no diâmetro exato de cada dente?',
    category: 'instrumentos',
    difficulty: 'basico',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Perfurador de Lençol de Borracha de Ainsworth' },
      { id: 'b', text: 'Pinça Porta-Grampos de Palmer' },
      { id: 'c', text: 'Arco de Young em plástico ou metal' },
      { id: 'd', text: 'Grampo asa nº 206' },
    ],
    correctOptionId: 'a',
    explanation:
      'O Perfurador de Ainsworth possui torre com punções de calibres graduados (desde dentes anteriores inferiores até molares volumosos e dentes com grampo), gerando perfurações circulares sem rebarbas.',
    referenceTitle: 'Conceição — Dentística: Saúde e Estética',
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
    id: 'i_3d_temporal_m',
    question:
      'Na miologia craniofacial 3D, identifique e clique sobre o Músculo Temporal, potente elevador e retrator em leque alojado na fossa temporal:',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'temporal_m',
    explanation:
      'O Músculo Temporal origina-se em toda a extensão da fossa temporal, converge suas fibras sob o arco zigomático e insere-se no processo coronoide da mandíbula.',
    referenceTitle: 'Madeira — Anatomia da Face & Sobotta',
  },
  {
    id: 'i_3d_bucinador',
    question:
      'No modelo muscular 3D, clique sobre o Músculo Bucinador, componente muscular da bochecha perfurado pelo ducto parotídeo de Stenon:',
    category: 'anatomia_geral',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'musculo_bucinador',
    explanation:
      'O Músculo Bucinador mantém o tônus da bochecha, empurrando o bolo alimentar para entre as arcadas dentárias durante a mastigação e evitando mordiscaduras acidentais.',
    referenceTitle: 'Sobotta — Atlas de Anatomia Humana',
  },
  {
    id: 'i_3d_nervo_alveolar',
    question:
      'Na neuroanatomia mandibular 3D, identifique e clique no Nervo Alveolar Inferior (ramo de V3 que percorre o canal mandibular):',
    category: 'nervos_vasos',
    difficulty: 'intermediario',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'nervo_alveolar_inferior',
    explanation:
      'O Nervo Alveolar Inferior adentra a mandíbula pelo forame mandibular na língula, emitindo ramos dentários para raízes e polpas de todos os dentes inferiores.',
    referenceTitle: 'Malamed — Manual de Anestesia Local',
  },
  {
    id: 'i_3d_inst_brocas',
    question:
      'Examine o conjunto de 8 brocas diamantadas esféricas de alta rotação (FG séries 1011 a 1018) exibido no modelo 3D. Qual a função clínica primária com anel azul (100–120 µm)?',
    category: 'instrumentos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    sceneMode: 'instrument_3d',
    instrumentId: 'brocas_odontologicas',
    options: [
      { id: 'a', text: 'Abertura coronária inicial, delimitação de contorno cavitário em esmalte e penetração desobstrutiva rápida' },
      { id: 'b', text: 'Polimento final de compósitos com alto brilho superficial' },
      { id: 'c', text: 'Raspagem e alisamento radicular em bolsas periodontais' },
      { id: 'd', text: 'Adesão de braquetes ortodônticos' },
    ],
    correctOptionId: 'a',
    explanation:
      'As brocas esféricas diamantadas FG com anel azul possuem granulação média padrão-ouro para desgaste rápido de esmalte e abertura cavitária sob irrigação contínua.',
    referenceTitle: 'Mondelli — Fundamentos de Dentística Operatória',
  },
  {
    id: 'i_3d_inst_select_palmer',
    question:
      'No isolamento absoluto, qual instrumento com mola e trava deve ser selecionado para abrir e posicionar os grampos de aço no dente pilar?',
    category: 'instrumentos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    sceneMode: 'instrument_3d',
    instrumentId: 'pinca_palmer',
    options: [
      { id: 'a', text: 'Pinça Porta-Grampos de Palmer (com pontas de encaixe nos orifícios do grampo)', instrumentId: 'pinca_palmer' },
      { id: 'b', text: 'Perfurador de Lençol de Ainsworth com tambor rotativo', instrumentId: 'perfurador_ainsworth' },
      { id: 'c', text: 'Colher de Dentina de Black afiada', instrumentId: 'colher_dentina' },
      { id: 'd', text: 'Espátula de Resina com pontas em titânio', instrumentId: 'espatula_resina' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Pinça Porta-Grampos de Palmer foi desenvolvida especificamente para distender o arco do grampo metálico e assentá-lo firmemente na linha cervical do dente preparado.',
    referenceTitle: 'Baratieri — Odontologia Restauradora',
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
  {
    id: 'i_mc_lingua_1',
    question:
      'Qual par craniano conduz as fibras nervosas responsáveis pela sensibilidade GUSTATIVA (paladar) dos dois terços anteriores (2/3) da língua, anastomosando-se ao nervo lingual?',
    category: 'lingua',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Nervo Corda do Tímpano (ramo do Nervo Facial - NC VII)' },
      { id: 'b', text: 'Nervo Glossofaríngeo (NC IX)' },
      { id: 'c', text: 'Nervo Hipoglosso (NC XII)' },
      { id: 'd', text: 'Nervo Alveolar Inferior (ramo de V3)' },
    ],
    correctOptionId: 'a',
    explanation:
      'A percepção gustativa dos 2/3 anteriores da língua é inervada pela Corda do Tímpano (ramo do NC VII - Facial), que se une ao nervo lingual (NC V3) no espaço infratemporal. O NC V3 conduz apenas o tato, dor e temperatura da região.',
    referenceTitle: 'Liebgott — Anatomia das Estruturas Orofaciais',
  },
  {
    id: 'i_mc_lingua_2',
    question:
      'A Língua Fissurada é uma condição caracterizada por múltiplos sulcos profundos no dorso lingual. Qual orientação clínica essencial deve ser transmitida ao paciente?',
    category: 'lingua',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Higienização cuidadosa das fendas com escova ou limpador macio para prevenir acúmulo de biofilme, restos alimentares e proliferação de Candida albicans' },
      { id: 'b', text: 'Cauterização com ácido tricloroacético dos sulcos para preenchimento cicatricial' },
      { id: 'c', text: 'Biópsia excisional profunda de rotina por ser lesão com 80% de transformação maligna' },
      { id: 'd', text: 'Abandono total da higienização mecânica lingual' },
    ],
    correctOptionId: 'a',
    explanation:
      'A língua fissurada é uma alteração benigna muito comum. Seus sulcos anatômicos profundos tendem a reter restos alimentares e microrganismos, podendo deflagrar glossite secundária se não for adequadamente higienizada.',
    referenceTitle: 'Neville, Damm, Allen, Chi — Patologia Oral e Maxilofacial',
  },
  {
    id: 'i_mc_lingua_3',
    question:
      'Em Odontopediatria e no teste de triagem neonatal ("Teste da Linguinha"), qual condição decorrente de inserção anômala curta ou espessa do freio lingual pode causar formato de coração na ponta da língua e restrição de movimentos?',
    category: 'lingua',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Anquiloglossia' },
      { id: 'b', text: 'Macroglossia verdadeira congênita' },
      { id: 'c', text: 'Glossite romboide mediana' },
      { id: 'd', text: 'Língua pilosa negra' },
    ],
    correctOptionId: 'a',
    explanation:
      'A anquiloglossia restringe a protrusão e elevação lingual. Quando interfere na amamentação, deglutição ou desenvolvimento da fala, é indicada a intervenção cirúrgica simples (frenotomia lingual).',
    referenceTitle: 'McDonald & Avery — Odontopediatria para Crianças e Adolescentes',
  },
  {
    id: 'i_mc_inst_1',
    question:
      'No procedimento de isolamento absoluto, qual instrumento articulado com mola e anel de trava é projetado especificamente para prender, abrir e posicionar os grampos metálicos sobre o colo do dente?',
    category: 'instrumentos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Pinça Porta-Grampos de Palmer' },
      { id: 'b', text: 'Pinça de Miller para carbono articular' },
      { id: 'c', text: 'Perfurador de lençol de Ainsworth' },
      { id: 'd', text: 'Pinça hemostática tipo mosquito' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Pinça de Palmer possui pontas afiladas com ressaltos que se encaixam nos orifícios laterais do grampo, distendendo o arco elástico de aço para que suas garras abracem a linha cervical do dente com retenção mecânica.',
    referenceTitle: 'Baratieri — Odontologia Restauradora',
  },
  {
    id: 'i_mc_inst_2',
    question:
      'Na prática da Dentística Operatória, qual a função primária das brocas diamantadas esféricas de alta rotação (série FG 1011 a 1018) com anel de codificação azul (granulação média de 100 a 120 µm)?',
    category: 'instrumentos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Abertura coronária inicial, delimitação de contorno cavitário em esmalte e penetração desobstrutiva rápida' },
      { id: 'b', text: 'Polimento final e brilho espelhado em resina composta' },
      { id: 'c', text: 'Alisamento de paredes cavitárias sem refrigeração a água' },
      { id: 'd', text: 'Remoção de cálculo subgengival em bolsas periodontais' },
    ],
    correctOptionId: 'a',
    explanation:
      'As brocas diamantadas esféricas FG (1011 a 1018) com anel azul (100–120 µm) são padrão-ouro para abertura coronária rápida e eficaz em esmalte dental rígido sob refrigeração copiosa a ar/água para evitar injúria pulpar.',
    referenceTitle: 'Mondelli — Fundamentos de Dentística Operatória',
  },
  {
    id: 'i_mc_inst_3',
    question:
      'Por que a remoção seletiva de tecido cariado na proximidade da polpa deve ser finalizada manualmente com a Colher de Dentina afiada (Cureta de Black), em detrimento de pontas rotatórias em alta velocidade?',
    category: 'instrumentos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Permite discriminação tátil apurada para raspar a dentina infectada necrótica sem pressionar ou perfurar a parede pulpar delgada' },
      { id: 'b', text: 'Porque a colher de dentina emite íons de prata bactericidas' },
      { id: 'c', text: 'Para condensar o material restaurador diretamente na cavidade' },
      { id: 'd', text: 'Porque as brocas rotatórias não cortam dentina desmineralizada' },
    ],
    correctOptionId: 'a',
    explanation:
      'A colher de dentina proporciona controle táctil milimétrico, clivando apenas o tecido desorganizado/amolecido (dentina infectada) e preservando a dentina afetada passível de remineralização sem expor a câmara pulpar.',
    referenceTitle: 'Schwendicke et al. — Consensus Recommendations on Carious Tissue Removal',
  },
  {
    id: 'i_mc_inst_4',
    question:
      'Qual a principal distinção dinâmica entre a Turbina de Alta Rotação odontológica e o Contra-Ângulo acoplado a Micromotor?',
    category: 'instrumentos',
    difficulty: 'intermediario',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Alta rotação atinge até 400.000 rpm com baixo torque sob irrigação contínua para corte de esmalte; o contra-ângulo opera até 40.000 rpm com alto torque para brocas de aço, profilaxia e polimento' },
      { id: 'b', text: 'Alta rotação não utiliza refrigeração e baixa rotação opera a 1.000.000 rpm' },
      { id: 'c', text: 'Não existe distinção de rotação ou torque, diferenciando-se apenas pelo tipo de broca' },
      { id: 'd', text: 'Contra-ângulo é de uso exclusivo cirúrgico para implantes e a alta rotação apenas para moldagem' },
    ],
    correctOptionId: 'a',
    explanation:
      'A alta rotação emprega turbina a ar ultraveloz (350.000 a 400.000 rpm) ideal para desgaste de esmalte sem vibração prejudicial, exigindo spray de água. O contra-ângulo em baixa rotação tem alto torque mecânico para escavação, acabamento e polimento.',
    referenceTitle: 'Craig — Materiais Odontológicos Restauradores',
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
    id: 'a_3d_esfenoide',
    question:
      'No neurocrânio 3D, identifique e clique sobre o Osso Esfenoide ("osso em forma de morcego"), elemento chave da base craniana que abriga a sela túrcica e forames nobres do trigêmeo:',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'osso_esfenoide',
    explanation:
      'O Osso Esfenoide articula-se com os ossos frontal, parietais, temporais, occipital, vômer e zigomáticos, ancorando a base do crânio e transmitindo os ramos maxilar e mandibular do trigêmeo pelos forames redondo e oval.',
    referenceTitle: 'Terminologia Anatomica & Moore Clinically Oriented Anatomy',
  },
  {
    id: 'a_3d_parietal',
    question:
      'No calvário craniano 3D, identifique e clique sobre o Osso Parietal, que compõe a maior parte da calota craniana e delimita as suturas sagital e coronal:',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'osso_parietal',
    explanation:
      'Os ossos parietais são ossos pares planos que formam o teto e as paredes laterais da cavidade craniana, unidos na linha média pela sutura sagital.',
    referenceTitle: 'Sobotta — Atlas de Anatomia Humana',
  },
  {
    id: 'a_3d_orbicular',
    question:
      'Na miologia perioral 3D, identifique e clique no Músculo Orbicular da Boca, esfíncter muscular responsável pelo selamento labial e fonação:',
    category: 'anatomia_geral',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'musculo_orbicular_boca',
    explanation:
      'O Músculo Orbicular da Boca circunda a cavidade oral. Inervado pelo nervo facial (NC VII), promove o selamento labial indispensável para a deglutição sob pressão negativa.',
    referenceTitle: 'Netter — Atlas de Anatomia Humana',
  },
  {
    id: 'a_3d_nervo_mentual',
    question:
      'Na neuroanatomia mandibular 3D, identifique e clique no Nervo Mentual, ramo terminal que emerge pelo forame mentual entre os pré-molares inferiores:',
    category: 'nervos_vasos',
    difficulty: 'avancado',
    type: 'structure_identification',
    sceneMode: 'full_anatomy',
    targetStructureId: 'nervo_mentual',
    explanation:
      'O Nervo Mentual emerge no forame mentual para suprir a sensibilidade do lábio inferior, mento e mucosa gengival vestibular anterior inferior.',
    referenceTitle: 'Malamed — Manual de Anestesia Local',
  },
  {
    id: 'a_3d_inst_resina',
    question:
      'Examine no visualizador 3D a Espátula de Resina com pontas ativas ultrafinas contra-anguladas. Por que o recobrimento superficial em Nitreto de Titânio Dourado é fundamental na escultura estética?',
    category: 'instrumentos',
    difficulty: 'avancado',
    type: 'multiple_choice',
    sceneMode: 'instrument_3d',
    instrumentId: 'espatula_resina',
    options: [
      { id: 'a', text: 'Confere propriedades antiaderentes excepcionais que impedem o repuxamento e a colagem da matriz resinosa na lâmina durante a modelagem anatômica' },
      { id: 'b', text: 'Emite radiação ultravioleta que polimeriza a resina diretamente sob a lâmina metálica' },
      { id: 'c', text: 'Serve para aquecer o cimento de ionômero de vidro' },
      { id: 'd', text: 'Aumenta a absorção de saliva para lubrificar o dente' },
    ],
    correctOptionId: 'a',
    explanation:
      'O revestimento de Nitreto de Titânio (TiN) possui baixíssimo atrito e propriedades antiaderentes que eliminam a pegajosidade da resina composta durante a escultura estratificada.',
    referenceTitle: 'Hilton, Ferracane, Broome — Summitt\'s Fundamentals of Operative Dentistry',
  },
  {
    id: 'a_3d_inst_select_colher',
    question:
      'Ao abordar cavidades profundas próximas à polpa, qual instrumento deve ser selecionado para curetagem manual seletiva tátil da dentina necrótica infectada, evitando abertura pulpar acidental?',
    category: 'instrumentos',
    difficulty: 'avancado',
    type: 'multiple_choice',
    sceneMode: 'instrument_3d',
    instrumentId: 'colher_dentina',
    options: [
      { id: 'a', text: 'Colher de Dentina de Black (cureta manual com borda afiada)', instrumentId: 'colher_dentina' },
      { id: 'b', text: 'Brocas Diamantadas Esféricas FG em alta velocidade', instrumentId: 'brocas_odontologicas' },
      { id: 'c', text: 'Pinça Porta-Grampos de Palmer', instrumentId: 'pinca_palmer' },
      { id: 'd', text: 'Fotopolimerizador LED odontológico', instrumentId: 'fotopolimerizador' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Colher de Dentina permite ao cirurgião-dentista discriminar tatilmente a dentina amolecida infectada da dentina afetada esclerosada, preservando a vitalidade pulpar.',
    referenceTitle: 'Schwendicke et al. — Consensus Recommendations on Carious Tissue Removal',
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
  {
    id: 'a_mc_lingua_1',
    question:
      'Paciente adulto jovem apresenta áreas eritematosas circundadas por bordas esbranquiçadas sinuosas no dorso lingual com padrão migratório ("mapa geográfico") e leve ardência a alimentos cítricos. Qual é o diagnóstico e o manejo clínico correto?',
    category: 'lingua',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Língua Geográfica (Glossite Migratória Benigna / Eritema Migratório); condição benigna autolimitada que requer apenas tranquilização do paciente e orientação de evitar alimentos picantes/ácidos' },
      { id: 'b', text: 'Carcinoma Espinocelular em estágio avançado; requer glossectomia parcial com esvaziamento cervical' },
      { id: 'c', text: 'Leucoplasia pilosa associada ao vírus Epstein-Barr; requer terapia antiviral de alta potência' },
      { id: 'd', text: 'Líquen plano bolhoso erosivo irreversível; requer radioterapia adjuvante' },
    ],
    correctOptionId: 'a',
    explanation:
      'A Língua Geográfica é uma anomalia benigna e comum. O aspecto migratório de áreas de descamação com halo serpiginoso esbranquiçado não requer biópsia se a apresentação clínica for clássica, dispensando tratamentos invasivos.',
    referenceTitle: 'Neville, Damm, Allen, Chi — Patologia Oral e Maxilofacial',
  },
  {
    id: 'a_mc_lingua_2',
    question:
      'Histopatologicamente, o que ocorre nas áreas centrais avermelhadas (eritematosas) observadas na Língua Geográfica?',
    category: 'lingua',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Perda/atrofia transitória das papilas filiformes com adelgaçamento epitelial e infiltrado inflamatório de neutrófilos formando microabscessos de Munro' },
      { id: 'b', text: 'Necrose liquefativa profunda dos fascículos do músculo genioglosso' },
      { id: 'c', text: 'Hiperqueratose maciça de papilas foliadas com displasia epitelial moderada' },
      { id: 'd', text: 'Trombose aguda dos ramos terminais da artéria lingual ranina' },
    ],
    correctOptionId: 'a',
    explanation:
      'A lesão central da língua geográfica exibe perda da queratina das papilas filiformes, expondo a vascularização subepitelial acompanhada de neutrófilos intraepiteliais (microabscessos de Munro), mimetizando o padrão histológico da psoríase.',
    referenceTitle: 'Regezi, Sciubba, Jordan — Patologia Oral: Correlações Clinicopatológicas',
  },
  {
    id: 'a_mc_lingua_3',
    question:
      'Durante o exame clínico dos nervos cranianos, ao solicitar a protrusão ativa da língua, observa-se que a ponta da língua desvia-se persistentemente para o lado ESQUERDO. Qual par craniano e estrutura muscular estão acometidos?',
    category: 'lingua',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Nervo Hipoglosso (NC XII) esquerdo ipsilateral, devido à fraqueza ou paralisia do músculo genioglosso esquerdo' },
      { id: 'b', text: 'Nervo Glossofaríngeo (NC IX) direito contralateral' },
      { id: 'c', text: 'Nervo Trigêmeo (ramo mandibular V3) com paralisia motora do masseter' },
      { id: 'd', text: 'Nervo Facial (NC VII) por incompetência do músculo orbicular da boca' },
    ],
    correctOptionId: 'a',
    explanation:
      'O músculo genioglosso é o principal protrator da língua. Na lesão do NC XII periférico (ipsilateral), a metade paralisada não exerce tração anterior, de modo que o genioglosso normal contralateral empurra a ponta da língua para o lado afetado.',
    referenceTitle: 'Kandel — Princípios da Neurociência & Sobotta',
  },
  {
    id: 'a_mc_inst_1',
    question:
      'Por que os instrumentais odontológicos modernos para inserção e escultura de resinas compostas são revestidos por filme ultrafino de Nitreto de Titânio (coloração dourada)?',
    category: 'instrumentos',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Confere alta dureza superficial e excelente antiaderência que impede que a matriz resinosa e suas cargas inorgânicas grudem na lâmina durante a modelagem anatômica' },
      { id: 'b', text: 'Aumenta a condutividade elétrica do instrumento para fotopolimerizar o compósito quimicamente' },
      { id: 'c', text: 'Permite que a espátula seja descartada após uso único sem lavagem' },
      { id: 'd', text: 'Serve unicamente para tingir a resina com pigmentos estéticos' },
    ],
    correctOptionId: 'a',
    explanation:
      'O revestimento de Nitreto de Titânio (TiN) possui baixo coeficiente de atrito superficial, minimizando a pegajosidade dos monômeros da resina e permitindo esculpir sulcos e cúspides anatômicas sem repuxar o material restaurador.',
    referenceTitle: 'Hilton, Ferracane, Broome — Summitt\'s Fundamentals of Operative Dentistry',
  },
  {
    id: 'a_mc_inst_2',
    question:
      'Nos aparelhos fotopolimerizadores odontológicos de LED azul de alta potência, qual faixa de comprimento de onda é indispensável para ativar com eficiência máxima o fotoiniciador canforoquinona em resinas compostas?',
    category: 'instrumentos',
    difficulty: 'avancado',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: '450 a 480 nm (espectro de luz azul visível com pico em 468 nm)' },
      { id: 'b', text: '200 a 280 nm (faixa UVC germicida invisível)' },
      { id: 'c', text: '750 a 900 nm (faixa infravermelha com geração de calor profundo)' },
      { id: 'd', text: '590 a 620 nm (faixa da luz âmbar alaranjada)' },
    ],
    correctOptionId: 'a',
    explanation:
      'A canforoquinona absorve fótons de luz prioritariamente entre 450 e 480 nm com pico máximo em 468 nm. O LED na faixa azul adequada assegura alta taxa de conversão de monômeros em polímeros, evitando falhas adesivas e toxicidade pulpar.',
    referenceTitle: 'Rueggeberg et al. — Light-curing in dentistry and photoinitiator chemistry',
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
 * Sorteia 5 questões aleatórias dentre as do nível escolhido com balanceamento de categorias:
 * - 1 desafio 3D de Ossos, Músculos, Partes do Corpo (Língua) ou Nervos no Crânio
 * - 1 desafio 3D interativo de Instrumentais e Ferramentas Odontológicas
 * - 0 ou 1 desafio 3D de Dentes Enfileirados (alternado com outros elementos)
 * - Questões teóricas e clínicas de múltipla escolha
 * Garantindo uma experiência variada sem nunca repetir múltiplos dentes em sequência.
 */
export function drawQuizQuestionsByLevel(
  difficulty: QuizDifficulty,
  count: number = QUIZ_QUESTIONS_PER_ROUND
): QuizQuestion[] {
  const levelPool = quizQuestions.filter((q) => q.difficulty === difficulty);

  // 1. Desafios 3D de Ossos, Músculos, Língua, Nervos e Estruturas Craniofaciais
  const anatomy3dPool = shuffleArray(
    levelPool.filter((q) => q.type === 'structure_identification' && q.sceneMode === 'full_anatomy')
  );

  // 2. Desafios 3D de Instrumentais e Ferramentas Odontológicas
  const instrument3dPool = shuffleArray(
    levelPool.filter((q) => q.sceneMode === 'instrument_3d')
  );

  // 3. Desafios 3D de Dentes Enfileirados
  const lineupPool = shuffleArray(
    levelPool.filter((q) => q.type === 'structure_identification' && q.sceneMode === 'teeth_lineup')
  );

  // 4. Questões de Múltipla Escolha Teóricas e Clínicas
  const mcPool = shuffleArray(
    levelPool.filter((q) => q.type === 'multiple_choice' && q.sceneMode !== 'instrument_3d')
  );

  const selected: QuizQuestion[] = [];

  // Regra 1: Garante SEMPRE 1 desafio 3D de Ossos / Músculos / Partes do Corpo / Nervos
  if (anatomy3dPool.length > 0) {
    selected.push(anatomy3dPool[0]);
  }

  // Regra 2: Garante SEMPRE 1 desafio 3D de Ferramentas & Instrumentais Odontológicos
  if (instrument3dPool.length > 0) {
    selected.push(instrument3dPool[0]);
  }

  // Regra 3: Com 50% de probabilidade, inclui 1 desafio de dente enfileirado OU um segundo desafio anatômico (osso/músculo)
  if (Math.random() < 0.50 && lineupPool.length > 0) {
    selected.push(lineupPool[0]);
  } else if (anatomy3dPool.length > 1) {
    selected.push(anatomy3dPool[1]);
  } else if (lineupPool.length > 0) {
    selected.push(lineupPool[0]);
  }

  // Regra 4: Completa as vagas restantes com questões clínicas de múltipla escolha
  const neededMc = Math.max(0, count - selected.length);
  selected.push(...mcPool.slice(0, neededMc));

  // Regra 5: Embaralha a ordem final das 5 questões para que os desafios 3D apareçam em posições dinâmicas
  return shuffleArray(selected).slice(0, count);
}
