import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Get current user profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  // Update user profile
  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, userData);
  }

  // Get all users (admin only)
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Update user (admin only)
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }

  // Delete user (admin only)
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}