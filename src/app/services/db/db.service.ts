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
import { WorkoutPlan } from '../../models/workoutPlan/workout-plan';
import { Marks } from '../../models/marks/marks';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private static firestore: Firestore;
  uploadSuccessful: boolean = false;
  uploadFailed: boolean = false;

  constructor() {
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

  async updateExercise(
    userId: string | undefined,
    exerciseId: string | undefined
  ) {
    const ref = doc(
      DbService.firestore,
      `users/${userId}/exercises/${exerciseId}`
    );
    updateDoc(ref, { id: exerciseId });
  }

  async updateExerciseRecord(
    userId: string | undefined,
    exerciseId: string | undefined,
    records: Array<any>
  ) {
    const ref = doc(
      DbService.firestore,
      `users/${userId}/exercises/${exerciseId}`
    );
    await updateDoc(ref, { records });
  }

  async updateProgress(userId: string | undefined, set: any) {
    const ref = collection(
      DbService.firestore,
      `users/${userId}/exercises/${set['exerciseId']}/progress`
    );
    await addDoc(ref, set);
  }

  async addExercise(
    userId: string | undefined,
    exercise: Exercise
  ): Promise<any> {
    const ref = collection(DbService.firestore, `users/${userId}/exercises`);
    let upload = exercise.toObject();
    return await addDoc(ref, upload);
  }

  async getAllExercises(userId: string | undefined) {
    const ref = collection(DbService.firestore, `users/${userId}/exercises`);
    const querySnapshot = await getDocs(ref);
    return querySnapshot;
  }

  async deleteUser(userId: string | undefined) {
    const docPath = `users/${userId}`;
    const collPath = `${docPath}/exercises`;
    const query = collection(DbService.firestore, collPath);
    const querySnapshot = await getDocs(query);
    const deletePromises: Array<any> = [];
    querySnapshot.forEach(async (snapshot) => {
      let promise = await this.deleteExercise(snapshot.ref.id, userId!);
      deletePromises.push(promise);
    });
    await Promise.all(deletePromises);
    await deleteDoc(doc(DbService.firestore, docPath))
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('error');
      });
  }

  async deleteExercise(exerciseId: string, userId: string | undefined) {
    const docPath = `users/${userId}/exercises/${exerciseId}`;
    const collPath = `${docPath}/progress`;
    const query = collection(DbService.firestore, collPath);
    const querySnapshot = await getDocs(query);
    const deletePromises: Array<any> = [];
    querySnapshot.forEach(async (snapshot) => {
      let progressPath = `${collPath}/${snapshot.ref.id}`;
      deletePromises.push(deleteDoc(doc(DbService.firestore, progressPath)));
    });
    await Promise.all(deletePromises);
    await deleteDoc(doc(DbService.firestore, docPath))
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  async uploadChangesWoPlans(
    workout_plans: WorkoutPlan[],
    userId: string | undefined
  ) {
    const path = `users/${userId}`;
    let workoutPlans = this.prepareWOPlans(workout_plans);
    const ref = doc(DbService.firestore, path);
    await updateDoc(ref, { workoutPlans: workoutPlans });
  }

  prepareWOPlans(array: WorkoutPlan[]) {
    let response = array.map((workout) => {
      return workout.toObject();
    });
    response.forEach((element) => {
      element['allExercises'] = element['allExercises'].map(
        (exercise: Exercise) => {
          return exercise.exerciseId;
        }
      );
    });
    return response;
  }

  async getAllWOPlans(userId: string | undefined) {
    const path = `users/${userId}`;
    const ref = doc(DbService.firestore, path);
    const docSnap = await getDoc(ref);
    return docSnap;
  }

  async getProgress(userId: string | undefined, exerciseId: string) {
    const ref = collection(
      DbService.firestore,
      `users/${userId}/exercises/${exerciseId}/progress`
    );
    const querySnapshot = await getDocs(ref);
    return querySnapshot;
  }
}
