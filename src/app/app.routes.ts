import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_ADMIN' },
    loadComponent: () =>
      import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'rh',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_RH' },
    loadComponent: () =>
      import('./features/rh/dashboard/rh-dashboard.component').then(m => m.RhDashboardComponent)
  },
  {
    path: 'stagiaire',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_STAGIAIRE' },
    loadComponent: () =>
      import('./features/stagiaire/dashboard/stagiaire-dashboard.component').then(m => m.StagiaireDashboardComponent)
  },
  { path: '**', redirectTo: '/login' }
];