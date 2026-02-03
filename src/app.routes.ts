
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/dashboard-overview.component').then(m => m.DashboardOverviewComponent)
      },
      {
        path: 'text',
        loadComponent: () => import('./components/text-encrypt.component').then(m => m.TextEncryptComponent)
      },
      {
        path: 'files',
        loadComponent: () => import('./components/file-encrypt.component').then(m => m.FileEncryptComponent)
      }
    ]
  }
];
