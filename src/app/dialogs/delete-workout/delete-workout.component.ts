import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from './../../services/dataservice/data.service';

@Component({
  selector: 'app-delete-exercise',
  templateUrl: './delete-workout.component.html',
  styleUrl: './delete-workout.component.scss',
  standalone: true,
  imports: [MatDialogTitle, MatButtonModule, MatIconModule],
})
export class DeleteWorkoutComponent {
  data: any | {};
  constructor(
    public dialogRef: MatDialogRef<DeleteWorkoutComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dataService: DataService
  ) {
    this.data = data;
  }

 async delete_workout() {
     this.dataService.delete_Workout(this.data.workoutIndex);
     this.dialogRef.close(this.data.workoutIndex)
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
