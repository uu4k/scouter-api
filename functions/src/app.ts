import * as express from 'express'
import * as cors from 'cors'
import Router from 'express-promise-router'
import container from './config/ioc-config'
import { ScouterController } from './controllers/scouter-controller'
import * as bodyParser from 'body-parser'
import { AuthorizedRequest, authenticate } from './middlewares/authenticate'
import { validate } from './middlewares/jsonschema'

const app = express()
const router = Router()

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())
// TODO CORSちゃんと設定する
app.use(cors({ origin: true }))

app.use('/', router)

// Create
router.post(
  '/',
  authenticate,
  validate,
  async (req: express.Request, res: express.Response) => {
    const authedReq = req as AuthorizedRequest
    // controller呼び出し
    const controller = container.get(ScouterController)

    const viewModel = await controller.createScouter(
      authedReq.user.uid,
      authedReq.body.title,
      authedReq.body.description,
      authedReq.body.scoringRules,
      authedReq.body.messagingRules
    )

    res.json(viewModel.toJson())
  }
)

// Read
router.get(
  '/:id',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    const scouterId = req.params.id
    // controller呼び出し
    const controller = container.get(ScouterController)

    const viewModel = await controller.getScouter(scouterId)

    res.json(viewModel.toJson())
  }
)

// Update

// Delete

export default app
