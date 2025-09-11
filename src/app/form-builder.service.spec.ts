import { TestBed } from '@angular/core/testing';
import { FormBuilderService } from './form-builder.service';
import { AccessSetting } from '@formio/angular';
import { DinetFormioForm } from './dinet_common';

describe('FormBuilderService', () => {
  let service: FormBuilderService;

  const mockAccessSetting: AccessSetting = {
    type: 'read_all',
    roles: ['adminRoleId', 'userRoleId']
  };

  const mockSubmissionAccess: AccessSetting[] = [
    { type: 'create_all', roles: ['adminRoleId'] },
    { type: 'read_all', roles: ['userRoleId'] },
    { type: 'update_all', roles: ['adminRoleId'] },
    { type: 'delete_all', roles: ['adminRoleId'] },
    { type: 'create_own', roles: ['userRoleId'] },
    { type: 'read_own', roles: ['userRoleId'] },
    { type: 'update_own', roles: ['userRoleId'] },
    { type: 'delete_own', roles: ['userRoleId'] }
  ];

  const mockNfdata = {
    Cikkszám: 'ABCxx01',
    Megnevezés: 'Test Product',
    'Tp-0': 'n',
    'Par-0': 'Length',
    'Tr-0': 'mm',
    'No-0': 100,
    'Mi-0': 90,
    'Pl-0': 110,
    'Tp-1': 'b',
    'Par-1': 'Approved',
    'Tr-1': 'YN'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a form with expected fields', () => {
    const form: DinetFormioForm = service.generateForm(
      mockNfdata,
      mockAccessSetting,
      mockSubmissionAccess
    );

    expect(form).toBeTruthy();
    expect(form.name).toContain(mockNfdata.Cikkszám);
    expect(form.title).toContain(mockNfdata.Megnevezés);

    // components should include user, lot1, serial, and our generated fields
    const keys = form.components?.map(c => c.key) ?? [];
    expect(keys).toContain('user');
    expect(keys).toContain('lot1');
    expect(keys).toContain('serial');
    expect(keys).toContain('par0');  // numeric field
    expect(keys).toContain('par1');  // checkbox field
  });

  it('should attach access settings correctly', () => {
    const form: DinetFormioForm = service.generateForm(
      mockNfdata,
      mockAccessSetting,
      mockSubmissionAccess
    );

    expect(form.access?.[0]).toEqual(mockAccessSetting);
    expect(form.submissionAccess?.length).toBe(mockSubmissionAccess.length);
    expect(form.submissionAccess).toEqual(mockSubmissionAccess);
  });

  it('should generate header form with suffixes from subForms', () => {
    const subForms = [
      { Cikkszám: 'ABCxx01' },
      { Cikkszám: 'ABCxx02' },
      { Cikkszám: 'ABCNH' }
    ];

    const headerForm = service.generateHeaderForm(
      mockNfdata,
      subForms,
      mockAccessSetting,
      mockSubmissionAccess
    );

    expect(headerForm.name).toContain('xxH');
    expect(headerForm.components?.some(c => c.key?.startsWith('In'))).toBeTrue();
    expect(headerForm.components?.some(c => c.key?.startsWith('Out'))).toBeTrue();
  });
});
