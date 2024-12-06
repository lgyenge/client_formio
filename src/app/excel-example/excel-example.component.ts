/* import { Component } from '@angular/core';

@Component({
  selector: 'app-excel-example',
  templateUrl: './excel-example.component.html',
  styleUrl: './excel-example.component.scss'
})
export class ExcelExampleComponent {

} */

import { Component } from '@angular/core';
import { ExcelService } from '../excel.service';

@Component({
  selector: 'app-excel-example',
  template: `
    <button (click)="exportToExcel()">Export to Excel</button>
  `,
})
export class ExcelExampleComponent {
  data = [
    { Name: 'John Doe', Age: 30, City: 'New York' },
    { Name: 'Jane Smith', Age: 25, City: 'San Francisco' },
    // Add more data as needed
  ];
  constructor(private excelService: ExcelService) {}
  exportToExcel(): void {
    //this.excelService.generateExcel(this.data, 'user_data');
  }
}
