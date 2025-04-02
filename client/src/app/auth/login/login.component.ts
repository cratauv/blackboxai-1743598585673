import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Sign In</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email" required>
          <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            Valid email is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" formControlName="password" required>
          <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            Password is required
          </div>
        </div>

        <div class="form-options">
          <label>
            <input type="checkbox" formControlName="rememberMe"> Remember me
          </label>
          <a routerLink="/forgot-password">Forgot password?</a>
        </div>

        <button type="submit" [disabled]="loginForm.invalid">Sign In</button>
      </form>

      <div class="social-login">
        <button (click)="loginWithGoogle()">Continue with Google</button>
        <button (click)="loginWithFacebook()">Continue with Facebook</button>
      </div>

      <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
    </div>
  `,
  styles: [`
    .login-container {
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
    .form-options {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0;
    }
    button {
      width: 100%;
      padding: 0.75rem;
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
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
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