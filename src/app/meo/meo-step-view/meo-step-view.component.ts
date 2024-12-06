import { Component } from '@angular/core';
import { FormManagerService } from '@formio/angular/manager';
import { ActivatedRoute } from '@angular/router';
import { FormioAppConfig } from '@formio/angular';

@Component({
  selector: 'app-meo-step-view',
  templateUrl: './meo-step-view.component.html',
  styleUrl: './meo-step-view.component.scss',
})
export class MeoStepViewComponent {
  constructor(
    public service: FormManagerService,
    public route: ActivatedRoute,
    public appConfig: FormioAppConfig,

  ) {
    console.log(service)

  }


}
