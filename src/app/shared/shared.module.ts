import { NgModule } from '@angular/core';
import { LoadingDialogComponent } from './loading/loading-dialog/loading-dialog.component';
import { ErrorDialogComponent } from './errors/error-dialog/error-dialog.component';  
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ErrorDialogService } from './errors/error-dialog.service';
import { LoadingDialogService } from './loading/loading-dialog.service';
import { MaterialModule } from '../material.module';

const sharedComponents = [LoadingDialogComponent, ErrorDialogComponent];

/** global error handler https://pkief.medium.com/global-error-handling-in-angular-ea395ce174b1 */

@NgModule({
  declarations: [...sharedComponents],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [...sharedComponents],
  providers: [ErrorDialogService, LoadingDialogService],
  // entryComponents is no longer needed in Angular 9+
})
export class SharedModule { }
