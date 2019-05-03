import { Range } from '../valueobjects/messaging/valueobjects'

export default class MessagingRule {
  constructor(
    readonly message: string,
    readonly isDefault: boolean = false,
    readonly range?: Range
  ) {}
}
