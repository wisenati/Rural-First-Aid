
export enum UserRole {
  PATIENT = 'PATIENT',
  CAREGIVER = 'CAREGIVER',
  ORGANIZATION = 'ORGANIZATION'
}

export enum Language {
  ENGLISH = 'en',
  HAUSA = 'ha',
  YORUBA = 'yo',
  IGBO = 'ig'
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'Family' | 'Org' | 'National';
}

export interface UsageLog {
  id: string;
  action: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  username?: string;
  profilePicture?: string; // Base64 string
  email: string;
  password?: string;
  phone: string;
  age?: number;
  gender?: string;
  genotype?: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  address: string;
  preferredLanguage: Language;
  healthChallenges?: string;
  emergencyContact?: string; 
  sosContacts: EmergencyContact[];
  showInHelp: boolean;
  medicalSpecialty?: string;
  patientInteractionMethod?: string;
  organizationName?: string;
  firmType?: 'Clinic' | 'Hospital' | 'Pharmacy' | 'Others';
  otherFirmType?: string;
  usageLogs?: UsageLog[];
}

export interface InteractiveStep {
  text: string;
  feedback?: string;
  actionRequired?: string;
  critical?: boolean;
  mediaUrl?: string; // Base64 or URL
  mediaType?: 'image' | 'video';
}

export interface EmergencyGuide {
  id: string;
  title: string;
  category: string;
  icon: string;
  steps: InteractiveStep[];
  image: string;
  furtherHelp: string;
  whenToCallSOS: string;
}

export interface HealthFacility {
  id?: string;
  name: string;
  type: string;
  distance: string;
  phone: string;
  address: string;
  profilePicture?: string;
}

export interface Broadcast {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'high';
}
