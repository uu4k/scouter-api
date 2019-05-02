import * as express from 'express'
import * as cors from 'cors'
import Router from 'express-promise-router'
import container from './config/ioc-config'
import { ScouterController } from './controllers/scouter-controller'
import * as bodyParser from 'body-parser'

const app = express()
const router = Router()

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

app.use(cors({ origin: true }))
app.use('/', router)

// TODO 認証確認

// Create
router.post('/', async (req: express.Request, res: express.Response) => {
  // controller呼び出し
  const controller = container.get(ScouterController)

  const viewModel = await controller.createScouter(
    req.body.title,
    req.body.description
  )

  res.json(viewModel.toJson())
})

// Read

// Update

// Delete

export default app
