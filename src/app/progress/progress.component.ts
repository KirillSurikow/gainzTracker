import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { DataService } from '../services/dataservice/data.service';
import { Exercise } from '../models/exercise/exercise';
import { WorkoutPlan } from '../models/workoutPlan/workout-plan';
import { Router } from '@angular/router';


type ProgressRequest = {
  [key: string]: {
    id: string;
    name: string;
  };
};

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {
  allExercises: Exercise[] = [];
  workoutPlans: WorkoutPlan[] = [];
  searchExpression: string | undefined;
  showAllExercises: boolean = true;
  allProgressRequest: ProgressRequest = {};
  mainCheckboxStates: { [key: string]: boolean } = {};
  expansionStates: { [key: string]: boolean } = {};
  exerciseCheckboxStates: { [key: string]: boolean } = {};
  @ViewChildren('checkboxRef', { read: ElementRef })
  checkboxes!: QueryList<ElementRef>;
  timeSpanInWeeks : number = 4;
  showDiagramm : boolean = false;

  constructor(private dataService: DataService, private router : Router) {
    if (this.dataService.woPlansNotUptoDate) {
      this.get_exercises_And_Workouts();
    } else {
      this.allExercises = this.dataService.exercises;
      this.workoutPlans = this.dataService.workoutPlans;
    }
  }

  async get_exercises_And_Workouts() {
    await this.dataService.getExercisesAndWorkouts();
    this.allExercises = this.dataService.exercises;
    this.workoutPlans = this.dataService.workoutPlans;
    this.dataService.woPlansNotUptoDate = false;
  }

  includesSearch(exercise: any) {
    if (this.searchExpression === '' || this.searchExpression === undefined) {
      return true;
    } else {
      return (
        exercise.exerciseName.includes(this.searchExpression) ||
        exercise.exerciseCategory.includes(this.searchExpression) ||
        exercise.exerciseCategoryCustom.includes(this.searchExpression) ||
        this.checkMuscles(exercise.targetedMuscles)
      );
    }
  }

  checkMuscles(muscles: any): boolean {
    if (this.searchExpression) {
      for (const muscle in muscles) {
        if (
          muscles.hasOwnProperty(muscle) &&
          muscle.includes(this.searchExpression) &&
          muscles[muscle]
        ) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  toggleFilter() {
    this.showAllExercises = !this.showAllExercises;
  }

  toggleForAnalysis(
    exerciseName: string | undefined,
    exerciseId: string | undefined,
    source: boolean,
    workoutName?: string | undefined
  ) {
    const shouldCheck = this.mainCheckboxStates[workoutName!];
    if (source && shouldCheck) {
      this.allProgressRequest[exerciseId!] = {
        id: exerciseId!,
        name: exerciseName!,
      };
      this.exerciseCheckboxStates[exerciseId!] = true;
    } else if (source && !shouldCheck) {
      delete this.allProgressRequest[exerciseId!];
      this.exerciseCheckboxStates[exerciseId!] = false;
    } else if (
      !source &&
      Object.keys(this.allProgressRequest).includes(exerciseId!)
    ) {
      delete this.allProgressRequest[exerciseId!];
      this.exerciseCheckboxStates[exerciseId!] = false;
    } else {
      this.allProgressRequest[exerciseId!] = {
        id: exerciseId!,
        name: exerciseName!,
      };
      this.exerciseCheckboxStates[exerciseId!] = true;
    }
  }

  toggleAllForAnalysis(workoutName: string, length: number) {
    const shouldCheck = this.mainCheckboxStates[workoutName];

    for (let index = 0; index < length; index++) {
      const checkboxId = workoutName + '-' + index;
      this.exerciseCheckboxStates[checkboxId] = shouldCheck;

      const checkboxElement = document.getElementById(checkboxId);
      if (checkboxElement) {
        const exerciseName = checkboxElement.getAttribute('exercise');
        const exerciseId = checkboxElement.getAttribute('exerciseId');
        this.toggleForAnalysis(exerciseName!, exerciseId!, true, workoutName);
      }
    }
  }

  toogleWorkout(workout: string) {
    if (this.expansionStates[workout] !== true) {
      this.expansionStates[workout] = true;
    } else {
      this.expansionStates[workout] = false;
    }
  }

  initateDiagramm() {
    if(Object.keys(this.allProgressRequest).length === 0){
      return;
    }
    this.dataService.initiateRequest(this.allProgressRequest, this.timeSpanInWeeks);

  }

  goToMain(){
    this.router.navigateByUrl('home/dashboard')
  }
}
