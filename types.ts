export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  PreferNotToSay = 'PreferNotToSay'
}

export interface User {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  coins: number;
  isPro: boolean;
  trustedContact?: string;
}

export interface MoodEntry {
  id: string;
  timestamp: Date;
  note: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string; // ISO string
  notes?: string;
  reminderMinutes?: number; // Added field for reminders
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  isAudio?: boolean;
}

export interface WorkoutPlan {
  name: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    description: string;
  }[];
}

export interface HealthStats {
  steps: number;
  stepGoal: number;
  sleepHours: number;
  screenTimeHours: number;
}
