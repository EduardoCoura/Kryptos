
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../services/crypto.service';
import { OutputTerminalComponent } from './output-terminal.component';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-text-encrypt',
  standalone: true,
  imports: [CommonModule, FormsModule, OutputTerminalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid lg:grid-cols-2 gap-10 animate-fade-in h-[calc(100vh-140px)] min-h-[500px]">
      
      <!-- LEFT: Input Configuration -->
      <div class="space-y-6 flex flex-col h-full">
        
        <!-- Input Area -->
        <div class="space-y-2 flex-1 flex flex-col">
          <label class="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] pl-1">
            <span>// {{ ts.t().text_enc.source_label }}</span>
            <span class="text-zinc-600">{{ content().length }} chars</span>
          </label>
          
          <div class="relative group flex-1">
            <!-- Glow effect on focus -->
            <div class="absolute -inset-0.5 bg-zinc-700/20 rounded-sm blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            
            <textarea 
              [(ngModel)]="content"
              [placeholder]="ts.t().text_enc.source_placeholder"
              class="relative w-full h-full p-5 rounded-sm bg-zinc-950/50 border border-zinc-800 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all font-mono text-sm leading-relaxed resize-none selection:bg-zinc-700 selection:text-white"
              spellcheck="false"
            ></textarea>
          </div>
        </div>

        <!-- Secret Key -->
        <div class="space-y-2">
           <label class="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] pl-1">
            // {{ ts.t().text_enc.key_label }}
          </label>
          <div class="relative group">
             <div class="absolute -inset-0.5 bg-zinc-700/20 rounded-sm blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <input 
              type="password" 
              [(ngModel)]="secretKey"
              [placeholder]="ts.t().text_enc.key_placeholder"
              class="relative w-full p-3.5 pl-11 rounded-sm bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all font-mono tracking-widest text-sm"
            />
            <svg class="absolute left-4 top-4 w-4 h-4 text-zinc-600 group-focus-within:text-zinc-300 transition-colors z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>

        <!-- Primary Actions -->
        <div class="grid grid-cols-2 gap-4 pt-2">
          <button 
            (click)="process('encrypt')"
            [disabled]="isLoading() || !content() || !secretKey()"
            class="group relative overflow-hidden rounded-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.3)] bg-white text-black hover:bg-zinc-200"
          >
            <span class="relative z-10 flex items-center justify-center gap-2 py-3.5 font-mono text-xs uppercase tracking-widest font-bold">
              @if (isLoading()) {
                <span class="w-3 h-3 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
              } @else {
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              }
              {{ ts.t().text_enc.btn_encrypt }}
            </span>
          </button>
          
          <button 
            (click)="process('decrypt')"
            [disabled]="isLoading() || !content() || !secretKey()"
            class="group relative overflow-hidden rounded-sm border border-zinc-800 hover:border-zinc-500 bg-transparent transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-400 hover:text-white"
          >
             <span class="relative z-10 flex items-center justify-center gap-2 py-3.5 font-mono text-xs uppercase tracking-widest font-bold">
              @if (isLoading()) {
                <span class="w-3 h-3 rounded-full border-2 border-zinc-500/30 border-t-zinc-500 animate-spin"></span>
              } @else {
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
              }
              {{ ts.t().text_enc.btn_decrypt }}
            </span>
          </button>
        </div>
      </div>

      <!-- RIGHT: Output Terminal -->
      <div class="h-full min-h-[400px]">
         <app-output-terminal 
            [content]="result()" 
            [label]="ts.t().text_enc.output_label"
         ></app-output-terminal>
      </div>

    </div>
  `
})
export class TextEncryptComponent {
  private cryptoService = inject(CryptoService);
  ts = inject(TranslationService);

  content = signal('');
  secretKey = signal('');
  result = signal('');
  isLoading = signal(false);

  process(mode: 'encrypt' | 'decrypt') {
    this.isLoading.set(true);
    this.result.set(''); 

    const action$ = mode === 'encrypt' 
      ? this.cryptoService.encryptText(this.content(), this.secretKey())
      : this.cryptoService.decryptText(this.content(), this.secretKey());

    action$.subscribe({
      next: (res) => {
        this.result.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.result.set('ERR_CONNECTION_REFUSED: UNABLE TO PROCESS HANDSHAKE');
        this.isLoading.set(false);
      }
    });
  }
}
