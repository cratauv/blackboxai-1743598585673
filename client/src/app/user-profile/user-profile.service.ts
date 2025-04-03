import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  preferences?: any;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private http = inject(HttpClient);

  getUserProfile(userId: string) {
    return this.http.get<UserProfile>(`/api/users/${userId}/profile`);
  }

  updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    return this.http.patch<UserProfile>(`/api/users/${userId}/profile`, updates);
  }

  changePassword(userId: string, currentPassword: string, newPassword: string) {
    return this.http.post(`/api/users/${userId}/change-password`, {
      currentPassword,
      newPassword
    });
  }
}