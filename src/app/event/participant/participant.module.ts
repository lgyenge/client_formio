import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormioModule } from '@formio/angular';
import {
  FormioResource,
  FormioResourceRoutes,
  FormioResourceConfig,
  FormioResourceService
} from '@formio/angular/resource';

@NgModule({
  imports: [
    CommonModule,
    FormioModule,
    FormioResource,
    RouterModule.forChild(FormioResourceRoutes())
  ],
  declarations: [],
  providers: [
    FormioResourceService,
    {
      provide: FormioResourceConfig,
      useValue: {
        name: 'participant',
        form: 'participant',
        //name: 'user',
        //form: 'user',
        parents: [
          'Event'/* ,
          {
            field: 'user',
            resource: 'currentUser',
            filter: true
          } */
        ]
      }
    }
  ]
})
export class ParticipantModule {
}
