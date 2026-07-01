import * as React from "react"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const pad = (value: number) => String(value).padStart(2, "0")

const parseLocalDatetime = (value: string) => {
  if (!value) return undefined
  const [datePart, timePart] = value.split("T")
  if (!datePart || !timePart) return undefined
  const [year, month, day] = datePart.split("-").map(Number)
  const [hours, minutes] = timePart.split(":").map(Number)
  if ([year, month, day, hours, minutes].some((v) => Number.isNaN(v))) return undefined
  return new Date(year, month - 1, day, hours, minutes)
}

const formatLocalDatetime = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

const formatDisplayTime = (date: Date) => {
  const hours = date.getHours()
  const minutes = pad(date.getMinutes())
  const meridiem = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes} ${meridiem}`
}

const timeOptions = Array.from({ length: 24 * 4 }, (_, index) => {
  const hours = Math.floor(index / 4)
  const minutes = (index % 4) * 15
  const meridiem = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  return {
    value: `${pad(hours)}:${pad(minutes)}`,
    label: `${hour12}:${pad(minutes)} ${meridiem}`,
  }
})

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  const initialDate = React.useMemo(() => parseLocalDatetime(value) ?? new Date(), [value])
  const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate)
  const [selectedTime, setSelectedTime] = React.useState<string>(
    `${pad(initialDate.getHours())}:${pad(initialDate.getMinutes())}`
  )
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const nextDate = parseLocalDatetime(value) ?? new Date()
    setSelectedDate(nextDate)
    setSelectedTime(`${pad(nextDate.getHours())}:${pad(nextDate.getMinutes())}`)
  }, [value])

  React.useEffect(() => {
    const next = new Date(selectedDate)
    const [hoursString, minutesString] = selectedTime.split(":")
    next.setHours(Number(hoursString), Number(minutesString))
    const formatted = formatLocalDatetime(next)
    if (formatted !== value) {
      onChange(formatted)
    }
  }, [selectedDate, selectedTime, onChange, value])

  const selectedDateDisplay = formatDisplayDate(selectedDate)
  const selectedTimeDisplay = formatDisplayTime(selectedDate)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group w-full text-left rounded-xl border border-lime-200 bg-white px-4 py-3 transition hover:border-lime-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200",
            className
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-100 text-lime-700">
                <CalendarIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-forest-900">{selectedDateDisplay}</p>
                <p className="text-xs text-forest-500">{selectedTimeDisplay}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-2 py-1 text-xs font-medium text-lime-700">
              <Clock className="h-3.5 w-3.5" />
              Cambiar
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(24rem,100vw)] p-4">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-2xl border border-lime-200"
          />
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest-500">Hora</p>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="h-11 rounded-xl border border-lime-200 bg-white px-3 text-left">
                <SelectValue placeholder="Selecciona hora" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Listo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
