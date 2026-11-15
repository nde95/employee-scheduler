import { useEffect, useRef, useState, type ReactNode } from "react"
import { employees as starterEmployees } from "./Employee/employees"
import AddEmployeeForm from "./Employee/AddEmployeeForm"
import EmployeeDisplayList from "./Employee/EmployeeDisplayList"
import ShiftForm from "./Schedule/ShiftForm"
import ScheduleChart from "./Schedule/ScheduleChart"
import { shifts as starterShifts } from "./Schedule/shifts"
import { generateSchedule } from "./scheduling/generateSchedule"
import { days, type DayOfWeek, type Employee } from "./types/employee"
import type { ScheduleResult, Shift } from "./types/schedule"

interface Plan {
    employees: Employee[]
    shifts: Shift[]
    result: ScheduleResult | null
}

const storageKey = "employee-scheduler-v1"
function loadPlan(): Plan {
    try {
        const saved = localStorage.getItem(storageKey)
        if (saved) return JSON.parse(saved) as Plan
    } catch {
        // Open the sample plan if browser storage is unavailable.
    }
    return {
        employees: starterEmployees,
        shifts: starterShifts,
        result: generateSchedule(starterEmployees, starterShifts),
    }
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null)
    useEffect(() => { dialog.current?.showModal() }, [])
    return <dialog ref={dialog} aria-labelledby="dialog-title" onCancel={onClose}>
        <div className="modal-head"><h2 id="dialog-title">{title}</h2><button onClick={onClose} aria-label="Close">×</button></div>
        {children}
    </dialog>
}

type Panel =
    | { kind: "employees" }
    | { kind: "employee"; employee?: Employee }
    | { kind: "shift"; shift?: Shift; hour: number; workstation?: string; role?: string }

export default function App() {
    const [plan, setPlan] = useState(loadPlan)
    const [day, setDay] = useState<DayOfWeek>("monday")
    const [search, setSearch] = useState("")
    const [panel, setPanel] = useState<Panel | null>(null)
    const [saveError, setSaveError] = useState(false)
    const { employees, shifts, result } = plan

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(plan))
            setSaveError(false)
        } catch {
            setSaveError(true)
        }
    }, [plan])

    function saveEmployee(employee: Omit<Employee, "id">, existingId?: number) {
        setPlan((current) => {
            const id = existingId ?? Math.max(0, ...current.employees.map((item) => item.id)) + 1
            const saved = { ...employee, id }
            const updated = existingId === undefined
                ? [...current.employees, saved]
                : current.employees.map((item) => item.id === id ? saved : item)
            return { ...current, employees: updated, result: null }
        })
        setPanel({ kind: "employees" })
    }

    function saveShift(shift: Omit<Shift, "id">, existingId?: number) {
        const sameStation = shifts.some((item) =>
            item.id !== existingId && item.day === shift.day &&
            item.workstation.toLowerCase() === shift.workstation.toLowerCase() &&
            item.startHour < shift.startHour + shift.durationHours &&
            shift.startHour < item.startHour + item.durationHours)
        if (sameStation) return "This workstation already has a shift during that time. Use a separate workstation for simultaneous coverage."

        setPlan((current) => {
            const id = existingId ?? Math.max(0, ...current.shifts.map((item) => item.id)) + 1
            const saved = { ...shift, id }
            const updated = existingId === undefined
                ? [...current.shifts, saved]
                : current.shifts.map((item) => item.id === id ? saved : item)
            return { ...current, shifts: updated, result: null }
        })
        setDay(shift.day)
        setSearch("")
        setPanel(null)
    }

    const dayShifts = shifts.filter((shift) => shift.day === day)
    const visible = dayShifts.filter((shift) =>
        shift.workstation.toLowerCase().includes(search.trim().toLowerCase()))
    const assignedIds = new Set(result?.assignments.map(({ shiftId }) => shiftId))
    const filled = dayShifts.filter((shift) => assignedIds.has(shift.id)).length
    const totalHours = dayShifts.reduce((sum, shift) => sum + shift.durationHours, 0)

    return <div className="shell">
        <header className="topbar">
            <div className="brand"><span className="brand-mark" aria-hidden="true">▦</span> Employee Scheduler</div>
            <div className="actions">
                <button onClick={() => setPanel({ kind: "employees" })}>Employees <span className="count">{employees.length}</span></button>
                <button className="primary" disabled={!shifts.length} onClick={() =>
                    setPlan((current) => ({ ...current, result: generateSchedule(current.employees, current.shifts) }))
                }>Generate schedule</button>
            </div>
        </header>
        <main>
            <div className="page-head">
                <div><h1>Weekly schedule</h1><p>Plan workstation coverage from Monday to Sunday.</p></div>
                <button className="secondary" onClick={() => setPanel({ kind: "shift", hour: 9 })}>+ Add shift</button>
            </div>
            <div className="workspace">
                <nav aria-label="Days of the week">
                    {days.map((item) => {
                        const count = shifts.filter((shift) => shift.day === item).length
                        return <button key={item} aria-current={day === item ? "true" : undefined}
                            className={day === item ? "selected" : ""} onClick={() => setDay(item)}>
                            <span>{item}</span><small>{count} {count === 1 ? "shift" : "shifts"}</small>
                        </button>
                    })}
                </nav>
                <section className="board" aria-label={`${day} schedule`}>
                    <header className="board-head">
                        <div><h2>{day}</h2><p>{dayShifts.length} shifts · {totalHours} planned hours</p></div>
                        <input type="search" aria-label="Search workstations" placeholder="Search workstations…" value={search}
                            onChange={(event) => setSearch(event.target.value)} />
                    </header>
                    <ScheduleChart shifts={visible} employees={employees} result={result}
                        onEdit={(shift) => setPanel({ kind: "shift", shift, hour: shift.startHour })}
                        onAdd={(hour, workstation, role) => setPanel({ kind: "shift", hour, workstation, role })} />
                    {!visible.length && <p className="empty">{dayShifts.length ? "No workstations match your search." : "No shifts planned for this day. Add a shift to start."}</p>}
                    <footer className="board-foot">
                        <span aria-live="polite">{result ? `${filled} assigned · ${dayShifts.length - filled} unfilled` : "Draft · Generate schedule to assign employees"}</span>
                        <span>Click a shift to edit it.</span>
                    </footer>
                </section>
            </div>
            {saveError && <p role="alert" className="danger-text">Browser storage is unavailable. Changes are kept for this session.</p>}
        </main>
        {panel && <Modal title={panel.kind === "employees" ? "Employees" : panel.kind === "employee"
            ? panel.employee ? "Edit employee" : "Add employee"
            : panel.shift ? "Edit shift" : "Add shift"} onClose={() => setPanel(null)}>
            {panel.kind === "employees" && <>
                <button className="primary" onClick={() => setPanel({ kind: "employee" })}>+ Add employee</button>
                <EmployeeDisplayList employees={employees} onEdit={(employee) => setPanel({ kind: "employee", employee })}
                    onRemoveEmployee={(id) => setPlan((current) => ({
                        ...current, employees: current.employees.filter((item) => item.id !== id), result: null,
                    }))} />
            </>}
            {panel.kind === "employee" && <AddEmployeeForm employee={panel.employee}
                onSave={(employee) => saveEmployee(employee, panel.employee?.id)} />}
            {panel.kind === "shift" && <ShiftForm shift={panel.shift} day={day} hour={panel.hour}
                workstation={panel.workstation} role={panel.role}
                roles={[...new Set(employees.map((employee) => employee.role))]}
                onSave={(shift) => saveShift(shift, panel.shift?.id)}
                onRemove={() => {
                    setPlan((current) => ({ ...current, shifts: current.shifts.filter((item) => item.id !== panel.shift?.id), result: null }))
                    setPanel(null)
                }} />}
        </Modal>}
    </div>
}
