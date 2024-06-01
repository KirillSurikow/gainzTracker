import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteWorkoutComponent } from './execute-workout.component';

describe('ExecuteWorkoutComponent', () => {
  let component: ExecuteWorkoutComponent;
  let fixture: ComponentFixture<ExecuteWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecuteWorkoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecuteWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
