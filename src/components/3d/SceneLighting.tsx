import React from 'react';

interface SceneLightingProps {
  xrayMode: boolean;
}

export const SceneLighting: React.FC<SceneLightingProps> = ({ xrayMode }) => {
  if (xrayMode) {
    return (
      <>
        {/* Iluminação suave e fria estilo negatoscópio digital */}
        <ambientLight intensity={1.2} color="#0c4a6e" />
        <directionalLight position={[0, 10, 10]} intensity={1.5} color="#38bdf8" />
        <directionalLight position={[0, -10, -5]} intensity={0.8} color="#0284c7" />
        <pointLight position={[0, 0, 0]} intensity={2.0} color="#7dd3fc" distance={20} />
      </>
    );
  }

  return (
    <>
      {/* Luz ambiente suave que permite sombras naturais nas órbitas oculares e fossas */}
      <ambientLight intensity={0.32} color="#E2E8F0" />

      {/* Iluminação hemisférica para contraste volumétrico: céu suave / solo escuro */}
      <hemisphereLight
        args={['#F8FAFC', '#0F172A', 0.45]}
        position={[0, 25, 0]}
      />
      
      {/* Luz principal superior (Key Light) com sombras que definem o fundo dos olhos e relevos anatômicos */}
      <directionalLight
        position={[6, 12, 9]}
        intensity={1.6}
        color="#FFFDF7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={35}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.00015}
      />
      
      {/* Luz de preenchimento lateral suave (Fill Light para iluminar sem lavar as sombras dos olhos) */}
      <directionalLight
        position={[-8, 4, 6]}
        intensity={0.45}
        color="#CBD5E1"
      />

      {/* Luz de recorte posterior superior para desenhar a curvatura da calvária */}
      <directionalLight
        position={[-2, 10, -10]}
        intensity={0.85}
        color="#38BDF8"
      />

      {/* Luz de recorte lateral para contorno do ramo mandibular */}
      <directionalLight
        position={[7, -5, -8]}
        intensity={0.55}
        color="#0EA5E9"
      />

      {/* Luz pontual sutil focada na cavidade oral para destacar os dentes */}
      <pointLight position={[0, -0.2, 3.5]} intensity={0.4} color="#FFFBEB" distance={15} />
    </>
  );
};
