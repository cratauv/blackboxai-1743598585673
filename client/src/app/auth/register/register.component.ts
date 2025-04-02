import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2>Create Account</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" formControlName="name" required>
          <div *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
            Name is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email" required>
          <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
            Valid email is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" formControlName="password" required>
          <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            Password must be at least 8 characters
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" formControlName="confirmPassword" required>
          <div *ngIf="registerForm.hasError('mismatch')">
            Passwords must match
          </div>
        </div>

        <button type="submit" [disabled]="registerForm.invalid">Register</button>
      </form>

      <div class="social-login">
        <button (click)="loginWithGoogle()">Continue with Google</button>
        <button (click)="loginWithFacebook()">Continue with Facebook</button>
      </div>

      <p>Already have an account? <a routerLink="/login">Sign in</a></p>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      margin-top: 1rem;
    }
    .social-login {
      margin: 1.5rem 0;
    }
    .social-login button {
      background: #fff;
      border: 1px solid #ddd;
      margin-bottom: 0.5rem;
    }
  `]
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  passwordMatchValidator(form: any) {
    return form.get('password').value === form.get('confirmPassword').value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name, email, password).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error(err)
      });
    }
  }

  loginWithGoogle() {
    // Implement Google OAuth
  }

  loginWithFacebook() {
    // Implement Facebook OAuth
  }
}