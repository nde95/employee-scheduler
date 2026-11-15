import type { Employee } from "../types/employee"
import type { ScheduleResult, Shift } from "../types/schedule"

function canWork(employee: Employee, shift: Shift, assigned: Shift[]) {
    const rules = employee.constraints
    const weekend = shift.day === "saturday" || shift.day === "sunday"
    if (employee.role.trim().toLowerCase() !== shift.role.trim().toLowerCase()
        || !employee.availability.some((week) => week[shift.day])
        || rules.unavailableDays?.includes(shift.day)
        || rules.unavailablePeriods?.includes(shift.period)
        || (weekend && !rules.willWorkWeekends)) return false

    const sameDay = assigned.filter((slot) => slot.day === shift.day)
    const overlaps = sameDay.some((slot) =>
        slot.startHour < shift.startHour + shift.durationHours &&
        shift.startHour < slot.startHour + slot.durationHours)
    const dailyHours = sameDay.reduce((sum, slot) => sum + slot.durationHours, 0)
    const daysWorked = new Set([...assigned.map((slot) => slot.day), shift.day])
    return !overlaps && dailyHours + shift.durationHours <= rules.maxHoursPerDay
        && daysWorked.size <= rules.maxDaysPerWeek
}

function preferenceScore(employee: Employee, shift: Shift) {
    return Number(Boolean(employee.constraints.prefShiftPeriod?.includes(shift.period)))
        - Number(Boolean(employee.constraints.prefDaysOff?.includes(shift.day)))
}

export function generateSchedule(employees: Employee[], shifts: Shift[]): ScheduleResult {
    const staff = employees.map((employee) => ({
        employee, assigned: [] as Shift[], hours: 0,
    }))
    const result: ScheduleResult = { assignments: [], unfilledShiftIds: [] }
    const slots = shifts.map((shift) => ({
        shift, eligible: staff.filter(({ employee }) => canWork(employee, shift, [])).length,
    }))
    slots.sort((a, b) => a.eligible - b.eligible)

    for (const { shift } of slots) {
        const candidates = staff.filter(({ employee, assigned }) => canWork(employee, shift, assigned))
        candidates.sort((a, b) =>
            preferenceScore(b.employee, shift) - preferenceScore(a.employee, shift) ||
            a.hours - b.hours || a.employee.id - b.employee.id)
        const selected = candidates[0]
        if (!selected) {
            result.unfilledShiftIds.push(shift.id)
            continue
        }
        selected.assigned.push(shift)
        selected.hours += shift.durationHours
        result.assignments.push({ shiftId: shift.id, employeeId: selected.employee.id })
    }
    return result
}
