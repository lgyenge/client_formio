import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadComponent } from './upload.component';
import { AppModule } from '../app.module'; // Adjust the path as necessary
import { MatIconModule } from '@angular/material/icon';



describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
            imports: [
              AppModule,
              MatIconModule
            ],
      
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
