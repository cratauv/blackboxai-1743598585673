import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <h2>Your Profile</h2>
      
      <form (ngSubmit)="onSubmit()" *ngIf="profile">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" [(ngModel)]="profile.name" name="name" required>
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="profile.email" name="email" required>
        </div>
        
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" [(ngModel)]="profile.phone" name="phone" required>
        </div>
        
        <div class="form-group">
          <label>Address</label>
          <textarea [(ngModel)]="profile.address" name="address"></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" [disabled]="!isDirty()">Save Changes</button>
          <button type="button" (click)="resetForm()" [disabled]="!isDirty()">Cancel</button>
        </div>
      </form>
      
      <div *ngIf="loading" class="loading">Loading profile...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      <div *ngIf="success" class="success">Profile updated successfully!</div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1.5rem;
      border: 1px solid #eee;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    .success {
      color: #2e7d32;
      margin-top: 1rem;
    }
  `]
})
export class UserProfileComponent implements OnInit {
  profile: any = null;
  originalProfile: any = null;
  loading = false;
  error = '';
  success = false;

  constructor(private profileService: UserProfileService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getUserProfile('current-user-id').subscribe({
      next: (profile) => {
        this.profile = { ...profile };
        this.originalProfile = { ...profile };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  isDirty() {
    return JSON.stringify(this.profile) !== JSON.stringify(this.originalProfile);
  }

  resetForm() {
    this.profile = { ...this.originalProfile };
    this.success = false;
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = false;
    
    this.profileService.updateUserProfile('current-user-id', this.profile).subscribe({
      next: (updatedProfile) => {
        this.profile = { ...updatedProfile };
        this.originalProfile = { ...updatedProfile };
        this.loading = false;
        this.success = true;
      },
      error: (err) => {
        this.error = 'Failed to update profile';
        this.loading = false;
      }
    });
  }
}