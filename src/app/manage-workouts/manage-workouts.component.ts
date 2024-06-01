import { Component, ViewChildren, OnInit, OnDestroy } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { filter } from 'rxjs/operators';
import { DataService } from '../services/dataservice/data.service';
import { WorkoutPlan } from '../models/workoutPlan/workout-plan';
import { MatDialog } from '@angular/material/dialog';
import { NameWorkoutComponent } from '../dialogs/nameWorkout/name-workout/name-workout.component';
import { flyInAndOut } from '../animations/cardanimations';
import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Exercise } from '../models/exercise/exercise';
import { DeleteWorkoutComponent } from '../dialogs/delete-workout/delete-workout.component';
import { ChangeDetectorService } from '../services/changeDetector/change-detector.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-workouts',
  templateUrl: './manage-workouts.component.html',
  styleUrl: './manage-workouts.component.scss',
  animations: [flyInAndOut],
})
export class ManageWorkoutsComponent implements OnInit, OnDestroy {
  allExercises: Exercise[] = [];
  searchExpression: string | undefined;
  workoutPlans: WorkoutPlan[] = [];
  currentWorkout: WorkoutPlan | undefined;
  hasWorkoutPlans: boolean = false;
  addFirstExercise: boolean = true;
  workoutCardShow: boolean = false;
  currentWorkoutValueString: string | undefined;

  @ViewChildren('exerciseCard') workoutContainer!: HTMLDivElement;

  // private routerSubscription: Subscription | undefined;
  private destroy$ = new Subject<void>

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorService
  ) {
    if (this.dataService.woPlansNotUptoDate) {
      this.get_exercises_And_Workouts();
    } else {
      this.allExercises = this.dataService.exercises;
      this.workoutPlans = this.dataService.workoutPlans;
    }
  }

  returnToDashboard() {
    this.checkIsChangeSaved();
  }

  checkIsChangeSaved() {
    if (this.dataService.woPlansNotUptoDate) {
      this.saveChanges();
      this.changeDetector.changeDetected(false);
    }
  }

  ngOnInit(): void {
    // this.routerSubscription = this.router.events
    //   .pipe(
    //     filter(
    //       (event): event is NavigationEnd => event instanceof NavigationEnd
    //     )
    //   )
    //   .subscribe((event: NavigationEnd) => {
    //     this.onRouteChange();
    //   });

  this.changeDetector.saveEvent.pipe(takeUntil(this.destroy$)).subscribe(
        (save) => {
          if (save) {
            this.saveChanges();
          }
        }
      );

  }

  onRouteChange() {
    this.saveChanges();
  }

  ngOnDestroy(): void {
    // if (this.routerSubscription) {
    //   this.routerSubscription.unsubscribe();
    // }
    // if(this.changeSubscription){
    //   this.changeDetector.saveEvent.unsubscribe();
    // }
    this.destroy$.next();
    this.destroy$.complete();
  }

  async get_exercises_And_Workouts() {
    await this.dataService.getExercisesAndWorkouts();
    this.allExercises = this.dataService.exercises;
    this.workoutPlans = this.dataService.workoutPlans;
    this.dataService.woPlansNotUptoDate = false;
    this.changeDetector.changeDetected(false);
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

  requestNewWorkoutPlan() {
    if (this.workoutPlans.length !== 0) {
      return;
    }
    this.nameWorkoutPlan();
  }

  openDeleteDialog() {
    if (!this.currentWorkout) {
      return;
    }
    const dialogRef = this.dialog.open(DeleteWorkoutComponent, {
      data: { workoutIndex: Number(this.currentWorkoutValueString) },
      height: '250px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((index) => {
      if (index !== undefined) {
        this.workoutPlans.splice(index, 1);
        this.currentWorkout = this.workoutPlans[0];
        this.currentWorkoutValueString = '0';
        this.organizeWorkoutZone();
        this.clearList();
        this.dataService.woPlansNotUptoDate = true;
        this.changeDetector.changeDetected(true);
      }
    });
  }

  nameWorkoutPlan() {
    const dialogRef = this.dialog.open(NameWorkoutComponent, {
      height: '250px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let newPlan = new WorkoutPlan(result);
        if (newPlan) {
          this.dataService.workoutPlans.push(newPlan);
          this.currentWorkout = this.workoutPlans[this.workoutPlans.length - 1];
          this.currentWorkoutValueString = `${this.workoutPlans.length - 1}`;
          this.organizeWorkoutZone();
          this.dataService.woPlansNotUptoDate = true;
          this.changeDetector.changeDetected(true);
        }
      }
    });
  }

  isWorkoutSelcted(element: HTMLSelectElement) {
    if (element) {
      let index = Number(element.value);
      this.currentWorkout = this.workoutPlans[index];
    }
    this.organizeWorkoutZone();
  }

  organizeWorkoutZone() {
    this.workoutCardShow = false;
    setTimeout(() => {
      if (this.currentWorkout !== undefined) {
        this.workoutCardShow = true;
      } else {
        this.workoutCardShow = false;
      }
      if (
        this.currentWorkout !== undefined &&
        this.currentWorkout.allExercises?.length == 0
      ) {
        this.addFirstExercise = true;
      } else {
        this.addFirstExercise = false;
      }
    }, 300);
  }

  drop(event: any) {
    if (!this.currentWorkout) {
      return;
    }
    this.addFirstExercise = false;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.dataService.woPlansNotUptoDate = true;
    this.changeDetector.changeDetected(true);
  }

  deleteFromWO(i: number) {
    this.currentWorkout?.allExercises.splice(i, 1);
    this.dataService.woPlansNotUptoDate = true;
    this.changeDetector.changeDetected(true);
  }

  clearList() {
    this.workoutContainer.innerHTML = '';
  }

  saveChanges() {
    if (this.dataService.woPlansNotUptoDate) {
      this.dataService.workoutPlans = this.workoutPlans;
    }
    this.dataService.upload_changes_woPlans();
    this.dataService.woPlansNotUptoDate = false;
    this.changeDetector.changeDetected(false);
  }
}
