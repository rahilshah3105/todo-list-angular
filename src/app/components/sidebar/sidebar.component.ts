import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <aside class="sidebar" [class.open]="isOpen">
      <div class="user-profile">
        <div class="avatar">U</div>
        <div class="info">
          <span class="name">User Name</span>
          <span class="email">user&#64;example.com</span>
        </div>
        <button class="theme-toggle" (click)="toggleTheme()" title="Toggle theme">
          <svg *ngIf="!isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          <svg *ngIf="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
      </div>

      <nav class="nav-menu">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search tasks...">
        </div>

        <ul class="system-lists">
          <li *ngFor="let cat of systemCategories" 
              [class.active]="todoService.currentView() === cat.id"
              (click)="selectView(cat.id)">
            <svg *ngIf="cat.icon === 'sun'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>
            <svg *ngIf="cat.icon === 'star'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <svg *ngIf="cat.icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <svg *ngIf="cat.icon === 'list'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            <span class="label">{{ cat.name }}</span>
            <span class="count" *ngIf="getCategoryCount(cat.id) > 0">
              {{ getCategoryCount(cat.id) }}
            </span>
          </li>
        </ul>

        <div class="divider"></div>

        <div class="custom-lists-header">
          <span>My Lists</span>
          <button class="add-list-btn" (click)="toggleAddList()" title="Add new list">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        <div class="add-list-form" *ngIf="isAddingList">
          <input 
            #newListName 
            type="text" 
            placeholder="List Name" 
            (keyup.enter)="addList(newListName.value); newListName.value = ''"
            (blur)="isAddingList = false"
            autofocus
          >
        </div>

        <ul class="custom-lists">
          <li *ngFor="let cat of customCategories" 
              [class.active]="todoService.currentView() === cat.id"
              (click)="selectView(cat.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            <span class="label">{{ cat.name }}</span>
            <div class="actions">
               <span class="count" *ngIf="getCategoryCount(cat.id) > 0">{{ getCategoryCount(cat.id) }}</span>
               <button class="delete-btn" (click)="deleteCategory($event, cat.id)" title="Delete list">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
               </button>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
    <div class="overlay" *ngIf="isOpen" (click)="close()"></div>
  `,
    styles: [`
    :host {
      display: block;
    }

    .sidebar {
      width: 280px;
      height: 100vh;
      background: var(--bg-card);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 100;
    }

    .user-profile {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border);
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary), #818cf8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.2rem;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
    
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .name {
      font-weight: 600;
      color: var(--text-main);
      font-size: 0.95rem;
    }
    
    .email {
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .theme-toggle {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .theme-toggle:hover {
      background: var(--hover-bg);
      color: var(--text-main);
      transform: rotate(15deg);
    }

    .nav-menu {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }

    .search-box {
      margin-bottom: 24px;
      position: relative;
    }

    .search-box input {
      width: 100%;
      padding: 10px 10px 10px 36px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-main);
      color: var(--text-main);
      outline: none;
      transition: all 0.2s;
    }

    .search-box input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .search-box svg {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }

    .system-lists, .custom-lists {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .system-lists li, .custom-lists li {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      margin-bottom: 4px;
      border-radius: 10px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.2s;
      font-weight: 500;
    }

    .system-lists li:hover, .custom-lists li:hover {
      background: var(--hover-bg);
      color: var(--text-main);
      transform: translateX(4px);
    }

    .system-lists li.active, .custom-lists li.active {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary);
    }

    .system-lists li svg, .custom-lists li svg:first-child {
      margin-right: 12px;
      color: inherit;
    }

    .label {
      flex: 1;
      font-size: 0.95rem;
    }

    .count {
      background: var(--hover-bg);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .active .count {
      background: white;
      color: var(--primary);
    }

    .divider {
      height: 1px;
      background: var(--border);
      margin: 20px 0;
    }

    .custom-lists-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 0 4px;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .add-list-btn {
      background: none;
      border: none !important;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .add-list-btn:hover {
      color: var(--primary);
      background: rgba(99, 102, 241, 0.1);
    }

    .add-list-form {
      margin-bottom: 12px;
    }

    .add-list-form input {
      width: 100%;
      padding: 8px 12px;
      border-radius: 6px;
      border: 2px solid var(--primary);
      background: var(--bg-main);
      color: var(--text-main);
      outline: none;
    }

    /* Custom List Specific Styles */
    .custom-lists .label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .custom-lists .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .delete-btn {
      opacity: 0;
      background: transparent;
      border: none !important;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .custom-lists li:hover .delete-btn {
      opacity: 1;
    }
    
    .delete-btn:hover {
      color: white;
      background: var(--danger);
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -280px;
      }
      
      .sidebar.open {
        left: 0;
        box-shadow: 10px 0 30px rgba(0,0,0,0.1);
      }
      
      .overlay {
        position: fixed;
        top: 0; 
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 50;
        backdrop-filter: blur(4px);
      }
    }
  `]
})
export class SidebarComponent {
    todoService = inject(TodoService);
    dialogService = inject(DialogService);
    isOpen = false;
    isAddingList = false;
    isDark = false;

    ngOnInit() {
        const theme = localStorage.getItem('theme') || 'light';
        this.isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        const theme = this.isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    get systemCategories() {
        return this.todoService.categories().filter(c => c.type === 'system');
    }

    get customCategories() {
        return this.todoService.categories().filter(c => c.type === 'custom');
    }

    getCategoryCount(catId: string) {
        const todos = this.todoService.todos();

        switch (catId) {
            case 'my-day':
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                return todos.filter(t => !t.completed && (t.startDate ? t.startDate <= today.getTime() : true)).length;
            case 'important':
                return todos.filter(t => t.isImportant && !t.completed).length;
            case 'planned':
                return todos.filter(t => (t.startDate || t.endDate) && !t.completed).length;
            case 'all':
                return todos.filter(t => !t.completed).length;
            default:
                return todos.filter(t => t.categoryId === catId && !t.completed).length;
        }
    }

    selectView(id: string) {
        this.todoService.selectView(id);
        if (window.innerWidth <= 768) {
            this.isOpen = false;
        }
    }

    toggleAddList() {
        this.isAddingList = !this.isAddingList;
    }

    addList(name: string) {
        if (name.trim()) {
            this.todoService.addCategory(name);
            this.isAddingList = false;
        }
    }

    async deleteCategory(event: Event, id: string) {
        event.stopPropagation();
        const confirmed = await this.dialogService.confirm(
            'Delete List',
            'Are you sure you want to delete this list? All tasks in this list will be permanently removed.'
        );
        if (confirmed) {
            this.todoService.deleteCategory(id);
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    close() {
        this.isOpen = false;
    }
}
