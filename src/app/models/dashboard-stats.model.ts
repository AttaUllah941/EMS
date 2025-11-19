export interface DashboardStats {
  totalEmployees: number;
  totalProjects: number;
  tasksByStatus: {
    Pending: number;
    'In Progress': number;
    Completed: number;
  };
  projectsByClient: { [client: string]: number };
}

