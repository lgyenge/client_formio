import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { FormioGridComponent } from '@formio/angular/grid';
import { debounce } from 'lodash';
import { FormioPromiseService } from '@formio/angular';

@Component({
  selector: 'app-display-form',
  templateUrl: './display-form.component.html',
  styleUrl: './display-form.component.scss',
})
export class DisplayFormComponent implements OnInit, AfterViewInit {
  @ViewChild('search') searchElement!: ElementRef;
  @ViewChild(FormioGridComponent, { static: false })
  formGrid!: FormioGridComponent;
  public gridQuery: any;
  public onSearch;
  // public service2 = new FormioPromiseService('http://localhost:3001');
  // !!! gyl converted to FormioPromiseService
  public serviceFormioConverted = this.service
    .formio as unknown as FormioPromiseService;

  constructor(
    public service: FormManagerService,
    public route: ActivatedRoute,
    public router: Router,
    public config: FormManagerConfig
  ) {
    const DefaultConfiguration = new FormManagerConfig();

    this.config = { ...DefaultConfiguration, ...this.config };

    this.gridQuery = { type: this.config.type, sort: 'title' };
    if (this.config.tag) {
      this.gridQuery.tags = this.config.tag;
    }
    this.onSearch = debounce(this._onSearch, 300);
  }

  /* gylIsAllowedAction() {
    let a = {
      formCreate: true,
      formView: true,
      formSubmission: true,
      formEdit: false,
      formPermission: true,
      formDelete: true,
      projectSettings: true,
      userManagement: true,
    };
    return a;
  } */

  loadGrid() {
    //this.gridQuery = JSON.parse(localStorage.getItem('query')) || this.gridQuery;
    const query = localStorage.getItem('query');
    if (query !== null) {
      this.gridQuery = JSON.parse(query);
    }
    const currentPage = +(localStorage.getItem('currentPage') || 0);
    this.formGrid
      .refreshGrid(this.gridQuery)
      .then(() => this.formGrid.setPage(currentPage - 1));
  }

  ngOnInit() {
    this.gridQuery = { type: this.config.type, sort: 'title' };
    if (this.config.tag) {
      this.gridQuery.tags = this.config.tag;
    }
    this.service.reset();
    this.service.ready.then(() => {
      this.loadGrid();
      this.formGrid.footer.pageChanged.subscribe((page) => {
        localStorage.setItem('currentPage', page.page);
      });
    });
  }

  ngAfterViewInit(): void {
    this.searchElement.nativeElement.value =
      localStorage.getItem('searchInput') || '';
  }

  _onSearch() {
    const search = this.searchElement.nativeElement.value;
    if (search.length > 0) {
      this.gridQuery.skip = 0;
      this.gridQuery.title__regex = '/' + search + '/i';
      this.gridQuery.title__regex = '/' + search.trim() + '/i';
    } else {
      delete this.gridQuery.title__regex;
    }
    localStorage.setItem('query', JSON.stringify(this.gridQuery));
    localStorage.setItem('searchInput', search);
    this.formGrid.pageChanged({ page: 1, itemPerPage: this.gridQuery.limit });
  }

  clearSearch() {
    this.gridQuery = { type: this.config.type, sort: 'title' };
    if (this.config.tag) {
      this.gridQuery.tags = this.config.tag;
    }
    localStorage.removeItem('query');
    localStorage.removeItem('searchInput');
    localStorage.removeItem('currentPage');
    if (this.searchElement?.nativeElement) {
      this.searchElement.nativeElement.value = '';
    }
    this.formGrid.query = this.gridQuery;
    this.formGrid.pageChanged({ page: 1 });
  }

  onAction(action: any) {
    this.service.form = null; // Reset previous form data
    this.router.navigate([action.row._id, action.action], {
      relativeTo: this.route,
    });
  }

  onSelect(row: any) {
    //this.router.navigate([row._id], { relativeTo: this.route });
    this.router.navigate(['/sheet', row._id]);
  }

  onCreateItem() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }
}
