export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  editing?: boolean;
  priority?: 'low' | 'medium' | 'high';
  startDate?: number | null;
  endDate?: number | null;
  categoryId?: string;
  isImportant?: boolean;
}
