import * as nodeMocksHttp from 'node-mocks-http'
import { validate } from '../../src/middlewares/jsonschema'

describe('json schema validate test', () => {
  test('It shoud success', done => {
    const request = nodeMocksHttp.createRequest({
      method: 'POST',
      url: '/',
      body: {
        title: 'aaa',
        description: 'bbb',
        scoringRules: [
          {
            target: 'tweet',
            score: 100,
            oneTimeOnly: true,
            condition: {
              operator: 'contain',
              operand: 'ccc'
            }
          }
        ],
        messagingRules: [
          {
            message: 'message',
            default: true
          }
        ]
      }
    })
    const response = nodeMocksHttp.createResponse()
    const mockNext = jest.fn()
    validate(request, response, mockNext)
    expect(mockNext).toHaveBeenCalled()
    done()
  })
  test('It shoud fail', done => {
    const request = nodeMocksHttp.createRequest({
      method: 'POST',
      url: '/',
      body: {
        title: 'aaa',
        description: 'bbb'
      }
    })
    const response = nodeMocksHttp.createResponse()
    const mockNext = jest.fn()
    validate(request, response, mockNext)
    expect(mockNext).not.toHaveBeenCalled()
    done()
  })
})
