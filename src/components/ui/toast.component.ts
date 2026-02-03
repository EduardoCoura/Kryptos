
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-sm border shadow-2xl backdrop-blur-md animate-slide-in-right flex items-start gap-3"
          [class.bg-red-950/90]="toast.type === 'error'"
          [class.border-red-500/50]="toast.type === 'error'"
          [class.bg-zinc-900/90]="toast.type !== 'error'"
          [class.border-zinc-700]="toast.type !== 'error'"
        >
          <!-- Icon -->
          <div class="mt-0.5 shrink-0">
            @if (toast.type === 'error') {
               <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            } @else {
               <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h4 
              class="text-[10px] font-bold uppercase tracking-widest mb-1"
              [class.text-red-400]="toast.type === 'error'"
              [class.text-zinc-400]="toast.type !== 'error'"
            >
              {{ toast.type === 'error' ? 'Security Alert' : 'System Notification' }}
            </h4>
            <p class="text-xs font-mono text-zinc-200">{{ toast.message }}</p>
          </div>

          <!-- Close -->
          <button (click)="toastService.remove(toast.id)" class="text-zinc-500 hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-right {
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
