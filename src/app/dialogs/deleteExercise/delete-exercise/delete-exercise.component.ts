import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DbService } from '../../../services/db/db.service';
import { DataService } from '../../../services/dataservice/data.service';

@Component({
  selector: 'app-delete-exercise',
  templateUrl: './delete-exercise.component.html',
  styleUrl: './delete-exercise.component.scss',
  standalone: true,
  imports: [MatDialogTitle, MatButtonModule, MatIconModule],
})
export class DeleteExerciseComponent {
  data: any | {};
  constructor(
    public dialogRef: MatDialogRef<DeleteExerciseComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private db: DbService,
    private dataService: DataService
  ) {
    this.data = data;
  }

 async delete_Exercise() {
   await this.db.deleteExercise(this.data['exerciseId']);
   this.dataService.removeExercise(this.data['index']);
   this.dialogRef.close(this.data['index']);
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
