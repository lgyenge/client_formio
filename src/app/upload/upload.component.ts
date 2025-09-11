import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormioAppConfig } from '@formio/angular';
import { Papa, ParseResult } from 'ngx-papaparse';
import { DinetFormioForm } from '../dinet_common';
import { UploadService } from '../upload.service';
import { FormioAuthService } from '@formio/angular/auth';
import { AccessSetting } from '@formio/angular';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { FormBuilderService } from '../form-builder.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  @ViewChild('template') template: TemplateRef<HTMLDivElement> | null = null;
  @ViewChild('csvInput') csvInput!: ElementRef<HTMLInputElement>;

  fileName = '';
  dataList: any[] = [];
  errorMessages: string[] = [];
  roles: string[] = [];
  subForms: DinetFormioForm[] = [];
  formToUpload!: DinetFormioForm;
  headerFormToUpload!: DinetFormioForm;

  private destroy$ = new Subject<void>();

  readonly accessSetting: AccessSetting = { type: 'read_all', roles: [] };

  readonly submissionAccess: AccessSetting[] = [
    //{ type: 'create_all', roles: [] },
    { type: 'read_all', roles: [] },
    //{ type: 'update_all', roles: [] },
    //{ type: 'delete_all', roles: [] },
    { type: 'create_own', roles: [] },
    { type: 'read_own', roles: [] },
    { type: 'update_own', roles: [] },
    { type: 'delete_own', roles: [] },
  ];


  constructor(
    public appConfig: FormioAppConfig,
    private papa: Papa,
    private upload: UploadService,
    private auth: FormioAuthService,
    private formBuilder: FormBuilderService
  ) {}

  ngOnInit(): void {
    this.auth.ready.then(() => {
      const { administrator, authenticated, anonymous } = this.auth.roles;
      this.roles.push(administrator._id, authenticated._id, anonymous._id);

      this.accessSetting.roles = this.roles;
      this.submissionAccess.forEach((s) => s.roles.push(authenticated._id));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    console.log('UploadComponent destroyed.');
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.errorMessages = [];

    if (file) {
      this.fileName = file.name;
      this.parseCsvFile(file);
      input.value = ''; // reset
    }
  }

  private parseCsvFile(file: File): void {
    this.papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      worker: true,
      complete: (results: ParseResult<any>) => this.handleParsedCsv(results),
    });
  }

  private handleParsedCsv(results: ParseResult<any>): void {
    this.dataList = results.data;
  }

  uploadForms(): void {
    if (!this.dataList.length) return;

    const mainForms = this.dataList.filter((d) =>
      String(d.Cikkszám).includes('XX')
    );

    this.dataList.forEach((d) => (d.Cikkszám = d.Cikkszám.toLowerCase()));

    for (const mainForm of mainForms) {
      const subForms = this.dataList.filter((d) =>
        d.Cikkszám.startsWith(
          mainForm.Cikkszám.substring(0, mainForm.Cikkszám.indexOf('xx'))
        )
      );

      for (const element of subForms) {
        //const form = this.generateForm(element);
        this.formToUpload = this.formBuilder.generateForm(
          element,
          this.accessSetting,
          this.submissionAccess
        );
        this.upload
          .uploadForm(this.formToUpload)
          .pipe(
            catchError((err) => this.handleUploadError(err, element.Cikkszám)),
            takeUntil(this.destroy$)
          )
          .subscribe();
      }

      if (!subForms || subForms.some((sf) => !('Cikkszám' in sf))) {
        console.error('Invalid subForms input', subForms);
        return;
      }
      this.headerFormToUpload = this.formBuilder.generateHeaderForm(
        subForms![0],
        subForms!,
        this.accessSetting,
        this.submissionAccess
      );
      this.upload
        .uploadForm(this.headerFormToUpload)
        .pipe(
          catchError((err) => this.handleUploadError(err, mainForm.Cikkszám)),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }

    // cleanup
    this.dataList = [];
    this.fileName = '';
  }

  private handleUploadError(err: any, key: string) {
    const reason =
      err.status === 0
        ? `${key} client-side/network error`
        : `${key} backend error: ${err.status} - ${err.error?.message}`;
    this.errorMessages.push(reason);
    console.error(reason, err);
    return of(`${key} - upload error`);
  }
}
