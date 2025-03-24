import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FormioAuthService } from '@formio/angular/auth';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(FormioAuthService);
  const router = inject(Router);

  if (auth.is.administrator)  {
    return true;
  }
  //router.navigate(['/auth/login']);
  return false;
};
