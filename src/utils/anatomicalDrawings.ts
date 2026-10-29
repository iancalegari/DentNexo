/**
 * Gerador de Ilustrações Anatômicas Clínicas em Canvas/DataURI
 * Produz ilustrações de ossos, dentes, nervos, músculos e tecidos periodontais
 * para acompanhamento visual das anotações em tela e nos relatórios em PDF.
 */

export interface AnatomicalCardOptions {
  structureId: string;
  structureName: string;
  category?: string;
  width?: number;
  height?: number;
}

export const getStructureIllustration = (options: AnatomicalCardOptions): string => {
  const { structureId, structureName, category = 'skeletal', width = 600, height = 450 } = options;

  // Em ambiente onde document não existe (SSR), retornar string vazia
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const id = structureId.toLowerCase();

  // 1. Fundo Gradiente Médico Escuro de Alta Resolução
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090D14');
  bgGrad.addColorStop(0.5, '#0E1726');
  bgGrad.addColorStop(1, '#070A0F');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Grade sutil de fundo estilo milimetrado clínico
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 25;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Moldura / Borda de Contêiner Clínico
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, width - 16, height - 16);

  // Cantoneiras estéticas de visor hospitalar
  const cornerSize = 14;
  ctx.strokeStyle = '#00C9F6';
  ctx.lineWidth = 2.5;

  // Superior Esquerda
  ctx.beginPath();
  ctx.moveTo(8, 8 + cornerSize);
  ctx.lineTo(8, 8);
  ctx.lineTo(8 + cornerSize, 8);
  ctx.stroke();

  // Superior Direita
  ctx.beginPath();
  ctx.moveTo(width - 8 - cornerSize, 8);
  ctx.lineTo(width - 8, 8);
  ctx.lineTo(width - 8, 8 + cornerSize);
  ctx.stroke();

  // Inferior Esquerda
  ctx.beginPath();
  ctx.moveTo(8, height - 8 - cornerSize);
  ctx.lineTo(8, height - 8);
  ctx.lineTo(8 + cornerSize, height - 8);
  ctx.stroke();

  // Inferior Direita
  ctx.beginPath();
  ctx.moveTo(width - 8 - cornerSize, height - 8);
  ctx.lineTo(width - 8, height - 8);
  ctx.lineTo(width - 8, height - 8 - cornerSize);
  ctx.stroke();

  // 2. Renderização da Silhueta Anatômica Específica
  ctx.save();
  ctx.translate(width / 2, height / 2 - 18);

  const isMandible = id.includes('mandib') || id === 'mandibula';
  const isMaxilla = id.includes('maxil') || id === 'maxila' || id.includes('seio');
  const isTooth = id.includes('dente') || id.includes('tooth') || category === 'dental' || /^\d{2}$/.test(id);
  const isNerve = id.includes('nerv') || category === 'nervous';
  const isVessel = id.includes('arteri') || id.includes('veia') || category === 'vascular';
  const isMuscle = id.includes('masseter') || id.includes('temporal') || category === 'muscular';
  const isPeriodontal = id.includes('periodont') || id.includes('gengiv') || category === 'oral_tissue';

  if (isMandible) {
    drawMandibleIllustration(ctx);
  } else if (isMaxilla) {
    drawMaxillaIllustration(ctx);
  } else if (isTooth) {
    drawToothIllustration(ctx, id);
  } else if (isNerve) {
    drawNerveIllustration(ctx);
  } else if (isVessel) {
    drawVascularIllustration(ctx);
  } else if (isMuscle) {
    drawMuscleIllustration(ctx);
  } else if (isPeriodontal) {
    drawPeriodontalIllustration(ctx);
  } else {
    drawSkullIllustration(ctx);
  }
  ctx.restore();

  // 3. Tipografia e Metadados Clínicos no Rodapé do Card
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(structureName.toUpperCase(), width / 2, height - 42);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 12px "Segoe UI", Roboto, sans-serif';
  const catLabel = getCategoryLabel(category, id);
  ctx.fillText(catLabel, width / 2, height - 22);

  // Logotipo DentNexo sutil no canto superior
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('DENTNEXO 3D', width - 20, 26);

  ctx.fillStyle = '#00C9F6';
  ctx.beginPath();
  ctx.arc(width - 96, 22, 3.5, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/png');
};

const getCategoryLabel = (category: string, id: string): string => {
  if (id.includes('mandibula')) return 'SISTEMA ESQUELÉTICO • VISCEROCRÂNIO (MANDÍBULA)';
  if (id.includes('maxila')) return 'SISTEMA ESQUELÉTICO • ESQUELETO FACIAL SUPERIOR';
  if (category === 'dental' || id.includes('dente') || id.includes('tooth')) return 'ANATOMIA DENTAL • ODONTOLOGIA CLÍNICA';
  if (category === 'nervous' || id.includes('nerv')) return 'NEUROANATOMIA • INERVAÇÃO CRANIOFACIAL';
  if (category === 'vascular' || id.includes('arteri')) return 'ANGIOLOGIA • VASCULARIZAÇÃO MAXILOFACIAL';
  if (category === 'muscular') return 'MIOLOGIA • MÚSCULOS DA MASTIGAÇÃO';
  if (category === 'oral_tissue') return 'PERIODONTIA • TECIDOS PERIODONTAIS E MUCOSA';
  return 'OSTEOLOGIA • ESQUELETO CRANIOFACIAL';
};

// ------------------- ILUSTRAÇÕES VETORIAIS ANATÔMICAS -------------------

/** Mandíbula Anatômica Lateral-Oblíqua */
function drawMandibleIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
  radial.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.2, 1.2);

  ctx.beginPath();
  ctx.moveTo(85, -45); // Côndilo mandibular
  ctx.bezierCurveTo(80, -55, 65, -55, 60, -45); // Cabeça da mandíbula
  ctx.bezierCurveTo(55, -25, 48, -15, 38, -10); // Incisura mandibular
  ctx.bezierCurveTo(32, -28, 22, -48, 12, -45); // Processo coronoide
  ctx.bezierCurveTo(6, -20, 0, 0, -25, 15); // Linha oblíqua
  ctx.bezierCurveTo(-55, 22, -80, 25, -105, 18); // Bordo alveolar
  ctx.bezierCurveTo(-115, 25, -118, 38, -105, 48); // Sínfise mentual
  ctx.bezierCurveTo(-80, 52, -40, 50, 10, 48); // Base da mandíbula
  ctx.bezierCurveTo(45, 48, 75, 42, 85, 25); // Ângulo da mandíbula
  ctx.bezierCurveTo(90, 8, 88, -20, 85, -45); // Bordo posterior do ramo
  ctx.closePath();

  const boneGrad = ctx.createLinearGradient(-100, -50, 90, 50);
  boneGrad.addColorStop(0, '#E2E8F0');
  boneGrad.addColorStop(0.45, '#CBD5E1');
  boneGrad.addColorStop(0.8, '#94A3B8');
  boneGrad.addColorStop(1, '#64748B');
  ctx.fillStyle = boneGrad;
  ctx.fill();

  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Forame Mentual
  ctx.beginPath();
  ctx.arc(-55, 34, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.strokeStyle = '#00C9F6';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Canal Mandibular Interno (traçado pontilhado radiográfico)
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.moveTo(70, -10);
  ctx.bezierCurveTo(60, 20, 20, 36, -55, 34);
  ctx.strokeStyle = 'rgba(0, 201, 246, 0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);

  // Dentes simulados na arcada alveolar
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const tx = -100 + i * 14;
    const ty = 18 - i * 1.5;
    ctx.beginPath();
    ctx.roundRect(tx, ty - 12, 10, 12, [3, 3, 0, 0]);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/** Maxila e Seio Maxilar */
function drawMaxillaIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 10, 0, 0, 130);
  radial.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 130, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.15, 1.15);

  ctx.beginPath();
  ctx.moveTo(-15, -65);
  ctx.bezierCurveTo(-5, -35, 10, -25, 45, -20);
  ctx.bezierCurveTo(75, -15, 80, 10, 65, 28);
  ctx.bezierCurveTo(55, 40, 45, 52, 25, 55);
  ctx.bezierCurveTo(0, 58, -35, 56, -65, 52);
  ctx.bezierCurveTo(-75, 42, -75, 20, -60, 5);
  ctx.bezierCurveTo(-50, -10, -35, -45, -15, -65);
  ctx.closePath();

  const maxGrad = ctx.createLinearGradient(-60, -60, 60, 60);
  maxGrad.addColorStop(0, '#F1F5F9');
  maxGrad.addColorStop(0.5, '#CBD5E1');
  maxGrad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = maxGrad;
  ctx.fill();
  ctx.strokeStyle = '#0EA5E9';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Cavidade do Seio Maxilar
  ctx.beginPath();
  ctx.ellipse(5, 10, 32, 24, Math.PI / 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.setLineDash([3, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Forame Infraorbital
  ctx.beginPath();
  ctx.arc(18, -6, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.stroke();

  // Dentes superiores
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#94A3B8';
  for (let i = 0; i < 5; i++) {
    const tx = -60 + i * 18;
    const ty = 54 - i * 1.5;
    ctx.beginPath();
    ctx.roundRect(tx, ty, 13, 14, [0, 0, 4, 4]);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/** Dente Anatômico com Corte Estrutural */
function drawToothIllustration(ctx: CanvasRenderingContext2D, id: string) {
  const isMolar = id.includes('16') || id.includes('17') || id.includes('26') || id.includes('27') || id.includes('36') || id.includes('37') || id.includes('46') || id.includes('47') || id.includes('molar');

  ctx.save();
  ctx.scale(1.2, 1.2);

  if (isMolar) {
    ctx.beginPath();
    ctx.moveTo(-45, -35);
    ctx.bezierCurveTo(-30, -42, -15, -42, 0, -37);
    ctx.bezierCurveTo(15, -42, 30, -42, 45, -35);
    ctx.bezierCurveTo(52, -15, 48, 5, 40, 18);
    ctx.bezierCurveTo(36, 40, 32, 65, 26, 85);
    ctx.bezierCurveTo(22, 92, 14, 92, 12, 85);
    ctx.bezierCurveTo(8, 65, 4, 45, 0, 35);
    ctx.bezierCurveTo(-6, 48, -12, 68, -20, 85);
    ctx.bezierCurveTo(-24, 92, -32, 92, -35, 85);
    ctx.bezierCurveTo(-40, 65, -44, 35, -40, 18);
    ctx.bezierCurveTo(-48, 5, -52, -15, -45, -35);
    ctx.closePath();

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-36, -26);
    ctx.bezierCurveTo(-24, -30, 0, -28, 36, -26);
    ctx.bezierCurveTo(38, -5, 30, 20, 24, 75);
    ctx.lineTo(16, 75);
    ctx.bezierCurveTo(8, 50, 4, 38, 0, 30);
    ctx.bezierCurveTo(-4, 38, -8, 50, -16, 75);
    ctx.lineTo(-24, 75);
    ctx.bezierCurveTo(-30, 20, -38, -5, -36, -26);
    ctx.closePath();
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-16, -14);
    ctx.bezierCurveTo(-8, -10, 0, -12, 16, -14);
    ctx.bezierCurveTo(14, 5, 16, 20, 19, 72);
    ctx.lineTo(16, 72);
    ctx.bezierCurveTo(11, 25, 4, 18, 0, 18);
    ctx.bezierCurveTo(-4, 18, -11, 25, -16, 72);
    ctx.lineTo(-19, 72);
    ctx.bezierCurveTo(-16, 20, -14, 5, -16, -14);
    ctx.closePath();
    ctx.fillStyle = '#F43F5E';
    ctx.fill();
    ctx.strokeStyle = '#BE123C';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-28, -45);
    ctx.bezierCurveTo(-10, -47, 10, -47, 28, -45);
    ctx.bezierCurveTo(34, -20, 28, 5, 22, 18);
    ctx.bezierCurveTo(16, 45, 10, 75, 4, 92);
    ctx.bezierCurveTo(0, 96, -4, 96, -4, 92);
    ctx.bezierCurveTo(-10, 75, -16, 45, -22, 18);
    ctx.bezierCurveTo(-28, 5, -34, -20, -28, -45);
    ctx.closePath();

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-20, -36);
    ctx.lineTo(20, -36);
    ctx.bezierCurveTo(22, -10, 16, 20, 5, 82);
    ctx.lineTo(-5, 82);
    ctx.bezierCurveTo(-16, 20, -22, -10, -20, -36);
    ctx.closePath();
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
    ctx.strokeStyle = '#EAB308';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-8, -25);
    ctx.lineTo(8, -25);
    ctx.bezierCurveTo(6, 0, 4, 30, 2, 78);
    ctx.lineTo(-2, 78);
    ctx.bezierCurveTo(-4, 30, -6, 0, -8, -25);
    ctx.closePath();
    ctx.fillStyle = '#F43F5E';
    ctx.fill();
    ctx.strokeStyle = '#BE123C';
    ctx.stroke();
  }

  ctx.restore();
}

/** Neuroanatomia / Nervo Trigêmeo */
function drawNerveIllustration(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.scale(1.2, 1.2);

  ctx.beginPath();
  ctx.ellipse(-50, -20, 20, 14, Math.PI / 6, 0, Math.PI * 2);
  ctx.fillStyle = '#F59E0B';
  ctx.fill();
  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-35, -25);
  ctx.bezierCurveTo(-10, -50, 20, -65, 55, -70);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-32, -18);
  ctx.bezierCurveTo(0, -25, 30, -20, 65, -15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-38, -10);
  ctx.bezierCurveTo(-10, 15, 10, 45, 50, 65);
  ctx.stroke();

  ctx.lineWidth = 2;
  const branches = [
    [55, -70, 75, -78],
    [55, -70, 78, -62],
    [65, -15, 85, -28],
    [65, -15, 88, -8],
    [65, -15, 82, 5],
    [50, 65, 75, 58],
    [50, 65, 70, 75],
  ];
  branches.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  ctx.restore();
}

/** Angiologia / Artérias */
function drawVascularIllustration(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.scale(1.2, 1.2);

  ctx.beginPath();
  ctx.moveTo(-60, 65);
  ctx.bezierCurveTo(-45, 30, -35, -10, -20, -35);
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-35, 10);
  ctx.bezierCurveTo(0, 0, 30, -10, 65, -15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-25, -20);
  ctx.bezierCurveTo(-5, -35, 15, -55, 45, -65);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(25, -7);
  ctx.bezierCurveTo(40, 15, 55, 35, 60, 55);
  ctx.stroke();

  ctx.restore();
}

/** Miologia */
function drawMuscleIllustration(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.scale(1.2, 1.2);

  ctx.beginPath();
  ctx.moveTo(-60, -45);
  ctx.lineTo(40, -45);
  ctx.bezierCurveTo(60, -20, 60, 20, 45, 55);
  ctx.lineTo(-50, 55);
  ctx.bezierCurveTo(-65, 20, -65, -20, -60, -45);
  ctx.closePath();

  const mGrad = ctx.createLinearGradient(-60, -45, 50, 55);
  mGrad.addColorStop(0, '#BE123C');
  mGrad.addColorStop(0.5, '#E11D48');
  mGrad.addColorStop(1, '#9F1239');
  ctx.fillStyle = mGrad;
  ctx.fill();
  ctx.strokeStyle = '#FB7185';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  for (let i = -40; i <= 30; i += 12) {
    ctx.beginPath();
    ctx.moveTo(i, -40);
    ctx.lineTo(i + 15, 50);
    ctx.stroke();
  }

  ctx.restore();
}

/** Periodonto */
function drawPeriodontalIllustration(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.scale(1.2, 1.2);

  ctx.beginPath();
  ctx.moveTo(-55, -50);
  ctx.bezierCurveTo(-45, 0, -40, 50, -45, 75);
  ctx.strokeStyle = '#F8FAFC';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(35, -25);
  ctx.bezierCurveTo(40, 10, 40, 45, 35, 75);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 18;
  ctx.stroke();

  ctx.fillStyle = '#CBD5E1';
  ctx.beginPath();
  ctx.arc(35, -25, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#14B8A6';
  ctx.lineWidth = 2;
  for (let y = -20; y <= 65; y += 8) {
    ctx.beginPath();
    ctx.moveTo(-38, y);
    ctx.lineTo(26, y + 4);
    ctx.stroke();
  }

  ctx.fillStyle = '#FB7185';
  ctx.beginPath();
  ctx.ellipse(-10, -45, 24, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Crânio Geral */
function drawSkullIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 10, 0, 0, 120);
  radial.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.15, 1.15);

  ctx.beginPath();
  ctx.moveTo(35, -60);
  ctx.bezierCurveTo(65, -40, 75, -10, 70, 20);
  ctx.bezierCurveTo(65, 45, 45, 50, 30, 48);
  ctx.bezierCurveTo(15, 48, -5, 52, -25, 48);
  ctx.bezierCurveTo(-50, 45, -65, 20, -60, -10);
  ctx.bezierCurveTo(-55, -45, -10, -65, 35, -60);
  ctx.closePath();

  const cGrad = ctx.createLinearGradient(-60, -60, 60, 60);
  cGrad.addColorStop(0, '#F8FAFC');
  cGrad.addColorStop(0.5, '#CBD5E1');
  cGrad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = cGrad;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(-35, -5, 14, 18, Math.PI / 12, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.strokeStyle = '#00C9F6';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-20, 10);
  ctx.bezierCurveTo(0, 15, 20, 15, 40, 10);
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}
