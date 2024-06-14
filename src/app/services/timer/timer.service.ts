import { Injectable , EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  startTimerEvent: EventEmitter<any> = new EventEmitter();
  cancelTimerEvent : EventEmitter<any> = new EventEmitter();
  applyTimeEvent : EventEmitter<any> = new EventEmitter();

  constructor() { }
}
