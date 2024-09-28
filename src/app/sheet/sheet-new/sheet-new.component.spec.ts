import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetNewComponent } from './sheet-new.component';

describe('SheetNewComponent', () => {
  let component: SheetNewComponent;
  let fixture: ComponentFixture<SheetNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SheetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
