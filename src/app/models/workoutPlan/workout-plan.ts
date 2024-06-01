import { Exercise } from "../exercise/exercise";

export class WorkoutPlan {
  workoutName: string;
  allExercises : Exercise [] = [];
  constructor(name: string, allExercises? : Exercise[] ) {
    this.workoutName = name;
    this.allExercises = allExercises? allExercises : [];
  }

  toObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    Object.keys(this).forEach((key) => {
      obj[key] = this[key as keyof this];
    });
    return obj;
  }
}
