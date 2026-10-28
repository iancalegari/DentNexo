import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { getToothFaceCameraPreset } from '@/data/dental/surfaceFeaturesData';

interface CameraManagerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export const CameraManager: React.FC<CameraManagerProps> = ({ controlsRef }) => {
  const { camera } = useThree();
  const {
    cameraPreset,
    cameraResetKey,
    surfaceExplorationMode,
    activeToothFdi,
    activeToothFace,
  } = useAnatomyStore();

  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 7));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef<boolean>(false);

  // Animação para modo de exploração de superfície do dente
  useEffect(() => {
    if (surfaceExplorationMode) {
      const preset = getToothFaceCameraPreset(activeToothFdi, activeToothFace);
      targetPos.current.set(preset.position[0], preset.position[1], preset.position[2]);
      targetLookAt.current.set(preset.lookAt[0], preset.lookAt[1], preset.lookAt[2]);
      isTransitioning.current = true;
    }
  }, [surfaceExplorationMode, activeToothFdi, activeToothFace]);

  // Mapear presets gerais de câmera
  useEffect(() => {
    if (surfaceExplorationMode) return;

    switch (cameraPreset) {
      case 'frontal':
        targetPos.current.set(0, 0, 7.5);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'lateral_right':
        targetPos.current.set(-7.5, 0, 0);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'lateral_left':
        targetPos.current.set(7.5, 0, 0);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'superior':
        targetPos.current.set(0, 7.5, 0.1);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'inferior':
        targetPos.current.set(0, -7.5, 0.1);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'occlusal_upper':
        targetPos.current.set(0, -5.5, 2.0);
        targetLookAt.current.set(0, 0, 1.2);
        break;
      case 'occlusal_lower':
        targetPos.current.set(0, 5.5, 1.5);
        targetLookAt.current.set(0, -1.0, 1.2);
        break;
      case 'isometric':
      default:
        targetPos.current.set(4.5, 3.2, 5.8);
        targetLookAt.current.set(0, -0.2, 0);
        break;
    }
    isTransitioning.current = true;
  }, [cameraPreset, surfaceExplorationMode, cameraResetKey]);

  // Transição suave (lerp) na animação de frame
  useFrame((_, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return;

    const lerpFactor = Math.min(delta * 4.8, 1.0);
    camera.position.lerp(targetPos.current, lerpFactor);
    controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(targetPos.current) < 0.04 &&
      controlsRef.current.target.distanceTo(targetLookAt.current) < 0.04
    ) {
      isTransitioning.current = false;
    }
  });

  return null;
};
