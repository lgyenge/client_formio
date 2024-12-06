import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAppConfig } from '@formio/angular';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { FormioAuthService } from '@formio/angular/auth';

import { DataService } from  '../../data.service';

@Component({
  selector: 'app-meo-step',
  templateUrl: './meo-step.component.html',
  styleUrl: './meo-step.component.scss',
})
export class MeoStepComponent implements OnInit {

  updateForm(message: string){
    this.dataService.sendMessage(message);
  }

  formIds = localStorage.getItem('form_ids')  ;
  formIds2 = JSON.parse(this.formIds ?? '[]');

  header = '/meo/lot/step/' + (this.formIds2[0] ) + '/header';
  header2 = '/meo/lot/step/' + (this.formIds2[1] ) + '/header';
  header3 = '/meo/lot/step/' + (this.formIds2[2] ) + '/header';


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
    console.log(JSON.parse(this.formIds ?? '[]'));
    //console.log(this.header)
    //console.log(this.service);
    //console.log(this.route);
  }
}
