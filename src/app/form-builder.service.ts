import { Injectable } from '@angular/core';
import { DinetFormioForm } from './dinet_common';
import { AccessSetting } from '@formio/angular';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  constructor() {}

  generateForm(
    nfdata: any,
    accessSetting: AccessSetting,
    submissionAccess: AccessSetting[]
  ): DinetFormioForm {
    const submit = {
      type: 'button',
      action: 'submit',
      label: 'Submit',
      theme: 'primary',
    };

    const user = this.setTextfield('user');
    user.customDefaultValue = 'value = user.data.email;';
    user.disabled = true;

    const lot = this.setTextfield('lot');
    lot.key = 'lot1';
    lot.disabled = true;

    const serial = this.setNumber('serial', '', 'serial');
    serial.label = 'serial';
    serial.key = 'serial';

    const newform: DinetFormioForm = {
      title: nfdata.Cikkszám + ' (' + nfdata.Megnevezés + ')',
      display: 'form',
      type: 'form',
      name: nfdata.Cikkszám,
      path: nfdata.Cikkszám,
      tags: ['common'],
      components: [user, lot, serial],
      access: [accessSetting],
      submissionAccess,
    };

    for (let i = 0; i < Object.keys(nfdata).length / 3; i++) {
      if (nfdata['Tp-' + i] === 'n') {
        newform.components?.push(
          this.setNumber(
            nfdata['Par-' + i],
            nfdata['Tr-' + i],
            i,
            nfdata['No-' + i],
            nfdata['Mi-' + i],
            nfdata['Pl-' + i]
          )
        );
      } else if (nfdata['Tp-' + i] === 'b') {
        newform.components?.push(
          this.setCheckbox(nfdata['Par-' + i], nfdata['Tr-' + i], i)
        );
      }
    }

    newform.components?.push(submit);
    return newform;
  }

  generateHeaderForm(
    nfdata: any,
    subForms: any[],
    accessSetting: AccessSetting,
    submissionAccess: AccessSetting[]
  ): DinetFormioForm {
    const submit = {
      type: 'button',
      action: 'submit',
      label: 'Submit',
      theme: 'primary',
    };

    const user = this.setTextfield('user');
    user.customDefaultValue = 'value = user.data.email;';
    user.disabled = true;

    const serial = this.setNumber('serial', '', 'serial');
    serial.label = 'serial';
    serial.key = 'serial';

    const lot = this.setTextfield('lot');
    lot.key = 'lot1';
    lot.disabled = true;

    if (!nfdata || !('Cikkszám' in nfdata)) {
      console.error('Invalid nfdata input', nfdata);
      return {} as DinetFormioForm;
    }

    const newform: DinetFormioForm = {
      display: 'form',
      type: 'form',
      name: nfdata.Cikkszám.substring(0, nfdata.Cikkszám.indexOf('xx')) + 'xxH',
      path: nfdata.Cikkszám.substring(0, nfdata.Cikkszám.indexOf('xx')) + 'xxH',
      title: nfdata.Cikkszám.substring(0, nfdata.Cikkszám.indexOf('xx')) + 'xxH',
      tags: ['common'],
      components: [user, serial, lot],
      access: [accessSetting],
      submissionAccess,
    };

    subForms.forEach((form: any, i: number) => {
      let suffix = 'NH';
      if (form.Cikkszám?.includes('xx')) {
        suffix = form.Cikkszám.substring(form.Cikkszám.indexOf('xx') + 2);
      }

      const numIn = this.setNumber('aa' + i, 'In', i);
      numIn.label = 'In-' + suffix;
      numIn.key = 'In' + suffix;

      const numOut = this.setNumber('#' + i, 'Out', i);
      numOut.label = 'Out-' + suffix;
      numOut.key = 'Out' + suffix;

      newform.components?.push(numIn, numOut);
    });

    newform.components?.push(submit);
    return newform;
  }

  private setTextfield(par: string) {
    return {
      type: 'textfield',
      label: par,
      key: par,
      input: true,
      hidden: false,
      disabled: false,
      customDefaultValue: '',
    };
  }

  private setCheckbox(par: string, tr: string, i: number) {
    return {
      label: `${par} (${tr})`,
      tableView: true,
      key: 'par' + i,
      type: 'checkbox',
      input: true,
    };
  }

  private setNumber(
    par: string,
    tr: string,
    i: any,
    nominalValue?: number,
    toleranceMin?: number,
    toleranceMax?: number
  ) {
    return {
      input: true,
      tableView: true,
      inputType: 'number',
      label: `${par} (${tr})`,
      key: 'par' + i,
      type: 'number',
      properties: {
        nominalValue,
        toleranceMin,
        toleranceMax,
      },
    };
  }
}
