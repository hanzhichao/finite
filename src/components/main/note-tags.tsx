"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, TagIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface NoteTagsProps {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[],
  preview?: boolean
}

export function NoteTags({ tags, onChange, suggestions = [], preview }: NoteTagsProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([])
      return
    }

    const filtered = suggestions.filter(
      (suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(suggestion),
    )
    setFilteredSuggestions(filtered)
  }, [inputValue, suggestions, tags])

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag])
    }
    setInputValue("")
    setShowSuggestions(false)
  }

  const removeTag = (index: number) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion)
  }

  return (
    <div className="flex flex-col gap-2">
      {/*<div className="flex items-center gap-1">*/}
      {/*  <TagIcon className="h-4 w-4 text-muted-foreground" />*/}
      {/*  <span className="text-sm font-medium">Tags</span>*/}
      {/*</div>*/}

      <div className="flex flex-wrap gap-2 p-0 focus-within:ring-0 focus-within:ring-ring">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="cursor-pointer h-6 flex items-center gap-1 min-w-[42px] hover:bg-neutral-300 dark:hover:bg-neutral-600 transition">
            {tag}
            {!preview && (<button
              type="button"
              onClick={() => { removeTag(index); }}
              className="rounded-full hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>)}
          </Badge>
        ))}

        {!preview && (<div className="relative flex-0 min-w-[128px] opacity-0 hover:opacity-80 transition">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => { setShowSuggestions(true); }}
            className="h-8 border-accent"
            placeholder={tags.length > 0 ? "" : "Add tags..."}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 z-10 mt-1 w-full bg-background border rounded-md shadow-md"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-2 py-1 cursor-pointer hover:bg-accent"
                  onClick={() => { handleSuggestionClick(suggestion); }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>)}
      </div>
    </div>
  )
}
