import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', role: 'Developer', department: 'Engineering', projectIds: [1, 2] },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Manager', department: 'Management', projectIds: [1, 3] },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@company.com', role: 'Designer', department: 'Design', projectIds: [2] },
    { id: 4, name: 'Alice Williams', email: 'alice.williams@company.com', role: 'Developer', department: 'Engineering', projectIds: [2, 3, 4] },
    { id: 5, name: 'Charlie Brown', email: 'charlie.brown@company.com', role: 'QA Engineer', department: 'Quality Assurance', projectIds: [1, 4] },
    { id: 6, name: 'Diana Prince', email: 'diana.prince@company.com', role: 'Developer', department: 'Engineering', projectIds: [3, 4] },
    { id: 7, name: 'Edward Norton', email: 'edward.norton@company.com', role: 'Manager', department: 'Management', projectIds: [2, 4] },
    { id: 8, name: 'Fiona Green', email: 'fiona.green@company.com', role: 'Designer', department: 'Design', projectIds: [1, 3] }
  ];

  getEmployees(): Observable<Employee[]> {
    return of(this.employees);
  }

  getEmployeeById(id: number): Observable<Employee | undefined> {
    const employee = this.employees.find(emp => emp.id === id);
    return of(employee);
  }

  getEmployeesByProjectId(projectId: number): Observable<Employee[]> {
    const employees = this.employees.filter(emp => emp.projectIds.includes(projectId));
    return of(employees);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const index = this.employees.findIndex(emp => emp.id === employee.id);
    if (index !== -1) {
      this.employees[index] = employee;
    }
    return of(employee);
  }

  assignEmployeeToProject(employeeId: number, projectId: number): Observable<void> {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (employee && !employee.projectIds.includes(projectId)) {
      employee.projectIds.push(projectId);
    }
    return of(undefined);
  }

  removeEmployeeFromProject(employeeId: number, projectId: number): Observable<void> {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (employee) {
      employee.projectIds = employee.projectIds.filter(id => id !== projectId);
    }
    return of(undefined);
  }
}

