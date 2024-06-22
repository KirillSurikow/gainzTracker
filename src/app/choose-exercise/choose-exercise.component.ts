import { Component, QueryList, ViewChildren } from '@angular/core';
import { Category } from '../interfaces/category';
import { TrackingOptions } from '../models/trackingOptions/tracking-options';
import { TargetedMuscles } from '../models/targetedMuscles/targeted-muscles';
import { Exercise } from '../models/exercise/exercise';
import { DbService } from '../services/db/db.service';
import { DataService } from '../services/dataservice/data.service';
import { cardAnimations } from '../animations/cardanimations';
import { MatDialog } from '@angular/material/dialog';
import { DeleteExerciseComponent } from '../dialogs/deleteExercise/delete-exercise/delete-exercise.component';
import { FetchService } from '../services/fetchService/fetch.service';
import { KeyValue } from '@angular/common';
import { TrackingOption } from '../interfaces/tracking-option';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-exercise',
  templateUrl: './choose-exercise.component.html',
  styleUrl: './choose-exercise.component.scss',
  animations: cardAnimations,
})
export class ChooseExerciseComponent {
  allExercises: any[] = [];
  library: boolean = false;
  customize: boolean = false;
  comingFromLibray: boolean = false;
  manage: boolean = false;
  exerciseName: string | undefined;
  exerciseDescribtion: string | undefined;
  exerciseCategory: any;
  exerciseCategoryCustom: any;
  trackingOptions: TrackingOptions;
  targetedMuscles: TargetedMuscles;
  trackProgress: boolean = true;
  isBreakBtwSets: boolean = true;
  breakTime: number | undefined;
  inValidTracking: boolean | undefined;
  inValidMuscles: boolean | undefined;
  categoryInvalid: boolean | undefined;
  success: boolean = false;
  fail: boolean = false;
  isBlurr: boolean = false;
  activateBlurr: boolean = false;
  searchExpression: string | undefined;
  searchExerciseName: string | undefined;
  searchExerciseCategory: string | undefined;
  searchExerciseMuscles: string | undefined;
  allSearchedExercises: any[] = [];
  keyvalueComparator = (
    a: KeyValue<string, TrackingOption>,
    b: KeyValue<string, TrackingOption>
  ): number => {
    return 0;
  };

  categorys: Category[] = [
    { value: '', viewValue: '' },
    { value: 'cardio', viewValue: 'Cardio' },
    { value: 'strength', viewValue: 'Strength' },
    { value: 'plyometrics', viewValue: 'Plyometrics' },
    { value: 'powerlifting', viewValue: 'Powerlifting' },
    { value: 'stretching', viewValue: 'Stretching' },
    { value: 'strongman', viewValue: 'Strongman' },
  ];

  @ViewChildren('exerciseCard') exerciseCard!: QueryList<any>;

  constructor(
    private db: DbService,
    private dataService: DataService,
    public dialog: MatDialog,
    private fetch: FetchService,
    private router: Router
  ) {
    this.trackingOptions = new TrackingOptions();
    this.targetedMuscles = new TargetedMuscles();
    this.setUpTrackingValidation();
    this.setUpMuscleValidation();
    this.checkCategory();
    this.exerciseCategory = '';
    this.exerciseCategoryCustom = '';
  }

  closeCustom() {
    this.reset();
  }

  closeLibray() {
    this.library = false;
  }

  returnToLibrary() {
    this.library = true;
    this.reset();
  }

  closeManage() {
    this.manage = false;
  }

  async onSubmit() {
    let exercise = new Exercise(
      this.exerciseName,
      this.targetedMuscles,
      this.trackProgress,
      this.trackingOptions,
      this.breakTime,
      this.exerciseDescribtion,
      this.exerciseCategory,
      this.exerciseCategoryCustom
    );
    await this.dataService.add_exercise(exercise);
    this.success = this.db.uploadSuccessful;
    this.fail = this.db.uploadFailed;
    if (this.success) {
      this.reset();
    }
  }

  setUpTrackingValidation() {
    this.inValidTracking = !(
      this.trackingOptions.weight ||
      this.trackingOptions.repetitions ||
      this.trackingOptions.time_inSmin ||
      this.trackingOptions.time_inSmax ||
      this.trackingOptions.distance ||
      this.trackingOptions.height
    );
  }

  setUpMuscleValidation() {
    this.inValidMuscles = !(
      this.targetedMuscles.abdominals ||
      this.targetedMuscles.abductors ||
      this.targetedMuscles.adductors ||
      this.targetedMuscles.biceps ||
      this.targetedMuscles.calves ||
      this.targetedMuscles.chest ||
      this.targetedMuscles.forearms ||
      this.targetedMuscles.glutes ||
      this.targetedMuscles.hamstrings ||
      this.targetedMuscles.lats ||
      this.targetedMuscles.lower_back ||
      this.targetedMuscles.middle_back ||
      this.targetedMuscles.neck ||
      this.targetedMuscles.quadriceps ||
      this.targetedMuscles.traps ||
      this.targetedMuscles.triceps
    );
  }

  checkCategory() {
    if (
      this.exerciseCategory?.length !== 0 &&
      this.exerciseCategoryCustom?.length !== 0 &&
      this.exerciseCategory !== undefined &&
      this.exerciseCategoryCustom !== undefined
    ) {
      this.categoryInvalid = true;
    } else {
      this.categoryInvalid = false;
    }
  }

  reset() {
    this.exerciseName = '';
    this.exerciseDescribtion = '';
    this.exerciseCategory = '';
    this.exerciseCategoryCustom = '';
    this.trackingOptions = new TrackingOptions();
    this.targetedMuscles = new TargetedMuscles();
    this.trackProgress = true;
    this.isBreakBtwSets = true;
    this.breakTime = undefined;
    this.inValidTracking = false;
    this.inValidMuscles = false;
    this.categoryInvalid = false;
    this.success = false;
    this.fail = false;
    this.customize = false;
  }

  openCard(card: string) {
    if (card === 'customize') {
      this.customize = true;
    }
    if (card === 'library') {
      this.library = true;
    }
    if (card === 'manage') {
      this.prepareManageExercises();
    }
  }

  async prepareManageExercises() {
    this.manage = true;
    await this.dataService.getAllExercises();
    this.allExercises = this.dataService.exercises;
    this.allExercises = this.allExercises.map((exercise) => {
      return { element: exercise, state: 'inList' };
    });
  }

  toggleCard(card: any, id: number) {
    let target = this.exerciseCard.toArray()[id]['nativeElement'];
    if (card['state'] === 'inList') {
      card['state'] = 'expanded';
      target.classList.add('centre');
      target.classList.remove('normalState');
      document.body.style.overflowY = 'hidden';
      this.isBlurr = true;
      this.activateBlurr = true;
    } else {
      card['state'] = 'inList';
      target.classList.add('normalState');
      target.classList.remove('centre');
      document.body.style.overflowY = 'unset';
      this.isBlurr = false;
      this.activateBlurr = false;
    }
  }

  openDelete(event: MouseEvent, exerciseId: string, index: number) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteExerciseComponent, {
      data: { exerciseId, index },
      height: '250px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((index) => {
      if (index !== undefined) {
        let target = this.exerciseCard.toArray()[index]['nativeElement'];
        this.allExercises.splice(index, 1);
        this.activateBlurr = false;
        this.isBlurr = false;
        target.classList.add('normalState');
        target.classList.remove('centre');
        document.body.style.overflowY = 'unset';
        document.body.style.overflowY = 'unset';
      }
    });
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

  async onRequest() {
    try {
      const result = await this.fetch.fetchExercises(
        this.searchExerciseName,
        this.searchExerciseMuscles,
        this.searchExerciseCategory
      );
      this.allSearchedExercises = result;
    } catch (error) {
      console.log(error);
    }
  }

  pick(exercise: any) {
    this.library = false;
    this.customize = true;
    this.comingFromLibray = true;
    this.exerciseName = exercise.name;
    this.exerciseCategory = exercise.type;
    this.targetedMuscles[exercise.muscle as keyof TargetedMuscles] = true;
    this.setUpMuscleValidation();
  }

  goToMain() {
    this.router.navigateByUrl('home/dashboard');
  }
}
