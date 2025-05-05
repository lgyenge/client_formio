import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormioAuthService } from '@formio/angular/auth';

export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  const auth: FormioAuthService = inject(FormioAuthService);
  const router: Router = inject(Router);

  return auth.ready.then(() => {
    console.log('authGuard ready', auth.authenticated);
    if (auth.authenticated) {
      return true;
    } else {
      // Redirect to the login page
      return router.parseUrl('/auth/login');
    }
  });
};
