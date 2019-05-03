export default class Scouter {
  constructor(
    readonly id: string | null,
    readonly author: string,
    readonly title: string,
    readonly description: string
  ) {
    // TODO validation
  }
}
