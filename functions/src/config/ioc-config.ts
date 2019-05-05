// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata'

import { Container } from 'inversify'
import * as admin from 'firebase-admin'

import CreateScouter from '../usecases/scouter/module'
import { ScouterRepository } from '../repositories/scouter-repository'
import { ScouterPresenter } from '../presenters/scouter/presenter'
import { ScouterController } from '../controllers/scouter-controller'

const container = new Container()

admin.initializeApp()
const database = admin.firestore()
const settings = { timestampsInSnapshots: true }
database.settings(settings)
container
  .bind<admin.firestore.Firestore>(admin.firestore.Firestore)
  .toConstantValue(database)

container
  .bind<CreateScouter.IUsecase>('CreateScouter.IUsecase')
  .to(CreateScouter.Usecase)
  .whenTargetIsDefault()

container
  .bind<CreateScouter.IScouterRepository>('CreateScouter.IScouterRepository')
  .to(ScouterRepository)
  .whenTargetIsDefault()

container
  .bind<ScouterPresenter>(ScouterPresenter)
  .to(ScouterPresenter)
  .whenTargetIsDefault()

container
  .bind<ScouterController>(ScouterController)
  .to(ScouterController)
  .whenTargetIsDefault()

export default container
