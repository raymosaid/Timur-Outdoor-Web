"use client"

import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function DateAndTimePicker({ children, date, setDate, className }) {
  const [open, setOpen] = React.useState(false)

  // Format date to time string (HH:MM:SS)
  const formatTimeValue = (date) => {
    return date.toTimeString().slice(0, 8) // Gets HH:MM:SS format
  }

  // Handle time input change
  const handleTimeChange = (event) => {
    const timeValue = event.target.value // Format: "HH:MM:SS"

    if (timeValue) {
      const [hours, minutes, seconds] = timeValue.split(":").map(Number)

      // Create new date with updated time but same date
      const newDate = new Date(date)
      newDate.setHours(hours, minutes, seconds || 0)

      setDate(newDate)
    }
  }

  return (
    (<div className={cn("flex gap-4", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {children ?? (  
            <Button variant="outline" id="date" className="w-32 justify-between font-normal">
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(newDate) => {
              newDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds())
              setDate(newDate)
              setOpen(false)
            }} />
          <div className="m-2 flex items-center justify-center">
            <Input
              type="time"
              id="time"
              step="1"
              value={formatTimeValue(date)}
              onChange={handleTimeChange}
              className="text-center bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </PopoverContent>
      </Popover>
      {!children && (
        <Input
          type="time"
          id="time"
          step="1"
          value={formatTimeValue(date)}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      )}
    </div>)
  );
}
