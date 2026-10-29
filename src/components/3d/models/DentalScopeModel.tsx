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
  vein: '#2563EB',         // Plexo venoso pterigóideo e veias faciais
  sinus: '#38BDF8',        // Azul translúcido dos seios maxilares/face
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
    wisdomToothState,
    alignmentState,
    surfaceExplorationMode,
    activeToothFdi,
    activePathologyId,
    focusedSystem,
    setSelectedStructure,
    setHoveredStructure,
  } = useAnatomyStore();

  // Função para classificar cada malha no seu sistema anatômico
  const getMeshCategory = (name: string): keyof typeof layers | null => {
    if (name.startsWith('tooth-')) return 'dental';
    if (name.startsWith('gingiva-')) return 'oral_tissue';
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
    if (name.includes('artery') || name.includes('vein') || name.includes('plexus')) {
      return 'vascular';
    }
    if (name.includes('nerve') || name.includes('canal-envelope') || name.includes('ganglion')) {
      return 'nervous';
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

    // ATM (Articulação Temporomandibular)
    if (name.includes('articular-disc') || name.includes('articular-fossa')) {
      return 'atm';
    }

    // Seios da face (maxilar, frontal, esfenoidal)
    if (name.includes('sinus')) {
      return 'seio_maxilar';
    }

    // Nervos Cranianos Odontológicos
    if (name.includes('inferior-alveolar-nerve') || name.includes('mandibular-canal')) {
      return 'nervo_alveolar_inferior';
    }
    if (name.includes('lingual-nerve')) {
      return 'nervo_lingual';
    }
    if (name.includes('mental-nerve') || name.includes('incisive-nerve')) {
      return 'nervo_mentual';
    }
    if (
      name.includes('maxillary-nerve') ||
      name.includes('infraorbital-nerve') ||
      name.includes('superior-alveolar-nerve') ||
      name.includes('palatine-nerve')
    ) {
      return 'nervo_maxilar_v2';
    }
    if (
      name.includes('trigeminal') ||
      name.includes('mandibular-nerve') ||
      name.includes('facial-nerve') ||
      name.includes('glossopharyngeal') ||
      name.includes('vagus') ||
      name.includes('hypoglossal') ||
      name.includes('ophthalmic') ||
      name.includes('nerve')
    ) {
      return 'nervo_trigemeo';
    }

    // Vasos Sanguíneos (Artérias e Veias)
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
      name.includes('pterygoid-plexus') ||
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
    if (name.includes('orbicularis') || name.includes('buccinator') || name.includes('mentalis')) {
      return 'masseter';
    }

    // Mandíbula e Côndilos
    if (name.includes('mandible') || name.includes('mandibul') || name.includes('condyle')) {
      return 'mandibula';
    }

    // Maxila
    if (name.includes('maxilla') || name.includes('maxill') || name.includes('palatine')) {
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
        hex = name.includes('vein') ? ANATOMY_PALETTE.vein : ANATOMY_PALETTE.artery;
        roughness = 0.30;
      } else if (category === 'oral_tissue') {
        hex = ANATOMY_PALETTE.gingiva;
        roughness = 0.35;
        if (hasUV) {
          bumpMap = gingivaBump;
          bumpScale = 0.014;
        }
      } else if (name.includes('sinus')) {
        hex = ANATOMY_PALETTE.sinus;
        roughness = 0.22;
        transparent = true;
        opacity = 0.65;
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

  // 2. ATUALIZAÇÃO DIRETA EM MEMÓRIA DAS PROPRIEDADES E TRANSFORMAÇÕES DIDÁTICAS
  useEffect(() => {
    const hasIsolation = isolatedStructureId !== null;

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
        id === 'osso_nasal';

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
        if (structureId === 'neurocranio' && isCranialBone(targetId)) return true;
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

      const isVisible = layers[category as keyof typeof layers];
      const isHidden = hiddenStructureIds.includes(structureId);

      // Se a estrutura está isolada, ela DEVE ser sempre visível
      if (!isIsolated && (!isVisible || isHidden)) {
        mesh.visible = false;
        continue;
      }

      mesh.visible = true;

      // ================= MANIPULAÇÃO DINÂMICA DO SISO (18, 28, 38, 48) =================
      if (name === 'tooth-38' || name === 'tooth-48' || name === 'tooth-18' || name === 'tooth-28') {
        mesh.position.copy(initialPosition);
        mesh.rotation.copy(initialRotation);

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

      // ================= MANIPULAÇÃO DINÂMICA DE ALINHAMENTO DENTAL =================
      if (
        name === 'tooth-31' ||
        name === 'tooth-41' ||
        name === 'tooth-12' ||
        name === 'tooth-22' ||
        name === 'tooth-11' ||
        name === 'tooth-21'
      ) {
        mesh.position.copy(initialPosition);
        mesh.rotation.copy(initialRotation);

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
            mesh.position.x -= 0.35;
          } else if (name === 'tooth-21') {
            mesh.position.x += 0.35;
          }
        }
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
      // Isolamento do dente ativo com opacidade total (1.0), iluminação clínica e alta taxa de quadros (60 FPS)
      if (surfaceExplorationMode) {
        const isActiveTooth = name === `tooth-${activeToothFdi}`;
        if (!isActiveTooth) {
          mesh.visible = false;
          continue;
        }

        mesh.visible = true;
        material.color.copy(defaultColor);
        material.roughness = 0.28;
        material.metalness = 0.04;
        material.transparent = false;
        material.opacity = 1.0;
        material.emissive.copy(cyanEmissive);
        material.emissiveIntensity = 0.18;
        material.depthWrite = true;
        material.side = THREE.DoubleSide;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        continue;
      }

      // ================= CÁLCULO DINÂMICO DE OPACIDADE E REALCE CLÍNICO =================
      const userLayerOpacity = opacities[category as keyof typeof opacities] ?? 1.0;
      let opacityMultiplier = 1.0;
      let targetColor = defaultColor;
      let targetEmissive = defaultEmissive;
      let targetEmissiveIntensity = defaultEmissiveIntensity;

      // ISOLAMENTO DE ESTRUTURA (PRIORIDADE MÁXIMA):
      // A estrutura isolada fica com 100% de opacidade e realce ciano.
      // Todo o restante do modelo recebe opacidade baixa (0.15), garantindo o isolamento perfeito com referência sutil.
      if (hasIsolation) {
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

        if (isTargetSystem) {
          if (focusedSystem === 'oral_tissue' && isLpoSelected && isGingiva) {
            opacityMultiplier = 0.22;
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
              opacityMultiplier = isLpoSelected ? 0.40 : 0.65;
            } else if (category === 'skeletal') {
              opacityMultiplier = isLpoSelected ? 0.12 : 0.22;
            } else {
              opacityMultiplier = 0.12;
            }
          } else if (focusedSystem === 'skeletal') {
            opacityMultiplier = category === 'dental' ? 0.85 : 0.15;
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
        if (activePathologyId === 'gengivite' && isGingiva) {
          targetColor = new THREE.Color('#E11D48');
          targetEmissive = new THREE.Color('#991B1B');
          targetEmissiveIntensity = 0.55;
        } else if (isSelected) {
          targetColor = cyanColor;
          targetEmissive = cyanEmissive;
          targetEmissiveIntensity = 0.55;
        } else if (isHovered) {
          targetColor = hoverColor;
          targetEmissive = hoverEmissive;
          targetEmissiveIntensity = 0.25;
        }

        if (selectedStructureId === 'ligamento_periodontal') {
          if (isGingiva) opacityMultiplier = 0.22;
          else if (category === 'skeletal') opacityMultiplier = 0.12;
          else if (category === 'dental') opacityMultiplier = 0.40;
        }
      }

      // A opacidade final é o produto do controle do usuário pelo multiplicador de foco,
      // sendo que em isolamento forçado a peça alvo fica 100% e as demais 15% (ghost de referência).
      let effectiveOpacity = Math.max(0.0, Math.min(1.0, userLayerOpacity * opacityMultiplier));
      if (hasIsolation) {
        effectiveOpacity = isIsolated ? 1.0 : 0.15;
      }
      const isSolid = effectiveOpacity >= 0.98 && !name.includes('sinus');

      material.color.copy(targetColor);
      material.roughness = defaultRoughness;
      material.metalness = defaultMetalness;
      material.emissive.copy(targetEmissive);
      material.emissiveIntensity = targetEmissiveIntensity;
      material.transparent = effectiveOpacity < 0.98 || name.includes('sinus');
      material.opacity = name.includes('sinus') ? 0.65 : effectiveOpacity;
      material.depthWrite = isSolid;
      material.side = THREE.DoubleSide;
      mesh.castShadow = isSolid;
      mesh.receiveShadow = true;
      mesh.visible = (isIsolated || isVisible) && !isHidden && effectiveOpacity > 0.01;
    }
  }, [
    meshList,
    archesOnlyMode,
    wisdomToothState,
    alignmentState,
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
    focusedSystem,
    cyanColor,
    cyanEmissive,
    hoverColor,
    hoverEmissive,
    xrayColor,
    xrayEmissive,
    blackColor,
  ]);

  // Handlers de interação
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    const meshName = e.object?.name;
    if (meshName) {
      const id = getStructureId(meshName);
      setHoveredStructure(id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredStructure(null);
    document.body.style.cursor = 'grab';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    const meshName = e.object?.name;
    if (meshName) {
      const id = getStructureId(meshName);
      setSelectedStructure(id);
    }
  };

  const handleContextMenu = (e: any) => {
    e.stopPropagation();
    const meshName = e.object?.name;
    if (meshName) {
      const id = getStructureId(meshName);
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
      {!surfaceExplorationMode && <PeriodontalLigaments archesOnlyMode={archesOnlyMode} />}
    </group>
  );
};

useGLTF.preload('/models/dental-scope/core.glb');
useGLTF.preload('/models/dental-scope/context.glb');
useGLTF.preload('/models/dental-scope/neurovascular.glb');
