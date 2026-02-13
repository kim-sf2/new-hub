
export interface SleepLog {
  id: string;
  startTime: string; // ISO String
  endTime?: string;  // ISO String
  duration?: number; // hours
  quality: number;   // 0-100
}

export interface FunctionalFood {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  imageUrl: string;
  price: number;
  ingredients: string[];
  type: 'deep_sleep' | 'fast_sleep' | 'recovery';
}

export interface UserProfile {
  name: string;
  targetSleepTime: string; // HH:mm
  wakeUpTime: string; // HH:mm
}
