import { TrackingOption } from "../../interfaces/tracking-option";


export class TrackingOptions {
  weight :TrackingOption = {alias : 'weight', _value : false};
  repetitions:TrackingOption = {alias : 'repetitions', _value : false};
  time_inSmin:TrackingOption = {alias : 'time in seconds min', _value : false};
  time_inSmax:TrackingOption = {alias : 'time in seconds max', _value : false};
  distance:TrackingOption = {alias : 'distance in m', _value : false};
  height:TrackingOption = {alias : 'height in m', _value : false};

  constructor(
    weight?: boolean,
    repetitions?: boolean,
    time_inSmin?: boolean,
    time_inSmax?: boolean,
    distance?: boolean,
    height?: boolean
  ) {
    this.weight._value = weight || false;
    this.repetitions._value = repetitions || false;
    this.time_inSmin._value = time_inSmin || false;
    this.time_inSmax._value = time_inSmax || false;
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

  toKeyValueObject(): Record<string, { alias: string, _value: boolean }> {
    return {
      weight: { alias: 'weight', _value: this.weight._value },
      repetitions: { alias: 'repetitions', _value: this.repetitions._value },
      time_inSmin: { alias: 'time in seconds min', _value: this.time_inSmin._value },
      time_inSmax: { alias: 'time in seconds max', _value: this.time_inSmax._value },
      distance: { alias: 'distance in m', _value: this.distance._value },
      height: { alias: 'height in m', _value: this.height._value }
    };
  }

  returnValidOptions() : Record<string, any>{
    const obj: Record<string, any> = {};
    Object.keys(this).forEach((key)=>{
      const option = this[key as keyof this] as TrackingOption;
     if(option._value){
      obj[key] = {alias : option.alias , _value : null}
     }
    })
    return obj;
  }

}
