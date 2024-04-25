import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceResourceComponent } from './device-resource.component';

describe('DeviceResourceComponent', () => {
  let component: DeviceResourceComponent;
  let fixture: ComponentFixture<DeviceResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceResourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeviceResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
