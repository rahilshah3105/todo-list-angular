import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dialog-backdrop" *ngIf="dialogService.dialog()" (click)="dialogService.close()">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ dialogService.dialog()?.title }}</h3>
          <button class="close-btn" (click)="dialogService.close()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div class="dialog-body">
          <p>{{ dialogService.dialog()?.message }}</p>
        </div>
        
        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="dialogService.handleResponse(false)">
            {{ dialogService.dialog()?.cancelText }}
          </button>
          <button class="btn btn-danger" (click)="dialogService.handleResponse(true)">
            {{ dialogService.dialog()?.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .dialog-container {
      background: var(--bg-card);
      border-radius: 16px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.2s ease;
      border: 1px solid var(--border);
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px) scale(0.95); 
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1); 
      }
    }
    
    .dialog-header {
      padding: 24px 24px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }
    
    .dialog-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-main);
    }
    
    .close-btn {
      color: var(--text-muted);
      padding: 4px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    
    .close-btn:hover {
      color: var(--text-main);
      background: var(--hover-bg);
    }
    
    .dialog-body {
      padding: 24px;
    }
    
    .dialog-body p {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    
    .dialog-footer {
      padding: 16px 24px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-family: inherit;
    }
    
    .btn-secondary {
      background: var(--hover-bg);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    
    .btn-secondary:hover {
      background: var(--border);
      color: var(--text-main);
    }
    
    .btn-danger {
      background: var(--danger);
      color: white;
    }
    
    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    @media (max-width: 500px) {
      .dialog-container {
        min-width: 90vw;
        margin: 16px;
      }
    }
  `]
})
export class ConfirmDialogComponent {
    dialogService = inject(DialogService);
}
