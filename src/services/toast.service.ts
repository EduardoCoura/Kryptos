
import { Injectable, signal } from '@angular/core';

export type ToastType = 'info' | 'error' | 'success' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info') {
    const id = Date.now();
    const newToast: Toast = { id, message, type, timestamp: id };
    
    this.toasts.update(current => [...current, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
