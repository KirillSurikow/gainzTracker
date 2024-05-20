export class TrackingOptions {
  weight = false;
  repetitions = false;
  time = false;
  distance = false;
  height = false;

  constructor(
    weight?: boolean,
    repetitions?: boolean,
    time?: boolean,
    distance?: boolean,
    height?: boolean
  ) {
    this.weight = weight || false;
    this.repetitions = repetitions || false;
    this.time = time || false;
    this.distance = distance || false;
    this.height = height || false;
  }

  toObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    Object.keys(this).forEach((key) => {
      obj[key] = this[key as keyof this];
    });
    return obj;
  }
}
