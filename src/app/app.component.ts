import { Component, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TodoInputComponent } from './components/todo-input/todo-input.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TodoInputComponent, TodoListComponent, DatePipe, ConfirmDialogComponent],
  template: `
    <div class="app-container">
      <app-sidebar #sidebar></app-sidebar>
      
      <main class="main-content">
        <header class="top-bar">
          <div class="page-title">
            <svg (click)="sidebar.toggle()" class="hamburger" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            {{ todoService.currentViewTitle() }}
            <span class="date-display">{{ today | date:'fullDate' }}</span>
          </div>
        </header>

        <div class="tasks-area">
          <app-todo-input></app-todo-input>
          <app-todo-list></app-todo-list>
        </div>
      </main>
    </div>
    <app-confirm-dialog></app-confirm-dialog>
  `
})
export class AppComponent {
  today = new Date();
  constructor(public todoService: TodoService) { }
}
