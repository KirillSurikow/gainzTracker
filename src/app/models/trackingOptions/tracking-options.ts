import { TrackingOption } from "../../interfaces/tracking-option";


export class TrackingOptions {
  weight :TrackingOption = {alias : 'weight', _value : false};
  repetitions:TrackingOption = {alias : 'repetitions', _value : false};
  time_inS:TrackingOption = {alias : 'time in seconds', _value : false};
  time_inM:TrackingOption = {alias : 'time in minutes', _value : false};
  distance:TrackingOption = {alias : 'distance in m', _value : false};
  height:TrackingOption = {alias : 'height in m', _value : false};

  constructor(
    weight?: boolean,
    repetitions?: boolean,
    time_inS?: boolean,
    time_inM?: boolean,
    distance?: boolean,
    height?: boolean
  ) {
    this.weight._value = weight || false;
    this.repetitions._value = repetitions || false;
    this.time_inS._value = time_inS || false;
    this.time_inM._value = time_inM || false;
    this.distance._value = distance || false;
    this.height._value = height || false;
  }

  toObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    Object.keys(this).forEach((key) => {
      obj[key] = this[key as keyof this];
    });
    return obj;
  }
}
