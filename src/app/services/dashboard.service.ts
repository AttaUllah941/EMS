import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';
import { EmployeeService } from './employee.service';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return combineLatest([
      this.employeeService.getEmployees(),
      this.projectService.getProjects(),
      this.taskService.getTasks()
    ]).pipe(
      map(([employees, projects, tasks]) => {
        const tasksByStatus = {
          Pending: tasks.filter(t => t.status === 'Pending').length,
          'In Progress': tasks.filter(t => t.status === 'In Progress').length,
          Completed: tasks.filter(t => t.status === 'Completed').length
        };

        const projectsByClient: { [client: string]: number } = {};
        projects.forEach(project => {
          projectsByClient[project.client] = (projectsByClient[project.client] || 0) + 1;
        });

        return {
          totalEmployees: employees.length,
          totalProjects: projects.length,
          tasksByStatus,
          projectsByClient
        };
      })
    );
  }
}

