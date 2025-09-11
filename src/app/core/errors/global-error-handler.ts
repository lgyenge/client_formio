import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ErrorDialogService } from '../../shared/errors/error-dialog.service';
import { FormioAuthService } from '@formio/angular/auth';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private errorDialogService: ErrorDialogService,
    private authService: FormioAuthService, // Inject the authentication service
    private zone: NgZone,
    private router: Router // Inject the router
  ) {}

  handleError(error: any) {
    //console.error('Error from global error handler1', JSON.stringify(error));
    console.error('Error from global error handler1', error);


    // Check if the error message indicates a token issue
    //if (error?.message === 'Bad Token') {
    if (
      error === 'Bad Token' ||
      error.message === 'Bad Token' ||
      error.message === 'Token expired' ||
      error === 'Token expired' ||
      error.message === 'Token invalid' ||
      error === 'Token invalid' ||
      error.message === 'Token not found' ||
      error === 'Token not found' ||
      error.message === 'Unauthorized' ||
      error === 'Unauthorized'
    ) {
      // Handle token-related errors
      this.zone.run(() => {
        // All code here runs inside Angular's zone, so change detection works correctly
        console.error('Token error: ', error);
        // Clear the invalid token, log the user out.
        localStorage.setItem('formioToken','');
        this.authService.logout();
        //this.router.navigate(['/home']);

        //gyl add reloadPage
        window.location.reload()

        //this.router.navigate(['/auth/login']);

        return
      });
    }

    // Check if it's an error not from an HTTP response
    // If it's not an HTTP error, it might be a promise rejection
    if (!(error instanceof HttpErrorResponse)) {
      //error = error.rejection; // get the error object
    }
    this.zone.run(() =>
      this.errorDialogService.openDialog(
        error?.message || error || 'Undefined client error',
        error?.status || 'Undefined status'
      )
    );

    console.error('Error from global error handler2', error);
  }
}
