export interface Task {
  id: number;
  projectId: number;
  name: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedEmployeeId: number | null;
  dueDate: string;
}

