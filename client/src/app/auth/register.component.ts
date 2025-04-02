import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <div class="auth-container">
      <h2>Create Account</h2>
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" formControlName="name">
          <div *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" class="error">
            Name is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email">
          <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error">
            Valid email is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" formControlName="password">
          <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error">
            Password must be at least 8 characters
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
    .auth-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 8px;
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
    .error {
      color: red;
      font-size: 0.8rem;
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
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(email!, password!, name!)
        .subscribe({
          next: () => this.router.navigate(['/']),
          error: (err) => console.error('Registration failed', err)
        });
    }
  }

  loginWithGoogle() {
    this.authService.socialLogin('google');
  }

  loginWithFacebook() {
    this.authService.socialLogin('facebook');
  }
}