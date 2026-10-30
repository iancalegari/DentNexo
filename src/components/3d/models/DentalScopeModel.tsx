import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';
import {
  getBoneBumpTexture,
  getMuscleBumpTexture,
  getGingivaBumpTexture,
} from '@/utils/proceduralTextures';
import { PeriodontalLigaments } from './PeriodontalLigaments';
import { TongueAndUvula3D } from './TongueAndUvula3D';
import { AnesthesiaOverlay3D } from './AnesthesiaOverlay3D';
import { ANESTHESIA_MAP } from '@/data/clinical/anesthesiaData';

// Paleta Anatômica Calibrada com tons orgânicos realistas de alta fidelidade
const ANATOMY_PALETTE = {
  bone: '#E2DAC8',         // Osso cortical marfim clássico aquecido natural
  boneAlveolar: '#DDD3BF', // Osso alveolar e septos interdentais
  boneCondyle: '#E0D7C4',  // Côndilo mandibular
  enamel: '#F4F1E6',       // Esmalte dental vítreo suave
  cementum: '#CCA377',     // Cemento radicular
  gingiva: '#D8727B',      // Mucosa gengival queratinizada saudável
  muscle: '#8C2220',       // Músculo estriado esquelético carmesim rico
  nerve: '#FBBF24',        // Feixes e ramos nervosos trigêmeos
  artery: '#EF4444',       // Artérias maxilares e ramos
  vein: '#2563EB',          // Plexo venoso pterigóideo e veias faciais
  sinus: '#EC4899',         // Rosa translúcido vibrante do seio maxilar
  sinusFrontal: '#A855F7',  // Violeta translúcido do seio frontal
  sinusSphenoid: '#818CF8', // Índigo suave translúcido do seio esfenoidal
};

interface MeshItem {
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  name: string;
  category: string;
  structureId: string;
  defaultColor: THREE.Color;
  defaultRoughness: number;
  defaultMetalness: number;
  defaultEmissive: THREE.Color;
  defaultEmissiveIntensity: number;
  initialPosition: THREE.Vector3;
  initialRotation: THREE.Euler;
}

interface DentalScopeModelProps {
  archesOnlyMode?: boolean;
}

export const DentalScopeModel: React.FC<DentalScopeModelProps> = ({ archesOnlyMode = false }) => {
  // Carregar todos os componentes originais do Dental Scope:
  // 1. core.glb: Dentes, mandíbula, maxila, processos alveolares, gengiva
  const coreGLTF = useGLTF('/models/dental-scope/core.glb');
  // 2. context.glb: Crânio completo (frontal, parietais, occipital, temporal, esfenóide, zigomáticos) e músculos (temporal, masseter, orbicular dos lábios, bucinador)
  const contextGLTF = useGLTF('/models/dental-scope/context.glb');
  // 3. neurovascular.glb: Nervos trigêmeos, alveolares, artérias maxilares e veias
  const neuroGLTF = useGLTF('/models/dental-scope/neurovascular.glb');

  const {
    selectedStructureId,
    hoveredStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    layers,
    opacities,
    xrayMode,
    explosionFactor,
    wisdomToothState,
    alignmentState,
    surfaceExplorationMode,
    activeToothFdi,
    activePathologyId,
    activeAnesthesiaId,
    focusedSystem,
    setSelectedStructure,
    setHoveredStructure,
    setInfoPanelOpen,
  } = useAnatomyStore();

  // Função para classificar cada malha no seu sistema anatômico
  const getMeshCategory = (name: string): keyof typeof layers | null => {
    if (name.startsWith('tooth-')) return 'dental';
    // Nervos Cranianos e Canais Nervosos (precisa vir antes de qualquer teste de língua para não colidir com lingual-nerve)
    if (
      name.includes('nerve') ||
      name.includes('branch') ||
      name.includes('mandibular-canal') ||
      name.includes('canal-envelope') ||
      name.includes('ganglion')
    ) {
      return 'nervous';
    }
    if (
      name.startsWith('gingiva-') ||
      name === 'lingua' ||
      name === 'tongue' ||
      name.startsWith('tongue-') ||
      name.startsWith('tongue_') ||
      name.startsWith('oral-tongue') ||
      name === 'assoalho_boca' ||
      name.startsWith('oral-floor') ||
      name === 'tonsilas_palatinas' ||
      name.startsWith('oral-tonsils') ||
      name.includes('tonsil') ||
      name === 'uvula' ||
      name.startsWith('uvula-') ||
      name.startsWith('uvula_') ||
      name.startsWith('oral-uvula') ||
      name.includes('soft-palate') ||
      name.includes('palato_mole')
    ) {
      return 'oral_tissue';
    }
    // Vasos Sanguíneos (Artérias, Veias e Plexo Pterigóideo) - precisa vir antes de músculos para não colidir com 'pterygoid-plexus'
    if (name.includes('artery') || name.includes('vein') || name.includes('plexus')) {
      return 'vascular';
    }
    if (
      name.includes('masseter') ||
      name.includes('temporalis') ||
      name.includes('pterygoid') ||
      name.includes('buccinator') ||
      name.includes('mentalis') ||
      name.includes('orbicularis')
    ) {
      return 'muscular';
    }
    // Ossos: frontal, parietal, occipital, temporal, mandíbula, maxila, seios
    return 'skeletal';
  };

  // Mapear nome da malha para ID de estrutura correspondente do catálogo
  const getStructureId = (meshName: string): string => {
    const name = meshName.toLowerCase();

    // Dentes individuais
    if (name.startsWith('tooth-')) {
      const fdi = name.replace('tooth-', '');
      return `dente_${fdi}`;
    }

    // Gengiva
    if (name.startsWith('gingiva-')) {
      return 'gengiva_inserida';
    }

    // Nervos Cranianos Odontológicos (checar antes de estruturas orais para lingual-nerve nunca cair em língua)
    if (name.includes('lingual-nerve') || name === 'nervo_lingual') {
      return 'nervo_lingual';
    }
    if (name.includes('inferior-alveolar-nerve') || name.includes('mandibular-canal')) {
      return 'nervo_alveolar_inferior';
    }
    if (name.includes('buccal-nerve')) {
      return 'nervo_bucal';
    }
    if (name.includes('mental-nerve') || name.includes('incisive-nerve')) {
      return 'nervo_mentual';
    }
    if (name.includes('greater-palatine-nerve')) {
      return 'nervo_palatino_maior';
    }
    if (name.includes('nasopalatine-nerve')) {
      return 'nervo_nasopalatino';
    }
    if (
      name.includes('facial-nerve') ||
      name.includes('facial-temporal-branch') ||
      name.includes('facial-zygomatic-branch') ||
      name.includes('facial-buccal-branch') ||
      name.includes('facial-marginal-mandibular-branch') ||
      name.includes('facial-cervical-branch')
    ) {
      return 'nervo_facial';
    }
    if (name.includes('hypoglossal-nerve') || name.includes('hypoglossal')) {
      return 'nervo_hipoglosso';
    }
    if (
      name.includes('maxillary-nerve') ||
      name.includes('infraorbital-nerve') ||
      name.includes('superior-alveolar-nerve')
    ) {
      return 'nervo_maxilar_v2';
    }
    if (
      name.includes('trigeminal') ||
      name.includes('mandibular-nerve') ||
      name.includes('glossopharyngeal') ||
      name.includes('vagus') ||
      name.includes('ophthalmic') ||
      name.includes('nerve')
    ) {
      return 'nervo_trigemeo';
    }

    // Língua e Úvula (apenas malhas específicas da língua e úvula)
    if (
      name === 'lingua' ||
      name === 'tongue' ||
      name.startsWith('tongue-') ||
      name.startsWith('tongue_') ||
      name.startsWith('oral-tongue')
    ) {
      return 'lingua';
    }
    if (
      name === 'assoalho_boca' ||
      name.startsWith('oral-floor')
    ) {
      return 'assoalho_boca';
    }
    if (
      name === 'tonsilas_palatinas' ||
      name.startsWith('oral-tonsils') ||
      name.includes('tonsil')
    ) {
      return 'tonsilas_palatinas';
    }
    if (
      name === 'uvula' ||
      name.startsWith('uvula-') ||
      name.startsWith('uvula_') ||
      name.startsWith('oral-uvula') ||
      name.includes('soft-palate') ||
      name.includes('palato_mole')
    ) {
      return 'uvula';
    }

    // Vasos Sanguíneos (Artérias, Veias e Plexo Pterigóideo)
    if (name.includes('pterygoid-plexus') || (name.includes('pterygoid') && name.includes('plexus')) || name.includes('plexus')) {
      return 'plexo_pterigoideo';
    }
    if (name.includes('inferior-alveolar-artery') || name.includes('inferior-alveolar-vein')) {
      return 'arteria_alveolar_inferior';
    }
    if (name.includes('facial-artery') || name.includes('facial-vein') || name.includes('jugular')) {
      return 'arteria_facial';
    }
    if (
      name.includes('maxillary-artery') ||
      name.includes('maxillary-vein') ||
      name.includes('carotid') ||
      name.includes('alveolar-artery') ||
      name.includes('palatine-artery') ||
      name.includes('buccal-artery') ||
      name.includes('artery') ||
      name.includes('vein')
    ) {
      return 'arteria_maxilar';
    }

    // Músculos da Mastigação e Mímica Perioral
    if (name.includes('masseter')) {
      return 'masseter';
    }
    if (name.includes('temporalis')) {
      return 'temporal_m';
    }
    if (name.includes('lateral-pterygoid')) {
      return 'pterigoideo_lateral';
    }
    if (name.includes('medial-pterygoid') || name.includes('pterygoid')) {
      return 'pterigoideo_medial';
    }
    if (name.includes('mentalis')) {
      return 'musculo_mentual';
    }
    if (name.includes('orbicularis')) {
      return 'musculo_orbicular_boca';
    }
    if (name.includes('buccinator')) {
      return 'musculo_bucinador';
    }

    // Seios Paranasais (deve vir antes de maxila, frontal e esfenoide para não colidir com os ossos)
    if (name.includes('sinus') || name.includes('seio')) {
      if (name.includes('frontal')) {
        return 'seio_frontal';
      }
      if (name.includes('sphenoid') || name.includes('esfenoid')) {
        return 'seio_esfenoidal';
      }
      return 'seio_maxilar';
    }

    // Ossos específicos da cavidade oral, nasal e cervical (antes de maxila/nasal genéricos)
    if (name.includes('palatine-bone') || name.includes('palatine')) {
      return 'osso_palatino';
    }
    if (name.includes('vomer')) {
      return 'osso_vomer';
    }
    if (name.includes('lacrimal')) {
      return 'osso_lacrimal';
    }
    if (name.includes('inferior-nasal-concha') || name.includes('concha')) {
      return 'concha_nasal_inferior';
    }
    if (name.includes('hyoid')) {
      return 'osso_hioide';
    }

    // Mandíbula e Côndilos
    if (name.includes('mandible') || name.includes('mandibul') || name.includes('condyle')) {
      return 'mandibula';
    }

    // Maxila
    if (name.includes('maxilla') || name.includes('maxill')) {
      return 'maxila';
    }

    // Ossos específicos do crânio
    if (name.includes('frontal')) {
      return 'osso_frontal';
    }
    if (name.includes('parietal')) {
      return 'osso_parietal';
    }
    if (name.includes('occipital')) {
      return 'osso_occipital';
    }
    if (name.includes('temporal') && !name.includes('temporalis')) {
      return 'osso_temporal';
    }
    if (name.includes('sphenoid') || name.includes('esfenoid')) {
      return 'osso_esfenoide';
    }
    if (name.includes('ethmoid') || name.includes('etmoid')) {
      return 'osso_etmoide';
    }
    if (name.includes('zygomatic') || name.includes('zigomatic')) {
      return 'osso_zigomatico';
    }
    if (name.includes('nasal')) {
      return 'osso_nasal';
    }

    // Neurocrânio e ossos da calvária/base
    return 'neurocranio';
  };

  // Vetor de deslocamento radial calibrado para a "Vista Explodida" (Dissecação Craniana 0% a 100%)
  // Mantém o Esfenoide ("keystone") e os 3 Seios Paranasais no centro para revelação interna perfeita
  const getExplosionOffset = (meshName: string, category: string): [number, number, number] => {
    const n = meshName.toLowerCase();
    const side = n.includes('-left') ? 1 : n.includes('-right') ? -1 : 0;

    // Seios paranasais e esfenoide permanecem ancorados no núcleo da dissecação
    if (n.includes('sinus') || n.includes('sphenoid')) {
      return [0, 0, 0];
    }

    // Dentes e gengivas acompanham sua respectiva arcada (superior ou inferior)
    if (n.startsWith('tooth-')) {
      const fdiNum = Number(n.replace('tooth-', ''));
      const isLower = fdiNum >= 31 && fdiNum <= 48;
      if (isLower) {
        return [0, -2.55, 0.95];
      }
      const toothSide = fdiNum >= 21 && fdiNum <= 28 ? 1 : -1;
      return [toothSide * 1.15, -0.35, 1.45];
    }
    if (n === 'gingiva-lower') return [0, -2.55, 0.95];
    if (n === 'gingiva-upper') return [0, -0.35, 1.45];

    // Músculos afastam-se lateralmente para abrir visão limpa das suturas e cavidades
    if (category === 'muscular') {
      if (n.includes('orbicularis') || n.includes('mentalis')) return [0, -1.6, 3.2];
      return [side * 3.8, 0.4, 0.3];
    }

    // Neurovascular permanece coeso no centro como mapa interno de referência
    if (category === 'nervous' || category === 'vascular') {
      return [0, 0, 0];
    }

    // Ossos individuais do neurocrânio e viscerocrânio afastando-se radialmente
    if (n.includes('frontal-bone')) return [0, 2.85, 2.55];
    if (n.includes('parietal-bone')) return [side * 3.1, 2.85, -1.35];
    if (n.includes('occipital-bone')) return [0, 0.95, -3.85];
    if (n.includes('temporal-bone') || n.includes('articular-fossa') || n.includes('articular-disc')) {
      return [side * 3.65, 0.35, -1.05];
    }
    if (n.includes('zygomatic-bone')) return [side * 3.45, 0.55, 1.65];
    if (n.includes('nasal-bone')) return [side * 0.68, 1.45, 2.95];
    if (n.includes('lacrimal-bone')) return [side * 1.65, 0.85, 1.75];
    if (n.includes('ethmoid-bone')) return [0, 0.9, 1.35];
    if (n.includes('vomer')) return [0, -0.35, 1.55];
    if (n.includes('inferior-nasal-concha')) return [side * 1.4, -0.1, 1.45];
    if (n.includes('palatine-bone')) return [side * 1.25, -0.65, -1.25];
    if (n.includes('maxilla') || n.includes('maxillary-alveolar')) {
      return [side * 2.35, -0.25, 1.65];
    }
    if (n.includes('mandible') || n.includes('mandibular')) {
      return [0, -2.55, 0.95];
    }
    if (n.includes('hyoid')) {
      return [0, -3.85, -0.75];
    }

    return [0, 0, 0];
  };

  // 1. CLONAR E INDEXAR AS CENAS APENAS UMA VEZ (core + context + neuro)
  const { coreClone, contextClone, neuroClone, meshList } = useMemo(() => {
    const core = coreGLTF.scene.clone(true);
    const context = contextGLTF.scene.clone(true);
    const neuro = neuroGLTF.scene.clone(true);
    const meshes: MeshItem[] = [];

    const boneBump = getBoneBumpTexture();
    const muscleBump = getMuscleBumpTexture();
    const gingivaBump = getGingivaBumpTexture();

    const setupMesh = (child: THREE.Object3D) => {
      if (!(child instanceof THREE.Mesh)) return;

      // Garantir cálculo de normais de vértices suaves se a malha original não possuir normais
      if (!child.geometry.attributes.normal) {
        child.geometry.computeVertexNormals();
      }

      const name = child.name;
      const category = getMeshCategory(name);
      if (!category) return;

      const structureId = getStructureId(name);
      const hasUV = Boolean(child.geometry.attributes.uv);

      let hex = ANATOMY_PALETTE.bone;
      let roughness = 0.48; // Textura osteológica difusa natural sem reflexos plásticos excessivos
      let metalness = 0.03;
      let bumpMap: THREE.Texture | null = null;
      let bumpScale = 0;
      let emissiveHex = '#000000';
      let emissiveIntensity = 0;
      let transparent = false;
      let opacity = 1.0;

      if (category === 'dental') {
        hex = ANATOMY_PALETTE.enamel;
        roughness = 0.22; // Esmalte dental vítreo suave
        metalness = 0.04;
      } else if (category === 'muscular') {
        hex = ANATOMY_PALETTE.muscle;
        roughness = 0.28; // Superfície tecidual úmida com reflexo especular vívido
        metalness = 0.06;
        if (hasUV) {
          bumpMap = muscleBump;
          bumpScale = 0.035;
        }
        emissiveHex = '#2C0604';
        emissiveIntensity = 0.06;
      } else if (category === 'nervous') {
        hex = ANATOMY_PALETTE.nerve;
        roughness = 0.35;
        emissiveHex = '#713F12';
        emissiveIntensity = 0.35;
      } else if (category === 'vascular') {
        hex = name.includes('vein') || name.includes('plexus') ? ANATOMY_PALETTE.vein : ANATOMY_PALETTE.artery;
        roughness = 0.30;
      } else if (category === 'oral_tissue') {
        hex = ANATOMY_PALETTE.gingiva;
        roughness = 0.35;
        if (hasUV) {
          bumpMap = gingivaBump;
          bumpScale = 0.014;
        }
      } else if (name.includes('sinus')) {
        if (name.includes('frontal-sinus') || name.includes('frontal')) {
          hex = ANATOMY_PALETTE.sinusFrontal;
          emissiveHex = '#4C1D95';
        } else if (name.includes('sphenoidal-sinus') || name.includes('sphenoid')) {
          hex = ANATOMY_PALETTE.sinusSphenoid;
          emissiveHex = '#312E81';
        } else {
          hex = ANATOMY_PALETTE.sinus;
          emissiveHex = '#831843';
        }
        roughness = 0.22;
        emissiveIntensity = 0.2;
        transparent = true;
        opacity = 0.68;
      } else {
        if (hasUV) {
          bumpMap = boneBump;
          bumpScale = 0.015;
        }
      }

      // Material dedicado persistente por malha com DoubleSide e transparent: true para suporte pleno a opacidade
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex),
        roughness,
        metalness,
        bumpMap: bumpMap || undefined,
        bumpScale,
        emissive: new THREE.Color(emissiveHex),
        emissiveIntensity,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
      });

      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;

      // Three.js r169+ testa raycast mesmo em objetos com visible=false.
      // Ignorar imediatamente malhas ocultas garante que camadas/estruturas desligadas nunca interceptem cliques.
      const origRaycast = child.raycast.bind(child);
      child.raycast = (raycaster, intersects) => {
        if (!child.visible) return;
        origRaycast(raycaster, intersects);
      };

      meshes.push({
        mesh: child,
        material,
        name,
        category,
        structureId,
        defaultColor: new THREE.Color(hex),
        defaultRoughness: roughness,
        defaultMetalness: metalness,
        defaultEmissive: new THREE.Color(emissiveHex),
        defaultEmissiveIntensity: emissiveIntensity,
        initialPosition: child.position.clone(),
        initialRotation: child.rotation.clone(),
      });
    };

    core.traverse(setupMesh);
    context.traverse(setupMesh);
    neuro.traverse(setupMesh);

    return { coreClone: core, contextClone: context, neuroClone: neuro, meshList: meshes };
  }, [coreGLTF.scene, contextGLTF.scene, neuroGLTF.scene]);

  // Cores de highlight pré-alocadas para evitar garbage collection
  const cyanColor = useMemo(() => new THREE.Color(themeTokens.colors.brandCyan), []);
  const cyanEmissive = useMemo(() => new THREE.Color('#006B85'), []);
  const hoverColor = useMemo(() => new THREE.Color('#7DD3FC'), []);
  const hoverEmissive = useMemo(() => new THREE.Color('#0369A1'), []);
  const xrayColor = useMemo(() => new THREE.Color('#0284C7'), []);
  const xrayEmissive = useMemo(() => new THREE.Color('#082F49'), []);
  const blackColor = useMemo(() => new THREE.Color('#000000'), []);
  const anesthesiaToothColor = useMemo(() => new THREE.Color('#34D399'), []);
  const anesthesiaToothEmissive = useMemo(() => new THREE.Color('#059669'), []);
  const anesthesiaNerveColor = useMemo(() => new THREE.Color('#FDE047'), []);
  const anesthesiaNerveEmissive = useMemo(() => new THREE.Color('#D97706'), []);
  const anesthesiaRefEmissive = useMemo(() => new THREE.Color('#0F766E'), []);

  // 2. ATUALIZAÇÃO DIRETA EM MEMÓRIA DAS PROPRIEDADES E TRANSFORMAÇÕES DIDÁTICAS
  useEffect(() => {
    const hasIsolation = isolatedStructureId !== null;
    const activeAnesthesia = activeAnesthesiaId ? ANESTHESIA_MAP[activeAnesthesiaId] : null;

    for (let i = 0; i < meshList.length; i++) {
      const item = meshList[i];
      const {
        mesh,
        material,
        name,
        category,
        structureId,
        defaultColor,
        defaultRoughness,
        defaultMetalness,
        defaultEmissive,
        defaultEmissiveIntensity,
        initialPosition,
        initialRotation,
      } = item;

      // Restaurar posição/rotação base antes de aplicar transformações dinâmicas (siso, alinhamento ou vista explodida)
      mesh.position.copy(initialPosition);
      mesh.rotation.copy(initialRotation);

      const isTooth = name.startsWith('tooth-');
      const isGingiva = name.startsWith('gingiva-');

      const isToothMatch = (idA: string, idB: string) => {
        const cleanA = idA.replace('dente_', '').replace('tooth-', '');
        const cleanB = idB.replace('dente_', '').replace('tooth-', '');
        return cleanA === cleanB;
      };

      const isCranialBone = (id: string) =>
        id === 'neurocranio' ||
        id === 'osso_frontal' ||
        id === 'osso_parietal' ||
        id === 'osso_temporal' ||
        id === 'osso_occipital' ||
        id === 'osso_esfenoide' ||
        id === 'osso_etmoide' ||
        id === 'osso_zigomatico' ||
        id === 'osso_nasal' ||
        id === 'osso_palatino' ||
        id === 'osso_vomer' ||
        id === 'osso_lacrimal' ||
        id === 'concha_nasal_inferior' ||
        id === 'osso_hioide';

      const normalizeId = (id: string | null) => {
        if (!id) return '';
        if (id.startsWith('tooth-')) return `dente_${id.replace('tooth-', '')}`;
        if (!isNaN(Number(id))) return `dente_${id}`;
        return id;
      };

      const matchesTarget = (targetId: string | null) => {
        if (!targetId) return false;
        if (targetId === structureId) return true;
        const normTarget = normalizeId(targetId);
        const normStruct = normalizeId(structureId);
        if (normTarget === normStruct) return true;
        if (isTooth && isToothMatch(targetId, structureId)) return true;
        if (targetId === 'neurocranio' && isCranialBone(structureId)) return true;
        return false;
      };

      const isSelected = matchesTarget(selectedStructureId);
      const isHovered = matchesTarget(hoveredStructureId);
      const isIsolated = matchesTarget(isolatedStructureId);

      // MODO APENAS ARCADAS E GENGIVA:
      // Oculta completamente ossos, crânio, músculos e neurovascular
      if (archesOnlyMode && !isTooth && !isGingiva && !isIsolated) {
        mesh.visible = false;
        continue;
      }

      // PATOLOGIA: LÍNGUA GEOGRÁFICA
      // Oculta todas as malhas do DentalScopeModel (crânio, mandíbula, dentes, músculos, neurovascular)
      // para mostrar EXCLUSIVAMENTE a língua isolada em alta evidência clínica
      if (activePathologyId === 'lingua_geografica') {
        mesh.visible = false;
        continue;
      }

      // PATOLOGIAS GENGIVAIS/PERIODONTAIS (Gengivite e Periodontite):
      // Oculta músculos (especialmente o orbicular da boca e bucinador), nervos e vasos
      // para expor claramente as margens e papilas gengivais sem obstrução perioral
      if (activePathologyId === 'gengivite' || activePathologyId === 'periodontite') {
        if (category === 'muscular' || category === 'nervous' || category === 'vascular') {
          mesh.visible = false;
          continue;
        }
      }

      // Visibilidade da malha:
      // No modo de Sistemas Anatômicos (focusedSystem ativo) ou Anestesia,
      // as camadas do sistema alvo e referências NUNCA são desligadas por camadas ou ocultações do Atlas Geral
      let isVisible = true;
      let isHidden = false;

      if (activeAnesthesia) {
        isVisible = true;
        isHidden = false;
      } else if (focusedSystem) {
        if (category === focusedSystem) {
          isVisible = true;
          isHidden = hiddenStructureIds.includes(structureId);
        } else if (category === 'skeletal' || category === 'dental') {
          // Crânio e dentes fornecem contexto anatômico de referência
          isVisible = true;
          isHidden = false;
        } else {
          // Outros sistemas não pertinentes ao foco
          isVisible = false;
          isHidden = false;
        }
      } else {
        isVisible = layers[category as keyof typeof layers];
        isHidden = hiddenStructureIds.includes(structureId);
      }

      // Se a estrutura está isolada, ela DEVE ser sempre visível
      if (!isIsolated && (!isVisible || isHidden)) {
        mesh.visible = false;
        continue;
      }

      mesh.visible = true;

      // ================= MANIPULAÇÃO EXCLUSIVA DE ARCADAS & ALINHAMENTO (SISO + ALINHAMENTO DENTAL) =================
      // Aplicada estritamente quando archesOnlyMode === true para NUNCA interferir no Atlas 3D ou nos demais módulos
      if (archesOnlyMode) {
        if (name === 'tooth-38' || name === 'tooth-48' || name === 'tooth-18' || name === 'tooth-28') {
          if (wisdomToothState === 'absent') {
            mesh.visible = false;
            continue;
          }

          if (name === 'tooth-38') {
            // Terceiro molar inferior esquerdo
            if (wisdomToothState === 'mesioangular') {
              mesh.rotation.x += 0.55;
              mesh.rotation.z += 0.22;
              mesh.position.y -= 0.32;
              mesh.position.z += 0.25;
            } else if (wisdomToothState === 'horizontal') {
              mesh.rotation.x += 1.38;
              mesh.position.y -= 0.48;
              mesh.position.z += 0.38;
            } else if (wisdomToothState === 'impacted') {
              mesh.position.y -= 0.78;
              mesh.rotation.x += 0.2;
            }
          } else if (name === 'tooth-48') {
            // Terceiro molar inferior direito
            if (wisdomToothState === 'mesioangular') {
              mesh.rotation.x += 0.55;
              mesh.rotation.z -= 0.22;
              mesh.position.y -= 0.32;
              mesh.position.z += 0.25;
            } else if (wisdomToothState === 'horizontal') {
              mesh.rotation.x += 1.38;
              mesh.position.y -= 0.48;
              mesh.position.z += 0.38;
            } else if (wisdomToothState === 'impacted') {
              mesh.position.y -= 0.78;
              mesh.rotation.x += 0.2;
            }
          } else if (name === 'tooth-18' || name === 'tooth-28') {
            // Sisos superiores
            if (wisdomToothState === 'impacted') {
              mesh.position.y += 0.65;
            } else if (wisdomToothState === 'mesioangular') {
              mesh.rotation.x -= 0.38;
              mesh.position.y += 0.25;
            } else if (wisdomToothState === 'horizontal') {
              mesh.rotation.x -= 1.1;
              mesh.position.y += 0.4;
            }
          }
        }

        if (
          name === 'tooth-31' ||
          name === 'tooth-41' ||
          name === 'tooth-12' ||
          name === 'tooth-22' ||
          name === 'tooth-11' ||
          name === 'tooth-21'
        ) {
          if (alignmentState === 'crowded_anterior') {
            if (name === 'tooth-31') {
              mesh.position.z += 0.22;
              mesh.rotation.y += 0.25;
            } else if (name === 'tooth-41') {
              mesh.position.z -= 0.16;
              mesh.rotation.y -= 0.2;
            } else if (name === 'tooth-12') {
              mesh.position.z += 0.18;
              mesh.rotation.y += 0.15;
            } else if (name === 'tooth-22') {
              mesh.position.z -= 0.15;
              mesh.rotation.y -= 0.15;
            }
          } else if (alignmentState === 'diastema_central') {
            if (name === 'tooth-11') {
              mesh.position.x -= 0.13;
            } else if (name === 'tooth-21') {
              mesh.position.x += 0.13;
            } else if (name === 'tooth-12') {
              mesh.position.x -= 0.05;
            } else if (name === 'tooth-22') {
              mesh.position.x += 0.05;
            }
          }
        }
      }

      // ================= MODO VISTA EXPLODIDA DO CRÂNIO (SLIDER 0% A 100%) =================
      if (explosionFactor > 0 && !archesOnlyMode && !surfaceExplorationMode && !activeAnesthesia) {
        const [ex, ey, ez] = getExplosionOffset(name, category);
        mesh.position.x += ex * explosionFactor;
        mesh.position.y += ey * explosionFactor;
        mesh.position.z += ez * explosionFactor;
      }

      // ================= MODO RAIO X =================
      if (xrayMode) {
        material.color.copy(isSelected ? cyanColor : xrayColor);
        material.transparent = true;
        material.opacity = isSelected ? 0.85 : 0.28;
        material.roughness = 0.2;
        material.metalness = 0.1;
        material.emissive.copy(isSelected ? cyanEmissive : xrayEmissive);
        material.emissiveIntensity = isSelected ? 0.6 : 0.15;
        material.depthWrite = isSelected;
        material.side = THREE.FrontSide;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        continue;
      }

      // ================= MODO EXPLORAÇÃO DE SUPERFÍCIE DENTAL (DENTAL SCOPE) =================
      // Crânio oculto, dente ativo com opacidade total (1.0), dentes adjacentes translúcidos (0.15) e gengiva de contexto (0.10)
      if (surfaceExplorationMode) {
        if (!isTooth && !isGingiva) {
          mesh.visible = false;
          continue;
        }

        const isActiveTooth = name === `tooth-${activeToothFdi}`;
        mesh.visible = true;

        if (isActiveTooth) {
          material.color.copy(defaultColor);
          material.roughness = 0.22;
          material.metalness = 0.05;
          material.transparent = false;
          material.opacity = 1.0;
          material.emissive.copy(cyanEmissive);
          material.emissiveIntensity = 0.25;
          material.depthWrite = true;
          material.side = THREE.FrontSide;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        } else if (isTooth) {
          // Demais dentes com opacidade suave de referência (15%)
          material.color.copy(defaultColor);
          material.roughness = 0.6;
          material.metalness = 0.0;
          material.transparent = true;
          material.opacity = 0.15;
          material.emissive.copy(blackColor);
          material.emissiveIntensity = 0;
          material.depthWrite = false;
          material.side = THREE.FrontSide;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        } else if (isGingiva) {
          // Gengiva com transparência suave de contexto anatômico (10%)
          material.color.copy(defaultColor);
          material.roughness = 0.7;
          material.transparent = true;
          material.opacity = 0.10;
          material.emissive.copy(blackColor);
          material.emissiveIntensity = 0;
          material.depthWrite = false;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
        continue;
      }

      // ================= CÁLCULO DINÂMICO DE OPACIDADE E REALCE CLÍNICO =================
      // Em Sistemas Anatômicos e Anestesia, a opacidade do sistema e do contexto de referência é calibrada e não herda sliders zerados do Atlas 3D
      let userLayerOpacity = 1.0;
      if (activeAnesthesia || focusedSystem) {
        userLayerOpacity = 1.0;
      } else {
        userLayerOpacity = opacities[category as keyof typeof opacities] ?? 1.0;
      }
      let opacityMultiplier = 1.0;
      let targetColor = defaultColor;
      let targetEmissive = defaultEmissive;
      let targetEmissiveIntensity = defaultEmissiveIntensity;

      // SIMULADOR 3D DE BLOQUEIOS ANESTÉSICOS:
      // Realça o nervo alvo em dourado e ilumina em verde-esmeralda TODOS os dentes, mucosas e estruturas ósseas da área afetada!
      if (activeAnesthesia) {
        const lowerName = name.toLowerCase();
        const isTargetNerve = activeAnesthesia.targetMeshNames.some((sub) => lowerName.includes(sub));
        const toothFdi = isTooth ? name.replace('tooth-', '') : '';
        const isAffectedTooth =
          isTooth &&
          (activeAnesthesia.anesthetizedTeeth.includes(toothFdi) ||
            activeAnesthesia.softTissueTeeth.includes(toothFdi));

        const isAffectedGingiva =
          (activeAnesthesia.arch === 'mandibular' && lowerName === 'gingiva-lower') ||
          (activeAnesthesia.arch === 'maxillary' && lowerName === 'gingiva-upper');

        const isAffectedBoneStructure =
          (activeAnesthesia.id === 'bloqueio_palatino_maior' && lowerName === 'palatine-bone-left') ||
          (activeAnesthesia.id === 'bloqueio_nasopalatino' && lowerName === 'vomer');

        if (isTargetNerve) {
          targetColor = anesthesiaNerveColor;
          targetEmissive = anesthesiaNerveEmissive;
          targetEmissiveIntensity = 0.95;
          opacityMultiplier = 1.0;
        } else if (isAffectedTooth) {
          targetColor = anesthesiaToothColor;
          targetEmissive = anesthesiaToothEmissive;
          targetEmissiveIntensity = 0.65;
          opacityMultiplier = 1.0;
        } else if (isAffectedBoneStructure) {
          targetColor = anesthesiaToothColor;
          targetEmissive = anesthesiaToothEmissive;
          targetEmissiveIntensity = 0.55;
          opacityMultiplier = 0.68;
        } else if (isAffectedGingiva) {
          targetColor = anesthesiaToothColor;
          targetEmissive = anesthesiaToothEmissive;
          targetEmissiveIntensity = 0.45;
          opacityMultiplier = 0.48;
        } else if (isTooth) {
          opacityMultiplier = 0.32;
          targetEmissive = blackColor;
          targetEmissiveIntensity = 0;
        } else if (category === 'nervous') {
          opacityMultiplier = 0.35;
        } else if (category === 'vascular') {
          const isRiskVessel =
            (activeAnesthesia.id === 'bloqueio_asp' && lowerName.includes('pterygoid-plexus-left')) ||
            (activeAnesthesia.id === 'bloqueio_nai' &&
              (lowerName.includes('inferior-alveolar-artery-left') ||
                lowerName.includes('inferior-alveolar-vein-left')));
          opacityMultiplier = isRiskVessel ? 0.85 : 0.3;
        } else if (category === 'oral_tissue') {
          opacityMultiplier = 0.18;
        } else if (category === 'muscular') {
          opacityMultiplier = 0.06;
        } else {
          // Esqueleto translúcido permitindo ver o canal mandibular, forames e trajeto da agulha
          opacityMultiplier = lowerName.includes('sinus') ? 0.25 : 0.22;
        }
      } else if (hasIsolation) {
        // ISOLAMENTO DE ESTRUTURA (PRIORIDADE MÁXIMA):
        if (isIsolated) {
          targetColor = cyanColor;
          targetEmissive = cyanEmissive;
          targetEmissiveIntensity = 0.6;
          opacityMultiplier = 1.0;
        } else {
          // O restante fica com opacidade baixa (0.15)
          opacityMultiplier = 0.15;
          targetEmissive = blackColor;
          targetEmissiveIntensity = 0;
        }
      } else if (focusedSystem) {
        const isTargetSystem = category === focusedSystem;
        const isLpoSelected = selectedStructureId === 'ligamento_periodontal';
        const isSinusSelected =
          selectedStructureId === 'seio_maxilar' ||
          selectedStructureId === 'seio_frontal' ||
          selectedStructureId === 'seio_esfenoidal';
        const isInternalOralSelected =
          selectedStructureId === 'lingua' ||
          selectedStructureId === 'assoalho_boca' ||
          selectedStructureId === 'uvula' ||
          selectedStructureId === 'tonsilas_palatinas';

        if (isTargetSystem) {
          if (focusedSystem === 'oral_tissue' && isInternalOralSelected && isGingiva) {
            opacityMultiplier = 0.16; // Gengiva atenuada para revelar língua, assoalho da boca, úvula e amígdalas
          } else if (focusedSystem === 'oral_tissue' && isLpoSelected && isGingiva) {
            opacityMultiplier = 0.22;
          } else if (focusedSystem === 'skeletal' && isSinusSelected && !isSelected && !name.includes('sinus')) {
            opacityMultiplier = 0.22;
          } else if (focusedSystem === 'skeletal' && isSinusSelected && !isSelected && name.includes('sinus')) {
            opacityMultiplier = 0.35; // Outros seios não selecionados ficam atenuados
          } else {
            opacityMultiplier = 1.0;
          }

          if (isSelected) {
            targetColor = cyanColor;
            targetEmissive = cyanEmissive;
            targetEmissiveIntensity = 0.6;
          } else if (isHovered) {
            targetColor = hoverColor;
            targetEmissive = hoverEmissive;
            targetEmissiveIntensity = 0.3;
          }
        } else {
          // Demais sistemas no modo foco atuam como referência anatômica (ghost elegante)
          if (focusedSystem === 'oral_tissue') {
            if (category === 'dental') {
              opacityMultiplier = isInternalOralSelected ? 0.18 : (isLpoSelected ? 0.40 : 0.65);
            } else if (category === 'skeletal') {
              opacityMultiplier = isInternalOralSelected ? 0.14 : (isLpoSelected ? 0.12 : 0.22);
            } else {
              opacityMultiplier = 0.12;
            }
          } else if (focusedSystem === 'skeletal') {
            opacityMultiplier = isSinusSelected
              ? (category === 'dental' ? 0.18 : 0.15)
              : (category === 'dental' ? 0.85 : 0.15);
          } else if (focusedSystem === 'muscular') {
            opacityMultiplier = category === 'skeletal' ? 0.25 : (category === 'dental' ? 0.20 : 0.12);
          } else if (focusedSystem === 'nervous' || focusedSystem === 'vascular') {
            opacityMultiplier = category === 'skeletal' ? 0.18 : (category === 'dental' ? 0.25 : 0.12);
          } else {
            opacityMultiplier = 0.20;
          }
        }
      } else {
        // Modo Normal (Atlas Geral)
        const isInternalOralSelected =
          selectedStructureId === 'lingua' ||
          selectedStructureId === 'assoalho_boca' ||
          selectedStructureId === 'uvula' ||
          selectedStructureId === 'tonsilas_palatinas';

        if (activePathologyId === 'gengivite') {
          if (isGingiva) {
            targetColor = new THREE.Color('#E11D48');
            targetEmissive = new THREE.Color('#991B1B');
            targetEmissiveIntensity = 0.55;
            opacityMultiplier = 1.0;
          } else if (category === 'skeletal') {
            opacityMultiplier = 0.35;
          } else if (category === 'dental') {
            opacityMultiplier = 0.90;
          }
        } else if (isSelected) {
          targetColor = cyanColor;
          targetEmissive = cyanEmissive;
          targetEmissiveIntensity = 0.55;
        } else if (isHovered) {
          targetColor = hoverColor;
          targetEmissive = hoverEmissive;
          targetEmissiveIntensity = 0.25;
        }

        if (explosionFactor > 0 && category === 'muscular') {
          opacityMultiplier = Math.max(0.18, 1 - explosionFactor * 0.72);
        }

        if (selectedStructureId === 'ligamento_periodontal') {
          if (isGingiva) opacityMultiplier = 0.22;
          else if (category === 'skeletal') opacityMultiplier = 0.12;
          else if (category === 'dental') opacityMultiplier = 0.40;
        } else if (
          (selectedStructureId === 'seio_maxilar' ||
            selectedStructureId === 'seio_frontal' ||
            selectedStructureId === 'seio_esfenoidal') &&
          !isSelected &&
          category === 'skeletal' &&
          !name.includes('sinus')
        ) {
          opacityMultiplier = 0.25;
        } else if (isInternalOralSelected) {
          if (isGingiva) opacityMultiplier = 0.18;
          else if (category === 'dental') opacityMultiplier = 0.20;
          else if (category === 'skeletal') opacityMultiplier = 0.15;
        }
      }

      // A opacidade final é o produto do controle do usuário pelo multiplicador de foco,
      // sendo que em isolamento forçado a peça alvo fica 100% e as demais 15% (ghost de referência).
      let effectiveOpacity = Math.max(0.0, Math.min(1.0, userLayerOpacity * opacityMultiplier));
      if (!activeAnesthesia && hasIsolation) {
        effectiveOpacity = isIsolated ? 1.0 : 0.15;
      }
      const isSolid = effectiveOpacity >= 0.98 && !name.includes('sinus');

      material.color.copy(targetColor);
      material.roughness = defaultRoughness;
      material.metalness = defaultMetalness;
      material.emissive.copy(targetEmissive);
      material.emissiveIntensity = targetEmissiveIntensity;
      material.transparent = effectiveOpacity < 0.98 || name.includes('sinus');
      material.opacity = name.includes('sinus')
        ? activeAnesthesia
          ? 0.28
          : isIsolated
            ? 0.95
            : isSelected
              ? 0.92
              : (selectedStructureId === 'seio_maxilar' || selectedStructureId === 'seio_frontal' || selectedStructureId === 'seio_esfenoidal')
                ? 0.35
                : Math.min(0.68, effectiveOpacity)
        : effectiveOpacity;
      material.depthWrite = isSolid;
      material.side = THREE.DoubleSide;
      mesh.castShadow = isSolid;
      mesh.receiveShadow = true;
      mesh.visible = (activeAnesthesia ? true : isIsolated || isVisible) && !isHidden && effectiveOpacity > 0.01;
    }
  }, [
    meshList,
    archesOnlyMode,
    wisdomToothState,
    alignmentState,
    explosionFactor,
    selectedStructureId,
    hoveredStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    layers,
    opacities,
    xrayMode,
    surfaceExplorationMode,
    activeToothFdi,
    activePathologyId,
    activeAnesthesiaId,
    focusedSystem,
    cyanColor,
    cyanEmissive,
    hoverColor,
    hoverEmissive,
    xrayColor,
    xrayEmissive,
    blackColor,
    anesthesiaToothColor,
    anesthesiaToothEmissive,
    anesthesiaNerveColor,
    anesthesiaNerveEmissive,
    anesthesiaRefEmissive,
  ]);

  // Handlers de interação
  const handlePointerOver = (e: any) => {
    if (!e.object?.visible) return;
    const isAnesthesia = typeof window !== 'undefined' && window.location.pathname.includes('/anesthesia');
    if (surfaceExplorationMode || isAnesthesia) return;
    const meshName = e.object?.name;
    if (meshName) {
      const id = getStructureId(meshName);
      if (hiddenStructureIds.includes(id)) return;
      e.stopPropagation();
      setHoveredStructure(id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredStructure(null);
    document.body.style.cursor = 'grab';
  };

  const handleClick = (e: any) => {
    if (!e.object?.visible) return;
    const isQuiz = typeof window !== 'undefined' && window.location.pathname.includes('/quiz');
    const isPathology = typeof window !== 'undefined' && window.location.pathname.includes('/pathologies');
    const isAnesthesia = typeof window !== 'undefined' && window.location.pathname.includes('/anesthesia');

    // Em Dentro do Dente, Patologias e Anestesiologia, cliques no 3D são ignorados; no Quiz, seleciona sem abrir InfoPanel
    if (surfaceExplorationMode || isPathology || isAnesthesia) return;

    const meshName = e.object?.name;
    if (meshName) {
      const id = getStructureId(meshName);
      // Se a estrutura está oculta, não seleciona (permite o raycast atingir o que está atrás)
      if (hiddenStructureIds.includes(id)) return;
      e.stopPropagation();
      if (isQuiz) {
        useAnatomyStore.setState({ selectedStructureId: id, infoPanelOpen: false });
      } else {
        setSelectedStructure(id);
      }
    }
  };

  const handleContextMenu = (e: any) => {
    if (!e.object?.visible) return;
    const isQuiz = typeof window !== 'undefined' && window.location.pathname.includes('/quiz');
    const isPathology = typeof window !== 'undefined' && window.location.pathname.includes('/pathologies');
    const isAnesthesia = typeof window !== 'undefined' && window.location.pathname.includes('/anesthesia');
    if (surfaceExplorationMode || isQuiz || isPathology || isAnesthesia) return;
    const meshName = e.object?.name;
    if (meshName) {
      const id = getStructureId(meshName);
      if (hiddenStructureIds.includes(id)) return;
      e.stopPropagation();
      setSelectedStructure(id);
    }
  };

  return (
    <group
      name="dental_scope_master_model"
      scale={archesOnlyMode ? [1.0, 1.0, 1.0] : [0.7, 0.7, 0.7]}
      position={archesOnlyMode ? [0, 0.3, 0] : [0, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <primitive object={coreClone} />
      {!archesOnlyMode && !surfaceExplorationMode && <primitive object={contextClone} />}
      {!archesOnlyMode && !surfaceExplorationMode && <primitive object={neuroClone} />}
      {!surfaceExplorationMode && !activeAnesthesiaId && explosionFactor < 0.01 && (
        <PeriodontalLigaments archesOnlyMode={archesOnlyMode} />
      )}
      {!surfaceExplorationMode && (
        <TongueAndUvula3D archesOnlyMode={archesOnlyMode} />
      )}
      {!archesOnlyMode && !surfaceExplorationMode && activeAnesthesiaId && <AnesthesiaOverlay3D />}
    </group>
  );
};

useGLTF.preload('/models/dental-scope/core.glb');
useGLTF.preload('/models/dental-scope/context.glb');
useGLTF.preload('/models/dental-scope/neurovascular.glb');
