import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
      }
    });
  }

  getClientKeys(): string[] {
    return this.stats ? Object.keys(this.stats.projectsByClient) : [];
  }

  getTotalTasks(): number {
    if (!this.stats) return 0;
    return this.stats.tasksByStatus.Pending + 
           this.stats.tasksByStatus['In Progress'] + 
           this.stats.tasksByStatus.Completed;
  }

  getTaskPercentage(status: 'Pending' | 'In Progress' | 'Completed'): number {
    if (!this.stats) return 0;
    const total = this.getTotalTasks();
    if (total === 0) return 0;
    const value = status === 'In Progress' 
      ? this.stats.tasksByStatus['In Progress']
      : this.stats.tasksByStatus[status];
    return Math.round((value / total) * 100);
  }

  getClientPercentage(client: string): number {
    if (!this.stats) return 0;
    const totalProjects = this.stats.totalProjects;
    if (totalProjects === 0) return 0;
    return Math.round((this.stats.projectsByClient[client] / totalProjects) * 100);
  }

  getCompletionRate(): number {
    if (!this.stats) return 0;
    const total = this.getTotalTasks();
    if (total === 0) return 0;
    return Math.round((this.stats.tasksByStatus.Completed / total) * 100);
  }

  getClientIcon(index: number): string {
    const icons = ['🏢', '💼', '🏭', '🏪', '🏬', '🏗️', '🏛️', '🏨'];
    return icons[index % icons.length];
  }
}

