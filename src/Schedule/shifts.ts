import { days, type ShiftPeriod } from "../types/employee"
import type { Shift } from "../types/schedule"

export const periods: ShiftPeriod[] = ["morning", "afternoon", "evening"]
export function periodForHour(hour: number): ShiftPeriod {
    if (hour < 12) return "morning"
    if (hour < 17) return "afternoon"
    return "evening"
}

const template = [
    { workstation: "Cleaning station", role: "Cleaning", startHour: 8, durationHours: 5 },
    { workstation: "Register 01", role: "Cashier", startHour: 9, durationHours: 8 },
    { workstation: "Register 02", role: "Cashier", startHour: 11, durationHours: 4 },
    { workstation: "Security desk", role: "Security", startHour: 10, durationHours: 8 },
    { workstation: "Sales floor", role: "Floor", startHour: 12, durationHours: 8 },
    { workstation: "Register 01", role: "Cashier", startHour: 17, durationHours: 4 },
]

export const shifts: Shift[] = days.slice(0, 5).flatMap((day, dayIndex) =>
    template.map((slot, index) => ({
        ...slot, day, id: dayIndex * template.length + index + 1,
        period: periodForHour(slot.startHour),
    })))
