import { Exercise } from "../exercise/exercise";

export class Set {
  exerciseId : string | undefined;
  setNumber : number | undefined;
  date : string | null;
  results : Record <string , any>;

  constructor(exercise : Exercise, setNumber : number, date : string | null){
    this.exerciseId = exercise.exerciseId;
    this.setNumber = setNumber + 1;
    this.date = date? date : null;
    this.results = exercise.trackingOptions.returnValidOptions();
  }

toObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    Object.keys(this).forEach((key) => {
      obj[key] = this[key as keyof Set];
    });
    return obj;
  }
}
