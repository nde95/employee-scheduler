import { useState, type FormEvent } from "react"
import { days, type DayOfWeek } from "../types/employee"
import type { Shift } from "../types/schedule"
import { periodForHour } from "./shifts"

export function formatHour(hour: number) {
    const minutes = Math.round(hour * 60)
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
}

export default function ShiftForm({ shift, day, hour, roles, workstation, role, onSave, onRemove }: {
    shift?: Shift
    day: DayOfWeek
    hour: number
    roles: string[]
    workstation?: string
    role?: string
    onSave: (shift: Omit<Shift, "id">) => string | undefined
    onRemove: () => void
}) {
    const [error, setError] = useState("")
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const startHour = Number(data.get("start"))
        const endHour = Number(data.get("end"))
        const role = String(data.get("role")).trim()
        const workstation = String(data.get("workstation")).trim()
        if (!role || !workstation || endHour <= startHour) {
            setError("Enter a workstation and role, and choose an end time after the start time.")
            return
        }
        setError(onSave({
            day: data.get("day") as DayOfWeek, startHour,
            durationHours: endHour - startHour, period: periodForHour(startHour),
            role, workstation,
        }) ?? "")
    }

    const start = shift?.startHour ?? hour
    const times = Array.from({ length: 49 }, (_, index) => index / 2)
    return <form onSubmit={submit}>
        <div className="fields">
            <label>Workstation<input name="workstation" required defaultValue={shift?.workstation ?? workstation} placeholder="Register 01" /></label>
            <label>Role<input name="role" required list="employee-roles" defaultValue={shift?.role ?? role} placeholder="Cashier" />
                <datalist id="employee-roles">{roles.map((role) => <option key={role} value={role} />)}</datalist>
            </label>
            <label>Day<select name="day" defaultValue={shift?.day ?? day}>
                {days.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
            </select></label>
            <div className="fields">
                <label>Starts<select name="start" defaultValue={start}>
                    {times.slice(0, -1).map((time) => <option key={time} value={time}>{formatHour(time)}</option>)}
                </select></label>
                <label>Ends<select name="end" defaultValue={shift ? start + shift.durationHours : Math.min(start + 4, 24)}>
                    {times.slice(1).map((time) => <option key={time} value={time}>{formatHour(time)}</option>)}
                </select></label>
            </div>
        </div>
        {error && <p role="alert" className="danger-text">{error}</p>}
        <div className="actions form-actions">
            <button className="primary">{shift ? "Save shift" : "Add shift"}</button>
            {shift && <button type="button" className="danger" onClick={onRemove}>Remove shift</button>}
        </div>
    </form>
}
