import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormioAppConfig } from '@formio/angular';
import { Papa } from 'ngx-papaparse';
import { DinetFormioForm } from '../dinet_common';
import { UploadService } from '../upload.service';
import { LotConfig } from '../../config ';
import { FormioAuthService } from '@formio/angular/auth';
import { AccessSetting } from '@formio/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { ModalMessageService } from '../modal-message.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit, AfterViewInit {
  chunk: any;
  file: string = '';
  public importedData: Array<any> = [];
  //modalRef!: BsModalRef;
  //@ViewChild('modal', { read: TemplateRef })   _modalModalRef!: TemplateRef<any>;
  @ViewChild('template') template: TemplateRef<HTMLDivElement> | null = null;
  @ViewChild("csvInput", {static: false}) CsvInputVar: ElementRef | null = null;
  modalRef: BsModalRef | null = null;
  title: string = '';
  message: string = '';
  options: string[] = [];
  answers: string[] = [];

  error_message: string[] = [];
  //error_code: string = '';

  formToUpload: DinetFormioForm | undefined;
  dataList: any;
  roles: string[] = [];
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
    private modalService: BsModalService,
    private modalMessageService: ModalMessageService
  ) {}
  ngAfterViewInit(): void {
   // open modal dialog
   // this.confirm();
  }

  ngOnInit(): void {
    const obj = this;
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
    // console.log(this.dataList);
    if (this.CsvInputVar) this.CsvInputVar.nativeElement.value = "";
    this.dataList!.forEach((element: any) => {
      this.formToUpload = this.generateForm(element);
      //  console.log(this.formToUpload);
      this.upload
        .uploadForm(this.formToUpload)

        .pipe(
          //catchError(this.handleError),
          //catchError(err => of((element as any)?.Cikkszám) + 'upload error')
          catchError((err) => {
            //this.message += '\n'+ ((element as any)?.Cikkszám + ' - upload error')
            if (err.status === 0) {
              // A client-side or network error occurred. Handle it accordingly.
              console.error('An error occurred:', err.error);
              this.error_message.push(
                ` ${(element as any)?.Cikkszám} reason: ${
                  err.error
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
                ` ${(element as any)?.Cikkszám}  error code: ${
                  err.error.status
                }, reason: ${err.error.message}`
              );
            }
            return of((element as any)?.Cikkszám + ' - upload error');
          })
        )
        .subscribe((result: DinetFormioForm | any) => {
          // this.dataList = [];

          //console.log((result as DinetFormioForm)?.name);
          //console.log(this.message);
          //console.log(result);
        });
    });
    // clear csv data
    this.dataList = [];
    //this.confirm();
  }

  //confirm modal dialog
  confirm() {
    this.modalMessageService
      .confirm('Confirmation dialog box', this.message, ['Yes', 'No'])
      .subscribe((answer) => {
        this.answers.push(answer);
      });
  }

  /*  private handleError(error: HttpErrorResponse) {
    //this.confirm();

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  } */

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
    //console.log(results);
    this.dataList = results.data;
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
      action: 'submit',
      label: 'Submit',
      theme: 'primary',
    };

    let lot = {
      label: 'lot',
      widget: 'choicesjs',
      tableView: true,
      dataSrc: 'resource',
      /*
       data: {
        resource: '66f67387bad81693536044c3',
      },  */
      data: {
        resource: LotConfig.lotId,
      },

      valueProperty: 'data.lot',
      template: '<span>{{ item.data.lot }}</span>',
      /* validate: { //most vettem ki !!!!
        select: false,
      }, */
      validateWhenHidden: false,
      key: 'lot1',
      type: 'select',
      searchField: 'data.lot__regex',
      noRefreshOnScroll: false,
      addResource: false,
      reference: false,
      input: true,
    };

    let user = setTextfield('user');
    // user.customDefaultValue = "value = Formio.getUser().data.email;"
    //user.customDefaultValue = "value = localStorage.getItem(formioUser).data.email;"
    user.customDefaultValue = 'value = user.data.email;';
    user.disabled = true;

    newform.name = nfdata.Cikkszám + end;
    newform.title = nfdata.Cikkszám + ' (' + nfdata.Megnevezés + ')';
    newform.path = nfdata.Cikkszám + end;
    newform.components?.push(user);
    newform.components?.push(lot);

    let serial = setNumber('serial', '', 'serial');
    serial.label = 'serial';
    serial.key = 'serial';
    newform.components?.push(serial);

    for (let i = 0; i < Object.keys(nfdata).length / 3; i++) {
      if (nfdata['Tp-' + i] == 'n') {
        let numf = setNumber(nfdata['Par-' + i], nfdata['Tr-' + i], i);
        newform.components?.push(numf);
      } else if (nfdata['Tp-' + i] == 'b') {
        let chkb = setCheckbox(nfdata['Par-' + i], nfdata['Tr-' + i], i);
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

    function setNumber(par: string, tr: string, i: any) {
      //console.log(par);
      var nf = {
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
      };

      nf.label = par + '(' + tr + ')';
      nf.key = 'par' + i;
      return nf;
    }

    function setCheckbox(par: string, tr: string, i: any) {
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

    function setTextfield(par: string) {
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
      return tx;
    }
  }
}
