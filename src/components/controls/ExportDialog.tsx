import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Box,
  Alert,
  Divider,
} from '@mui/material';

// EXCLUSIVAMENTE ÍCONES DO MATERIAL UI
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { useAnatomyStore } from '@/stores/useAnatomyStore';
import { anatomicalStructures } from '@/data/anatomy/structures';
import { exportService, ExportOptions } from '@/services/exportService';
import { themeTokens } from '@/theme/tokens';

export const ExportDialog: React.FC = () => {
  const { exportDialogOpen, selectedStructureId, setExportDialogOpen } = useAnatomyStore();

  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [transparent, setTransparent] = useState<boolean>(false);
  const [resolution, setResolution] = useState<1 | 2>(1);
  const [includeLabels, setIncludeLabels] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);

  const selectedStructure = selectedStructureId ? anatomicalStructures[selectedStructureId] : null;

  const handleExport = async () => {
    try {
      setExporting(true);
      // Obter elemento canvas 3D ativo
      const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
      if (!canvas) {
        alert('Canvas 3D não encontrado para captura.');
        return;
      }

      const options: ExportOptions = {
        format,
        transparent: format === 'png' ? transparent : false,
        resolutionMultiplier: resolution,
        includeStructureLabel: includeLabels,
        selectedStructureName: selectedStructure?.name,
        selectedStructureScientific: selectedStructure?.scientificName,
      };

      await exportService.captureAndDownload(canvas, options);
      setExportDialogOpen(false);
    } catch (err) {
      console.error('Erro na exportação:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog
      open={exportDialogOpen}
      onClose={() => setExportDialogOpen(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: themeTokens.colors.bgSecondary,
          border: `1px solid ${themeTokens.colors.borderSubtle}`,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CameraAltIcon sx={{ color: themeTokens.colors.brandCyan }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Exportar Imagem Anatômica
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: themeTokens.colors.borderSubtle, py: 2 }}>
        {/* Formato de Arquivo */}
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel sx={{ color: themeTokens.colors.textSecondary, fontSize: '0.82rem', fontWeight: 600 }}>
            Formato da Imagem
          </FormLabel>
          <RadioGroup row value={format} onChange={(e) => setFormat(e.target.value as 'png' | 'jpg')}>
            <FormControlLabel
              value="png"
              control={<Radio size="small" sx={{ color: themeTokens.colors.brandCyan }} />}
              label="PNG (Sem perdas)"
            />
            <FormControlLabel
              value="jpg"
              control={<Radio size="small" sx={{ color: themeTokens.colors.brandCyan }} />}
              label="JPG (Fundo escuro)"
            />
          </RadioGroup>
        </FormControl>

        {/* Resolução de Renderização */}
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel sx={{ color: themeTokens.colors.textSecondary, fontSize: '0.82rem', fontWeight: 600 }}>
            Resolução de Saída
          </FormLabel>
          <RadioGroup row value={resolution} onChange={(e) => setResolution(Number(e.target.value) as 1 | 2)}>
            <FormControlLabel
              value={1}
              control={<Radio size="small" sx={{ color: themeTokens.colors.brandCyan }} />}
              label="Padrão (1x)"
            />
            <FormControlLabel
              value={2}
              control={<Radio size="small" sx={{ color: themeTokens.colors.brandCyan }} />}
              label="Alta Definição (2x HD)"
            />
          </RadioGroup>
        </FormControl>

        {/* Opções Adicionais */}
        <Box sx={{ mb: 2 }}>
          {format === 'png' && (
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={transparent}
                  onChange={(e) => setTransparent(e.target.checked)}
                  sx={{ color: themeTokens.colors.brandCyan }}
                />
              }
              label="Fundo Transparente (Sem fundo escuro)"
            />
          )}

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={includeLabels}
                onChange={(e) => setIncludeLabels(e.target.checked)}
                sx={{ color: themeTokens.colors.brandCyan }}
              />
            }
            label="Incluir identificação da estrutura selecionada"
          />
        </Box>

        {/* Aviso Obrigatório da Marca d'Água */}
        <Alert
          severity="info"
          icon={<VerifiedUserIcon fontSize="inherit" sx={{ color: themeTokens.colors.brandCyan }} />}
          sx={{
            backgroundColor: 'rgba(0, 201, 246, 0.08)',
            border: `1px solid rgba(0, 201, 246, 0.25)`,
            color: themeTokens.colors.textPrimary,
            fontSize: '0.75rem',
          }}
        >
          A marca-d'água oficial do <strong>DentNexo</strong> é automaticamente incorporada com proporções controladas no canto inferior direito para proteção científica.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setExportDialogOpen(false)} variant="outlined" size="small">
          Cancelar
        </Button>
        <Button
          onClick={handleExport}
          disabled={exporting}
          variant="contained"
          size="small"
          startIcon={<DownloadIcon />}
        >
          {exporting ? 'Renderizando...' : 'Baixar Imagem'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
