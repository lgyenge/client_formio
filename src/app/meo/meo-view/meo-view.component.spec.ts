import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoViewComponent } from './meo-view.component';
import { FormioModule } from '@formio/angular';
import { AppModule } from '../../app.module'; // Adjust the path as necessary


describe('MeoViewComponent', () => {
  let component: MeoViewComponent;
  let fixture: ComponentFixture<MeoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoViewComponent],
      imports: [
        AppModule,
        FormioModule,
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
