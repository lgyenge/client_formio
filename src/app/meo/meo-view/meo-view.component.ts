import { Component, EventEmitter } from '@angular/core';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAuthService } from '@formio/angular/auth';
import { FormioSubmission } from '@formio/angular';

@Component({
  selector: 'app-meo-view',
  templateUrl: './meo-view.component.html',
  styleUrl: './meo-view.component.scss',
})
export class MeoViewComponent {
  public submission: FormioSubmission;
  public renderOptions: any;
  public onSuccess: EventEmitter<object> = new EventEmitter();
  public onError: EventEmitter<object> = new EventEmitter();
  public onSubmitDone: EventEmitter<object> = new EventEmitter();
  constructor(
    public service: FormManagerService,
    public router: Router,
    public route: ActivatedRoute,
    public config: FormManagerConfig,
    public auth: FormioAuthService
  ) {
    this.renderOptions = {
      saveDraft: this.config.saveDraft,
    };
    this.submission = { data: {} };
  }

  onSubmit(submission: any) {
    this.router.navigate(['../', 'header'], { relativeTo: this.route });
  }
}
