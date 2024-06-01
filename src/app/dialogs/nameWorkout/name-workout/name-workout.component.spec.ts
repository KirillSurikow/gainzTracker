import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameWorkoutComponent } from './name-workout.component';

describe('NameWorkoutComponent', () => {
  let component: NameWorkoutComponent;
  let fixture: ComponentFixture<NameWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NameWorkoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NameWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
