'use client'

import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { DoorOpen, Grid3X3, Move } from 'lucide-react'
import type { EditMode3D } from '@/types/configurator'

interface EditModeToolbarProps {
  className?: string
}

export function EditModeToolbar({ className }: EditModeToolbarProps) {
  const { editMode3D, setEditMode3D, doors, windows, selectedSize } = useConfiguratorStore()

  const maxDoors = selectedSize?.maxDoors ?? 2
  const maxWindows = selectedSize?.maxWindows ?? 4

  const handleModeToggle = (mode: EditMode3D) => {
    setEditMode3D(editMode3D === mode ? 'view' : mode)
  }

  const buttons: { mode: EditMode3D; icon: React.ReactNode; label: string; disabled: boolean }[] = [
    {
      mode: 'add-door',
      icon: <DoorOpen className="w-4 h-4" />,
      label: `Door (${doors.length}/${maxDoors})`,
      disabled: doors.length >= maxDoors,
    },
    {
      mode: 'add-window',
      icon: <Grid3X3 className="w-4 h-4" />,
      label: `Window (${windows.length}/${maxWindows})`,
      disabled: windows.length >= maxWindows,
    },
    {
      mode: 'resize',
      icon: <Move className="w-4 h-4" />,
      label: 'Resize',
      disabled: false,
    },
  ]

  return (
    <div className={cn("flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-stone-200/50", className)}>
      {buttons.map(({ mode, icon, label, disabled }) => (
        <button
          key={mode}
          onClick={() => !disabled && handleModeToggle(mode)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            editMode3D === mode
              ? mode === 'add-door'
                ? "bg-amber-500 text-white shadow-sm"
                : mode === 'add-window'
                ? "bg-sky-500 text-white shadow-sm"
                : "bg-stone-700 text-white shadow-sm"
              : disabled
              ? "text-stone-300 cursor-not-allowed"
              : "text-stone-600 hover:bg-stone-100"
          )}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  )
}
