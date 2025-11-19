import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    { id: 1, name: 'Website Redesign', client: 'Tech Corp', deadline: '2024-12-31', status: 'Active', employeeIds: [1, 2, 5, 8] },
    { id: 2, name: 'Mobile App Development', client: 'StartupXYZ', deadline: '2024-11-30', status: 'Active', employeeIds: [1, 3, 7] },
    { id: 3, name: 'E-commerce Platform', client: 'Retail Inc', deadline: '2025-01-15', status: 'On Hold', employeeIds: [2, 4, 6, 8] },
    { id: 4, name: 'Data Analytics Dashboard', client: 'Finance Co', deadline: '2024-12-20', status: 'Active', employeeIds: [4, 5, 6, 7] }
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

