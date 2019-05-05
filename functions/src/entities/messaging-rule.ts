import { Range } from '../valueobjects/messaging/valueobjects'

export default class MessagingRule {
  constructor(
    readonly message: string,
    readonly isDefault: boolean = false,
    readonly range?: Range
  ) {
    // defaultでないにもかかわらずrange指定なし
    if (!this.range && !this.isDefault) {
      throw new Error(
        'MessagingRule Contstructor: need range if default is false.'
      )
    }
  }
}
