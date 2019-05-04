import * as Ajv from 'ajv'
import { targets, operators } from '../valueobjects/scoring/valueobjects'
import * as express from 'express'

export const validate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const ajv = new Ajv()
  const validateFunc = ajv.compile(ScouterScheema)

  const valid = validateFunc(req.body)

  if (!valid) {
    console.error('Invalid: ' + ajv.errorsText(validateFunc.errors))
    res.status(400).send('Invalid')
    return
  }

  next()
}

const ScouterScheema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  required: ['title', 'description', 'scoringRules', 'messagingRules'],
  properties: {
    title: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    scoringRules: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['target', 'score', 'oneTimeOnly', 'condition'],
        properties: {
          target: {
            type: 'string',
            enum: targets.map(t => t.value)
          },
          score: {
            type: 'number'
          },
          oneTimeOnly: {
            type: 'boolean'
          },
          condition: {
            type: 'object',
            additionalProperties: false,
            required: ['operator', 'operand'],
            properties: {
              operator: {
                type: 'string',
                enum: operators.map(o => o.value)
              },
              operand: {
                type: ['string']
              }
            }
          }
        }
      }
    },
    messagingRules: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['message', 'default'],
        properties: {
          message: {
            type: 'string'
          },
          range: {
            type: 'object',
            additionalProperties: false,
            required: ['min', 'max'],
            properties: {
              min: {
                type: 'number'
              },
              max: {
                type: 'number'
              }
            }
          },
          default: {
            type: 'boolean'
          }
        }
      }
    }
  }
}
