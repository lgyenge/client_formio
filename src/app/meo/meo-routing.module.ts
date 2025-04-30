import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeoStepComponent } from './meo-step/meo-step.component';
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
import { Meo2Component } from './meo2/meo2.component';
import { MeoStepIndex2Component } from './meo-step-index2/meo-step-index2.component';

const routes: Routes = [
  { path: '', component: Meo2Component, canActivate: [authGuard] },
  {
    path: 'step/:id',

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
        component: MeoStepIndex2Component,
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
