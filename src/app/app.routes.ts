import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
    },
    {
      path: 'success',
      loadComponent: () => import('./success/success.component').then(c => c.SuccessComponent),
    },
    {
      path: 'register',
      loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent),
    },
  ];