import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';

interface User {
  email: string;
  name: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(email: string, password: string, rememberMe: boolean = false): Observable<User> {
    return this.http.post<User>('/api/auth/login', { email, password }).pipe(
      tap(user => {
        if (rememberMe) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  loginWithGoogle(): void {
    window.location.href = '/api/auth/google';
  }

  loginWithFacebook(): void {
    window.location.href = '/api/auth/facebook';
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        return !!user?.email;
      } catch {
        return false;
      }
    }
    return this.currentUserSubject.value !== null;
  }

  validateResetToken(token: string): Observable<{ valid: boolean, email?: string }> {
    return this.http.post<{ valid: boolean, email?: string }>('/api/auth/validate-reset-token', { token }).pipe(
      catchError((error: any) => {
        console.error('Token validation failed', error);
        return of({ valid: false });
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{ success: boolean, message?: string }> {
    return this.http.post<{ success: boolean, message?: string }>(
      '/api/auth/reset-password', 
      { token, newPassword }
    ).pipe(
      catchError((error: unknown) => {
        console.error('Password reset failed', error);
        const err = error as {error?: {message?: string}};
        return of({ 
          success: false,
          message: err?.error?.message || 'Password reset failed'
        });
      })
    );
  }
}