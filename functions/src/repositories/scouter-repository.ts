import CreateScouter from '../usecases/scouter/module'
import { injectable, inject } from 'inversify'
import Scouter from '../entities/scouter'
import * as admin from 'firebase-admin'

@injectable()
export class ScouterRepository implements CreateScouter.IScouterRepository {
  constructor(
    @inject(admin.firestore.Firestore)
    private db: admin.firestore.Firestore
  ) {}

  public saveScouter(scouter: Scouter): Promise<Scouter> {
    // TODO transaction化
    return this.db
      .collection('scouters')
      .add({
        author: scouter.author,
        title: scouter.title,
        description: scouter.description
      })
      .then((docRef: admin.firestore.DocumentReference) => {
        // scoringRules登録
        for (const scoringRule of scouter.scoringRules) {
          this.db
            .collection('scouters')
            .doc(docRef.id)
            .collection('scoringRules')
            .add({
              target: scoringRule.target.value,
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
            .collection('scouters')
            .doc(docRef.id)
            .collection('messagingRules')
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
        console.log('Firestore Error: cannot add scouters.', error)
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
}
