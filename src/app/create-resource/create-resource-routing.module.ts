import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { CreateResourceComponent } from './create-resource.component';
import { FormioResourceRoutes } from '@formio/angular/resource';

@NgModule({
  imports: [
    RouterModule.forChild(
      FormioResourceRoutes({
        // view: CreateResourceComponent
      })
      /*
      [
        {
          path: '',
          component:
            config && config.index
              ? config.index
              : FormioResourceIndexComponent,
        },
        {
          path: 'new',
          component:
            config && config.create
              ? config.create
              : FormioResourceCreateComponent,
        },
        {
          path: ':id',
          component:
            config && config.resource
              ? config.resource
              : FormioResourceComponent,
          children: [
            {
              path: '',
              redirectTo: 'view',
              pathMatch: 'full',
            },
            {
              path: 'view',
              component:
                config && config.view
                  ? config.view
                  : FormioResourceViewComponent,
            },
            {
              path: 'edit',
              component:
                config && config.edit
                  ? config.edit
                  : FormioResourceEditComponent,
            },
            {
              path: 'delete',
              component:
                config && config.delete
                  ? config.delete
                  : FormioResourceDeleteComponent,
            },
          ],
        },
      ] */
    ),
  ],
  exports: [RouterModule],
})
export class CreateResourceRoutingModule {}
