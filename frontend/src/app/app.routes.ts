import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';  // ← capital A, class import

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login-register/login-register.component').then(
        m => m.LoginRegisterComponent
      )
  },
  {
    path: 'oauth-success',
    loadComponent: () =>
      import('./oauth-success/oauth-success').then(m => m.OauthSuccess)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]   // ← capital A
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./chat/chat.component').then(m => m.ChatComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
