import { Component, OnInit } from '@angular/core';
import { FormioAppConfig } from '@formio/angular';
import { Papa } from 'ngx-papaparse';
import { DinetFormioForm } from '../dinet_common';
import { UploadService } from '../upload.service';
import { LotConfig } from '../../config';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {
  chunk: any;
  file: string = '';
  public importedData: Array<any> = [];
  formToUpload: DinetFormioForm | undefined;
  dataList: any;

  constructor(
    public appConfig: FormioAppConfig,
    private papa: Papa,
    private upload: UploadService
  ) {}

  ngOnInit(): void {
    const obj = this;

    //throw new Error('Method not implemented.');
  }

  uploadForm() {
    this.dataList.forEach((element: any) => {
      this.formToUpload = this.generateForm(element);
      this.upload.uploadForm(this.formToUpload).subscribe((result) => {
        //console.log(result);
      });
    });
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
        //console.log(results);
        this.dataList = results.data;
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
      access: [
        {
          type: 'read_all',
          roles: [
            '66615ebd567532322b440b21',
            '66615ebd567532322b440b25',
            '66615ebd567532322b440b29',
          ],
        },
      ],
      submissionAccess: [
        {
          type: 'create_all',
          roles: [],
        },
        {
          type: 'read_all',
          roles: ['66615ebd567532322b440b25'],
        },
        {
          type: 'update_all',
          roles: [],
        },
        {
          type: 'delete_all',
          roles: [],
        },
        {
          type: 'create_own',
          roles: ['66615ebd567532322b440b25'],
        },
        {
          type: 'read_own',
          roles: ['66615ebd567532322b440b25'],
        },
        {
          type: 'update_own',
          roles: ['66615ebd567532322b440b25'],
        },
        {
          type: 'delete_own',
          roles: ['66615ebd567532322b440b25'],
        },
      ],
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
