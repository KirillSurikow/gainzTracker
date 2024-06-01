import { Component } from '@angular/core';
import { DataService } from '../services/dataservice/data.service';
import { Workout } from '../models/workout/workout';

@Component({
  selector: 'app-execute-workout',
  templateUrl: './execute-workout.component.html',
  styleUrl: './execute-workout.component.scss',
})
export class ExecuteWorkoutComponent {
  workout: Workout;
  showStartscreen : boolean = true;
  showWorkoutMask : boolean = false;

  constructor(private dataService: DataService) {
    this.workout = new Workout(
      this.dataService.workoutPlans[this.dataService.currentWOPlan!]
    );
  }

  startWorkout(){
     this.showStartscreen = false;
     this.showWorkoutMask = true;
  }
}
