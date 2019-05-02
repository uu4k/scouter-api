import * as functions from 'firebase-functions'
import app from './app'

export const scouter = functions.https.onRequest(app)
