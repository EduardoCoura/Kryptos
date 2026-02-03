
import { Component, inject, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../services/crypto.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-file-encrypt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-2xl mx-auto space-y-10 animate-fade-in pt-4">
      
      <!-- Stealth Drop Zone -->
      <div 
        class="relative h-80 rounded-sm border-2 transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col items-center justify-center"
        [class.border-dashed]="!selectedFile()"
        [class.border-solid]="selectedFile()"
        [class.border-white]="isDragging()"
        [class.bg-white/10]="isDragging()"
        [class.scale-[1.02]]="isDragging()"
        [class.border-zinc-800]="!isDragging() && !selectedFile()"
        [class.border-zinc-700]="selectedFile() && !isDragging()"
        [class.bg-zinc-900/20]="!isDragging()"
        [class.hover:border-zinc-500]="!isDragging() && !selectedFile()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="triggerFileInput()"
      >
        <!-- Background Grid Animation -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-opacity duration-500"
             [class.opacity-20]="!isDragging()"
             [class.opacity-50]="isDragging()">
        </div>
        
        <input 
          #fileInput
          type="file" 
          class="hidden" 
          (change)="onFileSelected($event)"
        />

        <!-- STATE: Empty / Dragging -->
        @if (!selectedFile()) {
          <div class="relative z-10 flex flex-col items-center text-center p-6 pointer-events-none">
            
            <!-- Animated Icon -->
            <div class="mb-6 relative">
              <div class="absolute inset-0 bg-white/20 blur-2xl rounded-full transition-opacity duration-300" 
                   [class.opacity-0]="!isDragging()" 
                   [class.opacity-100]="isDragging()">
              </div>
              
              <div class="w-20 h-20 rounded-xl bg-black border flex items-center justify-center transition-colors duration-300 shadow-2xl relative z-10"
                   [class.border-white]="isDragging()"
                   [class.border-zinc-800]="!isDragging()">
                <svg class="w-8 h-8 transition-colors duration-300" 
                     [class.text-white]="isDragging()" 
                     [class.text-zinc-600]="!isDragging()" 
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
            </div>

            <h3 class="text-xl font-serif text-zinc-300 mb-2 tracking-tight">
              {{ isDragging() ? ts.t().common.release : ts.t().common.upload }}
            </h3>
            <p class="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">
              {{ ts.t().common.maxSize }}
            </p>
          </div>
        }

        <!-- STATE: File Selected -->
        @if (selectedFile()) {
          <div class="relative z-10 w-full max-w-sm p-6 bg-black/80 border border-zinc-800 rounded-lg shadow-2xl backdrop-blur-md animate-fade-in-up" (click)="$event.stopPropagation()">
            
            <div class="flex items-start gap-4">
              <!-- Dynamic File Icon -->
              <div class="w-12 h-12 rounded-sm border flex items-center justify-center shrink-0 transition-colors duration-300"
                   [class.bg-purple-500/10]="fileType() === 'image'"
                   [class.border-purple-500/20]="fileType() === 'image'"
                   [class.text-purple-400]="fileType() === 'image'"
                   
                   [class.bg-blue-500/10]="fileType() === 'code'"
                   [class.border-blue-500/20]="fileType() === 'code'"
                   [class.text-blue-400]="fileType() === 'code'"

                   [class.bg-amber-500/10]="fileType() === 'archive'"
                   [class.border-amber-500/20]="fileType() === 'archive'"
                   [class.text-amber-400]="fileType() === 'archive'"

                   [class.bg-zinc-900]="fileType() === 'binary'"
                   [class.border-zinc-700]="fileType() === 'binary'"
                   [class.text-zinc-400]="fileType() === 'binary'">
                   
                @switch (fileType()) {
                  @case ('image') {
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  }
                  @case ('code') {
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  }
                  @case ('archive') {
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  }
                  @default {
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  }
                }
              </div>

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-sm font-medium text-white truncate pr-2" [title]="selectedFile()?.name">{{ selectedFile()?.name }}</h4>
                  @if (!isLoading() && !statusMessage()) {
                    <button (click)="removeFile()" class="text-zinc-500 hover:text-red-400 transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  }
                </div>
                <p class="text-[10px] font-mono text-zinc-500 uppercase">{{ formatSize(selectedFile()?.size || 0) }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            @if (isLoading()) {
              <div class="mt-4 space-y-2">
                <div class="flex justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  <span>{{ ts.t().common.processing }}</span>
                  <span>{{ uploadProgress() }}%</span>
                </div>
                <div class="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full bg-white transition-all duration-200 ease-out" [style.width.%]="uploadProgress()"></div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Action Bar -->
      <div class="grid md:grid-cols-[1fr_auto] gap-4">
        <div class="relative group">
          <input 
            type="password" 
            [(ngModel)]="secretKey"
            [placeholder]="ts.t().file_enc.key_placeholder"
            class="w-full p-4 pl-12 rounded-sm bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-700 focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 outline-none transition-all font-mono text-sm tracking-widest"
          />
          <svg class="absolute left-4 top-4 w-5 h-5 text-zinc-600 group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>

        <button 
          (click)="processFile()"
          [disabled]="isLoading() || !selectedFile() || !secretKey()"
          class="relative overflow-hidden bg-white hover:bg-zinc-200 text-black font-bold py-4 px-10 rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] flex items-center gap-3 font-mono text-xs uppercase tracking-widest group"
        >
          <span class="relative z-10 flex items-center gap-2">
            @if (isLoading()) {
              <div class="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              {{ ts.t().common.processing }}
            } @else {
              {{ ts.t().file_enc.btn_secure }}
            }
          </span>
        </button>
      </div>

      <!-- Success Notification -->
      @if (statusMessage()) {
        <div class="relative overflow-hidden p-5 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center gap-4 animate-slide-up">
           <div class="absolute inset-0 bg-white/5"></div>
           <div class="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center shrink-0">
             <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
           </div>
           <div class="flex-1 z-10">
             <h4 class="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{{ ts.t().common.success }}</h4>
             <p class="text-xs font-mono text-zinc-400 break-all">{{ statusMessage() }}</p>
           </div>
           <button (click)="statusMessage.set('')" class="text-zinc-500 hover:text-white transition-colors">
             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      }
    </div>
  `
})
export class FileEncryptComponent {
  private cryptoService = inject(CryptoService);
  ts = inject(TranslationService);

  isDragging = signal(false);
  selectedFile = signal<File | null>(null);
  secretKey = signal('');
  isLoading = signal(false);
  uploadProgress = signal(0);
  statusMessage = signal('');

  // Determine file type for icon display
  fileType = computed(() => {
    const file = this.selectedFile();
    if (!file) return 'unknown';
    
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'image';
    if (['js', 'ts', 'html', 'css', 'json', 'java', 'py', 'c', 'cpp'].includes(ext)) return 'code';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
    
    return 'binary';
  });

  onDragOver(e: DragEvent) {
    e.preventDefault();
    if (!this.isLoading()) {
        this.isDragging.set(true);
    }
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
    if (!this.isLoading() && e.dataTransfer?.files.length) {
      this.selectedFile.set(e.dataTransfer.files[0]);
      this.statusMessage.set('');
      this.uploadProgress.set(0);
    }
  }

  triggerFileInput() {
    if(this.isLoading()) return;
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
      this.statusMessage.set('');
      this.uploadProgress.set(0);
    }
  }

  removeFile() {
    this.selectedFile.set(null);
    this.statusMessage.set('');
    this.uploadProgress.set(0);
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  processFile() {
    const file = this.selectedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.statusMessage.set('');
    this.uploadProgress.set(0);

    // Simulate progress since the mock service just delays
    const interval = setInterval(() => {
        this.uploadProgress.update(p => {
            if (p >= 90) return p; // Hold at 90% until complete
            return p + Math.floor(Math.random() * 15);
        });
    }, 200);

    this.cryptoService.encryptFile(file, this.secretKey()).subscribe({
      next: (res) => {
        clearInterval(interval);
        this.uploadProgress.set(100);
        
        // Small delay to let the user see 100%
        setTimeout(() => {
            this.isLoading.set(false);
            this.statusMessage.set(`HASH: ${res.data.substring(0, 25)}...`);
        }, 500);
      },
      error: () => {
        clearInterval(interval);
        this.isLoading.set(false);
        this.statusMessage.set('Error: File system rejected operation.');
      }
    });
  }
}
