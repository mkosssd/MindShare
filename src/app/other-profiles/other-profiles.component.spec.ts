import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OtherProfilesComponent } from './other-profiles.component'

describe('OtherProfilesComponent', () => {
  let component: OtherProfilesComponent
  let fixture: ComponentFixture<OtherProfilesComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherProfilesComponent]
    })
    fixture = TestBed.createComponent(OtherProfilesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
