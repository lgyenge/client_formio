import { FormioForm } from './formio.common';

export interface DinetFormioForm extends FormioForm {
  _id?: string
  modified?: Date
  data?: any
}

export interface Submission {
  _id?: string;
  data: { [key: string]: string | number | boolean };
}

export interface SheetData {
  lot: string
  file_name: string
  keys: string[]
  labels: string[]
  tolerances: any[] //  tolerances can be null or object with nominalValue, toleranceMin and toleranceMax
  rows: any
}

export interface Tolerance {
 nominalValue: number
 toleranceMin: number
 toleranceMax: number
}

export interface LotForSignature {
  signers: Signer[]
  ProdSteps: SheetData []
}

export interface Signer {
  firstName: string
  lastName: string
  reasonForSignature: string
  nameOfSigner: string
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
