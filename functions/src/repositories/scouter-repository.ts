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
    // TODO uid追加
    return this.db
      .collection('scouters')
      .add({
        title: scouter.title,
        description: scouter.description
      })
      .then((docRef: admin.firestore.DocumentReference) => {
        return this.reflectIdOnScouter(docRef.id, scouter)
      })
      .catch(error => {
        console.log('Firestore Error: cannot add scouters.')
        throw error
      })
  }

  private reflectIdOnScouter(id: string, baseScouter: Scouter): Scouter {
    return new Scouter(id, baseScouter.title, baseScouter.description)
  }
}
