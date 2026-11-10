export interface Employee {
    id: number;
    name: string;
    role: string;
    classification: string;
    workedHours: number;
    skillLevel: SkillLevel;
    wage: number;
    availability: Availability[];
    constraints: SchedulingConstraints;
}

export interface Availability {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export interface SchedulingConstraints {
    unavailableDays?: DayOfWeek[];
    unavailablePeriods?: ShiftPeriod[];

    prefDaysOff?: DayOfWeek[];
    prefShiftPeriod?: ShiftPeriod[];

    maxDaysPerWeek: number;

    willWorkWeekends: boolean;
}

export type DayOfWeek = | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export type ShiftPeriod = | "morning" | "afternoon" | "evening";

export type ConstraintPriority = "required" | "preferred"

export type SkillLevel = "Entry Level" | "Mid Level" | "High Level"