import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ExecutionResult {
  functionNumber: number;
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
}

@Component({
  selector: 'app-js-executor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './js-executor.component.html',
  styleUrl: './js-executor.component.scss'
})
export class JsExecutorComponent {
  functions: string[] = ['', '', '', ''];
  results: ExecutionResult[] = [];
  executing = false;

  async executeFunctions(): Promise<void> {
    this.executing = true;
    this.results = [];

    for (let i = 0; i < this.functions.length; i++) {
      const funcCode = this.functions[i].trim();
      
      if (!funcCode) {
        this.results.push({
          functionNumber: i + 1,
          success: false,
          error: 'Function is empty',
          executionTime: 0
        });
        continue;
      }

      const startTime = performance.now();
      
      try {
        let result: any;
        
        // Create an async function that executes the user code
        // This approach handles both sync and async code properly
        const asyncWrapper = async () => {
          // Use Function constructor to execute the code
          // This creates a new function scope for the user code
          const userFunction = new Function(funcCode);
          
          // Execute the function - if it returns a promise, await it
          // If it returns a value, use it directly
          const functionResult = userFunction();
          
          // If the result is a promise, await it; otherwise return as-is
          if (functionResult && typeof functionResult.then === 'function') {
            return await functionResult;
          }
          return functionResult;
        };
        
        // Execute and await the wrapper to ensure sequential execution
        result = await asyncWrapper();
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        this.results.push({
          functionNumber: i + 1,
          success: true,
          result: this.formatResult(result),
          executionTime: Math.round(executionTime * 100) / 100
        });
      } catch (error: any) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        let errorMessage = 'Unknown error';
        if (error) {
          if (error.message) {
            errorMessage = error.message;
          } else if (error.toString) {
            errorMessage = error.toString();
          } else {
            errorMessage = String(error);
          }
        }

        this.results.push({
          functionNumber: i + 1,
          success: false,
          error: errorMessage,
          executionTime: Math.round(executionTime * 100) / 100
        });
      }
      
      // Small delay to ensure UI updates between executions
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this.executing = false;
  }

  formatResult(result: any): string {
    if (result === undefined) {
      return 'undefined';
    }
    if (result === null) {
      return 'null';
    }
    if (typeof result === 'function') {
      return '[Function]';
    }
    if (typeof result === 'object') {
      try {
        return JSON.stringify(result, null, 2);
      } catch {
        return String(result);
      }
    }
    return String(result);
  }

  clearResults(): void {
    this.results = [];
  }

  clearAll(): void {
    this.functions = ['', '', '', ''];
    this.results = [];
  }
}

