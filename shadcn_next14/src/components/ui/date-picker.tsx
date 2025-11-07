"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import DatePickerComponent from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  className?: string
  placeholder?: string
  maxDate?: Date
  minDate?: Date
  showTimeSelect?: boolean
  dateFormat?: string
  id?: string
  isStartDate?: boolean
  isEndDate?: boolean
}

export function DatePicker({
  value,
  onChange,
  className,
  placeholder = "Select date",
  maxDate,
  minDate,
  showTimeSelect = false,
  dateFormat = "PPP",
  isStartDate = false,
  isEndDate = false,
  ...props
}: DatePickerProps) {
  const CustomInput = React.forwardRef<HTMLButtonElement, { value?: string | null; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
          className
        )}
        onClick={onClick}
        ref={ref}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value || <span>{placeholder}</span>}
      </Button>
    )
  )
  CustomInput.displayName = 'CustomInput'

  return (
    <DatePickerComponent
      selected={value || null}
      onChange={(date: Date | null) => {
        if (onChange && date) {
          let adjustedDate: Date;
          
          if (isStartDate) {
            // For start date: set to 00:00:00.000
            adjustedDate = new Date(date);
            adjustedDate.setHours(0, 0, 0, 0);
          } else if (isEndDate) {
            // For end date: set to 23:59:59.999
            adjustedDate = new Date(date);
            adjustedDate.setHours(23, 59, 59, 999);
          } else {
            // For other cases, use the date as is
            adjustedDate = new Date(date);
          }
          
          console.log('Adjusted date:', adjustedDate);
          console.log('Local string:', adjustedDate.toString());
          console.log('ISO string:', adjustedDate.toISOString());
          
          onChange(adjustedDate);
        } else if (onChange) {
          onChange(null);
        }
      }}
      customInput={<CustomInput />}
      maxDate={maxDate}
      minDate={minDate}
      showTimeSelect={showTimeSelect}
      showMonthYearPicker
      dateFormat={showTimeSelect ? `${dateFormat} h:mm aa` : dateFormat}
      className="w-full"
      {...props}
    />
  )
}
