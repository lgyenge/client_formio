import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InplantViewComponent } from './inplant-view.component';

describe('InplantViewComponent', () => {
  let component: InplantViewComponent;
  let fixture: ComponentFixture<InplantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InplantViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InplantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
