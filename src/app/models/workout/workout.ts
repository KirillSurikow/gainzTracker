import { DataService } from '../../services/dataservice/data.service';
import { TimerService } from '../../services/timer/timer.service';
import { Exercise } from '../exercise/exercise';
import { Marks } from '../marks/marks';
import { Set } from '../set/set';
import { WorkoutPlan } from '../workoutPlan/workout-plan';
import { DatePipe } from '@angular/common';

type AllSets = {
  [key: number]: Set[];
};

export class Workout {
  woName: string | undefined;
  plan: Exercise[] | [];
  date: string | null;
  datePipe: DatePipe;
  currentSet: Set | undefined;
  allSets: AllSets;
  exerciseMark: number = -1;
  setMark: number = -1;
  currentExerciseNumber: number = -1;
  currentSetNumber: number = -1;
  totalSetsOfCurrentExercise: number = 0;
  finalExercise: boolean = false;
  showTimer: boolean = false;
  provideTimerOrStoppwatch: boolean = false;

  constructor(
    woPlan: WorkoutPlan,
    private timer: TimerService,
    private dataService: DataService
  ) {
    this.woName = woPlan.workoutName;
    this.plan = woPlan.allExercises;
    this.datePipe = new DatePipe('en-us');
    this.date = this.datePipe.transform(new Date(), 'dd.MM.yyyy');
    this.allSets = {};
    this.timer.applyTimeEvent.subscribe((time: number) => {
      if (
        Object.keys(
          this.allSets[this.currentExerciseNumber][this.currentSetNumber]
            .results
        ).includes('time_inSmin')
      ) {
        this.allSets[this.currentExerciseNumber][this.currentSetNumber].results[
          'time_inSmin'
        ]['_value'] = time;
      } else {
        this.allSets[this.currentExerciseNumber][this.currentSetNumber].results[
          'time_inSmax'
        ]['_value'] = time;
      }
    });
  }

  navigateOrAddEx() {
    console.log(this.plan.length, this.currentExerciseNumber)
    if (this.plan.length === this.currentExerciseNumber + 2) {
      this.finalExercise = true;
    }
    if (this.exerciseMark === this.currentExerciseNumber) {
      this.currentSetNumber = -1;
      this.setMark = -1;
      this.goToNextExercise();
    } else {
      this.currentExerciseNumber++;
      this.currentSetNumber = 0;
      this.totalSetsOfCurrentExercise =
        this.allSets[this.currentExerciseNumber].length;
      this.isTimerOrWatchNeeded();
    }
  }

  navigateOrAddSet() {
    if (
      this.exerciseMark === this.currentExerciseNumber &&
      this.allSets[this.currentExerciseNumber].length ===
        this.currentSetNumber + 1
    ) {
      this.showTimer = true;
      this.timer.startTimerEvent.emit(true);
    } else if (
      this.currentSetNumber + 1 === this.totalSetsOfCurrentExercise &&
      this.exerciseMark !== this.currentExerciseNumber
    ) {
      this.showTimer = true;
      this.timer.startTimerEvent.emit(true);
    } else {
      this.currentSetNumber++;
    }
  }

  goToNextExercise() {
    this.exerciseMark++;
    this.currentExerciseNumber++;
    this.addSet();
    this.totalSetsOfCurrentExercise =
      this.allSets[this.currentExerciseNumber].length;
    this.isTimerOrWatchNeeded();
  }

  addSet() {
    if (!this.allSets[this.exerciseMark]) {
      this.allSets[this.exerciseMark] = [];
    }
    this.allSets[this.currentExerciseNumber].push(
      new Set(this.plan[this.currentExerciseNumber], this.setMark, this.date)
    );
    this.totalSetsOfCurrentExercise =
      this.allSets[this.currentExerciseNumber].length;
    this.setMark++;
    this.currentSetNumber++;
    console.log(this.setMark, this.currentExerciseNumber, this.allSets[this.currentExerciseNumber][this.currentSetNumber], this.currentSetNumber)
  }

  navigatePrevExercise() {
    this.currentExerciseNumber--;
    this.totalSetsOfCurrentExercise =
      this.allSets[this.currentExerciseNumber].length;
    this.currentSetNumber = this.totalSetsOfCurrentExercise - 1;
    this.finalExercise = false;
  }

  navigatePrevSet() {
    if (this.currentExerciseNumber === 0 && this.currentSetNumber === 0) {
      return;
    } else if (this.currentSetNumber === 0) {
      this.currentExerciseNumber--;
      this.totalSetsOfCurrentExercise =
        this.allSets[this.currentExerciseNumber].length;
      this.currentSetNumber = this.totalSetsOfCurrentExercise - 1;
      this.finalExercise = false;
    } else {
      this.currentSetNumber--;
    }
  }

  deleteSet() {
    if (this.totalSetsOfCurrentExercise === 1) {
      return;
    }
    let arr = this.allSets[this.currentExerciseNumber];
    this.showTimer = false;
    this.timer.cancelTimerEvent.emit(true);
    arr.splice(this.currentSetNumber, 1);
    if (this.currentSetNumber !== 0) {
      this.currentSetNumber--;
    } else {
      this.currentSetNumber = 0;
    }
    this.totalSetsOfCurrentExercise =
      this.allSets[this.currentExerciseNumber].length;
  }

  isTimerOrWatchNeeded() {
    if (
      this.plan[this.currentExerciseNumber].trackingOptions.time_inSmin
        ._value === true ||
      this.plan[this.currentExerciseNumber].trackingOptions.time_inSmax
        ._value === true
    ) {
      this.provideTimerOrStoppwatch = true;
    } else {
      this.provideTimerOrStoppwatch = false;
    }
  }

  finishWorkout() {
    this.updateExercises();
    this.dataService.updateRecordsOfExercise(this.plan);
    this.dataService.updateProgress(this.allSets);
  }

  updateExercises() {
    let exerciseNumer: number;
    Object.entries(this.allSets).forEach((element) => {
      element.forEach((element) => {
        if (typeof element === 'string') {
          exerciseNumer = Number(element);
        } else {
          element.forEach((set, index) => {
            this.plan[exerciseNumer].records[index] = new Marks(set);
          });
        }
      });
    });
  }

  adopt(value: string, key: string) {
    this.allSets[this.currentExerciseNumber][this.currentSetNumber].results[
      key
    ]._value = Number(value);
  }
}
