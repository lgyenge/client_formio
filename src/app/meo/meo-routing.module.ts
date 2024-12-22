import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeoComponent } from './meo/meo.component';
import { MeoLotComponent } from './meo-lot/meo-lot.component';
import { MeoStepComponent } from './meo-step/meo-step.component';
import { MeoStepIndexComponent } from './meo-step-index/meo-step-index.component';
import {
  FormManagerDeleteComponent,
  FormManagerViewComponent,
  SubmissionDeleteComponent,
  SubmissionViewComponent,
} from '@formio/angular/manager';
import { MeoStepViewComponent } from './meo-step-view/meo-step-view.component';
import { MeoStepHeaderComponent } from './meo-step-header/meo-step-header.component';
import { MeoStepEditComponent } from './meo-step-edit/meo-step-edit.component';
import { MeoViewComponent } from './meo-view/meo-view.component';
import { MeoExcelComponent } from './meo-excel/meo-excel.component';
import { authGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', component: MeoComponent, canActivate: [authGuard] },
  {
    path: 'lot',
    component: MeoLotComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
  },
  {
    path: 'lot/step/:id',
    component: MeoStepComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'header',
        pathMatch: 'full',
      },
      {
        path: 'header',
        component: MeoStepIndexComponent,
        pathMatch: 'full',
      },
      {
        path: 'save',
        component: MeoExcelComponent,
      },
      {
        path: 'new',
        component: MeoViewComponent,
        //component: SubmissionViewComponent,
      },

      {
        path: 'header/:id',
        component: MeoStepHeaderComponent,
        children: [
          {
            path: '',
            redirectTo: 'view',
            pathMatch: 'full',
          },
          {
            path: 'view',
            component: MeoStepViewComponent,
          },
          {
            path: 'edit',
            component: MeoStepEditComponent,
          },
          {
            path: 'delete',
            component: SubmissionDeleteComponent,
          },

          /*  {
            path: 'new',
            component: FormManagerViewComponent,
          }, */
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeoRoutingModule {}
