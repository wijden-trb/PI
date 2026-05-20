import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {

  registerForm: FormGroup;
  loginForm: FormGroup;

  successMessage = '';
  errorMessage = '';

  showModal = false;
  isLoginMode = true;

  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    // REGISTER FORM
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['STUDENT', Validators.required],
      skills: [''],
      cvUrl: ['']
    });

    // LOGIN FORM
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // =========================
  // FILE SELECT
  // =========================
  onFileSelected(event: any): void {

    if (event.target.files.length > 0) {

      this.selectedFile = event.target.files[0];

    }
  }

  // =========================
  // MODAL
  // =========================
  openLogin(): void {

    this.showModal = true;
    this.isLoginMode = true;

    this.resetMessages();
  }

  openRegister(): void {

    this.showModal = true;
    this.isLoginMode = false;

    this.resetMessages();
  }

  closeModal(): void {

    this.showModal = false;

    this.resetMessages();
  }

  resetMessages(): void {

    this.successMessage = '';
    this.errorMessage = '';
  }

  // =========================
  // LOGIN
  // =========================
  onSubmitLogin(): void {

    if (this.loginForm.invalid) return;

    this.userService.login(this.loginForm.value).subscribe({

      next: (res: any) => {

        console.log('LOGIN RESPONSE:', res);

        // SAVE TOKEN
        localStorage.setItem('token', res.token);

        // SAVE USER
        localStorage.setItem(
          'currentUser',
          JSON.stringify(res.user)
        );

        this.successMessage = 'Login successful!';
        this.errorMessage = '';

        setTimeout(() => {

          this.router.navigate(['/profile']);

          this.closeModal();

        }, 800);
      },

      error: (err) => {

        console.error(err);

        this.successMessage = '';

        this.errorMessage =
          err.error || 'Login failed';
      }

    });
  }

  // =========================
  // REGISTER
  // =========================
  onSubmitRegister(): void {

    if (this.registerForm.invalid) {

      this.errorMessage =
        'Please fill all required fields';

      return;
    }

    // IF FILE EXISTS
    if (this.selectedFile) {

      const formData = new FormData();

      formData.append('file', this.selectedFile);

      this.userService.uploadCv(formData).subscribe({

        next: (res: any) => {

          console.log('UPLOAD RESPONSE:', res);

          // SAVE CV URL
          this.registerForm.patchValue({
            cvUrl: res.secure_url
          });

          // REGISTER USER
          this.registerUser();
        },

        error: (err) => {

          console.error(err);

          this.errorMessage =
            'CV upload failed';
        }

      });

    } else {

      this.registerUser();
    }
  }
  loginWithLinkedin(): void {

    window.location.href =
      'http://localhost:8081/oauth2/authorization/linkedin';

  }

  // =========================
  // FINAL REGISTER METHOD
  // =========================
  registerUser(): void {

    console.log('REGISTER DATA:',
      this.registerForm.value
    );

    this.userService.createUser(
      this.registerForm.value
    ).subscribe({

      next: () => {

        // AUTO LOGIN AFTER REGISTER
        this.userService.login({

          email: this.registerForm.value.email,
          password: this.registerForm.value.password

        }).subscribe({

          next: (res: any) => {

            console.log(
              'AUTO LOGIN RESPONSE:',
              res
            );

            // SAVE TOKEN
            localStorage.setItem(
              'token',
              res.token
            );

            // SAVE USER
            localStorage.setItem(
              'currentUser',
              JSON.stringify(res.user)
            );

            this.successMessage =
              'Registration successful!';

            this.errorMessage = '';

            // RESET FORM
            this.registerForm.reset({
              role: 'STUDENT'
            });

            setTimeout(() => {

              this.router.navigate(['/profile']);

              this.closeModal();

            }, 800);

          },

          error: (err) => {

            console.error(err);

            this.errorMessage =
              'Auto login failed';
          }

        });

      },

      error: (error) => {

        console.error(error);

        this.successMessage = '';

        this.errorMessage =
          error.error || 'Registration failed';
      }

    });
  }
}
