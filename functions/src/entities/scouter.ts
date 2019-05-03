import ScoringRule from './scoring-rule'
import MessagingRule from './messaging-rule'

export default class Scouter {
  constructor(
    readonly id: string | null,
    readonly author: string,
    readonly title: string,
    readonly description: string,
    private scoringRules: ScoringRule[],
    private messagingRules: MessagingRule[]
  ) {
    // TODO validation
  }
}
