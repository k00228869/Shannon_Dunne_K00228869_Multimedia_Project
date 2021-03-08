import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBusinessViewComponent } from './profile-business-view.component';

describe('ProfileBusinessViewComponent', () => {
  let component: ProfileBusinessViewComponent;
  let fixture: ComponentFixture<ProfileBusinessViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileBusinessViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBusinessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
