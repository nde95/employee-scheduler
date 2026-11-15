import type { DayOfWeek, ShiftPeriod } from "./employee"

export interface Shift {
    id: number
    day: DayOfWeek
    period: ShiftPeriod
    role: string
    durationHours: number
    startHour: number
    workstation: string
}

export interface Assignment {
    shiftId: number
    employeeId: number
}

export interface ScheduleResult {
    assignments: Assignment[]
    unfilledShiftIds: number[]
}
