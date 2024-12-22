import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { FindFormComponent } from './find-form/find-form.component';
import { DisplayFormComponent } from './display-form/display-form.component';
import { SheetComponent } from './sheet/sheet.component';
// import { SubmissionComponent } from './submission_old/submission.component';
import { SubmissionComponent2 } from './submission/submission/submission.component';
import { SheetNewComponent } from './sheet-new/sheet-new.component';
import { SubmissionIndexComponent } from './submission/index/index.component';
import {
  FormManagerViewComponent,
  FormManagerEditComponent,
  FormManagerDeleteComponent,
  SubmissionViewComponent,
  SubmissionEditComponent,
  SubmissionDeleteComponent,
} from '@formio/angular/manager';
import { authGuard } from '../guards/auth.guard';
//import { SubmissionOldComponent } from './submission_old/submission_old.component';

const routes: Routes = [
  {
    path: '',
    component: DisplayFormComponent,canActivate: [authGuard],
  },
  {
    path: ':id',
    component: SheetNewComponent,canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full',
      },
      {
        path: 'view',
        component: FormManagerViewComponent,
      },
      {
        path: 'edit',
        component: FormManagerEditComponent,
      },
      {
        path: 'delete',
        component: FormManagerDeleteComponent,
      },
      {
        path: 'submission',
        component: SubmissionIndexComponent,
        //component: SubmissionOldComponent,

      },
      {
        path: 'submission/:id',
        component: SubmissionComponent2,
        children: [
          {
            path: '',
            redirectTo: 'view',
            pathMatch: 'full',
          },
          {
            path: 'view',
            component: SubmissionViewComponent,
          },
          {
            path: 'edit',
            component: SubmissionEditComponent,
          },
          {
            path: 'delete',
            component: SubmissionDeleteComponent,
          },
        ],
      },
      /* {
            path: 'participant',
            // loadChildren: './participant/participant.module#ParticipantModule',
            loadChildren: () =>
              import('./participant/participant.module').then((m) => m.ParticipantModule),
          } */
    ],
  },
];
//const routes: Routes = [{ path: '', component: DisplayFormComponent}]
//const routes: Routes = [{ path: '', component: FindFormComponent}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SheetRoutingModule {}
