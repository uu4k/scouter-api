import { injectable, inject } from 'inversify'
import Scouter from '../../entities/scouter'

export class InputData {
  constructor(
    readonly uid: string,
    readonly title: string,
    readonly description: string
  ) {}
}

export class OutputData {
  constructor(readonly title: string, readonly description: string) {}
}

export type IScouterRepository = {
  saveScouter(scouter: Scouter): Promise<Scouter>
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
    @inject('CreateScouter.IScouterRepository')
    private scouterRepository: IScouterRepository
  ) {}

  public handle(inputData: InputData) {
    return this.scouterRepository
      .saveScouter(
        new Scouter(null, inputData.uid, inputData.title, inputData.description)
      )
      .then((scouter: Scouter) => {
        return new OutputData(scouter.title, scouter.description)
      })
  }
}
