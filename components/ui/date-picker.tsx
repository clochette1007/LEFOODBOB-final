"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface DatePickerProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  mode?: "single" | "multiple" | "range"
}

function DatePicker({
  className,
  selected,
  onSelect,
  disabled,
  mode = "single",
  ...props
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }
  
  const selectDate = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (disabled && disabled(newDate)) return
    onSelect?.(newDate)
  }
  
  const isSelected = (day: number) => {
    if (!selected) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return selected.toDateString() === date.toDateString()
  }
  
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]
  
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  
  return (
    <div className={cn("p-3", className)} {...props}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={previousMonth}
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button
          onClick={nextMonth}
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const isSelectedDay = isSelected(day)
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          const isDisabled = disabled && disabled(date)
          
          return (
            <button
              key={day}
              onClick={() => selectDate(day)}
              disabled={isDisabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal",
                isSelectedDay && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isDisabled && "text-muted-foreground opacity-50"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

DatePicker.displayName = "DatePicker"

export { DatePicker as Calendar }
export type { DatePickerProps as CalendarProps } 