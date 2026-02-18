import { z } from "zod";

export const BRANCH_CODES = ['MEI', 'MIM', 'MIP', 'MIB', 'MSI', 'BAC', 'BAI', 'BAS', 'BBA', 'BCA', 'BCE', 'BCG', 'BCY', 'BCC', 'BCH', 'BEC', 'BET', 'BEY', 'BME', 'BMR', 'BOE', 'BSA', 'BAR', 'MCS', 'MVT', 'MDS', 'MAL', 'MBM', 'MCA', 'PHD'] as const;

// VIT Bhopal Registration Number Pattern
// Format: [21-25][Branch Code][5 digits]
const VIT_REGNO_PATTERN = /^(21|22|23|24|25)(MEI|MIM|MIP|MIB|MSI|BAC|BAI|BAS|BBA|BCA|BCE|BCG|BCY|BCC|BCH|BEC|BET|BEY|BHI|BME|BMR|BOE|BSA|BAR|MCS|MVT|MDS|MAL|MBM|MCA|PHD)\d{5}$/;

export const RegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),
  
  middleName: z
    .string()
    .max(50, "Middle name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Middle name can only contain letters")
    .optional(),
  
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),
  
  regNo: z
    .string()
    .toUpperCase()
    .length(10, "Registration number must be exactly 10 characters")
    .refine(
      (val) => VIT_REGNO_PATTERN.test(val),
      "Invalid format. Expected: 25BCE10001 (Year 21-25 + Valid Branch)"
    ),
  
  email: z
    .string()
    .email("Invalid email format")
    .refine(
      (val) => val.toLowerCase().endsWith("@vitbhopal.ac.in"), 
      "Must be a @vitbhopal.ac.in email"
    ),
  
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Must be exactly 10 digits (without +91)"),
  
  passType: z.string().min(1, "Please select a pass"),
  
  eventId: z.string().optional(),
}).refine(
  (data) => {
    // Validate email matches format: firstname.regno@vitbhopal.ac.in
    const firstName = data.firstName.toLowerCase().replace(/\s+/g, '');
    const expectedEmail = `${firstName}.${data.regNo.toLowerCase()}@vitbhopal.ac.in`;
    return data.email.toLowerCase() === expectedEmail;
  },
  {
    message: "Email must match format: firstname.regno@vitbhopal.ac.in (e.g., john.25bce10001@vitbhopal.ac.in)",
    path: ["email"],
  }
);

export type RegistrationData = z.infer<typeof RegistrationSchema>;

// Helper function to validate email-regno match
export function validateEmailRegnoMatch(email: string, regNo: string, firstName: string): boolean {
  const formattedFirstName = firstName.toLowerCase().replace(/\s+/g, '');
  const expectedEmail = `${formattedFirstName}.${regNo.toLowerCase()}@vitbhopal.ac.in`;
  return email.toLowerCase() === expectedEmail;
}

// Helper to extract parts from registration number
export function parseRegNo(regNo: string) {
  const match = regNo.match(VIT_REGNO_PATTERN);
  if (!match) return null;
  
  return {
    year: match[1],
    branch: match[2],
    rollNumber: match[3],
  };
}