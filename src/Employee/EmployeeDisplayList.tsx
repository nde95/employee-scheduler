import type { Employee } from "../types/employee"


const EmployeeDisplayList = () => {

const employees: Employee[] = [
    {
        id: 1,
        name: "John Smith",
        role: "Cashier",
        classification: "Full-Time",
        availability: [],
        skillLevel: "High Level",
        wage: 24.23,
        workedHours: 0,
        constraints: {
            maxDaysPerWeek: 5,
            willWorkWeekends: true,
        }
    },
    {
        id: 2,
        name: "Jane Carpenter",
        role: "Cleaning",
        classification: "Part-Time",
        availability: [],
        skillLevel: "Entry Level",
        wage: 15.75,
        workedHours: 0,
        constraints: {
            maxDaysPerWeek: 4,
            willWorkWeekends: false,
        }
    }
]


return (
    <div className="employeesContainer">
        <div className = "employeeData flex flex-col">
            {employees.map((employee) =>(
                <div 
                key={employee.id}
                className="flex flex-col items-center border-2"
                > 
                {/* remove border once flex is figured out */}
                    <span className="font-bold">{employee.name}</span>
                    <span>{employee.role}</span>
                    <span>{employee.classification}</span>
                    <span>Hours this week: {employee.workedHours} at ${employee.wage} an hour.</span>
                </div>
            ))}
        </div>
    </div>

    )

}

export default EmployeeDisplayList
