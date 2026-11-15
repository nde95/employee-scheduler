export const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const
export type DayOfWeek = typeof days[number]
export type ShiftPeriod = "morning" | "afternoon" | "evening"
export type SkillLevel = "Entry Level" | "Mid Level" | "High Level"
export type Availability = Record<DayOfWeek, boolean>

export interface SchedulingConstraints {
    unavailableDays?: DayOfWeek[]
    unavailablePeriods?: ShiftPeriod[]
    prefDaysOff?: DayOfWeek[]
    prefShiftPeriod?: ShiftPeriod[]
    maxDaysPerWeek: number
    maxHoursPerDay: number
    willWorkWeekends: boolean
}

export interface Employee {
    id: number
    name: string
    role: string
    classification: string
    workedHours: number
    skillLevel: SkillLevel
    wage: number
    availability: Availability[]
    constraints: SchedulingConstraints
}
