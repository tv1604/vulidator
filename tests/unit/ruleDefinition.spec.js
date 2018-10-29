import { Vulidator } from '@/index'

describe('Vulidator', () => {
  it('rule() - define new rule', () => {
    Vulidator.rule('required', {
      validate: () => true,
      message: {
        required: 'This is nice message should to have',
      },
    })

    expect(Vulidator.hasRule('required')).toBe(true)
  })

  it('rule() - should receive error when object invalid', () => {
    expect(() => {
      Vulidator.rule('required', {
        message: {
          required: 'Solumnary',
        },
      })
    }).toThrow()
  })
})
