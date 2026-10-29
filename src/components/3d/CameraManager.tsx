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

  const startPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const startLookAt = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(8.5, 6.2, 11.5));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.5, 0));
  const isTransitioning = useRef<boolean>(false);
  const transitionProgress = useRef<number>(1);

  // Cancela a transição imediatamente quando o usuário interage manualmente com os controles
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleInteractionStart = () => {
      isTransitioning.current = false;
      transitionProgress.current = 1;
    };

    controls.addEventListener('start', handleInteractionStart);
    return () => {
      controls.removeEventListener('start', handleInteractionStart);
    };
  }, [controlsRef]);

  // Função auxiliar para iniciar uma transição limpa
  const initiateTransition = (newPos: THREE.Vector3, newLookAt: THREE.Vector3) => {
    startPos.current.copy(camera.position);
    startLookAt.current.copy(controlsRef.current?.target || new THREE.Vector3(0, 0.5, 0));
    targetPos.current.copy(newPos);
    targetLookAt.current.copy(newLookAt);
    transitionProgress.current = 0;
    isTransitioning.current = true;
  };

  // Animação para modo de exploração de superfície do dente
  useEffect(() => {
    if (surfaceExplorationMode) {
      const preset = getToothFaceCameraPreset(activeToothFdi, activeToothFace);
      const nextPos = new THREE.Vector3(preset.position[0], preset.position[1], preset.position[2]);
      const nextLookAt = new THREE.Vector3(preset.lookAt[0], preset.lookAt[1], preset.lookAt[2]);
      initiateTransition(nextPos, nextLookAt);
    }
  }, [surfaceExplorationMode, activeToothFdi, activeToothFace]);

  // Mapear presets gerais de câmera para enquadramento completo e panorâmico do crânio
  useEffect(() => {
    if (surfaceExplorationMode) return;

    const nextPos = new THREE.Vector3();
    const nextLookAt = new THREE.Vector3(0, 0.5, 0);

    switch (cameraPreset) {
      case 'frontal':
        nextPos.set(0, 0.5, 15.5);
        break;
      case 'lateral_right':
        nextPos.set(-15.5, 0.5, 0);
        break;
      case 'lateral_left':
        nextPos.set(15.5, 0.5, 0);
        break;
      case 'superior':
        nextPos.set(0, 16.0, 0.1);
        break;
      case 'inferior':
        nextPos.set(0, -15.0, 0.1);
        break;
      case 'occlusal_upper':
        nextPos.set(0, -7.5, 2.0);
        nextLookAt.set(0, 0.5, 1.2);
        break;
      case 'occlusal_lower':
        nextPos.set(0, 7.5, 1.5);
        nextLookAt.set(0, -0.8, 1.2);
        break;
      case 'isometric':
      default:
        // Posição panorâmica exata mostrando todo o crânio confortavelmente enquadrado
        nextPos.set(8.5, 6.2, 11.5);
        break;
    }

    initiateTransition(nextPos, nextLookAt);
  }, [cameraPreset, surfaceExplorationMode, cameraResetKey]);

  // Transição suave determinística (sem lutar com o OrbitControls e garantindo 60 FPS)
  useFrame((_, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return;

    // Transição dura aproximadamente ~0.35s
    transitionProgress.current += delta * 2.8;

    if (transitionProgress.current >= 1) {
      transitionProgress.current = 1;
      camera.position.copy(targetPos.current);
      controlsRef.current.target.copy(targetLookAt.current);
      controlsRef.current.update();
      isTransitioning.current = false;
      return;
    }

    // Curva de interpolação cúbica suave (ease-out cubic)
    const t = 1 - Math.pow(1 - transitionProgress.current, 3);
    camera.position.lerpVectors(startPos.current, targetPos.current, t);
    controlsRef.current.target.lerpVectors(startLookAt.current, targetLookAt.current, t);
    controlsRef.current.update();
  });

  return null;
};
