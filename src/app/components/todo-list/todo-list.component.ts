import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  template: `
    <section class="task-list-section">
      <ul class="task-ul">
        @for (todo of todoService.filteredTodos(); track todo.id) {
          <app-todo-item [todo]="todo"></app-todo-item>
        }
        @if (todoService.filteredTodos().length === 0) {
           <div class="empty-state">
             <div class="empty-icon">📝</div>
             <p>No tasks found in this view.</p>
           </div>
        }
      </ul>
    </section>
  `,
  styles: [`
    .task-list-section { padding-bottom: 40px; }
    .task-ul { list-style: none; padding: 0; margin: 0; }
    .empty-state { 
      padding: 64px 32px; 
      text-align: center; 
      color: #94a3b8; 
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .empty-icon { font-size: 3rem; opacity: 0.5; }
  `]
})
export class TodoListComponent {
  todoService = inject(TodoService);
}
