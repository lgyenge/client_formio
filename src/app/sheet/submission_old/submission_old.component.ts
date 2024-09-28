import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormioGridComponent } from '@formio/angular/grid';
import { switchMap } from 'rxjs';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';

@Component({
  selector: 'app-submission-old',
  templateUrl: './submission_old.component.html',
  styleUrl: './submission_old.component.scss',
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
})
export class SubmissionOldComponent implements OnInit {
  private route: ActivatedRoute;
  @ViewChild(FormioGridComponent, { static: false })  formGrid!: FormioGridComponent;
  src: string = '';
  //gridQuery: any = { 'data.lot__regex': '/s/i' };
  gridQuery: any = null;
  formData : any = null;



  constructor(public router: Router, route: ActivatedRoute, private location: Location) {
    this.route = route;
  }

  onAction($event: object) {
    throw new Error('onAction Method not implemented.');
  }
  /* onSelect($event: any) {
    this.formData = $event.data;
    this.gridQuery = {'data.lot__eq':this.formData.lot};
    console.log(this.gridQuery);
    console.log(this.formGrid);

  } */
  onSelect(row: any) {
    this.router.navigate([row._id, 'view'], {relativeTo: this.route});
  }

  onCreateItem() {
    throw new Error('onCreateItem Method not implemented.');
  }


  gylIsAllowedAction() {
    let a = {
      formView: false,
      formEdit: false,
    };
    return true;
  }

  getPath() {
    let locationPath = this.location.path();
    let locationSegments: any[];
    if (locationPath.length) {
      locationSegments = locationPath.split('/');
      console.log(locationSegments);
    } else {
      locationSegments = [];
    }
    return locationSegments[locationSegments.length - 2];
  }

  ngOnInit(): void {
    let id = this.getPath();
    this.src = 'http://localhost:3001/form/' + id + '/submission'; // TODO: add  src
  }
}
