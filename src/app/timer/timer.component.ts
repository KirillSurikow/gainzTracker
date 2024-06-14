import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { TimerService } from '../services/timer/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() startTime: number | undefined = 60;
  @Input() set start(value : boolean){
    if (value){
      this.startTimer();
    }
  }
  @Output() timerEnd = new EventEmitter<void>();
  @Output() timerStart = new EventEmitter<void>();
  @Output() timerStop = new EventEmitter<void>();
  @Output() timerReset = new EventEmitter<void>();

  timeLeft: number  = this.startTime ? this.startTime : 0;
  private timerSubscription: Subscription | undefined;
  private timerCancelSubscribtion : Subscription | undefined;

  constructor(private timer : TimerService){
    this.timer.cancelTimerEvent.subscribe((signal)=>{
      if(signal){
        this.stopTimer();
      }
    })
  }

  ngOnInit(): void {
    this.timeLeft = this.startTime ? this.startTime : 0;
  }

  startTimer() {
     if(this.timeLeft !== undefined){
      this.timerStart.emit();
      const timer$ = interval(1000);
      this.timerSubscription = timer$.subscribe(() => {
        if (this.timeLeft! > 0) {
          this.timeLeft!--;
        } else {
          this.stopTimer();
          this.timerEnd.emit();
        }
      });
     }
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerStop.emit();
    }
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeft = this.startTime ? this.startTime : 0;
    this.timerReset.emit();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    if(this.timerCancelSubscribtion){
      this.timer.cancelTimerEvent.unsubscribe();
    }
  }


}
