
export interface User {
  id: string;
  wallet_address: string;
  balance: number;
  referral_code: string;
  referral_count: number;
  daily_streak: number;
  total_tasks_completed: number;
  created_at: string;
  last_login: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'weekly';
  difficulty: 'easy' | 'medium' | 'hard';
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  reward: number;
  completed_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  reward: number;
  created_at: string;
}
