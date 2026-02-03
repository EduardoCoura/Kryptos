
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService, Lang } from './services/translation.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-500/30 selection:text-white relative overflow-x-hidden">
      
      <!-- Ambient Background Effects (Stealth Mode) -->
      <div class="fixed inset-0 pointer-events-none z-0">
         <!-- Subtle top spotlight (Cold White) -->
        <div class="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-zinc-800/20 rounded-full blur-[150px] opacity-40"></div>
        <!-- Noise Texture -->
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]"></div>
      </div>

      <!-- NAVBAR -->
      <nav class="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-3 group cursor-default">
             <div class="w-8 h-8 bg-black border border-zinc-700 rounded-sm flex items-center justify-center rotate-45 group-hover:border-zinc-400 transition-colors duration-500">
               <div class="w-3 h-3 bg-zinc-200 -rotate-45 shadow-[0_0_10px_white]"></div>
             </div>
             <span class="text-xl font-serif font-bold tracking-tight text-white group-hover:tracking-widest transition-all duration-500">Kryptos</span>
          </div>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#" class="hover:text-white transition-colors">{{ ts.t().landing.features }}</a>
            <a href="#" class="hover:text-white transition-colors">{{ ts.t().landing.security }}</a>
            <a href="#" class="hover:text-white transition-colors">{{ ts.t().landing.enterprise }}</a>
          </div>

          <!-- Auth & Lang -->
          <div class="flex items-center gap-5">
            
            <!-- Flag Dropdown Switcher -->
            <div class="relative">
              <button (click)="toggleLangMenu()" class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-800">
                <img [src]="currentFlag()" class="w-5 h-3.5 object-cover rounded-[1px] shadow-sm opacity-80 hover:opacity-100" alt="Current Language">
                <svg class="w-3 h-3 text-zinc-500 transition-transform duration-300" [class.rotate-180]="showLangMenu()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (showLangMenu()) {
                <div class="absolute top-full right-0 mt-2 w-36 bg-black border border-zinc-800 rounded-sm shadow-2xl py-1 z-50 animate-fade-in-up origin-top-right">
                  @for (lang of languages; track lang.code) {
                    <button 
                      (click)="setLang(lang.code)" 
                      class="w-full text-left px-4 py-2.5 hover:bg-zinc-900 flex items-center gap-3 text-xs text-zinc-400 hover:text-white transition-colors group border-l-2 border-transparent hover:border-emerald-500"
                    >
                      <img [src]="lang.flag" class="w-4 h-3 object-cover rounded-[1px] opacity-70 group-hover:opacity-100">
                      <span class="font-mono uppercase tracking-wider">{{ lang.label }}</span>
                    </button>
                  }
                </div>
              }
            </div>

            <div class="w-px h-4 bg-zinc-800 hidden md:block"></div>

            <a routerLink="/auth/login" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">{{ ts.t().landing.signin }}</a>
            <a routerLink="/auth/login" class="px-6 py-2.5 bg-zinc-100 text-black text-sm font-bold rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
              {{ ts.t().landing.start }}
            </a>
          </div>
        </div>
      </nav>

      <!-- HERO SECTION -->
      <section class="relative z-10 pt-48 pb-32 px-6">
        <div class="max-w-5xl mx-auto text-center space-y-10">
          
          <!-- Badge -->
          <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md animate-fade-in-up hover:border-zinc-600 transition-colors cursor-default">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span class="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-mono font-medium">{{ ts.t().landing.badge }}</span>
          </div>

          <!-- Headline -->
          <h1 class="text-6xl md:text-8xl font-serif font-medium tracking-tighter leading-[0.95]">
            <span class="bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600 drop-shadow-2xl">
              {{ ts.t().landing.headline_1 }}<br>{{ ts.t().landing.headline_2 }}
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-light">
            {{ ts.t().landing.subheadline }}
          </p>

          <!-- CTAs -->
          <div class="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <a routerLink="/auth/login" class="w-full md:w-auto px-10 py-4 bg-white text-black rounded-sm font-bold transition-all shadow-[0_0_25px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)] hover:bg-zinc-200 flex items-center justify-center gap-3 group">
              <span>{{ ts.t().landing.cta_primary }}</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
            
            <button class="w-full md:w-auto px-10 py-4 bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-white/50 rounded-sm font-medium transition-all group relative overflow-hidden">
              <span class="relative z-10">{{ ts.t().landing.cta_secondary }}</span>
              <div class="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      <!-- BENTO GRID (Tactical Features) -->
      <section class="relative z-10 py-32 px-6 border-t border-zinc-900 bg-zinc-950/30">
        <div class="max-w-7xl mx-auto">
          
          <div class="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 class="text-4xl font-serif text-white mb-4">{{ ts.t().landing.tactical_title }}</h2>
              <p class="text-zinc-500 max-w-lg">{{ ts.t().landing.tactical_desc }}</p>
            </div>
            <div class="h-px bg-zinc-800 flex-1 ml-10 hidden md:block opacity-50"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
            
            <!-- Card 1: Encryption (Wide) -->
            <div class="md:col-span-2 group relative p-10 rounded-xl bg-zinc-900/20 border border-zinc-800 hover:border-zinc-500/30 transition-all duration-500 overflow-hidden flex flex-col justify-between hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.07)]">
              <!-- Hover Gradient Effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div class="relative z-10">
                <div class="w-14 h-14 rounded-lg bg-black border border-zinc-800 flex items-center justify-center mb-8 group-hover:border-zinc-400 transition-colors duration-500 shadow-2xl">
                  <svg class="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h3 class="text-3xl font-serif text-zinc-100 mb-3 group-hover:text-white transition-colors">{{ ts.t().landing.card_1_title }}</h3>
                <p class="text-zinc-500 text-sm leading-relaxed max-w-md group-hover:text-zinc-400 transition-colors">
                  {{ ts.t().landing.card_1_desc }}
                </p>
              </div>

              <!-- Terminal Visual (Fake UI) -->
              <div class="mt-8 p-5 bg-black/80 border border-zinc-800/50 rounded font-mono text-[10px] text-zinc-500 w-3/4 group-hover:scale-[1.02] group-hover:border-zinc-600 transition-all duration-500 shadow-xl">
                <div class="flex gap-1.5 mb-3 opacity-30">
                  <div class="w-2 h-2 rounded-full bg-zinc-500"></div><div class="w-2 h-2 rounded-full bg-zinc-500"></div><div class="w-2 h-2 rounded-full bg-zinc-500"></div>
                </div>
                <span class="text-zinc-600">$</span> openssl enc -aes-256-gcm -in secret.txt<br>
                <span class="text-zinc-600">></span> <span class="text-white animate-pulse">ENCRYPTING... 100%</span>
              </div>
            </div>

            <!-- Card 2: Zero Sight (Square) -->
            <div class="group relative p-10 rounded-xl bg-zinc-900/20 border border-zinc-800 hover:border-zinc-500/30 transition-all duration-500 overflow-hidden flex flex-col hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.07)]">
               <div class="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               
              <div class="relative z-10 h-full flex flex-col">
                 <div class="w-14 h-14 rounded-lg bg-black border border-zinc-800 flex items-center justify-center mb-auto group-hover:border-zinc-400 transition-colors duration-500 shadow-2xl">
                   <svg class="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                 </div>
                 <div>
                   <h3 class="text-2xl font-serif text-zinc-100 mb-3 group-hover:text-white">{{ ts.t().landing.card_2_title }}</h3>
                   <p class="text-zinc-500 text-sm group-hover:text-zinc-400 leading-relaxed">
                     {{ ts.t().landing.card_2_desc }}
                   </p>
                 </div>
              </div>
            </div>

            <!-- Card 3: Code (Square) -->
            <div class="group relative p-10 rounded-xl bg-zinc-900/20 border border-zinc-800 hover:border-zinc-500/30 transition-all duration-500 overflow-hidden flex flex-col hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.07)]">
              <div class="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div class="relative z-10 h-full flex flex-col">
                <div class="w-14 h-14 rounded-lg bg-black border border-zinc-800 flex items-center justify-center mb-auto group-hover:border-zinc-400 transition-colors duration-500 shadow-2xl">
                   <svg class="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                </div>
                <div>
                  <h3 class="text-2xl font-serif text-zinc-100 mb-3 group-hover:text-white">{{ ts.t().landing.card_3_title }}</h3>
                  <p class="text-zinc-500 text-sm group-hover:text-zinc-400 leading-relaxed">
                     {{ ts.t().landing.card_3_desc }}
                  </p>
                </div>
              </div>
            </div>

             <!-- Card 4: Swiss (Wide) -->
            <div class="md:col-span-2 group relative p-10 rounded-xl bg-zinc-900/20 border border-zinc-800 hover:border-zinc-500/30 transition-all duration-500 overflow-hidden flex flex-col justify-center hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.07)]">
               <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
               <div class="relative z-10 flex items-center justify-between">
                 <div>
                    <h3 class="text-2xl font-serif text-zinc-100 mb-3 group-hover:text-white">{{ ts.t().landing.card_4_title }}</h3>
                    <p class="text-zinc-500 text-sm max-w-sm group-hover:text-zinc-400">
                      {{ ts.t().landing.card_4_desc }}
                    </p>
                 </div>
                 <div class="hidden md:flex w-24 h-24 rounded-full border border-zinc-800 items-center justify-center group-hover:border-zinc-500/50 transition-colors bg-black shadow-2xl">
                    <span class="text-2xl font-serif text-zinc-600 group-hover:text-white transition-colors">CH</span>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="py-12 border-t border-zinc-900 bg-black text-center">
        <div class="flex items-center justify-center gap-2 text-zinc-700 text-[10px] font-mono uppercase tracking-[0.3em]">
          <span>© 2024 Kryptos</span>
          <span class="w-1 h-1 rounded-full bg-zinc-700"></span>
          <span>Classified</span>
        </div>
      </footer>
    </div>
  `
})
export class LandingPageComponent {
  ts = inject(TranslationService);
  showLangMenu = signal(false);

  languages = [
    { code: 'en', flag: 'https://flagcdn.com/w40/us.png', label: 'English' },
    { code: 'pt', flag: 'https://flagcdn.com/w40/br.png', label: 'Português' },
    { code: 'es', flag: 'https://flagcdn.com/w40/es.png', label: 'Español' },
    { code: 'fr', flag: 'https://flagcdn.com/w40/fr.png', label: 'Français' }
  ] as const;

  // Now using activeLang signal directly for reactivity
  currentLang = this.ts.activeLang;
  
  currentFlag = computed(() => 
    this.languages.find(l => l.code === this.currentLang())?.flag
  );

  setLang(lang: any) {
    this.ts.setLang(lang);
    this.showLangMenu.set(false);
  }

  toggleLangMenu() {
    this.showLangMenu.update(v => !v);
  }
}
