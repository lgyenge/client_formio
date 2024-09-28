import { Component } from '@angular/core';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';

@Component({
  selector: 'app-submission-view',
  templateUrl: './view.component.html'
})
export class SubmissionViewComponent {
  constructor(public service: FormManagerService) { }
}
