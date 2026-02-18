import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Category } from '../models/category.model';
import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    // State
    private todosSignal = signal<Todo[]>([]);
    private categoriesSignal = signal<Category[]>([
        { id: 'my-day', name: 'My Day', icon: 'sun', type: 'system' },
        { id: 'important', name: 'Important', icon: 'star', type: 'system' },
        { id: 'planned', name: 'Planned', icon: 'calendar', type: 'system' },
        { id: 'all', name: 'All Tasks', icon: 'list', type: 'system' }
    ]);

    // Current View: can be a system ID ('my-day', 'important'...) or a custom category ID
    private currentViewSignal = signal<string>('my-day');

    // Selectors
    todos = this.todosSignal.asReadonly();
    categories = this.categoriesSignal.asReadonly();
    currentView = this.currentViewSignal.asReadonly();

    currentViewTitle = computed(() => {
        const viewId = this.currentViewSignal();
        const category = this.categoriesSignal().find(c => c.id === viewId);
        return category ? category.name : 'Tasks';
    });

    filteredTodos = computed(() => {
        const view = this.currentViewSignal();
        const todos = this.todosSignal();

        let result = todos;

        // 1. Filter by View/Category
        switch (view) {
            case 'my-day':
                // Show active tasks that are either manually added to "My Day" (if we had that flag) 
                // or just tasks that are relevant for today (start date <= today).
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                result = todos.filter(t => !t.completed && (t.startDate ? t.startDate <= today.getTime() : true));
                break;
            case 'important':
                result = todos.filter(t => t.isImportant);
                break;
            case 'planned':
                result = todos.filter(t => t.startDate || t.endDate);
                break;
            case 'all':
                result = todos;
                break;
            default:
                // Custom Category
                result = todos.filter(t => t.categoryId === view);
                break;
        }

        // 2. Sort: Completed (bottom) > Important (top) > Priority > End Date
        return result.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;

            const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
            const pA = priorityWeight[a.priority || 'medium'] || 0;
            const pB = priorityWeight[b.priority || 'medium'] || 0;
            if (pA !== pB) return pB - pA;

            const dateA = a.endDate ?? Number.MAX_SAFE_INTEGER;
            const dateB = b.endDate ?? Number.MAX_SAFE_INTEGER;
            return dateA - dateB;
        });
    });

    constructor(private logger: LoggerService) {
        this.logger.info('TodoService initialized');
        this.loadFromStorage();

        // Auto-save
        effect(() => {
            this.saveToStorage(this.todosSignal(), this.categoriesSignal());
        });
    }

    // Actions
    addTodo(title: string, priority: 'low' | 'medium' | 'high' = 'medium', startDate: number | null = null, endDate: number | null = null, isImportant = false) {
        if (!title.trim()) {
            this.logger.warn('Add todo failed: Empty title');
            return;
        }

        const currentView = this.currentViewSignal();
        const isCustomCategory = !['my-day', 'important', 'planned', 'all'].includes(currentView);

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            title: title.trim(),
            completed: false,
            priority,
            startDate,
            endDate,
            isImportant: isImportant || currentView === 'important',
            categoryId: isCustomCategory ? currentView : undefined
        };
        this.todosSignal.update(todos => [...todos, newTodo]);
        this.logger.info('Todo added', { id: newTodo.id, title: newTodo.title, priority });
    }

    toggleTodo(id: string) {
        const todo = this.todosSignal().find(t => t.id === id);
        this.todosSignal.update(todos =>
            todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        );
        this.logger.debug('Todo toggled', { id, completed: !todo?.completed });
    }

    toggleImportant(id: string) {
        const todo = this.todosSignal().find(t => t.id === id);
        this.todosSignal.update(todos =>
            todos.map(t => t.id === id ? { ...t, isImportant: !t.isImportant } : t)
        );
        this.logger.debug('Todo importance toggled', { id, isImportant: !todo?.isImportant });
    }

    deleteTodo(id: string) {
        const todo = this.todosSignal().find(t => t.id === id);
        this.todosSignal.update(todos => todos.filter(t => t.id !== id));
        this.logger.info('Todo deleted', { id, title: todo?.title });
    }

    updateTodo(id: string, updates: Partial<Todo>) {
        this.todosSignal.update(todos =>
            todos.map(t => t.id === id ? { ...t, ...updates } : t)
        );
        this.logger.debug('Todo updated', { id, updates });
    }

    // Category Actions
    selectView(viewId: string) {
        this.currentViewSignal.set(viewId);
    }

    addCategory(name: string) {
        if (!name.trim()) {
            this.logger.warn('Add category failed: Empty name');
            return;
        }
        const newCat: Category = {
            id: crypto.randomUUID(),
            name: name.trim(),
            icon: 'list',
            type: 'custom'
        };
        this.categoriesSignal.update(cats => [...cats, newCat]);
        this.selectView(newCat.id);
        this.logger.info('Category added', { id: newCat.id, name: newCat.name });
    }

    deleteCategory(id: string) {
        const category = this.categoriesSignal().find(c => c.id === id);
        this.categoriesSignal.update(cats => cats.filter(c => c.id !== id));
        this.todosSignal.update(todos => todos.filter(t => t.categoryId !== id));
        if (this.currentViewSignal() === id) {
            this.currentViewSignal.set('my-day');
        }
        this.logger.info('Category deleted', { id, name: category?.name });
    }

    // Persistence
    private saveToStorage(todos: Todo[], categories: Category[]) {
        localStorage.setItem('angular-todo-dashboard-todos', JSON.stringify(todos));
        const customCats = categories.filter(c => c.type === 'custom');
        localStorage.setItem('angular-todo-dashboard-categories', JSON.stringify(customCats));
    }

    private loadFromStorage() {
        const storedTodos = localStorage.getItem('angular-todo-dashboard-todos');
        const storedCats = localStorage.getItem('angular-todo-dashboard-categories');

        // Legacy migration
        if (!storedTodos) {
            const oldTodos = localStorage.getItem('angular-todo-signals');
            if (oldTodos) {
                try {
                    this.todosSignal.set(JSON.parse(oldTodos));
                    this.logger.debug('Migrated from legacy storage');
                } catch (e) {
                    this.logger.error('Failed to migrate legacy todos', e);
                }
            }
        } else {
            try {
                const todos = JSON.parse(storedTodos);
                this.todosSignal.set(todos);
                this.logger.debug('Todos loaded from storage', { count: todos.length });
            } catch (e) {
                this.logger.error('Failed to load todos from storage', e);
            }
        }

        if (storedCats) {
            try {
                const custom = JSON.parse(storedCats);
                this.categoriesSignal.update(cats => [...cats.filter(c => c.type === 'system'), ...custom]);
            } catch (e) { }
        }
    }
}
