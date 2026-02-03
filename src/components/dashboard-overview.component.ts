
import { Component, signal, inject, DestroyRef, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h1 class="text-3xl font-serif text-white tracking-tight mb-2">{{ ts.t().dashboard_overview.welcome }}</h1>
          <div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ ts.t().dashboard_overview.system_secure }}
          </div>
        </div>
        
        <!-- Terminal Clock -->
        <div class="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-sm">
           <span class="font-mono text-xs text-zinc-400">
             {{ currentTime() | date:'yyyy-MM-dd' }} <span class="text-zinc-600">|</span> <span class="text-white">{{ currentTime() | date:'HH:mm:ss' }}</span>
           </span>
        </div>
      </div>

      <!-- KPI GRID -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Card 1 -->
        <div class="relative group p-6 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 rounded-sm overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{{ ts.t().dashboard_overview.total_enc }}</p>
          <div class="flex items-end gap-3">
             <span class="text-4xl font-serif text-white">1,204</span>
             <span class="text-xs font-mono text-emerald-500 mb-1.5">▲ 12%</span>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="relative group p-6 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 rounded-sm overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{{ ts.t().dashboard_overview.data_prot }}</p>
          <div class="flex items-end gap-3">
             <span class="text-4xl font-serif text-white">4.5 <span class="text-lg text-zinc-500">GB</span></span>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="relative group p-6 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 rounded-sm overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{{ ts.t().dashboard_overview.threats }}</p>
          <div class="flex items-end gap-3">
             <span class="text-4xl font-serif text-white">0</span>
             <span class="text-xs font-mono text-emerald-500 mb-1.5">{{ ts.t().dashboard_overview.secure_badge }}</span>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT ROW -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        
        <!-- Chart Section (2/3) -->
        <div class="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-sm p-6 flex flex-col relative overflow-hidden group">
           <div class="flex justify-between items-start mb-6 relative z-10">
             <h3 class="text-sm font-medium text-zinc-300">{{ ts.t().dashboard_overview.activity_title }}</h3>
             <div class="flex gap-2">
               <span class="w-2 h-2 rounded-full bg-zinc-700"></span>
               <span class="w-2 h-2 rounded-full bg-zinc-800"></span>
             </div>
           </div>

           <!-- CSS Bar Chart -->
           <div class="flex-1 flex items-end justify-between gap-1 md:gap-3 relative z-10">
              @for (val of chartData(); track $index) {
                <div class="w-full bg-zinc-800/50 hover:bg-zinc-600 transition-all duration-500 rounded-t-sm relative group/bar"
                     [style.height.%]="val">
                     <!-- Tooltip -->
                     <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded font-mono border border-zinc-700 pointer-events-none whitespace-nowrap z-20">
                       {{ val }} {{ ts.t().dashboard_overview.reqs }}
                     </div>
                </div>
              }
           </div>

           <!-- Grid Lines Background -->
           <div class="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_20%]"></div>
        </div>

        <!-- Logs Section (1/3) -->
        <div class="bg-zinc-900/40 border border-zinc-800 rounded-sm p-0 flex flex-col overflow-hidden relative">
          <div class="p-4 border-b border-zinc-800 bg-zinc-950/30 flex justify-between items-center">
            <h3 class="text-sm font-medium text-zinc-300">{{ ts.t().dashboard_overview.logs_title }}</h3>
            <span class="text-[10px] text-zinc-500 font-mono">{{ ts.t().dashboard_overview.logs_live }}</span>
          </div>
          
          <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            @for (log of activityLogs(); track log.id) {
              <div class="flex items-center justify-between p-3 hover:bg-white/5 rounded-sm group transition-colors cursor-default">
                <div class="flex flex-col gap-1">
                  <span class="font-mono text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                    ID #{{ log.id }}
                  </span>
                  <span class="text-[10px] text-zinc-600 uppercase tracking-wider">{{ log.action }}</span>
                </div>
                <span class="font-mono text-[10px] text-zinc-500">{{ log.time }}</span>
              </div>
            }
          </div>
        </div>

      </div>

      <!-- FLOATING ACTION -->
      <div class="fixed bottom-8 right-8 z-50">
        <a routerLink="/dashboard/text" class="flex items-center gap-3 px-6 py-4 bg-white text-black font-bold rounded-sm shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:scale-105 hover:bg-zinc-200 transition-all group">
          <span class="uppercase font-mono text-xs tracking-widest">{{ ts.t().dashboard_overview.quick_action }}</span>
          <svg class="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </a>
      </div>

    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
  `]
})
export class DashboardOverviewComponent {
  ts = inject(TranslationService);
  currentTime = signal(new Date());

  // Mock Data for Logs
  activityLogs = signal([
    { id: 'X90-ALPHA-22', action: 'AES-256 Text', time: '2m ago' },
    { id: 'B44-DELTA-01', action: 'File Upload', time: '14m ago' },
    { id: 'C12-OMEGA-99', action: 'Decryption', time: '1h ago' },
    { id: 'A01-SIGMA-55', action: 'Key Gen', time: '3h ago' },
    { id: 'X90-ALPHA-23', action: 'AES-256 Text', time: '5h ago' },
    { id: 'F55-BETA-12',  action: 'File Upload', time: '1d ago' },
  ]);

  // Mock Data for Chart (Random fake heights)
  chartData = signal([30, 45, 25, 60, 75, 50, 80, 40, 55, 90, 65, 45, 30, 20, 50]);

  constructor() {
    const timer = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);

    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
