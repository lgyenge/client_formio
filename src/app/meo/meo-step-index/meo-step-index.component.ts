import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioPromiseService, Formio } from '@formio/angular';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { DataService } from '../../data.service';
import { FormioAppConfig } from '@formio/angular';
import { FormioGridComponent } from '@formio/angular/grid';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meo-step-index',
  templateUrl: './meo-step-index.component.html',
  styleUrl: './meo-step-index.component.scss',
})
export class MeoStepIndexComponent implements OnInit, OnDestroy {
  @ViewChild(FormioGridComponent, { static: false })
  formGrid!: FormioGridComponent;
  subscription: Subscription | undefined;
  query = { 'data.lot1__eq': localStorage.getItem('lot_no') };
  msg: string = '674df6f4b9e053f61d9102e9';
  public serviceFormioConverted = this.service
    .formio as unknown as FormioPromiseService;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: FormManagerService,
    public dataService: DataService,
    public appConfig: FormioAppConfig
  ) {}
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.dataService.getMessage.subscribe((msg: any) => {
      this.msg = msg;
      this.service.ready.then(() => {
        // Ezt ki kelle venni !!!!
        this.formGrid.formio = new Formio(
          this.appConfig.appUrl + '/form/' + msg
        ) as unknown as FormioPromiseService;
        this.formGrid.refreshGrid(this.query);
      });
    });
  }

  onSelect(row: any) {
    this.router.navigate([row._id, 'view'], {
      relativeTo: this.route,
    });
  }

  onAction(action: any) {
    this.service.form = null; // Reset previous form data
    this.router.navigate([action.row._id, action.action], {
      relativeTo: this.route,
    });
  }

  onCreateItem() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  isActionAllowed(_submissionCreate: any): boolean {
    return true;
  }
}
