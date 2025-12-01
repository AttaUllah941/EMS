import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './services/employee.service';
import { ProjectService } from './services/project.service';
import { TaskService } from './services/task.service';
import { forkJoin, Subject } from 'rxjs';
import { map, catchError, finalize, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

interface NavCounts {
  employees: number;
  projects: number;
  tasks: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  readonly title = 'Employee & Project Management Dashboard';
  
  counts: NavCounts = { employees: 0, projects: 0, tasks: 0 };
  loading = true;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCounts(): void {
    forkJoin({
      employees: this.employeeService.getEmployees().pipe(
        map(arr => arr.length),
        catchError(() => {
          console.error('Error loading employees');
          return of(0);
        })
      ),
      projects: this.projectService.getProjects().pipe(
        map(arr => arr.length),
        catchError(() => {
          console.error('Error loading projects');
          return of(0);
        })
      ),
      tasks: this.taskService.getTasks().pipe(
        map(arr => arr.length),
        catchError(() => {
          console.error('Error loading tasks');
          return of(0);
        })
      )
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe(counts => {
      this.counts = counts;
    });
  }

  get employeeCount(): number {
    return this.counts.employees;
  }

  get projectCount(): number {
    return this.counts.projects;
  }

  get taskCount(): number {
    return this.counts.tasks;
  }
}
