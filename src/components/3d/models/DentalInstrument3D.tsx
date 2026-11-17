import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DentalInstrument3DProps {
  instrumentId: string;
}

export const DentalInstrument3D: React.FC<DentalInstrument3DProps> = ({ instrumentId }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Animação sutil de flutuação / pulso de luz do fotopolimerizador
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.4) * 0.06;
    }
    if (lightRef.current && instrumentId === 'fotopolimerizador') {
      lightRef.current.intensity = 2.2 + Math.sin(t * 4.0) * 0.4;
    }
  });

  // Textura procedural de micro-losangos (Grid antiderrapante da caneta de alta rotação e instrumentais)
  const diamondGripTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fundo cinza metálico acetinado
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, 0, 128, 128);

      // Traçado fino em relevo de losangos (cross-hatch)
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2.0;

      for (let i = -128; i < 256; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 128, 128);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, 128);
        ctx.lineTo(i + 128, 0);
        ctx.stroke();
      }

      // Pontos centrais de relevo
      ctx.fillStyle = '#64748B';
      for (let x = 6; x < 128; x += 12) {
        for (let y = 6; y < 128; y += 12) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 6);
    return texture;
  }, []);

  // Textura Procedural para o Cabo LM Colors da Espátula de Titânio (Imagem 1)
  const lmColorsTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fundo preto fosco / silicone escuro
      ctx.fillStyle = '#18181B';
      ctx.fillRect(0, 0, 512, 128);

      // Texto pad-printed nítido em branco
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Linha 1: ESPÁTULA TITÂNIO Nº 3
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
      ctx.fillText('ESPÁTULA TITÂNIO Nº 3', 256, 46);

      // Linha 2: LM COLORS
      ctx.font = 'italic bold 21px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('LM COLORS', 256, 82);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Textura Procedural para a Placa de Vidro Golgran (Imagem 1)
  const golgranLogoTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fundo azul royal Golgran
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(0, 0, 256, 72);

      // Moldura interna branca sutil
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.strokeRect(5, 5, 246, 62);

      // Texto pad-printed nítido em branco
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GOLGRAN', 128, 36);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Textura Procedural para a Caixa de Lençol de Borracha Microdont (Imagem 1)
  const rubberDamBoxTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fundo branco da caixa
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 512, 512);

      // Faixa diagonal inferior azul marinho
      ctx.fillStyle = '#1E3A8A';
      ctx.beginPath();
      ctx.moveTo(0, 410);
      ctx.lineTo(512, 330);
      ctx.lineTo(512, 512);
      ctx.lineTo(0, 512);
      ctx.closePath();
      ctx.fill();

      // Carimbo circular "MÉDIO | NEUTRO" no canto superior direito
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(430, 80, 48, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#1E3A8A';
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MÉDIO', 430, 85);


      // Texto Principal: LENÇOL DE BORRACHA
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1E3A8A';
      ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
      ctx.fillText('LENÇOL DE', 38, 96);
      ctx.font = 'bold 44px "Segoe UI", Arial, sans-serif';
      ctx.fillText('BORRACHA', 38, 144);

      // Subtítulo: RUBBER DAM | GOMA DIQUE
      ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('GOMA DIQUE', 40, 180);

      // Chamada: ALTA RESISTÊNCIA!
      ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#1D4ED8';
      ctx.fillText('ALTA RESISTÊNCIA!', 40, 226);

      // Quantidade: 26 UNIDADES
      ctx.font = 'bold 62px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#1E3A8A';
      ctx.fillText('26', 130, 300);
      ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
      ctx.fillText('UNIDADES / UNITS', 80, 330);

      // Rodapé: @Dentnexo | dentnexo.com.br
      ctx.font = '16px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#e8ecf8ff';
      ctx.fillText('@DENTNEXO •  dentnexo.com.br', 95, 485);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Textura Procedural para a Gravação a Laser PRATA da Sonda Periodontal (Imagem 1)
  const prataLogoTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fundo em aço acetinado contínuo
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, 0, 512, 128);

      // Marcação a laser escura PRATA em ambas as faces (360° uniforme)
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PRATA', 128, 64);
      ctx.fillText('PRATA', 384, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Textura Procedural para a Gravação Laser Colors da Sonda Exploradora Nº 5 (Imagem 1)
  const sonda5LogoTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fundo em azul anodizado idêntico ao cabo
      ctx.fillStyle = '#4e5568ff';
      ctx.fillRect(0, 0, 512, 128);

      // Logotipo e texto pad-printed / laser em branco
      ctx.fillStyle = '#ffffffff';
      ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✚ Colors', 256, 36);

      ctx.font = 'italic bold 26px "Segoe UI", Arial, sans-serif';
      ctx.fillText('Sonda Exploradora Nº 05', 256, 74);

      ctx.font = '18px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#BFDBFE';
      ctx.fillText('Aço Inox  •  Lote 23384', 256, 106);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Geometria Paramétrica Curvada da Folha de Dique de Borracha (Imagem 1)
  const undulatingDamGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.35, 2.35, 32, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Curvatura suave e elegante de folha de látex (amplitude controlada sem clipping)
      const u = x / 1.17;
      const v = y / 1.17;
      const z = Math.sin(u * 1.8) * 0.10 + Math.cos(v * 1.6) * 0.07 + (u * v) * 0.08;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Materiais Procedurais Odontológicos de Alta Fidelidade (Super leves, 0 KB de download)
  const materials = useMemo(() => {
    // 1. Aço Inoxidável Cirúrgico Polido (Brilhante e reflexivo, sem escurecimento de sombra)
    const surgicalSteel = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      metalness: 0.65,
      roughness: 0.22,
    });

    // 2. Aço Escovado / Cabo Recartilhado Antiderrapante
    const knurledSteel = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      metalness: 0.55,
      roughness: 0.38,
    });

    // 2b. Alumínio Acetinado Odontológico (Corpo liso prateado da turbina Gnatus)
    const handpieceSilver = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      metalness: 0.58,
      roughness: 0.24,
    });

    // 2c. Empunhadura Recartilhada com Textura de Losangos da Turbina
    const handpieceGrip = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      metalness: 0.52,
      roughness: 0.34,
      bumpMap: diamondGripTexture || undefined,
      bumpScale: 0.04,
    });

    // 2d. Conector Rosqueado Escuro (Base Borden/Midwest)
    const darkConnector = new THREE.MeshStandardMaterial({
      color: '#334155',
      metalness: 0.68,
      roughness: 0.38,
    });

    // 2e. Haste de Broca FG Polida Espelhada
    const burSteel = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      metalness: 0.85,
      roughness: 0.12,
    });

    // 2f. Guia Óptica / LED Frontal da Caneta
    const ledOptic = new THREE.MeshStandardMaterial({
      color: '#E0F2FE',
      emissive: '#38BDF8',
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });

    // 2g. Anel Azul de Transmissão Direta 1:1 (Contra-Ângulo Schuster T10)
    const blueRing = new THREE.MeshStandardMaterial({
      color: '#0284C7',
      metalness: 0.65,
      roughness: 0.28,
      emissive: '#0369A1',
      emissiveIntensity: 0.25,
    });

    // 2h. Escudo Protetor Ocular Laranja Anti-UV do Fotopolimerizador (Imagem 1)
    const orangeShield = new THREE.MeshStandardMaterial({
      color: '#FB923C',
      transparent: true,
      opacity: 0.78,
      roughness: 0.12,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // 2i. Capa/Ponteira de Silicone Vermelha Protetora da Fibra Óptica (Imagem 1)
    const redSiliconeTip = new THREE.MeshStandardMaterial({
      color: '#EF4444',
      roughness: 0.55,
      metalness: 0.04,
    });

    // 2j. Condutor de Fibra Óptica Preto Brilhante da Ponteira (Imagem 1)
    const fiberOpticBlack = new THREE.MeshStandardMaterial({
      color: '#0F172A',
      roughness: 0.18,
      metalness: 0.25,
    });

    // 2k. Botões Azuis de Controle (P, M, T)
    const controlButtonBlue = new THREE.MeshStandardMaterial({
      color: '#2563EB',
      roughness: 0.35,
      metalness: 0.12,
    });

    // 2l. Base do Berço de Carregamento por Indução
    const chargerBaseWhite = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      roughness: 0.38,
      metalness: 0.08,
    });

    // 2m. Alumínio Anodizado Azul Royal (Cabo dos Instrumentais Colors / SteelMax)
    const blueHandle = new THREE.MeshStandardMaterial({
      color: '#1D4ED8',
      metalness: 0.35,
      roughness: 0.32,
      emissive: '#1E3A8A',
      emissiveIntensity: 0.12,
      side: THREE.DoubleSide,
    });

    // 2n. Cabo Preto Anodizado do Espelho Bucal (Imagem 1)
    const blackAnodizedSmooth = new THREE.MeshStandardMaterial({
      color: '#18181B',
      metalness: 0.35,
      roughness: 0.38,
    });

    // 2o. Empunhadura Recartilhada com Textura Diamantada do Espelho Bucal (Imagem 1)
    const blackAnodizedGrip = new THREE.MeshStandardMaterial({
      color: '#27272A',
      metalness: 0.42,
      roughness: 0.44,
      bumpMap: diamondGripTexture || undefined,
      bumpScale: 0.05,
    });

    // 2p. Cabo Recartilhado e Gravação Laser PRATA da Sonda Periodontal (Imagem 1)
    const prataHandleLabel = new THREE.MeshStandardMaterial({
      map: prataLogoTexture,
      roughness: 0.32,
      metalness: 0.58,
    });

    const prataGripSteel = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      metalness: 0.62,
      roughness: 0.30,
      bumpMap: diamondGripTexture || undefined,
      bumpScale: 0.05,
    });

    // 2q. Rótulo Laser Colors da Sonda Exploradora Nº 5 (Imagem 1)
    const sonda5HandleLabel = new THREE.MeshStandardMaterial({
      map: sonda5LogoTexture,
      roughness: 0.35,
      metalness: 0.20,
      side: THREE.DoubleSide,
    });

    // 3. Nitreto de Titânio Dourado Antiaderente (Espátula de Resina - Imagem 1)
    const titaniumGold = new THREE.MeshStandardMaterial({
      color: '#EAB308',
      metalness: 0.88,
      roughness: 0.18,
      emissive: '#854D0E',
      emissiveIntensity: 0.22,
    });

    // 3b. Silicone Preto Fosco Ergonômico do Cabo (LM Colors - Imagem 1)
    const blackSiliconeGrip = new THREE.MeshStandardMaterial({
      color: '#18181B',
      roughness: 0.65,
      metalness: 0.04,
    });

    // 3c. Rotulagem Pad-Printed da Espátula Titânio Nº 3 LM Colors
    const lmColorsLabel = new THREE.MeshStandardMaterial({
      map: lmColorsTexture,
      roughness: 0.58,
      metalness: 0.04,
    });

    // 3d. Luva de Silicone Turquesa / Tiffany da Espátula de Resina (Imagem 1)
    const turquoiseSilicone = new THREE.MeshStandardMaterial({
      color: '#06B6D4',
      roughness: 0.55,
      metalness: 0.05,
    });

    // 3e. Luva de Silicone Branca da Espátula de Resina (Imagem 1)
    const whiteSilicone = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      roughness: 0.55,
      metalness: 0.04,
    });

    // 4. Espelho de Primeiro Plano (Front Surface Mirror)
    const mirrorGlass = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      metalness: 0.98,
      roughness: 0.02,
    });

    // 5. LED Azul Fotopolimerizador (460 nm)
    const blueLed = new THREE.MeshStandardMaterial({
      color: '#38BDF8',
      emissive: '#0284C7',
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });

    // 6. Feixe de Luz Azul Cônico
    const blueBeam = new THREE.MeshStandardMaterial({
      color: '#38BDF8',
      transparent: true,
      opacity: 0.32,
      roughness: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // 7. Resina Composta (A2 Universal)
    const compositeResin = new THREE.MeshStandardMaterial({
      color: '#F4E7D3',
      roughness: 0.35,
      metalness: 0.04,
    });

    // 8. Gel Ácido Fosfórico a 37% (Azul Cobalto Tixotrópico)
    const phosphoricGel = new THREE.MeshStandardMaterial({
      color: '#0284C7',
      emissive: '#0369A1',
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.85,
      roughness: 0.15,
    });

    // 9. Seringa Transparente Graduada (Polipropileno Médico Cristal)
    const clearSyringe = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      transparent: true,
      opacity: 0.38,
      roughness: 0.12,
      metalness: 0.08,
      depthWrite: false,
    });

    // 9b. Tampa Luer-Lock Estriada Translúcida (Imagem 1)
    const frostedCap = new THREE.MeshStandardMaterial({
      color: '#E0F2FE',
      transparent: true,
      opacity: 0.72,
      roughness: 0.28,
      metalness: 0.05,
    });

    // 10. Plástico Preto Fotoprotetor UV (Seringa de Resina SDI Wave da Imagem 1)
    const uvBlackPlastic = new THREE.MeshStandardMaterial({
      color: '#0F172A',
      roughness: 0.22,
      metalness: 0.18,
    });

    // 10b. Rótulo Azul SDI Wave da Seringa (Imagem 1)
    const resinLabelBlue = new THREE.MeshStandardMaterial({
      color: '#2563EB',
      roughness: 0.25,
      metalness: 0.10,
    });

    // 10c. Faixa Branca do Rótulo da Seringa (Imagem 1)
    const resinLabelWhite = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      roughness: 0.25,
      metalness: 0.05,
    });

    // 10d. Agulha Metálica Curva de Aplicação Precisa
    const needleSteel = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      metalness: 0.88,
      roughness: 0.14,
    });

    // 10e. Laranja Vibrante FGM Ambar (Frasco de Adesivo Odontológico da Imagem 1)
    const ambarOrange = new THREE.MeshStandardMaterial({
      color: '#EA580C',
      roughness: 0.28,
      metalness: 0.06,
    });

    // 11. Frasco Âmbar de Adesivo
    const amberGlass = new THREE.MeshStandardMaterial({
      color: '#78350F',
      transparent: true,
      opacity: 0.86,
      roughness: 0.22,
    });

    // 12. Placa de Vidro Maciça Espessa com Bisel (Imagem 1)
    const glassSlab = new THREE.MeshStandardMaterial({
      color: '#F0FDFA',
      transparent: true,
      opacity: 0.55,
      roughness: 0.04,
      metalness: 0.08,
    });

    // 12b. Borda Verde-Esmeralda do Vidro Lapidado Biselado (Imagem 1)
    const glassEdge = new THREE.MeshStandardMaterial({
      color: '#0D9488',
      transparent: true,
      opacity: 0.72,
      roughness: 0.08,
      metalness: 0.12,
    });

    // 12c. Rótulo Golgran da Placa de Vidro
    const golgranLabel = new THREE.MeshStandardMaterial({
      map: golgranLogoTexture,
      roughness: 0.25,
      metalness: 0.08,
    });

    // 12d. Pó de Cimento Odontológico para Manipulação (Imagem 1)
    const cementPowder = new THREE.MeshStandardMaterial({
      color: '#FEF9C3',
      roughness: 0.95,
      metalness: 0.02,
    });

    // 12e. Gota de Líquido Viscoso para Manipulação (Imagem 1)
    const liquidDrop = new THREE.MeshStandardMaterial({
      color: '#FEF08A',
      transparent: true,
      opacity: 0.68,
      roughness: 0.04,
      metalness: 0.12,
    });

    // 13. Lençol de Borracha Azul Real / Dique (Imagem 1)
    const rubberDam = new THREE.MeshStandardMaterial({
      color: '#3B82F6',
      roughness: 0.58,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    // 13b. Caixa de Embalagem do Lençol de Borracha Microdont
    const rubberDamBoxFace = new THREE.MeshStandardMaterial({
      map: rubberDamBoxTexture,
      roughness: 0.38,
      metalness: 0.05,
    });

    const rubberDamBoxBlueSide = new THREE.MeshStandardMaterial({
      color: '#1E3A8A',
      roughness: 0.45,
      metalness: 0.05,
    });

    // 14. Faixas Pretas de Medição da Sonda
    const blackBands = new THREE.MeshStandardMaterial({
      color: '#0F172A',
      roughness: 0.6,
      metalness: 0.1,
    });

    // 15. Diamante Sinterizado / Eletrodepositado das Brocas Esféricas (Imagem 1)
    const diamondHead = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      roughness: 0.62,
      metalness: 0.58,
    });

    return {
      surgicalSteel,
      knurledSteel,
      handpieceSilver,
      handpieceGrip,
      darkConnector,
      burSteel,
      ledOptic,
      blueRing,
      orangeShield,
      redSiliconeTip,
      fiberOpticBlack,
      controlButtonBlue,
      chargerBaseWhite,
      blueHandle,
      blackAnodizedSmooth,
      blackAnodizedGrip,
      prataHandleLabel,
      prataGripSteel,
      sonda5HandleLabel,
      titaniumGold,
      blackSiliconeGrip,
      lmColorsLabel,
      turquoiseSilicone,
      whiteSilicone,
      mirrorGlass,
      blueLed,
      blueBeam,
      compositeResin,
      phosphoricGel,
      clearSyringe,
      frostedCap,
      uvBlackPlastic,
      resinLabelBlue,
      resinLabelWhite,
      needleSteel,
      ambarOrange,
      amberGlass,
      glassSlab,
      glassEdge,
      golgranLabel,
      cementPowder,
      liquidDrop,
      rubberDam,
      rubberDamBoxFace,
      rubberDamBoxBlueSide,
      blackBands,
      diamondHead,
    };
  }, []);

  // Geometria Procedural Fiel do Grampo de Isolamento nº 206 (Mandíbulas, Asas, Furos e Arco)
  const clamp206Geometries = useMemo(() => {
    // 1. Mandíbula / Asa Esquerda com Furo da Pinça
    const leftShape = new THREE.Shape();
    leftShape.moveTo(-0.52, 0.45);
    leftShape.bezierCurveTo(-0.48, 0.32, -0.45, 0.22, -0.46, 0.16);
    // Asa lateral arredondada (lateral wing)
    leftShape.bezierCurveTo(-0.62, 0.10, -0.68, -0.02, -0.68, -0.14);
    leftShape.bezierCurveTo(-0.68, -0.26, -0.58, -0.36, -0.48, -0.36);
    // Extensão anterior (anterior wing)
    leftShape.bezierCurveTo(-0.46, -0.50, -0.42, -0.68, -0.32, -0.82);
    leftShape.bezierCurveTo(-0.25, -0.90, -0.17, -0.84, -0.18, -0.72);
    leftShape.bezierCurveTo(-0.20, -0.56, -0.22, -0.46, -0.15, -0.36); // Bico cervical inferior
    // Recorte cervical circular do colo do dente
    leftShape.bezierCurveTo(-0.22, -0.22, -0.28, -0.08, -0.28, 0.02);
    leftShape.bezierCurveTo(-0.28, 0.14, -0.22, 0.24, -0.15, 0.32); // Bico cervical superior
    // Conexão com o arco posterior
    leftShape.bezierCurveTo(-0.26, 0.40, -0.40, 0.44, -0.52, 0.45);

    // Orifício para ponta da pinça porta-grampos de Palmer
    const leftHole = new THREE.Path();
    leftHole.absarc(-0.44, -0.10, 0.075, 0, Math.PI * 2, true);
    leftShape.holes.push(leftHole);

    // 2. Mandíbula / Asa Direita com Furo da Pinça (Espelhamento simétrico de X)
    const rightShape = new THREE.Shape();
    rightShape.moveTo(0.52, 0.45);
    rightShape.bezierCurveTo(0.48, 0.32, 0.45, 0.22, 0.46, 0.16);
    rightShape.bezierCurveTo(0.62, 0.10, 0.68, -0.02, 0.68, -0.14);
    rightShape.bezierCurveTo(0.68, -0.26, 0.58, -0.36, 0.48, -0.36);
    rightShape.bezierCurveTo(0.46, -0.50, 0.42, -0.68, 0.32, -0.82);
    rightShape.bezierCurveTo(0.25, -0.90, 0.17, -0.84, 0.18, -0.72);
    rightShape.bezierCurveTo(0.20, -0.56, 0.22, -0.46, 0.15, -0.36);
    rightShape.bezierCurveTo(0.22, -0.22, 0.28, -0.08, 0.28, 0.02);
    rightShape.bezierCurveTo(0.28, 0.14, 0.22, 0.24, 0.15, 0.32);
    rightShape.bezierCurveTo(0.26, 0.40, 0.40, 0.44, 0.52, 0.45);

    const rightHole = new THREE.Path();
    rightHole.absarc(0.44, -0.10, 0.075, 0, Math.PI * 2, true);
    rightShape.holes.push(rightHole);

    const jawExtrudeSettings = {
      depth: 0.035,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    };

    const leftJawGeo = new THREE.ExtrudeGeometry(leftShape, jawExtrudeSettings);
    const rightJawGeo = new THREE.ExtrudeGeometry(rightShape, jawExtrudeSettings);

    // 3. Arco Superior de Tensão em Fita Curva (Bow Ribbon da Imagem 1)
    const bowShape = new THREE.Shape();
    bowShape.moveTo(-0.52, 0.42);
    bowShape.bezierCurveTo(-0.50, 0.70, -0.32, 0.88, 0, 0.88);
    bowShape.bezierCurveTo(0.32, 0.88, 0.50, 0.70, 0.52, 0.42);
    // Borda externa do arco
    bowShape.lineTo(0.59, 0.45);
    bowShape.bezierCurveTo(0.57, 0.78, 0.37, 0.99, 0, 0.99);
    bowShape.bezierCurveTo(-0.37, 0.99, -0.57, 0.78, -0.59, 0.45);
    bowShape.closePath();

    const bowExtrudeSettings = {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    };

    const bowGeo = new THREE.ExtrudeGeometry(bowShape, bowExtrudeSettings);

    return { leftJawGeo, rightJawGeo, bowGeo };
  }, []);

  // Geometria Procedural Fiel do Perfurador de Ainsworth (Mandíbulas, Garganta em U e Cabos Curvos da Imagem 1)
  const ainsworthGeometries = useMemo(() => {
    const plierExtrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    };

    // 1. Braço Superior: Mandíbula Superior + Cabo Curvo Superior
    const upperArmShape = new THREE.Shape();
    upperArmShape.moveTo(-1.60, 0.28);
    upperArmShape.lineTo(-1.15, 0.28);
    upperArmShape.bezierCurveTo(-0.85, 0.28, -0.65, 0.22, -0.20, 0.18);
    upperArmShape.lineTo(0.20, 0.18);
    // Cabo superior anatômico (curva para cima e retorno)
    upperArmShape.bezierCurveTo(0.60, 0.35, 1.10, 0.55, 1.55, 0.52);
    upperArmShape.bezierCurveTo(1.75, 0.50, 1.88, 0.46, 1.88, 0.40);
    upperArmShape.bezierCurveTo(1.88, 0.34, 1.70, 0.38, 1.50, 0.42);
    upperArmShape.bezierCurveTo(1.05, 0.45, 0.60, 0.25, 0.20, 0.08);
    upperArmShape.lineTo(-0.20, 0.08);
    upperArmShape.bezierCurveTo(-0.55, 0.12, -0.80, 0.18, -1.15, 0.18);
    upperArmShape.lineTo(-1.60, 0.18);
    upperArmShape.closePath();

    // 2. Braço Inferior: Mandíbula Inferior + Cabo Curvo Inferior
    const lowerArmShape = new THREE.Shape();
    lowerArmShape.moveTo(-1.60, -0.18);
    lowerArmShape.lineTo(-1.15, -0.18);
    lowerArmShape.bezierCurveTo(-0.80, -0.18, -0.55, -0.12, -0.20, -0.08);
    lowerArmShape.lineTo(0.20, -0.08);
    // Cabo inferior anatômico (curva para baixo e apoio de dedos)
    lowerArmShape.bezierCurveTo(0.60, -0.25, 1.05, -0.45, 1.50, -0.42);
    lowerArmShape.bezierCurveTo(1.70, -0.38, 1.88, -0.34, 1.88, -0.40);
    lowerArmShape.bezierCurveTo(1.88, -0.46, 1.75, -0.50, 1.55, -0.52);
    lowerArmShape.bezierCurveTo(1.10, -0.55, 0.60, -0.35, 0.20, -0.18);
    lowerArmShape.lineTo(-0.20, -0.18);
    lowerArmShape.bezierCurveTo(-0.65, -0.22, -0.85, -0.28, -1.15, -0.28);
    lowerArmShape.lineTo(-1.60, -0.28);
    lowerArmShape.closePath();

    const upperArmGeo = new THREE.ExtrudeGeometry(upperArmShape, plierExtrudeSettings);
    const lowerArmGeo = new THREE.ExtrudeGeometry(lowerArmShape, plierExtrudeSettings);

    return { upperArmGeo, lowerArmGeo };
  }, []);

  // Geometria Procedural Fiel da Pinça Porta-Grampos de Palmer (Braços Contínuos, Bicos Sinuosos e Alças Circulares da Imagem 2)
  const palmerGeometries = useMemo(() => {
    const palmerExtrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    };

    // 1. Braço Esquerdo (Bico Sinuoso + Haste + Alça Circular Aberta)
    const leftArmShape = new THREE.Shape();
    leftArmShape.moveTo(-0.14, 2.05);
    leftArmShape.bezierCurveTo(-0.18, 1.85, -0.24, 1.55, -0.23, 1.15);
    leftArmShape.bezierCurveTo(-0.22, 0.75, -0.15, 0.45, -0.07, 0.18);
    leftArmShape.lineTo(-0.06, 0.05);
    leftArmShape.lineTo(-0.08, -0.72);
    leftArmShape.bezierCurveTo(-0.18, -0.90, -0.32, -1.05, -0.48, -1.22);
    leftArmShape.bezierCurveTo(-0.72, -1.48, -0.70, -1.82, -0.52, -2.00);
    leftArmShape.bezierCurveTo(-0.38, -2.08, -0.24, -2.04, -0.16, -1.96);
    leftArmShape.bezierCurveTo(-0.12, -2.00, -0.10, -2.06, -0.14, -2.10);
    leftArmShape.bezierCurveTo(-0.26, -2.18, -0.46, -2.18, -0.65, -2.06);
    leftArmShape.bezierCurveTo(-0.85, -1.84, -0.85, -1.45, -0.60, -1.15);
    leftArmShape.bezierCurveTo(-0.45, -0.95, -0.28, -0.84, -0.18, -0.72);
    leftArmShape.lineTo(-0.16, -0.10);
    leftArmShape.bezierCurveTo(-0.18, 0.05, -0.15, 0.18, -0.12, 0.25);
    leftArmShape.bezierCurveTo(-0.22, 0.65, -0.32, 1.15, -0.30, 1.55);
    leftArmShape.bezierCurveTo(-0.28, 1.85, -0.20, 2.02, -0.14, 2.05);
    leftArmShape.closePath();

    // 2. Braço Direito (Espelhamento simétrico de X)
    const rightArmShape = new THREE.Shape();
    rightArmShape.moveTo(0.14, 2.05);
    rightArmShape.bezierCurveTo(0.18, 1.85, 0.24, 1.55, 0.23, 1.15);
    rightArmShape.bezierCurveTo(0.22, 0.75, 0.15, 0.45, 0.07, 0.18);
    rightArmShape.lineTo(0.06, 0.05);
    rightArmShape.lineTo(0.08, -0.72);
    rightArmShape.bezierCurveTo(0.18, -0.90, 0.32, -1.05, 0.48, -1.22);
    rightArmShape.bezierCurveTo(0.72, -1.48, 0.70, -1.82, 0.52, -2.00);
    rightArmShape.bezierCurveTo(0.38, -2.08, 0.24, -2.04, 0.16, -1.96);
    rightArmShape.bezierCurveTo(0.12, -2.00, 0.10, -2.06, 0.14, -2.10);
    rightArmShape.bezierCurveTo(0.26, -2.18, 0.46, -2.18, 0.65, -2.06);
    rightArmShape.bezierCurveTo(0.85, -1.84, 0.85, -1.45, 0.60, -1.15);
    rightArmShape.bezierCurveTo(0.45, -0.95, 0.28, -0.84, 0.18, -0.72);
    rightArmShape.lineTo(0.16, -0.10);
    rightArmShape.bezierCurveTo(0.18, 0.05, 0.15, 0.18, 0.12, 0.25);
    rightArmShape.bezierCurveTo(0.22, 0.65, 0.32, 1.15, 0.30, 1.55);
    rightArmShape.bezierCurveTo(0.28, 1.85, 0.20, 2.02, 0.14, 2.05);
    rightArmShape.closePath();

    const leftArmGeo = new THREE.ExtrudeGeometry(leftArmShape, palmerExtrudeSettings);
    const rightArmGeo = new THREE.ExtrudeGeometry(rightArmShape, palmerExtrudeSettings);

    return { leftArmGeo, rightArmGeo };
  }, []);

  // Geometria Procedural Fiel da Pinça Clínica Odontológica (Pontas Sobrepostas - Fiel ao Desenho em Vermelho)
  const clinicalPlierGeometry = useMemo(() => {
    const plierExtrudeSettings = {
      depth: 0.034,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.005,
      bevelThickness: 0.005,
    };

    const shape = new THREE.Shape();
    // 1. Base espatulada arredondada (cabo comum soldado da pinça)
    shape.moveTo(-0.065, -1.65);
    shape.bezierCurveTo(-0.065, -1.82, 0.065, -1.82, 0.065, -1.65);
    // 2. Base sólida unificada
    shape.lineTo(0.065, -1.25);
    // 3. Braço Inferior (haste inferior da pinça)
    shape.lineTo(0.11, -0.30);
    shape.lineTo(0.14, 0.45);
    shape.lineTo(0.15, 1.12);
    // Curva do cotovelo inferior
    shape.bezierCurveTo(0.16, 1.26, 0.28, 1.37, 0.45, 1.40);
    // Ponta afilada do bico inferior
    shape.bezierCurveTo(0.465, 1.40, 0.465, 1.385, 0.45, 1.385);
    // Borda interna do bico inferior
    shape.bezierCurveTo(0.28, 1.35, 0.17, 1.24, 0.115, 1.10);
    // Borda interna do braço inferior
    shape.lineTo(0.075, 0.45);
    shape.lineTo(0.035, -0.30);
    // Fundo do V (abertura central das lâminas flexíveis)
    shape.lineTo(0.0, -1.25);
    // Borda interna do braço superior
    shape.lineTo(-0.035, -0.30);
    shape.lineTo(-0.075, 0.45);
    shape.lineTo(-0.115, 1.10);
    // Borda interna do bico superior que estende até coincidir exatamente sobre o bico inferior (Fiel ao Traço Vermelho)
    shape.bezierCurveTo(-0.06, 1.26, 0.18, 1.41, 0.45, 1.44);
    // Ponta afilada do bico superior (diretamente acima da ponta inferior: mesmo X = 0.45!)
    shape.bezierCurveTo(0.465, 1.44, 0.465, 1.455, 0.45, 1.455);
    // Borda externa do bico superior
    shape.bezierCurveTo(0.18, 1.455, -0.08, 1.30, -0.15, 1.12);
    // Braço Superior (haste superior da pinça)
    shape.lineTo(-0.14, 0.45);
    shape.lineTo(-0.11, -0.30);
    shape.lineTo(-0.065, -1.25);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, plierExtrudeSettings);
  }, []);

  // Renderizador específico por material
  const renderInstrumentMesh = () => {
    switch (instrumentId) {
      // 1. ESPELHO BUCAL PLANO (Modelo Fiel com Cabo Preto Recartilhado e Espelho nº 5 da Imagem 1)
      case 'espelho_bucal':
        return (
          <group rotation={[0.14, 0.22, -0.68]}>
            {/* 1. CABO BIPOLAR PRETO ANODIZADO COM EMPUNHADURA DIAMANTADA (Imagem 1) */}
            {/* 1a. Extremidade posterior arredondada do cabo */}
            <mesh position={[0, -1.80, 0]} material={materials.blackAnodizedSmooth}>
              <sphereGeometry args={[0.078, 20, 16]} />
            </mesh>

            {/* 1b. Seção inferior do cabo em alumínio anodizado preto acetinado */}
            <mesh position={[0, -1.25, 0]} material={materials.blackAnodizedSmooth}>
              <cylinderGeometry args={[0.078, 0.078, 1.1, 24]} />
            </mesh>

            {/* 1c. Empunhadura com recartilhado diamantado antiderrapante em relevo */}
            <mesh position={[0, -0.125, 0]} material={materials.blackAnodizedGrip}>
              <cylinderGeometry args={[0.081, 0.081, 1.15, 24]} />
            </mesh>

            {/* 1d. Colar superior cônico de transição */}
            <mesh position={[0, 0.55, 0]} material={materials.blackAnodizedSmooth}>
              <cylinderGeometry args={[0.052, 0.081, 0.20, 24]} />
            </mesh>

            {/* 1e. Bocal rosqueado metálico (encaixe Chuck do espelho) */}
            <mesh position={[0, 0.66, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.042, 0.050, 0.04, 20]} />
            </mesh>

            {/* 2. HASTE METÁLICA CIRÚRGICA FINA (Imagem 1) */}
            {/* Haste reta longa em aço inox polido brilhante */}
            <mesh position={[0, 1.08, 0]} material={materials.burSteel}>
              <cylinderGeometry args={[0.022, 0.022, 0.82, 16]} />
            </mesh>

            {/* Dobra angulada em contra-ângulo (~40°) conectando ao dorso do aro */}
            <mesh position={[0, 1.48, 0.04]} rotation={[0.65, 0, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.024, 0.024, 0.18, 16]} />
            </mesh>

            {/* Solda / Encaixe posterior de suporte do aro */}
            <mesh position={[0, 1.54, 0.12]} rotation={[0.65, 0, 0]} material={materials.surgicalSteel}>
              <sphereGeometry args={[0.036, 16, 16]} />
            </mesh>

            {/* 3. CABEÇA DO ESPELHO BUCAL PLANO Nº 5 (Imagem 1) */}
            <group position={[0, 1.60, 0.18]} rotation={[0.65, 0, 0]}>
              {/* 3a. Placa posterior metálica de reforço do espelho */}
              <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.48, 0.48, 0.018, 36]} />
              </mesh>

              {/* 3b. Vidro espelhado de primeiro plano (Front Surface Rhodium Mirror) */}
              <mesh position={[0, 0, 0.006]} material={materials.mirrorGlass}>
                <circleGeometry args={[0.465, 36]} />
              </mesh>
            </group>
          </group>
        );

      // 2. SONDA EXPLORADORA Nº 5 (Fiel à Imagem 1: Modelo Colors com Cabo Azul Anodizado e Ponta Shepherd's Hook)
      case 'sonda_exploradora':
        return (
          <group rotation={[0.12, 0.22, 0.48]}>
            {/* 1. CABO ERGONÔMICO COLORS EM ALUMÍNIO ANODIZADO AZUL ROYAL */}
            {/* 1a. Tubo estrutural contínuo de ponta a ponta do cabo (Solidez 100% contínua) */}
            <mesh position={[0, 0, 0]} material={materials.blueHandle}>
              <cylinderGeometry args={[0.138, 0.138, 2.05, 32]} />
            </mesh>

            {/* 1b. Alma metálica interna cirúrgica de ancoragem mecânica */}
            <mesh position={[0, 0, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.130, 0.130, 2.25, 24]} />
            </mesh>

            {/* 1c. Gravação a laser branca 360° "✚ Colors / Sonda Exploradora Nº 05 / Aço Inox" */}
            <mesh position={[0, 0, 0]} material={materials.sonda5HandleLabel}>
              <cylinderGeometry args={[0.139, 0.139, 0.45, 32]} />
            </mesh>

            {/* 1d. Frisos metálicos cirúrgicos que emolduram a zona central do rótulo */}
            <mesh position={[0, 0.23, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.140, 0.140, 0.012, 32]} />
            </mesh>
            <mesh position={[0, -0.23, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.140, 0.140, 0.012, 32]} />
            </mesh>

            {/* 1e. Zona ergonômica superior com 8 ranhuras esculpidas antiderrapantes */}
            {[0.48, 0.55, 0.62, 0.69, 0.76, 0.83, 0.90, 0.97].map((yGrip, idx) => (
              <mesh key={`s5-top-grip-${idx}`} position={[0, yGrip, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                <torusGeometry args={[0.139, 0.007, 8, 28]} />
              </mesh>
            ))}

            {/* 1f. Zona ergonômica inferior com 8 ranhuras esculpidas antiderrapantes */}
            {[-0.48, -0.55, -0.62, -0.69, -0.76, -0.83, -0.90, -0.97].map((yGrip, idx) => (
              <mesh key={`s5-bot-grip-${idx}`} position={[0, yGrip, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                <torusGeometry args={[0.139, 0.007, 8, 28]} />
              </mesh>
            ))}

            {/* 1g. Colares cônicos de transição do cabo azul */}
            <mesh position={[0, 1.12, 0]} material={materials.blueHandle}>
              <cylinderGeometry args={[0.048, 0.138, 0.20, 28]} />
            </mesh>
            <mesh position={[0, -1.12, 0]} material={materials.blueHandle}>
              <cylinderGeometry args={[0.138, 0.048, 0.20, 28]} />
            </mesh>

            {/* 1h. Mandris cilíndricos de fixação em aço cirúrgico polido */}
            <mesh position={[0, 1.23, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.038, 0.046, 0.04, 20]} />
            </mesh>
            <mesh position={[0, -1.23, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.046, 0.038, 0.04, 20]} />
            </mesh>

            {/* 2. PONTA ATIVA SUPERIOR: HASTE CONTRA-ANGULADA CLÁSSICA (Imagem 1) */}
            <group position={[0, 1.25, 0]}>
              {/* Haste reta inicial de saída do cabo */}
              <mesh position={[0, 0.12, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.016, 0.024, 0.24, 16]} />
              </mesh>
              {/* Primeira dobra contra-ângulo (~35° à esquerda) */}
              <group position={[0, 0.24, 0]} rotation={[0, 0, 0.62]}>
                <mesh material={materials.surgicalSteel}>
                  <sphereGeometry args={[0.016, 16, 16]} />
                </mesh>
                {/* Haste intermediária */}
                <mesh position={[0, 0.18, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.014, 0.016, 0.36, 16]} />
                </mesh>
                {/* Segunda dobra contra-ângulo (~85° à direita) */}
                <group position={[0, 0.36, 0]} rotation={[0, 0, -1.48]}>
                  <mesh material={materials.surgicalSteel}>
                    <sphereGeometry args={[0.014, 16, 16]} />
                  </mesh>
                  {/* Haste terminal cônica afilada */}
                  <mesh position={[0, 0.16, 0]} material={materials.surgicalSteel}>
                    <cylinderGeometry args={[0.008, 0.014, 0.32, 16]} />
                  </mesh>
                  {/* Ponta agulha exploradora afiada (Needle Point) */}
                  <mesh position={[0, 0.35, 0]} material={materials.surgicalSteel}>
                    <coneGeometry args={[0.008, 0.10, 16]} />
                  </mesh>
                </group>
              </group>
            </group>

            {/* 3. PONTA ATIVA INFERIOR: GANCHO EXPLORADOR SHEPHERD'S HOOK Nº 23 (Imagem 1) */}
            <group position={[0, -1.25, 0]}>
              {/* Haste reta inicial de saída do cabo */}
              <mesh position={[0, -0.14, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.024, 0.016, 0.28, 16]} />
              </mesh>
              {/* Primeira inclinação contra-posta (~40° à direita) */}
              <group position={[0, -0.28, 0]} rotation={[0, 0, -0.70]}>
                <mesh material={materials.surgicalSteel}>
                  <sphereGeometry args={[0.016, 16, 16]} />
                </mesh>
                {/* Haste intermediária oblíqua */}
                <mesh position={[0, -0.17, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.016, 0.014, 0.34, 16]} />
                </mesh>
                {/* Dobra contínua e arco semicircular em gancho de pastor (Shepherd's hook) */}
                <group position={[0, -0.34, 0]} rotation={[0, 0, 1.10]}>
                  <mesh material={materials.surgicalSteel}>
                    <sphereGeometry args={[0.016, 16, 16]} />
                  </mesh>
                  <mesh position={[0, -0.09, 0]} material={materials.surgicalSteel}>
                    <cylinderGeometry args={[0.014, 0.016, 0.18, 16]} />
                  </mesh>
                  {/* Curvatura ascendente do gancho */}
                  <group position={[0, -0.18, 0]} rotation={[0, 0, 0.92]}>
                    <mesh material={materials.surgicalSteel}>
                      <sphereGeometry args={[0.014, 16, 16]} />
                    </mesh>
                    <mesh position={[0, -0.09, 0]} material={materials.surgicalSteel}>
                      <cylinderGeometry args={[0.011, 0.014, 0.18, 16]} />
                    </mesh>
                    {/* Bico curvo terminal afilado com ponta em agulha exploradora voltada para cima */}
                    <group position={[0, -0.18, 0]} rotation={[0, 0, 0.68]}>
                      <mesh material={materials.surgicalSteel}>
                        <sphereGeometry args={[0.011, 16, 16]} />
                      </mesh>
                      <mesh position={[0, -0.08, 0]} rotation={[Math.PI, 0, 0]} material={materials.surgicalSteel}>
                        <coneGeometry args={[0.010, 0.16, 16]} />
                      </mesh>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        );

      // 3. PINÇA CLÍNICA ODONTOLÓGICA (Fiel à Imagem: Modelo CASSIFLEX com Pontas Sobrepostas)
      case 'pinca_clinica':
        return (
          <group rotation={[0.42, 0.18, -0.68]}>
            {/* 1. CORPO UNIFICADO DA PINÇA EM V COM BICOS SOBREPOSTOS (Fiel ao Traço Vermelho) */}
            <mesh
              geometry={clinicalPlierGeometry}
              position={[0, 0, -0.017]}
              material={materials.surgicalSteel}
            />

            {/* 2. SERRILHAS TRANSVERSAIS DE APOIO DIGITAL (Grip Pads das Duas Lâminas) */}
            {[-0.28, -0.22, -0.16, -0.10, -0.04, 0.02, 0.08, 0.14, 0.20, 0.26, 0.32, 0.38, 0.44].map((yPos, i) => {
              const xRight = 0.095 + (yPos + 0.28) * 0.045;
              const xLeft = -0.095 - (yPos + 0.28) * 0.045;
              return (
                <group key={`plier-flute-${i}`}>
                  {/* Ranhura na lâmina inferior */}
                  <mesh
                    position={[xRight, yPos, 0.018]}
                    rotation={[0, 0, -0.05]}
                    material={materials.knurledSteel}
                  >
                    <boxGeometry args={[0.042, 0.007, 0.003]} />
                  </mesh>
                  {/* Ranhura na lâmina superior */}
                  <mesh
                    position={[xLeft, yPos, 0.018]}
                    rotation={[0, 0, 0.05]}
                    material={materials.knurledSteel}
                  >
                    <boxGeometry args={[0.042, 0.007, 0.003]} />
                  </mesh>
                </group>
              );
            })}

            {/* 3. PINO GUIA CENTRAL DE ALINHAMENTO (Pino Guia do Traço Vermelho) */}
            <mesh position={[0, 0.50, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.008, 0.008, 0.22, 16]} />
            </mesh>

            {/* 4. GRAVAÇÃO A LASER NA BASE DA PINÇA "CASSIFLEX" (Imagem CASSIFLEX) */}
            <mesh position={[0, -1.48, 0.018]} material={materials.darkConnector}>
              <boxGeometry args={[0.075, 0.28, 0.002]} />
            </mesh>
          </group>
        );

      // 4. SONDA PERIODONTAL MILIMETRADA (Modelo Fiel PRATA da Imagem 1)
      case 'sonda_periodontal':
        return (
          <group rotation={[0.10, 0.15, -0.68]}>
            {/* 1. CABO CIRÚRGICO INTEIRIÇO PRATA (Corpo 100% Sólido e Contínuo, Sem Cortes ou Fendas) */}
            {/* 1a. Extremidade posterior arredondada maciça */}
            <mesh position={[0, -1.80, 0]} material={materials.surgicalSteel}>
              <sphereGeometry args={[0.070, 24, 16]} />
            </mesh>

            {/* 1b. Corpo principal de aço maciço ininterrupto de toda a extensão do cabo */}
            <mesh position={[0, -0.46, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.070, 0.070, 2.68, 32]} />
            </mesh>

            {/* 1c. Gravação a laser 360° da marca PRATA na base lisa do cabo */}
            <mesh position={[0, -1.45, 0]} material={materials.prataHandleLabel}>
              <cylinderGeometry args={[0.0705, 0.0705, 0.40, 32]} />
            </mesh>

            {/* 1d. Empunhadura longa recartilhada diamantada antiderrapante (3/4 do cabo) */}
            <mesh position={[0, -0.15, 0]} material={materials.prataGripSteel}>
              <cylinderGeometry args={[0.0706, 0.0706, 1.80, 32]} />
            </mesh>

            {/* 1e. Colar cônico sutil e elegante de transição */}
            <mesh position={[0, 0.88, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.022, 0.070, 0.28, 24]} />
            </mesh>

            {/* 2. HASTE CIRÚRGICA DELGADA EM CONTRA-ÂNGULO CAROLINA DO NORTE (Imagem 1) */}
            {/* 2a. Início reto fino da haste */}
            <mesh position={[0, 1.15, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.020, 0.022, 0.28, 16]} />
            </mesh>

            {/* 2b. Primeira inclinação suave a ~32° */}
            <mesh position={[0, 1.29, 0]} material={materials.surgicalSteel}>
              <sphereGeometry args={[0.020, 16, 16]} />
            </mesh>
            <mesh position={[0.12, 1.50, 0]} rotation={[0, 0, -0.56]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.019, 0.020, 0.44, 16]} />
            </mesh>

            {/* 2c. Cotovelo contra-ângulo acentuado (~108°) */}
            <mesh position={[0.24, 1.70, 0]} material={materials.surgicalSteel}>
              <sphereGeometry args={[0.020, 16, 16]} />
            </mesh>

            {/* 3. PONTA ATIVA MILIMETRADA CALIBRADA (Imagem 1) */}
            <group position={[0.24, 1.70, 0]} rotation={[0, 0, -1.88]}>
              {/* Corpo cônico da ponta ativa calibrada */}
              <mesh position={[0, 0.45, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.013, 0.019, 0.90, 16]} />
              </mesh>

              {/* Marcações Milimétricas Pretas Esmaltadas (Escala Carolina do Norte / UNC-15) */}
              {/* 1mm, 2mm, 3mm marcações em anéis finos pretos */}
              {[0.12, 0.20, 0.28].map((yRing, idx) => (
                <mesh key={`ring-${idx}`} position={[0, yRing, 0]} material={materials.blackBands}>
                  <cylinderGeometry args={[0.0185, 0.0185, 0.014, 16]} />
                </mesh>
              ))}

              {/* Faixa preta contínua de 4mm a 5mm */}
              <mesh position={[0, 0.38, 0]} material={materials.blackBands}>
                <cylinderGeometry args={[0.0175, 0.0175, 0.075, 16]} />
              </mesh>

              {/* 6mm, 7mm, 8mm anéis finos pretos */}
              {[0.48, 0.56, 0.64].map((yRing, idx) => (
                <mesh key={`ring2-${idx}`} position={[0, yRing, 0]} material={materials.blackBands}>
                  <cylinderGeometry args={[0.016, 0.016, 0.014, 16]} />
                </mesh>
              ))}

              {/* Faixa preta contínua de 9mm a 10mm */}
              <mesh position={[0, 0.74, 0]} material={materials.blackBands}>
                <cylinderGeometry args={[0.015, 0.015, 0.075, 16]} />
              </mesh>

              {/* 11mm, 12mm anéis finos pretos */}
              {[0.82, 0.88].map((yRing, idx) => (
                <mesh key={`ring3-${idx}`} position={[0, yRing, 0]} material={materials.blackBands}>
                  <cylinderGeometry args={[0.014, 0.014, 0.014, 16]} />
                </mesh>
              ))}

              {/* Ponta esférica atraumática (0.5 mm) */}
              <mesh position={[0, 0.90, 0]} material={materials.surgicalSteel}>
                <sphereGeometry args={[0.014, 16, 16]} />
              </mesh>
            </group>
          </group>
        );

      // 5. ESCAVADOR / COLHER DE DENTINA (Fiel à Imagem 1: Modelo SteelMax nº 11 ½ com Cabo Azul Anodizado Estriado)
      case 'colher_dentina':
        return (
          <group rotation={[0.12, 0.22, 0.45]}>
            <group position={[0, 0, 0]}>
              {/* 1. Cabo Central Ergonômico em Alumínio Anodizado Azul Royal (Imagem 1) */}
              <mesh position={[0, 0, 0]} material={materials.blueHandle}>
                <cylinderGeometry args={[0.138, 0.138, 2.30, 32]} />
              </mesh>

              {/* Rótulo e Logotipo Laser Branco Central "ESCAVADOR Nº 11 ½ STEELMAX" */}
              <mesh position={[0, 0, 0.140]} material={materials.resinLabelWhite}>
                <boxGeometry args={[0.07, 0.42, 0.005]} />
              </mesh>

              {/* 2. Duas Zonas de Ranhuras Circulares de Retenção Tátil (10 anéis em cada extremidade da foto) */}
              {/* Zona de estrias superior */}
              {[0.45, 0.51, 0.57, 0.63, 0.69, 0.75, 0.81, 0.87, 0.93, 0.99].map((ringY, idx) => (
                <mesh key={`top-grip-${idx}`} position={[0, ringY, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                  <torusGeometry args={[0.139, 0.005, 6, 24]} />
                </mesh>
              ))}
              {/* Zona de estrias inferior */}
              {[-0.45, -0.51, -0.57, -0.63, -0.69, -0.75, -0.81, -0.87, -0.93, -0.99].map((ringY, idx) => (
                <mesh key={`bot-grip-${idx}`} position={[0, ringY, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                  <torusGeometry args={[0.139, 0.005, 6, 24]} />
                </mesh>
              ))}

              {/* 3. Colares Cônicos Azuis de Transição para as Hastes Metálicas */}
              <mesh position={[0, 1.20, 0]} material={materials.blueHandle}>
                <cylinderGeometry args={[0.065, 0.138, 0.20, 24]} />
              </mesh>
              <mesh position={[0, -1.20, 0]} material={materials.blueHandle}>
                <cylinderGeometry args={[0.138, 0.065, 0.20, 24]} />
              </mesh>

              {/* 4. Extremidade Ativa Superior: Haste Cônica Reta e Colher Achatada (Fiel à Imagem 2) */}
              <group>
                {/* Haste cônica reta longa e uniforme (sem zigue-zagues) */}
                <mesh position={[0, 1.60, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.020, 0.056, 0.76, 24]} />
                </mesh>
                {/* Cotovelo suave da dobra terminal a ~85° */}
                <mesh position={[0, 1.98, 0]} material={materials.surgicalSteel}>
                  <sphereGeometry args={[0.021, 16, 16]} />
                </mesh>
                <mesh position={[-0.035, 2.01, 0]} rotation={[0, 0, 1.48]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.017, 0.021, 0.08, 16]} />
                </mesh>
                {/* Ponta em colher de dentina achatada em concha (Imagem 2) */}
                <mesh
                  position={[-0.085, 2.02, 0]}
                  rotation={[0, 0, 1.48]}
                  scale={[0.75, 0.22, 1.35]}
                  material={materials.surgicalSteel}
                >
                  <sphereGeometry args={[0.044, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                </mesh>
              </group>

              {/* 5. Extremidade Ativa Inferior: Haste Cônica Reta e Colher Achatada Espelhada (Fiel à Imagem 2) */}
              <group>
                {/* Haste cônica reta longa e uniforme */}
                <mesh position={[0, -1.60, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.056, 0.020, 0.76, 24]} />
                </mesh>
                {/* Cotovelo suave da dobra terminal a ~85° */}
                <mesh position={[0, -1.98, 0]} material={materials.surgicalSteel}>
                  <sphereGeometry args={[0.021, 16, 16]} />
                </mesh>
                <mesh position={[0.035, -2.01, 0]} rotation={[0, 0, 1.48]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.017, 0.021, 0.08, 16]} />
                </mesh>
                {/* Ponta em colher de dentina achatada em concha (Imagem 2) */}
                <mesh
                  position={[0.085, -2.02, 0]}
                  rotation={[0, 0, -1.66]}
                  scale={[0.75, 0.22, 1.35]}
                  material={materials.surgicalSteel}
                >
                  <sphereGeometry args={[0.044, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                </mesh>
              </group>
            </group>
          </group>
        );

      // 6. CANETA DE ALTA ROTAÇÃO (Fiel à Imagem de Referência: Modelo Ergonômico Gnatus/Push-Button)
      case 'alta_rotacao':
        return (
          <group rotation={[0.08, -0.38, 0.10]}>
            <group position={[0.06, -0.05, 0]}>
              {/* 1. Terminal Conector Rosqueado Escuro (Acoplamento Borden/Midwest na base) */}
              <mesh position={[0, -1.52, 0]} material={materials.darkConnector}>
                <cylinderGeometry args={[0.155, 0.155, 0.25, 32]} />
              </mesh>
              {/* Ranhuras de rosca da conexão */}
              {[-1.60, -1.55, -1.50, -1.45].map((threadY, idx) => (
                <mesh key={`thread-${idx}`} position={[0, threadY, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                  <torusGeometry args={[0.157, 0.005, 6, 32]} />
                </mesh>
              ))}
              {/* Anel de vedação metálico */}
              <mesh position={[0, -1.39, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.165, 0.165, 0.04, 32]} />
              </mesh>

              {/* 2. Corpo Inferior Liso em Alumínio Acetinado Prateado */}
              <mesh position={[0, -0.92, 0]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.180, 0.168, 0.90, 32]} />
              </mesh>
              {/* Anel de transição fresado */}
              <mesh position={[0, -1.36, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                <torusGeometry args={[0.170, 0.004, 6, 32]} />
              </mesh>
              <mesh position={[0, -0.47, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                <torusGeometry args={[0.181, 0.004, 6, 32]} />
              </mesh>

              {/* Placa decorativa/selo a laser da marca e símbolo de autoclavável 134°C */}
              <mesh position={[0, -0.92, 0.175]} material={materials.darkConnector}>
                <boxGeometry args={[0.08, 0.40, 0.01]} />
              </mesh>

              {/* 3. Empunhadura Anatômica com Curvatura Sinuosa e Textura de Losangos */}
              {/* Segmento Inferior do Grip (leve inclinação à esquerda) */}
              <mesh position={[-0.025, -0.125, 0]} rotation={[0, 0, 0.07]} material={materials.handpieceGrip}>
                <cylinderGeometry args={[0.172, 0.180, 0.65, 32]} />
              </mesh>
              {/* Segmento Superior do Grip (curvatura ergonômica acentuada) */}
              <mesh position={[-0.085, 0.50, 0]} rotation={[0, 0, 0.13]} material={materials.handpieceGrip}>
                <cylinderGeometry args={[0.145, 0.172, 0.62, 32]} />
              </mesh>

              {/* 4. Pescoço Afilado e Polido de Transição para a Cabeça */}
              <mesh position={[-0.145, 1.05, 0]} rotation={[0, 0, -0.05]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.115, 0.145, 0.52, 32]} />
              </mesh>

              {/* 5. Bloco Frontal de Spray e Guia Óptica (LED) */}
              {/* Bico metálico de spray apontado para a ponta ativa */}
              <mesh position={[-0.19, 1.25, 0.07]} rotation={[0.4, -0.3, 0]} material={materials.surgicalSteel}>
                <boxGeometry args={[0.045, 0.07, 0.04]} />
              </mesh>
              {/* Micro-orifícios de spray triplo de refrigeração ar/água */}
              <mesh position={[-0.195, 1.28, 0.09]} material={materials.darkConnector}>
                <sphereGeometry args={[0.012, 12, 8]} />
              </mesh>
              {/* Janela de fibra óptica / LED emissor */}
              <mesh position={[-0.175, 1.22, 0.08]} material={materials.ledOptic}>
                <cylinderGeometry args={[0.016, 0.016, 0.02, 16]} />
              </mesh>

              {/* 6. Cabeça da Turbina (Cápsula Arredondada Fiel à Imagem 1) */}
              {/* O eixo local Y da cabeça aponta na direção exata da broca (superior-esquerda) e push-button (inferior-direita) */}
              <group position={[-0.15, 1.45, 0]} rotation={[0.15, 0.22, 1.42]}>
                {/* Corpo cilíndrico principal da cabeça */}
                <mesh position={[0, 0, 0]} material={materials.handpieceSilver}>
                  <cylinderGeometry args={[0.165, 0.165, 0.28, 32]} />
                </mesh>

                {/* Face Dianteira (+Y): Mandril com pinça rotativa e orifício da broca */}
                <mesh position={[0, 0.15, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.150, 0.165, 0.03, 32]} />
                </mesh>
                {/* Anel de retenção usinado do mandril (Collet ring) */}
                <mesh position={[0, 0.165, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                  <torusGeometry args={[0.075, 0.012, 8, 32]} />
                </mesh>
                {/* Abertura circular central do mandril */}
                <mesh position={[0, 0.168, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                  <circleGeometry args={[0.040, 24]} />
                </mesh>

                {/* Broca Odontológica de Alta Rotação (FG - Friction Grip) saindo da face dianteira */}
                {/* Haste metálica cilíndrica de alta precisão */}
                <mesh position={[0, 0.38, 0]} material={materials.burSteel}>
                  <cylinderGeometry args={[0.022, 0.022, 0.40, 20]} />
                </mesh>
                {/* Ponta ativa diamantada cilíndrico-cônica */}
                <mesh position={[0, 0.62, 0]} material={materials.diamondHead}>
                  <cylinderGeometry args={[0.018, 0.028, 0.18, 20]} />
                </mesh>

                {/* Face Traseira (-Y): Tampa com Botão Push-Button Arredondado */}
                {/* Colar chanfrado traseiro */}
                <mesh position={[0, -0.15, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.165, 0.145, 0.03, 32]} />
                </mesh>
                {/* Cúpula anatômica do botão de pressão (Push-button dome da Imagem 1) */}
                <mesh position={[0, -0.165, 0]} rotation={[Math.PI, 0, 0]} material={materials.handpieceSilver}>
                  <sphereGeometry args={[0.140, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
                </mesh>
              </group>
            </group>
          </group>
        );

      // 7. CONTRA-ÂNGULO DE BAIXA ROTAÇÃO (Fiel à Imagem 1: Modelo Schuster T10 com Anel Azul 1:1 e Mandril Serrilhado)
      case 'contra_angulo':
        return (
          <group rotation={[0.06, -0.32, 0.08]}>
            <group position={[0.05, -0.05, 0]}>
              {/* 1. Base Cônica Alargada tipo Trombeta (Acoplamento INTRA ISO 3964 ao Micromotor) */}
              <mesh position={[0, -1.45, 0]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.180, 0.235, 0.40, 32]} />
              </mesh>
              {/* Rebaixo interno escuro de acoplamento do eixo do micromotor */}
              <mesh position={[0, -1.64, 0]} material={materials.darkConnector}>
                <cylinderGeometry args={[0.13, 0.13, 0.04, 32]} />
              </mesh>
              {/* Friso anelar de separação da base */}
              <mesh position={[0, -1.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                <torusGeometry args={[0.181, 0.004, 6, 32]} />
              </mesh>

              {/* 2. Corpo Inferior Acetinado com Inscrição do Modelo */}
              <mesh position={[0, -0.90, 0]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.182, 0.180, 0.70, 32]} />
              </mesh>
              {/* Placa decorativa/logotipo laser "SCHUSTER T10" */}
              <mesh position={[0, -0.90, 0.178]} material={materials.darkConnector}>
                <boxGeometry args={[0.07, 0.38, 0.01]} />
              </mesh>

              {/* 3. Anel Azul Cobalto de Transmissão 1:1 (Marca Registrada da Schuster/KaVo) */}
              <mesh position={[0, -0.55, 0]} material={materials.blueRing}>
                <cylinderGeometry args={[0.184, 0.184, 0.06, 32]} />
              </mesh>
              {/* Frisos cromados de acabamento superior e inferior do anel azul */}
              <mesh position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                <torusGeometry args={[0.183, 0.003, 6, 32]} />
              </mesh>
              <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                <torusGeometry args={[0.183, 0.003, 6, 32]} />
              </mesh>

              {/* 4. Corpo Superior com Concavidades Ovais Ergonômicas (Apoio Digital) */}
              <mesh position={[0, -0.17, 0]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.170, 0.182, 0.70, 32]} />
              </mesh>
              {/* 4 Entalhes elípticos de apoio dos dedos (Finger rest da Imagem 1) */}
              {[Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75].map((angle, idx) => (
                <mesh
                  key={`oval-notch-${idx}`}
                  position={[Math.cos(angle) * 0.172, 0.02, Math.sin(angle) * 0.172]}
                  rotation={[0, -angle, 0]}
                  scale={[0.65, 1.35, 1.0]}
                  material={materials.knurledSteel}
                >
                  <sphereGeometry args={[0.038, 16, 12]} />
                </mesh>
              ))}

              {/* 5. Colar Articulado de Transição (Mid-Joint Collar) */}
              <mesh position={[-0.025, 0.36, 0]} rotation={[0, 0, 0.09]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.145, 0.170, 0.36, 32]} />
              </mesh>
              {/* Entalhes ovais secundários do colar */}
              {[Math.PI * 0.25, Math.PI * 0.75].map((angle, idx) => (
                <mesh
                  key={`collar-notch-${idx}`}
                  position={[-0.025 + Math.cos(angle) * 0.15, 0.38, Math.sin(angle) * 0.15]}
                  rotation={[0, -angle, 0]}
                  scale={[0.6, 1.2, 1.0]}
                  material={materials.knurledSteel}
                >
                  <sphereGeometry args={[0.032, 16, 12]} />
                </mesh>
              ))}

              {/* 6. Pescoço Contra-Angulado Afilado (Sleek Neck) */}
              <mesh position={[-0.065, 0.82, 0]} rotation={[0, 0, -0.05]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.115, 0.145, 0.58, 32]} />
              </mesh>

              {/* Trava mecânica traseira de lâmina/trinco basculante (Push-lever para trava da broca CA) */}
              <mesh position={[-0.02, 0.88, -0.09]} rotation={[0.15, 0, -0.05]} material={materials.surgicalSteel}>
                <boxGeometry args={[0.045, 0.30, 0.035]} />
              </mesh>

              {/* 7. Cabeça Mecânica do Contra-Ângulo com Mandril Fresado/Serrilhado (Imagem 1) */}
              <group position={[-0.08, 1.22, 0]} rotation={[0.12, 0.18, 1.32]}>
                {/* Corpo cilíndrico principal da cabeça */}
                <mesh position={[0, 0, 0]} material={materials.handpieceSilver}>
                  <cylinderGeometry args={[0.155, 0.155, 0.26, 32]} />
                </mesh>

                {/* Face Dianteira (+Y local): Mandril com Anel Serrilhado/Fresado Radial (Imagem 1) */}
                <mesh position={[0, 0.135, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.142, 0.155, 0.03, 32]} />
                </mesh>
                {/* Anel fresado com estrias/dentes de aperto (Knurled Gear Ring da foto) */}
                <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.knurledSteel}>
                  <torusGeometry args={[0.115, 0.015, 12, 36]} />
                </mesh>
                {/* Colar concêntrico do mandril */}
                <mesh position={[0, 0.158, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                  <torusGeometry args={[0.075, 0.012, 8, 32]} />
                </mesh>
                {/* Abertura central da pinça */}
                <mesh position={[0, 0.162, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                  <circleGeometry args={[0.040, 24]} />
                </mesh>

                {/* Broca de Baixa Rotação (Haste de Encaixe CA tipo Latch) */}
                <mesh position={[0, 0.38, 0]} material={materials.burSteel}>
                  <cylinderGeometry args={[0.024, 0.024, 0.42, 20]} />
                </mesh>
                {/* Chanfro da ponta ativa da broca */}
                <mesh position={[0, 0.60, 0]} material={materials.burSteel}>
                  <cylinderGeometry args={[0.018, 0.024, 0.04, 20]} />
                </mesh>

                {/* Face Traseira (-Y local): Tampa Chanfrada da Caixa de Engrenagens */}
                <mesh position={[0, -0.135, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.155, 0.138, 0.03, 32]} />
                </mesh>
                <mesh position={[0, -0.155, 0]} material={materials.handpieceSilver}>
                  <cylinderGeometry args={[0.135, 0.135, 0.02, 32]} />
                </mesh>
              </group>
            </group>
          </group>
        );

      // 8. BROCAS DIAMANTADAS ESFÉRICAS FG (Fiel à Imagem 1: Família de Brocas Esféricas para Alta Rotação com Anel Azul ISO)
      case 'brocas_odontologicas':
        return (
          <group rotation={[0.06, 0.12, 0]}>
            {/* Array com as 8 brocas esféricas de calibres progressivos (1011 a 1018 da Imagem 1) */}
            {[
              { id: '1011', sphereR: 0.038, neckLen: 0.46, neckR: 0.016 },
              { id: '1012', sphereR: 0.048, neckLen: 0.44, neckR: 0.019 },
              { id: '1013', sphereR: 0.060, neckLen: 0.42, neckR: 0.022 },
              { id: '1014', sphereR: 0.075, neckLen: 0.40, neckR: 0.026 },
              { id: '1015', sphereR: 0.092, neckLen: 0.38, neckR: 0.030 },
              { id: '1016', sphereR: 0.115, neckLen: 0.34, neckR: 0.035 },
              { id: '1017', sphereR: 0.145, neckLen: 0.28, neckR: 0.039 },
              { id: '1018', sphereR: 0.180, neckLen: 0.22, neckR: 0.040 },
            ].map((bur, index) => {
              const xPos = (index - 3.5) * 0.35;
              const neckBaseY = 0.60;
              const neckTopY = neckBaseY + bur.neckLen;
              const sphereCenterY = neckTopY + bur.sphereR;

              return (
                <group key={`spherical-bur-${bur.id}`} position={[xPos, -0.15, 0]}>
                  {/* 1. Haste de Alta Rotação (FG - Friction Grip, Ø 1.6mm em aço espelhado) */}
                  <mesh position={[0, -0.30, 0]} material={materials.burSteel}>
                    <cylinderGeometry args={[0.040, 0.040, 1.80, 24]} />
                  </mesh>

                  {/* 1b. Borda chanfrada de inserção da haste no mandril */}
                  <mesh position={[0, -1.20, 0]} material={materials.burSteel}>
                    <sphereGeometry args={[0.040, 16, 12]} />
                  </mesh>

                  {/* 2. Anel de Identificação ISO de Granulação Média (Azul Royal - 100-120 µm da Imagem 1) */}
                  <mesh position={[0, 0.52, 0]} material={materials.blueHandle}>
                    <cylinderGeometry args={[0.0415, 0.0415, 0.045, 24]} />
                  </mesh>

                  {/* 3. Colo Cônico Anatômico da Broca (Pescoço Usinado) */}
                  <mesh
                    position={[0, neckBaseY + bur.neckLen / 2, 0]}
                    material={materials.burSteel}
                  >
                    <cylinderGeometry args={[bur.neckR, 0.040, bur.neckLen, 24]} />
                  </mesh>

                  {/* 4. Cabeça Esférica Diamantada Sinterizada (Grânulos Eletrodepositados) */}
                  <mesh position={[0, sphereCenterY, 0]} material={materials.diamondHead}>
                    <sphereGeometry args={[bur.sphereR, 28, 22]} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );

      // 9. FOTOPOLIMERIZADOR LED ODONTOLÓGICO (Fiel à Imagem 1: Modelo Woodpecker com Escudo Laranja e Ponteira com Capa Vermelha)
      case 'fotopolimerizador':
        return (
          <group rotation={[0.06, -0.30, 0.10]}>
            <group position={[-0.05, -0.10, 0]}>
              {/* 1. Base / Berço de Carregamento por Indução (Charging Dock da Imagem 1) */}
              <group position={[0, -1.48, 0]}>
                {/* Corpo do berço de recarga */}
                <mesh position={[0, 0, 0]} material={materials.chargerBaseWhite}>
                  <cylinderGeometry args={[0.32, 0.40, 0.48, 32]} />
                </mesh>
                {/* Rebaixo de apoio do bocal */}
                <mesh position={[0, 0.18, 0]} material={materials.darkConnector}>
                  <cylinderGeometry args={[0.20, 0.20, 0.22, 32]} />
                </mesh>
                {/* Pés antiderrapantes da base */}
                <mesh position={[0, -0.24, 0]} material={materials.darkConnector}>
                  <cylinderGeometry args={[0.41, 0.41, 0.02, 32]} />
                </mesh>
              </group>

              {/* 2. Corpo Anatômico da Peça de Mão em Alumínio Acetinado Prateado */}
              {/* Empunhadura inferior cilíndrica */}
              <mesh position={[0, -0.85, 0]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.182, 0.178, 1.05, 32]} />
              </mesh>
              {/* Anel de transição fresado da empunhadura */}
              <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                <torusGeometry args={[0.183, 0.003, 6, 32]} />
              </mesh>

              {/* Corpo superior afilado ergonômico estilo caneta */}
              <mesh position={[0, 0.28, 0]} material={materials.handpieceSilver}>
                <cylinderGeometry args={[0.115, 0.182, 1.18, 32]} />
              </mesh>

              {/* 3. Painel de Controle Digital e Botões Azuis (Imagem 1) */}
              {/* Display digital LED preto rebaixado */}
              <mesh position={[0, 0.22, 0.152]} material={materials.fiberOpticBlack}>
                <boxGeometry args={[0.09, 0.22, 0.02]} />
              </mesh>
              {/* Dígitos digitais iluminados do temporizador ("10s / 88") */}
              <mesh position={[0, 0.22, 0.163]} material={materials.blueLed}>
                <boxGeometry args={[0.06, 0.10, 0.005]} />
              </mesh>

              {/* Botão Power / Disparo (P) azul acima do display */}
              <mesh position={[0, 0.46, 0.138]} rotation={[Math.PI / 2, 0, 0]} material={materials.controlButtonBlue}>
                <cylinderGeometry args={[0.024, 0.024, 0.02, 16]} />
              </mesh>

              {/* Botão Modo (M) azul abaixo do display */}
              <mesh position={[0, 0.02, 0.164]} rotation={[Math.PI / 2, 0, 0]} material={materials.controlButtonBlue}>
                <cylinderGeometry args={[0.022, 0.022, 0.02, 16]} />
              </mesh>

              {/* Botão Tempo (T) azul abaixo do botão M */}
              <mesh position={[0, -0.10, 0.172]} rotation={[Math.PI / 2, 0, 0]} material={materials.controlButtonBlue}>
                <cylinderGeometry args={[0.022, 0.022, 0.02, 16]} />
              </mesh>

              {/* Indicadores de modo na lateral do display */}
              {[-0.04, 0.0, 0.04].map((ledY, idx) => (
                <mesh key={`mode-led-${idx}`} position={[0.065, 0.22 + ledY, 0.150]} material={materials.darkConnector}>
                  <sphereGeometry args={[0.007, 8, 8]} />
                </mesh>
              ))}

              {/* 4. Colar Cônico Metálico de Engate da Ponteira */}
              <mesh position={[0, 0.98, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.065, 0.115, 0.28, 32]} />
              </mesh>

              {/* 5. Escudo Protetor Ocular Laranja Anti-UV (Orange Eye Shield da Imagem 1) */}
              <group position={[0, 1.15, 0]}>
                {/* Anel de retenção/ilhó de encaixe na ponteira */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.chargerBaseWhite}>
                  <torusGeometry args={[0.068, 0.012, 8, 32]} />
                </mesh>
                {/* Disco protetor oval translúcido âmbar/laranja */}
                <mesh position={[0.18, 0.04, 0.08]} rotation={[0.32, -0.10, -0.20]} scale={[1.4, 0.02, 1.0]} material={materials.orangeShield}>
                  <cylinderGeometry args={[0.32, 0.32, 1, 32]} />
                </mesh>
              </group>

              {/* 6. Ponteira de Fibra Óptica Preta Curva (Light Guide da Imagem 1) */}
              {/* Haste reta inferior */}
              <mesh position={[0, 1.34, 0]} material={materials.fiberOpticBlack}>
                <cylinderGeometry args={[0.055, 0.055, 0.44, 24]} />
              </mesh>
              {/* Articulação curva da ponteira óptica */}
              <mesh position={[0, 1.56, 0]} material={materials.fiberOpticBlack}>
                <sphereGeometry args={[0.055, 16, 16]} />
              </mesh>
              {/* Haste curva superior projetada em ângulo (~65°) */}
              <mesh position={[0.05, 1.76, 0.14]} rotation={[0.65, 0, -0.20]} material={materials.fiberOpticBlack}>
                <cylinderGeometry args={[0.052, 0.054, 0.38, 24]} />
              </mesh>

              {/* 7. Capa/Ponteira de Silicone Vermelha Protetora na Extremidade (Imagem 1) */}
              <mesh position={[0.085, 1.94, 0.25]} rotation={[0.65, 0, -0.20]} material={materials.redSiliconeTip}>
                <cylinderGeometry args={[0.056, 0.056, 0.14, 24]} />
              </mesh>
              {/* Lente emissora LED azul (460 nm) na ponta ativa */}
              <mesh position={[0.098, 2.01, 0.29]} rotation={[0.65, 0, -0.20]} material={materials.blueLed}>
                <circleGeometry args={[0.046, 24]} />
              </mesh>

              {/* Luz emissiva dinâmica suave iluminando o topo da ponteira */}
              <pointLight ref={lightRef} position={[0.10, 2.05, 0.32]} color="#38BDF8" intensity={1.8} distance={3.5} />
            </group>
          </group>
        );

      // 10. ESPÁTULA DE INSERÇÃO DE RESINA EM TITÂNIO (Modelo Bicolor Branco/Turquesa da Imagem 1)
      case 'espatula_resina':
        return (
          <group rotation={[0.12, 0.20, -0.68]}>
            {/* 1. CABO ERGONÔMICO HÍBRIDO EM AÇO CIRÚRGICO E SILICONE BICOLOR (Imagem 1) */}
            {/* 1a. Haste tubular central de aço inox cirúrgico polido */}
            <mesh position={[0, 0, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.078, 0.078, 0.85, 32]} />
            </mesh>

            {/* 1b. Luva superior ergonômica de silicone branco fosco */}
            <mesh position={[0, 0.85, 0]} material={materials.whiteSilicone}>
              <cylinderGeometry args={[0.118, 0.118, 0.85, 32]} />
            </mesh>

            {/* 1c. Colar cônico/degrau superior em aço cirúrgico */}
            <mesh position={[0, 1.32, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.075, 0.118, 0.10, 24]} />
            </mesh>
            <mesh position={[0, 1.40, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.052, 0.052, 0.08, 24]} />
            </mesh>

            {/* 1d. Luva inferior ergonômica de silicone turquesa / tiffany */}
            <mesh position={[0, -0.85, 0]} material={materials.turquoiseSilicone}>
              <cylinderGeometry args={[0.118, 0.118, 0.85, 32]} />
            </mesh>

            {/* 1e. Colar cônico/degrau inferior em aço cirúrgico */}
            <mesh position={[0, -1.32, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.118, 0.075, 0.10, 24]} />
            </mesh>
            <mesh position={[0, -1.40, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.052, 0.052, 0.08, 24]} />
            </mesh>

            {/* 2. PONTA ATIVA SUPERIOR EM TITÂNIO DOURADO (Escultora Fina Angulada - Imagem 1) */}
            <group position={[0, 1.44, 0]}>
              {/* Segmento reto inicial que emerge do mandril */}
              <mesh position={[0, 0.11, 0]} material={materials.titaniumGold}>
                <cylinderGeometry args={[0.026, 0.034, 0.22, 16]} />
              </mesh>
              {/* Primeira articulação angulada (~35°) */}
              <group position={[0, 0.22, 0]} rotation={[0, 0, 0.58]}>
                <mesh material={materials.titaniumGold}>
                  <sphereGeometry args={[0.026, 16, 16]} />
                </mesh>
                {/* Haste oblíqua intermediária */}
                <mesh position={[0, 0.13, 0]} material={materials.titaniumGold}>
                  <cylinderGeometry args={[0.022, 0.026, 0.26, 16]} />
                </mesh>
                {/* Segunda articulação / contra-ângulo (~85°) */}
                <group position={[0, 0.26, 0]} rotation={[0, 0, 0.88]}>
                  <mesh material={materials.titaniumGold}>
                    <sphereGeometry args={[0.022, 16, 16]} />
                  </mesh>
                  {/* Lâmina fina achatada escultora/condensadora */}
                  <mesh position={[0, 0.12, 0]} material={materials.titaniumGold}>
                    <boxGeometry args={[0.016, 0.24, 0.055]} />
                  </mesh>
                  {/* Extremidade terminal atraumática suavemente arredondada */}
                  <mesh position={[0, 0.24, 0]} material={materials.titaniumGold}>
                    <sphereGeometry args={[0.018, 16, 12]} />
                  </mesh>
                </group>
              </group>
            </group>

            {/* 3. PONTA ATIVA INFERIOR EM TITÂNIO DOURADO (Espátula Plana Larga - Imagem 1) */}
            <group position={[0, -1.44, 0]} rotation={[0, Math.PI, 0]}>
              {/* Segmento reto inicial que emerge do mandril inferior */}
              <mesh position={[0, -0.11, 0]} material={materials.titaniumGold}>
                <cylinderGeometry args={[0.034, 0.026, 0.22, 16]} />
              </mesh>
              {/* Primeira articulação angulada contra-posta (~35°) */}
              <group position={[0, -0.22, 0]} rotation={[0, 0, -0.58]}>
                <mesh material={materials.titaniumGold}>
                  <sphereGeometry args={[0.026, 16, 16]} />
                </mesh>
                {/* Haste oblíqua intermediária */}
                <mesh position={[0, -0.13, 0]} material={materials.titaniumGold}>
                  <cylinderGeometry args={[0.026, 0.022, 0.26, 16]} />
                </mesh>
                {/* Segunda articulação / contra-ângulo (~85°) */}
                <group position={[0, -0.26, 0]} rotation={[0, 0, -0.88]}>
                  <mesh material={materials.titaniumGold}>
                    <sphereGeometry args={[0.022, 16, 16]} />
                  </mesh>
                  {/* Lâmina larga em espátula plana para resina composta */}
                  <mesh position={[0, -0.14, 0]} material={materials.titaniumGold}>
                    <boxGeometry args={[0.016, 0.28, 0.095]} />
                  </mesh>
                  {/* Extremidade terminal suavemente arredondada da espátula */}
                  <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.titaniumGold}>
                    <cylinderGeometry args={[0.0475, 0.0475, 0.016, 20]} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        );

      // 11. SERINGA DE RESINA COMPOSTA RESTAURADORA (Fiel à Imagem 1: Modelo SDI Wave com Ponta Metálica Curva)
      case 'resina_composta':
        return (
          <group rotation={[0.15, 0.25, 2.05]}>
            <group position={[0, -0.22, 0]}>
              {/* 1. Ponta Aplicadora em Cânula Metálica Curva (Precision Metal Needle da Imagem 1) */}
              {/* Haste reta metálica inicial */}
              <mesh position={[0, 1.775, 0]} material={materials.needleSteel}>
                <cylinderGeometry args={[0.018, 0.018, 0.35, 16]} />
              </mesh>
              {/* Cotovelo da dobra de 45° */}
              <mesh position={[0, 1.95, 0]} material={materials.needleSteel}>
                <sphereGeometry args={[0.018, 16, 12]} />
              </mesh>
              {/* Ponta terminal angulada a 45° para injeção intracavitária */}
              <mesh position={[-0.105, 2.055, 0]} rotation={[0, 0, 0.78]} material={materials.needleSteel}>
                <cylinderGeometry args={[0.016, 0.018, 0.30, 16]} />
              </mesh>

              {/* 2. Capa / Hub Luer-Lock Plástico Preto da Agulha (Needle Hub da Imagem 1) */}
              {/* Bocal cônico dianteiro */}
              <mesh position={[0, 1.45, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.045, 0.080, 0.30, 24]} />
              </mesh>
              {/* Colar traseiro de travamento */}
              <mesh position={[0, 1.225, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.095, 0.095, 0.15, 24]} />
              </mesh>
              {/* 4 Aletas estriadas longitudinais de aperto manual do hub */}
              <mesh position={[0, 1.34, 0]} material={materials.uvBlackPlastic}>
                <boxGeometry args={[0.024, 0.28, 0.16]} />
              </mesh>
              <mesh position={[0, 1.34, 0]} material={materials.uvBlackPlastic}>
                <boxGeometry args={[0.16, 0.28, 0.024]} />
              </mesh>

              {/* 3. Bico Dianteiro Luer-Lock da Seringa */}
              <mesh position={[0, 1.05, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.115, 0.125, 0.20, 24]} />
              </mesh>
              <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.uvBlackPlastic}>
                <torusGeometry args={[0.118, 0.008, 6, 24]} />
              </mesh>

              {/* 4. Corpo Cilíndrico da Seringa em Plástico Preto Fotoprotetor UV */}
              <mesh position={[0, 0.025, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.130, 0.130, 1.85, 32]} />
              </mesh>

              {/* 5. Rótulo Gráfico SDI Wave Restorative System (Imagem 1) */}
              {/* Seção Azul do rótulo SDI Wave */}
              <mesh position={[0, 0.25, 0]} material={materials.resinLabelBlue}>
                <cylinderGeometry args={[0.132, 0.132, 0.80, 32]} />
              </mesh>
              {/* Faixa decorativa com logotipo "SDI wave" */}
              <mesh position={[0, 0.25, 0.133]} material={materials.resinLabelWhite}>
                <boxGeometry args={[0.07, 0.45, 0.005]} />
              </mesh>
              {/* Faixa Branca terminal do rótulo */}
              <mesh position={[0, -0.30, 0]} material={materials.resinLabelWhite}>
                <cylinderGeometry args={[0.132, 0.132, 0.30, 32]} />
              </mesh>

              {/* 6. Flange Digital Ergonômica de Apoio (Finger Flange da Imagem 1) */}
              <mesh position={[0, -0.90, 0]} material={materials.uvBlackPlastic}>
                <boxGeometry args={[0.62, 0.06, 0.30]} />
              </mesh>
              <mesh position={[0, -0.90, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.145, 0.145, 0.07, 32]} />
              </mesh>

              {/* 7. Êmbolo Extensível e Disco de Pressão de Polegar (Plunger & Thumb Rest) */}
              {/* Haste cilíndrica central do êmbolo */}
              <mesh position={[0, -1.29, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.055, 0.055, 0.72, 24]} />
              </mesh>
              {/* Nervuras transversais em cruz do êmbolo */}
              <mesh position={[0, -1.29, 0]} material={materials.uvBlackPlastic}>
                <boxGeometry args={[0.10, 0.70, 0.018]} />
              </mesh>
              <mesh position={[0, -1.29, 0]} material={materials.uvBlackPlastic}>
                <boxGeometry args={[0.018, 0.70, 0.10]} />
              </mesh>
              {/* Disco circular de pressão de polegar (Thumb disc da foto) */}
              <mesh position={[0, -1.67, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.22, 0.22, 0.045, 32]} />
              </mesh>
              <mesh position={[0, -1.67, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.uvBlackPlastic}>
                <torusGeometry args={[0.21, 0.008, 6, 32]} />
              </mesh>
            </group>
          </group>
        );

      // 12. SERINGA DE ÁCIDO FOSFÓRICO A 37% (Fiel à Imagem 1: Modelo Potenza Attacco com Tampa Estriada Translúcida)
      case 'acido_fosforico':
        return (
          <group rotation={[0.15, 0.25, 2.05]}>
            <group position={[0, -0.05, 0]}>
              {/* 1. Tampa Luer-Lock Protetora Estriada Translúcida (Clear Ribbed Cap da Imagem 1) */}
              <group position={[0, 1.28, 0]}>
                {/* Corpo cilíndrico translúcido da tampa */}
                <mesh position={[0, 0, 0]} material={materials.frostedCap}>
                  <cylinderGeometry args={[0.095, 0.095, 0.38, 24]} />
                </mesh>
                {/* Ranhuras e estrias longitudinais de pega da tampa */}
                <mesh position={[0, 0, 0]} material={materials.frostedCap}>
                  <boxGeometry args={[0.020, 0.36, 0.20]} />
                </mesh>
                <mesh position={[0, 0, 0]} material={materials.frostedCap}>
                  <boxGeometry args={[0.20, 0.36, 0.020]} />
                </mesh>
                {/* Topo cego chanfrado da tampa */}
                <mesh position={[0, 0.20, 0]} material={materials.frostedCap}>
                  <cylinderGeometry args={[0.080, 0.095, 0.03, 24]} />
                </mesh>
              </group>

              {/* 2. Bico Luer-Lock Dianteiro Transparente da Seringa */}
              <mesh position={[0, 1.025, 0]} material={materials.clearSyringe}>
                <cylinderGeometry args={[0.075, 0.125, 0.25, 24]} />
              </mesh>
              <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.clearSyringe}>
                <torusGeometry args={[0.118, 0.008, 6, 24]} />
              </mesh>

              {/* 3. Gel Azul Cobalto de Ácido Fosfórico a 37% (Visível através do plástico cristal) */}
              <mesh position={[0, 0.575, 0]} material={materials.phosphoricGel}>
                <cylinderGeometry args={[0.125, 0.125, 0.65, 32]} />
              </mesh>

              {/* 4. Pistão / Êmbolo de Borracha Preta de Dupla Vedação (Visível no interior da seringa) */}
              <mesh position={[0, 0.16, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.126, 0.126, 0.16, 32]} />
              </mesh>
              {/* Anéis de vedação labial de borracha */}
              <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.uvBlackPlastic}>
                <torusGeometry args={[0.127, 0.005, 6, 32]} />
              </mesh>
              <mesh position={[0, 0.10, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.uvBlackPlastic}>
                <torusGeometry args={[0.127, 0.005, 6, 32]} />
              </mesh>

              {/* 5. Tambor Cilíndrico Transparente da Seringa em Polipropileno Médico */}
              <mesh position={[0, 0, 0]} material={materials.clearSyringe}>
                <cylinderGeometry args={[0.130, 0.130, 1.80, 32]} />
              </mesh>

              {/* 6. Rótulo Adesivo Branco "Potenza ATTACCO" (Imagem 1) */}
              {/* Corpo branco do rótulo */}
              <mesh position={[0, 0.10, 0]} material={materials.resinLabelWhite}>
                <cylinderGeometry args={[0.132, 0.132, 0.82, 32]} />
              </mesh>
              {/* Detalhe gráfico com inscrição laser "Potenza ATTACCO" */}
              <mesh position={[0, 0.10, 0.133]} material={materials.uvBlackPlastic}>
                <boxGeometry args={[0.075, 0.50, 0.005]} />
              </mesh>
              {/* Faixa azul ciano frontal delimitadora do gel */}
              <mesh position={[0, 0.46, 0]} material={materials.phosphoricGel}>
                <cylinderGeometry args={[0.133, 0.133, 0.12, 32]} />
              </mesh>

              {/* 7. Flange Digital Branca de Apoio (Finger Flange da Imagem 1) */}
              <mesh position={[0, -0.90, 0]} material={materials.resinLabelWhite}>
                <boxGeometry args={[0.62, 0.06, 0.30]} />
              </mesh>
              <mesh position={[0, -0.90, 0]} material={materials.resinLabelWhite}>
                <cylinderGeometry args={[0.145, 0.145, 0.07, 32]} />
              </mesh>

              {/* 8. Haste do Êmbolo Branca com Nervuras em Cruz e Apoio de Polegar */}
              {/* Haste central do êmbolo */}
              <mesh position={[0, -1.28, 0]} material={materials.resinLabelWhite}>
                <cylinderGeometry args={[0.055, 0.055, 0.75, 24]} />
              </mesh>
              {/* Nervuras em cruz para reforço estrutural */}
              <mesh position={[0, -1.28, 0]} material={materials.resinLabelWhite}>
                <boxGeometry args={[0.10, 0.72, 0.018]} />
              </mesh>
              <mesh position={[0, -1.28, 0]} material={materials.resinLabelWhite}>
                <boxGeometry args={[0.018, 0.72, 0.10]} />
              </mesh>
              {/* Disco circular de pressão de polegar (Thumb disc da foto) */}
              <mesh position={[0, -1.67, 0]} material={materials.resinLabelWhite}>
                <cylinderGeometry args={[0.22, 0.22, 0.045, 32]} />
              </mesh>
              <mesh position={[0, -1.67, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.resinLabelWhite}>
                <torusGeometry args={[0.21, 0.008, 6, 32]} />
              </mesh>
            </group>
          </group>
        );

      // 13. FRASCO DE SISTEMA ADESIVO ODONTOLÓGICO (Fiel à Imagem 1: Modelo FGM Ambar com Tampa Flip-Top e Rebaixo de Polegar)
      case 'sistema_adesivo':
        return (
          <group rotation={[0.08, -0.22, 0.02]}>
            <group position={[0, -0.10, 0]}>
              {/* 1. Base Arredondada do Frasco (Chanfro inferior) */}
              <mesh position={[0, -1.06, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.52, 0.52, 0.04, 36]} />
              </mesh>
              <mesh position={[0, -1.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.uvBlackPlastic}>
                <torusGeometry args={[0.52, 0.030, 8, 36]} />
              </mesh>

              {/* 2. Corpo Cilíndrico do Frasco em Plástico Preto Brilhante UV */}
              <mesh position={[0, -0.40, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.55, 0.55, 1.30, 36]} />
              </mesh>

              {/* 3. Rótulo Adesivo Gráfico FGM Ambar (Imagem 1) */}
              {/* Faixa Superior Laranja Fina do Rótulo */}
              <mesh position={[0, 0.12, 0]} material={materials.ambarOrange}>
                <cylinderGeometry args={[0.553, 0.553, 0.055, 36]} />
              </mesh>

              {/* Área Central Preta do Rótulo com Logotipo "FGM ambar" */}
              <mesh position={[0, -0.15, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.553, 0.553, 0.48, 36]} />
              </mesh>
              {/* Oval FGM no canto superior do rótulo */}
              <mesh position={[-0.20, 0.02, 0.556]} scale={[1.35, 0.72, 1.0]} material={materials.resinLabelWhite}>
                <torusGeometry args={[0.07, 0.009, 8, 24]} />
              </mesh>
              {/* Tipografia "ambar" em Branco Moderno */}
              <mesh position={[0.04, -0.16, 0.556]} material={materials.resinLabelWhite}>
                <boxGeometry args={[0.46, 0.15, 0.005]} />
              </mesh>

              {/* Faixa Inferior Laranja Ampla com Informações Clínicas (Imagem 1) */}
              <mesh position={[0, -0.64, 0]} material={materials.ambarOrange}>
                <cylinderGeometry args={[0.553, 0.553, 0.50, 36]} />
              </mesh>
              {/* Bloco de texto branco "Sistema adesivo para esmalte e dentina" */}
              <mesh position={[0, -0.64, 0.556]} material={materials.resinLabelWhite}>
                <boxGeometry args={[0.42, 0.16, 0.005]} />
              </mesh>

              {/* 4. Colar / Friso de Encaixe da Tampa Flip-Top */}
              <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                <torusGeometry args={[0.542, 0.012, 6, 36]} />
              </mesh>

              {/* 5. Tampa Flip-Top Anatômica em Plástico Preto com Rebaixo de Polegar (Imagem 1) */}
              {/* Base inferior da tampa */}
              <mesh position={[0, 0.50, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.548, 0.548, 0.42, 36]} />
              </mesh>
              {/* Tampa superior com sistema de abertura rápida com uma mão */}
              <mesh position={[0, 0.95, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.545, 0.548, 0.50, 36]} />
              </mesh>

              {/* Topo plano com bordas arredondadas chanfradas */}
              <mesh position={[0, 1.20, 0]} material={materials.uvBlackPlastic}>
                <cylinderGeometry args={[0.525, 0.525, 0.03, 36]} />
              </mesh>
              <mesh position={[0, 1.19, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.uvBlackPlastic}>
                <torusGeometry args={[0.525, 0.020, 8, 36]} />
              </mesh>

              {/* Rebaixo Anatômico Frontal para o Polegar (Semicircular Thumb Recess da foto) */}
              <mesh position={[0, 0.92, 0.42]} rotation={[0.25, 0, 0]} scale={[1.25, 1.0, 0.75]} material={materials.darkConnector}>
                <sphereGeometry args={[0.20, 24, 16]} />
              </mesh>
              {/* Lábio/Aba de abertura da tampa (Flip-Open Lip) */}
              <mesh position={[0, 0.73, 0.54]} material={materials.uvBlackPlastic}>
                <boxGeometry args={[0.26, 0.035, 0.04]} />
              </mesh>
            </group>
          </group>
        );

      // 14. ESPÁTULA Nº 24 E PLACA DE VIDRO (Modelo Fiel Golgran da Imagem 1)
      case 'espatula_24_placa':
        return (
          <group rotation={[0.36, -0.12, 0.04]}>
            {/* 1. PLACA DE VIDRO GROSSA GOLGRAN (Imagem 1) */}
            <group position={[-0.55, 0, 0]}>
              {/* 1a. Corpo maciço de vidro lapidado espesso */}
              <mesh position={[0, 0, 0]} material={materials.glassSlab}>
                <boxGeometry args={[2.08, 3.28, 0.20]} />
              </mesh>

              {/* 1b. Bordas biseladas em verde-esmeralda (vidro silicato grosso polido) */}
              {/* Borda lateral esquerda */}
              <mesh position={[-1.04, 0, 0]} material={materials.glassEdge}>
                <boxGeometry args={[0.02, 3.28, 0.20]} />
              </mesh>
              {/* Borda lateral direita */}
              <mesh position={[1.04, 0, 0]} material={materials.glassEdge}>
                <boxGeometry args={[0.02, 3.28, 0.20]} />
              </mesh>
              {/* Borda superior */}
              <mesh position={[0, 1.64, 0]} material={materials.glassEdge}>
                <boxGeometry args={[2.08, 0.02, 0.20]} />
              </mesh>
              {/* Borda inferior */}
              <mesh position={[0, -1.64, 0]} material={materials.glassEdge}>
                <boxGeometry args={[2.08, 0.02, 0.20]} />
              </mesh>

              {/* 1c. Rótulo Azul Golgran no canto superior esquerdo da placa */}
              <mesh position={[-0.50, 1.34, 0.103]} material={materials.golgranLabel}>
                <boxGeometry args={[0.88, 0.28, 0.004]} />
              </mesh>

              {/* 1d. Porção de Pó de Cimento Odontológico (Ionômero/Zinco) */}
              <group position={[0, 0.65, 0.102]}>
                {/* Montículo base de pó espatulado */}
                <mesh position={[0, 0, 0.015]} material={materials.cementPowder}>
                  <cylinderGeometry args={[0.24, 0.28, 0.03, 24]} />
                </mesh>
                {/* Cúpula irregular de grânulos de pó */}
                <mesh position={[0, 0, 0.03]} scale={[1.1, 1.0, 0.45]} material={materials.cementPowder}>
                  <sphereGeometry args={[0.20, 16, 12]} />
                </mesh>
                <mesh position={[0.08, 0.05, 0.038]} scale={[0.8, 0.7, 0.35]} material={materials.cementPowder}>
                  <sphereGeometry args={[0.12, 12, 10]} />
                </mesh>
              </group>

              {/* 1e. Gota de Líquido Viscoso Transparente para Manipulação */}
              <group position={[0, -0.15, 0.102]}>
                {/* Menisco da gota líquida */}
                <mesh position={[0, 0, 0.015]} material={materials.liquidDrop}>
                  <cylinderGeometry args={[0.25, 0.29, 0.03, 32]} />
                </mesh>
                {/* Domo brilhante com reflexo especular */}
                <mesh position={[0, 0, 0.028]} scale={[1.15, 0.95, 0.4]} material={materials.liquidDrop}>
                  <sphereGeometry args={[0.22, 24, 16]} />
                </mesh>
              </group>
            </group>

            {/* 2. ESPÁTULA Nº 24 EM AÇO INOXIDÁVEL CIRÚRGICO POLIDO (Imagem 1) */}
            <group position={[1.05, -0.05, 0.05]} rotation={[0, 0, -0.05]}>
              {/* 2a. Terminal posterior arredondado do cabo */}
              <mesh position={[0, -1.82, 0]} material={materials.surgicalSteel}>
                <sphereGeometry args={[0.07, 16, 12]} />
              </mesh>

              {/* 2b. Cabo sextavado/ranhurado com estrias longitudinais de empunhadura */}
              <mesh position={[0, -0.80, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.068, 0.068, 2.0, 16]} />
              </mesh>
              {/* Ranhuras longitudinais de aderência nas laterais */}
              <mesh position={[0, -0.80, 0]} material={materials.knurledSteel}>
                <boxGeometry args={[0.014, 1.85, 0.08]} />
              </mesh>

              {/* 2c. Pescoço / Colar cônico de transição para a lâmina */}
              <mesh position={[0, 0.35, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.042, 0.068, 0.32, 16]} />
              </mesh>

              {/* 2d. Lâmina flexível longa da Espátula nº 24 (Aço Cirúrgico Espelhado) */}
              {/* Base de transição achatada */}
              <mesh position={[0, 0.65, 0]} material={materials.surgicalSteel}>
                <boxGeometry args={[0.16, 0.32, 0.018]} />
              </mesh>
              {/* Corpo principal largo e flexível para espatulação */}
              <mesh position={[0, 1.25, 0]} material={materials.surgicalSteel}>
                <boxGeometry args={[0.22, 0.90, 0.016]} />
              </mesh>
              {/* Extremidade ogival/arredondada clássica da Espátula nº 24 */}
              <mesh position={[0, 1.70, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.11, 0.11, 0.016, 24]} />
              </mesh>
            </group>
          </group>
        );

      // 15. LENÇOL DE BORRACHA (DIQUE) (Modelo Fiel Microdont com Caixa e Folha Frontal da Imagem 1)
      case 'lencol_borracha':
        return (
          <group rotation={[0.38, -0.18, 0.12]}>
            {/* 1. CAIXA DE EMBALAGEM MICRODONT (Imagem 1) */}
            <group position={[-0.75, 0.05, 0]} rotation={[0, 0, 0.38]}>
              {/* Corpo da caixa cartonada com laterais em azul marinho */}
              <mesh position={[0, 0, 0]} material={materials.rubberDamBoxBlueSide}>
                <boxGeometry args={[2.0, 2.0, 0.16]} />
              </mesh>

              {/* Tampa superior impressa com o rótulo Microdont */}
              <mesh position={[0, 0, 0.082]} material={materials.rubberDamBoxFace}>
                <planeGeometry args={[2.0, 2.0]} />
              </mesh>
            </group>

            {/* 2. FOLHA ÚNICA FRONTAL DE LENÇOL DE BORRACHA AZUL (Imagem 1) */}
            <group position={[0.70, -0.05, 0.28]} rotation={[0.10, 0.08, -0.20]}>
              <mesh geometry={undulatingDamGeometry} material={materials.rubberDam} />
            </group>
          </group>
        );

      // 16. ARCO DE YOUNG PARA ISOLAMENTO
      case 'arco_young':
        return (
          <group rotation={[0.2, 0.1, 0]}>
            {/* Haste metálica contínua em formato de U */}
            <mesh position={[-1.2, 0.2, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.065, 0.065, 2.2, 16]} />
            </mesh>
            <mesh position={[1.2, 0.2, 0]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.065, 0.065, 2.2, 16]} />
            </mesh>
            <mesh position={[0, -0.9, 0]} rotation={[0, 0, 1.57]} material={materials.surgicalSteel}>
              <cylinderGeometry args={[0.065, 0.065, 2.4, 16]} />
            </mesh>
            {/* Pinos tensores perimétricos para sustentação do lençol */}
            {[-1.25, -0.6, 0, 0.6, 1.25].map((x, idx) => (
              <mesh key={idx} position={[x, -0.98, 0]} material={materials.knurledSteel}>
                <cylinderGeometry args={[0.025, 0.025, 0.16, 12]} />
              </mesh>
            ))}
            {[-0.4, 0.3, 1.0].map((y, idx) => (
              <React.Fragment key={idx}>
                <mesh position={[-1.28, y, 0]} rotation={[0, 0, 1.57]} material={materials.knurledSteel}>
                  <cylinderGeometry args={[0.025, 0.025, 0.16, 12]} />
                </mesh>
                <mesh position={[1.28, y, 0]} rotation={[0, 0, 1.57]} material={materials.knurledSteel}>
                  <cylinderGeometry args={[0.025, 0.025, 0.16, 12]} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        );

      // 17. GRAMPOS DE ISOLAMENTO ABSOLUTO (Fiel à Imagem 1: Grampo nº 206 com Asas, Furos da Pinça e Arco com Inscrição)
      case 'grampos_isolamento':
        return (
          <group rotation={[0.20, 0.12, 0.02]}>
            <group position={[0, -0.05, 0]}>
              {/* 1. Mandíbula e Asa Esquerda Anatômica com Furo da Pinça (Extrusão Bevelada) */}
              <mesh geometry={clamp206Geometries.leftJawGeo} material={materials.surgicalSteel} />

              {/* 2. Mandíbula e Asa Direita Anatômica com Furo da Pinça (Espelhamento Simétrico) */}
              <mesh geometry={clamp206Geometries.rightJawGeo} material={materials.surgicalSteel} />

              {/* 3. Arco Superior Posterior de Tensão em Aço Mola Temperado (Bow Ribbon da Imagem 1) */}
              <mesh position={[0, 0, -0.06]} geometry={clamp206Geometries.bowGeo} material={materials.surgicalSteel} />

              {/* 4. Inscrição Laser do Número do Grampo "206" no Centro do Arco (Imagem 1) */}
              <group position={[0, 0.935, 0.10]}>
                {/* Dígito '2' */}
                <mesh position={[-0.10, 0, 0]} material={materials.darkConnector}>
                  <boxGeometry args={[0.045, 0.055, 0.005]} />
                </mesh>
                {/* Dígito '0' */}
                <mesh position={[0, 0, 0]} material={materials.darkConnector}>
                  <torusGeometry args={[0.024, 0.006, 6, 16]} />
                </mesh>
                {/* Dígito '6' */}
                <mesh position={[0.10, 0, 0]} material={materials.darkConnector}>
                  <boxGeometry args={[0.045, 0.055, 0.005]} />
                </mesh>
              </group>
            </group>
          </group>
        );

      // 18. PINÇA PORTA-GRAMPOS DE PALMER (Fiel à Imagem 2: Modelo Cooperflex com Braços Contínuos, Mola, Trava e Alças Circulares)
      case 'pinca_palmer':
        return (
          <group rotation={[0.15, 0.18, 0.42]}>
            <group position={[0, -0.05, 0]}>
              {/* 1. Braço Esquerdo Contínuo (Bico Sinuoso + Haste + Alça Aberta da Imagem 2) */}
              <mesh position={[0, 0, 0.015]} geometry={palmerGeometries.leftArmGeo} material={materials.surgicalSteel} />

              {/* 2. Braço Direito Contínuo (Bico Sinuoso + Haste + Alça Aberta da Imagem 2) */}
              <mesh position={[0, 0, -0.035]} geometry={palmerGeometries.rightArmGeo} material={materials.surgicalSteel} />

              {/* 3. Parafuso Central de Articulação com Fenda */}
              <group position={[0, 0.05, 0]}>
                <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.075, 0.075, 0.03, 24]} />
                </mesh>
                <mesh position={[0, 0, 0.06]} material={materials.darkConnector}>
                  <boxGeometry args={[0.018, 0.12, 0.005]} />
                </mesh>
                <mesh position={[0, 0, -0.045]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.075, 0.075, 0.03, 24]} />
                </mesh>
              </group>

              {/* 4. Mola Helicoidal Expansora Interna com Pino Guia Central */}
              <group position={[0, -0.42, 0]}>
                {/* Pino guia interno */}
                <mesh position={[0, 0, 0]} material={materials.darkConnector}>
                  <cylinderGeometry args={[0.015, 0.015, 0.38, 16]} />
                </mesh>
                {/* Espiras helicoidais da mola */}
                {[-0.14, -0.09, -0.04, 0.01, 0.06, 0.11, 0.16].map((coilY, idx) => (
                  <mesh
                    key={`palmer-coil-${idx}`}
                    position={[0, coilY, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                    material={materials.surgicalSteel}
                  >
                    <torusGeometry args={[0.045, 0.012, 8, 24]} />
                  </mesh>
                ))}
              </group>

              {/* 5. Trava / Anel Retangular Deslizante de Bloqueio (Sliding Lock Collar da Imagem 2) */}
              <group position={[0, -0.68, 0]}>
                <mesh position={[0, 0, 0]} material={materials.surgicalSteel}>
                  <boxGeometry args={[0.54, 0.035, 0.09]} />
                </mesh>
                <mesh position={[-0.12, 0, 0]} material={materials.surgicalSteel}>
                  <boxGeometry args={[0.07, 0.05, 0.11]} />
                </mesh>
                <mesh position={[0.12, 0, 0]} material={materials.surgicalSteel}>
                  <boxGeometry args={[0.07, 0.05, 0.11]} />
                </mesh>
              </group>

              {/* 6. Pinos Cônicos de Engate nos Orifícios do Grampo */}
              {/* Pino do bico esquerdo */}
              <group position={[-0.14, 2.05, 0.03]}>
                <mesh position={[0.025, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.014, 0.018, 0.05, 12]} />
                </mesh>
                <mesh position={[0.05, 0, 0]} material={materials.surgicalSteel}>
                  <sphereGeometry args={[0.015, 12, 12]} />
                </mesh>
              </group>
              {/* Pino do bico direito */}
              <group position={[0.14, 2.05, -0.01]}>
                <mesh position={[-0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.014, 0.018, 0.05, 12]} />
                </mesh>
                <mesh position={[-0.05, 0, 0]} material={materials.surgicalSteel}>
                  <sphereGeometry args={[0.015, 12, 12]} />
                </mesh>
              </group>
            </group>
          </group>
        );

      // 19. PERFURADOR DE LENÇOL DE AINSWORTH (Fiel à Imagem 1: Perfil Horizontal com Disco Giratório e Cabos Curvos)
      case 'perfurador_ainsworth':
        return (
          <group rotation={[0.10, 0.15, -0.04]}>
            <group position={[-0.15, 0, 0]}>
              {/* 1. Braço Superior: Mandíbula Superior com Garganta em U e Cabo Anatômico */}
              <mesh position={[0, 0, 0.02]} geometry={ainsworthGeometries.upperArmGeo} material={materials.surgicalSteel} />

              {/* 2. Braço Inferior: Mandíbula Inferior de Apoio e Cabo Anatômico */}
              <mesh position={[0, 0, -0.02]} geometry={ainsworthGeometries.lowerArmGeo} material={materials.surgicalSteel} />

              {/* 3. Disco Giratório Multi-Furos de Perfuração na Mandíbula Superior (Imagem 1) */}
              <group position={[-1.40, 0.23, 0.06]}>
                {/* Disco circular usinado em aço cirúrgico */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.22, 0.22, 0.10, 32]} />
                </mesh>
                {/* Borda perimétrica serrilhada/estriada para giro manual do disco */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.knurledSteel}>
                  <torusGeometry args={[0.22, 0.012, 8, 36]} />
                </mesh>
                {/* Rebite/parafuso de fixação central do disco giratório */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkConnector}>
                  <cylinderGeometry args={[0.06, 0.06, 0.13, 20]} />
                </mesh>

                {/* 5 Orifícios de Diâmetros Calibrados Decrescentes (0,5 mm a 2,5 mm da foto) */}
                {[
                  { angle: -Math.PI * 0.45, r: 0.018 }, // Orifício 1: incisivos inferiores
                  { angle: -Math.PI * 0.25, r: 0.025 }, // Orifício 2: incisivos superiores
                  { angle: 0, r: 0.034 },               // Orifício 3: pré-molares e caninos
                  { angle: Math.PI * 0.25, r: 0.042 },  // Orifício 4: molares
                  { angle: Math.PI * 0.45, r: 0.050 },  // Orifício 5: dentes com grampo
                ].map((hole, idx) => (
                  <mesh
                    key={`punch-hole-${idx}`}
                    position={[Math.cos(hole.angle) * 0.14, 0, Math.sin(hole.angle) * 0.14]}
                    rotation={[Math.PI / 2, 0, 0]}
                    material={materials.darkConnector}
                  >
                    <cylinderGeometry args={[hole.r, hole.r, 0.11, 16]} />
                  </mesh>
                ))}
              </group>

              {/* 4. Pino Perfurador Cilíndrico-Cônico Afiado na Mandíbula Inferior (Imagem 1) */}
              <group position={[-1.40, -0.05, 0.06]}>
                {/* Haste cilíndrica vertical do pino perfurador */}
                <mesh position={[0, 0.04, 0]} material={materials.surgicalSteel}>
                  <cylinderGeometry args={[0.035, 0.035, 0.14, 16]} />
                </mesh>
                {/* Ponta cônica afiada de corte preciso */}
                <mesh position={[0, 0.14, 0]} material={materials.surgicalSteel}>
                  <coneGeometry args={[0.035, 0.07, 16]} />
                </mesh>
              </group>

              {/* 5. Articulação Central em Tesoura com Parafuso Pivô Fendado */}
              <mesh position={[0, 0, 0.03]} material={materials.surgicalSteel}>
                <cylinderGeometry args={[0.13, 0.13, 0.12, 32]} />
              </mesh>
              <mesh position={[0, 0, 0.092]} material={materials.darkConnector}>
                <boxGeometry args={[0.022, 0.15, 0.005]} />
              </mesh>

              {/* 6. Mola Interna de Lâmina entre os Cabos */}
              <mesh position={[0.42, 0.0, 0.03]} rotation={[0, 0, 0.05]} material={materials.surgicalSteel}>
                <boxGeometry args={[0.38, 0.025, 0.05]} />
              </mesh>
            </group>
          </group>
        );

      default:
        return (
          <mesh material={materials.surgicalSteel}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef} name="dental_instrument_display">
      {renderInstrumentMesh()}
    </group>
  );
};

