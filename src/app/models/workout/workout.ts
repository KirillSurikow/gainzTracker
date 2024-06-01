import { Exercise } from '../exercise/exercise';
import { WorkoutPlan } from '../workoutPlan/workout-plan';
import { DatePipe } from '@angular/common';

export class Workout {
  woName: string | undefined;
  plan: Exercise[] | [];
  currentExercise: number = 0;
  date: string | null;
  datePipe : DatePipe;

  constructor(woPlan: WorkoutPlan) {
    this.woName = woPlan.workoutName;
    this.plan = woPlan.allExercises;
    this.datePipe = new DatePipe('en-us')
    this.date = this.datePipe.transform(new Date(), 'dd.MM.yyyy');
    console.log(this.date)
  }
}
