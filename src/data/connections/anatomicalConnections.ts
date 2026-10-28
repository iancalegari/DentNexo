export interface AnatomicalConnectionItem {
  targetStructureId: string;
  relationType: 
    | 'innervates' 
    | 'innervated_by' 
    | 'vascularizes' 
    | 'vascularized_by' 
    | 'articulates_with' 
    | 'originates_from' 
    | 'inserts_into' 
    | 'supports' 
    | 'supported_by' 
    | 'traverses' 
    | 'adjacent_to';
  relationLabel: string;
  clinicalSignificance: string;
}

export const anatomicalConnectionsMap: Record<string, AnatomicalConnectionItem[]> = {
  // ================= DENTES ANTERIORES E POSTERIORES =================
  dente_11: [
    {
      targetStructureId: 'maxila',
      relationType: 'supported_by',
      relationLabel: 'Inserido no osso alveolar maxilar anterior',
      clinicalSignificance: 'Fundamental para estética facial, suporte labial e guia incisal anterior.',
    },
    {
      targetStructureId: 'nervo_maxilar_v2',
      relationType: 'innervated_by',
      relationLabel: 'Inervado pelo ramo alveolar superior anterior (de V2)',
      clinicalSignificance: 'Sensibilidade pulpar testada em traumatismos dentoalveolares anteriores.',
    },
    {
      targetStructureId: 'ligamento_periodontal',
      relationType: 'supported_by',
      relationLabel: 'Articulação alvéolo-dental (gonfose)',
      clinicalSignificance: 'Amortecimento axial e propriocepção fina durante apreensão de alimentos.',
    },
    {
      targetStructureId: 'dente_21',
      relationType: 'adjacent_to',
      relationLabel: 'Contato mesial com incisivo central contralateral',
      clinicalSignificance: 'Ponto de referência para linha média dental e estética do sorriso.',
    },
  ],

  dente_21: [
    {
      targetStructureId: 'maxila',
      relationType: 'supported_by',
      relationLabel: 'Inserido no processo alveolar maxilar esquerdo',
      clinicalSignificance: 'Anatomia coronária simétrica ao dente 11 determinante para a linha do sorriso.',
    },
    {
      targetStructureId: 'nervo_maxilar_v2',
      relationType: 'innervated_by',
      relationLabel: 'Inervado pelo nervo alveolar superior anterior esquerdo',
      clinicalSignificance: 'Bloqueio anestésico infraorbital ou infiltrativo submucoso.',
    },
    {
      targetStructureId: 'dente_11',
      relationType: 'adjacent_to',
      relationLabel: 'Contato interincisal mesial',
      clinicalSignificance: 'Área sujeita a diastemas interincisais por freio labial hipertrófico.',
    },
  ],

  dente_16: [
    {
      targetStructureId: 'maxila',
      relationType: 'supported_by',
      relationLabel: 'Inserido no osso maxilar superior direito',
      clinicalSignificance: 'Transmite forças mastigatórias para o pilar zigomático da face.',
    },
    {
      targetStructureId: 'seio_maxilar',
      relationType: 'adjacent_to',
      relationLabel: 'Ápices em íntimo contato com o assoalho do seio maxilar',
      clinicalSignificance: 'Infecções periapicais causam sinusite odontogênica; risco de comunicação bucosinusal em exodontias.',
    },
    {
      targetStructureId: 'nervo_maxilar_v2',
      relationType: 'innervated_by',
      relationLabel: 'Inervado pelos ramos alveolares superiores posterior e médio (V2)',
      clinicalSignificance: 'Anestesiado por bloqueio alveolar superior posterior e médio.',
    },
    {
      targetStructureId: 'arteria_maxilar',
      relationType: 'vascularized_by',
      relationLabel: 'Irrigado pela artéria alveolar superior posterior',
      clinicalSignificance: 'Suprimento sanguíneo pulpar abundante através do forame apical trifurcado.',
    },
  ],

  dente_26: [
    {
      targetStructureId: 'maxila',
      relationType: 'supported_by',
      relationLabel: 'Inserido na arcada maxilar superior esquerda',
      clinicalSignificance: 'Chave de oclusão de Angle (relação cúspide mésio-vestibular com sulco mésio-vestibular do 36).',
    },
    {
      targetStructureId: 'seio_maxilar',
      relationType: 'adjacent_to',
      relationLabel: 'Proximidade anatômica com a membrana de Schneider sinusal',
      clinicalSignificance: 'Pneumatização do seio após perda dentária necessita enxerto para implantes.',
    },
    {
      targetStructureId: 'nervo_maxilar_v2',
      relationType: 'innervated_by',
      relationLabel: 'Inervado pelos ramos do nervo maxilar esquerdo',
      clinicalSignificance: 'Inervação sensitiva pulpar e do periodonto de sustentação.',
    },
  ],

  dente_36: [
    {
      targetStructureId: 'mandibula',
      relationType: 'supported_by',
      relationLabel: 'Inserido no processo alveolar da mandíbula',
      clinicalSignificance: 'Alvéolo mandibular suporta cargas axiais de até 500 N; reabsorção óssea na periodontite compromete a sustentação.',
    },
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'innervated_by',
      relationLabel: 'Inervado pelo Nervo Alveolar Inferior (ramo de V3)',
      clinicalSignificance: 'Transmite dor de pulpite aguda; ápices radiculares estão a poucos milímetros do teto do canal mandibular.',
    },
    {
      targetStructureId: 'ligamento_periodontal',
      relationType: 'supported_by',
      relationLabel: 'Articulado pelo Ligamento Periodontal (gonfose)',
      clinicalSignificance: 'Mecanoreceptores periodontais informam feedback tátil mastigatório aos núcleos do trigêmeo.',
    },
    {
      targetStructureId: 'gengiva_inserida',
      relationType: 'adjacent_to',
      relationLabel: 'Circundado por gengiva marginal e inserida',
      clinicalSignificance: 'Selamento biológico contra invasão bacteriana cervical do biofilme.',
    },
    {
      targetStructureId: 'dente_38',
      relationType: 'adjacent_to',
      relationLabel: 'Vizinho posterior via segundo molar (37)',
      clinicalSignificance: 'A impactação do dente 38 pode causar retenção de biofilme e cáries cervicais nos molares anteriores.',
    },
  ],

  dente_46: [
    {
      targetStructureId: 'mandibula',
      relationType: 'supported_by',
      relationLabel: 'Inserido no corpo mandibular direito',
      clinicalSignificance: 'Primeiro dente permanente a erupcionar na dentição mista (cerca dos 6 anos).',
    },
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'innervated_by',
      relationLabel: 'Inervado pelo nervo alveolar inferior direito',
      clinicalSignificance: 'Bloqueio anestésico pterigomandibular necessário para procedimentos endodônticos.',
    },
    {
      targetStructureId: 'arteria_facial',
      relationType: 'adjacent_to',
      relationLabel: 'Proximidade com o trajeto da artéria facial na base mandibular',
      clinicalSignificance: 'Referência vascular na drenagem de abscessos odontogênicos em espaço submandibular.',
    },
  ],

  dente_38: [
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'adjacent_to',
      relationLabel: 'Ápices adjacentes ao canal do nervo alveolar inferior',
      clinicalSignificance: 'Risco crítico de parestesia temporária ou definitiva do lábio inferior após exodontia cirúrgica.',
    },
    {
      targetStructureId: 'nervo_lingual',
      relationType: 'adjacent_to',
      relationLabel: 'Nervo lingual corre na tábua óssea lingual adjacente',
      clinicalSignificance: 'Incisões relaxantes ou afastamento lingual inadequado podem lesionar o nervo e causar perda de sensibilidade lingual.',
    },
    {
      targetStructureId: 'mandibula',
      relationType: 'supported_by',
      relationLabel: 'Retido no ângulo/ramo da mandíbula',
      clinicalSignificance: 'Classificação de Pell e Gregory baseada na relação com a borda anterior do ramo mandibular.',
    },
  ],

  dente_48: [
    {
      targetStructureId: 'mandibula',
      relationType: 'supported_by',
      relationLabel: 'Alojado no ângulo mandibular direito',
      clinicalSignificance: 'Frequente sítio de pericoronarite aguda devido a capuz pericoronário inflamado.',
    },
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'adjacent_to',
      relationLabel: 'Relação íntima com o canal mandibular direito',
      clinicalSignificance: 'Avaliação tomográfica obrigatória se houver escurecimento ou desvio das raízes sobre o canal.',
    },
  ],

  // ================= SISTEMA ESQUELÉTICO CRANIOFACIAL =================
  mandibula: [
    {
      targetStructureId: 'masseter',
      relationType: 'inserts_into',
      relationLabel: 'Ponto de inserção da porção superficial e profunda do masseter',
      clinicalSignificance: 'Potência mastigatória concentrada no ângulo mandibular (tuberosidade massetérica).',
    },
    {
      targetStructureId: 'temporal_m',
      relationType: 'inserts_into',
      relationLabel: 'Processo coronoide serve de inserção para o músculo temporal',
      clinicalSignificance: 'Movimento de elevação e retração da mandíbula.',
    },
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'traverses',
      relationLabel: 'Canal mandibular aloja o nervo e vasos alveolares inferiores',
      clinicalSignificance: 'Canal ósseo delimitado que vai do forame mandibular ao forame mentual.',
    },
    {
      targetStructureId: 'pterigoideo_medial',
      relationType: 'inserts_into',
      relationLabel: 'Face medial do ângulo mandibular',
      clinicalSignificance: 'Forma a cinta muscular mastigatória suspensória com o masseter.',
    },
    {
      targetStructureId: 'pterigoideo_lateral',
      relationType: 'inserts_into',
      relationLabel: 'Fóvea pterigóidea do colo do côndilo mandibular',
      clinicalSignificance: 'Responsável pela abertura bucal, protrusão e lateralidade da ATM.',
    },
    {
      targetStructureId: 'dente_36',
      relationType: 'supports',
      relationLabel: 'Sustenta os dentes inferiores no processo alveolar',
      clinicalSignificance: 'Reabsorção fisiológica contínua após perdas dentárias.',
    },
  ],

  maxila: [
    {
      targetStructureId: 'seio_maxilar',
      relationType: 'supports',
      relationLabel: 'Contém a cavidade pneumática do seio maxilar',
      clinicalSignificance: 'Reduz o peso craniano e atua como câmara de ressonância da voz.',
    },
    {
      targetStructureId: 'dente_16',
      relationType: 'supports',
      relationLabel: 'Aloja as raízes dos dentes superiores no processo alveolar',
      clinicalSignificance: 'Espessura óssea vestibular reduzida facilita anestesias infiltrativas locais.',
    },
    {
      targetStructureId: 'neurocranio',
      relationType: 'articulates_with',
      relationLabel: 'Articula-se com os ossos frontal, zigomático, etmoide e esfenoide',
      clinicalSignificance: 'Pilares de resistência facial absorvem e dissipam forças mastigatórias para a base do crânio.',
    },
    {
      targetStructureId: 'nervo_maxilar_v2',
      relationType: 'traverses',
      relationLabel: 'Sulco e canal infraorbital percorrem o assoalho maxilar',
      clinicalSignificance: 'Emergência do forame infraorbital abaixo da margem orbitária inferior.',
    },
  ],

  seio_maxilar: [
    {
      targetStructureId: 'maxila',
      relationType: 'supported_by',
      relationLabel: 'Cavidade paranasal piramidal no corpo da maxila',
      clinicalSignificance: 'Maior seio paranasal humano com óstio de drenagem no meato nasal médio.',
    },
    {
      targetStructureId: 'dente_16',
      relationType: 'adjacent_to',
      relationLabel: 'Assoalho sinusal em contato direto com ápices molares',
      clinicalSignificance: 'Sinusite maxilar secundária a necrose pulpar ou periodontite apical.',
    },
    {
      targetStructureId: 'nervo_maxilar_v2',
      relationType: 'innervated_by',
      relationLabel: 'Mucosa inervada pelos ramos alveolares superiores do V2',
      clinicalSignificance: 'Dor de sinusite frequentemente mimetiza dor dentária odontogênica em molares.',
    },
  ],

  neurocranio: [
    {
      targetStructureId: 'mandibula',
      relationType: 'articulates_with',
      relationLabel: 'Fossa mandibular do osso temporal articula com o côndilo (ATM)',
      clinicalSignificance: 'Única articulação móvel da cabeça; envolvida em disfunções temporomandibulares (DTM).',
    },
    {
      targetStructureId: 'maxila',
      relationType: 'articulates_with',
      relationLabel: 'Articulações suturais faciais de dissipação de impacto',
      clinicalSignificance: 'Fraturas do terço médio da face (Le Fort I, II e III).',
    },
    {
      targetStructureId: 'nervo_trigemeo',
      relationType: 'supports',
      relationLabel: 'Aloja o gânglio trigeminal na cavidade trigeminal (Meckel)',
      clinicalSignificance: 'Origem das três divisões sensitivas trigeminais V1, V2 e V3.',
    },
    {
      targetStructureId: 'temporal_m',
      relationType: 'originates_from',
      relationLabel: 'Linha temporal inferior e fossa temporal',
      clinicalSignificance: 'Origem extensa em leque do músculo temporal.',
    },
  ],

  // ================= MÚSCULOS DA MASTIGAÇÃO =================
  masseter: [
    {
      targetStructureId: 'mandibula',
      relationType: 'inserts_into',
      relationLabel: 'Insere no ângulo e face lateral do ramo mandibular',
      clinicalSignificance: 'Eleva a mandíbula para fechamento dentário potente; hipertrofia associada ao bruxismo.',
    },
    {
      targetStructureId: 'nervo_trigemeo',
      relationType: 'innervated_by',
      relationLabel: 'Inervado pelo nervo massetérico (ramo do tronco anterior de V3)',
      clinicalSignificance: 'Inervação motora voluntária mastigatória.',
    },
    {
      targetStructureId: 'arteria_facial',
      relationType: 'adjacent_to',
      relationLabel: 'Contornado pela artéria facial na borda anterior',
      clinicalSignificance: 'Pulsação palpável clinicamente na incisura pré-massetérica.',
    },
  ],

  temporal_m: [
    {
      targetStructureId: 'neurocranio',
      relationType: 'originates_from',
      relationLabel: 'Origem na fossa temporal e fáscia temporal profunda',
      clinicalSignificance: 'Formato amplo em leque convergindo sob o arco zigomático.',
    },
    {
      targetStructureId: 'mandibula',
      relationType: 'inserts_into',
      relationLabel: 'Inserção no ápice e margens do processo coronoide',
      clinicalSignificance: 'Fibras anteriores elevam e fibras posteriores retraem a mandíbula.',
    },
    {
      targetStructureId: 'nervo_trigemeo',
      relationType: 'innervated_by',
      relationLabel: 'Inervado pelos nervos temporais profundos (V3)',
      clinicalSignificance: 'Ponto gatilho miofascial frequente de cefaleia tensional e apertamento dental.',
    },
  ],

  pterigoideo_lateral: [
    {
      targetStructureId: 'mandibula',
      relationType: 'inserts_into',
      relationLabel: 'Insere na fóvea pterigóidea do colo condilar e disco articular',
      clinicalSignificance: 'Feixe superior controla o disco da ATM; feixe inferior abre a boca e protrui a mandíbula.',
    },
    {
      targetStructureId: 'neurocranio',
      relationType: 'originates_from',
      relationLabel: 'Origem na asa maior do esfenoide e lâmina lateral pterigóidea',
      clinicalSignificance: 'Acomodado no espaço infratemporal profundo.',
    },
    {
      targetStructureId: 'arteria_maxilar',
      relationType: 'adjacent_to',
      relationLabel: 'Artéria maxilar cruza superficial ou profundamente ao músculo',
      clinicalSignificance: 'Reparo cirúrgico crítico em osteotomias e artroscopia da ATM.',
    },
  ],

  pterigoideo_medial: [
    {
      targetStructureId: 'mandibula',
      relationType: 'inserts_into',
      relationLabel: 'Face medial do ângulo e ramo da mandíbula',
      clinicalSignificance: 'Forma com o masseter a alça muscular suspensora do ângulo mandibular.',
    },
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'adjacent_to',
      relationLabel: 'Nervo alveolar e lingual descem na face lateral do músculo',
      clinicalSignificance: 'Espaço pterigomandibular é o sítio exato da punção anestésica para bloqueio mandibular.',
    },
  ],

  // ================= SISTEMA NERVOSO TRIGEMINAL =================
  nervo_trigemeo: [
    {
      targetStructureId: 'neurocranio',
      relationType: 'originates_from',
      relationLabel: 'Gânglio trigeminal na fossa média craniana (cavidade de Meckel)',
      clinicalSignificance: 'Principal nervo sensitivo da face, cavidade bucal e dentes, com raiz motora para mastigação.',
    },
    {
      targetStructureId: 'nervo_maxilar_v2',
      relationType: 'innervates',
      relationLabel: 'Emite o ramo V2 pelo forame redondo',
      clinicalSignificance: 'Sensibilidade exclusiva do terço médio da face e arcada superior.',
    },
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'innervates',
      relationLabel: 'Emite o nervo mandibular V3 pelo forame oval',
      clinicalSignificance: 'Sensibilidade e motricidade para arcada inferior e músculos mastigatórios.',
    },
    {
      targetStructureId: 'masseter',
      relationType: 'innervates',
      relationLabel: 'Ramos motores voluntários para os músculos mastigatórios',
      clinicalSignificance: 'Controle neural do ciclo mastigatório e reflexo de fechamento mandibular.',
    },
  ],

  nervo_maxilar_v2: [
    {
      targetStructureId: 'nervo_trigemeo',
      relationType: 'originates_from',
      relationLabel: 'Segunda divisão (sensitiva) do Nervo Trigêmeo',
      clinicalSignificance: 'Emerge da fossa pterigopalatina e ingressa na órbita.',
    },
    {
      targetStructureId: 'dente_16',
      relationType: 'innervates',
      relationLabel: 'Ramos alveolares superiores posteriores para os molares',
      clinicalSignificance: 'Anestesia de tuberosidade maxilar anestesia polpa dos molares.',
    },
    {
      targetStructureId: 'dente_11',
      relationType: 'innervates',
      relationLabel: 'Ramos alveolares superiores anteriores para dentes frontais',
      clinicalSignificance: 'Bloqueio do nervo infraorbital no forame correspondente.',
    },
    {
      targetStructureId: 'maxila',
      relationType: 'traverses',
      relationLabel: 'Percorre o canal infraorbital no teto do seio maxilar',
      clinicalSignificance: 'Risco de parestesia da bochecha e asa nasal em fraturas de terço médio.',
    },
  ],

  nervo_alveolar_inferior: [
    {
      targetStructureId: 'nervo_trigemeo',
      relationType: 'originates_from',
      relationLabel: 'Origem no tronco posterior do nervo mandibular (V3)',
      clinicalSignificance: 'Raiz mista com forte componente sensitivo e proprioceptivo.',
    },
    {
      targetStructureId: 'mandibula',
      relationType: 'traverses',
      relationLabel: 'Penetra no forame mandibular e percorre o canal mandibular',
      clinicalSignificance: 'Marco radiográfico radiolúcido delimitado por duas linhas radiopacas.',
    },
    {
      targetStructureId: 'nervo_mentual',
      relationType: 'innervates',
      relationLabel: 'Emite o nervo mentual no forame mentual',
      clinicalSignificance: 'Sensibilidade de tecido mole do lábio inferior e mento.',
    },
    {
      targetStructureId: 'dente_36',
      relationType: 'innervates',
      relationLabel: 'Inerva a polpa e o periodonto dos dentes inferiores',
      clinicalSignificance: 'Transmissão nociceptiva das afecções endodônticas mandibulares.',
    },
  ],

  nervo_lingual: [
    {
      targetStructureId: 'nervo_trigemeo',
      relationType: 'originates_from',
      relationLabel: 'Ramo do tronco posterior do nervo mandibular (V3)',
      clinicalSignificance: 'Sensibilidade geral (dor, temperatura, tato) dos 2/3 anteriores da língua.',
    },
    {
      targetStructureId: 'mandibula',
      relationType: 'adjacent_to',
      relationLabel: 'Corre subperiosteal na crista lingual medial aos terceiros molares',
      clinicalSignificance: 'Zona de alto risco cirúrgico em osteotomias de siso retido.',
    },
    {
      targetStructureId: 'gengiva_inserida',
      relationType: 'innervates',
      relationLabel: 'Inerva a gengiva lingual e mucosa do assoalho bucal',
      clinicalSignificance: 'Anestesiado em conjunto com o alveolar inferior pela técnica de Halsted.',
    },
  ],

  nervo_mentual: [
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'originates_from',
      relationLabel: 'Ramo terminal sensitivo do nervo alveolar inferior',
      clinicalSignificance: 'Emerge pelo forame mentual entre os ápices dos pré-molares inferiores.',
    },
    {
      targetStructureId: 'mandibula',
      relationType: 'traverses',
      relationLabel: 'Atravessa o forame mentual no corpo da mandíbula',
      clinicalSignificance: 'Ponto de bloqueio anestésico periférico para cirurgias labiais e de pré-molares.',
    },
    {
      targetStructureId: 'gengiva_inserida',
      relationType: 'innervates',
      relationLabel: 'Inerva a mucosa vestibular e gengiva dos pré-molares ao incisivo central',
      clinicalSignificance: 'Sensibilidade tátil labial essencial para continência salivar e fala.',
    },
  ],

  // ================= SISTEMA VASCULAR OROFACIAL =================
  arteria_maxilar: [
    {
      targetStructureId: 'mandibula',
      relationType: 'vascularizes',
      relationLabel: 'Emite a artéria alveolar inferior para o interior mandibular',
      clinicalSignificance: 'Nutrição óssea profunda da mandíbula e leito pulpar dos dentes inferiores.',
    },
    {
      targetStructureId: 'maxila',
      relationType: 'vascularizes',
      relationLabel: 'Emite artérias alveolares posteriores e infraorbital',
      clinicalSignificance: 'Vascularização do seio maxilar e de toda a dentição superior.',
    },
    {
      targetStructureId: 'masseter',
      relationType: 'vascularizes',
      relationLabel: 'Emite ramos musculares massetéricos na fossa infratemporal',
      clinicalSignificance: 'Suprimento arterial de alta densidade para suporte de esforço mastigatório.',
    },
  ],

  arteria_facial: [
    {
      targetStructureId: 'mandibula',
      relationType: 'adjacent_to',
      relationLabel: 'Cruza a borda inferior da mandíbula anterior ao músculo masseter',
      clinicalSignificance: 'Ponto clássico de hemostasia por compressão digital em hemorragias faciais.',
    },
    {
      targetStructureId: 'gengiva_inserida',
      relationType: 'vascularizes',
      relationLabel: 'Emite artérias labiais superior e inferior e ramos submentuais',
      clinicalSignificance: 'Cura rápida e vascularização rica de retalhos periodontais cirúrgicos.',
    },
    {
      targetStructureId: 'masseter',
      relationType: 'adjacent_to',
      relationLabel: 'Ascende na face sobre a margem anterior do masseter',
      clinicalSignificance: 'Marco anatômico fundamental para cirurgia ortognática e bucomaxilofacial.',
    },
  ],

  // ================= PERIODONTO & TECIDOS DE SUPORTE =================
  ligamento_periodontal: [
    {
      targetStructureId: 'dente_36',
      relationType: 'supports',
      relationLabel: 'Fibras colágenas de Sharpey inserem no cemento radicular',
      clinicalSignificance: 'Distribui as forças de impacto oclusal e previne anquilose dental.',
    },
    {
      targetStructureId: 'mandibula',
      relationType: 'supported_by',
      relationLabel: 'Fibras conectam o dente à lâmina dura do osso alveolar',
      clinicalSignificance: 'Espaço radiolúcido visível radiograficamente; alargamento indica trauma ou infecção periapical.',
    },
    {
      targetStructureId: 'nervo_alveolar_inferior',
      relationType: 'innervated_by',
      relationLabel: 'Rica rede de mecanorreceptores e nociceptores periodontais',
      clinicalSignificance: 'Permite discriminação tátil micrométrica de partículas alimentares mastigadas.',
    },
  ],

  gengiva_inserida: [
    {
      targetStructureId: 'mandibula',
      relationType: 'supported_by',
      relationLabel: 'Aderida firmemente ao periósteo alveolar subjacente',
      clinicalSignificance: 'Gengiva queratinizada resistente ao atrito da escovação e mastigação.',
    },
    {
      targetStructureId: 'dente_36',
      relationType: 'adjacent_to',
      relationLabel: 'Forma a união dentogengival com o esmalte via epitélio juncional',
      clinicalSignificance: 'Perda de inserção e aprofundamento do sulco caracterizam bolsa periodontal.',
    },
    {
      targetStructureId: 'arteria_facial',
      relationType: 'vascularized_by',
      relationLabel: 'Plexo capilar vascular subepitelial de alta regeneração',
      clinicalSignificance: 'Garante coloração rosa-pálido sadia e resposta imune rápida a patógenos orais.',
    },
  ],
};
