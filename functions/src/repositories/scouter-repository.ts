import CreateScouter from '../usecases/scouter/create/module'
import GetScouter from '../usecases/scouter/get/module'
import { injectable, inject } from 'inversify'
import Scouter from '../entities/scouter'
import * as admin from 'firebase-admin'
import {
  QueryDocumentSnapshot,
  DocumentSnapshot
} from '@google-cloud/firestore'
import ScoringRule from '../entities/scoring-rule'
import MessagingRule from '../entities/messaging-rule'
import {
  Condition,
  OperatorFactory,
  TargetFactory
} from '../valueobjects/scoring/valueobjects'
import { Range } from '../valueobjects/messaging/valueobjects'

@injectable()
export class ScouterRepository
  implements CreateScouter.IScouterRepository, GetScouter.IScouterRepository {
  readonly SCOUTER_PATH = 'scouters'
  readonly SCORING_RULE_PATH = 'scoringRules'
  readonly MESSAGING_RULE_PATH = 'messagingRules'
  constructor(
    @inject(admin.firestore.Firestore)
    private db: admin.firestore.Firestore
  ) {}

  public saveScouter(scouter: Scouter): Promise<Scouter> {
    // TODO transaction化
    return this.db
      .collection(this.SCOUTER_PATH)
      .add({
        author: scouter.author,
        title: scouter.title,
        description: scouter.description
      })
      .then((docRef: admin.firestore.DocumentReference) => {
        // scoringRules登録
        for (const scoringRule of scouter.scoringRules) {
          this.db
            .collection(this.SCOUTER_PATH)
            .doc(docRef.id)
            .collection(this.SCORING_RULE_PATH)
            .add({
              target: scoringRule.target.value,
              score: scoringRule.score,
              oneTimeOnly: scoringRule.oneTimeOnly,
              operator: scoringRule.condition.operator.value,
              operand: scoringRule.condition.operand
            })
            .catch(error => {
              console.log('Firestore Error: cannot add scoringRules.', error)
              throw error
            })
        }
        // messagingRules登録
        for (const messagingRule of scouter.messagingRules) {
          this.db
            .collection(this.SCOUTER_PATH)
            .doc(docRef.id)
            .collection(this.MESSAGING_RULE_PATH)
            .add({
              message: messagingRule.message,
              default: messagingRule.isDefault,
              min: messagingRule.range ? messagingRule.range.min : null,
              max: messagingRule.range ? messagingRule.range.max : null
            })
            .catch(error => {
              console.log('Firestore Error: cannot add messagingRules.', error)
              throw error
            })
        }
        return this.reflectIdOnScouter(docRef.id, scouter)
      })
      .catch(error => {
        console.log('Firestore Error: cannot addthis.SCOUTER_PATH', error)
        throw error
      })
  }

  public getScouter(id: string): Promise<Scouter> {
    const scouterRef = this.db.collection(this.SCOUTER_PATH).doc(id)

    return scouterRef
      .get()
      .then(async scouterDoc => {
        if (scouterDoc.exists) {
          const scoringRules: ScoringRule[] = []
          const messagingRules: MessagingRule[] = []
          await scouterRef
            .collection(this.SCORING_RULE_PATH)
            .get()
            .then(snapshot => {
              snapshot.forEach(ruleDoc => {
                scoringRules.push(this.doc2ScoringRule(ruleDoc))
              })
            })
          await scouterRef
            .collection(this.MESSAGING_RULE_PATH)
            .get()
            .then(snapshot => {
              snapshot.forEach(ruleDoc => {
                messagingRules.push(this.doc2MessagingRule(ruleDoc))
              })
            })

          return this.doc2Scouter(scouterDoc, scoringRules, messagingRules)
        } else {
          console.log('Firestore Error: not found scouter: ' + id)
          throw new Error()
        }
      })
      .catch(error => {
        console.log('Firestore Error: cannot get scouter: ' + id, error)
        throw error
      })
  }

  private reflectIdOnScouter(id: string, baseScouter: Scouter): Scouter {
    return new Scouter(
      id,
      baseScouter.author,
      baseScouter.title,
      baseScouter.description,
      baseScouter.scoringRules,
      baseScouter.messagingRules
    )
  }

  private doc2Scouter(
    doc: DocumentSnapshot,
    scoringRules: ScoringRule[],
    messagingRules: MessagingRule[]
  ): Scouter {
    if (!doc.exists) {
      throw new Error('Firestore Error: not found scouter: ' + doc.id)
    }

    const data = doc.data() as any
    return new Scouter(
      doc.id,
      data.author,
      data.title,
      data.description,
      scoringRules,
      messagingRules
    )
  }

  private doc2ScoringRule(doc: QueryDocumentSnapshot): ScoringRule {
    const data = doc.data()
    const operator = OperatorFactory.create(data.operator)
    if (!operator) {
      throw new Error(
        'Firestore Error: scoring rule condition is broken: ' + doc.id
      )
    }

    const target = TargetFactory.create(data.target)
    if (!target) {
      throw new Error(
        'Firestore Error: scoring rule target is broken: ' + doc.id
      )
    }

    return new ScoringRule(
      target,
      data.score,
      data.oneTimeOnly,
      new Condition(operator, data.operand)
    )
  }

  private doc2MessagingRule(doc: QueryDocumentSnapshot): MessagingRule {
    const data = doc.data()
    let range = undefined
    if (Range.validate(data.min, data.max)) {
      range = new Range(data.min, data.max)
    }

    return new MessagingRule(data.message, data.default, range)
  }
}
