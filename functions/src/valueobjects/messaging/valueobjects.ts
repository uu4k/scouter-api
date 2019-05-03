export class Range {
  constructor(readonly min?: number, readonly max?: number) {
    if (!min || !max) {
      throw new Error('Range Error: min or max is undefined.')
    }

    if (min > max) {
      throw new Error('Range Error: min > max.')
    }
  }
}
