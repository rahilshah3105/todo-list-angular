import { Injectable, signal } from '@angular/core';

export interface DialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private dialogSignal = signal<DialogData | null>(null);
    private resolveFunc?: (value: boolean) => void;

    dialog = this.dialogSignal.asReadonly();

    confirm(title: string, message: string, confirmText = 'Delete', cancelText = 'Cancel'): Promise<boolean> {
        return new Promise((resolve) => {
            this.resolveFunc = resolve;
            this.dialogSignal.set({ title, message, confirmText, cancelText });
        });
    }

    handleResponse(confirmed: boolean) {
        this.dialogSignal.set(null);
        if (this.resolveFunc) {
            this.resolveFunc(confirmed);
            this.resolveFunc = undefined;
        }
    }

    close() {
        this.handleResponse(false);
    }
}
