import container from '../../src/config/ioc-config'
import * as firebase from '@firebase/testing'
import * as fs from 'fs'

import * as admin from 'firebase-admin'
import { ScouterController } from '../../src/controllers/scouter-controller'

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
  await Promise.all(firebase.apps().map((fbapp: any) => fbapp.delete()))
})

describe('Test Create Scouter', () => {
  test('It shoud return success', async done => {
    const controller: ScouterController = container.get(ScouterController)
    await controller
      .createScouter('alice', 'aaa', 'bbb', [], [])
      .then(async vm => {
        const response = vm.toJson()
        expect(response['author']).toEqual('alice')
        expect(response['title']).toEqual('aaa')
        expect(response['description']).toEqual('bbb')
        expect(response['scoringRules']).toEqual([])
        expect(response['messagingRules']).toEqual([])

        const db = adminApp()
        await db
          .collection('scouters')
          .doc(response['id'])
          .get()
          .then(docSn => {
            expect(docSn.exists).toBe(true)
          })
          .catch(err => {
            throw err
          })
        done()
      })
  })
})

// describe('Test Get Scouter', () => {
//   test('It shoud return success', async done => {
//     const controller: ScouterController = container.get(ScouterController)
//     let scouterId
//     await controller
//       .createScouter('alice', 'aaa', 'bbb', [], [])
//       .then(async vm => {
//         const response = vm.toJson()
//         scouterId = response['id']
//       })
//       .catch(err => {
//         throw err
//       })

//     await controller.getScouter(scouterId).then(async vm => {
//       const response = vm.toJson()
//       expect(response['author']).toEqual('alice')
//       expect(response['title']).toEqual('aaa')
//       expect(response['description']).toEqual('bbb')
//       expect(response['scoringRules']).toEqual([])
//       expect(response['messagingRules']).toEqual([])

//       const db = adminApp()
//       await db
//         .collection('scouters')
//         .doc(response['id'])
//         .get()
//         .then(docSn => {
//           expect(docSn.exists).toBe(true)
//         })
//       done()
//     })
//   })
// })
