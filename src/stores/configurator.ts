import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ConfiguratorState,
  ConfiguratorActions,
  ShedModel,
  ShedSize,
  SidingOption,
  SidingColor,
  ShingleOption,
  ShingleColor,
  DoorPlacement,
  WindowPlacement,
  WallPosition,
  EditMode3D,
} from '@/types/configurator'

const initialState: ConfiguratorState = {
  // Available options
  models: [],
  sizes: [],
  sidingOptions: [],
  shingleOptions: [],
  doorOptions: [],
  windowOptions: [],

  // Current selections
  selectedModel: null,
  selectedSize: null,
  selectedSidingOption: null,
  selectedSidingColor: null,
  selectedShingleOption: null,
  selectedShingleColor: null,
  doors: [],
  windows: [],

  // UI state
  activeSection: 'size',
  isLoading: true,
  currentStep: 0,

  // 3D Editor state
  editMode3D: 'view',
  selectedItemId: null,
}

export const useConfiguratorStore = create<ConfiguratorState & ConfiguratorActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOptions: (options) => set(options),
      setLoading: (loading) => set({ isLoading: loading }),

      selectModel: (model: ShedModel) => {
        set({
          selectedModel: model,
          // Reset dependent selections when model changes
          selectedSize: null,
          doors: [],
          windows: [],
        })
      },

      selectSize: (size: ShedSize) => {
        const { doors, windows } = get()
        // Trim doors/windows if new size has lower limits
        set({
          selectedSize: size,
          doors: doors.slice(0, size.maxDoors),
          windows: windows.slice(0, size.maxWindows),
        })
      },

      selectSidingOption: (option: SidingOption) => {
        set({
          selectedSidingOption: option,
          // Auto-select first color
          selectedSidingColor: option.colors[0] ?? null,
        })
      },

      selectSidingColor: (color: SidingColor) => {
        set({ selectedSidingColor: color })
      },

      selectShingleOption: (option: ShingleOption) => {
        set({
          selectedShingleOption: option,
          // Auto-select first color
          selectedShingleColor: option.colors[0] ?? null,
        })
      },

      selectShingleColor: (color: ShingleColor) => {
        set({ selectedShingleColor: color })
      },

      addDoor: (wall: WallPosition) => {
        const { doors, selectedSize, doorOptions } = get()
        const maxDoors = selectedSize?.maxDoors ?? 2

        if (doors.length >= maxDoors) return

        const newDoor: DoorPlacement = {
          id: crypto.randomUUID(),
          wall,
          offsetPercent: 50,
          option: doorOptions[0] ?? null,
        }

        set({ doors: [...doors, newDoor] })
      },

      removeDoor: (id: string) => {
        const { doors } = get()
        set({ doors: doors.filter((d) => d.id !== id) })
      },

      updateDoor: (id: string, updates: Partial<DoorPlacement>) => {
        const { doors } = get()
        set({
          doors: doors.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })
      },

      addWindow: (wall: WallPosition) => {
        const { windows, selectedSize, windowOptions } = get()
        const maxWindows = selectedSize?.maxWindows ?? 4

        if (windows.length >= maxWindows) return

        const newWindow: WindowPlacement = {
          id: crypto.randomUUID(),
          wall,
          offsetPercent: 50,
          heightPercent: 50,
          option: windowOptions[0] ?? null,
        }

        set({ windows: [...windows, newWindow] })
      },

      removeWindow: (id: string) => {
        const { windows } = get()
        set({ windows: windows.filter((w) => w.id !== id) })
      },

      updateWindow: (id: string, updates: Partial<WindowPlacement>) => {
        const { windows } = get()
        set({
          windows: windows.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })
      },

      setActiveSection: (section: string) => {
        set({ activeSection: section })
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step })
      },

      nextStep: () => {
        const { currentStep } = get()
        // Now only 2 phases (0 = Design, 1 = Customize)
        set({ currentStep: Math.min(currentStep + 1, 1) })
      },

      prevStep: () => {
        const { currentStep } = get()
        set({ currentStep: Math.max(currentStep - 1, 0) })
      },

      setEditMode3D: (mode: EditMode3D) => {
        set({ editMode3D: mode, selectedItemId: null })
      },

      setSelectedItemId: (id: string | null) => {
        set({ selectedItemId: id })
      },

      selectNearestSize: (targetWidth: number, targetDepth: number) => {
        const { sizes, doors, windows } = get()
        if (sizes.length === 0) return

        // Find the nearest size by Euclidean distance
        let nearest = sizes[0]
        let minDistance = Infinity

        for (const size of sizes) {
          const distance = Math.sqrt(
            Math.pow(size.widthFeet - targetWidth, 2) +
            Math.pow(size.depthFeet - targetDepth, 2)
          )
          if (distance < minDistance) {
            minDistance = distance
            nearest = size
          }
        }

        // Trim doors/windows if new size has lower limits
        set({
          selectedSize: nearest,
          doors: doors.slice(0, nearest.maxDoors),
          windows: windows.slice(0, nearest.maxWindows),
        })
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'shed-configurator',
      partialize: (state) => ({
        // Only persist selections, not available options
        selectedModel: state.selectedModel,
        selectedSize: state.selectedSize,
        selectedSidingOption: state.selectedSidingOption,
        selectedSidingColor: state.selectedSidingColor,
        selectedShingleOption: state.selectedShingleOption,
        selectedShingleColor: state.selectedShingleColor,
        doors: state.doors,
        windows: state.windows,
      }),
    }
  )
)
