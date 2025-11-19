# Employee & Project Management Dashboard

A fully functional Angular 19 application for managing employees, projects, tasks, and executing custom JavaScript functions.

## Features

### 1. Employee Management
- Display list of employees with Name, Email, Role, Department
- Show number of projects assigned to each employee
- Filter employees by Role or Department
- Click an employee to view their assigned projects

### 2. Project Management
- Display list of projects with Name, Client, Deadline, Status
- Show assigned employees for each project
- Filter projects by Status or Client
- Assign/remove employees to/from projects
- Click a project to view its tasks

### 3. Task Management
- Display tasks with Task Name, Description, Status, Assigned Employee, Due Date
- Update task status (Pending, In Progress, Completed)
- Filter tasks by Status, Employee, or Due Date

### 4. Dashboard Overview
- Total Employees count
- Total Projects count
- Tasks per Status (Pending, In Progress, Completed)
- Projects per Client breakdown

### 5. Custom JS Executor
- Four text areas for writing JavaScript functions
- Execute button to run functions sequentially
- Functions execute one by one, waiting for each to complete (including async functions)
- Graceful error handling for failed functions
- Display results for each function execution
- Show execution time for each function

## Folder Structure

```
angular-task/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   └── dashboard.component.scss
│   │   │   ├── employee-management/
│   │   │   │   ├── employee-management.component.ts
│   │   │   │   ├── employee-management.component.html
│   │   │   │   └── employee-management.component.scss
│   │   │   ├── project-management/
│   │   │   │   ├── project-management.component.ts
│   │   │   │   ├── project-management.component.html
│   │   │   │   └── project-management.component.scss
│   │   │   ├── task-management/
│   │   │   │   ├── task-management.component.ts
│   │   │   │   ├── task-management.component.html
│   │   │   │   └── task-management.component.scss
│   │   │   └── js-executor/
│   │   │       ├── js-executor.component.ts
│   │   │       ├── js-executor.component.html
│   │   │       └── js-executor.component.scss
│   │   ├── models/
│   │   │   ├── employee.model.ts
│   │   │   ├── project.model.ts
│   │   │   ├── task.model.ts
│   │   │   └── dashboard-stats.model.ts
│   │   ├── services/
│   │   │   ├── employee.service.ts
│   │   │   ├── project.service.ts
│   │   │   ├── task.service.ts
│   │   │   └── dashboard.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── package.json
└── README.md
```

## Architecture

The application follows Angular 19 best practices with:

- **Standalone Components**: All components are standalone
- **Lazy Loading**: Components are lazy-loaded via route configuration
- **Service-Based Architecture**: Business logic separated into services
- **Type Safety**: TypeScript interfaces for all data models
- **Reactive Programming**: RxJS Observables for data handling

## Data Management

The application uses **in-memory mock data** stored in services. All services implement the same interface as they would with real API calls, making it easy to replace with actual HTTP services later.

### Mock Data Services:
- `EmployeeService`: Manages employee data and project assignments
- `ProjectService`: Manages project data and employee assignments
- `TaskService`: Manages task data and status updates
- `DashboardService`: Aggregates data from other services for dashboard statistics

## Assumptions

1. **Data Persistence**: Data is stored in-memory and will reset on page refresh. In a production environment, this would be replaced with HTTP calls to a backend API.

2. **Employee-Project Relationship**: The relationship between employees and projects is bidirectional:
   - Employees have a list of project IDs they're assigned to
   - Projects have a list of employee IDs assigned to them
   - When assigning/removing, both sides are updated

3. **Task Assignment**: Tasks are assigned to employees via `assignedEmployeeId`. A task can be unassigned (null).

4. **JS Executor Security**: The JS Executor uses `eval()` for execution. In a production environment, this should be replaced with a sandboxed execution environment or server-side execution for security reasons.

5. **Status Values**:
   - Project Status: 'Active', 'On Hold', 'Completed'
   - Task Status: 'Pending', 'In Progress', 'Completed'

6. **Date Format**: Dates are stored as strings in 'YYYY-MM-DD' format.

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
ng serve
# or
npm start
```

Navigate to `http://localhost:4200/`

### Building for Production

```bash
ng build
```

## Usage

1. **Dashboard**: View aggregated statistics about employees, projects, and tasks
2. **Employees**: Browse employees, filter by role/department, and view their projects
3. **Projects**: Manage projects, assign employees, and view project tasks
4. **Tasks**: View and update task statuses, filter by various criteria
5. **JS Executor**: Write and execute JavaScript functions sequentially

## JS Executor Examples

The JS Executor supports both synchronous and asynchronous functions:

**Simple Return:**
```javascript
return 'Hello World';
```

**Async Function:**
```javascript
await new Promise(resolve => setTimeout(resolve, 1000));
return 'Done after 1 second';
```

**Data Transformation:**
```javascript
const data = [1, 2, 3, 4, 5];
return data.map(x => x * 2);
```

**Complex Calculation:**
```javascript
const sum = Array.from({length: 100}, (_, i) => i + 1).reduce((a, b) => a + b, 0);
return sum;
```

## Technologies Used

- Angular 19
- TypeScript
- RxJS
- SCSS
- Standalone Components
- Angular Router

## Notes

- The application is fully functional with mock data
- All features are implemented as per requirements
- The JS Executor handles both sync and async functions sequentially
- Error handling is implemented throughout the application
- Responsive design for mobile and desktop views
