import * as express from 'express'
import * as cors from 'cors'
import Router from 'express-promise-router'
import container from './config/ioc-config'
import { ScouterController } from './controllers/scouter-controller'
import * as bodyParser from 'body-parser'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const app = express()
const router = Router()

interface AuthorizedRequest extends functions.https.Request {
  user: admin.auth.DecodedIdToken
}

// https://github.com/firebase/functions-samples/blob/master/authenticated-json-api/functions/index.js
//
// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // GETのみ認証なしでもOK
  if (req.method === 'GET') {
    next()
    return
  }

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    res.status(403).send('Unauthorized')
    return
  }
  const idToken = req.headers.authorization.split('Bearer ')[1]
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken)
    ;(req as AuthorizedRequest).user = decodedIdToken
    next()
    return
  } catch (e) {
    res.status(403).send('Unauthorized')
    return
  }
}

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())
// TODO CORSちゃんと設定する
app.use(cors({ origin: true }))

app.use(authenticate)

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
