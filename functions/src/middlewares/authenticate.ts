import * as express from 'express'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export interface AuthorizedRequest extends functions.https.Request {
  user: admin.auth.DecodedIdToken
}

// https://github.com/firebase/functions-samples/blob/master/authenticated-json-api/functions/index.js
//
// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
export const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
