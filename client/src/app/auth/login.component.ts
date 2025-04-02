import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <div class="login-container">
      <h2 class="login-title">Welcome Back</h2>
      <p class="login-subtitle">Sign in to your account</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="Enter your email"
            [class.invalid]="email.invalid && (email.dirty || email.touched)"
          >
          <div *ngIf="email.invalid && (email.dirty || email.touched)" class="error-message">
            <span *ngIf="email.errors?.['required']">Email is required</span>
            <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            placeholder="Enter your password"
            [class.invalid]="password.invalid && (password.dirty || password.touched)"
          >
          <div *ngIf="password.invalid && (password.dirty || password.touched)" class="error-message">
            <span *ngIf="password.errors?.['required']">Password is required</span>
            <span *ngIf="password.errors?.['minlength']">
              Password must be at least 8 characters
            </span>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" formControlName="rememberMe">
            Remember me
          </label>
          <a routerLink="/forgot-password" class="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" class="login-button" [disabled]="loginForm.invalid || isLoading">
          <span *ngIf="!isLoading">Sign In</span>
          <span *ngIf="isLoading">Signing In...</span>
        </button>

        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>

      <div class="social-login">
        <p class="divider">or continue with</p>
        <div class="social-buttons">
          <button (click)="loginWithGoogle()" class="social-button google">
            <i class="fab fa-google"></i> Google
          </button>
          <button (click)="loginWithFacebook()" class="social-button facebook">
            <i class="fab fa-facebook-f"></i> Facebook
          </button>
        </div>
      </div>

      <p class="signup-link">
        Don't have an account? <a routerLink="/register">Sign up</a>
      </p>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .login-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .login-subtitle {
      color: #666;
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input.invalid {
      border-color: #e74c3c;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .forgot-password {
      color: #3498db;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .login-button {
      width: 100%;
      padding: 0.75rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .login-button:hover {
      background-color: #2980b9;
    }

    .login-button:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .social-login {
      margin: 2rem 0;
    }

    .divider {
      text-align: center;
      position: relative;
      margin: 1.5rem 0;
      color: #95a5a6;
    }

    .divider::before,
    .divider::after {
      content: "";
      position: absolute;
      top: 50%;
      width: 45%;
      height: 1px;
      background-color: #ddd;
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .social-buttons {
      display: flex;
      gap: 1rem;
    }

    .social-button {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .social-button:hover {
      background-color: #f8f9fa;
    }

    .social-button.google {
      color: #db4437;
    }

    .social-button.facebook {
      color: #4267b2;
    }

    .signup-link {
      text-align: center;
      color: #666;
    }

    .signup-link a {
      color: #3498db;
      text-decoration: none;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl(false)
  });

  isLoading = false;
  errorMessage = '';

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password, rememberMe } = this.loginForm.value;
      await this.authService.login(email!, password!, rememberMe!);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage = 'Invalid email or password';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }
}