import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <div class="reset-password-container">
      <h2>Reset Your Password</h2>
      
      <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" *ngIf="tokenValid">
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            formControlName="newPassword"
            [class.invalid]="newPassword.invalid && (newPassword.dirty || newPassword.touched)"
          >
          <div *ngIf="newPassword.invalid && (newPassword.dirty || newPassword.touched)" class="error-message">
            <span *ngIf="newPassword.errors?.['required']">Password is required</span>
            <span *ngIf="newPassword.errors?.['minlength']">
              Password must be at least 8 characters
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            formControlName="confirmPassword"
            [class.invalid]="resetForm.hasError('mismatch')"
          >
          <div *ngIf="resetForm.hasError('mismatch')" class="error-message">
            Passwords do not match
          </div>
        </div>

        <button type="submit" [disabled]="resetForm.invalid || isLoading" class="submit-button">
          <span *ngIf="!isLoading">Reset Password</span>
          <span *ngIf="isLoading">Resetting...</span>
        </button>

        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <div *ngIf="!tokenValid" class="invalid-token">
        <p>The password reset link is invalid or has expired.</p>
        <p>Please request a new <a routerLink="/forgot-password">password reset</a>.</p>
      </div>
    </div>
  `,
  styles: [`
    .reset-password-container {
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
export class ResetPasswordComponent implements OnInit {
  resetForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  token = '';
  tokenValid = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  get newPassword() { return this.resetForm.get('newPassword')!; }
  get confirmPassword() { return this.resetForm.get('confirmPassword')!; }

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    this.validateToken();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  validateToken() {
    this.authService.validateResetToken(this.token).subscribe({
      next: (valid) => {
        this.tokenValid = valid;
        if (!valid) {
          this.errorMessage = 'Invalid or expired token';
        }
      },
      error: () => {
        this.tokenValid = false;
        this.errorMessage = 'Error validating token';
      }
    });
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.tokenValid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword(
      this.token,
      this.newPassword.value!
    ).subscribe({
      next: () => {
        this.successMessage = 'Password reset successfully!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to reset password. Please try again.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}