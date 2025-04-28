import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Meo2Component } from './meo2.component';

describe('Meo2Component', () => {
  let component: Meo2Component;
  let fixture: ComponentFixture<Meo2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Meo2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Meo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
