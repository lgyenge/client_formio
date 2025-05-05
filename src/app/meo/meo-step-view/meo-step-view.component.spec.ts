import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoStepViewComponent } from './meo-step-view.component';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { FormioModule } from '@formio/angular';
import { AppModule } from '../../app.module'; // Adjust the path as necessary


describe('MeoStepViewComponent', () => {
  let component: MeoStepViewComponent;
  let fixture: ComponentFixture<MeoStepViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoStepViewComponent],
      imports: [
        AppModule,
        FormioModule,
      ],

    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoStepViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
