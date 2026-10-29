import { AnatomicalStructure } from '@/types/anatomy';
import { permanentTeethData } from '@/data/dental/teethData';
import { deciduousTeethData } from '@/data/dental/deciduousTeethData';
import { DetailedToothData } from '@/types/dental';

const baseAnatomicalStructures: Record<string, AnatomicalStructure> = {
  // ==================== OSSOS & CRÂNIO ====================
  mandibula: {
    id: 'mandibula',
    name: 'Mandíbula',
    scientificName: 'Mandibula',
    synonyms: ['Maxilar inferior', 'Osso mandibular'],
    category: 'skeletal',
    region: 'mandible',
    description: 'Maior, mais resistente e único osso móvel do esqueleto facial humano. Possui formato de ferradura horizontalizado anteriormente com dois ramos verticais posteriores.',
    function: 'Sustenta os dentes inferiores na arcada dentária, forma a mandíbula inferior, serve de inserção aos músculos da mastigação e articula-se com a base do crânio via ATM.',
    location: 'Porção ântero-inferior do viscerocrânio.',
    relations: ['maxila', 'nervo_alveolar_inferior', 'nervo_mentual', 'masseter', 'pterigoideo_medial', 'dente_36', 'dente_46'],
    innervation: 'Inervada sensitivamente pelo ramo mandibular do nervo trigêmeo (V3).',
    vascularization: 'Artéria alveolar inferior (ramo da artéria maxilar) e artérias linguais e faciais.',
    articulations: ['Articulação Temporomandibular (ATM) com o osso temporal', 'Oclusão dental com a maxila'],
    tissueComposition: ['Osso cortical denso externo', 'Osso trabecular/esponjoso interno', 'Canal mandibular', 'Processo alveolar'],
    clinicalRelevance: 'Sítio frequente de fraturas mandibulares (sínfise, ângulo e côndilo). Trajeto de bloqueio anestésico troncular do nervo alveolar inferior (técnica de Spix). Sítio de instalação de implantes e osteotomias ortognáticas.',
    pathologyIds: ['abscesso_periapical', 'periodontite'],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_mandible',
    colorHex: '#CBD5E1',
  },
  maxila: {
    id: 'maxila',
    name: 'Maxila',
    scientificName: 'Maxilla',
    synonyms: ['Maxilar superior', 'Osso maxilar'],
    category: 'skeletal',
    region: 'maxilla',
    description: 'Par de ossos pneumatizados que formam o centro da face, o assoalho da órbita, as paredes laterais da cavidade nasal e o palato duro anterior.',
    function: 'Aloja a arcada dentária superior, abriga o seio maxilar e absorve as forças mastigatórias transmitindo-as aos pilares craniofaciais.',
    location: 'Região média da face, articulando-se superiormente com o frontal e lateralmente com os zigomáticos.',
    relations: ['mandibula', 'seio_maxilar', 'nervo_maxilar_v2', 'dente_16', 'dente_26', 'arteria_maxilar'],
    innervation: 'Nervo Maxilar (V2) e seus ramos: nervos alveolares superiores anterior, médio e posterior.',
    vascularization: 'Artéria infraorbital, artéria alveolar superior posterior e ramos palatinos da artéria maxilar.',
    articulations: ['Osso frontal', 'Osso zigomático', 'Osso nasal', 'Osso palatino', 'Etmoide', 'Maxila contralateral'],
    tissueComposition: ['Osso cortical delgado', 'Cavidade pneumática (seio maxilar)', 'Processo alveolar com cortical vestibular fenestrada'],
    clinicalRelevance: 'Proximidade íntima das raízes dos molares e pré-molares superiores com a cavidade sinusal (risco de sinusite odontogênica e comunicação bucosinusal durante exodontias).',
    pathologyIds: ['carie_dentaria', 'abscesso_periapical', 'periodontite'],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_maxilla',
    colorHex: '#E2E8F0',
  },
  seio_maxilar: {
    id: 'seio_maxilar',
    name: 'Seio Maxilar',
    scientificName: 'Sinus maxillaris',
    synonyms: ['Antro de Highmore'],
    category: 'skeletal',
    region: 'maxilla',
    description: 'Maior dos seios paranasais, localizado no corpo da maxila, de formato piramidal com base voltada para a cavidade nasal.',
    function: 'Pneumatização do crânio, ressonância vocal, umidificação e aquecimento do ar inspirado.',
    location: 'Corpo da maxila, superiormente aos ápices radiculares dos dentes molares superiores.',
    relations: ['maxila', 'dente_16', 'dente_26', 'nervo_maxilar_v2'],
    innervation: 'Ramos alveolares superiores do nervo maxilar (V2).',
    vascularization: 'Artéria alveolar superior posterior e artéria infraorbital.',
    clinicalRelevance: 'Pneumatização progressiva após perdas dentárias exige cirurgia de levantamento de seio (sinus lift) para enxertia e implantes. Infecções periapicais de molares superiores podem causar sinusite maxilar odontogênica.',
    pathologyIds: ['abscesso_periapical'],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_maxillary_sinus',
    colorHex: '#94A3B8',
  },
  neurocranio: {
    id: 'neurocranio',
    name: 'Neurocrânio (Calvária e Base)',
    scientificName: 'Neurocranium',
    synonyms: ['Caixa craniana', 'Cálvaria'],
    category: 'skeletal',
    region: 'craniofacial',
    description: 'Conjunto ósseo que envolve e protege o encéfalo, composto pelos ossos frontal, parietais, occipital, temporais, esfenoide e etmoide.',
    function: 'Proteção encefálica, fixação da musculatura mastigatória na fossa temporal e passagem dos nervos cranianos pelos forames da base.',
    location: 'Porção superior e posterior da cabeça.',
    relations: ['maxila', 'mandibula', 'temporal_m', 'nervo_trigemeo'],
    articulations: ['Suturas coronária, sagital, lambdóidea e escamosa'],
    clinicalRelevance: 'A fossa temporal abriga o músculo temporal; a asa maior do esfenoide e a fossa infratemporal contêm os trajetos nobres dos ramos do nervo trigêmeo e artéria maxilar.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_cranium',
    colorHex: '#D1D5DB',
  },
  osso_frontal: {
    id: 'osso_frontal',
    name: 'Osso Frontal',
    scientificName: 'Os frontale',
    synonyms: ['Frontal', 'Osso da fronte/testa'],
    category: 'skeletal',
    region: 'craniofacial',
    description: 'Osso ímpar, plano e pneumatizado que forma a fronte (testa), o teto das órbitas oculares e a porção anterior do assoalho da cavidade craniana (fossa craniana anterior).',
    function: 'Protege os lobos frontais do encéfalo, abriga os seios frontais e confere sustentação óssea superior para a cavidade orbitária e terço médio facial.',
    location: 'Porção anterior e superior da abóbada craniana.',
    relations: ['osso_parietal', 'osso_nasal', 'osso_zigomatico', 'osso_esfenoide', 'osso_etmoide', 'maxila'],
    articulations: [
      'Sutura coronal com ambos ossos parietais',
      'Sutura frontonasal com os ossos nasais',
      'Sutura frontozigomática com os ossos zigomáticos',
      'Sutura frontomaxilar com os processos frontais das maxilas',
      'Articulação esfenofrontal e frontoetmoidal'
    ],
    tissueComposition: ['Lâmina externa de osso cortical', 'Díploe esponjosa', 'Lâmina interna compacta', 'Seio frontal pneumático'],
    clinicalRelevance: 'A sutura frontomaxilar e frontozigomática são pilares essenciais na fixação de fraturas faciais panfaciais e Le Fort II e III. O teto orbitário pode sofrer fraturas por explosão ("blowout").',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_frontal_bone',
    colorHex: '#E2E8F0',
  },
  osso_parietal: {
    id: 'osso_parietal',
    name: 'Osso Parietal',
    scientificName: 'Os parietale',
    synonyms: ['Parietal', 'Bóveda craniana'],
    category: 'skeletal',
    region: 'craniofacial',
    description: 'Par de ossos planos e quadriláteros que compõem a maior extensão das paredes laterais e do teto (calvária) do crânio.',
    function: 'Proteção dos lobos parietais encefálicos e ponto de ancoragem para a fáscia e músculo temporal nas linhas temporais superior e inferior.',
    location: 'Porção látero-superior da calvária craniana, entre o frontal e o occipital.',
    relations: ['osso_frontal', 'osso_occipital', 'osso_temporal', 'osso_esfenoide', 'temporal_m'],
    articulations: [
      'Sutura sagital (entre parietal direito e esquerdo)',
      'Sutura coronal (com o osso frontal)',
      'Sutura lambdóidea (com o osso occipital)',
      'Sutura escamosa (com a escama do osso temporal)',
      'Sutura esfenoparietal no ptérion'
    ],
    tissueComposition: ['Tábua óssea externa', 'Díploe vascularizada', 'Tábua óssea interna'],
    clinicalRelevance: 'O ponto craniométrico ptérion situa-se na sua junção ântero-inferior, sobrepondo o trajeto da artéria meníngea média; traumas nessa região trazem alto risco de hematoma extradural agudo.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_parietal_bone',
    colorHex: '#CBD5E1',
  },
  osso_temporal: {
    id: 'osso_temporal',
    name: 'Osso Temporal',
    scientificName: 'Os temporale',
    synonyms: ['Temporal', 'Osso da têmpora'],
    category: 'skeletal',
    region: 'temporomandibular',
    description: 'Par de ossos complexos da base e laterais do crânio, formados pelas porções escamosa, timpânica, mastóidea e petrosa. Abriga a fossa mandibular e o tubérculo articular da ATM, além dos órgãos da audição e do equilíbrio.',
    function: 'Componente craniano articular da Articulação Temporomandibular (ATM), abrigo do ouvido médio e interno, e inserção do músculo temporal e feixe mastigatório.',
    location: 'Faces látero-inferiores da caixa craniana, inferiormente aos ossos parietais.',
    relations: ['mandibula', 'atm', 'osso_parietal', 'osso_zigomatico', 'osso_esfenoide', 'osso_occipital', 'temporal_m'],
    articulations: [
      'Articulação Temporomandibular (ATM) com o côndilo da mandíbula',
      'Arco zigomático (processo zigomático articulado ao osso zigomático)',
      'Suturas escamosa, parietomastóidea e occipitomastóidea'
    ],
    tissueComposition: ['Porção escamosa delgada', 'Porção petrosa de osso extremamente denso', 'Processo mastoide pneumatizado (células mastóideas)', 'Processo estiloide'],
    clinicalRelevance: 'Pilar fundamental da oclusão e função mandibular. Deslocamentos e alterações degenerativas do disco na fossa articular do temporal originam disfunções temporomandibulares (DTM), estalidos e limitação de abertura bucal.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_temporal_bone',
    colorHex: '#94A3B8',
  },
  osso_occipital: {
    id: 'osso_occipital',
    name: 'Osso Occipital',
    scientificName: 'Os occipitale',
    synonyms: ['Occipital', 'Osso da nuca'],
    category: 'skeletal',
    region: 'craniofacial',
    description: 'Osso ímpar de formato trapezoidal e côncavo na região póstero-inferior do crânio. Apresenta o forame magno, por onde o bulbo encefálico se comunica com a medula espinhal.',
    function: 'Proteção do cerebelo e tronco encefálico; articulação da cabeça com a coluna cervical via côndilos occipitais (articulação atlanto-occipital).',
    location: 'Base posterior do neurocrânio.',
    relations: ['osso_parietal', 'osso_temporal', 'osso_esfenoide'],
    articulations: [
      'Sutura lambdóidea com os ossos parietais',
      'Sutura occipitomastóidea com os temporais',
      'Articulação atlanto-occipital com a primeira vértebra cervical (atlas/C1)',
      'Sincondrose esfeno-occipital'
    ],
    tissueComposition: ['Escama occipital', 'Partes laterais condilares', 'Parte basilar densa'],
    clinicalRelevance: 'Pontos craniométricos e cefalométricos ortodônticos fundamentais (Basion, Opístion, Inion). Sítio de fixação de musculatura postural cervical associada a dores miofasciais e DTM.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_occipital_bone',
    colorHex: '#CBD5E1',
  },
  osso_esfenoide: {
    id: 'osso_esfenoide',
    name: 'Osso Esfenoide',
    scientificName: 'Os sphenoidale',
    synonyms: ['Esfenoide', 'Osso em cunha'],
    category: 'skeletal',
    region: 'craniofacial',
    description: 'Osso ímpar central com morfologia semelhante a um morcego com asas estendidas. Atua como pedra angular ("keystone") da base do crânio, interligando neurocrânio e viscerocrânio.',
    function: 'Abriga a hipófise na sela túrcica, forma a fossa craniana média, e fornece os processos pterigóideos para a ancoragem dos músculos pterigóideos da mastigação.',
    location: 'Centro da base craniana, anterior aos ossos temporais e basilar occipital.',
    relations: ['maxila', 'pterigoideo_lateral', 'pterigoideo_medial', 'nervo_trigemeo', 'nervo_maxilar_v2', 'arteria_maxilar', 'osso_frontal', 'osso_temporal'],
    articulations: [
      'Articula-se com todos os demais 7 ossos do neurocrânio (frontal, parietais, temporais, occipital, etmoide)',
      'Articula-se com maxilas, zigomáticos, palatinos e vômer'
    ],
    tissueComposition: ['Corpo com seios esfenoidais pneumáticos', 'Asas menores', 'Asas maiores', 'Processos pterigóideos com lâminas medial e lateral'],
    clinicalRelevance: 'As lâminas pterigóideas são sítio de origem muscular mastigatória e referência anatômica primordial em cirurgia ortognática (disjunção pterigomaxilar em osteotomias Le Fort I). Os forames redondo (passagem de V2) e oval (passagem de V3) são marcos neurológicos odontológicos capitais.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_sphenoid_bone',
    colorHex: '#94A3B8',
  },
  osso_etmoide: {
    id: 'osso_etmoide',
    name: 'Osso Etmoide',
    scientificName: 'Os ethmoidale',
    synonyms: ['Etmoide'],
    category: 'skeletal',
    region: 'craniofacial',
    description: 'Osso ímpar esponjoso e pneumatizado no plano médio da base anterior do crânio, entre as órbitas e no teto da cavidade nasal.',
    function: 'Formação do septo nasal medial (lâmina perpendicular), teto olfatório nasal (lâmina cribriforme) e conchas nasais superior e média.',
    location: 'Entre as duas órbitas oculares e cavidades nasais.',
    relations: ['osso_frontal', 'osso_esfenoide', 'osso_nasal', 'maxila'],
    articulations: ['Frontal, esfenoide, vômer, maxilas, ossos nasais, lacrimais e palatinos'],
    tissueComposition: ['Lâmina horizontal crivosa', 'Lâmina perpendicular', 'Labirintos etmoidais com células etmoidais'],
    clinicalRelevance: 'A lâmina crivosa perfurada transmite os filetes olfatórios (NC I). Fraturas naso-órbito-etmoidais (NOE) associadas a traumas maxilofaciais podem resultar em rinoliquorreia e anosmia.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_ethmoid_bone',
    colorHex: '#E2E8F0',
  },
  osso_zigomatico: {
    id: 'osso_zigomatico',
    name: 'Osso Zigomático',
    scientificName: 'Os zygomaticum',
    synonyms: ['Malar', 'Osso da bochecha'],
    category: 'skeletal',
    region: 'craniofacial',
    description: 'Par de ossos losangulares e robustos que formam a proeminência malar da face (maçã do rosto) e a parede inferolateral da órbita.',
    function: 'Dissipação de impactos mastigatórios e faciais para a base do crânio, proteção do globo ocular e origem do músculo masseter ao longo do arco zigomático.',
    location: 'Região súpero-lateral da face.',
    relations: ['maxila', 'osso_frontal', 'osso_temporal', 'masseter', 'nervo_maxilar_v2'],
    articulations: [
      'Processo zigomático da maxila',
      'Processo zigomático do osso temporal (formando o arco zigomático)',
      'Processo zigomático do osso frontal',
      'Asa maior do osso esfenoide'
    ],
    tissueComposition: ['Osso cortical espesso e resistente', 'Processos frontal, temporal e maxilar'],
    clinicalRelevance: 'Segundo ponto mais comum de fratura facial (fraturas do complexo zigomático-maxilar ou em trípode). O afundamento do arco zigomático pode aprisionar o processo coronoide da mandíbula gerando trismo agudo por impedimento mecânico.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_zygomatic_bone',
    colorHex: '#94A3B8',
  },
  osso_nasal: {
    id: 'osso_nasal',
    name: 'Osso Nasal',
    scientificName: 'Os nasale',
    synonyms: ['Ossos próprios do nariz'],
    category: 'skeletal',
    region: 'craniofacial',
    description: 'Par de pequenos ossos laminares oblongos unidos na linha média anterior para formar o dorso e a ponte óssea nasal.',
    function: 'Sustentação estrutural da ponte nasal e ponto de fixação para as cartilagens nasais laterais e do septo.',
    location: 'Linha média superior do esqueleto facial, entre os processos frontais das maxilas.',
    relations: ['maxila', 'osso_frontal', 'osso_etmoide'],
    articulations: [
      'Sutura internasal (na linha média sagital)',
      'Sutura frontonasal superiormente',
      'Sutura nasomaxilar lateralmente com a maxila',
      'Lâmina perpendicular do etmoide posteriormente'
    ],
    tissueComposition: ['Osso cortical laminar delgado bilateral'],
    clinicalRelevance: 'Estrutura óssea com maior índice de fraturas faciais no atendimento emergencial odontológico e bucomaxilofacial. O diagnóstico clínico rápido evita consolidação viciosa e deformidade em "nariz em sela".',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_nasal_bone',
    colorHex: '#CBD5E1',
  },

  // ==================== MÚSCULOS DA MASTIGAÇÃO E PERIORAIS ====================
  masseter: {
    id: 'masseter',
    name: 'Músculo Masseter',
    scientificName: 'Musculus masseter',
    synonyms: ['Masséter'],
    category: 'muscular',
    region: 'temporomandibular',
    description: 'Poderoso músculo mastigatório quadrangular espesso, dividido em porção superficial e porção profunda.',
    function: 'Elevação potente da mandíbula (fechamento oclusal) e leve protrusão mandibular pela porção superficial.',
    location: 'Aspecto lateral da face, cobrindo o ramo mandibular.',
    muscularOrigin: 'Arco zigomático (borda inferior e face medial).',
    muscularInsertion: 'Ângulo e face lateral do ramo da mandíbula (tuberosidade massetérica).',
    relations: ['mandibula', 'arteria_facial', 'nervo_trigemeo', 'pterigoideo_medial'],
    innervation: 'Nervo massetérico, ramo da divisão mandibular do nervo trigêmeo (V3).',
    vascularization: 'Artéria massetérica (ramo da artéria maxilar) e ramos da artéria facial.',
    clinicalRelevance: 'Hipertrofia do masseter associada a bruxismo severo e apertamento dental. Ponto de dor miofascial e tratamento com toxina botulínica terapêutica.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_masseter',
    colorHex: '#EF4444',
  },
  temporal_m: {
    id: 'temporal_m',
    name: 'Músculo Temporal',
    scientificName: 'Musculus temporalis',
    synonyms: ['Temporal'],
    category: 'muscular',
    region: 'temporomandibular',
    description: 'Músculo largo em formato de leque que preenche a fossa temporal e converge sob o arco zigomático.',
    function: 'Fibras anteriores e médias elevam a mandíbula; fibras posteriores horizontais retraem a mandíbula (retrusão).',
    location: 'Fossa temporal da calvária craniana.',
    muscularOrigin: 'Assoalho da fossa temporal e fáscia temporal profunda.',
    muscularInsertion: 'Processo coronoide da mandíbula e borda anterior do ramo mandibular.',
    relations: ['neurocranio', 'mandibula', 'nervo_trigemeo'],
    innervation: 'Nervos temporais profundos anteriores e posteriores (ramos do nervo mandibular V3).',
    vascularization: 'Artérias temporais profundas anterior e posterior (ramos da artéria maxilar) e artéria temporal média.',
    clinicalRelevance: 'Cefaleia tensional e disfunção temporomandibular (DTM) frequentemente envolvem pontos-gatilho miofasciais no músculo temporal.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_temporalis',
    colorHex: '#DC2626',
  },
  pterigoideo_lateral: {
    id: 'pterigoideo_lateral',
    name: 'Músculo Pterigóideo Lateral',
    scientificName: 'Musculus pterygoideus lateralis',
    synonyms: ['Pterigoideo externo'],
    category: 'muscular',
    region: 'temporomandibular',
    description: 'Músculo com dois ventres (superior e inferior) situado profundamente na fossa infratemporal.',
    function: 'Contração bilateral projeta a mandíbula para frente (protrusão) e auxilia na abertura bucal; contração unilateral promove lateralidade mandibular (didução).',
    location: 'Fossa infratemporal profunda.',
    muscularOrigin: 'Ventre superior: asa maior do esfenoide. Ventre inferior: lâmina lateral do processo pterigoide.',
    muscularInsertion: 'Fóvea pterigóidea no colo do côndilo mandibular e cápsula/disco da ATM.',
    relations: ['mandibula', 'nervo_trigemeo', 'arteria_maxilar'],
    innervation: 'Nervo pterigóideo lateral (ramo do V3).',
    vascularization: 'Ramos pterigóideos da artéria maxilar.',
    clinicalRelevance: 'Papel fundamental no deslocamento de disco articular da ATM e estalidos articulares.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_lateral_pterygoid',
    colorHex: '#B91C1C',
  },
  pterigoideo_medial: {
    id: 'pterigoideo_medial',
    name: 'Músculo Pterigóideo Medial',
    scientificName: 'Musculus pterygoideus medialis',
    synonyms: ['Pterigoideo interno'],
    category: 'muscular',
    region: 'temporomandibular',
    description: 'Músculo espesso e quadrilátero que corre medialmente ao ramo da mandíbula, formando uma alça muscular juntamente com o masseter.',
    function: 'Elevação da mandíbula (fechamento dental potente) e auxílio na protrusão.',
    location: 'Face medial do ramo mandibular (fossa infratemporal profunda).',
    muscularOrigin: 'Fossa pterigóidea (processo pterigoide do osso esfenoide) e tuberosidade da maxila.',
    muscularInsertion: 'Face medial do ângulo e ramo da mandíbula (tuberosidade pterigóidea).',
    relations: ['mandibula', 'pterigoideo_lateral', 'nervo_lingual', 'nervo_alveolar_inferior'],
    innervation: 'Nervo pterigóideo medial (ramo do nervo mandibular V3).',
    vascularization: 'Ramos pterigóideos da artéria maxilar.',
    clinicalRelevance: 'O espaço pterigomandibular entre o músculo e a mandíbula é o local exato onde se deposita a solução anestésica no bloqueio do nervo alveolar inferior. Lesão acidental por agulha pode originar trismo anestésico.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_medial_pterygoid',
    colorHex: '#991B1B',
  },
  musculo_orbicular_boca: {
    id: 'musculo_orbicular_boca',
    name: 'Músculo Orbicular da Boca',
    scientificName: 'Musculus orbicularis oris',
    synonyms: ['Orbicular dos lábios', 'Músculo perioral principal'],
    category: 'muscular',
    region: 'perioral',
    description: 'Músculo esfincteriano complexo e estriado que circunda completamente a rima bucal, constituindo a espessura e sustentação dos lábios superior e inferior.',
    function: 'Oclusão e fechamento labial (selamento passivo), protrusão dos lábios (assobiar/beijar), retenção de saliva e alimentos durante a mastigação, e articulação fonética.',
    location: 'Região labial e perioral da face anterior.',
    muscularOrigin: 'Fibras musculares intrínsecas dos lábios e inserções ósseas sutis na maxila (fossa incisiva superior) e mandíbula (fossa incisiva inferior).',
    muscularInsertion: 'Pele e mucosa dos lábios, entrelaçando-se no modíolo labial com os músculos bucinador, elevadores e depressores labiais.',
    relations: ['maxila', 'mandibula', 'musculo_bucinador', 'arteria_facial', 'dente_11', 'dente_21', 'dente_31', 'dente_41'],
    innervation: 'Ramos bucais e ramo marginal da mandíbula do nervo facial (NC VII).',
    vascularization: 'Artérias labial superior e labial inferior (ramos colaterais da artéria facial).',
    clinicalRelevance: 'Garante o selamento labial indispensável para a respiração nasal normal. A incompetência labial crônica causa protrusão de incisivos e gengivite ressecativa anterior. É região anatômica de referência para volumização e harmonização orofacial com ácido hialurônico.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_orbicularis_oris',
    colorHex: '#EF4444',
  },
  musculo_bucinador: {
    id: 'musculo_bucinador',
    name: 'Músculo Bucinador',
    scientificName: 'Musculus buccinator',
    synonyms: ['Bucinador', 'Músculo da bochecha'],
    category: 'muscular',
    region: 'perioral',
    description: 'Músculo quadrilátero delgado que forma a sustentação muscular da bochecha, estendendo-se da maxila e mandíbula até o modíolo labial.',
    function: 'Comprime a bochecha contra os dentes molares e pré-molares durante a mastigação, mantendo o bolo alimentar sob as cúspides oclusais e evitando acúmulo no vestíbulo; atua no sopro e na sucção.',
    location: 'Parede lateral da cavidade oral (bochecha).',
    muscularOrigin: 'Processos alveolares da maxila e mandíbula adjacentes aos dentes molares, e rafe pterigomandibular.',
    muscularInsertion: 'Ângulo da boca (modíolo), integrando-se intimamente às fibras do músculo orbicular da boca.',
    relations: ['masseter', 'musculo_orbicular_boca', 'arteria_facial', 'mandibula', 'maxila'],
    innervation: 'Inervação motora pelos ramos bucais do nervo facial (NC VII); inervação sensitiva da mucosa jugal pelo nervo bucal (ramo sensitivo de V3).',
    vascularization: 'Artéria bucal (ramo da artéria maxilar) e anastomoses da artéria facial.',
    clinicalRelevance: 'É transfixado pelo ducto parotídeo (de Stenon) na altura do segundo molar superior. Sua tonicidade é crucial para retenção de próteses totais; em casos de paralisia facial, a bochecha perde tônus acumulando alimentos no fundo de sulco.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_buccinator',
    colorHex: '#F87171',
  },

  // ==================== SISTEMA NERVOSO ====================
  nervo_trigemeo: {
    id: 'nervo_trigemeo',
    name: 'Nervo Trigêmeo (V Par Craniano)',
    scientificName: 'Nervus trigeminus (CN V)',
    synonyms: ['V par craniano', 'Trigêmeo'],
    category: 'nervous',
    region: 'craniofacial',
    description: 'Maior nervo craniano, de natureza mista (predominantemente sensitivo, com raiz motora para os músculos da mastigação). Emerge da ponte e forma o gânglio trigeminal (de Gasser).',
    function: 'Inervação sensitiva geral da face, dentes, cavidade oral, ATM e dura-máter, além de inervação motora dos músculos mastigatórios.',
    location: 'Origina-se no tronco encefálico e divide-se na fossa craniana média em três ramos: Oftálmico (V1), Maxilar (V2) e Mandibular (V3).',
    relations: ['nervo_maxilar_v2', 'nervo_alveolar_inferior', 'nervo_lingual', 'mandibula', 'maxila'],
    clinicalRelevance: 'É a base anatômica de toda a anestesiologia odontológica local e loco-regional. Neuralgia do trigêmeo é uma das condições mais dolorosas da medicina oral.',
    pathologyIds: ['pulpite', 'abscesso_periapical'],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_trigeminal_ganglion',
    colorHex: '#FACC15',
  },
  nervo_maxilar_v2: {
    id: 'nervo_maxilar_v2',
    name: 'Nervo Maxilar (V2)',
    scientificName: 'Nervus maxillaris',
    synonyms: ['Segunda divisão trigeminal'],
    category: 'nervous',
    region: 'maxilla',
    description: 'Segunda divisão exclusivamente sensitiva do nervo trigêmeo. Atravessa o forame redondo para atingir a fossa pterigopalatina.',
    function: 'Sensibilidade de todos os dentes superiores, gengiva superior, palato duro e mole, seio maxilar e terço médio da face.',
    location: 'Fossa pterigopalatina e assoalho da órbita.',
    relations: ['maxila', 'seio_maxilar', 'dente_16', 'dente_26', 'nervo_trigemeo'],
    clinicalRelevance: 'Fornece os nervos alveolares superiores posterior, médio e anterior, anestesiados por técnicas infiltrativas supraperiosteais ou bloqueio do nervo maxilar na tuberosidade.',
    pathologyIds: ['pulpite'],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_v2_nerve',
    colorHex: '#FDE047',
  },
  nervo_alveolar_inferior: {
    id: 'nervo_alveolar_inferior',
    name: 'Nervo Alveolar Inferior',
    scientificName: 'Nervus alveolaris inferior',
    synonyms: ['NAI', 'Nervo dentário inferior'],
    category: 'nervous',
    region: 'mandible',
    description: 'Maior ramo da divisão posterior do nervo mandibular (V3). Penetra o forame mandibular na espícula de Spix e percorre o canal mandibular.',
    function: 'Inerva a polpa e o periodonto de todos os dentes inferiores do quadrante e fornece o nervo mentual e o nervo incisivo.',
    location: 'Espaço pterigomandibular e interior do canal mandibular na mandíbula.',
    relations: ['mandibula', 'nervo_mentual', 'nervo_lingual', 'dente_36', 'dente_46', 'dente_38'],
    innervation: 'Ramo do nervo mandibular (V3).',
    vascularization: 'Acompanhado pela artéria alveolar inferior.',
    clinicalRelevance: 'Alvo primordial do bloqueio mandibular (Spix). Relação de proximidade crítica com os ápices radiculares do terceiro molar inferior (siso), com risco de parestesia pós-exodontia.',
    pathologyIds: ['pulpite', 'abscesso_periapical'],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck', 'ref_cohen_endodontics'],
    meshId: 'mesh_inferior_alveolar_nerve',
    colorHex: '#EAB308',
  },
  nervo_lingual: {
    id: 'nervo_lingual',
    name: 'Nervo Lingual',
    scientificName: 'Nervus lingualis',
    synonyms: ['Ramo lingual do V3'],
    category: 'nervous',
    region: 'mandible',
    description: 'Ramo do V3 que corre anteriormente ao nervo alveolar inferior, recebendo a corda do tímpano (do nervo facial VII).',
    function: 'Sensibilidade geral (dor, tato, temperatura) dos 2/3 anteriores da língua, mucosa do assoalho bucal e gengiva lingual dos dentes inferiores; gustação via corda do tímpano.',
    location: 'Espaço pterigomandibular, passando medialmente à cortical lingual do terceiro molar inferior.',
    relations: ['mandibula', 'nervo_alveolar_inferior', 'dente_38', 'dente_48'],
    clinicalRelevance: 'Vulnerável a lesões iatrogênicas por incisões relaxantes linguais ou exodontias cirúrgicas de sisos inclusos, podendo resultar em perda transitória ou permanente de sensibilidade na língua.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_lingual_nerve',
    colorHex: '#CA8A04',
  },
  nervo_mentual: {
    id: 'nervo_mentual',
    name: 'Nervo Mentual',
    scientificName: 'Nervus mentalis',
    synonyms: ['Ramo mentoniano'],
    category: 'nervous',
    region: 'mandible',
    description: 'Ramo terminal do nervo alveolar inferior que emerge pelo forame mentual (localizado tipicamente entre as raízes dos pré-molares inferiores).',
    function: 'Sensibilidade do lábio inferior, mucosa vestibular dos dentes anteriores inferiores e mento (queixo).',
    location: 'Região apical entre o 1º e 2º pré-molares inferiores.',
    relations: ['mandibula', 'nervo_alveolar_inferior'],
    clinicalRelevance: 'Ponto de bloqueio anestésico periférico. Requer localização cuidadosa em cirurgias de implantes na região de pré-molares inferiores para evitar lesão nervosa.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_mental_nerve',
    colorHex: '#EAB308',
  },

  // ==================== SISTEMA VASCULAR ====================
  arteria_maxilar: {
    id: 'arteria_maxilar',
    name: 'Artéria Maxilar',
    scientificName: 'Arteria maxillaris',
    synonyms: ['Artéria maxilar interna'],
    category: 'vascular',
    region: 'craniofacial',
    description: 'Maior dos dois ramos terminais da artéria carótida externa, originando-se profundamente no parênquima da glândula parótida.',
    function: 'Irrigação de quase todas as estruturas profundas da face: dentes superiores e inferiores, gengiva, ossos maxilares, palato, músculos da mastigação e meninges.',
    location: 'Inicia no colo da mandíbula, atravessa a fossa infratemporal e termina na fossa pterigopalatina.',
    relations: ['mandibula', 'maxila', 'arteria_facial', 'nervo_alveolar_inferior'],
    clinicalRelevance: 'Ramos como a artéria meníngea média (risco de hematoma extradural), artéria alveolar inferior e artérias alveolares superiores são essenciais na hemostasia cirúrgica bucomaxilofacial.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_maxillary_artery',
    colorHex: '#EF4444',
  },
  arteria_facial: {
    id: 'arteria_facial',
    name: 'Artéria Facial',
    scientificName: 'Arteria facialis',
    synonyms: ['Artéria maxilar externa'],
    category: 'vascular',
    region: 'perioral',
    description: 'Ramo anterior da artéria carótida externa que sobe sinuosamente ao longo da face.',
    function: 'Irrigação dos músculos da expressão facial, lábio superior e inferior, bochechas e asa do nariz.',
    location: 'Contorna a borda inferior da mandíbula no ângulo ântero-inferior do masseter e ascende até o ângulo medial do olho (artéria angular).',
    relations: ['mandibula', 'masseter'],
    clinicalRelevance: 'A palpação do pulso da artéria facial na borda inferior da mandíbula é um marco anatômico e clínico importante. Cuidados durante procedimentos cirúrgicos e preenchimentos labiais.',
    pathologyIds: [],
    referenceIds: ['ref_fcat_terminologia', 'ref_sobotta_head_neck'],
    meshId: 'mesh_facial_artery',
    colorHex: '#DC2626',
  },

  // ==================== TECIDOS BUCAIS & PERIODONTAIS ====================
  ligamento_periodontal: {
    id: 'ligamento_periodontal',
    name: 'Ligamento Periodontal (LPO)',
    scientificName: 'Ligamentum periodontale',
    synonyms: ['Desmodonto', 'Membrana periodontal'],
    category: 'oral_tissue',
    region: 'dental_arch_lower',
    description: 'Tecido conjuntivo frouxo e denso altamente vascularizado e celularizado (espessura média de 0,15 a 0,38 mm) que une o cemento radicular ao osso alveolar.',
    function: 'Amortecimento hidrodinâmico das cargas mastigatórias, propriocepção oclusal precisa, nutrição tecidual e remodelamento ósseo.',
    location: 'Espaço periodontal entre a raiz dental e a lâmina dura alveolar.',
    relations: ['dente_36', 'mandibula', 'gengiva_inserida'],
    innervation: 'Mecanoreceptores proprioceptivos derivados dos nervos alveolares superiores e inferiores.',
    clinicalRelevance: 'Permite a movimentação ortodôntica por aposição e reabsorção óssea mediada por tensão e pressão. Destruído irreversivelmente na progressão da periodontite.',
    pathologyIds: ['periodontite', 'abscesso_periapical'],
    referenceIds: ['ref_lindhe_periodontology', 'ref_aap_perio_classification'],
    meshId: 'mesh_periodontal_ligament',
    colorHex: '#F97316',
  },
  gengiva_inserida: {
    id: 'gengiva_inserida',
    name: 'Gengiva Inserida e Margem Livre',
    scientificName: 'Gingiva propria',
    synonyms: ['Gengiva ceratinizada', 'Gengiva marginal'],
    category: 'oral_tissue',
    region: 'dental_arch_lower',
    description: 'Porção da mucosa mastigatória firmemente aderida ao periósteo do osso alveolar e ao cemento supra-alveolar através das fibras gengivais de colágeno.',
    function: 'Proteção mecânica contra fricção de alimentos, barreira epitelial contra invasão de biofilme e selamento biológico cervical.',
    location: 'Circunda o colo dos dentes e estende-se apicalmente até a junção mucogengival.',
    relations: ['ligamento_periodontal', 'mandibula', 'maxila', 'dente_11', 'dente_36'],
    tissueComposition: ['Epitélio estratificado pavimentoso paraqueratinizado', 'Tecido conjuntivo denso com feixes colágenos', 'Papilas dérmicas formando aspecto de casca de laranja'],
    clinicalRelevance: 'A faixa adequada de gengiva inserida (geralmente > 2 mm) previne recessões gengivais e facilita o controle mecânico da placa. Sangramento à sondagem indica gengivite ativa.',
    pathologyIds: ['gengivite', 'periodontite'],
    referenceIds: ['ref_lindhe_periodontology', 'ref_aap_perio_classification'],
    meshId: 'mesh_gingiva',
    colorHex: '#F472B6',
  },

};

// ==================== CONSTRUTOR DE DADOS ODONTOLÓGICOS (32 DENTES PERMANENTES) ====================
const toothFunctions: Record<string, string> = {
  central_incisor:
    'Incisão e corte primário dos alimentos durante a mastigação preparatória, fonação articulatória de sons linguodentais (como fonemas /s/, /t/, /d/) e suporte estético primordial do lábio e da linha do sorriso.',
  lateral_incisor:
    'Auxílio no corte de alimentos, harmonia na curvatura do arco anterior e guia anterior de desoclusão estética em proporção áurea facial.',
  canine:
    'Dilaceração e apreensão de alimentos duros, desoclusão e proteção mútua em guia canina nos movimentos excursivos de lateralidade mandibular (evitando contatos prematuros posteriores destrutivos) e suporte da eminência canina na face.',
  first_premolar:
    'Início da trituração e fragmentação dos alimentos, direcionando forças mastigatórias axiais ao osso alveolar e mediando a transição entre o arco estético e mastigatório.',
  second_premolar:
    'Trituração e cominuição do bolo alimentar antes da moagem pesada, estabilizando as curvas oclusais de Spee e Wilson.',
  first_molar:
    'Trituração pesada e moagem primordial dos alimentos, chave primordial da oclusão de Angle e ancoragem fundamental da Dimensão Vertical de Oclusão (DVO).',
  second_molar:
    'Moagem secundária do bolo alimentar e estabilização posterior do plano oclusal durante mastigação vigorosa.',
  third_molar:
    'Auxílio na mastigação e trituração quando erupcionado e adequadamente alinhado no arco funcional.',
};

const getScientificToothName = (tooth: DetailedToothData): string => {
  const isUpper = tooth.arch === 'maxillary';
  const isRight = tooth.quadrant === 1 || tooth.quadrant === 4 || tooth.quadrant === 5 || tooth.quadrant === 8;
  const side = isRight ? 'dexter' : 'sinister';
  const jaw = isUpper ? 'maxillaris' : 'mandibularis';
  const decSuffix = tooth.dentition === 'deciduous' ? ' deciduus' : '';

  switch (tooth.type) {
    case 'central_incisor':
      return `Dens incisivus primus${decSuffix} ${jaw} ${side} (${tooth.fdi})`;
    case 'lateral_incisor':
      return `Dens incisivus secundus${decSuffix} ${jaw} ${side} (${tooth.fdi})`;
    case 'canine':
      return `Dens caninus${decSuffix} ${jaw} ${side} (${tooth.fdi})`;
    case 'first_premolar':
      return `Dens premolaris primus ${jaw} ${side} (${tooth.fdi})`;
    case 'second_premolar':
      return `Dens premolaris secundus ${jaw} ${side} (${tooth.fdi})`;
    case 'first_molar':
      return `Dens molaris primus${decSuffix} ${jaw} ${side} (${tooth.fdi})`;
    case 'second_molar':
      return `Dens molaris secundus${decSuffix} ${jaw} ${side} (${tooth.fdi})`;
    case 'third_molar':
      return `Dens molaris tertius ${jaw} ${side} (${tooth.fdi})`;
    default:
      return `Dens${decSuffix} ${jaw} ${side} (${tooth.fdi})`;
  }
};

const buildToothStructure = (tooth: DetailedToothData): AnatomicalStructure => {
  const isUpper = tooth.arch === 'maxillary';
  const fdi = tooth.fdi;

  // Inervação anatômica precisa
  let innervation = '';
  if (isUpper) {
    if (tooth.type.includes('incisor') || tooth.type === 'canine') {
      innervation = 'Nervo alveolar superior anterior (ramo do nervo infraorbital / nervo maxilar V2) e plexo dentário superior.';
    } else if (tooth.type.includes('premolar')) {
      innervation = 'Nervo alveolar superior médio e plexo dentário superior (ramo do nervo maxilar V2).';
    } else {
      innervation = 'Nervo alveolar superior posterior (nervo maxilar V2) e ramos do plexo dentário superior.';
    }
  } else {
    innervation = 'Nervo alveolar inferior (ramo do nervo mandibular V3) através de ramos dentários intraósseos e plexo dentário inferior com ramos incisivos e mentuais.';
  }

  // Vascularização precisa
  const vascularization = isUpper
    ? 'Artérias alveolares superiores posterior e anterior (ramos da artéria maxilar interna) e drenagem pelo plexo venoso pterigóideo.'
    : 'Artéria alveolar inferior (ramo da artéria maxilar interna) acompanhada pela veia alveolar inferior tributária do plexo venoso pterigóideo.';

  const cuspsCount = tooth.coronaryAnatomy.cusps ?? 0;
  const cuspsText =
    cuspsCount > 0
      ? `Possui ${cuspsCount} cúspides anatômicas bem delimitadas por cristas e sulcos de desenvolvimento.`
      : 'Possui bordo incisal plano cortante, cíngulo lingual e cristas marginais proeminentes.';

  const description = `${tooth.name} (${tooth.popularName}). ${cuspsText} Raízes: ${tooth.rootsCount}. Canais radiculares: ${tooth.canalsCount}. Faixa etária de erupção típica: ${tooth.eruptionAgeYears}. Dimensões coronárias médias: altura de ${tooth.coronaryAnatomy.dimensionsMm.crownHeight} mm, diâmetro mésio-distal de ${tooth.coronaryAnatomy.dimensionsMm.crownWidthMD} mm, diâmetro vestíbulo-lingual de ${tooth.coronaryAnatomy.dimensionsMm.crownWidthVL} mm, comprimento radicular de ${tooth.coronaryAnatomy.dimensionsMm.rootLength} mm e comprimento total do elemento de ${tooth.coronaryAnatomy.dimensionsMm.totalLength} mm. ${tooth.coronaryAnatomy.ridges.join(', ')}.`;

  const clinical = `${tooth.clinicalRelevance} Morfologia endodôntica e canais: ${tooth.internalAnatomy.canalsDescription} ${tooth.internalAnatomy.apicalForamen} Apresenta suscetibilidade a lesões cariosas nas fossas e faces proximais, alterações periodontais e necessidade de proteção do complexo dentinopulpar.`;

  return {
    id: `dente_${fdi}`,
    name: `${tooth.name} (FDI ${fdi})`,
    scientificName: getScientificToothName(tooth),
    synonyms: [fdi, tooth.name, tooth.popularName, `Dente ${fdi}`],
    category: 'dental',
    region: isUpper ? 'dental_arch_upper' : 'dental_arch_lower',
    fdiNotation: fdi,
    description,
    function: toothFunctions[tooth.type] || 'Mastigação, corte/trituração e suporte postural da oclusão dentária.',
    location: `Quadrante ${tooth.quadrant} no arco dentário ${isUpper ? 'superior (processo alveolar da maxila)' : 'inferior (processo alveolar da mandíbula)'}.`,
    relations: isUpper
      ? ['maxila', 'seio_maxilar', 'nervo_maxilar_v2', 'ligamento_periodontal', 'gengiva_inserida']
      : ['mandibula', 'nervo_alveolar_inferior', 'ligamento_periodontal', 'gengiva_inserida'],
    innervation,
    vascularization,
    tissueComposition: [
      'Esmalte Dental (96% de hidroxiapatita inorgânica cristalizada)',
      'Dentina Coronária e Radicular (túbulos com prolongamentos odontoblásticos)',
      `Polpa Dentária vascularizada e inervada (${tooth.internalAnatomy.pulpChamberShape}, ${tooth.canalsCount})`,
      'Cemento Radicular acelular e celular recobrindo as raízes',
      'Ligamento Periodontal com feixes de fibras colágenas inseridas no osso alveolar',
    ],
    clinicalRelevance: clinical,
    pathologyIds: tooth.pathologyIds || ['carie_dentaria', 'pulpite', 'abscesso_periapical'],
    referenceIds: ['ref_fdi_notation', 'ref_wheeler_dental_anatomy', 'ref_cohen_endodontics'],
    meshId: `mesh_tooth_${fdi}`,
    colorHex: '#F8FAFC',
  };
};

// Gerar estruturas completas para todos os 32 dentes permanentes
const allTeethStructures: Record<string, AnatomicalStructure> = {};
Object.values(permanentTeethData).forEach((tooth) => {
  const struct = buildToothStructure(tooth);
  allTeethStructures[struct.id] = struct;
  allTeethStructures[tooth.fdi] = struct; // Alias direto por número FDI ('11', '21', etc.)
});

// Gerar estruturas completas para todos os 20 dentes decíduos (FDI 51 a 85)
Object.values(deciduousTeethData).forEach((tooth) => {
  const struct = buildToothStructure(tooth);
  allTeethStructures[struct.id] = struct;
  allTeethStructures[tooth.fdi] = struct; // Alias direto por número FDI ('82', '51', etc.)
});

export const anatomicalStructures: Record<string, AnatomicalStructure> = {
  ...baseAnatomicalStructures,
  ...allTeethStructures,
};
