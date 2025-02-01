import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { SheetData } from './dinet_common';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  generateExcel(
    sheetData: SheetData[]
  ): void {
    const workbook = new ExcelJS.Workbook();
    //console.log('lot:' + sheetData[0].lot);
    let file = sheetData[0].file_name + '_' + sheetData[0].lot;

    sheetData.forEach((sheet, index) => {

    let lot: string = sheet.lot;
    let file_name = sheet.file_name;
    let keys = sheet.keys;
    let labels= sheet.labels;
    let lines= sheet.rows;
      // Create worksheets with headers and footers
      // create new sheet with pageSetup settings for A4 - landscape
      let worksheet = workbook.addWorksheet(sheet.file_name, {
        headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"},
        pageSetup: {
          paperSize: 9,
          orientation: 'landscape',
          //fitToPage: true,
          //horizontalCentered: true,
          //showGridLines: true,
          //fitToHeight: 1,
          //fitToWidth: 1,
          //showRowColHeaders: true;
          /* Repeat specific rows on every printed page */
          printTitlesRow: '1:3',
          printTitlesColumn: 'A:B'
        },
        /* A headerFooter Nem működik, talán mert nincs bekepcsolva az élőfej, de ha utólag
        bekapcsolom az nem jó, előre pedig nem tudom hogyan lehet bekapcsolni */
               /*  headerFooter: {
          firstHeader: 'Biotech GmbH',
          firstFooter: 'Támogató: Dinet Kft',
        }, */
      });

      // Add headers
      worksheet.addRow(['Cikkszám:', file_name]);
      worksheet.addRow(['Lot Number:', lot]);
      worksheet.addRow(labels);
      worksheet.addRows(lines);


      /*!!!!  only for demo !!!! */
      /* for (let i = 0; i < 20; i++) {
        worksheet.addRow(lines[0]);
      } */


      worksheet.getRows(1, 2)?.forEach((element) => {
        element.font = {
          family: 4,
          size: 7,
          underline: true,
          bold: true,
        };
      });

      worksheet.getRows(3, 3)?.forEach((element) => {
        element.font = {
          family: 4,
          size: 7,
          bold: true,
        };
        element.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      let rowCnt = worksheet.rowCount;

      worksheet.getRows(4, rowCnt)?.forEach((element) => {
        element.font = {
          //name: 'Comic Sans MS',
          family: 4,
          size: 7,
          //underline: true,
          //bold: true
        };
        element.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      worksheet.columnCount;
      worksheet.columns.forEach((element) => {
        element.width = 10;
        element.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      });
    });

    // Save the workbook to a blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `${file}.xlsx`);
    });
  }
}
