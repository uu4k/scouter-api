import * as request from 'supertest'
import app from '../src/app'
import container from '../src/config/ioc-config'
import * as firebase from '@firebase/testing'
import * as fs from 'fs'

import * as admin from 'firebase-admin'

const projectId = 'firestore-emulator-example'
const rules = fs.readFileSync('../firestore.rules', 'utf8')

const adminApp = () => {
  return firebase.initializeAdminApp({ projectId }).firestore()
}

beforeAll(async () => {
  await firebase.loadFirestoreRules({
    projectId,
    rules: rules
  })
})

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId })
  container.unbind(admin.firestore.Firestore)
  container
    .bind<admin.firestore.Firestore>(admin.firestore.Firestore)
    .toConstantValue(adminApp() as any)
})

afterAll(async () => {
  await Promise.all(firebase.apps().map((app: any) => app.delete()))
})

describe('Test the root path', () => {
  test('It should response the POST method', done => {
    request(app)
      .post('/')
      .send({ title: 'aaa', description: 'bbb' })
      .then(async (response: any) => {
        expect(response.statusCode).toBe(200)

        const db = adminApp()
        await db
          .collection('scouters')
          .get()
          .then(querySnapshot => {
            expect(querySnapshot.docs[0].data().title).toBe('aaa')
          })
        done()
      })
  })
})
