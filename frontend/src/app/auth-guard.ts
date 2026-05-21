import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  canActivate(): boolean {
    // localStorage does not exist in SSR (Node.js) — must guard
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    // Your login saves as 'token' — keep consistent with login component
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    } else {
      this.router.navigate(['/login-register']);
      return false;
    }
  }
}
