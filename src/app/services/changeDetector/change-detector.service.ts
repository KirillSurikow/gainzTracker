import { Injectable, EventEmitter  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChangeDetectorService {

  changeEvent = new EventEmitter<boolean>()
  saveEvent = new EventEmitter<boolean>()

  constructor() { }

  changeDetected(status: boolean) {
    this.changeEvent.emit(status);
  }

  mustSaveChanges(){
    this.saveEvent.emit(true)
  }
}
