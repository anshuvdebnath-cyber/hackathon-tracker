/**
 * Shared TypeScript definitions for Hackathon Tracker PWA
 */

export type HackathonMode = 'online' | 'in-person';

export type HackathonOutcome = 'pending' | 'won' | 'finalist' | 'participant';

export type HackathonStatus = 'upcoming' | 'ongoing' | 'completed';

export type ActiveTab = 'all' | 'upcoming' | 'ongoing' | 'completed';

export type ActiveNavView = 'dashboard' | 'add' | 'settings' | 'onboarding';

export interface Hackathon {
  id: string;
  name: string;
  mode: HackathonMode;
  venue: string;
  link: string;
  registrationDeadline: string;
  startTime: string;
  endTime: string;
  tags?: string[];
  resultsReceived: boolean;
  outcome: HackathonOutcome;
  notes: string;
  status: HackathonStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HackathonFormData {
  name: string;
  mode: HackathonMode;
  venue: string;
  link: string;
  registrationDeadline: string;
  startTime: string;
  endTime: string;
  tags: string;
  resultsReceived: boolean;
  outcome: HackathonOutcome;
  notes: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  errors?: Array<{ field: string; message: string; value?: any }>;
}

export interface NotificationSettings {
  enabled: boolean;
  deadlineAlertHours: number;
  startTimeAlertHours: number;
  soundEnabled: boolean;
}
