
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-black bg-noise relative overflow-hidden">
      
      <!-- Back Button (Enhanced Visibility) -->
      <a routerLink="/" class="absolute top-6 left-6 z-20 flex items-center gap-3 px-5 py-2.5 rounded-sm bg-black/40 border border-zinc-800 text-zinc-400 hover:text-black hover:bg-white hover:border-white transition-all duration-300 group backdrop-blur-md cursor-pointer shadow-lg">
        <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">{{ ts.t().common.back }}</span>
      </a>

      <!-- Ambient Lighting (Cold/White) -->
      <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/10 rounded-full blur-[120px]"></div>
      
      <!-- Login Card -->
      <div class="relative z-10 w-full max-w-md p-10 bg-black/60 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black rounded-lg">
        
        <!-- Header -->
        <div class="text-center mb-10 group">
          <div class="w-12 h-12 mx-auto mb-6 bg-black border border-zinc-700 flex items-center justify-center rounded-sm rotate-45 group-hover:border-zinc-400 transition-colors duration-500">
             <div class="w-6 h-6 border border-zinc-500 -rotate-45 shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"></div>
          </div>
          <h1 class="text-3xl font-serif text-white tracking-tight mb-2">{{ ts.t().auth.title }}</h1>
          <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">{{ ts.t().auth.subtitle }}</p>
        </div>

        <!-- Form -->
        <form (submit)="login($event)" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{{ ts.t().auth.identity }}</label>
            <div class="relative group">
               <div class="absolute -inset-0.5 bg-zinc-700/20 rounded-md blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
               <input 
                type="text" 
                placeholder="agent@kryptos.io"
                class="relative w-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 p-3 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all font-mono text-sm placeholder-zinc-700"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{{ ts.t().auth.passphrase }}</label>
             <div class="relative group">
               <div class="absolute -inset-0.5 bg-zinc-700/20 rounded-md blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  class="relative w-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 p-3 rounded-md focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all font-mono text-sm placeholder-zinc-700"
                />
             </div>
          </div>

          <button 
            type="submit"
            class="w-full mt-8 py-4 bg-white text-black font-bold border border-transparent hover:bg-zinc-200 transition-all duration-300 uppercase font-mono text-xs tracking-[0.2em] shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] rounded-sm"
          >
            {{ ts.t().auth.submit }}
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-10 text-center border-t border-zinc-800 pt-6">
          <p class="text-[10px] text-zinc-600 font-mono">{{ ts.t().auth.footer }}</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private router = inject(Router);
  ts = inject(TranslationService);

  login(e: Event) {
    e.preventDefault();
    localStorage.setItem('kryptos_token', 'ACCESS_GRANTED_CLASS_A');
    this.router.navigate(['/dashboard']);
  }
}
