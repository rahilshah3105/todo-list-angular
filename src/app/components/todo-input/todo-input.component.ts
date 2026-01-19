import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-container">
      <div class="input-row">
        <div class="circle-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
        </div>
        <input
          class="main-input"
          placeholder="Add a task"
          autofocus
          [(ngModel)]="newTodoTitle"
          (keyup.enter)="addTodo()"
        />
      </div>
      
      <div class="options-row" *ngIf="newTodoTitle.trim()">
        <div class="left-options">
           <div class="option-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <input type="date" [(ngModel)]="startDateStr" title="Start Date">
           </div>
           
           <div class="option-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <input type="date" [(ngModel)]="endDateStr" title="Due Date">
           </div>
           
           <select [(ngModel)]="priority" class="priority-select">
             <option value="low">Low</option>
             <option value="medium">Medium</option>
             <option value="high">High</option>
           </select>
        </div>

        <button class="add-btn-primary" (click)="addTodo()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Add
        </button>
      </div>
    </div>
  `,
  styles: [`
    .input-container {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 16px 20px;
      transition: all 0.2s;
      border: 2px solid transparent;
    }
    
    .input-container:has(:focus) {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .input-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .circle-btn {
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .circle-btn:hover {
      color: var(--primary);
      transform: scale(1.1);
    }
    
    .main-input {
      border: none;
      background: none;
      width: 100%;
      font-size: 1.05rem;
      outline: none;
      color: var(--text-main);
      font-family: inherit;
    }
    
    .main-input::placeholder { 
      color: var(--text-muted); 
    }
    
    .options-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      animation: slideDown 0.2s ease;
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .left-options { 
      display: flex; 
      gap: 8px; 
      align-items: center; 
      flex-wrap: wrap; 
    }
    
    .option-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: var(--hover-bg);
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 0.85rem;
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .option-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    
    .option-btn input[type="date"] {
      border: none;
      background: none;
      outline: none;
      color: var(--text-main);
      font-size: 0.85rem;
      width: 110px;
      font-family: inherit;
    }
    
    .priority-select {
      background: var(--hover-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      outline: none;
      font-family: inherit;
      cursor: pointer;
    }
    
    .add-btn-primary {
      background: var(--primary);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    
    .add-btn-primary:hover { 
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  `]
})
export class TodoInputComponent {
  private todoService = inject(TodoService);
  newTodoTitle = '';
  priority: 'low' | 'medium' | 'high' = 'medium';
  startDateStr = '';
  endDateStr = '';

  addTodo() {
    if (this.newTodoTitle.trim()) {
      const start = this.startDateStr ? new Date(this.startDateStr).getTime() : null;
      const end = this.endDateStr ? new Date(this.endDateStr).getTime() : null;

      this.todoService.addTodo(this.newTodoTitle, this.priority, start, end);

      this.newTodoTitle = '';
      this.priority = 'medium';
      this.startDateStr = '';
      this.endDateStr = '';
    }
  }
}
