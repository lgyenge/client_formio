import { ComponentFixture, TestBed } from '@angular/core/testing';

import { implantViewComponent } from './implant-view.component';

describe('implantViewComponent', () => {
  let component: implantViewComponent;
  let fixture: ComponentFixture<implantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [implantViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(implantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
