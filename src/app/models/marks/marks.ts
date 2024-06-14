import { Set } from '../set/set';

export type History = {
  [key: string]: Results;
};

export interface Results {
  alias: string;
  _value: any;
}

export class Marks {
  exerciseId: string | undefined;
  setNumber: number | undefined;
  bestValues: History = {};
  lastValues: History = {};

  constructor(set?: Set) {
    this.exerciseId = set?.exerciseId;
    this.setNumber = set?.setNumber;
    if(set){
      Object.entries(set.results).forEach((result) => {
        if (typeof result[0] === 'string') {
          this.lastValues[result[0] as keyof History] = result[1];
        }
        if (typeof result[0] === 'string' && this.isBestValuesEmpty(result[0])) {
          this.bestValues[result[0] as keyof History] = result[1];
        } else if (typeof result[0] === 'string' && this.checkNewBest(result)) {
          this.bestValues[result[0] as keyof History] = result[1];
        }
      });
    }
  }

  isBestValuesEmpty(result: string): boolean {
    if (this.bestValues[result as keyof History] === undefined) {
      return true;
    } else {
      return false;
    }
  }

  checkNewBest(result: any): boolean {
    if (this.lastValues[result as keyof History] > result[1]) {
      return true;
    } else if (
      result[0] === 'time_inSmin' &&
      this.lastValues[result as keyof History] < result[1]
    ) {
      console.log('works')
      return true;
    } else {
      return false;
    }
  }

  recordsToObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    Object.keys(this).forEach((key) => {
      obj[key] = this[key as keyof Marks];
    });
    return obj;
  }
}
