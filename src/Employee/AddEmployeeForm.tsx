import type { FormEvent } from "react"
import { days, type Availability, type Employee, type SkillLevel, type ShiftPeriod } from "../types/employee"
import { periods } from "../Schedule/shifts"

export default function AddEmployeeForm({ employee, onSave }: {
    employee?: Employee
    onSave: (employee: Omit<Employee, "id">) => void
}) {
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const name = String(data.get("name")).trim()
        const role = String(data.get("role")).trim()
        if (!name || !role) return

        const availability = Object.fromEntries(
            days.map((day) => [day, data.getAll("available").includes(day)]),
        ) as Availability

        onSave({
            name, role, classification: String(data.get("classification")),
            wage: Number(data.get("wage")), skillLevel: String(data.get("skill")) as SkillLevel,
            workedHours: employee?.workedHours ?? 0, availability: [availability],
            constraints: {
                maxDaysPerWeek: Number(data.get("maxDays")),
                maxHoursPerDay: Number(data.get("maxHours")),
                willWorkWeekends: availability.saturday || availability.sunday,
                unavailablePeriods: data.getAll("blocked") as ShiftPeriod[],
                prefDaysOff: days.filter((day) => data.getAll("preferredOff").includes(day)),
                prefShiftPeriod: periods.filter((period) => data.get("preferred") === period),
            },
        })
    }

    return <form onSubmit={submit}>
        <div className="fields">
            <label>Name<input name="name" required pattern=".*\S.*" defaultValue={employee?.name} /></label>
            <label>Role<input name="role" required pattern=".*\S.*" placeholder="Cashier" defaultValue={employee?.role} /></label>
            <label>Classification<select name="classification" defaultValue={employee?.classification}>
                <option>Full-Time</option><option>Part-Time</option>
            </select></label>
            <label>Hourly wage<input name="wage" type="number" min="0" step="0.01" required defaultValue={employee?.wage} /></label>
            <label>Skill level<select name="skill" defaultValue={employee?.skillLevel}>
                <option>Entry Level</option><option>Mid Level</option><option>High Level</option>
            </select></label>
            <label>Preferred shift<select name="preferred" defaultValue={employee?.constraints.prefShiftPeriod?.[0] ?? ""}>
                <option value="">Any period</option>
                {periods.map((period) => <option key={period}>{period}</option>)}
            </select></label>
            <label>Max days per week<input name="maxDays" type="number" min="1" max="7" required defaultValue={employee?.constraints.maxDaysPerWeek ?? 5} /></label>
            <label>Max hours per day<input name="maxHours" type="number" min="1" max="24" step="0.5" required defaultValue={employee?.constraints.maxHoursPerDay ?? 8} /></label>
        </div>
        <fieldset><legend>Available days</legend><div className="checks">
            {days.map((day, index) => <label key={day}><input name="available" type="checkbox" value={day}
                defaultChecked={employee
                    ? employee.availability.some((week) => week[day]) && !employee.constraints.unavailableDays?.includes(day)
                    && (index < 5 || employee.constraints.willWorkWeekends)
                    : index < 5} />{day.slice(0, 3)}</label>)}
        </div></fieldset>
        <fieldset><legend>Preferred days off</legend><div className="checks">
            {days.map((day) => <label key={day}><input name="preferredOff" type="checkbox" value={day}
                defaultChecked={employee?.constraints.prefDaysOff?.includes(day)} />{day.slice(0, 3)}</label>)}
        </div></fieldset>
        <fieldset><legend>Unavailable shift periods</legend><div className="checks">
            {periods.map((period) => <label key={period}><input name="blocked" type="checkbox" value={period}
                defaultChecked={employee?.constraints.unavailablePeriods?.includes(period)} />{period}</label>)}
        </div></fieldset>
        <button className="primary">{employee ? "Save employee" : "Add employee"}</button>
    </form>
}
