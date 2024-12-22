import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormioAuthService } from '@formio/angular/auth';


export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  const auth = inject(FormioAuthService);
  const router = inject(Router);

  if (auth.authenticated) {
    return true;
  }
  router.navigate(['/auth/login']);
  return false;
};
