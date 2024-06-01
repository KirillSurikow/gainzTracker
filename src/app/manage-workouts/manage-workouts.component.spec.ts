import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkoutsComponent } from './manage-workouts.component';

describe('ManageWorkoutsComponent', () => {
  let component: ManageWorkoutsComponent;
  let fixture: ComponentFixture<ManageWorkoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageWorkoutsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageWorkoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
