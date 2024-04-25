import { Component } from '@angular/core';
import { FormioAuthLoginComponent } from '@formio/angular/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends FormioAuthLoginComponent {

}
