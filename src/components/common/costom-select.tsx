"use client"

import * as React from "react"
import { Check, X, GripVertical, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type CustomSelectProps = {
  placeholder?: string
  emptyMessage?: string
  options?: { value: string; label: string }[]
  value?: string[]
  onChange?: (value: string[]) => void
  className?: string
  disabled?: boolean
  allowMultiple?: boolean
}

export function CustomSelect({
                               placeholder = "Select an option or create one",
                               emptyMessage = "No options found",
                               options = [],
                               value = [],
                               onChange,
                               className,
                               disabled = false,
                               allowMultiple = true,
                             }: CustomSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [localOptions, setLocalOptions] = React.useState(options)

  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)

  // Handle selection from dropdown
  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (!allowMultiple) {
        onChange?.([selectedValue])
        setOpen(false)
        return
      }

      const newValue = value.includes(selectedValue)
        ? value.filter((v) => v !== selectedValue)
        : [...value, selectedValue]

      onChange?.(newValue)
    },
    [value, onChange, allowMultiple],
  )

  // Handle removing a selected tag
  const handleRemove = React.useCallback(
    (valueToRemove: string, e: React.MouseEvent) => {
      e.stopPropagation()
      const newValue = value.filter((v) => v !== valueToRemove)
      onChange?.(newValue)
    },
    [value, onChange],
  )

  // Handle adding a new option from input
  const handleAddFromInput = React.useCallback(() => {
    if (!inputValue.trim()) return

    const newOptionValue = inputValue.toLowerCase().replace(/\s+/g, "-")
    const newOption = {
      value: newOptionValue,
      label: inputValue.trim(),
    }

    // Add to local options if it doesn't exist
    if (!localOptions.find((opt) => opt.value === newOptionValue)) {
      setLocalOptions((prev) => [...prev, newOption])
    }

    // Add to selected values
    if (!value.includes(newOptionValue)) {
      handleSelect(newOptionValue)
    }

    setInputValue("")
  }, [inputValue, localOptions, value, handleSelect])

  // Handle key press in input
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault()
        handleAddFromInput()
      }
      if (e.key === "Backspace" && !inputValue && value.length > 0) {
        e.preventDefault()
        const newValue = [...value]
        newValue.pop()
        onChange?.(newValue)
      }
    },
    [inputValue, value, handleAddFromInput, onChange],
  )

  // Handle drag start
  const handleDragStart = React.useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  // Handle drag over
  const handleDragOver = React.useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }, [])

  // Handle drag leave
  const handleDragLeave = React.useCallback(() => {
    setDragOverIndex(null)
  }, [])

  // Handle drop
  const handleDrop = React.useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault()
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null)
        setDragOverIndex(null)
        return
      }

      const newValue = [...value]
      const draggedItem = newValue[draggedIndex]
      newValue.splice(draggedIndex, 1)
      newValue.splice(dropIndex, 0, draggedItem)

      onChange?.(newValue)
      setDraggedIndex(null)
      setDragOverIndex(null)
    },
    [draggedIndex, value, onChange],
  )

  // Handle drag end
  const handleDragEnd = React.useCallback(() => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }, [])

  // Get selected option labels
  const selectedOptions = React.useMemo(
    () => value.map((v) => localOptions.find((opt) => opt.value === v)).filter(Boolean),
    [value, localOptions],
  )

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              disabled && "cursor-not-allowed opacity-50",
            )}
            onClick={() => !disabled && setOpen(true)}
          >
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option, index) => {
                  // Generate a random pastel color for each option
                  const colors = [
                    "bg-red-100 text-red-800 border-red-200",
                    "bg-blue-100 text-blue-800 border-blue-200",
                    "bg-green-100 text-green-800 border-green-200",
                    "bg-yellow-100 text-yellow-800 border-yellow-200",
                    "bg-purple-100 text-purple-800 border-purple-200",
                    "bg-pink-100 text-pink-800 border-pink-200",
                    "bg-indigo-100 text-indigo-800 border-indigo-200",
                    "bg-orange-100 text-orange-800 border-orange-200",
                    "bg-teal-100 text-teal-800 border-teal-200",
                    "bg-cyan-100 text-cyan-800 border-cyan-200",
                  ]
                  const randomColor =
                    colors[Math.abs(option!.value.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length]

                  return (
                    <Badge
                      key={option!.value}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "px-2 py-0.5 text-xs border rounded-xs cursor-move transition-all",
                        randomColor,
                        draggedIndex === index && "opacity-50 scale-95",
                        dragOverIndex === index && draggedIndex !== index && "scale-105 shadow-md",
                      )}
                    >
                      {option!.label}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(option!.value, e)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                        disabled={disabled}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Type to search or add..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
            />
            <CommandList>
              <CommandEmpty>
                <div className="py-2 px-1">
                  {inputValue ? (
                    <div
                      className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                      onClick={handleAddFromInput}
                    >
                      Create "{inputValue}"
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {localOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className="flex items-center gap-2"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Check className={cn("h-4 w-4", value.includes(option.value) ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
