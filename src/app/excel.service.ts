import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  generateExcel(
    lot: string,
    fileName: string,
    keys: any,
    labels: any,
    lines: any
  ): void {
    const workbook = new ExcelJS.Workbook();
    let file = fileName+'_'+ lot;

    // Create worksheets with headers and footers
    /* var sheet = workbook.addWorksheet('sheet', {
  headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"}
}); */

    //const worksheet = workbook.addWorksheet('Sheet 1');
    // create new sheet with pageSetup settings for A4 - landscape
    let worksheet = workbook.addWorksheet('sheet', {
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
        printTitlesColumn: 'A:B',
      },
      /* Nem működik, talán mert nincs bekepcsolva az élőfej */
      headerFooter: {
        firstHeader: 'Biotech GmbH',
        firstFooter: 'Támogató: Dinet Kft',
      },
    });

    // Add headers
    worksheet.addRow(['Cikkszám:', fileName]);
    worksheet.addRow(['Lot Number:', lot]);
    worksheet.addRow(labels);
    worksheet.addRows(lines);

    for (let i = 0; i < 60; i++) {
      worksheet.addRow(lines[0]);
    }

    /*worksheet.getColumn(2).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }; */


    //worksheet.getColumn(2).width = 20;




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

    let rowCnt = worksheet.rowCount

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

    worksheet.columnCount
    worksheet.columns.forEach (element => {
      element.width = 10
      element.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

    })


    // Save the workbook to a blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }
}
