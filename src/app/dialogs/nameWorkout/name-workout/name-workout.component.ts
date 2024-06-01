import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-name-workout',
  templateUrl: './name-workout.component.html',
  styleUrl: './name-workout.component.scss',
})
export class NameWorkoutComponent {
  workoutName : string | undefined;

  constructor(    public dialogRef: MatDialogRef<NameWorkoutComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,){}
  onSubmit(form : NgForm) {
    this.dialogRef.close(form.value.workoutName)
  }
}
