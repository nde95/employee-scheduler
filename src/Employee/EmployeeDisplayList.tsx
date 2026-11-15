import type { Employee } from "../types/employee"

export default function EmployeeDisplayList({ employees, onEdit, onRemoveEmployee }: {
    employees: Employee[]
    onEdit: (employee: Employee) => void
    onRemoveEmployee: (id: number) => void
}) {
    return <div className="staff-list">
        {employees.map((employee) => <article key={employee.id}>
            <div><strong>{employee.name}</strong><small>{employee.role} · {employee.classification} · ${employee.wage.toFixed(2)}/hr</small></div>
            <div className="actions">
                <button onClick={() => onEdit(employee)}>Edit</button>
                <button className="danger" onClick={() => onRemoveEmployee(employee.id)} aria-label={`Remove ${employee.name}`}>Remove</button>
            </div>
        </article>)}
        {employees.length === 0 && <p>No employees yet.</p>}
    </div>
}
