export type RoofStyle = 'GABLE' | 'BARN' | 'LEAN_TO'
export type WallPosition = 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT'
export type DoorType = 'SINGLE_ENTRY' | 'DOUBLE_ENTRY' | 'BARN_DOOR' | 'ROLL_UP' | 'SLIDING'
export type EditMode3D = 'view' | 'add-door' | 'add-window' | 'resize'

export interface ShedModel {
  id: string
  name: string
  slug: string
  description: string | null
  roofStyle: RoofStyle
  basePrice: number
}

export interface ShedSize {
  id: string
  widthFeet: number
  depthFeet: number
  heightFeet: number
  displayName: string
  priceModifier: number
  maxDoors: number
  maxWindows: number
}

export interface SidingOption {
  id: string
  name: string
  material: string
  priceModifier: number
  colors: SidingColor[]
}

export interface SidingColor {
  id: string
  name: string
  hexCode: string
}

export interface ShingleOption {
  id: string
  name: string
  priceModifier: number
  colors: ShingleColor[]
}

export interface ShingleColor {
  id: string
  name: string
  hexCode: string
}

export interface DoorOption {
  id: string
  name: string
  type: DoorType
  widthInches: number
  heightInches: number
  imageUrl: string | null
  priceEach: number
}

export interface WindowOption {
  id: string
  name: string
  widthInches: number
  heightInches: number
  imageUrl: string | null
  priceEach: number
}

export interface DoorPlacement {
  id: string
  wall: WallPosition
  offsetPercent: number
  option: DoorOption | null
}

export interface WindowPlacement {
  id: string
  wall: WallPosition
  offsetPercent: number
  heightPercent: number
  option: WindowOption | null
}

export interface ConfiguratorState {
  // Available options (loaded from DB)
  models: ShedModel[]
  sizes: ShedSize[]
  sidingOptions: SidingOption[]
  shingleOptions: ShingleOption[]
  doorOptions: DoorOption[]
  windowOptions: WindowOption[]

  // Current selections
  selectedModel: ShedModel | null
  selectedSize: ShedSize | null
  selectedSidingOption: SidingOption | null
  selectedSidingColor: SidingColor | null
  selectedShingleOption: ShingleOption | null
  selectedShingleColor: ShingleColor | null
  doors: DoorPlacement[]
  windows: WindowPlacement[]

  // UI state
  activeSection: string
  isLoading: boolean
  currentStep: number

  // 3D Editor state
  editMode3D: EditMode3D
  selectedItemId: string | null  // door or window id
}

export interface ConfiguratorActions {
  // Data loading
  setOptions: (options: Partial<ConfiguratorState>) => void
  setLoading: (loading: boolean) => void

  // Selection actions
  selectModel: (model: ShedModel) => void
  selectSize: (size: ShedSize) => void
  selectSidingOption: (option: SidingOption) => void
  selectSidingColor: (color: SidingColor) => void
  selectShingleOption: (option: ShingleOption) => void
  selectShingleColor: (color: ShingleColor) => void

  // Door/window placement
  addDoor: (wall: WallPosition) => void
  removeDoor: (id: string) => void
  updateDoor: (id: string, updates: Partial<DoorPlacement>) => void
  addWindow: (wall: WallPosition) => void
  removeWindow: (id: string) => void
  updateWindow: (id: string, updates: Partial<WindowPlacement>) => void

  // UI
  setActiveSection: (section: string) => void
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // 3D Editor
  setEditMode3D: (mode: EditMode3D) => void
  setSelectedItemId: (id: string | null) => void
  selectNearestSize: (targetWidth: number, targetDepth: number) => void

  // Reset
  reset: () => void
}
