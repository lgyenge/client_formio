import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceViewComponent } from './device-view/device-view.component';
import { RouterModule } from '@angular/router';
import { FormioModule } from '@formio/angular';
import {
  FormioResource,
  FormioResourceConfig,
  FormioResourceService,
  FormioResourceIndexComponent,
  FormioResourceCreateComponent,
  FormioResourceEditComponent,
  FormioResourceDeleteComponent,
} from '@formio/angular/resource';
import { DeviceResourceComponent } from './device-resource/device-resource.component';
import { authGuard } from '../guards/auth.guard';

@NgModule({
  declarations: [DeviceViewComponent, DeviceResourceComponent],
  imports: [
    CommonModule,
    FormioModule,
    FormioResource,
    RouterModule.forChild([
      {
        path: '',
        component: FormioResourceIndexComponent,
        canActivate: [authGuard],
      },
      {
        path: 'new',
        component: FormioResourceCreateComponent,
        canActivate: [authGuard],
      },
      {
        path: ':id',
        component: DeviceResourceComponent,
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'view',
            pathMatch: 'full',
          },
          {
            path: 'view',
            component: DeviceViewComponent,
          },
          {
            path: 'edit',
            component: FormioResourceEditComponent,
          },
          {
            path: 'delete',
            component: FormioResourceDeleteComponent,
          },
          /*   {
            path: 'participant',
            loadChildren: './participant/participant.module#ParticipantModule'
          } */
        ],
      },
    ]),
  ],
  providers: [
    FormioResourceService,
    {
      provide: FormioResourceConfig,
      useValue: {
        name: '151-0111-6525-3',
        form: '151-0111-6525-3',
      },
    },
  ],
})
export class DeviceModule {}
