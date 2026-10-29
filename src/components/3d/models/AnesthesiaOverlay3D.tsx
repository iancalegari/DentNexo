import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { ANESTHESIA_MAP } from '@/data/clinical/anesthesiaData';

const noopRaycast = () => null;

export const AnesthesiaOverlay3D: React.FC = () => {
  const { activeAnesthesiaId } = useAnatomyStore();
  const diffusionRef = useRef<THREE.Mesh | null>(null);
  const outerHaloRef = useRef<THREE.Mesh | null>(null);
  const softZonesGroupRef = useRef<THREE.Group | null>(null);

  const technique = activeAnesthesiaId ? ANESTHESIA_MAP[activeAnesthesiaId] : null;

  // Geometria vetorial e orientação 3D da Seringa Carpule + Agulha Odontológica
  const syringeTransform = useMemo(() => {
    if (!technique) return null;

    const hub = new THREE.Vector3(...technique.syringeHubPos);
    const target = new THREE.Vector3(...technique.targetPoint);
    const dir = new THREE.Vector3().subVectors(target, hub);
    const needleLength = dir.length();
    const dirNorm = dir.clone().normalize();

    // Cilindro padrão do Three.js aponta em +Y; alinhamos +Y com dirNorm (do canhão até o alvo)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dirNorm
    );

    const needleMid = new THREE.Vector3().addVectors(hub, target).multiplyScalar(0.5);
    const barrelLength = 2.15;
    // Corpo da seringa estende-se para trás do canhão (sentido -dirNorm)
    const barrelCenter = hub.clone().addScaledVector(dirNorm, -barrelLength * 0.5 - 0.14);
    const plungerCenter = hub.clone().addScaledVector(dirNorm, -barrelLength - 0.55);
    const thumbRingPos = hub.clone().addScaledVector(dirNorm, -barrelLength - 0.98);

    return {
      hub,
      target,
      needleMid,
      needleLength,
      barrelLength,
      barrelCenter,
      plungerCenter,
      thumbRingPos,
      quaternion,
    };
  }, [technique]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (diffusionRef.current) {
      const pulse = 1 + Math.sin(t * 3.0) * 0.1;
      diffusionRef.current.scale.setScalar(pulse);
    }
    if (outerHaloRef.current) {
      const wave = 1 + Math.sin(t * 2.2 - 0.8) * 0.14;
      outerHaloRef.current.scale.setScalar(wave);
    }
    if (softZonesGroupRef.current) {
      const softPulse = 1 + Math.sin(t * 2.4) * 0.04;
      softZonesGroupRef.current.children.forEach((child) => {
        if (child.userData.baseScale) {
          const [sx, sy, sz] = child.userData.baseScale as [number, number, number];
          child.scale.set(sx * softPulse, sy * softPulse, sz * softPulse);
        }
      });
    }
  });

  if (!technique || !syringeTransform) return null;

  const {
    hub,
    target,
    needleMid,
    needleLength,
    barrelLength,
    barrelCenter,
    plungerCenter,
    thumbRingPos,
    quaternion,
  } = syringeTransform;

  return (
    <group name="anesthesia_3d_overlay">
      {/* 1. HASTE METÁLICA DA AGULHA ODONTOLÓGICA */}
      <mesh position={needleMid} quaternion={quaternion} raycast={noopRaycast}>
        <cylinderGeometry args={[0.022, 0.028, needleLength, 16]} />
        <meshStandardMaterial
          color="#E2E8F0"
          metalness={0.88}
          roughness={0.16}
          emissive="#38BDF8"
          emissiveIntensity={0.28}
        />
      </mesh>

      {/* Canhão da Agulha (Hub rosqueável) */}
      <mesh position={hub} quaternion={quaternion} raycast={noopRaycast}>
        <cylinderGeometry args={[0.085, 0.13, 0.28, 20]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.65}
          roughness={0.25}
          emissive="#78350F"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 2. CORPO DA SERINGA CARPULE + TUBETE ANESTÉSICO */}
      <group position={barrelCenter} quaternion={quaternion}>
        {/* Camisa metálica vazada / estrutura externa */}
        <mesh raycast={noopRaycast}>
          <cylinderGeometry args={[0.21, 0.21, barrelLength, 24, 1, true]} />
          <meshStandardMaterial
            color="#CBD5E1"
            metalness={0.85}
            roughness={0.2}
            transparent
            opacity={0.48}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Tubete de vidro com solução anestésica verde-água / ciano */}
        <mesh raycast={noopRaycast}>
          <cylinderGeometry args={[0.165, 0.165, barrelLength * 0.88, 20]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#059669"
            emissiveIntensity={0.55}
            roughness={0.12}
            metalness={0.1}
            transparent
            opacity={0.78}
          />
        </mesh>

        {/* Colar superior e apoio digital (asas da Carpule) */}
        <mesh position={[0, -barrelLength * 0.5, 0]} raycast={noopRaycast}>
          <boxGeometry args={[0.92, 0.1, 0.28]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.22} />
        </mesh>
      </group>

      {/* Haste do êmbolo aspirador */}
      <mesh position={plungerCenter} quaternion={quaternion} raycast={noopRaycast}>
        <cylinderGeometry args={[0.045, 0.045, 0.85, 14]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Anel do polegar para aspiração (Carpule com refluxo) */}
      <mesh position={thumbRingPos} quaternion={quaternion} raycast={noopRaycast}>
        <torusGeometry args={[0.24, 0.042, 14, 28]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.88} roughness={0.18} />
      </mesh>

      {/* 3. ESFERA DE DIFUSÃO DO BOLUS ANESTÉSICO NO FORAME / NERVO ALVO */}
      <group position={target}>
        {/* Núcleo intenso no bisel da agulha */}
        <mesh raycast={noopRaycast}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            color="#6EE7B7"
            emissive="#10B981"
            emissiveIntensity={1.2}
            roughness={0.15}
          />
        </mesh>

        {/* Esfera interna pulsante de infiltração */}
        <mesh ref={diffusionRef} raycast={noopRaycast}>
          <sphereGeometry args={[technique.diffusionRadius * 0.65, 28, 28]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#059669"
            emissiveIntensity={0.75}
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </mesh>

        {/* Halo externo de difusão tecidual */}
        <mesh ref={outerHaloRef} raycast={noopRaycast}>
          <sphereGeometry args={[technique.diffusionRadius, 28, 28]} />
          <meshStandardMaterial
            color="#2DD4BF"
            emissive="#0D9488"
            emissiveIntensity={0.45}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>

        {/* Rótulo flutuante do Ponto de Depósito */}
        <Html
          position={[0, technique.diffusionRadius + 0.32, 0]}
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(16, 185, 129, 0.65)',
              borderRadius: '999px',
              padding: '3px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.55)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                color: '#ECFDF5',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              Alvo: {technique.shortName}
            </span>
          </div>
        </Html>
      </group>

      {/* 4. TERRITÓRIO DE TECIDOS MOLES / MUCOSA ANESTESIADA */}
      <group ref={softZonesGroupRef}>
        {technique.softTissueZones.map((zone, idx) => (
          <mesh
            key={idx}
            position={zone.position}
            rotation={zone.rotation || [0, 0, 0]}
            scale={zone.scale}
            userData={{ baseScale: zone.scale }}
            raycast={noopRaycast}
          >
            <sphereGeometry args={[1, 28, 28]} />
            <meshStandardMaterial
              color="#34D399"
              emissive="#059669"
              emissiveIntensity={0.75}
              transparent
              opacity={0.38}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

