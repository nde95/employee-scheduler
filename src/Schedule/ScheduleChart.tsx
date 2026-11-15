import type { Employee } from "../types/employee"
import type { ScheduleResult, Shift } from "../types/schedule"
import { formatHour } from "./ShiftForm"

const hours = Array.from({ length: 24 }, (_, index) => index)
const colors: Record<string, string> = {
    cleaning: "mint", cashier: "amber", security: "violet", floor: "blue",
}

export default function ScheduleChart({ shifts, employees, result, onEdit, onAdd }: {
    shifts: Shift[]
    employees: Employee[]
    result: ScheduleResult | null
    onEdit: (shift: Shift) => void
    onAdd: (hour: number, workstation: string, role: string) => void
}) {
    const names = new Map(employees.map(({ id, name }) => [id, name]))
    const assignments = new Map(result?.assignments.map(({ shiftId, employeeId }) => [shiftId, employeeId]))
    const stations = Map.groupBy(shifts, (shift) => shift.workstation.trim().toLowerCase())

    return <div className="schedule-scroll">
        <div className="schedule-grid">
            <div className="schedule-row ruler">
                <div>WORKSTATION</div>
                <div className="hours">{hours.map((hour) => <span key={hour}>{String(hour).padStart(2, "0")}</span>)}</div>
            </div>
            {Array.from(stations.values(), (slots) => {
                const { workstation } = slots[0]
                const roles = [...new Set(slots.map((shift) => shift.role))]
                return <div className="schedule-row" key={workstation.toLowerCase()}>
                    <div className="station"><strong>{workstation}</strong><small>{roles.join(" / ")}</small></div>
                    <div className="track">
                        <div className="hours">
                            {hours.map((hour) => <button key={hour} className="hour-cell"
                                aria-label={`Add shift at ${workstation}, ${formatHour(hour)}`}
                                onClick={() => onAdd(hour, workstation, roles[0])}>+</button>)}
                        </div>
                        {slots.map((shift) => {
                            const employeeId = assignments.get(shift.id)
                            const name = employeeId === undefined ? undefined : names.get(employeeId)
                            const label = name ?? (result ? "Unfilled" : shift.role)
                            const end = shift.startHour + shift.durationHours
                            const details = `${label} · ${formatHour(shift.startHour)}–${formatHour(end)} · ${shift.durationHours}h`
                            return <button key={shift.id} title={details} aria-label={`Edit shift: ${details}`}
                                onClick={() => onEdit(shift)}
                                className={`shift ${result && !name ? "unfilled" : colors[shift.role.toLowerCase()] ?? "blue"}`}
                                style={{ left: `${shift.startHour / 24 * 100}%`, width: `${shift.durationHours / 24 * 100}%` }}>
                                <strong>{label}</strong><small>{formatHour(shift.startHour)}–{formatHour(end)} · {shift.durationHours}h</small>
                            </button>
                        })}
                    </div>
                </div>
            })}
        </div>
    </div>
}
