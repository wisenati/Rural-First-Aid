
export enum UserRole {
  PATIENT = 'PATIENT',
  CAREGIVER = 'CAREGIVER'
}

export enum Language {
  ENGLISH = 'en',
  HAUSA = 'ha',
  YORUBA = 'yo',
  IGBO = 'ig'
}

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  password?: string;
  age: number;
  gender: string;
  genotype: string;
  bloodGroup: string;
  height: string;
  weight: string;
  address: string;
  preferredLanguage: Language;
  healthChallenges: string;
  emergencyContact: string;
  // Caregiver specific
  medicalSpecialty?: string;
  patientInteractionMethod?: string;
  experience?: string;
}

export interface InteractiveStep {
  text: string;
  feedback?: string;
  actionRequired?: string;
  critical?: boolean;
}

export interface EmergencyGuide {
  id: string;
  title: string;
  icon: string;
  steps: InteractiveStep[];
  image: string;
  furtherHelp: string;
  whenToCallSOS: string;
}

export interface HealthFacility {
  name: string;
  type: 'Hospital' | 'Clinic' | 'Pharmacy' | 'Volunteer';
  distance: string;
  phone: string;
  address: string;
}

export interface Broadcast {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'high';
}
