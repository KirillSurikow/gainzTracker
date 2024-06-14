import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { Exercise } from '../../models/exercise/exercise';
import { DbService } from '../db/db.service';
import { TrackingOptions } from '../../models/trackingOptions/tracking-options';
import { TargetedMuscles } from '../../models/targetedMuscles/targeted-muscles';
import { WorkoutPlan } from '../../models/workoutPlan/workout-plan';
import { Set } from '../../models/set/set';
import { Marks } from '../../models/marks/marks';

type AllSets = {
  [key: number]: Set[];
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  user: User | null | undefined;
  exercises: Exercise[] = [];
  exercisesUpToDate: boolean = false;
  workoutPlans: WorkoutPlan[] = [];
  woPlansNotUptoDate: boolean = true;
  currentWOPlan: number | undefined;
  progressUpToDate : boolean = false;

  constructor(private db: DbService) {}

  async get_All_WoPlans() {
    if (this.workoutPlans.length !== 0) {
      return;
    } else {
      await this.db.getAllWOPlans(this.user?.uid).then((result) => {
        if (result) {
          let obj = result.data();
          if (obj && obj['workoutPlans'] !== undefined) {
            this.restoreCustomeObject(obj['workoutPlans']);
          }
        }
      });
    }
  }

  restoreCustomeObject(arr: Array<any>) {
    this.workoutPlans = arr.map((element) => {
      let allExercises = element.allExercises.map((id: string) => {
        return this.exercises.find((exercise) => {
          return id === exercise.exerciseId;
        });
      });
      return new WorkoutPlan(element.workoutName, allExercises);
    });
  }

  storeUserData(obj: User) {
    this.user = obj;
  }

  storeUserExercises(exercise: Exercise) {
    this.exercises.push(exercise);
  }

  removeExercise(index: number) {
    this.exercises.splice(index, 1);
  }

  async getExercisesAndWorkouts() {
    await this.getAllExercises();
    await this.get_All_WoPlans();
  }

  async getAllExercises() {
    if (!this.exercisesUpToDate) {
      await this.db.getAllExercises(this.user?.uid).then((result) => {
        if (result) {
          result.forEach((doc) => {
          let records = doc.data()['records'].map((element : any)=>{
             let record = new Marks();
             record.exerciseId = element['exerciseId'];
             record.setNumber = element['setNumber'];
             record.bestValues = element['bestValues'];
             record.lastValues = element['lastValues'];
             return record;
          })
            let trackingOptions = new TrackingOptions(
              doc.data()['trackingOptions']['weight']._value,
              doc.data()['trackingOptions']['repetitions']._value,
              doc.data()['trackingOptions']['time_inSmin']._value,
              doc.data()['trackingOptions']['time_inSmax']._value,
              doc.data()['trackingOptions']['distance']._value,
              doc.data()['trackingOptions']['height']._value
            );
            let targetedMuscles = new TargetedMuscles(
              doc.data()['targetedMuscles']['abdominals'],
              doc.data()['targetedMuscles']['abductors'],
              doc.data()['targetedMuscles']['adductors'],
              doc.data()['targetedMuscles']['biceps'],
              doc.data()['targetedMuscles']['calves'],
              doc.data()['targetedMuscles']['chest'],
              doc.data()['targetedMuscles']['forearms'],
              doc.data()['targetedMuscles']['glutes'],
              doc.data()['targetedMuscles']['hamstrings'],
              doc.data()['targetedMuscles']['lats'],
              doc.data()['targetedMuscles']['lower_back'],
              doc.data()['targetedMuscles']['middle_back'],
              doc.data()['targetedMuscles']['neck'],
              doc.data()['targetedMuscles']['quadriceps'],
              doc.data()['targetedMuscles']['traps'],
              doc.data()['targetedMuscles']['triceps']
            );
            this.storeUserExercises(
              new Exercise(
                doc.data()['exerciseName'],
                targetedMuscles,
                doc.data()['trackProgress'],
                trackingOptions,
                doc.data()['breakTime'],
                doc.data()['exerciseDescribtion'],
                doc.data()['exerciseCategory'],
                doc.data()['exerciseCategoryCustom'],
                doc.data()['id'],
                records
              )
            );
          });
          this.exercisesUpToDate = true;
        }
      });
    }
  }

  async data_delete_exercise(exerciseId: string, index: number) {
    await this.db.deleteExercise(exerciseId, this.user?.uid).then(() => {
      this.removeExercise(index);
    });
  }

  async add_exercise(exercise: Exercise) {
    await this.db.addExercise(this.user?.uid, exercise).then((result) => {
      this.exercisesUpToDate = false;
      this.db.updateExercise(this.user?.uid, result.id);
      this.db.uploadSuccessful = true;
    });
  }

  updateRecordsOfExercise(exercises: Exercise[]) {
    exercises.forEach((exercise) => {
      let target = exercise.records.map((record) => {
        return record.recordsToObject();
      });

      this.db.updateExerciseRecord(this.user?.uid, exercise.exerciseId, target);
      this.exercisesUpToDate = false;
    });
  }

  updateProgress(allSets: AllSets) {
    let allSetsArr: Array<object> = [];
    Object.entries(allSets).forEach((exercise) => {
      let exerciseArr : Array<object> = []
      exercise.forEach((sets) => {
        if (typeof sets !== 'string') {
           exerciseArr = sets.map((set) => {
            return set.toObject();
          });
        }
      });

      allSetsArr = [...allSetsArr, ... exerciseArr];
      allSetsArr.forEach(set => {
        this.db.updateProgress(this.user?.uid, set)
      });
    });
    this.progressUpToDate = false;
  }

  async upload_changes_woPlans() {
    await this.db.uploadChangesWoPlans(this.workoutPlans, this.user?.uid);
  }

  async delete_Workout(index: number) {
    this.workoutPlans.splice(index, 1);
    this.upload_changes_woPlans();
  }
}
