import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <div class="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset link</p>

      <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            [class.invalid]="email.invalid && (email.dirty || email.touched)"
          >
          <div *ngIf="email.invalid && (email.dirty || email.touched)" class="error-message">
            <span *ngIf="email.errors?.['required']">Email is required</span>
            <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
          </div>
        </div>

        <button type="submit" [disabled]="forgotForm.invalid || isLoading" class="submit-button">
          <span *ngIf="!isLoading">Send Reset Link</span>
          <span *ngIf="isLoading">Sending...</span>
        </button>

        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <p class="back-to-login">
        Remember your password? <a routerLink="/login">Sign in</a>
      </p>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    /* Additional styles... */
  `]
})
export class ForgotPasswordComponent {
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  get email() { return this.forgotForm.get('email')!; }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.requestPasswordReset(this.email.value!)
      .subscribe({
        next: () => {
          this.successMessage = 'Password reset link sent to your email';
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to send reset link. Please try again.';
          this.isLoading = false;
          console.error(err);
        }
      });
  }
}