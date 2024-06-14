import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerAndStoppWatchComponent } from './timer-and-stopp-watch.component';

describe('TimerAndStoppWatchComponent', () => {
  let component: TimerAndStoppWatchComponent;
  let fixture: ComponentFixture<TimerAndStoppWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerAndStoppWatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimerAndStoppWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
