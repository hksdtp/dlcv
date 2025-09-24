// FIX: Define TaskStatus enum and interfaces for Subtask and Task.
export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  subtasks: Subtask[];
  createdAt: string; // ISO string
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface SelectOption {
  value: string;
  label: string;
}