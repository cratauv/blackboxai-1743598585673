import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { RoleService } from './role.service';

export const roleGuard: (allowedRoles: string[]) => CanActivateFn = (allowedRoles) => {
  return () => {
    const roleService = inject(RoleService);
    const router = inject(Router);

    return roleService.hasAnyRole(allowedRoles).pipe(
      take(1),
      map(hasRole => hasRole || router.createUrlTree(['/unauthorized']))
    );
  };
};