import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { FormioModule } from '@formio/angular';
import { FormioAuth, FormioAuthRoutes } from '@formio/angular/auth';

export const authRoutes = FormioAuthRoutes({
  login: LoginComponent
});

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormioModule,
    FormioAuth,
    RouterModule.forChild(authRoutes)
  ]
})
export class AuthModule { }
