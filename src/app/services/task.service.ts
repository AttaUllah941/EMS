import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { id: 1, projectId: 1, name: 'Design Homepage', description: 'Create new homepage design', status: 'In Progress', assignedEmployeeId: 1, dueDate: '2024-10-15' },
    { id: 2, projectId: 1, name: 'Implement Navigation', description: 'Build responsive navigation menu', status: 'Completed', assignedEmployeeId: 1, dueDate: '2024-10-10' },
    { id: 3, projectId: 1, name: 'Write Tests', description: 'Unit tests for components', status: 'Pending', assignedEmployeeId: 5, dueDate: '2024-10-20' },
    { id: 4, projectId: 1, name: 'Responsive Design', description: 'Ensure mobile responsiveness', status: 'In Progress', assignedEmployeeId: 4, dueDate: '2024-10-25' },
    { id: 5, projectId: 1, name: 'Content Management', description: 'Set up CMS integration', status: 'Pending', assignedEmployeeId: 2, dueDate: '2024-11-01' },
    { id: 6, projectId: 2, name: 'API Integration', description: 'Integrate backend APIs', status: 'In Progress', assignedEmployeeId: 1, dueDate: '2024-11-01' },
    { id: 7, projectId: 2, name: 'UI Mockups', description: 'Create mobile app mockups', status: 'Completed', assignedEmployeeId: 1, dueDate: '2024-10-05' },
    { id: 8, projectId: 2, name: 'User Authentication', description: 'Implement login/signup', status: 'In Progress', assignedEmployeeId: 1, dueDate: '2024-11-05' },
    { id: 9, projectId: 2, name: 'Push Notifications', description: 'Add push notification system', status: 'Pending', assignedEmployeeId: 7, dueDate: '2024-11-10' },
    { id: 10, projectId: 2, name: 'App Store Submission', description: 'Prepare for app store release', status: 'Pending', assignedEmployeeId: 2, dueDate: '2024-11-15' },
    { id: 11, projectId: 3, name: 'Database Schema', description: 'Design database structure', status: 'Pending', assignedEmployeeId: 4, dueDate: '2024-12-01' },
    { id: 12, projectId: 3, name: 'Payment Gateway', description: 'Integrate payment system', status: 'Pending', assignedEmployeeId: 4, dueDate: '2024-12-10' },
    { id: 13, projectId: 3, name: 'Shopping Cart', description: 'Build shopping cart functionality', status: 'In Progress', assignedEmployeeId: 6, dueDate: '2024-12-05' },
    { id: 14, projectId: 3, name: 'Product Catalog', description: 'Create product listing page', status: 'Pending', assignedEmployeeId: 4, dueDate: '2024-12-20' },
    { id: 15, projectId: 4, name: 'Data Collection', description: 'Set up data pipelines', status: 'In Progress', assignedEmployeeId: 4, dueDate: '2024-11-15' },
    { id: 16, projectId: 4, name: 'Charts & Visualizations', description: 'Build dashboard charts', status: 'In Progress', assignedEmployeeId: 6, dueDate: '2024-11-20' },
    { id: 17, projectId: 4, name: 'Export Functionality', description: 'Add data export features', status: 'Pending', assignedEmployeeId: 6, dueDate: '2024-12-01' },
    { id: 18, projectId: 4, name: 'Report Generation', description: 'Create automated reports', status: 'Pending', assignedEmployeeId: 7, dueDate: '2024-12-05' },
    { id: 19, projectId: 5, name: 'Infrastructure Setup', description: 'Configure cloud infrastructure', status: 'In Progress', assignedEmployeeId: 9, dueDate: '2024-11-20' },
    { id: 20, projectId: 5, name: 'Data Migration', description: 'Migrate existing data to cloud', status: 'Pending', assignedEmployeeId: 10, dueDate: '2024-12-01' },
    { id: 21, projectId: 5, name: 'Security Configuration', description: 'Set up security policies', status: 'In Progress', assignedEmployeeId: 13, dueDate: '2024-11-25' },
    { id: 22, projectId: 5, name: 'Performance Testing', description: 'Test cloud performance', status: 'Pending', assignedEmployeeId: 18, dueDate: '2024-12-10' },
    { id: 23, projectId: 6, name: 'API Design', description: 'Design API endpoints', status: 'Completed', assignedEmployeeId: 9, dueDate: '2024-10-30' },
    { id: 24, projectId: 6, name: 'Rate Limiting', description: 'Implement rate limiting', status: 'In Progress', assignedEmployeeId: 11, dueDate: '2024-11-15' },
    { id: 25, projectId: 6, name: 'Authentication', description: 'Add API authentication', status: 'In Progress', assignedEmployeeId: 19, dueDate: '2024-11-20' },
    { id: 26, projectId: 6, name: 'Documentation', description: 'Write API documentation', status: 'Pending', assignedEmployeeId: 24, dueDate: '2024-12-05' },
    { id: 27, projectId: 7, name: 'User Research', description: 'Conduct user interviews', status: 'Completed', assignedEmployeeId: 10, dueDate: '2024-10-20' },
    { id: 28, projectId: 7, name: 'Wireframes', description: 'Create wireframe designs', status: 'In Progress', assignedEmployeeId: 10, dueDate: '2024-11-10' },
    { id: 29, projectId: 7, name: 'Prototype', description: 'Build interactive prototype', status: 'Pending', assignedEmployeeId: 10, dueDate: '2024-11-25' },
    { id: 30, projectId: 7, name: 'Design System', description: 'Create design system', status: 'Pending', assignedEmployeeId: 10, dueDate: '2024-12-01' },
    { id: 31, projectId: 8, name: 'Vulnerability Scan', description: 'Run security scans', status: 'In Progress', assignedEmployeeId: 11, dueDate: '2024-11-10' },
    { id: 32, projectId: 8, name: 'Penetration Testing', description: 'Perform penetration tests', status: 'Pending', assignedEmployeeId: 13, dueDate: '2024-11-20' },
    { id: 33, projectId: 8, name: 'Security Report', description: 'Generate security report', status: 'Pending', assignedEmployeeId: 16, dueDate: '2024-11-25' },
    { id: 34, projectId: 8, name: 'Remediation Plan', description: 'Create remediation plan', status: 'Pending', assignedEmployeeId: 23, dueDate: '2024-12-01' },
    { id: 35, projectId: 9, name: 'Account Setup', description: 'Implement account creation', status: 'In Progress', assignedEmployeeId: 14, dueDate: '2024-11-15' },
    { id: 36, projectId: 9, name: 'Transaction History', description: 'Build transaction history view', status: 'In Progress', assignedEmployeeId: 14, dueDate: '2024-11-20' },
    { id: 37, projectId: 9, name: 'Payment Processing', description: 'Integrate payment processing', status: 'Pending', assignedEmployeeId: 21, dueDate: '2024-12-05' },
    { id: 38, projectId: 9, name: 'Mobile Optimization', description: 'Optimize for mobile devices', status: 'Pending', assignedEmployeeId: 21, dueDate: '2024-12-10' },
    { id: 39, projectId: 10, name: 'Inventory Tracking', description: 'Build inventory tracking system', status: 'In Progress', assignedEmployeeId: 13, dueDate: '2024-11-10' },
    { id: 40, projectId: 10, name: 'Stock Management', description: 'Implement stock management', status: 'In Progress', assignedEmployeeId: 15, dueDate: '2024-11-15' },
    { id: 41, projectId: 10, name: 'Reporting Dashboard', description: 'Create reporting dashboard', status: 'Pending', assignedEmployeeId: 20, dueDate: '2024-12-01' },
    { id: 42, projectId: 10, name: 'Barcode Integration', description: 'Add barcode scanning', status: 'Pending', assignedEmployeeId: 25, dueDate: '2024-12-05' },
    { id: 43, projectId: 11, name: 'User Registration', description: 'Build registration system', status: 'In Progress', assignedEmployeeId: 14, dueDate: '2024-11-20' },
    { id: 44, projectId: 11, name: 'Profile Management', description: 'Create profile management', status: 'Pending', assignedEmployeeId: 18, dueDate: '2024-12-01' },
    { id: 45, projectId: 11, name: 'Support Tickets', description: 'Build support ticket system', status: 'Pending', assignedEmployeeId: 24, dueDate: '2024-12-10' },
    { id: 46, projectId: 11, name: 'Notification System', description: 'Add notification system', status: 'Pending', assignedEmployeeId: 28, dueDate: '2024-12-15' },
    { id: 47, projectId: 12, name: 'Email Campaigns', description: 'Build email campaign system', status: 'In Progress', assignedEmployeeId: 15, dueDate: '2024-11-25' },
    { id: 48, projectId: 12, name: 'Analytics Integration', description: 'Integrate analytics tools', status: 'In Progress', assignedEmployeeId: 15, dueDate: '2024-12-01' },
    { id: 49, projectId: 12, name: 'A/B Testing', description: 'Implement A/B testing', status: 'Pending', assignedEmployeeId: 15, dueDate: '2024-12-10' },
    { id: 50, projectId: 12, name: 'Campaign Reports', description: 'Generate campaign reports', status: 'Pending', assignedEmployeeId: 26, dueDate: '2024-12-20' },
    { id: 51, projectId: 1, name: 'SEO Optimization', description: 'Optimize for search engines', status: 'Pending', assignedEmployeeId: 1, dueDate: '2024-11-05' },
    { id: 52, projectId: 2, name: 'Performance Testing', description: 'Test app performance', status: 'Pending', assignedEmployeeId: 7, dueDate: '2024-11-20' },
    { id: 53, projectId: 3, name: 'Order Management', description: 'Build order management system', status: 'In Progress', assignedEmployeeId: 6, dueDate: '2024-12-15' },
    { id: 54, projectId: 4, name: 'Data Backup', description: 'Set up automated backups', status: 'Pending', assignedEmployeeId: 7, dueDate: '2024-12-10' },
    { id: 55, projectId: 5, name: 'Monitoring Setup', description: 'Set up monitoring tools', status: 'Pending', assignedEmployeeId: 10, dueDate: '2024-12-15' }
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
