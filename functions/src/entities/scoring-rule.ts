import { Target, Condition } from '../valueobjects/scoring/valueobjects'

export default class ScoringRule {
  // TODO 付与スコアの情報追加
  constructor(readonly target: Target, readonly condition: Condition) {}
}
