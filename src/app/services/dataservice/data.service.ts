import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { Exercise } from '../../models/exercise/exercise';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  user: User | null | undefined;
  exercises : Exercise [] = [];
  exercisesUpToDate : boolean = false;

  constructor() { }

  storeUserData(obj : User) {
      this.user = obj;
  }

  storeUserExercises(exercise : Exercise){
     this.exercises.push(exercise)
  }

  removeExercise(index : number){
    this.exercises.splice(index, 1)
  }


}
