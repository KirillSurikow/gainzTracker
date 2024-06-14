import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingProgressChartComponent } from './training-progress-chart.component';

describe('TrainingProgressChartComponent', () => {
  let component: TrainingProgressChartComponent;
  let fixture: ComponentFixture<TrainingProgressChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingProgressChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingProgressChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
