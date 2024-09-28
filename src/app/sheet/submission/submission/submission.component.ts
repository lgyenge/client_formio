import { Component, OnInit } from '@angular/core';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html'
})
export class SubmissionComponent2 implements OnInit {
  public downloadUrl!: string;
  constructor(
    public service: FormManagerService,
    public route: ActivatedRoute
  ) { }

  setDownloadUrl(url: string) {
    this.downloadUrl = url;
  }

  ngOnInit() {
    this.service.setSubmission(this.route).then((formio: any) => {
      formio.getDownloadUrl().then((url: any) => this.setDownloadUrl(url));
    });
    // console.log(this.service);
  }
}
