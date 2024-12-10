import { FormioForm } from './formio.common';

export interface DinetFormioForm extends FormioForm {
 _id? : string
 modified?: Date
}

export interface SheetData  {
  lot : string
  file_name: string
  keys: string []
  labels: string []
  rows: any
 }
