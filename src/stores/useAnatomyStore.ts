import { create } from 'zustand';
import { 
  AnatomicalRegion, 
  AnatomicalCategory,
  LayerOpacity, 
  LayerVisibility, 
  ViewPreset 
} from '@/types/anatomy';
import { 
  AlignmentState, 
  ToothViewMode, 
  WisdomToothState 
} from '@/types/dental';
import { storageService } from '@/services/storageService';

interface AnatomyState {
  // Seleção e Foco
  selectedStructureId: string | null;
  hoveredStructureId: string | null;
  activeRegion: AnatomicalRegion | 'all';
  
  // Camadas e Visibilidade
  layers: LayerVisibility;
  opacities: LayerOpacity;
  isolatedStructureId: string | null;
  hiddenStructureIds: string[];
  
  // Modos Especiais
  xrayMode: boolean;
  cameraPreset: ViewPreset;
  cameraResetKey: number;
  activePathologyId: string | null;
  focusedSystem: AnatomicalCategory | null;
  
  // Módulo Dental Específico
  activeToothFdi: string;
  toothViewMode: ToothViewMode;
  wisdomToothState: WisdomToothState;
  alignmentState: AlignmentState;
  
  // Exploração Anatômica de Superfície do Dente (Estilo Dental Scope)
  surfaceExplorationMode: boolean;
  activeToothFace: 'biting' | 'inner' | 'facial' | 'mesial' | 'distal' | null;
  selectedSurfaceFeature: string | null;
  hideSurfaceFeatures: boolean;
  
  // UI & Layout
  sidebarExpanded: boolean;
  infoPanelOpen: boolean;
  searchModalOpen: boolean;
  exportDialogOpen: boolean;
  
  // Ações
  setSelectedStructure: (id: string | null) => void;
  setHoveredStructure: (id: string | null) => void;
  setActiveRegion: (region: AnatomicalRegion | 'all') => void;
  setFocusedSystem: (system: AnatomicalCategory | null) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setLayerOpacity: (layer: keyof LayerOpacity, opacity: number) => void;
  isolateStructure: (id: string) => void;
  hideStructure: (id: string) => void;
  unhideStructure: (id: string) => void;
  resetVisibility: () => void;
  resetCamera: () => void;
  setXRayMode: (enabled: boolean) => void;
  setCameraPreset: (preset: ViewPreset) => void;
  setActivePathology: (id: string | null) => void;
  
  // Ações Dentais
  setActiveToothFdi: (fdi: string) => void;
  setToothViewMode: (mode: ToothViewMode) => void;
  setWisdomToothState: (state: WisdomToothState) => void;
  setAlignmentState: (state: AlignmentState) => void;
  setSurfaceExplorationMode: (enabled: boolean, toothFdi?: string) => void;
  setActiveToothFace: (face: 'biting' | 'inner' | 'facial' | 'mesial' | 'distal' | null) => void;
  setSelectedSurfaceFeature: (featureId: string | null) => void;
  setHideSurfaceFeatures: (hide: boolean) => void;
  
  // Ações UI
  toggleSidebar: () => void;
  toggleInfoPanel: () => void;
  setInfoPanelOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setExportDialogOpen: (open: boolean) => void;
}

export const useAnatomyStore = create<AnatomyState>((set, get) => ({
  selectedStructureId: null,
  hoveredStructureId: null,
  activeRegion: 'all',
  
  layers: {
    skeletal: true,
    dental: true,
    muscular: true,
    nervous: true,
    vascular: true,
    oral_tissue: true,
    pathologies: false,
  },
  
  opacities: {
    skeletal: 1.0,
    dental: 1.0,
    muscular: 1.0,
    nervous: 1.0,
    vascular: 1.0,
    oral_tissue: 1.0,
  },
  
  isolatedStructureId: null,
  hiddenStructureIds: [],
  
  xrayMode: false,
  cameraPreset: 'isometric',
  cameraResetKey: 0,
  activePathologyId: null,
  focusedSystem: null,
  
  activeToothFdi: '36',
  toothViewMode: 'external',
  wisdomToothState: 'erupted',
  alignmentState: 'aligned',
  
  surfaceExplorationMode: false,
  activeToothFace: null,
  selectedSurfaceFeature: null,
  hideSurfaceFeatures: false,
  
  sidebarExpanded: true,
  infoPanelOpen: false,
  searchModalOpen: false,
  exportDialogOpen: false,
  
  setSelectedStructure: (id) => {
    if (id) {
      storageService.addRecentStructure(id);
    }
    set({ selectedStructureId: id, infoPanelOpen: true });
  },
  
  setHoveredStructure: (id) => set({ hoveredStructureId: id }),
  
  setActiveRegion: (region) => set({ activeRegion: region }),
  
  setFocusedSystem: (system) => set({ focusedSystem: system }),
  
  toggleLayer: (layer) => set((state) => ({
    layers: {
      ...state.layers,
      [layer]: !state.layers[layer],
    },
  })),
  
  setLayerOpacity: (layer, opacity) => set((state) => ({
    opacities: {
      ...state.opacities,
      [layer]: opacity,
    },
  })),
  
  isolateStructure: (id) => set((state) => ({
    isolatedStructureId: state.isolatedStructureId === id ? null : id,
    selectedStructureId: id,
    infoPanelOpen: true,
  })),
  
  hideStructure: (id) => set((state) => ({
    hiddenStructureIds: [...state.hiddenStructureIds, id],
    selectedStructureId: state.selectedStructureId === id ? null : state.selectedStructureId,
  })),
  
  unhideStructure: (id) => set((state) => ({
    hiddenStructureIds: state.hiddenStructureIds.filter((hiddenId) => hiddenId !== id),
  })),
  
  resetVisibility: () => set((state) => ({
    isolatedStructureId: null,
    hiddenStructureIds: [],
    selectedStructureId: null,
    infoPanelOpen: false,
    cameraResetKey: state.cameraResetKey + 1,
    cameraPreset: 'isometric',
    layers: {
      skeletal: true,
      dental: true,
      muscular: true,
      nervous: true,
      vascular: true,
      oral_tissue: true,
      pathologies: false,
    },
    opacities: {
      skeletal: 1.0,
      dental: 1.0,
      muscular: 1.0,
      nervous: 1.0,
      vascular: 1.0,
      oral_tissue: 1.0,
    },
    xrayMode: false,
    activePathologyId: null,
    focusedSystem: null,
    surfaceExplorationMode: false,
    activeToothFace: null,
    selectedSurfaceFeature: null,
    hideSurfaceFeatures: false,
  })),

  resetCamera: () => set((state) => ({
    cameraResetKey: state.cameraResetKey + 1,
    cameraPreset: 'isometric',
  })),
  
  setXRayMode: (enabled) => set({ xrayMode: enabled }),
  
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  
  setActivePathology: (id) => set({ 
    activePathologyId: id,
    layers: {
      ...get().layers,
      pathologies: Boolean(id),
    }
  }),
  
  setActiveToothFdi: (fdi) => set({ activeToothFdi: fdi }),
  
  setToothViewMode: (mode) => set({ toothViewMode: mode }),
  
  setWisdomToothState: (state) => set({ wisdomToothState: state }),
  
  setAlignmentState: (state) => set({ alignmentState: state }),
  
  setSurfaceExplorationMode: (enabled, toothFdi) => set((state) => ({
    surfaceExplorationMode: enabled,
    activeToothFdi: toothFdi || state.activeToothFdi,
    selectedStructureId: toothFdi ? `dente_${toothFdi}` : (enabled ? `dente_${state.activeToothFdi}` : state.selectedStructureId),
    activeToothFace: enabled ? (state.activeToothFace || 'biting') : null,
    selectedSurfaceFeature: enabled ? state.selectedSurfaceFeature : null,
    hideSurfaceFeatures: false,
    infoPanelOpen: false, // Fechar painel lateral para foco no painel 3D de superfície
  })),
  
  setActiveToothFace: (face) => set({ activeToothFace: face }),
  
  setSelectedSurfaceFeature: (featureId) => set({ selectedSurfaceFeature: featureId, hideSurfaceFeatures: false }),
  
  setHideSurfaceFeatures: (hide) => set({ hideSurfaceFeatures: hide }),
  
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  
  toggleInfoPanel: () => set((state) => ({ infoPanelOpen: !state.infoPanelOpen })),
  
  setInfoPanelOpen: (open) => set({ infoPanelOpen: open }),
  
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  
  setExportDialogOpen: (open) => set({ exportDialogOpen: open }),
}));
