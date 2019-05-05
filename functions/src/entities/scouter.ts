import ScoringRule from './scoring-rule'
import MessagingRule from './messaging-rule'

export default class Scouter {
  constructor(
    readonly id: string | null,
    readonly author: string,
    readonly title: string,
    readonly description: string,
    readonly scoringRules: ScoringRule[],
    readonly messagingRules: MessagingRule[]
  ) {
    if (
      messagingRules.filter(rule => {
        rule.isDefault
      }).length > 1
    ) {
      throw new Error(
        'Scouter Constructor: MessagingRules cannot have multi default rules.'
      )
    }
  }
}
