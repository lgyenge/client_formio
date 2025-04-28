import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormioAppConfig } from '@formio/angular';
import { Papa } from 'ngx-papaparse';
import { DinetFormioForm, Suffix } from '../dinet_common';
import { UploadService } from '../upload.service';
import { FormioAuthService } from '@formio/angular/auth';
import { AccessSetting } from '@formio/angular';
import { catchError, of, Subscription } from 'rxjs';
import { forEach } from 'lodash';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit , OnDestroy {
  subForms: Array<any> | undefined;
  chunk: any;
  file: string = '';
  public importedData: Array<any> = [];
  @ViewChild('template') template: TemplateRef<HTMLDivElement> | null = null;
  @ViewChild("csvInput", { static: false }) CsvInputVar: ElementRef | null = null;
  title: string = '';
  message: string = '';
  options: string[] = [];
  answers: string[] = [];

  error_message: string[] = [];
  //error_code: string = '';
  headerFormToUpload: DinetFormioForm | undefined;
  formToUpload: DinetFormioForm | undefined;
  results: any;
  dataList: any;

  roles: string[] = [];
  uploadSubscription: Subscription | undefined;
  headerUploadSubscription: Subscription | undefined;
  accessSetting: AccessSetting = {
    type: 'read_all',
    roles: [],
  };
  accessSubmissionCreateAll: AccessSetting = {
    type: 'create_all',
    roles: [],
  };
  accessSubmissionReadAll: AccessSetting = {
    type: 'read_all',
    roles: [],
  };
  accessSubmissionUpdateAll: AccessSetting = {
    type: 'update_all',
    roles: [],
  };
  accessSubmissionDeleteAll: AccessSetting = {
    type: 'delete_all',
    roles: [],
  };
  accessSubmissionCreateOwn: AccessSetting = {
    type: 'create_own',
    roles: [],
  };
  accessSubmissionReadOwn: AccessSetting = {
    type: 'read_own',
    roles: [],
  };
  accessSubmissionUpdateOwn: AccessSetting = {
    type: 'update_own',
    roles: [],
  };
  accessSubmissionDeleteOwn: AccessSetting = {
    type: 'delete_own',
    roles: [],
  };
  constructor(
    public appConfig: FormioAppConfig,
    private papa: Papa,
    private upload: UploadService,
    public auth: FormioAuthService,
  ) { }
  ngOnDestroy(): void {
    // Clean up any resources or subscriptions to avoid memory leaks
    this.subForms = undefined;
    this.headerFormToUpload = undefined;
    this.formToUpload = undefined;
    this.dataList = undefined;
    this.importedData = [];
    this.error_message = [];
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    if (this.headerUploadSubscription) {
      this.headerUploadSubscription.unsubscribe();
    }

    console.log('UploadComponent destroyed and resources cleaned up.');
  }

  ngOnInit(): void {
    this.auth.ready.then(() => {
      this.roles.push(this.auth.roles.administrator._id);
      this.roles.push(this.auth.roles.authenticated._id);
      this.roles.push(this.auth.roles.anonymous._id);
      this.accessSetting.roles = this.roles;
      this.accessSubmissionReadAll.roles.push(
        this.auth.roles.authenticated._id
      );
      this.accessSubmissionCreateOwn.roles.push(
        this.auth.roles.authenticated._id
      );
      this.accessSubmissionReadOwn.roles.push(
        this.auth.roles.authenticated._id
      );
      this.accessSubmissionUpdateOwn.roles.push(
        this.auth.roles.authenticated._id
      );
      this.accessSubmissionDeleteOwn.roles.push(
        this.auth.roles.authenticated._id
      );
    });
  }

  uploadForm() {
    if (this.CsvInputVar) this.CsvInputVar.nativeElement.value = "";
    const mainForms: Array<{ Cikkszám: string }> = this.dataList!.filter((element: { Cikkszám: string }) =>
      (element.Cikkszám as string).indexOf("XX") != -1
    );

    this.dataList.map((element: any) => {
      element.Cikkszám = element.Cikkszám.toLowerCase()
      return element
    })

    console.log('mainForms', mainForms);
    //console.log('dataList', this.dataList);
    mainForms.forEach((mainForm) => {
      this.subForms = [];
      this.dataList.forEach((element: any) => {
        //console.log('element.Cikkszám', element.Cikkszám.substring(0, element.Cikkszám.indexOf('xx')))
        //console.log('mainForm.Cikkszám', mainForm.Cikkszám.substring(0, mainForm.Cikkszám.indexOf('xx')))
        if (element.Cikkszám.substring(0, element.Cikkszám.indexOf('xx')) == mainForm.Cikkszám.substring(0, mainForm.Cikkszám.indexOf('xx'))) {
          this.subForms?.push(element)
        }
      })

      console.log('subForms', this.subForms);
      this.subForms!.forEach((element: any) => {
        //element.Cikkszám = element.Cikkszám.toLowerCase();
        this.formToUpload = this.generateForm(element);
        this.uploadSubscription = this.upload
          .uploadForm(this.formToUpload)
          .pipe(
            catchError((err) => {
              if (err.status === 0) {
                console.error('An error occurred:', err.error);
                this.error_message.push(
                  ` ${(element as any)?.Cikkszám} reason: ${err.error
                  } A client-side or network error occurred.`
                );
              } else {
                console.error(
                  `Backend returned code ${err.status}, body was: `,
                  err.error
                );
                this.error_message.push(
                  ` ${(element as any)?.Cikkszám}  error code: ${err.error.status
                  }, reason: ${err.error.message}`
                );
              }
              return of((element as any)?.Cikkszám + ' - upload error');
            })
          )
          .subscribe((result: DinetFormioForm | any) => {
          });
      });
      this.headerFormToUpload = this.generateHeaderForm(this.subForms![0]);
      //console.log('hederrFormToUpload', this.headerFormToUpload);
        this.headerUploadSubscription =this.upload
         .uploadForm(this.headerFormToUpload).pipe(
           catchError((err) => {
             if (err.status === 0) {
               // A client-side or network error occurred. Handle it accordingly.
               console.error('An error occurred:', err.error);
               this.error_message.push(
                 ` ${(this.dataList![0] as any)?.Cikkszám} reason: ${err.error
                 } A client-side or network error occurred.`
               );
             } else {
               // The backend returned an unsuccessful response code.
               // The response body may contain clues as to what went wrong.
               console.error(
                 `Backend returned code ${err.status}, body was: `,
                 err.error
               );
               this.error_message.push(
                 ` ${(this.dataList![0] as any)?.Cikkszám}  error code: ${err.error.status
                 }, reason: ${err.error.message}`
               );
             }
             return of((this.dataList![0] as any)?.Cikkszám + ' - upload error');
           })
         )
         .subscribe((result: DinetFormioForm | any) => {
         }); 

    })

    // clear csv data
    this.dataList = [];
  }

  readCsvFromLocal($event: any) {
    const fileList = $event.srcElement.files;
    this.parseCsvFile(fileList[0]);
  }

  /**
   * Parses a CSV file using PapaParse and processes the data.
   *
   * @param file - The CSV file to be parsed, which can be a string or Blob.
   *
   * This method utilizes the PapaParse library to parse the CSV file with the following options:
   * - `header`: Ensures the first row is used as the header.
   * - `dynamicTyping`: Automatically converts numeric and boolean data.
   * - `skipEmptyLines`: Skips empty lines in the CSV.
   * - `worker`: Enables web workers for parsing.
   *
   * Upon completion, the parsed data is logged to the console, assigned to `dataList`,
   * and used to generate a form object which is also logged.
   */
  parseCsvFile(file: string | Blob) {
    this.papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      worker: true,
      //complete: this.papaParseCompleteFunction,
      complete: (results, file) => {
        this.papaParseComplete(results);
      },
    });
  }

  papaParseComplete(results: any) {
    //console.log('Results', results.data);
    this.dataList = results.data;
    this.results = results.data;
  }

  generateForm(nfdata: any) {
    let end = '';
    let newform: DinetFormioForm = {
      title: '',
      display: 'form',
      type: 'form',
      name: '',
      path: '',
      tags: ['common'],
      components: [],
      access: [],
      submissionAccess: [],
    };

    let submit = {
      type: 'button',
      /** a form szerkesztéskor mégegy submit buttont
      hozzáad  a csv - ből beolvasásotthoz
      ha a key nem submit akkor mind a két gomb működik,
      de egyik megoldás sem tökéletes */
      //key: 'submit_csv',
      action: 'submit',
      label: 'Submit',
      theme: 'primary',
    };


    let user = this.setTextfield('user');
    user.customDefaultValue = 'value = user.data.email;';
    user.disabled = true;

    newform.name = nfdata.Cikkszám + end;
    newform.title = nfdata.Cikkszám + ' (' + nfdata.Megnevezés + ')';
    newform.path = nfdata.Cikkszám + end;
    newform.components?.push(user);
    let lot = this.setTextfield('lot');
    //!!! lot1 fontos !!!
    lot.key = 'lot1';
    lot.disabled = true;
    newform.components?.push(lot);

    let serial = this.setNumber('serial', '', 'serial');
    serial.label = 'serial';
    serial.key = 'serial';
    newform.components?.push(serial);

    for (let i = 0; i < Object.keys(nfdata).length / 3; i++) {
      if (nfdata['Tp-' + i] == 'n') {
        let numf = this.setNumber(nfdata['Par-' + i], nfdata['Tr-' + i], i, nfdata['No-' + i], nfdata['Mi-' + i], nfdata['Pl-' + i]);
        newform.components?.push(numf);
      } else if (nfdata['Tp-' + i] == 'b') {
        let chkb = this.setCheckbox(nfdata['Par-' + i], nfdata['Tr-' + i], i);
        newform.components?.push(chkb);
      }
    }
    newform.components?.push(submit);

    newform.access?.push(this.accessSetting);

    newform.submissionAccess?.push(this.accessSubmissionCreateAll);
    newform.submissionAccess?.push(this.accessSubmissionReadAll);
    newform.submissionAccess?.push(this.accessSubmissionUpdateAll);
    newform.submissionAccess?.push(this.accessSubmissionDeleteAll);
    newform.submissionAccess?.push(this.accessSubmissionCreateOwn);
    newform.submissionAccess?.push(this.accessSubmissionReadOwn);
    newform.submissionAccess?.push(this.accessSubmissionUpdateOwn);
    newform.submissionAccess?.push(this.accessSubmissionDeleteOwn);

    return newform;
  }
  setTextfield(par: string) {
    var tx = {
      type: 'textfield',
      label: '',
      key: '',
      input: true,
      hidden: false,
      disabled: false,
      customDefaultValue: '',
    };
    tx.label = par;
    tx.key = par;
    tx.hidden = false;
    return tx;
  }

  setCheckbox(par: string, tr: string, i: any) {
    var cb = {
      label: 'Checkbox',
      tableView: true,
      key: 'checkbox',
      type: 'checkbox',
      input: true,
    };

    cb.label = par + '(' + tr + ')';
    cb.key = 'par' + i;
    return cb;
  }

  setNumber(par: string, tr: string, i: any, nominalValue?: number, toleranceMin?: number, toleranceMax?: number,) {
    //console.log(par);
    let nf = {
      input: true,
      tableView: true,
      inputType: 'number',
      inputMask: '',
      label: 'First Name',
      key: 'firstName',
      placeholder: '',
      prefix: '',
      suffix: '',
      defaultValue: '',
      protected: false,
      unique: false,
      persistent: true,
      /** ez önmagában kevés  a vesszőhöz*/
      //decimalSymbol: ',',
      validate: {
        required: false,
        minLength: 0,
        maxLength: 50,
        pattern: '',
        custom: '',
        customPrivate: false,
      },
      conditional: {
        show: false,
        when: '',
        eq: '',
      },
      type: 'number',
      tags: [],
      lockKey: true,
      isNew: false,
      // todo !!!!!!!!!!!!!!!!!!!
      properties: {
        nominalValue: nominalValue,
        toleranceMin: toleranceMin,
        toleranceMax: toleranceMax
      }
    };

    nf.label = par + '(' + tr + ')';
    nf.key = 'par' + i;
    return nf;
  }

  generateHeaderForm(nfdata: any) {
    let end = 'Header';
    let newform: DinetFormioForm = {
      title: '',
      display: 'form',
      type: 'form',
      name: '',
      path: '',
      tags: ['common'],
      components: [],
      access: [],
      submissionAccess: [],
    };

    let submit = {
      type: 'button',
      /* a form szerkesztéskor mégegy submit buttont
      hozzáad  a csv - ből beolvasásotthoz
      ha a key nem submit akkor mind a két gomb működik,
      de egyik megoldás sem tökéletes */
      //key: 'submit_csv',
      action: 'submit',
      label: 'Submit',
      theme: 'primary',
    };

    newform.name = nfdata.Cikkszám.substring(0, nfdata.Cikkszám.indexOf('xx')) + "xxH";
    newform.title = newform.name;
    newform.path = newform.name;
    let user = this.setTextfield('user');
    user.customDefaultValue = 'value = user.data.email;';
    user.disabled = true;
    newform.components?.push(user);
    let serial = this.setNumber('serial', '', 'serial');
    serial.label = 'serial';
    serial.key = 'serial';
    newform.components?.push(serial);
    let lot = this.setTextfield('lot');
    lot.key = 'lot1';
    //!!! lot1 fontos !!!
    lot.disabled = true;
    newform.components?.push(lot);

    this.subForms!.forEach((form: any, i: number) => {

      let suffix = "";
      //console.log('form.Cikkszám', form.Cikkszám);
      if (form.Cikkszám) {
        if (form.Cikkszám.indexOf('xx') !== -1) {
          suffix = form.Cikkszám.substring(form.Cikkszám.indexOf('xx') + 2, form.Cikkszám.length);
        } else {
          suffix = "NH";
        }
      }
      let numf = this.setNumber("aa" + i, "In", i);
      numf.label = 'In-' + suffix;
      /* numf.key = 'In' + form.Cikkszám + suffix; */
      numf.key = 'In' + suffix;
      newform.components?.push(numf);
      numf = this.setNumber("#" + i, "Out", i);
      numf.label = 'Out-' + suffix
      /* numf.key = 'Out' + form.Cikkszám + suffix; */
      numf.key = 'Out' + suffix;
      newform.components?.push(numf);

    });

    newform.components?.push(submit);
    newform.access?.push(this.accessSetting);
    newform.submissionAccess?.push(this.accessSubmissionCreateAll);
    newform.submissionAccess?.push(this.accessSubmissionReadAll);
    newform.submissionAccess?.push(this.accessSubmissionUpdateAll);
    newform.submissionAccess?.push(this.accessSubmissionDeleteAll);
    newform.submissionAccess?.push(this.accessSubmissionCreateOwn);
    newform.submissionAccess?.push(this.accessSubmissionReadOwn);
    newform.submissionAccess?.push(this.accessSubmissionUpdateOwn);
    newform.submissionAccess?.push(this.accessSubmissionDeleteOwn);
    return newform;
  }
}
