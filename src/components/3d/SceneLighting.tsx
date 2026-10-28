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
      {/* Luz ambiente clínica balanceada (baixo ganho para preservar profundidade 3D e relevo) */}
      <ambientLight intensity={0.32} color="#F8FAFC" />

      {/* Iluminação hemisférica (Céu clínico claro / Solo escuro para realçar volume anatômico) */}
      <hemisphereLight
        args={['#F8FAFC', '#0F172A', 0.55]}
        position={[0, 25, 0]}
      />
      
      {/* Luz principal superior (Key Light frontal/ântero-superior) */}
      <directionalLight
        position={[7, 12, 9]}
        intensity={1.85}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
      />
      
      {/* Luz de preenchimento lateral suave (Fill Light suave azulada) */}
      <directionalLight
        position={[-8, 4, 6]}
        intensity={0.65}
        color="#BAE6FD"
      />
      
      {/* Luz de recorte posterior superior (Rim Light 1) para destacar silhueta do crânio */}
      <directionalLight
        position={[-4, 8, -10]}
        intensity={1.35}
        color="#38BDF8"
      />

      {/* Luz de recorte posterior inferior (Rim Light 2) para destacar ângulo da mandíbula e masseter */}
      <directionalLight
        position={[6, -5, -8]}
        intensity={0.95}
        color="#0EA5E9"
      />
      
      {/* Luz pontual suave para iluminar a cavidade bucal e arcadas dentárias */}
      <pointLight position={[0, -0.5, 2.2]} intensity={0.8} color="#FFFBEB" distance={12} />
    </>
  );
};
