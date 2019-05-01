import CreateScouter from '../usecases/scouter/module'
import { injectable, inject } from 'inversify'
import {
  ScouterPresenter,
  ScouterViewModel
} from '../presenters/scouter/presenter'

@injectable()
export class ScouterController {
  constructor(
    @inject('CreateScouter.IUsecase')
    private createUsecase: CreateScouter.IUsecase,
    @inject(ScouterPresenter)
    private scouterPresenter: ScouterPresenter
  ) {}

  public createScouter(
    title: string,
    description: string
  ): Promise<ScouterViewModel> {
    return this.createUsecase
      .handle(new CreateScouter.InputData(title, description))
      .then(outputData => {
        return this.scouterPresenter.completeCreate(outputData)
      })
  }
}
