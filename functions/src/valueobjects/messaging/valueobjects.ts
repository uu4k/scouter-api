export class Range {
  constructor(readonly min?: number, readonly max?: number) {
    if (!Range.validate(min, max)) {
      throw new Error('Range Error: min or max is invalid.')
    }
  }

  static validate(min?: number, max?: number) {
    if (!min || !max) {
      return false
    }

    if (min > max) {
      return false
    }

    return true
  }
}
