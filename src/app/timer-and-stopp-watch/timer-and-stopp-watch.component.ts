import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, min, Subscription } from 'rxjs';
import { TimerService } from '../services/timer/timer.service';

@Component({
  selector: 'app-timer-and-stopp-watch',
  templateUrl: './timer-and-stopp-watch.component.html',
  styleUrl: './timer-and-stopp-watch.component.scss'
})
export class TimerAndStoppWatchComponent {
  @Input() initialTime: number = 0;
  @Input() isStopwatch: boolean = false;
  @Output() timerStart: EventEmitter<void> = new EventEmitter();
  @Output() timerEnd: EventEmitter<void> = new EventEmitter();
  @Output() timeUpdate: EventEmitter<string> = new EventEmitter();

  constructor(private timer : TimerService){
    this.minutes = 1;
    this.seconds = 0;
  }

  private timeLeft: number = 0;
  private timerSubscription: Subscription | undefined;
  time: string = '00:00';
  minutes : number = 0;
  seconds : number = 0;

  formatNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }

  adjustTime(){
    this.initialTime = (this.minutes * 60) + this.seconds;
    this.time = this.formatTime(this.initialTime);
  }

  ngOnInit(): void {
    this.timeLeft = this.initialTime;
    this.time = this.formatTime(this.timeLeft);
  }

  start(): void {
    this.timerStart.emit();
    const timer$ = interval(1000);
    this.timerSubscription = timer$.subscribe(() => {
      if (this.isStopwatch) {
        this.timeLeft++;
      } else {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stop();
          this.timerEnd.emit();
        }
      }
      this.time = this.formatTime(this.timeLeft);
      this.timeUpdate.emit(this.time);
    });
  }

  stop(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  reset():void{
    this.stop();
    this.timeLeft = this.initialTime;
    this.time = this.formatTime(this.timeLeft);
  }

  apply(){
    if(this.isStopwatch){
      this.timer.applyTimeEvent.emit(this.timeLeft);
    }else{
      this.timer.applyTimeEvent.emit(this.initialTime);
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

}
