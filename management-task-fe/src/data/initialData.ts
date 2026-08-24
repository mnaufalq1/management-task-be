import { Project, Task, User } from '../types';

export const DEMO_USER: User = {
  id: 'usr_budi_01',
  email: 'budi@gmail.com',
  name: 'Budi Pratama',
  teamName: 'MataApp Core Team',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

// Default date generator relative to today
const today = new Date();
const formatDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(today.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_TASKS: Task[] = [];
