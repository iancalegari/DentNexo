import { SavedView, UserNote, QuizResult } from '@/types/study';

const STORAGE_KEYS = {
  FAVORITES: 'dentnexo_favorites',
  NOTES: 'dentnexo_notes',
  SAVED_VIEWS: 'dentnexo_saved_views',
  QUIZ_RESULTS: 'dentnexo_quiz_history',
  RECENT_STRUCTURES: 'dentnexo_recent_structures',
};

export const storageService = {
  // Favoritos
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(structureId: string): string[] {
    const favorites = this.getFavorites();
    const updated = favorites.includes(structureId)
      ? favorites.filter(id => id !== structureId)
      : [...favorites, structureId];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return updated;
  },

  isFavorite(structureId: string): boolean {
    return this.getFavorites().includes(structureId);
  },

  // Anotações
  getNotes(): UserNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveNote(note: Omit<UserNote, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): UserNote {
    const notes = this.getNotes();
    const now = new Date().toISOString();
    
    if (note.id) {
      const updatedNotes = notes.map(n => n.id === note.id ? { ...n, ...note, updatedAt: now } : n);
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
      return updatedNotes.find(n => n.id === note.id)!;
    } else {
      const newNote: UserNote = {
        ...note,
        id: `note_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      const updatedNotes = [newNote, ...notes];
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
      return newNote;
    }
  },

  deleteNote(noteId: string): void {
    const notes = this.getNotes().filter(n => n.id !== noteId);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  // Vistas de Estudo Salvas
  getSavedViews(): SavedView[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_VIEWS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveView(view: Omit<SavedView, 'id' | 'createdAt'>): SavedView {
    const views = this.getSavedViews();
    const newView: SavedView = {
      ...view,
      id: `view_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newView, ...views];
    localStorage.setItem(STORAGE_KEYS.SAVED_VIEWS, JSON.stringify(updated));
    return newView;
  },

  deleteSavedView(viewId: string): void {
    const views = this.getSavedViews().filter(v => v.id !== viewId);
    localStorage.setItem(STORAGE_KEYS.SAVED_VIEWS, JSON.stringify(views));
  },

  // Histórico de Estruturas Recentes
  getRecentStructures(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_STRUCTURES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentStructure(structureId: string): void {
    const recents = this.getRecentStructures().filter(id => id !== structureId);
    const updated = [structureId, ...recents].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT_STRUCTURES, JSON.stringify(updated));
  },

  // Resultados de Questionários
  getQuizHistory(): QuizResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveQuizResult(result: QuizResult): void {
    const history = this.getQuizHistory();
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify([result, ...history]));
  },
};
