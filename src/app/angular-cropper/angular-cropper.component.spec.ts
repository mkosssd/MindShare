import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularCropperComponent } from './angular-cropper.component';

describe('AngularCropperComponent', () => {
  let component: AngularCropperComponent;
  let fixture: ComponentFixture<AngularCropperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AngularCropperComponent]
    });
    fixture = TestBed.createComponent(AngularCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
