export class TargetedMuscles {
  abdominals: boolean = false;
  abductors: boolean = false;
  adductors: boolean = false;
  biceps: boolean = false;
  calves: boolean = false;
  chest: boolean = false;
  forearms: boolean = false;
  glutes: boolean = false;
  hamstrings: boolean = false;
  lats: boolean = false;
  lower_back: boolean = false;
  middle_back: boolean = false;
  neck: boolean = false;
  quadriceps: boolean = false;
  traps: boolean = false;
  triceps: boolean = false;

  constructor(
    abdominals?: boolean,
    abductors?: boolean,
    adductors?: boolean,
    biceps?: boolean,
    calves?: boolean,
    chest?: boolean,
    forearms?: boolean,
    glutes?: boolean,
    hamstrings?: boolean,
    lats?: boolean,
    lower_back?: boolean,
    middle_back?: boolean,
    neck?: boolean,
    quadriceps?: boolean,
    traps?: boolean,
    triceps?: boolean
  ) {
    this.abdominals = abdominals || false;
    this.abductors = abductors || false;
    this.adductors = adductors || false;
    this.biceps = biceps || false;
    this.calves = calves || false;
    this.chest = chest || false;
    this.forearms = forearms || false;
    this.glutes = glutes || false;
    this.hamstrings = hamstrings || false;
    this.lats = lats || false;
    this.lower_back = lower_back || false;
    this.middle_back = middle_back || false;
    this.neck = neck || false;
    this.quadriceps = quadriceps || false;
    this.traps = traps || false;
    this.triceps = triceps || false;
  }

  toObject(): Record<string, any> {
    const obj: Record<string, any> = {};
    Object.keys(this).forEach((key) => {
      obj[key] = this[key as keyof this];
    });
    return obj;
  }
}
