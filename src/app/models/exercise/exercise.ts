import { TrackingOptions } from '../trackingOptions/tracking-options';
import { TargetedMuscles } from '../targetedMuscles/targeted-muscles';
import { Marks } from '../marks/marks';


export class Exercise {
  exerciseId: string | undefined;
  exerciseName: string | undefined;
  exerciseDescribtion: string | undefined;
  exerciseCategory: string | undefined;
  exerciseCategoryCustom: string | undefined;
  trackingOptions: TrackingOptions;
  targetedMuscles: TargetedMuscles;
  trackProgress: boolean = false;
  isBreakBtwSets: boolean = true;
  breakTime: number | undefined;
  records : Marks[] = [];


  constructor(
    exerciseName: string | undefined,
    targetedMuscles: TargetedMuscles,
    trackProgress: boolean,
    trackingOptions: TrackingOptions,
    breakTime: number | undefined,
    exerciseDescribtion: string | undefined,
    exerciseCategory: string,
    exerciseCategoryCustom: string,
    exerciseId?: string | undefined,
    records? : Marks[] | undefined
  ) {
    this.exerciseName = exerciseName;
    this.exerciseDescribtion = exerciseDescribtion ? exerciseDescribtion : '';
    this.targetedMuscles = targetedMuscles;
    this.trackProgress = trackProgress;
    this.exerciseCategory = exerciseCategory ? exerciseCategory : '';
    this.exerciseCategoryCustom = exerciseCategoryCustom
      ? exerciseCategoryCustom
      : '';
    this.trackingOptions = trackingOptions;
    this.breakTime = breakTime ? breakTime : 0;
    this.exerciseId = exerciseId ? exerciseId : '';
    this.records = records ? records : [];
   }

  toObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    Object.keys(this).forEach((key) => {
      if (key === 'trackingOptions') {
        obj[key] = this.trackingOptions.toObject();
      } else if (key === 'targetedMuscles') {
        obj[key] = this.musclesToObject();
      } else if (key === 'records') {
        obj[key] = this.records.map((record)=>{
          record.recordsToObject();
        })
      } else {
        obj[key] = this[key as keyof this];
      }
    });
    return obj;
  }

  musclesToObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    Object.keys(this.targetedMuscles).forEach((key) => {
      obj[key] = this.targetedMuscles[key as keyof TargetedMuscles];
    });
    return obj;
  }


}
