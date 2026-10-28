import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { permanentTeethData } from '@/data/dental/teethData';

export const DetailedTooth3D: React.FC = () => {
  const {
    activeToothFdi,
    toothViewMode,
    xrayMode,
  } = useAnatomyStore();

  const toothData = permanentTeethData[activeToothFdi] || permanentTeethData['36'];

  const isCutaway = toothViewMode === 'cross_section';
  const isPulpOnly = toothViewMode === 'pulp_isolation';
  const isXray = toothViewMode === 'xray' || xrayMode;

  const geometries = useMemo(() => {
    // 1. Esmalte Externo (Outer Enamel Shell)
    // Se for cutaway, utilizamos corte de 180 graus (semi-cilindro) para revelar o interior
    const thetaLength = isCutaway ? Math.PI : Math.PI * 2;
    const enamelCrownGeo = new THREE.CylinderGeometry(
      1.15,
      0.95,
      1.4,
      32,
      1,
      false,
      0,
      thetaLength
    );

    // Raiz com Cemento
    const rootGeo = new THREE.ConeGeometry(0.55, 2.6, 24, 1, false, 0, thetaLength);

    // 2. Dentina Intermediária (Dentin Layer)
    const dentinCrownGeo = new THREE.CylinderGeometry(
      0.95,
      0.75,
      1.2,
      24,
      1,
      false,
      0,
      thetaLength
    );
    const dentinRootGeo = new THREE.ConeGeometry(0.42, 2.3, 20, 1, false, 0, thetaLength);

    // 3. Polpa Dentária (Pulp chamber + root canals) - Sempre inteira para contraste
    const pulpChamberGeo = new THREE.CylinderGeometry(0.38, 0.28, 0.8, 16);
    const pulpCanalGeo = new THREE.ConeGeometry(0.12, 2.1, 14);

    // 4. Cornos pulpares
    const hornGeo = new THREE.ConeGeometry(0.1, 0.35, 12);

    return {
      enamelCrownGeo,
      rootGeo,
      dentinCrownGeo,
      dentinRootGeo,
      pulpChamberGeo,
      pulpCanalGeo,
      hornGeo,
    };
  }, [isCutaway]);

  return (
    <group name="detailed_solo_tooth" scale={[1.3, 1.3, 1.3]}>
      {/* ================= 1. CAMADA DE ESMALTE EXTERNO ================= */}
      {!isPulpOnly && (
        <group name="enamel_shell">
          <mesh geometry={geometries.enamelCrownGeo} position={[0, 0.65, 0]}>
            <meshStandardMaterial
              color={isXray ? '#E0F2FE' : '#F8FAFC'}
              roughness={0.25}
              metalness={0.1}
              transparent={isCutaway || isXray}
              opacity={isXray ? 0.4 : isCutaway ? 0.95 : 1.0}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Cemento radicular externo */}
          <mesh
            geometry={geometries.rootGeo}
            position={[-0.4, -1.2, 0]}
            rotation={[Math.PI, 0, -0.1]}
          >
            <meshStandardMaterial
              color={isXray ? '#7DD3FC' : '#CBD5E1'}
              roughness={0.5}
              transparent={isCutaway || isXray}
              opacity={isXray ? 0.35 : 1.0}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh
            geometry={geometries.rootGeo}
            position={[0.4, -1.2, 0]}
            rotation={[Math.PI, 0, 0.1]}
          >
            <meshStandardMaterial
              color={isXray ? '#7DD3FC' : '#CBD5E1'}
              roughness={0.5}
              transparent={isCutaway || isXray}
              opacity={isXray ? 0.35 : 1.0}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* ================= 2. CAMADA DE DENTINA INTERNA ================= */}
      {(isCutaway || isXray) && !isPulpOnly && (
        <group name="dentin_layer">
          <mesh geometry={geometries.dentinCrownGeo} position={[0, 0.6, 0]}>
            <meshStandardMaterial
              color={isXray ? '#38BDF8' : '#FDE68A'}
              roughness={0.4}
              transparent={isXray}
              opacity={isXray ? 0.45 : 0.95}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh
            geometry={geometries.dentinRootGeo}
            position={[-0.4, -1.15, 0]}
            rotation={[Math.PI, 0, -0.1]}
          >
            <meshStandardMaterial
              color={isXray ? '#38BDF8' : '#FDE68A'}
              transparent={isXray}
              opacity={isXray ? 0.45 : 0.95}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh
            geometry={geometries.dentinRootGeo}
            position={[0.4, -1.15, 0]}
            rotation={[Math.PI, 0, 0.1]}
          >
            <meshStandardMaterial
              color={isXray ? '#38BDF8' : '#FDE68A'}
              transparent={isXray}
              opacity={isXray ? 0.45 : 0.95}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* ================= 3. POLPA DENTÁRIA E CANAIS RADICULARES ================= */}
      <group name="pulp_and_canals">
        {/* Câmara pulpar coronária */}
        <mesh geometry={geometries.pulpChamberGeo} position={[0, 0.55, 0]}>
          <meshStandardMaterial
            color="#EF4444"
            emissive="#DC2626"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>

        {/* Cornos pulpares vestibulares e linguais */}
        <mesh geometry={geometries.hornGeo} position={[-0.22, 1.05, 0.15]}>
          <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.8} />
        </mesh>
        <mesh geometry={geometries.hornGeo} position={[0.22, 1.05, 0.15]}>
          <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.8} />
        </mesh>
        <mesh geometry={geometries.hornGeo} position={[-0.22, 1.05, -0.15]}>
          <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.8} />
        </mesh>
        <mesh geometry={geometries.hornGeo} position={[0.22, 1.05, -0.15]}>
          <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.8} />
        </mesh>

        {/* Canal radicular mesial até forame apical */}
        <mesh
          geometry={geometries.pulpCanalGeo}
          position={[-0.38, -0.95, 0]}
          rotation={[Math.PI, 0, -0.1]}
        >
          <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.7} />
        </mesh>

        {/* Canal radicular distal até forame apical */}
        <mesh
          geometry={geometries.pulpCanalGeo}
          position={[0.38, -0.95, 0]}
          rotation={[Math.PI, 0, 0.1]}
        >
          <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.7} />
        </mesh>

        {/* Forames apicais destacados */}
        <mesh position={[-0.6, -2.0, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#00C9F6" />
        </mesh>
        <mesh position={[0.6, -2.0, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#00C9F6" />
        </mesh>
      </group>
    </group>
  );
};
