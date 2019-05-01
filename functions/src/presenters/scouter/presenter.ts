import CreateScouter from '../../usecases/scouter/module'
import { injectable } from 'inversify'
import { ViewModel } from '../i-view-model'

// export class Presenter implements CreateScouter.IPresenter {
@injectable()
export class ScouterPresenter {
  public completeCreate(outputData: CreateScouter.OutputData) {
    return new ScouterViewModel()
  }
}

export class ScouterViewModel implements ViewModel {
  public toJson() {
    return {}
  }
}
