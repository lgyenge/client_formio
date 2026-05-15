import { Component, OnInit } from '@angular/core';
import { LotExportService } from '../../lot-export.service';
import {
  FormioAppConfig,
  FormioForm,
  FormioService,
  FormioSubmission,
} from '@formio/angular';
import {
  DinetFormioForm,
  SheetData,
  LotForSignature,
  Tolerance,
} from '../../dinet_common';
import { FormioServiceFactoryService } from '../../formio-service-factory.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
})
export class ArchiveComponent implements OnInit {
  formioUser = JSON.parse(localStorage.getItem('formioUser') ?? '{}');
  services: FormioService[] = []; // | undefined;
  forms: DinetFormioForm[] = JSON.parse(localStorage.getItem('forms') ?? '[]');
  keys: (string | undefined)[] = [];
  labels: (string | undefined)[] = [];
  row: string[] = [];
  rows: string[][] = [];
  lot: string = localStorage.getItem('lot_no') || 'noLot';
  query = {
    params: {
      'data.lot1__eq': this.lot,
      limit: 100,
      sort: 'data.serial',
      skip: 0,
    },
  };

  sheetData: SheetData[] = [];
  lotForSignature: LotForSignature = {
    signers: [
      {
        firstName: this.formioUser?.data?.firstName || '',
        lastName: this.formioUser?.data?.lastName || 'unknown',
        reasonForSignature: 'Gyártás ellenőrizve',
        nameOfSigner: this.formioUser?.data?.email || 'unknown',
      },
    ],
    ProdSteps: [],
  };
  constructor(
    public appConfig: FormioAppConfig,
    private formioFactory: FormioServiceFactoryService,
    private lotExportService: LotExportService,
  ) {
    this.forms.forEach((form) => {
      //console.log(form);
      let formio = this.formioFactory.create(
        this.appConfig.appUrl + '/form/' + form._id,
      );

      this.services.push(formio);
    });
    console.log(this.services);
  }

  CreateTable(
    form: DinetFormioForm,
    submissions: FormioSubmission[],
  ): SheetData {
    let keys: string[] = [];
    let labels: string[] = [];
    let rows: string[][] = [];
    let tolerances: any[] = [];
    let sd: SheetData;
    form.components?.forEach((component) => {
      if (component.type !== 'button' && component.key !== 'lot1') {
        keys.push(component.key ?? '');
        labels.push(component.label ?? '');
        if (component['properties'] && component['properties'].nominalValue ) {
        //if (component['properties']) {
          console.log(component['properties'].nominalValue);

          //properties.push(component['properties'] as Tolerance);
            tolerances.push({
            nominalValue: component['properties'].nominalValue,
            toleranceMin: component['properties'].toleranceMin,
            toleranceMax: component['properties'].toleranceMax,
          }); 
        } else {
          tolerances.push(null);
        }
      }
    });
    //console.log('keys:' + keys);
    //console.log('labels:' + labels);
    submissions.forEach((submission) => {
      let row: any[] = [];
      /* key never undefined */
      keys.forEach((key) => {
        if (key !== undefined && key !== 'lot1') {
          /* pushed value undefined if data[key] not exist  */
          row.push(submission.data[key]);
        }
      });
      //console.log(row);
      rows.push(row);
    });
    sd = {
      lot: this.lot,
      file_name: form.name || '',
      keys: keys,
      labels: labels,
      tolerances: tolerances,
      rows: rows,
    };
    //console.log(sd);
    return sd;
  }

  ngOnInit(): void {
    this.services.forEach((service, index) => {
      service.loadSubmissions(this.query).subscribe((results) => {
        //console.log(results)
        //console.log(this.forms[index])
        this.sheetData.push(
          this.CreateTable(this.forms[index], results as FormioSubmission[]),
        );
        //console.log(this.sheetData);
      });
    });
    console.log(this.sheetData);
  }

  archiveToGS(): void {
    this.sheetData.sort((a, b) => {
      const nameA = (a.file_name ?? '').toUpperCase(); // ignore upper and lowercase
      const nameB = (b.file_name ?? '').toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    this.lotForSignature.ProdSteps = this.sheetData;
    this.lotExportService.exportLotToAlfresco(this.lotForSignature).subscribe({
      next: (blob: Blob) => {
        console.log('PDF Blob megérkezett:', blob.size, 'byte');

        // 1. URL létrehozása a Blob-ból
        const url = window.URL.createObjectURL(blob);

        // 2. Ideiglenes link elem létrehozása
        const link = document.createElement('a');
        link.href = url;

        // 3. Fájlnév beállítása (ha a szerverről nem jönne át)
        const fileName = `LOT_${this.lotForSignature.ProdSteps[0].lot}.pdf`;
        link.setAttribute('download', fileName);

        // 4. Szimulált kattintás a letöltéshez
        document.body.appendChild(link);
        link.click();

        // 5. Takarítás
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Hiba a PDF exportálásakor:', err);
        // Itt értesítheted a felhasználót (pl. Toast/SnackBar)
      },
    });
  }
}
