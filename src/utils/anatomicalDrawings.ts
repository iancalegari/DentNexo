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

  const isFloorOfMouth = id.includes('assoalho') || id.includes('soalho') || id.includes('sublingual') || id === 'assoalho_boca';
  const isTongue = (id.includes('lingua') || id.includes('tongue')) && !isFloorOfMouth && !id.includes('nervo_lingual');
  const isTonsils = id.includes('tonsila') || id.includes('amigdala') || id.includes('tonsil');
  const isUvula = id.includes('uvula') || id.includes('palato_mole');
  const isHyoid = id.includes('hioide') || id === 'osso_hioide';
  const isGingiva = id.includes('gengiv');

  const isMandible = id.includes('mandib') || id === 'mandibula';
  const isMaxilla = id.includes('maxil') || id === 'maxila' || id === 'seio_maxilar';
  const isTooth = id.includes('dente') || id.includes('tooth') || category === 'dental' || /^\d{2}$/.test(id);
  const isNerve = id.includes('nerv') || category === 'nervous';
  const isVessel = id.includes('arteri') || id.includes('veia') || category === 'vascular';
  const isMuscle = id.includes('masseter') || id.includes('temporal') || category === 'muscular';
  const isPeriodontal = id.includes('periodont') || (category === 'oral_tissue' && !isFloorOfMouth && !isTongue && !isTonsils && !isUvula && !isGingiva);

  if (isFloorOfMouth) {
    drawFloorOfMouthIllustration(ctx);
  } else if (isTongue) {
    drawTongueIllustration(ctx);
  } else if (isTonsils) {
    drawTonsilsIllustration(ctx);
  } else if (isUvula) {
    drawUvulaIllustration(ctx);
  } else if (isGingiva) {
    drawGingivaIllustration(ctx);
  } else if (isHyoid) {
    drawHyoidIllustration(ctx);
  } else if (isMandible) {
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
  if (id.includes('assoalho') || id.includes('soalho') || id.includes('sublingual')) return 'ESTOMATOLOGIA • ASSOALHO DA BOCA & GLÂNDULAS';
  if (id.includes('tonsila') || id.includes('amigdala')) return 'OROFARINGE • ANEL LINFÁTICO DE WALDEYER (AMÍGDALAS)';
  if (id.includes('lingua') && !id.includes('nervo')) return 'ESTOMATOLOGIA • LÍNGUA & PAPILAS GUSTATIVAS';
  if (id.includes('uvula') || id.includes('palato_mole')) return 'PALATO & OROFARINGE • PALATO MOLE & ÚVULA';
  if (id.includes('gengiv')) return 'PERIODONTIA • GENGIVA INSERIDA & MARGINAL';
  if (id.includes('mandibula')) return 'SISTEMA ESQUELÉTICO • VISCEROCRÂNIO (MANDÍBULA)';
  if (id.includes('maxila')) return 'SISTEMA ESQUELÉTICO • ESQUELETO FACIAL SUPERIOR';
  if (id.includes('hioide')) return 'OSTEOLOGIA CERVICAL • OSSO HIOIDE';
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
  ctx.fillStyle = 'rgba(236, 72, 153, 0.28)';
  ctx.fill();
  ctx.strokeStyle = '#EC4899';
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

/** Assoalho da Boca & Cavidade Sublingual (Vista Anatômica Oclusal/Sublingual) */
function drawFloorOfMouthIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 15, 0, 0, 140);
  radial.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
  radial.addColorStop(0.6, 'rgba(56, 189, 248, 0.10)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.15, 1.15);

  // 1. Arco Mandibular Anterior (Vista oclusal interna / sínfise e processo alveolar)
  ctx.beginPath();
  ctx.moveTo(-90, 45);
  ctx.bezierCurveTo(-75, -20, -50, -55, 0, -60);
  ctx.bezierCurveTo(50, -55, 75, -20, 90, 45);
  ctx.bezierCurveTo(72, 40, 45, -35, 0, -42);
  ctx.bezierCurveTo(-45, -35, -72, 40, -90, 45);
  ctx.closePath();

  const boneGrad = ctx.createLinearGradient(0, -60, 0, 45);
  boneGrad.addColorStop(0, '#E2E8F0');
  boneGrad.addColorStop(0.5, '#CBD5E1');
  boneGrad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = boneGrad;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dentes Incisivos e Caninos Inferiores na crista anterior
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1;
  const teethPositions = [
    { x: -38, y: -44, w: 10, h: 10, rot: -0.35 },
    { x: -25, y: -52, w: 9, h: 8, rot: -0.2 },
    { x: -11, y: -56, w: 8, h: 7, rot: -0.08 },
    { x: 3, y: -56, w: 8, h: 7, rot: 0.08 },
    { x: 16, y: -52, w: 9, h: 8, rot: 0.2 },
    { x: 28, y: -44, w: 10, h: 10, rot: 0.35 },
  ];
  teethPositions.forEach(t => {
    ctx.save();
    ctx.translate(t.x + t.w / 2, t.y + t.h / 2);
    ctx.rotate(t.rot);
    ctx.beginPath();
    ctx.roundRect(-t.w / 2, -t.h / 2, t.w, t.h, [2, 2, 2, 2]);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  // 2. Fundo/Bacia do Assoalho da Boca (Músculos Milo-hióideo & Genio-hióideo revestidos de mucosa)
  ctx.beginPath();
  ctx.moveTo(-68, 38);
  ctx.bezierCurveTo(-45, -30, -28, -38, 0, -38);
  ctx.bezierCurveTo(28, -38, 45, -30, 68, 38);
  ctx.bezierCurveTo(45, 52, -45, 52, -68, 38);
  ctx.closePath();

  const floorGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 60);
  floorGrad.addColorStop(0, '#FB7185');
  floorGrad.addColorStop(0.5, '#E11D48');
  floorGrad.addColorStop(1, '#9F1239');
  ctx.fillStyle = floorGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(251, 113, 133, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. Ventre da Língua (Língua erguida revelando a face inferior sublingual)
  ctx.beginPath();
  ctx.moveTo(-42, 45);
  ctx.bezierCurveTo(-38, 5, -28, -15, 0, -22);
  ctx.bezierCurveTo(28, -15, 38, 5, 42, 45);
  ctx.bezierCurveTo(25, 48, -25, 48, -42, 45);
  ctx.closePath();

  const tongueVenterGrad = ctx.createLinearGradient(0, -22, 0, 45);
  tongueVenterGrad.addColorStop(0, '#FDA4AF');
  tongueVenterGrad.addColorStop(0.6, '#F43F5E');
  tongueVenterGrad.addColorStop(1, '#BE123C');
  ctx.fillStyle = tongueVenterGrad;
  ctx.fill();
  ctx.strokeStyle = '#FECDD3';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 4. Veias Sublinguais Profundas (Veias Râninas - azuladas no ventre lingual)
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#6366F1';
  ctx.beginPath();
  ctx.moveTo(-16, -12);
  ctx.bezierCurveTo(-20, 5, -22, 22, -26, 38);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(16, -12);
  ctx.bezierCurveTo(20, 5, 22, 22, 26, 38);
  ctx.stroke();

  // 5. Frênulo Lingual Mediano (Frenulum linguae)
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(0, 18);
  ctx.strokeStyle = '#FFF1F2';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(0, 16);
  ctx.strokeStyle = '#FDA4AF';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 6. Carúnculas Sublinguais (Carunculae sublinguales com óstio do ducto de Wharton)
  // Carúncula esquerda
  ctx.beginPath();
  ctx.arc(-7, 20, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FB7185';
  ctx.fill();
  ctx.strokeStyle = '#FFE4E6';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-7, 20, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#4C0519';
  ctx.fill();

  // Carúncula direita
  ctx.beginPath();
  ctx.arc(7, 20, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FB7185';
  ctx.fill();
  ctx.strokeStyle = '#FFE4E6';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(7, 20, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#4C0519';
  ctx.fill();

  // 7. Pregas Sublinguais (Plicae sublinguales sobre glândulas sublinguais)
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(253, 164, 175, 0.7)';
  ctx.beginPath();
  ctx.moveTo(-11, 23);
  ctx.bezierCurveTo(-28, 26, -42, 28, -52, 34);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(11, 23);
  ctx.bezierCurveTo(28, 26, 42, 28, 52, 34);
  ctx.stroke();

  // Óstios menores (ductos de Rivinus)
  ctx.fillStyle = '#FFE4E6';
  [-22, -34, -45, 22, 34, 45].forEach((px) => {
    const py = 25 + Math.abs(px) * 0.16;
    ctx.beginPath();
    ctx.arc(px, py, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Callouts
  ctx.strokeStyle = 'rgba(0, 201, 246, 0.6)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(10, 21);
  ctx.lineTo(35, 10);
  ctx.lineTo(60, 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(-25, -18);
  ctx.lineTo(-55, -18);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00C9F6';
  ctx.beginPath();
  ctx.arc(60, 10, 2, 0, Math.PI * 2);
  ctx.arc(-55, -18, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Ductos de Wharton', 28, 6);
  ctx.textAlign = 'right';
  ctx.fillText('Frênulo Lingual', -28, -22);

  ctx.restore();
}

/** Língua & Papilas Gustativas (Vista Dorsal) */
function drawTongueIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 15, 0, 0, 135);
  radial.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 135, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.15, 1.15);

  // Contorno da Língua em ogiva (ápice na frente, corpo e raiz posterior)
  ctx.beginPath();
  ctx.moveTo(0, 58);
  ctx.bezierCurveTo(-38, 52, -55, 20, -52, -25);
  ctx.bezierCurveTo(-50, -50, -35, -65, 0, -65);
  ctx.bezierCurveTo(35, -65, 50, -50, 52, -25);
  ctx.bezierCurveTo(55, 20, 38, 52, 0, 58);
  ctx.closePath();

  const tongueGrad = ctx.createLinearGradient(0, -65, 0, 58);
  tongueGrad.addColorStop(0, '#9F1239');
  tongueGrad.addColorStop(0.35, '#BE123C');
  tongueGrad.addColorStop(0.7, '#E11D48');
  tongueGrad.addColorStop(1, '#FB7185');
  ctx.fillStyle = tongueGrad;
  ctx.fill();
  ctx.strokeStyle = '#FECDD3';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Sulco Mediano da Língua
  ctx.beginPath();
  ctx.moveTo(0, 48);
  ctx.lineTo(0, -12);
  ctx.strokeStyle = 'rgba(159, 18, 57, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // V Lingual (Sulco Terminal)
  ctx.beginPath();
  ctx.moveTo(-38, -24);
  ctx.lineTo(0, -12);
  ctx.lineTo(38, -24);
  ctx.strokeStyle = '#881337';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Forame Cego
  ctx.beginPath();
  ctx.arc(0, -12, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#4C0519';
  ctx.fill();
  ctx.strokeStyle = '#FDA4AF';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Papilas Circunvaladas / Valadas
  const circumvallate = [
    { x: -32, y: -22 },
    { x: -24, y: -19 },
    { x: -16, y: -16 },
    { x: -8, y: -14 },
    { x: 8, y: -14 },
    { x: 16, y: -16 },
    { x: 24, y: -19 },
    { x: 32, y: -22 },
  ];
  circumvallate.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#F43F5E';
    ctx.fill();
    ctx.strokeStyle = '#FFE4E6';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Raiz Lingual (Folículos Linfóides / Tonsila Lingual)
  ctx.fillStyle = 'rgba(136, 19, 55, 0.6)';
  for (let i = 0; i < 18; i++) {
    const rx = -28 + (i % 6) * 11 + ((i * 7) % 5);
    const ry = -32 - Math.floor(i / 6) * 10;
    ctx.beginPath();
    ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Papilas Fungiformes
  ctx.fillStyle = '#FDA4AF';
  [
    { x: -18, y: 12 }, { x: 18, y: 15 }, { x: -8, y: 32 }, { x: 10, y: 34 },
    { x: -25, y: 28 }, { x: 24, y: 26 }, { x: 0, y: 44 }, { x: -14, y: 2 },
    { x: 14, y: 0 }, { x: -26, y: -4 }, { x: 28, y: -2 }
  ].forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Callout V Lingual
  ctx.strokeStyle = 'rgba(0, 201, 246, 0.6)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(28, -20);
  ctx.lineTo(58, -32);
  ctx.lineTo(75, -32);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00C9F6';
  ctx.beginPath();
  ctx.arc(75, -32, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 8.5px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Papilas Valadas (V Lingual)', 42, -37);

  ctx.restore();
}

/** Tonsilas Palatinas & Orofaringe (Amígdalas com Criptas) */
function drawTonsilsIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 15, 0, 0, 135);
  radial.addColorStop(0, 'rgba(225, 29, 72, 0.22)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 135, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.15, 1.15);

  // Palato Mole Superior & Arcada Orofaringea
  ctx.beginPath();
  ctx.moveTo(-75, -35);
  ctx.bezierCurveTo(-50, -60, 50, -60, 75, -35);
  ctx.bezierCurveTo(60, 15, 45, 45, 0, 50);
  ctx.bezierCurveTo(-45, 45, -60, 15, -75, -35);
  ctx.closePath();
  ctx.fillStyle = '#4C0519';
  ctx.fill();

  // Arco Palatoglosso & Palato Mole
  ctx.beginPath();
  ctx.moveTo(-70, -35);
  ctx.bezierCurveTo(-40, -50, 0, -52, 0, -52);
  ctx.bezierCurveTo(0, -52, 40, -50, 70, -35);
  ctx.bezierCurveTo(60, 5, 45, 30, 40, 42);
  ctx.bezierCurveTo(36, 15, 28, -25, 0, -25);
  ctx.bezierCurveTo(-28, -25, -36, 15, -40, 42);
  ctx.bezierCurveTo(-45, 30, -60, 5, -70, -35);
  ctx.closePath();

  const mucosaGrad = ctx.createLinearGradient(0, -52, 0, 42);
  mucosaGrad.addColorStop(0, '#FB7185');
  mucosaGrad.addColorStop(0.6, '#E11D48');
  mucosaGrad.addColorStop(1, '#9F1239');
  ctx.fillStyle = mucosaGrad;
  ctx.fill();
  ctx.strokeStyle = '#FECDD3';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Úvula Palatina Suspensa na Linha Média
  ctx.beginPath();
  ctx.moveTo(-9, -25);
  ctx.bezierCurveTo(-8, -5, -6, 8, 0, 12);
  ctx.bezierCurveTo(6, 8, 8, -5, 9, -25);
  ctx.closePath();
  const uvulaGrad = ctx.createLinearGradient(0, -25, 0, 12);
  uvulaGrad.addColorStop(0, '#FDA4AF');
  uvulaGrad.addColorStop(1, '#E11D48');
  ctx.fillStyle = uvulaGrad;
  ctx.fill();
  ctx.strokeStyle = '#FFE4E6';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Amígdala Esquerda (Tonsila Palatina na fossa tonsilar)
  ctx.beginPath();
  ctx.ellipse(-48, 2, 16, 26, -0.2, 0, Math.PI * 2);
  const leftTonsilGrad = ctx.createRadialGradient(-48, 2, 4, -48, 2, 24);
  leftTonsilGrad.addColorStop(0, '#FDA4AF');
  leftTonsilGrad.addColorStop(0.7, '#E11D48');
  leftTonsilGrad.addColorStop(1, '#881337');
  ctx.fillStyle = leftTonsilGrad;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Criptas da Amígdala Esquerda
  ctx.fillStyle = '#4C0519';
  [
    { x: -50, y: -12, w: 5, h: 2, rot: 0.2 },
    { x: -44, y: -4, w: 7, h: 2.5, rot: -0.3 },
    { x: -52, y: 5, w: 6, h: 2.2, rot: 0.1 },
    { x: -45, y: 14, w: 5, h: 2, rot: -0.2 },
    { x: -49, y: 20, w: 4, h: 1.8, rot: 0.3 }
  ].forEach(c => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, c.w, c.h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Amígdala Direita (Tonsila Palatina)
  ctx.beginPath();
  ctx.ellipse(48, 2, 16, 26, 0.2, 0, Math.PI * 2);
  const rightTonsilGrad = ctx.createRadialGradient(48, 2, 4, 48, 2, 24);
  rightTonsilGrad.addColorStop(0, '#FDA4AF');
  rightTonsilGrad.addColorStop(0.7, '#E11D48');
  rightTonsilGrad.addColorStop(1, '#881337');
  ctx.fillStyle = rightTonsilGrad;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Criptas da Amígdala Direita
  ctx.fillStyle = '#4C0519';
  [
    { x: 50, y: -12, w: 5, h: 2, rot: -0.2 },
    { x: 44, y: -4, w: 7, h: 2.5, rot: 0.3 },
    { x: 52, y: 5, w: 6, h: 2.2, rot: -0.1 },
    { x: 45, y: 14, w: 5, h: 2, rot: 0.2 },
    { x: 49, y: 20, w: 4, h: 1.8, rot: -0.3 }
  ].forEach(c => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, c.w, c.h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Callout da Amígdala
  ctx.strokeStyle = 'rgba(0, 201, 246, 0.7)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(56, 4);
  ctx.lineTo(82, -8);
  ctx.lineTo(100, -8);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00C9F6';
  ctx.beginPath();
  ctx.arc(100, -8, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 8.5px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Criptas Tonsilares', 98, -13);

  ctx.restore();
}

/** Palato Mole & Úvula Palatina */
function drawUvulaIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 15, 0, 0, 130);
  radial.addColorStop(0, 'rgba(244, 63, 94, 0.2)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 130, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.15, 1.15);

  // Palato Mole Arqueado
  ctx.beginPath();
  ctx.moveTo(-80, -45);
  ctx.bezierCurveTo(-45, -55, 45, -55, 80, -45);
  ctx.bezierCurveTo(70, -10, 40, 15, 14, 0);
  // Úvula central pendente
  ctx.bezierCurveTo(12, 20, 8, 38, 0, 42);
  ctx.bezierCurveTo(-8, 38, -12, 20, -14, 0);
  ctx.bezierCurveTo(-40, 15, -70, -10, -80, -45);
  ctx.closePath();

  const palGrad = ctx.createLinearGradient(0, -55, 0, 42);
  palGrad.addColorStop(0, '#FB7185');
  palGrad.addColorStop(0.6, '#F43F5E');
  palGrad.addColorStop(1, '#BE123C');
  ctx.fillStyle = palGrad;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Rafe do Palato
  ctx.beginPath();
  ctx.moveTo(0, -52);
  ctx.lineTo(0, 36);
  ctx.strokeStyle = '#FFE4E6';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Callout da Úvula
  ctx.strokeStyle = 'rgba(0, 201, 246, 0.7)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(6, 26);
  ctx.lineTo(40, 32);
  ctx.lineTo(65, 32);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00C9F6';
  ctx.beginPath();
  ctx.arc(65, 32, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 8.5px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Úvula Palatina', 38, 25);

  ctx.restore();
}

/** Gengiva Inserida e Mucosa Alveolar */
function drawGingivaIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 15, 0, 0, 130);
  radial.addColorStop(0, 'rgba(244, 63, 94, 0.2)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 130, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.15, 1.15);

  // Mucosa Alveolar (fundo vermelho vivo não queratinizado)
  ctx.beginPath();
  ctx.rect(-80, -50, 160, 40);
  ctx.fillStyle = '#BE123C';
  ctx.fill();

  // Junção Mucogengival (linha festonada divisória)
  ctx.beginPath();
  ctx.moveTo(-80, -10);
  for (let x = -80; x <= 80; x += 20) {
    ctx.quadraticCurveTo(x + 10, -5, x + 20, -10);
  }
  ctx.strokeStyle = '#FDA4AF';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Faixa de Gengiva Inserida (rósea queratinizada)
  ctx.beginPath();
  ctx.moveTo(-80, -10);
  for (let x = -80; x <= 80; x += 20) {
    ctx.quadraticCurveTo(x + 10, -5, x + 20, -10);
  }
  ctx.lineTo(80, 22);
  ctx.bezierCurveTo(60, 30, 40, 15, 20, 22);
  ctx.bezierCurveTo(0, 30, -20, 15, -40, 22);
  ctx.bezierCurveTo(-60, 30, -70, 15, -80, 22);
  ctx.closePath();

  const gingivaGrad = ctx.createLinearGradient(0, -10, 0, 25);
  gingivaGrad.addColorStop(0, '#FB7185');
  gingivaGrad.addColorStop(0.5, '#F43F5E');
  gingivaGrad.addColorStop(1, '#FDA4AF');
  ctx.fillStyle = gingivaGrad;
  ctx.fill();
  ctx.strokeStyle = '#FFE4E6';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Pontilhado característico em casca de laranja (Stippling)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let row = -2; row <= 16; row += 5) {
    for (let col = -65; col <= 65; col += 7) {
      if ((row + col) % 3 === 0) {
        ctx.beginPath();
        ctx.arc(col + ((row * 3) % 4), row, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Coroas Dentais Emergindo da Gengiva
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.5;
  [-50, -10, 30, 70].forEach(cx => {
    ctx.beginPath();
    ctx.moveTo(cx - 14, 20);
    ctx.bezierCurveTo(cx - 15, 45, cx - 12, 58, cx, 58);
    ctx.bezierCurveTo(cx + 12, 58, cx + 15, 45, cx + 14, 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Callout da Gengiva Inserida
  ctx.strokeStyle = 'rgba(0, 201, 246, 0.7)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(10, 8);
  ctx.lineTo(45, -25);
  ctx.lineTo(75, -25);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00C9F6';
  ctx.beginPath();
  ctx.arc(75, -25, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 8.5px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Gengiva Ceratinizada', 72, -30);

  ctx.restore();
}

/** Osso Hioide (Vista Anterior/Superior em U) */
function drawHyoidIllustration(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(0, 0, 15, 0, 0, 130);
  radial.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, 130, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(1.15, 1.15);

  // Corpo do Osso Hioide
  ctx.beginPath();
  ctx.moveTo(-35, 12);
  ctx.bezierCurveTo(-20, 22, 20, 22, 35, 12);
  ctx.bezierCurveTo(32, 2, -32, 2, -35, 12);
  ctx.closePath();
  const hyoidGrad = ctx.createLinearGradient(0, 0, 0, 22);
  hyoidGrad.addColorStop(0, '#F8FAFC');
  hyoidGrad.addColorStop(0.5, '#CBD5E1');
  hyoidGrad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = hyoidGrad;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Cornos Maiores
  ctx.beginPath();
  ctx.moveTo(-32, 8);
  ctx.bezierCurveTo(-55, 0, -75, -25, -78, -48);
  ctx.bezierCurveTo(-72, -49, -65, -30, -32, 3);
  ctx.closePath();
  ctx.fillStyle = hyoidGrad;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(32, 8);
  ctx.bezierCurveTo(55, 0, 75, -25, 78, -48);
  ctx.bezierCurveTo(72, -49, 65, -30, 32, 3);
  ctx.closePath();
  ctx.fillStyle = hyoidGrad;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Cornos Menores
  ctx.beginPath();
  ctx.moveTo(-28, 5);
  ctx.lineTo(-32, -12);
  ctx.lineTo(-24, 4);
  ctx.closePath();
  ctx.fillStyle = '#E2E8F0';
  ctx.fill();
  ctx.strokeStyle = '#00C9F6';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(28, 5);
  ctx.lineTo(32, -12);
  ctx.lineTo(24, 4);
  ctx.closePath();
  ctx.fillStyle = '#E2E8F0';
  ctx.fill();
  ctx.strokeStyle = '#00C9F6';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Callout Corno Maior
  ctx.strokeStyle = 'rgba(0, 201, 246, 0.7)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(70, -32);
  ctx.lineTo(92, -32);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#00C9F6';
  ctx.beginPath();
  ctx.arc(92, -32, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 8.5px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Corno Maior', 90, -37);

  ctx.restore();
}
