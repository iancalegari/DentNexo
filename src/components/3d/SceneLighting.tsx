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
      {/* Luz ambiente clínica balanceada e luminosa (garante visibilidade total sem áreas escuras) */}
      <ambientLight intensity={0.88} color="#FFFFFF" />

      {/* Iluminação hemisférica com céu marfim e solo suave */}
      <hemisphereLight
        args={['#FFFFFF', '#475569', 0.75]}
        position={[0, 30, 0]}
      />
      
      {/* Luz principal frontal superior (Key Light suave sem sombra excessiva) */}
      <directionalLight
        position={[10, 15, 12]}
        intensity={2.2}
        color="#FFFFFF"
        castShadow={false}
      />
      
      {/* Luz de preenchimento lateral esquerda */}
      <directionalLight
        position={[-12, 6, 10]}
        intensity={1.5}
        color="#F0F9FF"
      />

      {/* Luz frontal inferior (ilumina a mandíbula e dentes inferiores) */}
      <directionalLight
        position={[0, -8, 10]}
        intensity={1.0}
        color="#FFFFFF"
      />
      
      {/* Luz de recorte posterior superior para destacar a curvatura craniana */}
      <directionalLight
        position={[-6, 10, -12]}
        intensity={1.4}
        color="#E0F2FE"
      />

      {/* Luz de recorte lateral direita posterior */}
      <directionalLight
        position={[10, -4, -10]}
        intensity={1.1}
        color="#BAE6FD"
      />
      
      {/* Luz pontual direta nas arcadas e cavidade oral */}
      <pointLight position={[0, 0.5, 5.0]} intensity={1.2} color="#FFFBEB" distance={25} />
    </>
  );
};
