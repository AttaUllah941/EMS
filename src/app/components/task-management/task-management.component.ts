import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { EmployeeService } from '../../services/employee.service';
import { ProjectService } from '../../services/project.service';
import { Task } from '../../models/task.model';
import { Employee } from '../../models/employee.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss'
})
export class TaskManagementComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  allEmployees: Employee[] = [];
  allProjects: Project[] = [];
  
  loading = true;
  
  statusFilter: string = '';
  employeeFilter: number | null = null;
  dueDateFilter: string = '';
  
  statuses: string[] = ['Pending', 'In Progress', 'Completed'];

  constructor(
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadEmployees();
    this.loadProjects();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.applyFilters();
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.allEmployees = employees;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.allProjects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  applyFilters(): void {
    if (!this.tasks || this.tasks.length === 0) {
      this.filteredTasks = [];
      return;
    }
    
    this.filteredTasks = this.tasks.filter(task => {
      // Status filter
      const statusMatch = !this.statusFilter || task.status === this.statusFilter;
      
      // Employee filter
      const employeeMatch = this.employeeFilter === null || 
                           task.assignedEmployeeId === this.employeeFilter;
      
      // Due date filter
      const dueDateMatch = !this.dueDateFilter || task.dueDate === this.dueDateFilter;
      
      return statusMatch && employeeMatch && dueDateMatch;
    });
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onEmployeeFilterChange(): void {
    // Ensure null is properly set if needed (ngValue handles type conversion)
    if (this.employeeFilter === undefined) {
      this.employeeFilter = null;
    }
    this.applyFilters();
  }

  onDueDateFilterChange(): void {
    this.applyFilters();
  }

  updateTaskStatus(taskId: number, newStatus: 'Pending' | 'In Progress' | 'Completed'): void {
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: () => {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = newStatus;
        }
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error updating task status:', error);
      }
    });
  }

  getEmployeeName(employeeId: number | null): string {
    if (!employeeId) return 'Unassigned';
    const employee = this.allEmployees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown';
  }

  getProjectName(projectId: number): string {
    const project = this.allProjects.find(proj => proj.id === projectId);
    return project ? project.name : 'Unknown Project';
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.employeeFilter = null;
    this.dueDateFilter = '';
    this.applyFilters();
  }
}

