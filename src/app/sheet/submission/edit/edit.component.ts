import { Component } from '@angular/core';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-submission-edit',
  templateUrl: './edit.component.html'
})
export class SubmissionEditComponent {
  constructor(
    public service: FormManagerService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  onSubmit(submission: any) {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }
}
