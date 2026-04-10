import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true, // ✅ important for standalone components
  imports: [CommonModule, FormsModule], // ✅ add these
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    skills: '',
    cvUrl: ''
  };

  isDarkMode = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.profile = JSON.parse(storedUser);
    }

    const theme = localStorage.getItem('themePreference');
    this.isDarkMode = theme === 'dark';
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }

  onSubmit(): void {
    if (!this.profile.firstName || !this.profile.lastName || !this.profile.email) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.newPassword || this.confirmPassword || this.currentPassword) {
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        alert('Please fill all password fields to change password.');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert('New passwords do not match.');
        return;
      }
    }

    const updatedData: User = {
      ...this.profile,
      password: this.newPassword ? this.newPassword : this.profile.password
    };

    this.userService.updateUser(this.profile.id!, updatedData).subscribe({
      next: (updatedUser) => {
        alert('Profile updated successfully.');
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        alert(err.error?.error || 'Error updating profile.');
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('themePreference', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('themePreference', 'light');
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login-register']);
  }
}
