import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

//   console.log("ena fi auth gard",authService.isLoggedIn())
//   if (authService.isLoggedIn()) {
//     return true;
//   } else {
//     router.navigate(['/login']);
//     return false;
//   }
 return authService.checkSession().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        return router.parseUrl('/login'); // redirect if not logged in
      }
    }),
    catchError(() => {
      return of(router.parseUrl('/login'));
    })
  );
};