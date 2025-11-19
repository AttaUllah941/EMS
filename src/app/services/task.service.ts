import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { id: 1, projectId: 1, name: 'Design Homepage', description: 'Create new homepage design', status: 'In Progress', assignedEmployeeId: 8, dueDate: '2024-10-15' },
    { id: 2, projectId: 1, name: 'Implement Navigation', description: 'Build responsive navigation menu', status: 'Completed', assignedEmployeeId: 1, dueDate: '2024-10-10' },
    { id: 3, projectId: 1, name: 'Write Tests', description: 'Unit tests for components', status: 'Pending', assignedEmployeeId: 5, dueDate: '2024-10-20' },
    { id: 4, projectId: 2, name: 'API Integration', description: 'Integrate backend APIs', status: 'In Progress', assignedEmployeeId: 1, dueDate: '2024-11-01' },
    { id: 5, projectId: 2, name: 'UI Mockups', description: 'Create mobile app mockups', status: 'Completed', assignedEmployeeId: 3, dueDate: '2024-10-05' },
    { id: 6, projectId: 2, name: 'User Authentication', description: 'Implement login/signup', status: 'In Progress', assignedEmployeeId: 1, dueDate: '2024-11-05' },
    { id: 7, projectId: 3, name: 'Database Schema', description: 'Design database structure', status: 'Pending', assignedEmployeeId: 4, dueDate: '2024-12-01' },
    { id: 8, projectId: 3, name: 'Payment Gateway', description: 'Integrate payment system', status: 'Pending', assignedEmployeeId: 4, dueDate: '2024-12-10' },
    { id: 9, projectId: 4, name: 'Data Collection', description: 'Set up data pipelines', status: 'In Progress', assignedEmployeeId: 4, dueDate: '2024-11-15' },
    { id: 10, projectId: 4, name: 'Charts & Visualizations', description: 'Build dashboard charts', status: 'In Progress', assignedEmployeeId: 6, dueDate: '2024-11-20' },
    { id: 11, projectId: 4, name: 'Export Functionality', description: 'Add data export features', status: 'Pending', assignedEmployeeId: 6, dueDate: '2024-12-01' }
  ];

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    const projectTasks = this.tasks.filter(task => task.projectId === projectId);
    return of(projectTasks);
  }

  getTaskById(id: number): Observable<Task | undefined> {
    const task = this.tasks.find(t => t.id === id);
    return of(task);
  }

  updateTask(task: Task): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }
    return of(task);
  }

  updateTaskStatus(taskId: number, status: 'Pending' | 'In Progress' | 'Completed'): Observable<Task> {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
    }
    return task ? of(task) : of({} as Task);
  }
}

