import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  user: User | null | undefined;

  constructor() { }

  storeUserData(obj : User) {
      this.user = obj;
  }


}
