import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { authAdminGuard } from './guards/auth-admin.guard';

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
    canActivate: [authAdminGuard],
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
    canActivate: [authAdminGuard],
  },

  {
    path: 'create-resource',
    loadChildren: () =>
      import('./create-resource/create-resource.module').then(
        (m) => m.CreateResourceModule
      ),
    canActivate: [authAdminGuard],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
