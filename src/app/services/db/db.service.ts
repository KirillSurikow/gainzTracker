import { Injectable } from '@angular/core';
import {
  getFirestore,
  doc,
  setDoc,
  Firestore,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import { Exercise } from '../../models/exercise/exercise';
import { DataService } from '../dataservice/data.service';
import { TrackingOptions } from '../../models/trackingOptions/tracking-options';
import { TargetedMuscles } from '../../models/targetedMuscles/targeted-muscles';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private static firestore: Firestore;
  uploadSuccessful: boolean = false;
  uploadFailed: boolean = false;

  constructor(private dataService: DataService) {
    if (!DbService.firestore) {
      DbService.firestore = getFirestore(initializeApp(environment.firebase));
    }
  }

  async setUserInDB(
    uid: string,
    email: string,
    username: string,
    firstName: string,
    lastName: string
  ) {
    const ref = doc(DbService.firestore, 'users', uid);
    await setDoc(ref, {
      uid,
      email,
      username,
      firstName,
      lastName,
    }).catch((error) => {
      console.log(error);
    });
  }

  async getUserData(uid: string) {
    const ref = doc(DbService.firestore, 'users', uid);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists) {
      return {};
    } else {
      return docSnap.data();
    }
  }

  async updateUser(uid: string, property: string, newValue: string) {
    const ref = doc(DbService.firestore, 'users', uid);

    await updateDoc(ref, { [property]: newValue }).catch((error) => {
      console.log(error);
    });
  }

  async addExercise(exercise: Exercise) {
    const ref = collection(
      DbService.firestore,
      `users/${this.dataService.user?.uid}/exercises`
    );
    let upload = exercise.toObject();
    await addDoc(ref, upload)
      .then((docRef) => {
        updateDoc(docRef, { id: docRef.id });
      })
      .then(() => {
        this.uploadSuccessful = true;
        this.dataService.exercisesUpToDate = false;
      })
      .catch((error) => {
        console.log(error);
        this.uploadFailed = true;
      });
  }

  async getAllExercises() {
    if (!this.dataService.exercisesUpToDate) {
      const ref = collection(
        DbService.firestore,
        `users/${this.dataService.user?.uid}/exercises`
      );
      const querySnapshot = await getDocs(ref);
      querySnapshot.forEach((doc) => {
        let trackingOptions = new TrackingOptions(
          doc.data()['trackingOptions']['weight'],
          doc.data()['trackingOptions']['repetitions'],
          doc.data()['trackingOptions']['time'],
          doc.data()['trackingOptions']['distance'],
          doc.data()['trackingOptions']['height']
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
        this.dataService.storeUserExercises(
          new Exercise(
            doc.data()['exerciseName'],
            targetedMuscles,
            doc.data()['trackProgress'],
            trackingOptions,
            doc.data()['breakTime'],
            doc.data()['exerciseDescribtion'],
            doc.data()['exerciseCategory'],
            doc.data()['exerciseCategoryCustom'],
            doc.data()['id']
          )
        );
      });
      this.dataService.exercisesUpToDate = true;
    }
  }

  async deleteExercise(exerciseId: string) {
    const path = `users/${this.dataService.user?.uid}/exercises/ ${exerciseId}`;
    await deleteDoc(doc(DbService.firestore, path)).then(() => {

    }).catch((error)=>{
      console.log(error)
    });
  }
}
