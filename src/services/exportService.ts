export interface ExportOptions {
  format: 'png' | 'jpg';
  transparent: boolean; // apenas para PNG
  resolutionMultiplier: 1 | 2;
  includeStructureLabel: boolean;
  selectedStructureName?: string;
  selectedStructureScientific?: string;
}

export const exportService = {
  async captureAndDownload(
    canvasElement: HTMLCanvasElement,
    options: ExportOptions
  ): Promise<void> {
    const width = canvasElement.width * options.resolutionMultiplier;
    const height = canvasElement.height * options.resolutionMultiplier;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) throw new Error('Não foi possível obter contexto 2D para exportação.');

    // 1. Fundo
    if (options.format === 'jpg' || !options.transparent) {
      ctx.fillStyle = '#0B0F14';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Desenhar render 3D
    ctx.drawImage(canvasElement, 0, 0, width, height);

    // 3. Informações textuais anatômicas opcionais (Canto superior esquerdo)
    if (options.includeStructureLabel && options.selectedStructureName) {
      const padding = 24 * options.resolutionMultiplier;
      ctx.save();
      ctx.fillStyle = 'rgba(18, 25, 34, 0.85)';
      ctx.strokeStyle = '#293442';
      ctx.lineWidth = 1 * options.resolutionMultiplier;
      
      const boxWidth = 320 * options.resolutionMultiplier;
      const boxHeight = 72 * options.resolutionMultiplier;
      const radius = 8 * options.resolutionMultiplier;
      
      // Box com cantos arredondados
      ctx.beginPath();
      ctx.roundRect(padding, padding, boxWidth, boxHeight, radius);
      ctx.fill();
      ctx.stroke();

      // Textos
      ctx.fillStyle = '#00C9F6';
      ctx.font = `bold ${11 * options.resolutionMultiplier}px Urbanist, sans-serif`;
      ctx.fillText('ESTRUTURA SELECIONADA', padding + 16 * options.resolutionMultiplier, padding + 22 * options.resolutionMultiplier);

      ctx.fillStyle = '#F0F4F8';
      ctx.font = `bold ${16 * options.resolutionMultiplier}px Urbanist, sans-serif`;
      ctx.fillText(options.selectedStructureName, padding + 16 * options.resolutionMultiplier, padding + 44 * options.resolutionMultiplier);

      if (options.selectedStructureScientific) {
        ctx.fillStyle = '#A2ADBA';
        ctx.font = `italic ${12 * options.resolutionMultiplier}px Urbanist, sans-serif`;
        ctx.fillText(options.selectedStructureScientific, padding + 16 * options.resolutionMultiplier, padding + 60 * options.resolutionMultiplier);
      }
      ctx.restore();
    }

    // 4. Marca-d'Água Oficial DentNexo com logo_com_texto.svg no Canto Inferior Direito
    const logoHeight = 42 * options.resolutionMultiplier;
    const logoWidth = Math.round(logoHeight * (2505 / 711));
    const paddingX = 14 * options.resolutionMultiplier;
    const paddingY = 8 * options.resolutionMultiplier;
    const boxWidth = logoWidth + paddingX * 2;
    const boxHeight = logoHeight + paddingY * 2;
    const margin = 24 * options.resolutionMultiplier;
    const wmX = width - boxWidth - margin;
    const wmY = height - boxHeight - margin;

    ctx.save();
    // Fundo semitransparente escuro para legibilidade impecável sobre qualquer estrutura 3D
    ctx.fillStyle = 'rgba(11, 15, 20, 0.82)';
    ctx.strokeStyle = 'rgba(0, 201, 246, 0.35)';
    ctx.lineWidth = 1 * options.resolutionMultiplier;
    ctx.beginPath();
    ctx.roundRect(wmX, wmY, boxWidth, boxHeight, 8 * options.resolutionMultiplier);
    ctx.fill();
    ctx.stroke();

    // Carregar e estampar a logo_com_texto.svg oficial
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/logo_com_texto.svg';
    await new Promise<void>((resolve) => {
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        resolve();
      } else {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => resolve();
      }
    });

    if (logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, wmX + paddingX, wmY + paddingY, logoWidth, logoHeight);
    }
    ctx.restore();

    // 5. Gerar arquivo e disparo do download
    const mimeType = options.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = options.format === 'jpg' ? 0.95 : undefined;
    const dataUrl = exportCanvas.toDataURL(mimeType, quality);

    const dateStr = new Date().toISOString().slice(0, 10);
    const structName = (options.selectedStructureName || 'visao_geral')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
    const fileName = `dentnexo_${structName}_${dateStr}.${options.format}`;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  },
};
