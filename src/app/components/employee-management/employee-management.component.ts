import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { ProjectService } from '../../services/project.service';
import { Employee } from '../../models/employee.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  selectedEmployeeProjects: Project[] = [];
  
  roleFilter: string = '';
  departmentFilter: string = '';
  
  roles: string[] = [];
  departments: string[] = [];

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.extractUniqueValues();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  extractUniqueValues(): void {
    this.roles = [...new Set(this.employees.map(emp => emp.role))];
    this.departments = [...new Set(this.employees.map(emp => emp.department))];
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(emp => {
      const roleMatch = !this.roleFilter || emp.role === this.roleFilter;
      const departmentMatch = !this.departmentFilter || emp.department === this.departmentFilter;
      return roleMatch && departmentMatch;
    });
  }

  onRoleFilterChange(): void {
    this.applyFilters();
  }

  onDepartmentFilterChange(): void {
    this.applyFilters();
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.loadEmployeeProjects(employee);
  }

  loadEmployeeProjects(employee: Employee): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.selectedEmployeeProjects = projects.filter(proj => 
          employee.projectIds.includes(proj.id)
        );
      },
      error: (error) => {
        console.error('Error loading employee projects:', error);
      }
    });
  }

  clearSelection(): void {
    this.selectedEmployee = null;
    this.selectedEmployeeProjects = [];
  }

  clearFilters(): void {
    this.roleFilter = '';
    this.departmentFilter = '';
    this.applyFilters();
  }
}

