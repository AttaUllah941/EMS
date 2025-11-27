import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    { id: 1, name: 'Website Redesign', client: 'Tech Corp', deadline: '2024-12-31', status: 'Active', employeeIds: [1, 2, 5] },
    { id: 2, name: 'Mobile App Development', client: 'StartupXYZ', deadline: '2024-11-30', status: 'Active', employeeIds: [1, 7] },
    { id: 3, name: 'E-commerce Platform', client: 'Retail Inc', deadline: '2025-01-15', status: 'On Hold', employeeIds: [2, 4, 6] },
    { id: 4, name: 'Data Analytics Dashboard', client: 'Finance Co', deadline: '2024-12-20', status: 'Active', employeeIds: [4, 5, 6, 7] },
    { id: 5, name: 'Cloud Migration', client: 'Enterprise Solutions', deadline: '2025-02-28', status: 'Active', employeeIds: [9, 10, 13, 18] },
    { id: 6, name: 'API Gateway', client: 'Tech Innovations', deadline: '2024-12-15', status: 'Active', employeeIds: [9, 11, 19, 24] },
    { id: 7, name: 'UI/UX Redesign', client: 'Creative Agency', deadline: '2025-01-20', status: 'On Hold', employeeIds: [10] },
    { id: 8, name: 'Security Audit', client: 'Banking Corp', deadline: '2024-11-25', status: 'Active', employeeIds: [11, 13, 16, 23] },
    { id: 9, name: 'Mobile Banking App', client: 'Financial Services', deadline: '2025-03-10', status: 'Active', employeeIds: [14, 21] },
    { id: 10, name: 'Inventory Management', client: 'Retail Chain', deadline: '2025-01-05', status: 'Active', employeeIds: [13, 15, 20, 25] },
    { id: 11, name: 'Customer Portal', client: 'Service Provider', deadline: '2024-12-10', status: 'On Hold', employeeIds: [14, 18, 24, 28] },
    { id: 12, name: 'Marketing Automation', client: 'Digital Agency', deadline: '2025-02-15', status: 'Active', employeeIds: [15, 26] }
  ];

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  getProjectById(id: number): Observable<Project | undefined> {
    const project = this.projects.find(proj => proj.id === id);
    return of(project);
  }

  updateProject(project: Project): Observable<Project> {
    const index = this.projects.findIndex(proj => proj.id === project.id);
    if (index !== -1) {
      this.projects[index] = project;
    }
    return of(project);
  }

  assignEmployeeToProject(projectId: number, employeeId: number): Observable<void> {
    const project = this.projects.find(proj => proj.id === projectId);
    if (project && !project.employeeIds.includes(employeeId)) {
      project.employeeIds.push(employeeId);
    }
    return of(undefined);
  }

  removeEmployeeFromProject(projectId: number, employeeId: number): Observable<void> {
    const project = this.projects.find(proj => proj.id === projectId);
    if (project) {
      project.employeeIds = project.employeeIds.filter(id => id !== employeeId);
    }
    return of(undefined);
  }
}
