import { Component } from '@angular/core';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioSubmission } from '@formio/angular';


@Component({
  selector: 'app-meo-step-edit',
  templateUrl: './meo-step-edit.component.html',
  styleUrl: './meo-step-edit.component.scss'
})
export class MeoStepEditComponent {
  constructor(
    public service: FormManagerService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  onSubmit(submission: FormioSubmission) {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }


}
