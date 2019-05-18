import { injectable, inject } from 'inversify'
import Scouter from '../../../entities/scouter'

export class InputData {
  constructor(readonly id: string) {}
}

export class OutputData {
  constructor(readonly scouter: Scouter) {}
}

export type IScouterRepository = {
  getScouter(id: string): Promise<Scouter>
}

// export type IPresenter = {
//   complete(outputData: OutputData): void
// }

export type IUsecase = {
  handle(InputData: InputData): Promise<OutputData>
}

@injectable()
export class Usecase implements IUsecase {
  constructor(
    @inject('GetScouter.IScouterRepository')
    private scouterRepository: IScouterRepository
  ) {}

  public handle(inputData: InputData) {
    return this.scouterRepository
      .getScouter(inputData.id)
      .then((scouter: Scouter) => {
        return new OutputData(scouter)
      })
  }
}
