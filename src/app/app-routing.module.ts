import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
   {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
   {
    path: 'form',
    loadChildren: () => import('./form/form.module').then((m) => m.FormModule),
  },
  {
    path: 'event',
    // This is a route configuration that will load the EventModule
    // when the route URL is '/event'. The loadChildren property
    // is a function that will be called when the route is first
    // accessed. The function imports the EventModule and returns
    // it, so that it can be used to render the component for the
    // route.
    loadChildren: () =>
      import('./event/event.module').then((m) => m.EventModule),
  },
  {
    path: 'implant',
    loadChildren: () =>
      import('./implant/implant.module').then((m) => m.implantModule),
  },
  {
    path: 'device',
    loadChildren: () =>
      import('./device/device.module').then((m) => m.DeviceModule),
  },

   { path: 'gyl', component: FormComponent },
   { path: 'sheet', loadChildren: () => import('./sheet/sheet.module').then(m => m.SheetModule) },
   /*
  {
    path: 'employee',
    loadChildren: () =>
      import('./employee/employee.module').then((m) => m.EmployeeModule),
  }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
