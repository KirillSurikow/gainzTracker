import { Injectable } from '@angular/core';
import {
  getFirestore,
  doc,
  setDoc,
  Firestore,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

// import { initializeApp } from "@angular/fire/app";

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private static firestore: Firestore;

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

    await updateDoc(ref, { [property] : newValue }).catch((error) => {
      console.log(error);
    });
  }
}
