import { jsPDF } from 'jspdf';
import { UserNote } from '@/types/study';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { getStructureIllustration } from '@/utils/anatomicalDrawings';

/**
 * Converte um arquivo SVG ou URL de imagem em DataURL PNG de alta resolução
 */
export const getLogoDataUrl = async (): Promise<string> => {
  if (typeof window === 'undefined') return '';

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Timeout de segurança para não travar a exportação
    const timer = setTimeout(() => {
      resolve('');
    }, 2500);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        const ratio = (img.naturalHeight || 711) / (img.naturalWidth || 2505);
        canvas.height = Math.round(1000 * ratio) || 284;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      } catch (err) {
        console.warn('Erro ao rasterizar logotipo:', err);
        resolve('');
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve('');
    };

    img.src = '/logo_com_texto.svg';
  });
};

export interface ExportPdfOptions {
  notes: UserNote[];
  title?: string;
  studentName?: string;
  onProgress?: (progress: number, message: string) => void;
}

/**
 * Serviço de Exportação Completa de Anotações em PDF
 * - Inclui todas as anotações selecionadas
 * - Exibe a imagem anatômica (3D ou ilustração clínica) de cada estrutura vinculada
 * - Calcula quebras de página automáticas e limpas ("page-break avoid" para não cortar anotações)
 * - Estampa o logotipo oficial DentNexo no rodapé de todas as páginas
 */
export const exportNotesToPdf = async (options: ExportPdfOptions): Promise<void> => {
  const {
    notes,
    title = 'Dossiê Clínico de Anotações & Anatomia Odontológica',
    studentName = 'Estudante / Cirurgião-Dentista',
    onProgress,
  } = options;

  if (!notes || notes.length === 0) {
    throw new Error('Nenhuma anotação disponível para exportar.');
  }

  onProgress?.(10, 'Carregando logotipo e recursos visuais...');
  const logoDataUrl = await getLogoDataUrl();

  onProgress?.(30, 'Preparando ilustrações anatômicas vinculadas...');

  // Pré-gerar ou obter dataURL de imagem para cada anotação
  const processedNotes: { note: UserNote; imageDataUrl: string }[] = [];

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    let img = note.imageUrl;

    const isOralSpecial = [
      'assoalho_boca',
      'tonsilas_palatinas',
      'lingua',
      'uvula',
      'osso_hioide',
      'gengiva_inserida',
    ].includes(note.structureId);

    if (!img || (img.startsWith('data:image/png') && isOralSpecial)) {
      const struct = anatomicalStructures[note.structureId];
      img = getStructureIllustration({
        structureId: note.structureId,
        structureName: struct?.name || note.structureName || note.title,
        category: struct?.category || 'skeletal',
        width: 600,
        height: 450,
      });
    }

    processedNotes.push({
      note,
      imageDataUrl: img || '',
    });

    onProgress?.(30 + Math.round((i / notes.length) * 30), `Processando estrutura ${i + 1} de ${notes.length}...`);
  }

  onProgress?.(70, 'Diagramando páginas e verificando quebras...');

  // Inicializar jsPDF em formato A4 (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight; // 182 mm
  const marginTop = 20;
  const marginBottom = 24;
  const maxContentY = pageHeight - marginBottom; // 273 mm

  let currentY = marginTop;

  // Função para desenhar o cabeçalho de página
  const drawPageHeader = (isFirstPage: boolean) => {
    // Barra superior ciano neon
    doc.setFillColor(0, 201, 246);
    doc.rect(marginLeft, isFirstPage ? 14 : 12, contentWidth, 1.8, 'F');

    if (isFirstPage) {
      // Título Principal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42); // #0F172A
      doc.text(title.toUpperCase(), marginLeft, 22);

      // Subtítulo e Metadados
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // #64748B
      doc.text(
        `DentNexo 3D Atlas • Documento emitido em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Total: ${notes.length} anotações`,
        marginLeft,
        27
      );

      // Linha separadora suave
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(marginLeft, 31, pageWidth - marginRight, 31);

      currentY = 36;
    } else {
      // Cabeçalho compacto em páginas subsequentes
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('DENTNEXO • ANOTAÇÕES E ESTRUTURAS ANATÔMICAS', marginLeft, 18);

      doc.setFont('helvetica', 'normal');
      doc.text(new Date().toLocaleDateString('pt-BR'), pageWidth - marginRight - 18, 18);

      currentY = 22;
    }
  };

  // Desenhar cabeçalho da primeira página
  drawPageHeader(true);

  // Iterar pelas anotações e desenhar os cards com checagem de quebra
  for (let i = 0; i < processedNotes.length; i++) {
    const { note, imageDataUrl } = processedNotes[i];
    const struct = anatomicalStructures[note.structureId];

    // Dimensões do bloco de texto e da imagem
    const imageWidth = 52;
    const imageHeight = 39;
    const textAvailableWidth = contentWidth - imageWidth - 10; // ~120 mm

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const splitContent = doc.splitTextToSize(note.content, textAvailableWidth);
    const contentTextHeight = splitContent.length * 4.4;

    // Calcular altura total necessária para este card
    const headerHeight = 16;
    const tagsHeight = note.tags && note.tags.length > 0 ? 7 : 0;
    const extraInfoHeight = struct?.clinicalRelevance ? 12 : 0;
    const cardContentHeight = Math.max(contentTextHeight + tagsHeight + extraInfoHeight, imageHeight);
    const totalCardHeight = headerHeight + cardContentHeight + 10;

    // VERIFICAÇÃO DE QUEBRA DE PÁGINA (PAGE-BREAK CHECK):
    // Se o card ultrapassar a área útil da página, adiciona uma nova página limpa
    if (currentY + totalCardHeight > maxContentY) {
      doc.addPage();
      drawPageHeader(false);
    }

    const cardTopY = currentY;

    // Fundo do Card da Anotação (Cinza clínico com borda elegante)
    doc.setFillColor(248, 250, 252); // #F8FAFC
    doc.setDrawColor(203, 213, 225); // #CBD5E1
    doc.setLineWidth(0.4);
    doc.roundedRect(marginLeft, cardTopY, contentWidth, totalCardHeight, 2.5, 2.5, 'FD');

    // Faixa lateral de destaque colorida
    doc.setFillColor(0, 181, 241);
    doc.roundedRect(marginLeft, cardTopY, 2.5, totalCardHeight, 1.2, 1.2, 'F');

    // 1. Título da Anotação
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.text(note.title, marginLeft + 6, cardTopY + 7);

    // 2. Badge da Estrutura Vinculada
    const badgeText = `${note.structureName || 'Estrutura Geral'}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const badgeWidth = doc.getTextWidth(badgeText) + 8;

    doc.setFillColor(224, 242, 254); // Azul claro #E0F2FE
    doc.roundedRect(marginLeft + 6, cardTopY + 10, badgeWidth, 5.5, 1.5, 1.5, 'F');

    doc.setTextColor(3, 105, 161); // Azul escuro #0369A1
    doc.text(badgeText, marginLeft + 10, cardTopY + 14);

    // Data no canto superior direito do card
    const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('pt-BR');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // #94A3B8
    doc.text(formattedDate, pageWidth - marginRight - 6 - doc.getTextWidth(formattedDate), cardTopY + 7);

    // 3. Conteúdo da Anotação (Lado Esquerdo)
    let textCursorY = cardTopY + 21;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85); // #334155
    doc.text(splitContent, marginLeft + 6, textCursorY);
    textCursorY += contentTextHeight + 3;

    // Tags / Marcadores
    if (note.tags && note.tags.length > 0) {
      let tagX = marginLeft + 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);

      for (const tag of note.tags) {
        const tWidth = doc.getTextWidth(tag) + 6;
        if (tagX + tWidth < marginLeft + textAvailableWidth) {
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(tagX, textCursorY, tWidth, 4.5, 1, 1, 'F');
          doc.setTextColor(100, 116, 139);
          doc.text(tag, tagX + 3, textCursorY + 3.2);
          tagX += tWidth + 2.5;
        }
      }
      textCursorY += 7;
    }

    // Se houver nota de relevância clínica da estrutura anatômica
    if (struct?.clinicalRelevance) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(71, 85, 105);
      const clinicalLines = doc.splitTextToSize(`Nota Clínica: ${struct.clinicalRelevance}`, textAvailableWidth);
      doc.text(clinicalLines.slice(0, 2), marginLeft + 6, textCursorY + 2);
    }

    // 4. Imagem Anatômica Vinculada (Lado Direito do Card)
    if (imageDataUrl) {
      const imgX = pageWidth - marginRight - imageWidth - 4;
      const imgY = cardTopY + 11;

      try {
        // Moldura estética da imagem
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(imgX - 0.8, imgY - 0.8, imageWidth + 1.6, imageHeight + 1.6, 1.5, 1.5, 'F');

        doc.addImage(imageDataUrl, 'PNG', imgX, imgY, imageWidth, imageHeight);

        // Borda e Legenda da Imagem
        doc.setDrawColor(56, 189, 248);
        doc.setLineWidth(0.3);
        doc.roundedRect(imgX, imgY, imageWidth, imageHeight, 1, 1, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(100, 116, 139);
        const caption = 'Estrutura Vinculada';
        doc.text(caption, imgX + imageWidth / 2 - doc.getTextWidth(caption) / 2, imgY + imageHeight + 3.5);
      } catch (err) {
        console.warn('Erro ao inserir imagem no PDF:', err);
      }
    }

    // Avançar posição vertical para o próximo card (+ espaçamento)
    currentY += totalCardHeight + 5;
  }

  onProgress?.(90, 'Estampando rodapé com logotipo em todas as páginas...');

  // 5. ESTAMPAR RODAPÉ COM LOGOTIPO EM TODAS AS PÁGINAS ("sempre com logo nossa la embaixo")
  const totalPages = doc.getNumberOfPages();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Linha separadora superior do rodapé
    doc.setDrawColor(226, 232, 240); // #E2E8F0
    doc.setLineWidth(0.4);
    doc.line(marginLeft, pageHeight - 16, pageWidth - marginRight, pageHeight - 16);

    // Inserção do Logotipo Oficial DentNexo no Rodapé
    if (logoDataUrl) {
      try {
        // Logotipo no canto inferior esquerdo com proporção preservada
        doc.addImage(logoDataUrl, 'PNG', marginLeft, pageHeight - 13.5, 32, 9.1);
      } catch (e) {
        // Fallback tipográfico caso a imagem falhe
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 201, 246);
        doc.text('DentNexo', marginLeft, pageHeight - 8);
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 201, 246);
      doc.text('DentNexo', marginLeft, pageHeight - 8);
    }

    // Texto central informativo de conformidade acadêmica
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // #64748B
    doc.text(
      'Plataforma Digital de Anatomia e Odontologia 3D • Uso Acadêmico & Clínico',
      marginLeft + 36,
      pageHeight - 9
    );

    // Paginação no canto inferior direito
    const pageString = `Página ${p} de ${totalPages}`;
    doc.text(pageString, pageWidth - marginRight - doc.getTextWidth(pageString), pageHeight - 9);
  }

  onProgress?.(100, 'Download concluído!');

  // Salvar o arquivo PDF
  const dateFormatted = new Date().toISOString().slice(0, 10);
  doc.save(`DentNexo_Anotacoes_${dateFormatted}.pdf`);
};
