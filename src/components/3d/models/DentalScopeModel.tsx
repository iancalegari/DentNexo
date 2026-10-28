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

// Paleta Anatômica Calibrada com tons orgânicos realistas de alta fidelidade
const ANATOMY_PALETTE = {
  bone: '#EAE5D6',         // Osso cortical marfim clássico aquecido
  boneAlveolar: '#E6DFC8', // Osso alveolar e septos interdentais
  boneCondyle: '#E8E1CE',  // Côndilo mandibular
  enamel: '#F7F4EA',       // Esmalte dental vítreo polido e translúcido
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

    // Neurocrânio e ossos da calvária/base (frontal, parietal, occipital, temporal, esfenóide)
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

      const name = child.name;
      const category = getMeshCategory(name);
      if (!category) return;

      const structureId = getStructureId(name);

      let hex = ANATOMY_PALETTE.bone;
      let roughness = 0.40; // Brilho suave característico do osso cortical
      let metalness = 0.04;
      let bumpMap: THREE.Texture | null = boneBump;
      let bumpScale = 0.016;
      let emissiveHex = '#000000';
      let emissiveIntensity = 0;
      let transparent = false;
      let opacity = 1.0;

      if (category === 'dental') {
        hex = ANATOMY_PALETTE.enamel;
        roughness = 0.16; // Esmalte dental vítreo liso e de alto reflexo especular
        metalness = 0.05;
        bumpMap = null;
        bumpScale = 0;
      } else if (category === 'muscular') {
        hex = ANATOMY_PALETTE.muscle;
        roughness = 0.28; // Superfície tecidual úmida com reflexo especular vívido
        metalness = 0.08;
        bumpMap = muscleBump;
        bumpScale = 0.038; // Estriações nítidas dos fascículos musculares
        emissiveHex = '#2C0604';
        emissiveIntensity = 0.06;
      } else if (category === 'nervous') {
        hex = ANATOMY_PALETTE.nerve;
        roughness = 0.38;
        bumpMap = null;
        bumpScale = 0;
        emissiveHex = '#713F12';
        emissiveIntensity = 0.25;
      } else if (category === 'vascular') {
        hex = name.includes('vein') ? ANATOMY_PALETTE.vein : ANATOMY_PALETTE.artery;
        roughness = 0.32;
        bumpMap = null;
        bumpScale = 0;
      } else if (category === 'oral_tissue') {
        hex = ANATOMY_PALETTE.gingiva;
        roughness = 0.35;
        bumpMap = gingivaBump;
        bumpScale = 0.014; // Pontilhado em casca de laranja
      } else if (name.includes('sinus')) {
        hex = ANATOMY_PALETTE.sinus;
        roughness = 0.22;
        bumpMap = null;
        bumpScale = 0;
        transparent = true;
        opacity = 0.65;
      }

      // Material dedicado persistente por malha com FrontSide para máximo desempenho
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex),
        roughness,
        metalness,
        bumpMap: bumpMap || undefined,
        bumpScale,
        emissive: new THREE.Color(emissiveHex),
        emissiveIntensity,
        transparent,
        opacity,
        side: THREE.FrontSide,
      });

      child.material = material;
      child.castShadow = !transparent;
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

      // MODO APENAS ARCADAS E GENGIVA:
      // Oculta completamente ossos, crânio, músculos e neurovascular
      if (archesOnlyMode && !isTooth && !isGingiva) {
        mesh.visible = false;
        continue;
      }

      const isVisible = layers[category as keyof typeof layers];
      const isHidden = hiddenStructureIds.includes(structureId);

      if (!isVisible || isHidden) {
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

      const isSelected = selectedStructureId === structureId;
      const isHovered = hoveredStructureId === structureId;
      const isIsolated = isolatedStructureId === structureId;

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
      // Crânio oculto, dente ativo com opacidade total (1.0) e outros dentes com opacidade reduzida (0.15)
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
          // Demais dentes com opacidade reduzida a 15%
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
          // Gengiva com transparência suave de contexto
          material.color.copy(defaultColor);
          material.roughness = 0.7;
          material.transparent = true;
          material.opacity = 0.1;
          material.emissive.copy(blackColor);
          material.emissiveIntensity = 0;
          material.depthWrite = false;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
        continue;
      }

      // ================= MODO FOCO EM SISTEMA ANATÔMICO (ISOLAMENTO DO SISTEMA COM OPACIDADE REDUZIDA NAS DEMAIS PARTES) =================
      if (focusedSystem) {
        const isTargetSystem = category === focusedSystem;

        if (isTargetSystem) {
          // O sistema anatômico foco fica em destaque total com opacidade 100%
          const highlightColor = isSelected ? cyanColor : (isHovered ? hoverColor : defaultColor);
          const highlightEmissive = isSelected ? cyanEmissive : (isHovered ? hoverEmissive : defaultEmissive);
          const highlightIntensity = isSelected ? 0.6 : (isHovered ? 0.3 : defaultEmissiveIntensity);

          material.color.copy(highlightColor);
          material.roughness = defaultRoughness;
          material.metalness = defaultMetalness;
          material.transparent = false;
          material.opacity = 1.0;
          material.emissive.copy(highlightEmissive);
          material.emissiveIntensity = highlightIntensity;
          material.depthWrite = true;
          material.side = THREE.FrontSide;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.visible = true;
        } else {
          // Demais partes com opacidade reduzida elegante (ghost / referência anatômica)
          let ghostOpacity = 0.14;
          let shouldShowGhost = false;

          if (focusedSystem === 'skeletal') {
            // Em ossos: dentes ficam visíveis a 85% para orientar o arco dental
            if (category === 'dental') {
              ghostOpacity = 0.85;
              shouldShowGhost = true;
            }
          } else if (focusedSystem === 'oral_tissue') {
            // Em periodonto: dentes ficam a 70% e ossos alveolares a 20%
            if (category === 'dental') {
              ghostOpacity = 0.70;
              shouldShowGhost = true;
            } else if (category === 'skeletal') {
              ghostOpacity = 0.20;
              shouldShowGhost = true;
            }
          } else if (focusedSystem === 'muscular') {
            // Em músculos: ossos ficam semitransparentes a 22% para ver inserções/origens, dentes a 18%
            if (category === 'skeletal') {
              ghostOpacity = 0.22;
              shouldShowGhost = true;
            } else if (category === 'dental') {
              ghostOpacity = 0.18;
              shouldShowGhost = true;
            }
          } else if (focusedSystem === 'nervous' || focusedSystem === 'vascular') {
            // Em nervos e vasos: ossos a 15% (permite ver canais internos) e dentes a 18%
            if (category === 'skeletal') {
              ghostOpacity = 0.15;
              shouldShowGhost = true;
            } else if (category === 'dental') {
              ghostOpacity = 0.18;
              shouldShowGhost = true;
            }
          }

          if (shouldShowGhost) {
            material.color.copy(defaultColor);
            material.roughness = 0.8;
            material.metalness = 0.0;
            material.transparent = true;
            material.opacity = ghostOpacity;
            material.emissive.copy(blackColor);
            material.emissiveIntensity = 0;
            material.depthWrite = false;
            material.side = THREE.FrontSide;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.visible = true;
          } else {
            mesh.visible = false;
          }
        }
        continue;
      }

      // ================= MODO ISOLAMENTO (60 FPS OTIMIZADO) =================
      if (hasIsolation) {
        if (isIsolated) {
          material.color.copy(cyanColor);
          material.roughness = 0.22;
          material.metalness = 0.08;
          material.transparent = false;
          material.opacity = 1.0;
          material.emissive.copy(cyanEmissive);
          material.emissiveIntensity = 0.55;
          material.depthWrite = true;
          material.side = THREE.FrontSide;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        } else {
          material.color.copy(defaultColor);
          material.roughness = 0.8;
          material.metalness = 0.0;
          material.transparent = true;
          material.opacity = 0.12;
          material.emissive.copy(blackColor);
          material.emissiveIntensity = 0;
          material.depthWrite = false;
          material.side = THREE.FrontSide;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
        continue;
      }

      // ================= MODO NORMAL =================
      let targetColor = defaultColor;
      let targetEmissive = defaultEmissive;
      let targetEmissiveIntensity = defaultEmissiveIntensity;

      if (activePathologyId === 'gengivite' && isGingiva) {
        // Inflamação eritematosa viva e edema da gengiva marginal
        targetColor = new THREE.Color('#E11D48');
        targetEmissive = new THREE.Color('#991B1B');
        targetEmissiveIntensity = 0.55;
      } else if (isSelected) {
        targetColor = cyanColor;
        targetEmissive = cyanEmissive;
        targetEmissiveIntensity = 0.5;
      } else if (isHovered) {
        targetColor = hoverColor;
        targetEmissive = hoverEmissive;
        targetEmissiveIntensity = 0.25;
      }

      const catOpacity = opacities[category as keyof typeof opacities] ?? 1.0;
      material.color.copy(targetColor);
      material.roughness = defaultRoughness;
      material.metalness = defaultMetalness;
      material.emissive.copy(targetEmissive);
      material.emissiveIntensity = targetEmissiveIntensity;
      material.transparent = catOpacity < 1.0 || name.includes('sinus');
      material.opacity = name.includes('sinus') ? 0.65 : catOpacity;
      material.depthWrite = catOpacity >= 0.9 && !name.includes('sinus');
      material.side = THREE.FrontSide;
      mesh.castShadow = catOpacity > 0.5 && !name.includes('sinus');
      mesh.receiveShadow = catOpacity > 0.5;
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
      {!archesOnlyMode && <primitive object={contextClone} />}
      {!archesOnlyMode && <primitive object={neuroClone} />}
    </group>
  );
};

useGLTF.preload('/models/dental-scope/core.glb');
useGLTF.preload('/models/dental-scope/context.glb');
useGLTF.preload('/models/dental-scope/neurovascular.glb');
