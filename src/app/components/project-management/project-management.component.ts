import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Employee } from '../../models/employee.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss'
})
export class ProjectManagementComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedProject: Project | null = null;
  selectedProjectTasks: Task[] = [];
  allEmployees: Employee[] = [];
  availableEmployees: Employee[] = [];
  
  loading = true;
  tasksLoading = false;
  
  statusFilter: string = '';
  clientFilter: string = '';
  
  statuses: string[] = ['Active', 'On Hold', 'Completed'];
  clients: string[] = [];

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadEmployees();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.extractUniqueClients();
        this.applyFilters();
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
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

  extractUniqueClients(): void {
    this.clients = [...new Set(this.projects.map(proj => proj.client))];
  }

  applyFilters(): void {
    if (!this.projects || this.projects.length === 0) {
      this.filteredProjects = [];
      return;
    }
    
    this.filteredProjects = this.projects.filter(proj => {
      const statusMatch = !this.statusFilter || proj.status === this.statusFilter;
      const clientMatch = !this.clientFilter || proj.client === this.clientFilter;
      return statusMatch && clientMatch;
    });
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onClientFilterChange(): void {
    this.applyFilters();
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
    this.loadProjectTasks(project);
    this.updateAvailableEmployees(project);
  }

  loadProjectTasks(project: Project): void {
    this.tasksLoading = true;
    this.taskService.getTasksByProjectId(project.id).subscribe({
      next: (tasks) => {
        this.selectedProjectTasks = tasks;
        setTimeout(() => {
          this.tasksLoading = false;
        }, 500);
      },
      error: (error) => {
        console.error('Error loading project tasks:', error);
        this.tasksLoading = false;
      }
    });
  }

  updateAvailableEmployees(project: Project): void {
    this.availableEmployees = this.allEmployees.filter(emp => 
      !project.employeeIds.includes(emp.id)
    );
  }

  assignEmployee(employeeId: number): void {
    if (!this.selectedProject) return;
    
    this.projectService.assignEmployeeToProject(this.selectedProject.id, employeeId).subscribe({
      next: () => {
        this.employeeService.assignEmployeeToProject(employeeId, this.selectedProject!.id).subscribe({
          next: () => {
            this.loadProjects();
            if (this.selectedProject) {
              this.selectedProject.employeeIds.push(employeeId);
              this.updateAvailableEmployees(this.selectedProject);
            }
          }
        });
      }
    });
  }

  removeEmployee(employeeId: number): void {
    if (!this.selectedProject) return;
    
    this.projectService.removeEmployeeFromProject(this.selectedProject.id, employeeId).subscribe({
      next: () => {
        this.employeeService.removeEmployeeFromProject(employeeId, this.selectedProject!.id).subscribe({
          next: () => {
            this.loadProjects();
            if (this.selectedProject) {
              this.selectedProject.employeeIds = this.selectedProject.employeeIds.filter(id => id !== employeeId);
              this.updateAvailableEmployees(this.selectedProject);
            }
          }
        });
      }
    });
  }

  getEmployeeName(employeeId: number): string {
    const employee = this.allEmployees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown';
  }

  clearSelection(): void {
    this.selectedProject = null;
    this.selectedProjectTasks = [];
    this.availableEmployees = [];
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.clientFilter = '';
    this.applyFilters();
  }
}

