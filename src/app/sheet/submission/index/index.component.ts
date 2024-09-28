import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioPromiseService } from '@formio/angular';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';

@Component({
  selector: 'app-submission-index',
  templateUrl: './index.component.html',
})
export class SubmissionIndexComponent implements OnInit {
  // public service2 = new FormioPromiseService(this.service.formio.formUrl);
  // !!! gyl converted to FormioPromiseService
  public serviceFormioConverted = this.service
    .formio as unknown as FormioPromiseService;

  constructor(
    public service: FormManagerService,
    public route: ActivatedRoute,
    public router: Router
  ) {}
  ngOnInit(): void {
    // console.log('service', this.service);
    // throw new Error('Method not implemented.');
  }

  onSelect(row: any) {
    this.router.navigate([row._id, 'view'], { relativeTo: this.route });
  }
}
