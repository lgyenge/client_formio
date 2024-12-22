import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';

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
    canActivate: [authGuard],
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
    canActivate: [authGuard],
  },
  {
    path: 'implant',
    loadChildren: () =>
      import('./implant/implant.module').then((m) => m.implantModule),
    canActivate: [authGuard],
  },
  {
    path: 'device',
    loadChildren: () =>
      import('./device/device.module').then((m) => m.DeviceModule),
    canActivate: [authGuard],
  },

  { path: 'gyl', component: FormComponent },
  {
    path: 'sheet',
    loadChildren: () =>
      import('./sheet/sheet.module').then((m) => m.SheetModule),
    canActivate: [authGuard],
  },
  {
    path: 'meo',
    loadChildren: () => import('./meo/meo.module').then((m) => m.MeoModule),
    canActivate: [authGuard],
  },
  {
    path: 'upload',
    loadChildren: () =>
      import('./upload/upload.module').then((m) => m.UploadModule),
    canActivate: [authGuard],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
