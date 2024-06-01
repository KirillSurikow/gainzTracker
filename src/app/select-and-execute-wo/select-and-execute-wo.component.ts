import { Component, QueryList, ViewChildren } from '@angular/core';
import { Exercise } from '../models/exercise/exercise';
import { WorkoutPlan } from '../models/workoutPlan/workout-plan';
import { DataService } from '../services/dataservice/data.service';
import { MatDialog } from '@angular/material/dialog';
import { StartWorkoutComponent } from '../dialogs/startWorkout/start-workout/start-workout.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-and-execute-wo',
  templateUrl: './select-and-execute-wo.component.html',
  styleUrl: './select-and-execute-wo.component.scss',
})
export class SelectAndExecuteWOComponent {
  allExercises: Exercise[] = [];
  workoutPlans: WorkoutPlan[] = [];

  @ViewChildren('exerciseCard') workoutCards!: QueryList<any>;

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private router: Router
  ) {
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

  openPreview(data: WorkoutPlan, i: number) {
    const dialogRef = this.dialog.open(StartWorkoutComponent, {
      data: { data, index: i },
      height: '510px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((wo: number) => {
      if (wo !== undefined) {
        this.dataService.currentWOPlan = wo;
        this.router.navigateByUrl('home/executeWorkout')
      }
    });
  }
}
