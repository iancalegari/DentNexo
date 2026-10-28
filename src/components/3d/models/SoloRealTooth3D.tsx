import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';

/**
 * Mapeamento do código FDI para o nome da malha 3D real no GLB
 */
const FDI_TO_MESH_NAME: Record<string, string> = {
  // Q1 - Superior Direito
  '18': 'Molar_upper_right_3',
  '17': 'Molar_upper_right_2',
  '16': 'Molar_upper_right_1',
  '15': 'Premolar_upper_right_2',
  '14': 'Premolar_Upper_right_1',
  '13': 'Canine_upper_right',
  '12': 'Incisor_upper_right_2',
  '11': 'Incisor_upper_right1',

  // Q2 - Superior Esquerdo
  '21': 'Incisor_upper_left_1',
  '22': 'Incisor_upper_left2',
  '23': 'Canine_upper_left',
  '24': 'Premolar_upper_left_1',
  '25': 'Premolar_upper_left_2',
  '26': 'Molar_upper_left_1',
  '27': 'Molar_upper_left_2',
  '28': 'Molar_upper_left_3',

  // Q3 - Inferior Esquerdo
  '31': 'Incisor_lower_left_1',
  '32': 'Incisor_lower_left_2',
  '33': 'Canine_lower_left',
  '34': 'Premolar_lower_left_1',
  '35': 'Premolar_lower_left_2',
  '36': 'Molar_lower_left_1',
  '37': 'Molar_lower_left_2',
  '38': 'Molar_lower_left_3',

  // Q4 - Inferior Direito
  '41': 'Incisor_lower_right1',
  '42': 'Incisor_lower_right_2',
  '43': 'Canine_lower_right',
  '44': 'Premolar_lower_right_1',
  '45': 'Premolar_lower_right_2',
  '46': 'Molar_lower_right_1',
  '47': 'Molar_lower_right_2',
  '48': 'Molar_lower_right_3',
};

export const SoloRealTooth3D: React.FC = () => {
  const { scene } = useGLTF('/models/teeth.glb');
  const { activeToothFdi, toothViewMode } = useAnatomyStore();

  // Encontrar o dente selecionado e centralizar sua geometria no centro [0,0,0]
  const { centeredGeometry, isUpper } = useMemo(() => {
    const targetMeshName = FDI_TO_MESH_NAME[activeToothFdi] || 'Incisor_upper_right1';
    let foundMesh: THREE.Mesh | null = null;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === targetMeshName) {
        foundMesh = child;
      }
    });

    if (!foundMesh || !(foundMesh as THREE.Mesh).geometry) {
      // Fallback para qualquer malha disponível
      scene.traverse((child) => {
        if (!foundMesh && child instanceof THREE.Mesh && !child.name.includes('00')) {
          foundMesh = child;
        }
      });
    }

    if (!foundMesh) {
      return { centeredGeometry: new THREE.BoxGeometry(1, 2, 1), isUpper: true };
    }

    const geo = (foundMesh as THREE.Mesh).geometry.clone();
    geo.center(); // Centraliza perfeitamente no ponto (0, 0, 0)
    geo.computeVertexNormals();

    const fdiNum = parseInt(activeToothFdi, 10);
    const upper = fdiNum >= 11 && fdiNum <= 28;

    return { centeredGeometry: geo, isUpper: upper };
  }, [scene, activeToothFdi]);

  // Material adaptativo de acordo com o modo anatômico selecionado
  const material = useMemo(() => {
    if (toothViewMode === 'xray') {
      return new THREE.MeshStandardMaterial({
        color: '#38BDF8',
        transparent: true,
        opacity: 0.55,
        roughness: 0.15,
        metalness: 0.1,
        emissive: '#0369A1',
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide,
      });
    }

    if (toothViewMode === 'pulp_isolation') {
      return new THREE.MeshStandardMaterial({
        color: '#E0E7FF',
        transparent: true,
        opacity: 0.35,
        roughness: 0.3,
        metalness: 0.05,
        wireframe: false,
      });
    }

    // Modo externo realista
    return new THREE.MeshStandardMaterial({
      color: '#FAF8F2', // Esmalte dental natural marfim
      roughness: 0.22,
      metalness: 0.04,
      side: THREE.FrontSide,
    });
  }, [toothViewMode]);

  return (
    <group name="solo_real_tooth_group">
      {/* O dente real isolado em escala de estudo ampliada */}
      <mesh
        geometry={centeredGeometry}
        material={material}
        scale={[1.35, 1.35, 1.35]}
        castShadow
        receiveShadow
      />

      {/* Se em modo câmara e canais pulpares, desenhar visualizador interno de canal */}
      {toothViewMode === 'pulp_isolation' && (
        <group>
          {/* Canal radicular e câmara pulpar fluorescente no interior */}
          <mesh scale={[0.3, 0.95, 0.3]} position={[0, isUpper ? -0.1 : 0.1, 0]}>
            <cylinderGeometry args={[0.25, 0.08, 1.6, 16]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#DC2626"
              emissiveIntensity={0.85}
              roughness={0.3}
            />
          </mesh>
        </group>
      )}

      {/* Iluminação de estúdio odontológico */}
      <spotLight
        position={[4, 6, 4]}
        intensity={1.2}
        angle={0.6}
        penumbra={0.5}
        color="#FFFFFF"
      />
      <pointLight position={[-3, -2, -3]} intensity={0.4} color="#7DD3FC" />
    </group>
  );
};

useGLTF.preload('/models/teeth.glb');
