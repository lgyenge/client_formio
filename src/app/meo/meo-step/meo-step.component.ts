import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAppConfig } from '@formio/angular';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { FormioAuthService } from '@formio/angular/auth';

import { DataService } from  '../../data.service';
import { DinetFormioForm } from '../../dinet_common';

@Component({
  selector: 'app-meo-step',
  templateUrl: './meo-step.component.html',
  styleUrl: './meo-step.component.scss',
})
export class MeoStepComponent implements OnInit {

  updateForm(message: string){
    this.dataService.sendMessage(message);
  }
  forms: DinetFormioForm[] = JSON.parse(localStorage.getItem('forms') ?? '[]');
  header = '/meo/lot/step/' + (this.forms[0]._id) + '/header';
  header2 = '/meo/lot/step/' + (this.forms[1]._id) + '/header';
// ezt hiányolta ??????????????????????????????????????????????????????????
  header3 = '/meo/lot/step/' + (this.forms[2]._id) + '/header';

  constructor(
    public service: FormManagerService,
    public auth: FormioAuthService,
    public route: ActivatedRoute,
    public appConfig: FormioAppConfig,
    public router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.updateForm(params['id']);
    });
    this.service.reset(this.route);
    console.log(this.auth)
  }
}
