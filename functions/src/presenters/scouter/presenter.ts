import CreateScouter from '../../usecases/scouter/create/module'
import { injectable } from 'inversify'
import { ViewModel } from '../i-view-model'
import Scouter from '../../entities/scouter'
import ScoringRule from '../../entities/scoring-rule'
import { Condition } from '../../valueobjects/scoring/valueobjects'
import GetScouter from '../../usecases/scouter/get/module'
import MessagingRule from '../../entities/messaging-rule'

// export class Presenter implements CreateScouter.IPresenter {
@injectable()
export class ScouterPresenter {
  public completeCreate(outputData: CreateScouter.OutputData) {
    return new ScouterViewModel(outputData.scouter)
  }

  public completeGet(outputData: GetScouter.OutputData) {
    return new ScouterViewModel(outputData.scouter)
  }
}

export class ScouterViewModel implements ViewModel {
  readonly id: string
  readonly author: string
  readonly title: string
  readonly description: string
  readonly scoringRules: ScoringRuleViewModel[] = []
  readonly messagingRules: MessagingRuleViewModel[] = []

  constructor(scouter: Scouter) {
    this.id = scouter.id!
    this.author = scouter.author
    this.title = scouter.title
    this.description = scouter.description

    for (const rule of scouter.scoringRules) {
      this.scoringRules.push(new ScoringRuleViewModel(rule))
    }

    for (const rule of scouter.messagingRules) {
      this.messagingRules.push(new MessagingRuleViewModel(rule))
    }
  }

  public toJson() {
    return {
      id: this.id,
      author: this.author,
      title: this.title,
      description: this.description,
      scoringRules: this.scoringRules.map(r => r.toJson()),
      messagingRules: this.messagingRules.map(r => r.toJson())
    }
  }
}

export class ScoringRuleViewModel implements ViewModel {
  readonly target: string
  readonly score: number
  readonly oneTimeOnly: boolean
  readonly condition: ConditionViewModel

  constructor(scoringRule: ScoringRule) {
    this.target = scoringRule.target.value
    this.score = scoringRule.score
    this.oneTimeOnly = scoringRule.oneTimeOnly
    this.condition = new ConditionViewModel(scoringRule.condition)
  }

  public toJson() {
    return {
      target: this.target,
      score: this.score,
      oneTimeOnly: this.oneTimeOnly,
      condition: this.condition.toJson()
    }
  }
}

export class MessagingRuleViewModel implements ViewModel {
  readonly message: string
  readonly default: boolean
  readonly min: number | undefined
  readonly max: number | undefined
  constructor(messagingRule: MessagingRule) {
    this.message = messagingRule.message
    this.default = messagingRule.isDefault
    this.min = messagingRule.range ? messagingRule.range.min : undefined
    this.max = messagingRule.range ? messagingRule.range.max : undefined
  }

  public toJson() {
    return {
      message: this.message,
      default: this.default,
      min: this.min,
      max: this.max
    }
  }
}

export class ConditionViewModel implements ViewModel {
  readonly operator: string
  readonly operand: string

  constructor(condition: Condition) {
    this.operator = condition.operator.value
    this.operand = condition.operand
  }
  public toJson() {
    return {
      operator: this.operator,
      operand: this.operand
    }
  }
}
