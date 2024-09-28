import { Component } from '@angular/core';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAlerts } from '@formio/angular';

@Component({
  selector: 'app-submission-delete',
  templateUrl: './delete.component.html'
})
export class SubmissionDeleteComponent {
  constructor(
    public service: FormManagerService,
    public router: Router,
    public route: ActivatedRoute,
    public alerts: FormioAlerts
  ) {}

  onDelete() {
    this.service.formio.deleteSubmission().then(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }).catch((err: { message: any; }) => this.alerts.setAlert({type: 'danger', message: (err.message || err)}));
  }

  onCancel() {
    this.router.navigate(['../', 'view'], { relativeTo: this.route });
  }
}
