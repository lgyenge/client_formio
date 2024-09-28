import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormioService } from '@formio/angular';

@Component({
  selector: 'app-find-form',
  templateUrl: './find-form.component.html',
  styleUrl: './find-form.component.scss',
})
export class FindFormComponent implements OnInit {
  onAction($event: object) {
    throw new Error('Method not implemented.');
  }
  onSelect($event: object) {
    throw new Error('Method not implemented.');
  }
  onCreateItem() {
    throw new Error('Method not implemented.');
  }
  searchForm!: FormGroup;

  //ez jó
 /*  url: string =
    'http://localhost:3001/form/6667f2485c21eb33b437b508/submission';
  query = {params: { 'data.lot': 'NO111' } };
  url1: string = 'http://localhost:3001';
  query1: any = {
    params: { title__regex: '/151/i', tags__eq: ['valami'], type: 'form' },
  };
  service: FormioService; */

  constructor(private fb: FormBuilder) {
    //ez jó
   /*  this.service = new FormioService(this.url);
    console.log('service', this.service); */
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      name: ['', Validators.required],
      lot: [''],
      serial: [
        '',
        [Validators.required, Validators.max(99), Validators.min(1)],
      ],
    });
  /*   ez jó
    this.service.loadForms(this.query1).subscribe((res: any) => {
      console.log('res', res);
    }); */
   /*  this.service.loadSubmissions(this.query).subscribe((res: any) => {
      console.log('res', res);
    }); */

  }
  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('Name', form.value.name);
    console.log('Lot', form.value.lot);
    console.log('Serial', form.value.serial);
  }
}
