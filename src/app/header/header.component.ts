import { Component } from '@angular/core';
import { FormioAuthService } from '@formio/angular/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent  {

  constructor(public auth: FormioAuthService) {}


}
