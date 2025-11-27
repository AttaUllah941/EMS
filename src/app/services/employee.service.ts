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
    { id: 4, name: 'Alice Williams', email: 'alice.williams@company.com', role: 'Developer', department: 'Engineering', projectIds: [2, 3, 4] },
    { id: 5, name: 'Charlie Brown', email: 'charlie.brown@company.com', role: 'QA Engineer', department: 'Quality Assurance', projectIds: [1, 4] },
    { id: 6, name: 'Diana Prince', email: 'diana.prince@company.com', role: 'Developer', department: 'Engineering', projectIds: [3, 4] },
    { id: 7, name: 'Edward Norton', email: 'edward.norton@company.com', role: 'Manager', department: 'Management', projectIds: [2, 4] },
    { id: 9, name: 'George Wilson', email: 'george.wilson@company.com', role: 'Developer', department: 'Engineering', projectIds: [5, 6] },
    { id: 10, name: 'Helen Davis', email: 'helen.davis@company.com', role: 'Product Manager', department: 'Product', projectIds: [5, 7] },
    { id: 11, name: 'Ian Martinez', email: 'ian.martinez@company.com', role: 'Developer', department: 'Engineering', projectIds: [6, 8] },
    { id: 13, name: 'Kevin Taylor', email: 'kevin.taylor@company.com', role: 'QA Engineer', department: 'Quality Assurance', projectIds: [8, 10] },
    { id: 14, name: 'Laura Garcia', email: 'laura.garcia@company.com', role: 'Developer', department: 'Engineering', projectIds: [9, 11] },
    { id: 15, name: 'Michael Brown', email: 'michael.brown@company.com', role: 'Manager', department: 'Management', projectIds: [10, 12] },
    { id: 16, name: 'Nancy Lee', email: 'nancy.lee@company.com', role: 'Developer', department: 'Engineering', projectIds: [11, 1] },
    { id: 18, name: 'Patricia Harris', email: 'patricia.harris@company.com', role: 'QA Engineer', department: 'Quality Assurance', projectIds: [3, 5] },
    { id: 19, name: 'Robert Clark', email: 'robert.clark@company.com', role: 'Developer', department: 'Engineering', projectIds: [4, 6] },
    { id: 20, name: 'Sarah Lewis', email: 'sarah.lewis@company.com', role: 'Product Manager', department: 'Product', projectIds: [7, 8] },
    { id: 21, name: 'Thomas Walker', email: 'thomas.walker@company.com', role: 'Developer', department: 'Engineering', projectIds: [9, 10] },
    { id: 23, name: 'William Young', email: 'william.young@company.com', role: 'QA Engineer', department: 'Quality Assurance', projectIds: [1, 2] },
    { id: 24, name: 'Xavier King', email: 'xavier.king@company.com', role: 'Developer', department: 'Engineering', projectIds: [3, 4] },
    { id: 25, name: 'Yvonne Wright', email: 'yvonne.wright@company.com', role: 'Manager', department: 'Management', projectIds: [5, 6] },
    { id: 26, name: 'Zachary Lopez', email: 'zachary.lopez@company.com', role: 'Developer', department: 'Engineering', projectIds: [7, 8] },
    { id: 28, name: 'Benjamin Scott', email: 'benjamin.scott@company.com', role: 'QA Engineer', department: 'Quality Assurance', projectIds: [11, 12] },
    { id: 29, name: 'Catherine Green', email: 'catherine.green@company.com', role: 'Product Manager', department: 'Product', projectIds: [1, 3] },
    { id: 30, name: 'Daniel Adams', email: 'daniel.adams@company.com', role: 'Developer', department: 'Engineering', projectIds: [2, 4] },
    { id: 32, name: 'Frank Nelson', email: 'frank.nelson@company.com', role: 'Developer', department: 'Engineering', projectIds: [6, 8] },
    { id: 33, name: 'Grace Carter', email: 'grace.carter@company.com', role: 'QA Engineer', department: 'Quality Assurance', projectIds: [9, 11] },
    { id: 34, name: 'Henry Mitchell', email: 'henry.mitchell@company.com', role: 'Manager', department: 'Management', projectIds: [10, 12] },
    { id: 35, name: 'Isabella Perez', email: 'isabella.perez@company.com', role: 'Developer', department: 'Engineering', projectIds: [1, 2, 3] }
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
