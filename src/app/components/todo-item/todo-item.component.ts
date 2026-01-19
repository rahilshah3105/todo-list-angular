import { Component, Input, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <li [class.completed]="todo.completed" [class.editing]="isEditing" class="task-card">
      <div class="view">
        <button 
           class="check-btn" 
           [class.checked]="todo.completed"
           (click)="toggle()"
           title="Mark as {{ todo.completed ? 'incomplete' : 'complete' }}">
           <svg *ngIf="todo.completed" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>
        
        <div class="content" (dblclick)="startEdit()">
          <div class="title-row">
            <span class="task-title">{{ todo.title }}</span>
            <button 
              class="star-btn" 
              [class.active]="todo.isImportant"
              (click)="toggleImportant($event)"
              title="{{ todo.isImportant ? 'Remove from important' : 'Mark as important' }}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" [attr.fill]="todo.isImportant ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </button>
          </div>
          
          <div class="meta-row" *ngIf="todo.priority || todo.startDate || todo.endDate || categoryName">
            <span class="badge priority-{{ todo.priority }}" *ngIf="todo.priority">
              {{ todo.priority }}
            </span>
            
            <span class="date-range" *ngIf="todo.startDate || todo.endDate">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
               <span *ngIf="todo.startDate">{{ todo.startDate | date:'MMM d' }}</span>
               <span *ngIf="todo.startDate && todo.endDate"> - </span>
               <span *ngIf="todo.endDate">{{ todo.endDate | date:'MMM d' }}</span>
            </span>
            
            <span class="category-tag" *ngIf="categoryName && categoryName !== 'Tasks'">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
               {{ categoryName }}
            </span>
          </div>
        </div>

        <button class="delete-btn" (click)="delete()" title="Delete task">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
      
      <input
        #titleInput
        class="edit-input"
        [value]="todo.title"
      />
    </li>
  `,
  styles: [`
    .task-card {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border);
      padding: 18px 24px;
      transition: all 0.2s;
      animation: slideIn 0.2s ease;
    }
    
    .task-card:hover { 
      background: var(--hover-bg);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .view { 
      display: flex; 
      align-items: flex-start; 
      gap: 16px; 
      width: 100%;
    }
    
    .check-btn {
      width: 24px; 
      height: 24px;
      border: 2px solid var(--border);
      border-radius: 50%;
      display: flex; 
      align-items: center; 
      justify-content: center;
      color: white;
      cursor: pointer;
      margin-top: 2px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      background: var(--bg-card);
    }
    
    .check-btn:hover {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.08);
      transform: scale(1.08);
    }
    
    .check-btn.checked {
      background: var(--primary);
      border-color: var(--primary);
      transform: scale(0.95);
    }
    
    .content { 
      flex: 1; 
      min-width: 0;
      margin-right: 4px;
    }
    
    .title-row { 
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 8px; 
    }
    
    .task-title { 
      font-size: 1rem; 
      color: var(--text-main);
      line-height: 1.5;
      word-wrap: break-word;
      flex: 1;
      font-weight: 500;
      cursor: text;
    }
    
    .completed .task-title { 
      text-decoration: line-through; 
      color: var(--text-muted);
      font-weight: 400;
    }
    
    .meta-row { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      font-size: 0.8rem; 
      flex-wrap: wrap;
      margin-top: 8px;
    }
    
    .badge { 
      text-transform: uppercase; 
      font-weight: 700; 
      font-size: 0.65rem; 
      padding: 3px 8px; 
      border-radius: 6px;
      letter-spacing: 0.03em;
    }
    
    .priority-high { 
      color: #dc2626; 
      background: rgba(220, 38, 38, 0.12); 
    }
    
    .priority-medium { 
      color: #ea580c; 
      background: rgba(234, 88, 12, 0.12); 
    }
    
    .priority-low { 
      color: #16a34a; 
      background: rgba(22, 163, 74, 0.12); 
    }
    
    .date-range, .category-tag { 
      display: flex; 
      align-items: center; 
      gap: 5px;
      color: var(--text-muted);
      font-size: 0.8rem;
    }
    
    .star-btn { 
      color: var(--text-muted);
      cursor: pointer;
      padding: 6px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      border-radius: 6px;
      background: transparent;
      border: none;
    }
    
    .star-btn:hover {
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.08);
      transform: scale(1.15) rotate(-5deg);
    }
    
    .star-btn.active { 
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.08);
    }
    
    .star-btn.active:hover {
      transform: scale(1.2) rotate(5deg);
    }
    
    .delete-btn { 
      opacity: 0; 
      color: var(--text-muted);
      padding: 6px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      border-radius: 6px;
      background: transparent;
      border: none;
      margin-left: auto;
    }
    
    .task-card:hover .delete-btn { 
      opacity: 1; 
    }
    
    .delete-btn:hover { 
      color: #dc2626;
      background: rgba(220, 38, 38, 0.08);
      transform: scale(1.15);
    }
    
    .edit-input { 
      display: none; 
      width: 100%; 
      border: 2px solid var(--primary); 
      padding: 12px 16px; 
      border-radius: 10px; 
      outline: none;
      background: var(--bg-card);
      color: var(--text-main);
      font-size: 1rem;
      font-family: inherit;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .edit-input:focus {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .editing .edit-input { 
      display: block; 
    }
    
    .editing .view { 
      display: none;
    }
  `]
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @ViewChild('titleInput') titleInput?: ElementRef;

  private todoService = inject(TodoService);
  isEditing = false;

  get categoryName() {
    if (!this.todo.categoryId) return '';
    const cat = this.todoService.categories().find(c => c.id === this.todo.categoryId);
    return cat ? cat.name : '';
  }

  toggle() {
    this.todoService.toggleTodo(this.todo.id);
  }

  toggleImportant(event: Event) {
    event.stopPropagation();
    this.todoService.toggleImportant(this.todo.id);
  }

  delete() {
    this.todoService.deleteTodo(this.todo.id);
  }

  startEdit() {
    if (!this.todo.completed) {
      this.isEditing = true;
      setTimeout(() => {
        this.titleInput?.nativeElement.focus();
      }, 0);
    }
  }

  stopEdit(title: string) {
    if (!this.isEditing) return;
    this.isEditing = false;
    if (title.trim()) {
      this.todoService.updateTodo(this.todo.id, { title: title.trim() });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    if (this.titleInput) {
      this.titleInput.nativeElement.value = this.todo.title;
    }
  }
}
