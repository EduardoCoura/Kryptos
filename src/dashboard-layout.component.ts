
import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslationService, Lang } from './services/translation.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex h-screen bg-black text-zinc-300 font-sans overflow-hidden">
      
      <!-- Sidebar -->
      <aside class="w-64 bg-black/60 backdrop-blur-md border-r border-zinc-800 flex flex-col justify-between hidden md:flex">
        
        <!-- Sidebar Header -->
        <div class="p-8">
           <div class="flex items-center gap-2 mb-1">
             <div class="w-4 h-4 border border-white/50 rotate-45 flex items-center justify-center">
               <div class="w-1.5 h-1.5 bg-white"></div>
             </div>
             <h2 class="text-lg font-serif text-white tracking-tight font-bold">Kryptos</h2>
           </div>
           <div class="flex items-center gap-2 pl-1">
             <div class="w-1 h-1 rounded-full bg-zinc-500"></div>
             <span class="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Vault Secure</span>
           </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-2">
           <a 
            routerLink="/dashboard" 
            routerLinkActive="bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all rounded-sm group border border-transparent"
          >
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span class="tracking-wide">Overview</span>
          </a>

          <a 
            routerLink="/dashboard/text" 
            routerLinkActive="bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
            class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all rounded-sm group border border-transparent"
          >
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            <span class="tracking-wide">{{ ts.t().dashboard.nav_text }}</span>
          </a>

          <a 
            routerLink="/dashboard/files" 
            routerLinkActive="bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all rounded-sm group border border-transparent"
          >
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span class="tracking-wide">{{ ts.t().dashboard.nav_files }}</span>
          </a>
        </nav>

        <!-- User Profile & Lang (Bottom Sidebar) -->
        <div class="p-6 border-t border-zinc-900">
           
           <!-- Flag Dropdown Switcher (Sidebar version: Opens Upwards) -->
           <div class="flex justify-center mb-6 relative">
              <button (click)="toggleLangMenu()" class="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all w-full justify-between">
                <div class="flex items-center gap-2">
                  <img [src]="currentFlag()" class="w-5 h-3.5 object-cover rounded-[1px] shadow-sm opacity-80" alt="Current Language">
                  <span class="text-[10px] font-mono text-zinc-400">{{ currentLang() | uppercase }}</span>
                </div>
                <svg class="w-3 h-3 text-zinc-600 transition-transform duration-300" [class.rotate-180]="showLangMenu()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>

              @if (showLangMenu()) {
                <div class="absolute bottom-full left-0 right-0 mb-2 bg-black border border-zinc-800 rounded-sm shadow-2xl py-1 z-50 animate-fade-in-up">
                  @for (lang of languages; track lang.code) {
                    <button 
                      (click)="setLang(lang.code)" 
                      class="w-full text-left px-3 py-2 hover:bg-zinc-900 flex items-center gap-3 text-xs text-zinc-400 hover:text-white transition-colors group border-l-2 border-transparent hover:border-emerald-500"
                    >
                      <img [src]="lang.flag" class="w-4 h-3 object-cover rounded-[1px] opacity-70 group-hover:opacity-100">
                      <span class="font-mono uppercase tracking-wider text-[10px]">{{ lang.label }}</span>
                    </button>
                  }
                </div>
              }
           </div>

          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-sm bg-zinc-950 border border-zinc-800 flex items-center justify-center">
              <span class="font-mono text-xs text-white">07</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-medium text-zinc-300">{{ ts.t().dashboard.status }}</span>
              <button (click)="logout()" class="text-[10px] text-zinc-600 hover:text-white text-left transition-colors uppercase tracking-wider">{{ ts.t().dashboard.logout }}</button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col min-w-0 bg-noise bg-black relative">
        <!-- Subtle Grid Background -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20"></div>

        <!-- Top Bar -->
        <header class="h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-sm flex items-center justify-between px-8 relative z-20">
           <span class="text-xs font-mono text-zinc-600 uppercase tracking-widest hidden md:block">/// {{ ts.t().dashboard.header_status }}</span>
           
           <!-- Mobile Menu Button (Visible only on small screens) -->
           <div class="md:hidden text-white font-serif">Kryptos</div>

           <div class="flex items-center gap-6">
             <div class="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900/50 border border-zinc-800">
               <span class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"></span>
               <span class="text-[10px] text-zinc-500 font-mono">SERVER_ZRH_01</span>
             </div>
           </div>
        </header>

        <!-- Router Outlet Container -->
        <div class="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
           <router-outlet></router-outlet>
        </div>

      </main>
    </div>
  `
})
export class DashboardLayoutComponent {
  private router = inject(Router);
  ts = inject(TranslationService);
  showLangMenu = signal(false);

  languages = [
    { code: 'en', flag: 'https://flagcdn.com/w40/us.png', label: 'English' },
    { code: 'pt', flag: 'https://flagcdn.com/w40/br.png', label: 'Português' },
    { code: 'es', flag: 'https://flagcdn.com/w40/es.png', label: 'Español' },
    { code: 'fr', flag: 'https://flagcdn.com/w40/fr.png', label: 'Français' }
  ] as const;

  // Now using activeLang signal directly
  currentLang = this.ts.activeLang;
  
  currentFlag = computed(() => 
    this.languages.find(l => l.code === this.currentLang())?.flag
  );

  logout() {
    localStorage.removeItem('kryptos_token');
    this.router.navigate(['/']);
  }

  setLang(lang: any) {
    this.ts.setLang(lang);
    this.showLangMenu.set(false);
  }

  toggleLangMenu() {
    this.showLangMenu.update(v => !v);
  }
}
