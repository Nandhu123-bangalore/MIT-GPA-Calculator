/**
 * MIT Manipal GPA Calculation Logic
 * 
 * This file keeps the core math separate and pristine, as requested,
 * matching the user's calculation logic exactly.
 */

export interface Subject {
  id: string; // Unique ID for key tracking in lists
  name: string;
  credits: string;
  grade: string;
}

export interface CalculationResult {
  gpa: string;
  totalCredits: number;
  earnedPoints: number;
  maxPointsPossible: number;
}

/**
 * Calculates the GPA and other academic metrics based on MIT Manipal's grading system.
 * Matches user's exact float-based credits & grade formula.
 */
export function calculateGPA(subjects: Subject[]): CalculationResult {
  let totalCredits = 0;
  let totalPoints = 0;

  subjects.forEach(subject => {
    const grade = parseFloat(subject.grade);
    const credits = parseFloat(subject.credits);
    
    if (!isNaN(grade) && !isNaN(credits)) {
      totalCredits += credits;
      totalPoints += grade * credits;
    }
  });

  const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  return {
    gpa,
    totalCredits,
    earnedPoints: totalPoints,
    maxPointsPossible: totalCredits * 10
  };
}

/**
 * MIT Manipal Standard Grade to Point Mapping
 */
export interface GradeMapping {
  grade: string;
  points: number;
  description: string;
  color: string; // Tailwind color class for badges
}

export const MIT_GRADE_MAPPINGS: GradeMapping[] = [
  { grade: "A+", points: 10, description: "Outstanding", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { grade: "A", points: 9, description: "Excellent", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { grade: "B", points: 8, description: "Very Good", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { grade: "C", points: 7, description: "Good", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { grade: "D", points: 6, description: "Average", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { grade: "E", points: 5, description: "Pass", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { grade: "F/W", points: 0, description: "Fail / Withdrawn", color: "bg-rose-50 text-rose-700 border-rose-200" }
];
