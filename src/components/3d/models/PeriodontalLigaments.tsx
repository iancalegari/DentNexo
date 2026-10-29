import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { themeTokens } from '@/theme/tokens';
import { TOOTH_3D_CENTERS } from '@/data/dental/surfaceFeaturesData';

interface PeriodontalLigamentsProps {
  archesOnlyMode?: boolean;
}

export const PeriodontalLigaments: React.FC<PeriodontalLigamentsProps> = ({ archesOnlyMode = false }) => {
  const {
    selectedStructureId,
    hoveredStructureId,
    focusedSystem,
    setSelectedStructure,
    setHoveredStructure,
  } = useAnatomyStore();

  const isSelected = selectedStructureId === 'ligamento_periodontal';
  const isHovered = hoveredStructureId === 'ligamento_periodontal';

  // O Ligamento Periodontal é uma microestrutura interna fisiológica (0.15 a 0.38 mm) situada no espaço alvéolo-dental.
  // Deve ser exibido quando:
  // 1. Está explicitamente selecionado (via chip no Sistema Oral, busca, odontograma ou clique 3D)
  // 2. O usuário passa o mouse por cima (hover)
  // 3. No foco de tecidos orais quando selecionado
  // No modo "Arcadas & Alinhamento" (archesOnlyMode), nunca polui a visualização dental a menos que selecionado.
  const isVisible = (isSelected || isHovered) || (focusedSystem === 'oral_tissue' && isSelected);

  // Gerar mangas anatômicas calibradas para os 32 dentes, contidas estritamente no alvéolo ósseo/gengival
  const pdlItems = useMemo(() => {
    const teethList = [
      // Maxila (Superior)
      { fdi: '11', type: 'incisor', isUpper: true },
      { fdi: '12', type: 'incisor', isUpper: true },
      { fdi: '13', type: 'canine', isUpper: true },
      { fdi: '14', type: 'premolar', isUpper: true },
      { fdi: '15', type: 'premolar', isUpper: true },
      { fdi: '16', type: 'molar', isUpper: true },
      { fdi: '17', type: 'molar', isUpper: true },
      { fdi: '18', type: 'molar', isUpper: true },
      { fdi: '21', type: 'incisor', isUpper: true },
      { fdi: '22', type: 'incisor', isUpper: true },
      { fdi: '23', type: 'canine', isUpper: true },
      { fdi: '24', type: 'premolar', isUpper: true },
      { fdi: '25', type: 'premolar', isUpper: true },
      { fdi: '26', type: 'molar', isUpper: true },
      { fdi: '27', type: 'molar', isUpper: true },
      { fdi: '28', type: 'molar', isUpper: true },
      // Mandíbula (Inferior)
      { fdi: '31', type: 'incisor', isUpper: false },
      { fdi: '32', type: 'incisor', isUpper: false },
      { fdi: '33', type: 'canine', isUpper: false },
      { fdi: '34', type: 'premolar', isUpper: false },
      { fdi: '35', type: 'premolar', isUpper: false },
      { fdi: '36', type: 'molar', isUpper: false },
      { fdi: '37', type: 'molar', isUpper: false },
      { fdi: '38', type: 'molar', isUpper: false },
      { fdi: '41', type: 'incisor', isUpper: false },
      { fdi: '42', type: 'incisor', isUpper: false },
      { fdi: '43', type: 'canine', isUpper: false },
      { fdi: '44', type: 'premolar', isUpper: false },
      { fdi: '45', type: 'premolar', isUpper: false },
      { fdi: '46', type: 'molar', isUpper: false },
      { fdi: '47', type: 'molar', isUpper: false },
      { fdi: '48', type: 'molar', isUpper: false },
    ];

    return teethList.map(({ fdi, type, isUpper }) => {
      const center = TOOTH_3D_CENTERS[fdi] || [0, 0, 0];

      // Alturas anatômicas contidas estritamente no rebordo alveolar (nunca passam da gengiva para fora)
      let height = 0.24;
      let rCervical = 0.15;
      let rApical = 0.10;

      if (type === 'molar') {
        height = 0.28;
        rCervical = 0.24;
        rApical = 0.16;
      } else if (type === 'canine') {
        height = 0.30;
        rCervical = 0.18;
        rApical = 0.12;
      } else if (type === 'premolar') {
        height = 0.25;
        rCervical = 0.19;
        rApical = 0.13;
      }

      // No arco superior a raiz cresce para cima (+Y); no inferior para baixo (-Y)
      // Ajuste de centro para manter a manga no terço cervical-médio radicular sem perfurar corticais
      const posY = isUpper ? center[1] + height * 0.38 : center[1] - height * 0.38;
      const pos: [number, number, number] = [center[0], posY, center[2]];

      // Leve inclinação para acompanhar o longo eixo dental
      const rotZ = center[0] * 0.04;

      return {
        fdi,
        pos,
        geometryArgs: isUpper
          ? ([rApical, rCervical, height, 16] as [number, number, number, number])
          : ([rCervical, rApical, height, 16] as [number, number, number, number]),
        rotation: [0, 0, rotZ] as [number, number, number],
      };
    });
  }, []);

  if (archesOnlyMode && !isSelected) return null;
  if (!isVisible) return null;

  const matColor = isSelected
    ? themeTokens.colors.brandCyan
    : isHovered
    ? '#7DD3FC'
    : '#F97316';

  const emissiveColor = isSelected
    ? '#00E5FF'
    : isHovered
    ? '#0284C7'
    : '#C2410C';

  const emissiveIntensity = isSelected ? 0.9 : isHovered ? 0.5 : 0.2;
  const opacity = isSelected ? 0.92 : 0.65;

  return (
    <group
      name="periodontal_ligament_system"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedStructure('ligamento_periodontal');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredStructure('ligamento_periodontal');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredStructure(null);
        document.body.style.cursor = 'grab';
      }}
    >
      {pdlItems.map((item) => (
        <mesh
          key={item.fdi}
          position={item.pos}
          rotation={item.rotation}
          castShadow={false}
          receiveShadow={false}
        >
          <cylinderGeometry args={item.geometryArgs} />
          <meshStandardMaterial
            color={matColor}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            roughness={0.35}
            metalness={0.05}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};
