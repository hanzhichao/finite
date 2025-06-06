"use client"

import * as React from "react"
import { format } from "date-fns"
import {CalendarIcon, Clock} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  format?: string
  showTime?: boolean
  use24Hour?: boolean
}

export function DateTimePicker({
                                 value,
                                 onChange,
                                 placeholder = "Pick a date and time",
                                 disabled = false,
                                 className,
                                 format: dateFormat = "yyyy/MM/dd HH:mm:SS",
                                 showTime = true,
                                 use24Hour = false,
                               }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)

  // Update internal state when value prop changes
  React.useEffect(() => {
    setSelectedDate(value)
  }, [value])

  // Handle date selection from calendar
  const handleDateSelect = React.useCallback(
    (date: Date | undefined) => {
      if (!date) {
        setSelectedDate(undefined)
        onChange?.(undefined)
        return
      }

      // If we have an existing time, preserve it
      if (selectedDate) {
        const newDate = new Date(date)
        newDate.setHours(selectedDate.getHours())
        newDate.setMinutes(selectedDate.getMinutes())
        newDate.setSeconds(selectedDate.getSeconds())
        setSelectedDate(newDate)
        onChange?.(newDate)
      } else {
        // Set default time to current time
        const now = new Date()
        date.setHours(now.getHours())
        date.setMinutes(now.getMinutes())
        date.setSeconds(0)
        setSelectedDate(date)
        onChange?.(date)
      }
    },
    [selectedDate, onChange],
  )

  // Handle time changes
  const handleTimeChange = React.useCallback(
    (type: "hour" | "minute" | "ampm", value: string) => {
      if (!selectedDate) return

      const newDate = new Date(selectedDate)

      if (type === "hour") {
        let hour = Number.parseInt(value)
        if (!use24Hour) {
          const currentHour = newDate.getHours()
          const isPM = currentHour >= 12
          if (isPM && hour !== 12) hour += 12
          if (!isPM && hour === 12) hour = 0
        }
        newDate.setHours(hour)
      } else if (type === "minute") {
        newDate.setMinutes(Number.parseInt(value))
      } else if (type === "ampm") {
        const currentHour = newDate.getHours()
        if (value === "PM" && currentHour < 12) {
          newDate.setHours(currentHour + 12)
        } else if (value === "AM" && currentHour >= 12) {
          newDate.setHours(currentHour - 12)
        }
      }

      setSelectedDate(newDate)
      onChange?.(newDate)
    },
    [selectedDate, onChange, use24Hour],
  )

  // Generate hour options
  const hourOptions = React.useMemo(() => {
    if (use24Hour) {
      return Array.from({ length: 24 }, (_, i) => ({
        value: i.toString().padStart(2, "0"),
        label: i.toString().padStart(2, "0"),
      }))
    } else {
      return Array.from({ length: 12 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
      }))
    }
  }, [use24Hour])

  // Generate minute options
  const minuteOptions = React.useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      value: i.toString().padStart(2, "0"),
      label: i.toString().padStart(2, "0"),
    }))
  }, [])

  // Get current time values
  const currentHour = React.useMemo(() => {
    if (!selectedDate) return use24Hour ? "00" : "12"
    const hour = selectedDate.getHours()
    if (use24Hour) {
      return hour.toString().padStart(2, "0")
    } else {
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      return displayHour.toString()
    }
  }, [selectedDate, use24Hour])

  const currentMinute = React.useMemo(() => {
    if (!selectedDate) return "00"
    return selectedDate.getMinutes().toString().padStart(2, "0")
  }, [selectedDate])

  const currentAmPm = React.useMemo(() => {
    if (!selectedDate || use24Hour) return "AM"
    return selectedDate.getHours() >= 12 ? "PM" : "AM"
  }, [selectedDate, use24Hour])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline" size="sm"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon/>
          {selectedDate ? format(selectedDate, dateFormat) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={disabled}
          />

          {showTime && (
            <>
              <Separator className="my-3" />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <Label className="text-sm font-medium">Time</Label>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="hour" className="text-xs text-muted-foreground">
                      Hour
                    </Label>
                    <Select
                      value={currentHour}
                      onValueChange={(value) => { handleTimeChange("hour", value); }}
                      disabled={disabled}
                    >
                      <SelectTrigger id="hour" className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hourOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="minute" className="text-xs text-muted-foreground">
                      Minute
                    </Label>
                    <Select
                      value={currentMinute}
                      onValueChange={(value) => { handleTimeChange("minute", value); }}
                      disabled={disabled}
                    >
                      <SelectTrigger id="minute" className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {minuteOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!use24Hour && (
                    <div className="flex-1">
                      <Label htmlFor="ampm" className="text-xs text-muted-foreground">
                        Period
                      </Label>
                      <Select
                        value={currentAmPm}
                        onValueChange={(value) => { handleTimeChange("ampm", value); }}
                        disabled={disabled}
                      >
                        <SelectTrigger id="ampm" className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date()
                      setSelectedDate(now)
                      onChange?.(now)
                    }}
                    disabled={disabled}
                    className="flex-1"
                  >
                    Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDate(undefined)
                      onChange?.(undefined)
                    }}
                    disabled={disabled}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
