import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ add these
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['STUDENT', Validators.required],
      skills: [''],
      cvUrl: ['']
    });
  }

  onSubmitRegister(): void {
    if (this.registerForm.invalid) return;

    const formData = this.registerForm.value;

    this.userService.createUser(formData).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.registerForm.reset({ role: 'STUDENT' });

        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 3000);
      },
      error: (error) => {
        this.successMessage = '';
        this.errorMessage = error.error?.message || 'Registration failed';
      }
    });
  }
}
