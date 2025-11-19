export interface Project {
  id: number;
  name: string;
  client: string;
  deadline: string;
  status: 'Active' | 'On Hold' | 'Completed';
  employeeIds: number[];
}

