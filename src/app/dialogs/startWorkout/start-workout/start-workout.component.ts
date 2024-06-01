import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { Exercise } from '../../../models/exercise/exercise';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.component.html',
  styleUrl: './start-workout.component.scss',
  standalone: true,
  imports: [MatDialogTitle, MatButtonModule, MatIconModule, NgFor],
})
export class StartWorkoutComponent {
  data: any | {};
  workoutName: string | undefined;
  allExercises: Exercise[] | [];
  index: number | undefined;
  constructor(
    public dialogRef: MatDialogRef<StartWorkoutComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.data = data.data;
    this.index = data.index;
    this.workoutName = this.data.workoutName;
    this.allExercises = this.data.allExercises;
  }

  startWorkout() {
    this.dialogRef.close(this.index);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
