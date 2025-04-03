import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: 'active' | 'suspended';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private http = inject(HttpClient);

  getAllUsers() {
    return this.http.get<User[]>('/api/admin/users');
  }

  updateUserRoles(userId: string, roles: string[]) {
    return this.http.patch<User>(`/api/admin/users/${userId}/roles`, { roles });
  }

  updateUserStatus(userId: string, status: 'active' | 'suspended') {
    return this.http.patch<User>(`/api/admin/users/${userId}/status`, { status });
  }
}