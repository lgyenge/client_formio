import { Component, OnInit } from '@angular/core';
import { FormManagerService } from '@formio/angular/manager';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-meo-step-header',
  templateUrl: './meo-step-header.component.html',
  styleUrl: './meo-step-header.component.scss'
})
export class MeoStepHeaderComponent implements OnInit {
   constructor(
    public service: FormManagerService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    // nem lehetett kivenni
    this.service.setSubmission(this.route).then((formio: any) => {
     console.log(this.service);
    });
  }



}
