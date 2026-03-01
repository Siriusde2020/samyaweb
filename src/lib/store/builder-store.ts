import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  BuilderState,
  BuilderElement,
  ElementType,
  Breakpoint,
  ElementStyles,
  HistoryEntry,
} from '@/types/builder';
import { generateId, deepClone } from '@/lib/utils';

const MAX_HISTORY = 100;

interface BuilderActions {
  // Element CRUD
  addElement: (type: ElementType, parentId?: string, index?: number) => string;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => string | null;
  moveElement: (id: string, newParentId: string | null, index: number) => void;

  // Selection
  selectElement: (id: string | null) => void;
  hoverElement: (id: string | null) => void;

  // Styles
  updateStyles: (id: string, styles: Partial<ElementStyles>) => void;
  updateResponsiveStyles: (id: string, breakpoint: Breakpoint, styles: Partial<ElementStyles>) => void;
  updateHoverStyles: (id: string, styles: Partial<ElementStyles>) => void;

  // Canvas
  setBreakpoint: (breakpoint: Breakpoint) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;

  // Panels
  setLeftPanel: (panel: BuilderState['leftPanel']) => void;
  setRightPanel: (panel: BuilderState['rightPanel']) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: (action: string) => void;

  // Copy/Paste
  copyElement: (id: string) => void;
  pasteElement: (parentId?: string) => void;

  // Bulk
  loadPage: (elements: Record<string, BuilderElement>, rootIds: string[]) => void;
  clearCanvas: () => void;

  // Status
  setSaving: (saving: boolean) => void;
  setDirty: (dirty: boolean) => void;
  setLastSaved: (time: string) => void;
}

const defaultElement = (type: ElementType): Partial<BuilderElement> => {
  const defaults: Record<string, Partial<BuilderElement>> = {
    section: {
      tag: 'section',
      styles: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '200px',
        padding: '60px 20px',
      },
    },
    container: {
      tag: 'div',
      styles: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
      },
    },
    columns: {
      tag: 'div',
      styles: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        width: '100%',
      },
    },
    column: {
      tag: 'div',
      styles: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
      },
    },
    heading: {
      tag: 'h2',
      content: 'Heading',
      styles: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1a1a',
        lineHeight: '1.2',
        marginBottom: '16px',
      },
    },
    text: {
      tag: 'p',
      content: 'Start typing here...',
      styles: {
        fontSize: '16px',
        fontWeight: '400',
        color: '#4a4a4a',
        lineHeight: '1.6',
      },
    },
    image: {
      tag: 'img',
      src: '/api/placeholder/800/400',
      alt: 'Image',
      styles: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
      },
    },
    video: {
      tag: 'video',
      styles: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
      },
    },
    button: {
      tag: 'a',
      content: 'Click Me',
      href: '#',
      styles: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 24px',
        backgroundColor: '#4c6ef5',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '600',
        borderRadius: '8px',
        cursor: 'pointer',
        textDecoration: 'none',
        border: 'none',
        transition: 'all 0.2s ease',
      },
    },
    divider: {
      tag: 'hr',
      styles: {
        width: '100%',
        height: '1px',
        backgroundColor: '#e0e0e0',
        border: 'none',
        margin: '20px 0',
      },
    },
    spacer: {
      tag: 'div',
      styles: {
        width: '100%',
        height: '40px',
      },
    },
    icon: {
      tag: 'span',
      content: 'star',
      styles: {
        fontSize: '24px',
        color: '#4c6ef5',
      },
    },
    form: {
      tag: 'form',
      styles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '500px',
      },
    },
    input: {
      tag: 'input',
      placeholder: 'Enter text...',
      styles: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
      },
    },
    hero: {
      tag: 'section',
      styles: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '500px',
        padding: '80px 20px',
        textAlign: 'center',
      },
    },
    navbar: {
      tag: 'nav',
      styles: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '16px 24px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    },
    footer: {
      tag: 'footer',
      styles: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '40px 24px',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
      },
    },
  };

  return defaults[type] || {
    tag: 'div',
    styles: {
      padding: '10px',
    },
  };
};

const containerTypes = new Set([
  'section', 'container', 'columns', 'column', 'form', 'navbar', 'footer',
  'sidebar', 'hero', 'modal', 'accordion', 'tabs', 'feature-grid', 'cta',
]);

export const useBuilderStore = create<BuilderState & BuilderActions>()(
  immer((set, get) => ({
    // Initial state
    siteId: '',
    pageId: '',
    pageName: '',
    pageSlug: '',
    elements: {},
    rootElementIds: [],
    selectedElementId: null,
    hoveredElementId: null,
    copiedElementId: null,
    breakpoint: 'desktop',
    zoom: 1,
    showGrid: false,
    snapToGrid: true,
    gridSize: 8,
    leftPanel: 'elements',
    rightPanel: 'style',
    history: [],
    historyIndex: -1,
    isDirty: false,
    isSaving: false,
    isPublishing: false,
    lastSaved: null,

    // Element CRUD
    addElement: (type, parentId, index) => {
      const id = generateId();
      const defaults = defaultElement(type);

      const element: BuilderElement = {
        id,
        type,
        tag: defaults.tag || 'div',
        content: defaults.content,
        src: defaults.src,
        alt: defaults.alt,
        href: defaults.href,
        placeholder: defaults.placeholder,
        children: containerTypes.has(type) ? [] : undefined,
        parentId: parentId || null,
        styles: defaults.styles || {},
        responsiveStyles: {},
        animations: [],
        interactions: [],
        locked: false,
        hidden: false,
      };

      set((state) => {
        state.elements[id] = element;

        if (parentId && state.elements[parentId]) {
          const parent = state.elements[parentId];
          if (!parent.children) parent.children = [];
          if (index !== undefined) {
            parent.children.splice(index, 0, id);
          } else {
            parent.children.push(id);
          }
        } else {
          if (index !== undefined) {
            state.rootElementIds.splice(index, 0, id);
          } else {
            state.rootElementIds.push(id);
          }
        }

        state.selectedElementId = id;
        state.isDirty = true;
      });

      get().pushHistory(`Add ${type}`);
      return id;
    },

    updateElement: (id, updates) => {
      set((state) => {
        if (state.elements[id]) {
          Object.assign(state.elements[id], updates);
          state.isDirty = true;
        }
      });
    },

    deleteElement: (id) => {
      const state = get();
      const element = state.elements[id];
      if (!element) return;

      // Recursively collect all descendant IDs
      const collectIds = (elementId: string): string[] => {
        const el = state.elements[elementId];
        if (!el) return [elementId];
        const childIds = el.children || [];
        return [elementId, ...childIds.flatMap(collectIds)];
      };

      const idsToDelete = collectIds(id);

      set((s) => {
        // Remove from parent
        if (element.parentId && s.elements[element.parentId]) {
          const parent = s.elements[element.parentId];
          if (parent.children) {
            parent.children = parent.children.filter(cid => cid !== id);
          }
        } else {
          s.rootElementIds = s.rootElementIds.filter(rid => rid !== id);
        }

        // Delete all collected elements
        idsToDelete.forEach(did => delete s.elements[did]);

        if (s.selectedElementId && idsToDelete.includes(s.selectedElementId)) {
          s.selectedElementId = null;
        }
        s.isDirty = true;
      });

      get().pushHistory(`Delete element`);
    },

    duplicateElement: (id) => {
      const state = get();
      const element = state.elements[id];
      if (!element) return null;

      const cloneElement = (el: BuilderElement, newParentId: string | null): BuilderElement => {
        const newId = generateId();
        const cloned: BuilderElement = {
          ...deepClone(el),
          id: newId,
          parentId: newParentId,
          label: el.label ? `${el.label} (copy)` : undefined,
        };

        if (cloned.children) {
          cloned.children = cloned.children.map(childId => {
            const child = state.elements[childId];
            if (!child) return childId;
            const clonedChild = cloneElement(child, newId);
            return clonedChild.id;
          });
        }

        set((s) => {
          s.elements[newId] = cloned;
        });

        return cloned;
      };

      const cloned = cloneElement(element, element.parentId);

      set((s) => {
        if (element.parentId && s.elements[element.parentId]) {
          const parent = s.elements[element.parentId];
          if (parent.children) {
            const idx = parent.children.indexOf(id);
            parent.children.splice(idx + 1, 0, cloned.id);
          }
        } else {
          const idx = s.rootElementIds.indexOf(id);
          s.rootElementIds.splice(idx + 1, 0, cloned.id);
        }
        s.selectedElementId = cloned.id;
        s.isDirty = true;
      });

      get().pushHistory(`Duplicate element`);
      return cloned.id;
    },

    moveElement: (id, newParentId, index) => {
      set((state) => {
        const element = state.elements[id];
        if (!element) return;

        // Remove from current parent
        if (element.parentId && state.elements[element.parentId]) {
          const parent = state.elements[element.parentId];
          if (parent.children) {
            parent.children = parent.children.filter(cid => cid !== id);
          }
        } else {
          state.rootElementIds = state.rootElementIds.filter(rid => rid !== id);
        }

        // Add to new parent
        element.parentId = newParentId;
        if (newParentId && state.elements[newParentId]) {
          const newParent = state.elements[newParentId];
          if (!newParent.children) newParent.children = [];
          newParent.children.splice(index, 0, id);
        } else {
          state.rootElementIds.splice(index, 0, id);
        }

        state.isDirty = true;
      });

      get().pushHistory(`Move element`);
    },

    // Selection
    selectElement: (id) => set((s) => { s.selectedElementId = id; }),
    hoverElement: (id) => set((s) => { s.hoveredElementId = id; }),

    // Styles
    updateStyles: (id, styles) => {
      set((state) => {
        if (state.elements[id]) {
          Object.assign(state.elements[id].styles, styles);
          state.isDirty = true;
        }
      });
    },

    updateResponsiveStyles: (id, breakpoint, styles) => {
      set((state) => {
        if (state.elements[id]) {
          if (!state.elements[id].responsiveStyles) {
            state.elements[id].responsiveStyles = {};
          }
          if (breakpoint === 'tablet') {
            state.elements[id].responsiveStyles!.tablet = {
              ...state.elements[id].responsiveStyles!.tablet,
              ...styles,
            };
          } else if (breakpoint === 'mobile') {
            state.elements[id].responsiveStyles!.mobile = {
              ...state.elements[id].responsiveStyles!.mobile,
              ...styles,
            };
          }
          state.isDirty = true;
        }
      });
    },

    updateHoverStyles: (id, styles) => {
      set((state) => {
        if (state.elements[id]) {
          state.elements[id].hoverStyles = {
            ...state.elements[id].hoverStyles,
            ...styles,
          };
          state.isDirty = true;
        }
      });
    },

    // Canvas
    setBreakpoint: (breakpoint) => set((s) => { s.breakpoint = breakpoint; }),
    setZoom: (zoom) => set((s) => { s.zoom = Math.max(0.25, Math.min(2, zoom)); }),
    toggleGrid: () => set((s) => { s.showGrid = !s.showGrid; }),
    toggleSnapToGrid: () => set((s) => { s.snapToGrid = !s.snapToGrid; }),

    // Panels
    setLeftPanel: (panel) => set((s) => {
      s.leftPanel = s.leftPanel === panel ? null : panel;
    }),
    setRightPanel: (panel) => set((s) => {
      s.rightPanel = s.rightPanel === panel ? null : panel;
    }),

    // History
    pushHistory: (action) => {
      set((state) => {
        const entry: HistoryEntry = {
          elements: deepClone(state.elements),
          rootElementIds: [...state.rootElementIds],
          timestamp: Date.now(),
          action,
        };

        // Truncate future history if we're not at the end
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(entry);

        // Limit history size
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        state.history = newHistory;
        state.historyIndex = newHistory.length - 1;
      });
    },

    undo: () => {
      set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          const entry = state.history[state.historyIndex];
          state.elements = entry.elements;
          state.rootElementIds = entry.rootElementIds;
          state.isDirty = true;
        }
      });
    },

    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          const entry = state.history[state.historyIndex];
          state.elements = entry.elements;
          state.rootElementIds = entry.rootElementIds;
          state.isDirty = true;
        }
      });
    },

    // Copy/Paste
    copyElement: (id) => set((s) => { s.copiedElementId = id; }),
    pasteElement: (parentId) => {
      const state = get();
      if (state.copiedElementId) {
        state.duplicateElement(state.copiedElementId);
      }
    },

    // Bulk
    loadPage: (elements, rootIds) => {
      set((state) => {
        state.elements = elements;
        state.rootElementIds = rootIds;
        state.selectedElementId = null;
        state.hoveredElementId = null;
        state.history = [];
        state.historyIndex = -1;
        state.isDirty = false;
      });
      get().pushHistory('Load page');
    },

    clearCanvas: () => {
      set((state) => {
        state.elements = {};
        state.rootElementIds = [];
        state.selectedElementId = null;
        state.isDirty = true;
      });
      get().pushHistory('Clear canvas');
    },

    // Status
    setSaving: (saving) => set((s) => { s.isSaving = saving; }),
    setDirty: (dirty) => set((s) => { s.isDirty = dirty; }),
    setLastSaved: (time) => set((s) => { s.lastSaved = time; }),
  }))
);
