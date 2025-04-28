import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAppConfig, FormioService } from '@formio/angular';
import { FormManagerService } from '@formio/angular/manager';
import { FormioAuthService } from '@formio/angular/auth';
import { DataService } from '../../data.service';
import { DinetFormioForm, Suffix } from '../../dinet_common';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-meo-step',
  templateUrl: './meo-step.component.html',
  styleUrl: './meo-step.component.scss',
})
export class MeoStepComponent implements OnInit, OnDestroy{
  params: any;

  updateForm(suffix: Suffix | undefined) {
    console.log('send suffix', suffix);
    this.dataService.sendMessage(suffix ?? { formId: '', name: '' });
  }
  headerFormservice: FormioService = new FormioService(this.appConfig.appUrl);

  forms: DinetFormioForm[] = JSON.parse(localStorage.getItem('forms') ?? '[]');
  suffixes: Suffix[] = [];
  suffix: Suffix | undefined = undefined;
  query = { 'data.lot1__eq': localStorage.getItem('lot_no')};
  subscription!: Subscription;


  constructor(
    public service: FormManagerService,
    public auth: FormioAuthService,
    public route: ActivatedRoute,
    public appConfig: FormioAppConfig,
    public router: Router,
    private dataService: DataService
  ) {
  }
  ngOnDestroy(): void {
    // Perform any necessary cleanup here
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    console.log('MeoStepComponent is being destroyed');
  }


  ngOnInit() {
    this.subscription = this.route.params.pipe(
      switchMap((params) => {
        this.suffixes = [];
        /** set this.suffixes & this.suffix */
        this.forms.forEach((form) => {
          if (form.name) {
            if (form.name.indexOf('xx') !== -1) {
              let suffix: Suffix = { formId: form._id, name: form.name.substring(form.name.indexOf('xx') + 2, form.name.length) };
              this.suffixes.push(suffix);
              if (form._id === params['id']) {
                this.suffix = suffix;
              }
            } else {
              let suffix: Suffix = { formId: form._id ?? "", name: "NH" };
              this.suffixes.push(suffix);
              if (form._id === params['id']) {
                this.suffix = suffix;
              }
            }

          }
        });
        localStorage.setItem('suffixes', JSON.stringify(this.suffixes ?? ''));
        //console.log('suffixes', this.suffixes);

        //javítani a paraméterátadást in rx chain
        this.params = params;
        const foundHeaderForm = this.forms
          ? (this.forms.find((form) => form.name && form.name.indexOf('xxH') !== -1))
          : undefined;
        const headerUrl = this.appConfig.appUrl + '/form/' + foundHeaderForm!._id + '/submission';
        this.headerFormservice = new FormioService(headerUrl);
        console.log('this.headerFormservice', this.headerFormservice)
        //return this.headerFormservice.loadSubmissions()

        return this.headerFormservice.loadSubmissions({ params: this.query })
      }),
    ).subscribe((subs: any) => {
      console.log('subs', subs);
      if (subs.length !== 0) {
        /** set In Out quantities for Header form */
        this.suffix!.headerSubmission = subs[0];
        this.suffix!.inCnt = subs[0].data['In' + this.suffix?.name!];
        this.suffix!.outCnt = subs[0].data['Out' + this.suffix?.name!];
      }
      /* send suffix to meo-step-index2 component */
      this.updateForm(this.suffix);
      localStorage.setItem('formId', this.params['id']);
    });
    this.service.reset(this.route);
    console.log(this.service);
    //console.log(this.auth)

  }
}
