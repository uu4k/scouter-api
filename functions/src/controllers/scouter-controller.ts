import CreateScouter from '../usecases/scouter/module'
import { injectable, inject } from 'inversify'
import {
  ScouterPresenter,
  ScouterViewModel
} from '../presenters/scouter/presenter'
import ScoringRule from '../entities/scoring-rule'
import {
  Condition,
  Target,
  Operator,
  TargetFactory,
  OperatorFactory
} from '../valueobjects/scoring/valueobjects'
import MessagingRule from '../entities/messaging-rule'
import { Range } from '../valueobjects/messaging/valueobjects'
import Scouter from '../entities/scouter'

@injectable()
export class ScouterController {
  constructor(
    @inject('CreateScouter.IUsecase')
    private createUsecase: CreateScouter.IUsecase,
    @inject(ScouterPresenter)
    private scouterPresenter: ScouterPresenter
  ) {}

  public createScouter(
    uid: string,
    title: string,
    description: string,
    scoringRuleBodys: ScoringRuleBody[],
    messagingRuleBodys: MessagingRuleBody[]
  ): Promise<ScouterViewModel> {
    // scoringRule詰める
    const scoringRules: ScoringRule[] = []
    for (const b of scoringRuleBodys) {
      scoringRules.push(
        new ScoringRule(
          TargetFactory.create(b.target) as Target,
          new Condition(
            OperatorFactory.create(b.condition.operator) as Operator,
            b.condition.operand
          )
        )
      )
    }

    // messagingRule詰める
    const messagingRules: MessagingRule[] = []
    for (const b of messagingRuleBodys) {
      messagingRules.push(
        new MessagingRule(
          b.message,
          b.default,
          b.default ? undefined : new Range(b.range.min, b.range.max)
        )
      )
    }

    const scouter = new Scouter(
      null,
      uid,
      title,
      description,
      scoringRules,
      messagingRules
    )

    return this.createUsecase
      .handle(new CreateScouter.InputData(scouter))
      .then(outputData => {
        return this.scouterPresenter.completeCreate(outputData)
      })
  }
}

export type ScoringRuleBody = {
  target: string
  condition: { operator: string; operand: string }
}

export type MessagingRuleBody = {
  message: string
  range: { min?: number; max?: number }
  default: boolean
}
