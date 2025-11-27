import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'employees',
    loadComponent: () => import('./components/employee-management/employee-management.component').then(m => m.EmployeeManagementComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./components/project-management/project-management.component').then(m => m.ProjectManagementComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/task-management/task-management.component').then(m => m.TaskManagementComponent)
  }
];
