import Scope from '@/scope'

describe('Form Scope', () => {
  const factory = rule => {
    const scope = new Scope({
      rules: {
        email: rule,
      },
    }, null, null)

    scope.ruleResolve()
    return scope
  }

  it('ruleResolver() - transform basic string', () => {
    const scope = factory('required|min')
    expect(scope.form.rules.email).toEqual({
      required: true,
      min: true,
    })
  })

  it('ruleResolver() - transform complex string', () => {
    const scope = factory('required|min:1,2')
    expect(scope.form.rules.email).toEqual({
      required: true,
      min: ['1','2'],
    })
  })

  it('ruleResolver() - transform basic array', () => {
    const scope = factory(['required', 'min'])
    expect(scope.form.rules.email).toEqual({
      required: true,
      min: true,
    })
  })

  it('ruleResolver() - transform complex array', () => {
    const scope = factory(['required', 'min:1,2'])
    expect(scope.form.rules.email).toEqual({
      required: true,
      min: ['1', '2'],
    })
  })
})
