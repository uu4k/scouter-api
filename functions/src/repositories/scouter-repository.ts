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
    return this.db
      .collection('scouters')
      .add({
        author: scouter.author,
        title: scouter.title,
        description: scouter.description
      })
      .then((docRef: admin.firestore.DocumentReference) => {
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
      baseScouter.description
    )
  }
}
