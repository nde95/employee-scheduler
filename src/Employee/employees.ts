import type { Employee } from "../types/employee"

const weekdays = {
    monday: true, tuesday: true, wednesday: true, thursday: true, friday: true,
    saturday: false, sunday: false,
}

export const employees: Employee[] = [
    { id: 1, name: "John Smith", role: "Cashier", classification: "Full-Time", wage: 24.23 },
    { id: 2, name: "Jane Carpenter", role: "Cleaning", classification: "Part-Time", wage: 15.75 },
    { id: 3, name: "Alex Rivera", role: "Cashier", classification: "Part-Time", wage: 18 },
    { id: 4, name: "Morgan Lee", role: "Security", classification: "Full-Time", wage: 23 },
    { id: 5, name: "Sam Patel", role: "Floor", classification: "Full-Time", wage: 20 },
].map((employee): Employee => ({
    ...employee,
    availability: [weekdays],
    workedHours: 0,
    skillLevel: employee.id === 1 ? "High Level" : "Entry Level",
    constraints: { maxDaysPerWeek: 5, maxHoursPerDay: 8, willWorkWeekends: false },
}))
