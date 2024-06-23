import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DataService } from '../services/dataservice/data.service';
import { Workout } from '../models/workout/workout';
import { KeyValue } from '@angular/common';
import { TrackingOption } from '../interfaces/tracking-option';
import { NgModel } from '@angular/forms';
import { TimerService } from '../services/timer/timer.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-execute-workout',
  templateUrl: './execute-workout.component.html',
  styleUrl: './execute-workout.component.scss',
})


export class ExecuteWorkoutComponent implements AfterViewInit, OnDestroy {
  workout: Workout | undefined;
  showStartscreen: boolean = true;
  showWorkoutMask: boolean = false;
  showTimer: boolean = false;
  invalidInputs: boolean = false;
  startTimer: boolean = false;
  startTimerSubscribtion: Subscription | undefined;
  isStopwatch: boolean = false;
  recognition: any;
  isListening: boolean = false;
  currentSpeechTarget: string | undefined;
  workoutFinished : boolean = false;

  @ViewChildren('progressInputs') progressInputs!: QueryList<NgModel>;

  keyvalueComparator = (
    a: KeyValue<string, TrackingOption>,
    b: KeyValue<string, TrackingOption>
  ): number => {
    return 0;
  };

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private timer: TimerService,
    private route : Router
  ) {
    this.initiateWorkout();
    this.initateTimerSub()
    this.initialeSpeechRecognition();
  }

  initiateWorkout(){
    this.workout = new Workout(
      this.dataService.workoutPlans[this.dataService.currentWOPlan!],
      this.timer,
      this.dataService
    );
  }

  initateTimerSub(){
    this.startTimerSubscribtion = this.timer.startTimerEvent.subscribe(
      (signal: boolean) => {
        if (signal) {
          this.startTimer = true;
        }
      }
    );
  }

  initialeSpeechRecognition(){
    const { webkitSpeechRecognition }: any = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'de-DE';

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        this.workout!.allSets[this.workout!.currentExerciseNumber][
          this.workout!.currentSetNumber
        ].results[this.currentSpeechTarget!]._value =
          this.processTranscript(transcript);
      }
    };
  }



  startListening(target: any) {
    if (this.isListening) return;
    this.currentSpeechTarget = target.key;
    this.isListening = true;
    this.recognition.start();
  }

  stopListening() {
    if (!this.isListening) return;
    this.isListening = false;
    this.recognition.stop();
  }

  processTranscript(transcript: string): string {
    transcript = transcript.replace(',', '.');
    const parsedValue = parseFloat(transcript);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      return parsedValue.toString();
    }
    return '';
  }

  ngOnDestroy(): void {
    if (this.startTimerSubscribtion) {
      this.timer.startTimerEvent.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  startWorkout() {
    this.showStartscreen = false;
    this.showWorkoutMask = true;
    this.workout!.goToNextExercise();
  }

  onTimerEnd() {
    this.workout!.showTimer = false;
    this.workout!.addSet();
  }

  onTimerReset() {
    this.workout!.showTimer = false;
    this.workout!.addSet();
  }

  nextSet() {
    this.invalidInputs = false;
    if (this.checkValidity()) {
      this.workout!.navigateOrAddSet();
    } else {
      this.invalidInputs = true;
      return;
    }
  }

  nextExercise() {
    this.invalidInputs = false;
    if (this.checkValidity()) {
      this.workout!.navigateOrAddEx();
    } else {
      this.invalidInputs = true;
      return;
    }
  }

  prevExercise() {
    this.workout!.navigatePrevExercise();
  }

  prevSet() {
    this.workout!.navigatePrevSet();
  }

  checkValidity() {
    let allValid = true;
    this.progressInputs.forEach((input) => {
      if (!input.valid) {
        allValid = false;
      }
    });
    return allValid;
  }

  skipExercise() {
    this.invalidInputs = false;
    this.workout!.navigateOrAddEx();
  }

  toggleTimerOrStoppwatch() {
    this.isStopwatch = !this.isStopwatch;
  }

  finishWorkout(){
    this.workout!.finishWorkout();
    this.workoutFinished = true;
  }

  returnToWorkout(){
    this.workoutFinished = false;
  }

  goToMain(){
    this.route.navigateByUrl('home/dashboard')
  }

  goToProgress(){
    this.route.navigateByUrl('home/progress')
  }
}
