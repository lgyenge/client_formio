import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FormioAuthService } from '@formio/angular/auth';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const auth: FormioAuthService = inject(FormioAuthService);
  const router: Router = inject(Router);

  return auth.ready.then(() => {
    console.log('authAdminGuard ready ', auth.is.administrator);
    if (auth.is.administrator) {
      return true;
    } else {
      // Redirect to the login page
      return router.parseUrl('/auth/login');
    }
  });
};
