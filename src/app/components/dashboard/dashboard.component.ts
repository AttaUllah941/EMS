import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { EmployeeService } from '../../services/employee.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  stats: DashboardStats | null = null;
  loading = true;
  private destroy$ = new Subject<void>();

  // Individual chart loading states
  mainChartLoading = true;
  employeesChartLoading = true;
  projectsChartLoading = true;
  tasksChartLoading = true;

  // Loading timer
  loadingTime = 0;
  private loadingTimer: any;

  // Chart instances
  @ViewChild('mainChart') mainChartRef!: ElementRef;
  @ViewChild('employeesChart') employeesChartRef!: ElementRef;
  @ViewChild('projectsChart') projectsChartRef!: ElementRef;
  @ViewChild('tasksChart') tasksChartRef!: ElementRef;

  private mainChart: echarts.ECharts | null = null;
  private employeesChart: echarts.ECharts | null = null;
  private projectsChart: echarts.ECharts | null = null;
  private tasksChart: echarts.ECharts | null = null;

  constructor(
    private dashboardService: DashboardService,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data loads
  }

  ngOnDestroy(): void {
    // Stop timer
    this.stopLoadingTimer();
    
    // Dispose charts
    if (this.mainChart) {
      this.mainChart.dispose();
    }
    if (this.employeesChart) {
      this.employeesChart.dispose();
    }
    if (this.projectsChart) {
      this.projectsChart.dispose();
    }
    if (this.tasksChart) {
      this.tasksChart.dispose();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.mainChartLoading = true;
    this.employeesChartLoading = true;
    this.projectsChartLoading = true;
    this.tasksChartLoading = true;
    this.loadingTime = 0;
    
    // Start loading timer
    this.startLoadingTimer();
    
    combineLatest([
      this.dashboardService.getDashboardStats(),
      this.employeeService.getEmployees(),
      this.projectService.getProjects(),
      this.taskService.getTasks()
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([stats, employees, projects, tasks]) => {
        this.stats = stats;
        this.loading = false;
        this.initializeCharts(stats, employees, projects, tasks);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
        this.stopLoadingTimer();
        this.mainChartLoading = false;
        this.employeesChartLoading = false;
        this.projectsChartLoading = false;
        this.tasksChartLoading = false;
      }
    });
  }

  startLoadingTimer(): void {
    this.loadingTimer = setInterval(() => {
      this.loadingTime += 0.1;
    }, 100);
  }

  stopLoadingTimer(): void {
    if (this.loadingTimer) {
      clearInterval(this.loadingTimer);
      this.loadingTimer = null;
    }
  }

  initializeCharts(stats: DashboardStats, employees: any[], projects: any[], tasks: any[]): void {
    // Initialize charts after view init with minimum loading time for better UX
    setTimeout(() => {
      this.initMainChart(stats);
      this.initEmployeesChart(employees);
      this.initProjectsChart(projects);
      this.initTasksChart(stats);
    }, 1000); // Minimum 1 second loading time for skeleton effect
  }

  initMainChart(stats: DashboardStats): void {
    if (!this.mainChartRef?.nativeElement) return;
    
    this.mainChart = echarts.init(this.mainChartRef.nativeElement);
    
    // Create trend data with 6 data points showing progression
    const totalTasks = stats.tasksByStatus.Pending + stats.tasksByStatus['In Progress'] + stats.tasksByStatus.Completed;
    
    // Generate trend data (showing growth over time)
    const employeesData = [
      Math.round(stats.totalEmployees * 0.6),
      Math.round(stats.totalEmployees * 0.7),
      Math.round(stats.totalEmployees * 0.75),
      Math.round(stats.totalEmployees * 0.8),
      Math.round(stats.totalEmployees * 0.9),
      stats.totalEmployees
    ];
    
    const projectsData = [
      Math.round(stats.totalProjects * 0.5),
      Math.round(stats.totalProjects * 0.65),
      Math.round(stats.totalProjects * 0.7),
      Math.round(stats.totalProjects * 0.85),
      Math.round(stats.totalProjects * 0.95),
      stats.totalProjects
    ];
    
    const tasksData = [
      Math.round(totalTasks * 0.55),
      Math.round(totalTasks * 0.65),
      Math.round(totalTasks * 0.7),
      Math.round(totalTasks * 0.8),
      Math.round(totalTasks * 0.9),
      totalTasks
    ];
    
    const xAxisData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      legend: {
        data: ['Employees', 'Projects', 'Tasks'],
        top: 10,
        textStyle: {
          fontSize: 14
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          fontSize: 12
        },
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12
        }
      },
      series: [
        {
          name: 'Employees',
          type: 'line',
          data: employeesData,
          smooth: true,
          lineStyle: {
            color: '#667eea',
            width: 3
          },
          itemStyle: {
            color: '#667eea'
          },
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: false
          },
          areaStyle: {
            opacity: 0.1,
            color: '#667eea'
          }
        },
        {
          name: 'Projects',
          type: 'line',
          data: projectsData,
          smooth: true,
          lineStyle: {
            color: '#f093fb',
            width: 3
          },
          itemStyle: {
            color: '#f093fb'
          },
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: false
          },
          areaStyle: {
            opacity: 0.1,
            color: '#f093fb'
          }
        },
        {
          name: 'Tasks',
          type: 'line',
          data: tasksData,
          smooth: true,
          lineStyle: {
            color: '#4caf50',
            width: 3
          },
          itemStyle: {
            color: '#4caf50'
          },
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: false
          },
          areaStyle: {
            opacity: 0.1,
            color: '#4caf50'
          }
        }
      ]
    };
    this.mainChart.setOption(option);
    // Mark chart as loaded after a short delay for smooth transition
    setTimeout(() => {
      this.mainChartLoading = false;
      this.checkAllChartsLoaded();
    }, 300);
  }

  initEmployeesChart(employees: any[]): void {
    if (!this.employeesChartRef?.nativeElement) return;
    
    this.employeesChart = echarts.init(this.employeesChartRef.nativeElement);
    const employeesByDept = this.groupBy(employees, 'department');
    
    // Filter out Design department
    const filteredDepts = Object.keys(employeesByDept).filter(dept => dept !== 'Design');
    const deptNames = filteredDepts;
    const deptCounts = deptNames.map(dept => employeesByDept[dept].length);
    
    // Define different colors for each bar
    const barColors = ['#667eea', '#f093fb', '#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#00bcd4', '#ff5722'];

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: deptNames,
        axisLabel: {
          fontSize: 12,
          rotate: deptNames.some(name => name.length > 15) ? 15 : 0
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12
        }
      },
      series: [
        {
          name: 'Employees',
          type: 'bar',
          data: deptCounts.map((count, index) => ({
            value: count,
            itemStyle: {
              color: barColors[index % barColors.length]
            }
          })),
          label: {
            show: true,
            position: 'top',
            fontSize: 12,
            fontWeight: 'bold'
          },
          barWidth: '40%'
        }
      ]
    };
    this.employeesChart.setOption(option);
    // Mark chart as loaded after a short delay for smooth transition
    setTimeout(() => {
      this.employeesChartLoading = false;
      this.checkAllChartsLoaded();
    }, 300);
  }

  initProjectsChart(projects: any[]): void {
    if (!this.projectsChartRef?.nativeElement) return;
    
    this.projectsChart = echarts.init(this.projectsChartRef.nativeElement);
    const projectsByStatus = this.groupBy(projects, 'status');
    const statusNames = ['Active', 'On Hold', 'Completed'];
    const statusCounts = statusNames.map(status => (projectsByStatus[status] || []).length);

    const option: echarts.EChartsOption = {
      
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: statusNames,
        axisLabel: {
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12
        }
      },
      series: [
        {
          name: 'Projects',
          type: 'bar',
          data: statusCounts.map((count, index) => ({
            value: count,
            itemStyle: {
              color: index === 0 ? '#4caf50' : index === 1 ? '#ff9800' : '#2196f3'
            }
          })),
          label: {
            show: true,
            position: 'top',
            fontSize: 12,
            fontWeight: 'bold'
          },
          barWidth: '40%'
        }
      ]
    };
    this.projectsChart.setOption(option);
    // Mark chart as loaded after a short delay for smooth transition
    setTimeout(() => {
      this.projectsChartLoading = false;
      this.checkAllChartsLoaded();
    }, 300);
  }

  initTasksChart(stats: DashboardStats): void {
    if (!this.tasksChartRef?.nativeElement) return;
    
    this.tasksChart = echarts.init(this.tasksChartRef.nativeElement);
    const taskStatusNames = ['Pending', 'In Progress', 'Completed'];
    const taskStatusCounts = [
      stats.tasksByStatus.Pending,
      stats.tasksByStatus['In Progress'],
      stats.tasksByStatus.Completed
    ];

    const option: echarts.EChartsOption = {
     
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: taskStatusNames,
        axisLabel: {
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12
        }
      },
      series: [
        {
          name: 'Tasks',
          type: 'bar',
          data: taskStatusCounts.map((count, index) => ({
            value: count,
            itemStyle: {
              color: index === 0 ? '#ff9800' : index === 1 ? '#2196f3' : '#4caf50'
            }
          })),
          label: {
            show: true,
            position: 'top',
            fontSize: 12,
            fontWeight: 'bold'
          },
          barWidth: '40%'
        }
      ]
    };
    this.tasksChart.setOption(option);
    // Mark chart as loaded after a short delay for smooth transition
    setTimeout(() => {
      this.tasksChartLoading = false;
      this.checkAllChartsLoaded();
    }, 300);
  }

  checkAllChartsLoaded(): void {
    if (!this.mainChartLoading && !this.employeesChartLoading && 
        !this.projectsChartLoading && !this.tasksChartLoading) {
      this.stopLoadingTimer();
    }
  }

  private groupBy(array: any[], key: string): { [key: string]: any[] } {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
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

