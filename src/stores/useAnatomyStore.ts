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
import { anatomicalStructures } from '@/data/anatomy/structures';

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
  explosionFactor: number;
  cameraPreset: ViewPreset;
  cameraResetKey: number;
  activePathologyId: string | null;
  activeAnesthesiaId: string | null;
  anesthesiaFocusKey: number;
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
  isolateStructure: (id: string | null, force?: boolean) => void;
  hideStructure: (id: string) => void;
  unhideStructure: (id: string) => void;
  resetVisibility: () => void;
  resetCamera: () => void;
  setXRayMode: (enabled: boolean) => void;
  setExplosionFactor: (factor: number) => void;
  setCameraPreset: (preset: ViewPreset) => void;
  setActivePathology: (id: string | null) => void;
  setActiveAnesthesia: (id: string | null) => void;
  triggerAnesthesiaFocus: () => void;
  
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
  setSidebarExpanded: (expanded: boolean) => void;
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
  explosionFactor: 0,
  cameraPreset: 'isometric',
  cameraResetKey: 0,
  activePathologyId: null,
  activeAnesthesiaId: null,
  anesthesiaFocusKey: 0,
  focusedSystem: null,
  
  activeToothFdi: '36',
  toothViewMode: 'external',
  wisdomToothState: 'erupted',
  alignmentState: 'aligned',
  
  surfaceExplorationMode: false,
  activeToothFace: null,
  selectedSurfaceFeature: null,
  hideSurfaceFeatures: false,
  
  sidebarExpanded: typeof window !== 'undefined' ? window.innerWidth >= 1200 : true,
  infoPanelOpen: false,
  searchModalOpen: false,
  exportDialogOpen: false,
  
  setSelectedStructure: (id) => {
    if (id) {
      storageService.addRecentStructure(id);
    }
    const autoOpenPanel = typeof window !== 'undefined' ? window.innerWidth >= 900 : true;
    set((state) => ({
      selectedStructureId: id,
      infoPanelOpen: id === null ? state.infoPanelOpen : (autoOpenPanel ? true : state.infoPanelOpen),
    }));
  },
  
  setHoveredStructure: (id) => set({ hoveredStructureId: id }),
  
  setActiveRegion: (region) => set({ activeRegion: region }),
  
  setFocusedSystem: (system) => set({ focusedSystem: system }),
  
  toggleLayer: (layer) => set((state) => {
    const nextVisible = !state.layers[layer];
    const selectedCategory = state.selectedStructureId
      ? anatomicalStructures[state.selectedStructureId]?.category
      : null;
    const hoveredCategory = state.hoveredStructureId
      ? anatomicalStructures[state.hoveredStructureId]?.category
      : null;
    const shouldClearSelected =
      !nextVisible && !state.isolatedStructureId && selectedCategory === layer;

    return {
      layers: {
        ...state.layers,
        [layer]: nextVisible,
      },
      ...(shouldClearSelected
        ? { selectedStructureId: null, infoPanelOpen: false }
        : {}),
      ...(!nextVisible && hoveredCategory === layer
        ? { hoveredStructureId: null }
        : {}),
    };
  }),
  
  setLayerOpacity: (layer, opacity) => set((state) => ({
    opacities: {
      ...state.opacities,
      [layer]: opacity,
    },
  })),
  
  isolateStructure: (id, force) => set((state) => {
    const autoOpenPanel = typeof window !== 'undefined' ? window.innerWidth >= 900 : true;
    return {
      isolatedStructureId: id === null ? null : (force ? id : (state.isolatedStructureId === id ? null : id)),
      selectedStructureId: id,
      infoPanelOpen: id !== null ? (autoOpenPanel ? true : state.infoPanelOpen) : false,
      hiddenStructureIds: id ? state.hiddenStructureIds.filter((hiddenId) => hiddenId !== id) : state.hiddenStructureIds,
    };
  }),
  
  hideStructure: (id) => set((state) => ({
    hiddenStructureIds: [...state.hiddenStructureIds, id],
    selectedStructureId: state.selectedStructureId === id ? null : state.selectedStructureId,
  })),
  
  unhideStructure: (id) => set((state) => ({
    hiddenStructureIds: state.hiddenStructureIds.filter((hiddenId) => hiddenId !== id),
  })),
  
  resetVisibility: () => set((state) => {
    const isSystemFocused = state.focusedSystem !== null;
    return {
      isolatedStructureId: null,
      hiddenStructureIds: [],
      selectedStructureId: null,
      infoPanelOpen: false,
      cameraResetKey: state.cameraResetKey + 1,
      cameraPreset: 'isometric',
      xrayMode: false,
      explosionFactor: 0,
      activePathologyId: null,
      surfaceExplorationMode: false,
      activeToothFace: null,
      selectedSurfaceFeature: null,
      hideSurfaceFeatures: false,
      // Se um sistema anatômico estiver ativo (ex: Ossos ou Músculos), preserva o sistema e não reseta para a visão global
      focusedSystem: state.focusedSystem,
      layers: isSystemFocused ? state.layers : {
        skeletal: true,
        dental: true,
        muscular: true,
        nervous: true,
        vascular: true,
        oral_tissue: true,
        pathologies: false,
      },
      opacities: isSystemFocused ? state.opacities : {
        skeletal: 1.0,
        dental: 1.0,
        muscular: 1.0,
        nervous: 1.0,
        vascular: 1.0,
        oral_tissue: 1.0,
      },
    };
  }),

  resetCamera: () => set((state) => ({
    cameraResetKey: state.cameraResetKey + 1,
    cameraPreset: 'isometric',
  })),
  
  setXRayMode: (enabled) => set({ xrayMode: enabled }),
  
  setExplosionFactor: (factor) => set({ explosionFactor: Math.max(0, Math.min(1, factor)) }),
  
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  
  setActivePathology: (id) => set({ 
    activePathologyId: id,
    layers: {
      ...get().layers,
      pathologies: Boolean(id),
    }
  }),

  setActiveAnesthesia: (id) => set((state) => ({
    activeAnesthesiaId: id,
    anesthesiaFocusKey: id ? state.anesthesiaFocusKey + 1 : state.anesthesiaFocusKey,
  })),

  triggerAnesthesiaFocus: () => set((state) => ({
    anesthesiaFocusKey: state.anesthesiaFocusKey + 1,
  })),
  
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

  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  
  toggleInfoPanel: () => set((state) => ({ infoPanelOpen: !state.infoPanelOpen })),
  
  setInfoPanelOpen: (open) => set({ infoPanelOpen: open }),
  
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  
  setExportDialogOpen: (open) => set({ exportDialogOpen: open }),
}));
