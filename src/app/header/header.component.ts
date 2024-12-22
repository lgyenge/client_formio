import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormioAuthService } from '@formio/angular/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent  {
toggle_meo(_par: HTMLButtonElement) {
  this.router.navigate(['/', 'meo']);
}

toggle_form(_par: HTMLButtonElement) {
  this.router.navigate(['/', 'form']);
}

toggle_sheet(_par: HTMLButtonElement) {
  this.router.navigate(['/', 'sheet']);
}



  constructor(public auth: FormioAuthService, private router: Router) {
    //console.log(this.auth);
  }


}
