import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oauth-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oauth-success.html',
  styleUrls: ['./oauth-success.css']
})
export class OauthSuccess implements OnInit {

  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token  = params['token'];
      const userId = params['userId'];

      if (token) {
        // Store the JWT — same key your auth.interceptor.ts reads from
        localStorage.setItem('jwt_token', token);

        // Optionally store userId for quick access
        if (userId) {
          localStorage.setItem('userId', userId);
        }

        // Navigate to profile
        this.router.navigate(['/profile']);

      } else if (params['error']) {
        // Backend sent an error param
        this.errorMessage = 'LinkedIn login failed: ' + params['error'];
        setTimeout(() => this.router.navigate(['/login']), 3000);

      } else {
        // No token and no error — something went wrong
        this.errorMessage = 'Authentication failed. Redirecting...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    });
  }
}
