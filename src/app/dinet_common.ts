import { FormioForm } from './formio.common';

export interface DinetFormioForm extends FormioForm {
  _id?: string
  modified?: Date
  data?: any
}

export interface SheetData {
  lot: string
  file_name: string
  keys: string[]
  labels: string[]
  rows: any
}

export interface TableData {
  data: number
  componentType:string
  limit: Limit
}

export interface Limit {
  key: string
  nominalValue: number 
  lowerRedLimit: number
  upperRedLimit: number
  lowerYellowLimit: number
  upperYellowLimit: number

}

export interface Suffix {
  formId?: string
  name? : string
  inCnt?: number
  outCnt?: number
  headerSubmission?:any
}
