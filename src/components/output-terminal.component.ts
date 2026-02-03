
import { Component, input, signal, effect, ElementRef, viewChild, OnDestroy, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-output-terminal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-full group">
       <!-- Header -->
       <div class="flex justify-between items-end mb-2">
           <label class="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
            // {{ label() }}
          </label>
          @if(isTyping()) {
            <span class="text-[10px] text-emerald-500/80 font-mono flex items-center gap-1.5 animate-pulse">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              DECODING_STREAM
            </span>
          } @else if (fullText()) {
            <span class="text-[10px] text-zinc-600 font-mono flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
              IDLE
            </span>
          }
       </div>

      <!-- Terminal Window -->
      <div class="relative flex-1 rounded-sm bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col transition-colors duration-500"
           [class.border-emerald-500/20]="isTyping()"
           [class.border-zinc-800]="!isTyping()">
        
        <!-- Tactical Toolbar -->
        <div class="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
             <div class="flex gap-2 text-[10px] font-mono text-zinc-600">
               <span>TERM_ID: {{ terminalId() }}</span>
             </div>
             <div class="flex gap-1.5">
               <div class="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" [class.bg-red-500]="isTyping()"></div>
               <div class="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" [class.bg-amber-500]="isTyping()"></div>
               <div class="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" [class.bg-emerald-500]="!isTyping() && fullText()"></div>
             </div>
        </div>

        <!-- Terminal Body -->
        <div #scrollContainer class="relative flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed break-all">
           <!-- Scanlines -->
           <div class="absolute inset-0 scanline z-10 pointer-events-none opacity-10"></div>
           
           @if (displayedText() || isTyping()) {
             <div class="relative z-0">
               <span class="text-zinc-500 mr-2">$</span>
               <!-- The Text content -->
               <span class="text-zinc-300 whitespace-pre-wrap">{{ displayedText() }}</span>
               
               <!-- Blinking Cursor -->
               <span class="inline-block w-2.5 h-4 bg-emerald-500/80 align-middle ml-0.5 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
             </div>
           } @else {
              <div class="h-full flex flex-col items-center justify-center text-zinc-800 select-none">
                <span class="text-xs font-mono tracking-widest opacity-50">AWAITING_SIGNAL...</span>
             </div>
           }
        </div>

        <!-- Footer / Actions -->
        @if (fullText()) {
            <div class="p-2 border-t border-zinc-800 bg-zinc-900/30">
              <button 
                (click)="copyToClipboard()"
                class="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all hover:bg-white/10 group-hover:bg-zinc-900"
                [class.text-emerald-400]="copied()"
                [class.text-zinc-500]="!copied()"
              >
                @if (copied()) {
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  COPIED_TO_CLIPBOARD
                } @else {
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  COPY_BUFFER
                }
              </button>
            </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
    .scanline {
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
      background-size: 100% 4px;
    }
  `]
})
export class OutputTerminalComponent implements OnDestroy {
  // Inputs
  content = input.required<string>(); // The full text to type out
  label = input<string>('Output Stream');
  
  // State
  fullText = signal('');
  displayedText = signal('');
  isTyping = signal(false);
  copied = signal(false);
  terminalId = signal(Math.floor(Math.random() * 9000) + 1000);

  // Audio Context (Lazy loaded)
  private audioCtx: AudioContext | null = null;
  private typeInterval: any;
  
  // Refs
  scrollContainer = viewChild<ElementRef>('scrollContainer');

  constructor() {
    effect(() => {
      const newContent = this.content();
      
      // Stop any existing typing
      this.stopTyping();

      if (newContent) {
        this.startTypewriter(newContent);
      } else {
        this.displayedText.set('');
        this.fullText.set('');
      }
    });
  }

  private startTypewriter(text: string) {
    this.fullText.set(text);
    this.displayedText.set('');
    this.isTyping.set(true);
    
    // Calculate Speed based on length
    // Short texts (<100 chars): Slow, dramatic typing (30ms)
    // Medium texts (<500 chars): Fast typing (10ms)
    // Long texts (>500 chars): Batch typing (chunks)
    let charIndex = 0;
    const totalLength = text.length;
    let chunkSize = 1;
    let delay = 20;

    if (totalLength > 1000) {
      chunkSize = 50;
      delay = 5;
    } else if (totalLength > 200) {
      chunkSize = 5;
      delay = 10;
    }

    this.typeInterval = setInterval(() => {
      // Safety check
      if (charIndex >= totalLength) {
        this.stopTyping();
        // Ensure exact match at end
        this.displayedText.set(text);
        return;
      }

      // Add chunk
      const nextChunk = text.slice(charIndex, charIndex + chunkSize);
      this.displayedText.update(current => current + nextChunk);
      charIndex += chunkSize;

      // Audio feedback (Throttled)
      // Only play sound every few ticks to not sound like a machine gun
      if (Math.random() > 0.6) {
        this.playKeystrokeSound();
      }

      // Auto Scroll
      this.scrollToBottom();

    }, delay);
  }

  private stopTyping() {
    if (this.typeInterval) {
      clearInterval(this.typeInterval);
      this.typeInterval = null;
    }
    this.isTyping.set(false);
  }

  // Web Audio API for a subtle "click"
  private playKeystrokeSound() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      // Sound Design: Short, high pitch, very low volume sine wave
      oscillator.type = 'sine';
      // Randomize pitch slightly for realism
      oscillator.frequency.value = 800 + Math.random() * 200; 
      
      // Envelope
      gainNode.gain.setValueAtTime(0.02, this.audioCtx.currentTime); // Very quiet
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio likely blocked by browser policy until interaction
    }
  }

  private scrollToBottom() {
    const el = this.scrollContainer()?.nativeElement;
    if (el) {
      // Use requestAnimationFrame to ensure render update has happened
      requestAnimationFrame(() => {
         el.scrollTop = el.scrollHeight;
      });
    }
  }

  copyToClipboard() {
    // Copy the FULL text, not just displayed text
    navigator.clipboard.writeText(this.fullText());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  ngOnDestroy() {
    this.stopTyping();
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }
}
