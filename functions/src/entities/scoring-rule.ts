import { Target, Condition } from '../valueobjects/scoring/valueobjects'

export default class ScoringRule {
  constructor(readonly target: Target, readonly condition: Condition) {}
}
