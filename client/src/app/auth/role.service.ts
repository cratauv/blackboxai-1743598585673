import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

type UserRole = 'admin' | 'manager' | 'customer';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private authService = inject(AuthService);

  currentUserRole$ = this.authService.currentUser$.pipe(
    map(user => user?.role as UserRole)
  );

  hasRole(requiredRole: UserRole) {
    return this.currentUserRole$.pipe(
      map(userRole => userRole === requiredRole)
    );
  }

  hasAnyRole(requiredRoles: UserRole[]) {
    return this.currentUserRole$.pipe(
      map(userRole => requiredRoles.includes(userRole))
    );
  }
}