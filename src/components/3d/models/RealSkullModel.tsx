import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

export const RealSkullModel: React.FC = () => {
  const { scene } = useGLTF('/models/skull.glb');
  const groupRef = useRef<THREE.Group>(null);

  const {
    selectedStructureId,
    hoveredStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    layers,
    opacities,
    xrayMode,
    setSelectedStructure,
    setHoveredStructure,
  } = useAnatomyStore();

  const isVisible = layers.skeletal;

  // Clonar a cena para aplicar materiais dinâmicos e centralização
  const { clonedScene, isSelected, isHovered } = useMemo(() => {
    const clone = scene.clone(true);

    const isSel =
      selectedStructureId === 'neurocranio' ||
      selectedStructureId === 'maxila' ||
      selectedStructureId === 'mandibula';
    const isHov =
      hoveredStructureId === 'neurocranio' ||
      hoveredStructureId === 'maxila' ||
      hoveredStructureId === 'mandibula';
    const hasIsolation = isolatedStructureId !== null;
    const isIsolated =
      isolatedStructureId === 'neurocranio' ||
      isolatedStructureId === 'maxila' ||
      isolatedStructureId === 'mandibula';
    const isHidden =
      hiddenStructureIds.includes('neurocranio') &&
      hiddenStructureIds.includes('maxila') &&
      hiddenStructureIds.includes('mandibula');

    if (isHidden || !isVisible) {
      clone.visible = false;
      return { clonedScene: clone, isSelected: isSel, isHovered: isHov };
    }

    clone.visible = true;

    // Calcular bounding box para centralização
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Deslocar para centralizar
    clone.position.sub(center);

    // Ajustar materiais de osso craniano
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (xrayMode) {
          child.material = new THREE.MeshStandardMaterial({
            color: isSel ? '#38BDF8' : '#0284C7',
            transparent: true,
            opacity: isSel ? 0.8 : 0.35,
            wireframe: false,
            roughness: 0.25,
            metalness: 0.1,
            emissive: isSel ? '#0369A1' : '#082F49',
            emissiveIntensity: isSel ? 0.5 : 0.15,
            side: THREE.DoubleSide,
          });
        } else {
          let color = '#EDE7D8'; // Cor osso marfim realista
          let emissive = '#000000';
          let emissiveIntensity = 0;

          if (isSel) {
            color = themeTokens.colors.brandCyan;
            emissive = '#006B85';
            emissiveIntensity = 0.4;
          } else if (isHov) {
            color = '#BAE6FD';
            emissive = '#0369A1';
            emissiveIntensity = 0.2;
          }

          let opacity = opacities.skeletal;
          if (hasIsolation && !isIsolated) {
            opacity = 0.15;
          }

          child.material = new THREE.MeshStandardMaterial({
            color,
            transparent: opacity < 1.0 || (hasIsolation && !isIsolated),
            opacity,
            roughness: 0.62,
            metalness: 0.04,
            emissive,
            emissiveIntensity,
            side: THREE.DoubleSide,
          });
        }
      }
    });

    return { clonedScene: clone, isSelected: isSel, isHovered: isHov };
  }, [
    scene,
    selectedStructureId,
    hoveredStructureId,
    isolatedStructureId,
    hiddenStructureIds,
    isVisible,
    opacities.skeletal,
    xrayMode,
  ]);

  if (!isVisible && !xrayMode) return null;

  return (
    <group
      ref={groupRef}
      name="real_skull_model"
      scale={[11.5, 11.5, 11.5]}
      position={[0, 0.45, 0]}
      rotation={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedStructure('neurocranio');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredStructure('neurocranio');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredStructure(null);
        document.body.style.cursor = 'grab';
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

useGLTF.preload('/models/skull.glb');
